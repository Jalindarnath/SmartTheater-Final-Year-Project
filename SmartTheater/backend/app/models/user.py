"""
User model — stores customers, theater staff, and admins.
Role determines access level: customer | staff | admin
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
import enum

from app.db.session import Base


class UserRole(str, enum.Enum):
    customer = "customer"
    staff = "staff"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    mobile = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.customer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    bookings = relationship("Booking", back_populates="user", lazy="dynamic")
    support_tickets = relationship("SupportTicket", back_populates="customer", lazy="dynamic",
                                   foreign_keys="SupportTicket.customer_id")
    assigned_tickets = relationship("SupportTicket", back_populates="assigned_staff", lazy="dynamic",
                                    foreign_keys="SupportTicket.assigned_staff_id")
