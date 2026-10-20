"""
Booking routes: create booking, list bookings, cancel booking.

Critical concurrency protection:
- When confirming a booking, we use a SELECT FOR UPDATE (via with_for_update())
  to lock the show_seat rows before checking status.
- A UNIQUE constraint on (show_id, seat_id) in show_seats provides the
  database-level guarantee against double booking.

Payment simulation:
- This prototype uses simulated payment labeled clearly.
- POST /bookings creates a booking in 'pending' state.
- POST /bookings/{id}/pay simulates the payment outcome.
- Only after payment success does the booking reach 'confirmed'.
"""

import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.user import User
from app.models.theater import Show, ShowSeat, ShowSeatStatus, Screen, Theater
from app.models.booking import Booking, BookingItem, BookingStatus, Payment, PaymentStatus
from app.schemas import (
    BookingCreateRequest, BookingResponse, BookingItemResponse,
    PaymentSimulateRequest,
)
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def _generate_booking_reference(created_at: datetime) -> str:
    """Generate a human-readable reference like ST-261016-0842."""
    date_part = created_at.strftime("%d%m%y")
    random_part = str(uuid.uuid4().int)[:4]
    return f"ST-{date_part}-{random_part}"


def _booking_to_response(booking: Booking, db: Session) -> BookingResponse:
    """Convert a Booking ORM object to BookingResponse, adding show/movie info."""
    # Get show info from first booking item
    movie_title = None
    show_datetime = None
    theater_name = None
    screen_number = None

    if booking.items:
        first_item = booking.items[0]
        show = db.query(Show).options(
            joinedload(Show.screen).joinedload(Screen.theater),
            joinedload(Show.movie),
        ).filter(Show.id == first_item.show_id).first()
        if show:
            movie_title = show.movie.title
            show_datetime = show.show_datetime
            theater_name = show.screen.theater.name
            screen_number = show.screen.screen_number

    items = [
        BookingItemResponse(
            id=item.id,
            seat_label=item.seat_label,
            seat_type=item.seat_type,
            price=item.price,
        )
        for item in booking.items
    ]

    return BookingResponse(
        id=booking.id,
        reference=booking.reference,
        status=booking.status.value,
        ticket_amount=booking.ticket_amount,
        convenience_fee=booking.convenience_fee,
        gst_amount=booking.gst_amount,
        total_amount=booking.total_amount,
        contact_email=booking.contact_email,
        contact_mobile=booking.contact_mobile,
        payment_method=booking.payment_method,
        created_at=booking.created_at,
        items=items,
        movie_title=movie_title,
        show_datetime=show_datetime,
        theater_name=theater_name,
        screen_number=screen_number,
    )


