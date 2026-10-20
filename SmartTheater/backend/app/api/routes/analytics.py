"""Admin analytics route — calculates metrics from real database records."""

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.db.session import get_db
from app.models.booking import Booking, BookingStatus, Payment, PaymentStatus
from app.models.movie import Movie
from app.models.theater import Show, ShowSeat, ShowSeatStatus, Screen
from app.models.support_ticket import SupportTicket, TicketStatus, TicketPriority, TicketSentiment
from app.schemas import AdminAnalyticsResponse
from app.api.dependencies import require_staff

router = APIRouter(prefix="/admin", tags=["Admin Analytics"])


@router.get("/analytics", response_model=AdminAnalyticsResponse)
def get_analytics(
    days: int = 7,
    current_user=Depends(require_staff),
    db: Session = Depends(get_db),
):
    """
    Return platform analytics computed from real database records.
    Only confirmed bookings with successful payments are counted as revenue.
    """
    now = datetime.now(timezone.utc)
    start = now - timedelta(days=days)

    # ── Bookings ──────────────────────────────────────────────────
    total_bookings = (
        db.query(func.count(Booking.id))
        .filter(Booking.status == BookingStatus.confirmed)
        .scalar() or 0
    )

    net_revenue = (
        db.query(func.sum(Booking.ticket_amount))
        .join(Payment, Payment.booking_id == Booking.id)
        .filter(
            Booking.status == BookingStatus.confirmed,
            Payment.status == PaymentStatus.success,
        )
        .scalar() or 0.0
    )

    # ── Occupancy ─────────────────────────────────────────────────
    total_seats = db.query(func.count(ShowSeat.id)).scalar() or 1
    booked_seats = (
        db.query(func.count(ShowSeat.id))
        .filter(ShowSeat.status == ShowSeatStatus.booked)
        .scalar() or 0
    )
    average_occupancy = round((booked_seats / total_seats) * 100, 1) if total_seats > 0 else 0.0

    # ── Support tickets ───────────────────────────────────────────
    open_tickets = (
        db.query(func.count(SupportTicket.id))
        .filter(SupportTicket.status.in_([TicketStatus.open.value, TicketStatus.in_progress.value]))
        .scalar() or 0
    )
    high_priority = (
        db.query(func.count(SupportTicket.id))
        .filter(
            SupportTicket.priority.in_([TicketPriority.high.value, TicketPriority.critical.value]),
            SupportTicket.status != TicketStatus.closed.value,
        )
        .scalar() or 0
    )

    # ── AI triage accuracy (tickets where staff confirmed category == predicted) ──
    reviewed = (
        db.query(func.count(SupportTicket.id))
        .filter(SupportTicket.confirmed_category.isnot(None))
        .scalar() or 0
    )
    matching = (
        db.query(func.count(SupportTicket.id))
        .filter(
            SupportTicket.confirmed_category.isnot(None),
            SupportTicket.confirmed_category == SupportTicket.predicted_category,
        )
        .scalar() or 0
    )
    ai_accuracy = round((matching / reviewed) * 100, 1) if reviewed >= 5 else None

    # ── Booking trend (last N days) ───────────────────────────────
    booking_trend = []
    for i in range(days):
        day = start + timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        day_bookings = (
            db.query(func.count(Booking.id))
            .filter(Booking.status == BookingStatus.confirmed,
                    Booking.created_at >= day_start, Booking.created_at < day_end)
            .scalar() or 0
        )
        day_revenue = (
            db.query(func.sum(Booking.ticket_amount))
            .join(Payment, Payment.booking_id == Booking.id)
            .filter(
                Booking.status == BookingStatus.confirmed,
                Payment.status == PaymentStatus.success,
                Booking.created_at >= day_start, Booking.created_at < day_end,
            )
            .scalar() or 0.0
        )
        booking_trend.append({
            "date": day_start.strftime("%d %b"),
            "bookings": day_bookings,
            "revenue": round(day_revenue, 2),
        })

    # ── Category distribution ─────────────────────────────────────
    total_tickets = db.query(func.count(SupportTicket.id)).scalar() or 1
    cat_rows = (
        db.query(SupportTicket.predicted_category, func.count(SupportTicket.id))
        .filter(SupportTicket.predicted_category.isnot(None))
        .group_by(SupportTicket.predicted_category)
        .all()
    )
    category_distribution = [
        {
            "category": row[0].value if row[0] else "Unknown",
            "count": row[1],
            "percent": round((row[1] / total_tickets) * 100, 1),
        }
        for row in cat_rows
    ]

    # ── Movie stats ───────────────────────────────────────────────
    from app.models.booking import BookingItem
    movie_rows = (
        db.query(Movie, func.count(Booking.id), func.sum(Booking.ticket_amount))
        .join(Show, Show.movie_id == Movie.id)
        .join(Screen, Screen.id == Show.screen_id)
        .join(BookingItem, BookingItem.show_id == Show.id)
        .join(Booking, Booking.id == BookingItem.booking_id)
        .filter(Booking.status == BookingStatus.confirmed)
        .group_by(Movie.id)
        .all()
    )
    movie_stats = []
    for movie, count, revenue in movie_rows:
        # Compute occupancy for this movie
        m_total = (
            db.query(func.count(ShowSeat.id))
            .join(Show, Show.id == ShowSeat.show_id)
            .filter(Show.movie_id == movie.id)
            .scalar() or 1
        )
        m_booked = (
            db.query(func.count(ShowSeat.id))
            .join(Show, Show.id == ShowSeat.show_id)
            .filter(Show.movie_id == movie.id, ShowSeat.status == ShowSeatStatus.booked)
            .scalar() or 0
        )
        movie_stats.append({
            "movie_id": movie.id,
            "title": movie.title,
            "format": movie.format,
            "bookings": count,
            "net_revenue": round(revenue or 0, 2),
            "occupancy": round((m_booked / m_total) * 100, 1),
            "status": "Now showing",
        })

    # ── Sentiment distribution ────────────────────────────────────
    sent_rows = (
        db.query(SupportTicket.sentiment, func.count(SupportTicket.id))
        .filter(SupportTicket.sentiment.isnot(None))
        .group_by(SupportTicket.sentiment)
        .all()
    )
    sentiment_distribution = {
        row[0].value: row[1] for row in sent_rows if row[0]
    }

    return AdminAnalyticsResponse(
        total_bookings=total_bookings,
        net_revenue=round(float(net_revenue), 2),
        average_occupancy=average_occupancy,
        open_support_tickets=open_tickets,
        high_priority_tickets=high_priority,
        ai_triage_accuracy=ai_accuracy,
        booking_trend=booking_trend,
        category_distribution=category_distribution,
        movie_stats=movie_stats,
        sentiment_distribution=sentiment_distribution,
    )
