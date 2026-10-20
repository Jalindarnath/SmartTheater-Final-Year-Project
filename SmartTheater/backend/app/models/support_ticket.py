"""
SupportTicket and TicketActivity models.

SupportTicket — stores customer support requests with ML-predicted category,
deterministic routing (priority + department), and staff assignment.

TicketActivity — audit trail of every status change, assignment, or staff reply.

Key distinction:
  predicted_category  → set by ML model (TF-IDF + Logistic Regression)
  confirmed_category  → set by human staff review (may differ from prediction)
  priority            → set by deterministic routing rules (not ML)
  assigned_department → set by routing rules, overridable by staff
"""

import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Float, DateTime, ForeignKey,
    Enum as SAEnum, Text, Boolean
)
from sqlalchemy.orm import relationship

from app.db.session import Base


class TicketCategory(str, enum.Enum):
    booking = "Booking"
    payment = "Payment"
    refund = "Refund"
    seating = "Seating"
    technical = "Technical Issues"
    discounts = "Discounts"


class TicketPriority(str, enum.Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class TicketStatus(str, enum.Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"
    closed = "Closed"


class TicketSentiment(str, enum.Enum):
    positive = "Positive"
    neutral = "Neutral"
    negative = "Negative"


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # Human-readable reference like "ST-1048"
    reference = Column(String(20), unique=True, nullable=False, index=True)

    # Customer who submitted
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=True)   # nullable for guests
    customer_email = Column(String(255), nullable=True)
    customer_name = Column(String(120), nullable=True)

    # Ticket content
    subject = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    related_booking_ref = Column(String(30), nullable=True)

    # ML prediction fields (set by ticket_service after submission)
    predicted_category = Column(SAEnum(TicketCategory), nullable=True)
    prediction_confidence = Column(Float, nullable=True)   # 0.0 – 1.0
    confirmed_category = Column(SAEnum(TicketCategory), nullable=True)   # set by staff review
    ai_summary = Column(Text, nullable=True)               # Gemini or rule-based summary
    sentiment = Column(SAEnum(TicketSentiment), nullable=True)

    # Routing (deterministic rules — separate from ML)
    priority = Column(SAEnum(TicketPriority), nullable=False, default=TicketPriority.medium)
    assigned_department = Column(String(100), nullable=True)
    escalation_reason = Column(String(300), nullable=True)

    # Staff assignment
    assigned_staff_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    is_ai_reviewed = Column(Boolean, default=False)   # True once staff has reviewed AI triage

    # Status
    status = Column(SAEnum(TicketStatus), nullable=False, default=TicketStatus.open)
    staff_response = Column(Text, nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    first_response_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    customer = relationship("User", back_populates="support_tickets", foreign_keys=[customer_id])
    assigned_staff = relationship("User", back_populates="assigned_tickets",
                                  foreign_keys=[assigned_staff_id])
    activities = relationship("TicketActivity", back_populates="ticket",
                              cascade="all, delete-orphan", order_by="TicketActivity.created_at")


class TicketActivity(Base):
    """
    Audit trail for support ticket changes.
    Records every status change, assignment, category correction, and staff reply.
    """
    __tablename__ = "ticket_activities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(36), ForeignKey("support_tickets.id"), nullable=False)
    actor_id = Column(String(36), ForeignKey("users.id"), nullable=True)   # None for system events
    actor_name = Column(String(120), nullable=True)
    action = Column(String(100), nullable=False)         # "status_changed" | "assigned" | "replied"
    old_value = Column(String(300), nullable=True)
    new_value = Column(String(300), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    ticket = relationship("SupportTicket", back_populates="activities")