@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(
    payload: BookingCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new booking.

    Steps:
    1. Validate the show exists and is active.
    2. Lock requested show_seat rows (SELECT FOR UPDATE).
    3. Verify all requested seats are available.
    4. Compute total server-side (never trust client prices).
    5. Create Booking + BookingItems.
    6. Mark show_seats as 'locked' (soft lock until payment).
    7. Create a pending Payment record.
    8. Return the booking in 'pending' state.

    The booking remains 'pending' until the client calls POST /bookings/{id}/pay.
    """
    show = db.query(Show).options(
        joinedload(Show.screen).joinedload(Screen.theater),
        joinedload(Show.movie),
    ).filter(Show.id == payload.show_id, Show.is_active == True).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found or no longer active.")

    # Deduplicate seat IDs
    seat_ids = list(dict.fromkeys(payload.seat_ids))

    # Lock the rows for the requested seats (prevents race conditions)
    show_seats = (
        db.query(ShowSeat)
        .filter(ShowSeat.show_id == show.id, ShowSeat.seat_id.in_(seat_ids))
        .with_for_update()
        .all()
    )

    if len(show_seats) != len(seat_ids):
        raise HTTPException(status_code=400, detail="One or more seat IDs are invalid for this show.")

    # Check availability (treat expired locks as available)
    now = datetime.now(timezone.utc)
    unavailable = []
    for ss in show_seats:
        effective_status = ss.status
        if ss.status == ShowSeatStatus.locked and ss.locked_until and now > ss.locked_until:
            effective_status = ShowSeatStatus.available
        if effective_status != ShowSeatStatus.available:
            unavailable.append(ss.seat_id)

    if unavailable:
        raise HTTPException(
            status_code=409,
            detail=f"Seats are no longer available. Please re-select your seats.",
        )

    # ── Server-side pricing ───────────────────────────────────────
    ticket_amount = 0.0
    seat_price_map: dict[str, tuple] = {}   # seat_id → (price, seat_type)

    for ss in show_seats:
        seat = ss.seat  # loaded via relationship
        price = ss.price
        ticket_amount += price
        seat_price_map[ss.seat_id] = (price, seat.seat_type.value, seat.seat_label)

    convenience_fee = show.convenience_fee
    gst_amount = round(convenience_fee * show.gst_rate, 2)
    total_amount = round(ticket_amount + convenience_fee + gst_amount, 2)

    # ── Create Booking ────────────────────────────────────────────
    now_utc = datetime.now(timezone.utc)
    booking_id = str(uuid.uuid4())
    reference = _generate_booking_reference(now_utc)

    booking = Booking(
        id=booking_id,
        reference=reference,
        user_id=current_user.id,
        status=BookingStatus.pending,
        ticket_amount=ticket_amount,
        convenience_fee=convenience_fee,
        gst_amount=gst_amount,
        total_amount=total_amount,
        contact_email=payload.contact_email,
        contact_mobile=payload.contact_mobile,
        payment_method=payload.payment_method,
        upi_id=payload.upi_id,
    )
    db.add(booking)

    # ── Create BookingItems ───────────────────────────────────────
    for seat_id in seat_ids:
        price, seat_type, seat_label = seat_price_map[seat_id]
        item = BookingItem(
            booking_id=booking_id,
            show_id=show.id,
            seat_id=seat_id,
            seat_label=seat_label,
            seat_type=seat_type,
            price=price,
        )
        db.add(item)

    # ── Soft-lock the seats (10-minute hold) ─────────────────────
    lock_until = now_utc + timedelta(minutes=10)
    for ss in show_seats:
        ss.status = ShowSeatStatus.locked
        ss.locked_until = lock_until

    # ── Create pending Payment record ────────────────────────────
    payment = Payment(
        booking_id=booking_id,
        amount=total_amount,
        status=PaymentStatus.pending,
        is_simulated=True,
    )
    db.add(payment)

    try:
        db.commit()
        db.refresh(booking)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Booking failed: one or more seats were already reserved. Please re-select.",
        )

    return _booking_to_response(booking, db)


@router.post("/{booking_id}/pay", response_model=BookingResponse)
def simulate_payment(
    booking_id: str,
    payload: PaymentSimulateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Simulated payment endpoint for the academic prototype.
    LABEL: This is a demonstration payment — no real money changes hands.

    Outcomes:
    - simulate_outcome='success' → booking confirmed, seats marked booked.
    - simulate_outcome='failure' → payment failed, seats released.
    """
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id, Booking.user_id == current_user.id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if booking.status != BookingStatus.pending:
        raise HTTPException(status_code=409, detail=f"Booking is already in '{booking.status.value}' state.")

    payment = booking.payment
    if not payment:
        raise HTTPException(status_code=500, detail="Payment record missing.")

    now = datetime.now(timezone.utc)

    if payload.simulate_outcome == "success":
        # Confirm booking: mark seats as booked
        booking.status = BookingStatus.confirmed
        payment.status = PaymentStatus.success
        payment.gateway_payment_id = f"SIM-{uuid.uuid4().hex[:8].upper()}"

        # Update show_seats to booked
        items = booking.items
        seat_ids = [item.seat_id for item in items]
        show_id = items[0].show_id if items else None
        if show_id:
            show_seats = db.query(ShowSeat).filter(
                ShowSeat.show_id == show_id,
                ShowSeat.seat_id.in_(seat_ids),
            ).all()
            for ss in show_seats:
                ss.status = ShowSeatStatus.booked
                ss.locked_until = None
                ss.booked_by_booking_id = booking_id

    else:  # failure
        booking.status = BookingStatus.cancelled
        payment.status = PaymentStatus.failed
        payment.failure_reason = "Simulated payment failure (demonstration)"
        booking.cancelled_at = now

        # Release locked seats back to available
        items = booking.items
        seat_ids = [item.seat_id for item in items]
        show_id = items[0].show_id if items else None
        if show_id:
            show_seats = db.query(ShowSeat).filter(
                ShowSeat.show_id == show_id,
                ShowSeat.seat_id.in_(seat_ids),
            ).all()
            for ss in show_seats:
                ss.status = ShowSeatStatus.available
                ss.locked_until = None

    db.commit()
    db.refresh(booking)
    return _booking_to_response(booking, db)


@router.get("", response_model=List[BookingResponse])
def list_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all bookings for the currently authenticated customer."""
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .options(joinedload(Booking.items))
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [_booking_to_response(b, db) for b in bookings]


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific booking by ID (customer can only see their own)."""
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id, Booking.user_id == current_user.id)
        .options(joinedload(Booking.items))
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return _booking_to_response(booking, db)


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Cancel a confirmed booking.
    Refund eligibility is based on the cancellation cutoff hours from the show time.
    """
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id, Booking.user_id == current_user.id)
        .options(joinedload(Booking.items))
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if booking.status not in (BookingStatus.pending, BookingStatus.confirmed):
        raise HTTPException(status_code=409, detail=f"Cannot cancel a booking with status '{booking.status.value}'.")

    # Check cancellation window
    if booking.items:
        show = db.query(Show).filter(Show.id == booking.items[0].show_id).first()
        if show:
            cutoff = show.show_datetime - timedelta(hours=show.cancellation_cutoff_hours)
            if datetime.now(timezone.utc) > cutoff:
                raise HTTPException(
                    status_code=409,
                    detail=f"Cancellation window has closed. Cancellations must be made at least {show.cancellation_cutoff_hours} hours before the show.",
                )

    # Release seats
    seat_ids = [item.seat_id for item in booking.items]
    show_id = booking.items[0].show_id if booking.items else None
    if show_id and seat_ids:
        db.query(ShowSeat).filter(
            ShowSeat.show_id == show_id,
            ShowSeat.seat_id.in_(seat_ids),
        ).update(
            {ShowSeat.status: ShowSeatStatus.available, ShowSeat.locked_until: None, ShowSeat.booked_by_booking_id: None},
            synchronize_session=False,
        )

    booking.status = BookingStatus.cancelled
    booking.cancelled_at = datetime.now(timezone.utc)

    # Mark payment as refunded (simulated)
    if booking.payment and booking.payment.status == PaymentStatus.success:
        booking.payment.status = PaymentStatus.refunded
        booking.payment.refund_amount = booking.ticket_amount  # convenience fee not refunded
        booking.payment.refunded_at = datetime.now(timezone.utc)
        booking.status = BookingStatus.refunded

    db.commit()
    db.refresh(booking)
    return _booking_to_response(booking, db)
