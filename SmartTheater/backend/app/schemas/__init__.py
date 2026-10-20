"""
Pydantic schemas for request validation and response serialization.

Schemas are grouped by domain. Each domain has:
  Base     – shared fields
  Create   – fields accepted on POST (input)
  Update   – fields accepted on PATCH (partial update)
  Response – fields returned in API responses (output)

Sensitive fields (passwords, raw card data) are NEVER included in response schemas.
"""

from __future__ import annotations
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


# ══════════════════════════════════════════════════════════════
# AUTH / USER
# ══════════════════════════════════════════════════════════════

class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    mobile: Optional[str] = Field(None, pattern=r'^\+?\d{7,15}$')
    password: str = Field(..., min_length=8)
    role: Optional[str] = "customer"   # Only "customer" allowed via public endpoint


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    full_name: str
    email: str
    role: str


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    mobile: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════
# MOVIES
# ══════════════════════════════════════════════════════════════

class MovieResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    genre: Optional[str]
    language: str
    duration_minutes: int
    rating: Optional[float]
    rating_count: Optional[int]
    certification: Optional[str]
    director: Optional[str]
    cast: Optional[str]
    format: Optional[str]
    poster_url: Optional[str]
    trailer_url: Optional[str]
    is_active: bool
    critics_choice: bool

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════
# THEATERS & SHOWS
# ══════════════════════════════════════════════════════════════

class TheaterResponse(BaseModel):
    id: str
    name: str
    location: str
    distance_km: Optional[float]

    model_config = {"from_attributes": True}


class ScreenResponse(BaseModel):
    id: str
    screen_number: int
    screen_format: Optional[str]
    theater: TheaterResponse

    model_config = {"from_attributes": True}


class ShowResponse(BaseModel):
    id: str
    movie_id: str
    screen_id: str
    show_datetime: datetime
    standard_price: float
    premium_price: float
    convenience_fee: float
    gst_rate: float
    cancellation_cutoff_hours: int
    language: Optional[str]
    screen: ScreenResponse
    available_seats: Optional[int] = None   # populated by query

    model_config = {"from_attributes": True}


class SeatResponse(BaseModel):
    id: str
    seat_label: str
    row_label: str
    col_number: int
    seat_type: str
    is_accessible: bool
    status: str         # available | booked | locked
    price: float

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════
# BOOKINGS
# ══════════════════════════════════════════════════════════════

class BookingItemRequest(BaseModel):
    seat_id: str

class BookingCreateRequest(BaseModel):
    show_id: str
    seat_ids: List[str] = Field(..., min_length=1, max_length=10)
    contact_email: EmailStr
    contact_mobile: Optional[str] = Field(None, pattern=r'^\+?\d{7,15}$')
    payment_method: str = Field(..., pattern=r'^(upi|card|netbanking|simulated)$')
    upi_id: Optional[str] = None


class BookingItemResponse(BaseModel):
    id: str
    seat_label: str
    seat_type: str
    price: float

    model_config = {"from_attributes": True}


class BookingResponse(BaseModel):
    id: str
    reference: str
    status: str
    ticket_amount: float
    convenience_fee: float
    gst_amount: float
    total_amount: float
    contact_email: str
    contact_mobile: Optional[str]
    payment_method: Optional[str]
    created_at: datetime
    items: List[BookingItemResponse]
    movie_title: Optional[str] = None
    show_datetime: Optional[datetime] = None
    theater_name: Optional[str] = None
    screen_number: Optional[int] = None

    model_config = {"from_attributes": True}


class PaymentSimulateRequest(BaseModel):
    booking_id: str
    simulate_outcome: str = Field("success", pattern=r'^(success|failure)$')


# ══════════════════════════════════════════════════════════════
# SUPPORT TICKETS
# ══════════════════════════════════════════════════════════════

class TicketCreateRequest(BaseModel):
    subject: str = Field(..., min_length=5, max_length=300)
    description: str = Field(..., min_length=10, max_length=5000)
    related_booking_ref: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None


class TicketActivityResponse(BaseModel):
    id: str
    action: str
    actor_name: Optional[str]
    old_value: Optional[str]
    new_value: Optional[str]
    note: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class TicketResponse(BaseModel):
    id: str
    reference: str
    subject: str
    description: str
    related_booking_ref: Optional[str]
    customer_name: Optional[str]
    customer_email: Optional[str]
    predicted_category: Optional[str]
    prediction_confidence: Optional[float]
    confirmed_category: Optional[str]
    ai_summary: Optional[str]
    sentiment: Optional[str]
    priority: str
    assigned_department: Optional[str]
    escalation_reason: Optional[str]
    assigned_staff_id: Optional[str]
    assigned_staff_name: Optional[str] = None
    is_ai_reviewed: bool
    status: str
    staff_response: Optional[str]
    resolved_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    activities: List[TicketActivityResponse] = []

    model_config = {"from_attributes": True}


class TicketListResponse(BaseModel):
    id: str
    reference: str
    subject: str
    predicted_category: Optional[str]
    confirmed_category: Optional[str]
    priority: str
    assigned_department: Optional[str]
    status: str
    sentiment: Optional[str]
    prediction_confidence: Optional[float]
    customer_name: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TicketUpdateRequest(BaseModel):
    """Staff-only: update category, priority, department, status, or add response."""
    confirmed_category: Optional[str] = None
    priority: Optional[str] = None
    assigned_department: Optional[str] = None
    assigned_staff_id: Optional[str] = None
    status: Optional[str] = None
    staff_response: Optional[str] = None
    is_ai_reviewed: Optional[bool] = None
    note: Optional[str] = None   # internal note for activity log


# ══════════════════════════════════════════════════════════════
# ANALYTICS
# ══════════════════════════════════════════════════════════════

class AdminAnalyticsResponse(BaseModel):
    total_bookings: int
    net_revenue: float
    average_occupancy: float
    open_support_tickets: int
    high_priority_tickets: int
    ai_triage_accuracy: Optional[float]  # None if not enough human confirmations
    booking_trend: List[dict]            # [{"date": "2026-10-10", "bookings": 45, "revenue": 28000}]
    category_distribution: List[dict]    # [{"category": "Payment", "count": 42, "percent": 42.0}]
    movie_stats: List[dict]              # per-movie bookings + revenue + occupancy
    sentiment_distribution: dict         # {"Positive": 15, "Neutral": 31, "Negative": 54}
