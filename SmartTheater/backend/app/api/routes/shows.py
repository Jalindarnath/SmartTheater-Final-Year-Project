"""
Show/seat routes: seat availability for a show.
These are the endpoints used by the seat selection screen.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.theater import Show, ShowSeat, ShowSeatStatus, Seat
from app.schemas import SeatResponse

router = APIRouter(prefix="/shows", tags=["Shows & Seats"])


@router.get("/{show_id}/seats", response_model=List[SeatResponse])
def get_show_seats(show_id: str, db: Session = Depends(get_db)):
    """
    Return all seats for a show with their current status (available/booked/locked).
    This is what populates the seat-selection grid on the frontend.
    """
    show = db.query(Show).filter(Show.id == show_id, Show.is_active == True).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found.")

    show_seats = (
        db.query(ShowSeat)
        .options(joinedload(ShowSeat.seat))
        .filter(ShowSeat.show_id == show_id)
        .all()
    )

    results = []
    for ss in show_seats:
        seat: Seat = ss.seat
        # Treat expired locks as available
        from datetime import datetime, timezone
        effective_status = ss.status
        if ss.status == ShowSeatStatus.locked and ss.locked_until:
            if datetime.now(timezone.utc) > ss.locked_until:
                effective_status = ShowSeatStatus.available

        results.append(SeatResponse(
            id=seat.id,
            seat_label=seat.seat_label,
            row_label=seat.row_label,
            col_number=seat.col_number,
            seat_type=seat.seat_type.value,
            is_accessible=seat.is_accessible,
            status=effective_status.value,
            price=ss.price,
        ))

    # Sort by row then column for consistent grid rendering
    results.sort(key=lambda s: (s.row_label, s.col_number))
    return results
