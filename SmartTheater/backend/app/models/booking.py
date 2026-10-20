"""
Booking and BookingItem models.

Booking — one record per customer booking session (can include multiple seats).
BookingItem — one record per seat in a booking.
Payment — linked 1:1 with a booking; records payment state.

Business rules enforced here:
- Booking total is computed server-side; never trusted from the client.
- Seat reservation uses ShowSeat.status with a DB unique constraint.
- Payment must be confirmed before booking reaches 'confirmed' status.
"""

import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Enum as SAEnum, Text
)
from sqlalchemy.orm import relationship

from app.db.session import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"           # seats held, payment not yet completed
    confirmed = "confirmed"       # payment successful
    cancelled = "cancelled"       # customer or staff cancelled
    refunded = "refunded"         # refund issued


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # Human-readable reference like "ST-261016-0842"
    reference = Column(String(30), unique=True, nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(SAEnum(BookingStatus), nullable=False, default=BookingStatus.pending)

    # Financial totals (computed by backend, never trusted from client)
    ticket_amount = Column(Float, nullable=False)        # sum of seat prices
    convenience_fee = Column(Float, nullable=False)      # flat booking fee
    gst_amount = Column(Float, nullable=False)           # GST on convenience fee
    total_amount = Column(Float, nullable=False)         # ticket_amount + fee + gst

    # Customer contact for ticket delivery
    contact_email = Column(String(255), nullable=False)
    contact_mobile = Column(String(20), nullable=True)

    # Payment method info (no card numbers ever stored)
    payment_method = Column(String(50), nullable=True)   # "upi" | "card" | "netbanking"
    upi_id = Column(String(100), nullable=True)          # masked UPI VPA

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="bookings")
    items = relationship("BookingItem", back_populates="booking", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="booking", uselist=False, cascade="all, delete-orphan")


class BookingItem(Base):
    """One row per seat in a booking."""
    __tablename__ = "booking_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("bookings.id"), nullable=False)
    show_id = Column(String(36), ForeignKey("shows.id"), nullable=False)
    seat_id = Column(String(36), ForeignKey("seats.id"), nullable=False)
    seat_label = Column(String(10), nullable=False)      # denormalized for display ("H7")
    seat_type = Column(String(20), nullable=False)       # denormalized ("premium")
    price = Column(Float, nullable=False)                # price at time of booking

    booking = relationship("Booking", back_populates="items")
    show = relationship("Show", back_populates="booking_items")
    seat = relationship("Seat")


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    success = "success"
    failed = "failed"
    refunded = "refunded"


class Payment(Base):
    """
    Payment record linked 1:1 with a booking.
    For the academic prototype this uses simulated payment.
    Never store card numbers, CVVs, or sensitive credentials here.
    """
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String(36), ForeignKey("bookings.id"), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), nullable=False, default="INR")
    status = Column(SAEnum(PaymentStatus), nullable=False, default=PaymentStatus.pending)
    # Provider transaction ID (Razorpay order_id in real integration)
    gateway_order_id = Column(String(100), nullable=True)
    gateway_payment_id = Column(String(100), nullable=True)
    is_simulated = Column(Boolean, default=True)         # True = demo/academic prototype
    failure_reason = Column(String(255), nullable=True)
    refund_amount = Column(Float, nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    booking = relationship("Booking", back_populates="payment")
