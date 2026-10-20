"""
Theater, Screen, Seat, and Show models.

Theater → has many Screens → each Screen has many Seats
Show → links a Movie to a Screen at a specific date/time
ShowSeat → tracks per-show seat availability and pricing
"""

import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Enum as SAEnum, UniqueConstraint, Text
)
from sqlalchemy.orm import relationship

from app.db.session import Base


class Theater(Base):
    __tablename__ = "theaters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)           # e.g., "Cinepolis · Nexus Shantiniketan"
    location = Column(String(200), nullable=False)       # e.g., "Whitefield, Bengaluru"
    distance_km = Column(Float, nullable=True)           # from city center or user reference
    is_active = Column(Boolean, default=True)

    screens = relationship("Screen", back_populates="theater", lazy="dynamic")


class SeatType(str, enum.Enum):
    standard = "standard"
    premium = "premium"
    recliner = "recliner"


class Screen(Base):
    __tablename__ = "screens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    theater_id = Column(String(36), ForeignKey("theaters.id"), nullable=False)
    screen_number = Column(Integer, nullable=False)      # e.g., 3
    screen_format = Column(String(50), nullable=True)    # IMAX | Dolby Atmos | 2D
    total_rows = Column(Integer, nullable=False, default=10)
    total_cols = Column(Integer, nullable=False, default=12)

    theater = relationship("Theater", back_populates="screens")
    seats = relationship("Seat", back_populates="screen", lazy="dynamic")
    shows = relationship("Show", back_populates="screen", lazy="dynamic")


class Seat(Base):
    """Physical seat definition for a screen. Shared across all shows."""
    __tablename__ = "seats"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    screen_id = Column(String(36), ForeignKey("screens.id"), nullable=False)
    row_label = Column(String(5), nullable=False)        # e.g., "H"
    col_number = Column(Integer, nullable=False)         # e.g., 7
    seat_label = Column(String(10), nullable=False)      # e.g., "H7"
    seat_type = Column(SAEnum(SeatType), nullable=False, default=SeatType.standard)
    is_accessible = Column(Boolean, default=False)       # wheelchair-accessible seat

    screen = relationship("Screen", back_populates="seats")

    __table_args__ = (
        UniqueConstraint("screen_id", "row_label", "col_number", name="uq_seat_position"),
    )


class Show(Base):
    """A scheduled screening of a movie on a specific screen."""
    __tablename__ = "shows"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    movie_id = Column(String(36), ForeignKey("movies.id"), nullable=False)
    screen_id = Column(String(36), ForeignKey("screens.id"), nullable=False)
    show_datetime = Column(DateTime(timezone=True), nullable=False, index=True)
    standard_price = Column(Float, nullable=False, default=220.0)    # INR
    premium_price = Column(Float, nullable=False, default=320.0)     # INR
    convenience_fee = Column(Float, nullable=False, default=40.0)    # INR flat per booking
    gst_rate = Column(Float, nullable=False, default=0.18)           # 18% on convenience fee
    cancellation_cutoff_hours = Column(Integer, default=2)           # cancel up to 2h before show
    is_active = Column(Boolean, default=True)
    language = Column(String(50), nullable=True)                     # override movie language
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    movie = relationship("Movie", back_populates="shows")
    screen = relationship("Screen", back_populates="shows")
    show_seats = relationship("ShowSeat", back_populates="show", lazy="dynamic")
    booking_items = relationship("BookingItem", back_populates="show", lazy="dynamic")


class ShowSeatStatus(str, enum.Enum):
    available = "available"
    booked = "booked"
    locked = "locked"          # temporarily locked during checkout
    blocked = "blocked"        # blocked by theater management


class ShowSeat(Base):
    """
    Per-show seat availability record.
    One row per (show, seat) pair.
    The UNIQUE constraint prevents double-booking at the database level.
    """
    __tablename__ = "show_seats"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    show_id = Column(String(36), ForeignKey("shows.id"), nullable=False)
    seat_id = Column(String(36), ForeignKey("seats.id"), nullable=False)
    status = Column(SAEnum(ShowSeatStatus), nullable=False, default=ShowSeatStatus.available)
    locked_until = Column(DateTime(timezone=True), nullable=True)    # for Redis-less soft locking
    booked_by_booking_id = Column(String(36), ForeignKey("bookings.id"), nullable=True)
    price = Column(Float, nullable=False)                            # actual price for this seat/show

    show = relationship("Show", back_populates="show_seats")
    seat = relationship("Seat")
    booking = relationship("Booking", foreign_keys=[booked_by_booking_id])

    __table_args__ = (
        # DATABASE-LEVEL constraint: same seat cannot be sold twice for same show
        UniqueConstraint("show_id", "seat_id", name="uq_show_seat"),
    )
