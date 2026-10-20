"""
Import all models here so SQLAlchemy knows about them when creating tables.
This file is the single source of truth for the ORM registry.
"""

from app.db.session import Base  # noqa: F401

# Import every model so Base.metadata is populated
from app.models.user import User, UserRole  # noqa: F401
from app.models.movie import Movie  # noqa: F401
from app.models.theater import (  # noqa: F401
    Theater, Screen, Seat, SeatType, Show,
    ShowSeat, ShowSeatStatus,
)
from app.models.booking import (  # noqa: F401
    Booking, BookingItem, BookingStatus,
    Payment, PaymentStatus,
)
from app.models.support_ticket import (  # noqa: F401
    SupportTicket, TicketActivity,
    TicketCategory, TicketPriority, TicketStatus, TicketSentiment,
)
