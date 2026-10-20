"""
Support ticket routes: customer submission + staff management.

Public (authenticated customer):
  POST /support-tickets          – submit a ticket, triggers ML prediction
  GET  /support-tickets          – view own ticket history
  GET  /support-tickets/{id}     – view ticket detail

Staff/Admin only:
  GET  /support-tickets/all      – view all tickets (staff queue)
  PATCH /support-tickets/{id}    – update status, category, assignment, response
"""

import uuid
import re
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.support_ticket import (
    SupportTicket, TicketActivity, TicketCategory, TicketStatus,
    TicketPriority, TicketSentiment,
)
from app.schemas import (
    TicketCreateRequest, TicketResponse, TicketListResponse, TicketUpdateRequest,
)
from app.api.dependencies import get_current_user, get_optional_user, require_staff
from app.ml import predict as ml_predict
from app.services.routing_service import determine_routing

router = APIRouter(prefix="/support-tickets", tags=["Support Tickets"])

# Allowed status transitions: current → [allowed next statuses]
VALID_TRANSITIONS: dict[str, list[str]] = {
    TicketStatus.open.value:        [TicketStatus.in_progress.value, TicketStatus.closed.value],
    TicketStatus.in_progress.value: [TicketStatus.resolved.value, TicketStatus.open.value],
    TicketStatus.resolved.value:    [TicketStatus.closed.value, TicketStatus.open.value],
    TicketStatus.closed.value:      [TicketStatus.open.value],
}


def _generate_ticket_reference(db: Session) -> str:
    """Generate sequential references like ST-1048."""
    last = db.query(SupportTicket).order_by(SupportTicket.created_at.desc()).first()
    if last and last.reference and last.reference.startswith("ST-"):
        try:
            num = int(last.reference.split("-")[1]) + 1
        except (IndexError, ValueError):
            num = 1000
    else:
        num = 1000
    return f"ST-{num}"


def _simple_sentiment(text: str) -> str:
    """
    Rule-based sentiment detection (fallback when Gemini is unavailable).
    Not an ML model — just keyword heuristics for demonstration.
    """
    text_lower = text.lower()
    negative_kw = ["frustrated", "angry", "terrible", "unacceptable", "refund", "charged twice",
                   "not working", "failed", "never received", "missing", "wrong", "broken",
                   "stuck", "problem", "issue", "error", "cannot", "can't"]
    positive_kw = ["thank", "great", "excellent", "love", "amazing", "helpful", "satisfied",
                   "perfect", "fantastic", "wonderful"]

    neg_score = sum(1 for kw in negative_kw if kw in text_lower)
    pos_score = sum(1 for kw in positive_kw if kw in text_lower)

    if neg_score > pos_score:
        return TicketSentiment.negative.value
    elif pos_score > neg_score:
        return TicketSentiment.positive.value
    return TicketSentiment.neutral.value


def _build_ai_summary(subject: str, description: str, category: str) -> str:
    """Build a brief summary string. In a real deployment Gemini would do this."""
    # Truncate description to first 2 sentences for summary
    sentences = re.split(r'(?<=[.!?])\s+', description.strip())
    summary_sentences = sentences[:2]
    summary = " ".join(summary_sentences)
    if len(summary) > 200:
        summary = summary[:197] + "..."
    return summary


def _ticket_to_full_response(ticket: SupportTicket, db: Session) -> TicketResponse:
    """Convert ORM ticket to TicketResponse, adding staff name."""
    staff_name = None
    if ticket.assigned_staff_id:
        staff = db.query(User).filter(User.id == ticket.assigned_staff_id).first()
        if staff:
            staff_name = staff.full_name

    return TicketResponse(
        id=ticket.id,
        reference=ticket.reference,
        subject=ticket.subject,
        description=ticket.description,
        related_booking_ref=ticket.related_booking_ref,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        predicted_category=ticket.predicted_category.value if ticket.predicted_category else None,
        prediction_confidence=ticket.prediction_confidence,
        confirmed_category=ticket.confirmed_category.value if ticket.confirmed_category else None,
        ai_summary=ticket.ai_summary,
        sentiment=ticket.sentiment.value if ticket.sentiment else None,
        priority=ticket.priority.value,
        assigned_department=ticket.assigned_department,
        escalation_reason=ticket.escalation_reason,
        assigned_staff_id=ticket.assigned_staff_id,
        assigned_staff_name=staff_name,
        is_ai_reviewed=ticket.is_ai_reviewed,
        status=ticket.status.value,
        staff_response=ticket.staff_response,
        resolved_at=ticket.resolved_at,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        activities=[
            {
                "id": a.id,
                "action": a.action,
                "actor_name": a.actor_name,
                "old_value": a.old_value,
                "new_value": a.new_value,
                "note": a.note,
                "created_at": a.created_at,
            }
            for a in ticket.activities
        ],
    )


# ── Customer: submit ticket ────────────────────────────────────────────────────

@router.post("", response_model=TicketResponse, status_code=201)
def submit_ticket(
    payload: TicketCreateRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Submit a new support ticket.
    Triggers ML category prediction and deterministic routing on the backend.
    A real ticket ID and persisted record are always returned on success.
    """
    # ── ML prediction ──────────────────────────────────────────
    predicted_category = None
    prediction_confidence = None

    try:
        result = ml_predict.predict(payload.description)
        predicted_category = result.category
        prediction_confidence = result.confidence
    except ml_predict.ModelNotLoadedError as exc:
        # Model not trained yet — ticket is still created, category left blank
        predicted_category = None
        prediction_confidence = None
    except Exception:
        predicted_category = None
        prediction_confidence = None

    # ── Deterministic routing ──────────────────────────────────
    routing = determine_routing(
        category=predicted_category or "Booking",
        description=payload.description,
    )

    # ── Sentiment (rule-based fallback) ────────────────────────
    sentiment = _simple_sentiment(payload.description)

    # ── AI summary (rule-based fallback) ──────────────────────
    ai_summary = _build_ai_summary(
        payload.subject, payload.description, predicted_category or ""
    )

    # ── Create ticket ──────────────────────────────────────────
    customer_name = payload.customer_name
    customer_email = payload.customer_email
    if current_user:
        customer_name = customer_name or current_user.full_name
        customer_email = customer_email or current_user.email

    # Map predicted_category string to enum
    cat_enum = None
    if predicted_category:
        for member in TicketCategory:
            if member.value == predicted_category:
                cat_enum = member
                break

    ticket = SupportTicket(
        id=str(uuid.uuid4()),
        reference=_generate_ticket_reference(db),
        customer_id=current_user.id if current_user else None,
        customer_name=customer_name,
        customer_email=customer_email,
        subject=payload.subject,
        description=payload.description,
        related_booking_ref=payload.related_booking_ref,
        predicted_category=cat_enum,
        prediction_confidence=prediction_confidence,
        confirmed_category=None,
        ai_summary=ai_summary,
        sentiment=TicketSentiment(sentiment) if sentiment else None,
        priority=TicketPriority(routing["priority"]),
        assigned_department=routing["department"],
        escalation_reason=routing["escalation_reason"] or None,
        status=TicketStatus.open,
    )
    db.add(ticket)

    # Log initial activity
    activity = TicketActivity(
        id=str(uuid.uuid4()),
        ticket_id=ticket.id,
        actor_name="System",
        action="ticket_created",
        new_value=ticket.reference,
        note=f"Ticket created via customer portal. ML category: {predicted_category or 'unknown'}.",
    )
    db.add(activity)

    db.commit()
    db.refresh(ticket)
    return _ticket_to_full_response(ticket, db)


# ── Customer: view own tickets ─────────────────────────────────────────────────

@router.get("", response_model=List[TicketListResponse])
def list_my_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Customer: list own submitted tickets."""
    tickets = (
        db.query(SupportTicket)
        .filter(SupportTicket.customer_id == current_user.id)
        .order_by(SupportTicket.created_at.desc())
        .all()
    )
    return tickets


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get ticket detail. Customers can only see their own tickets; staff can see all."""
    ticket = (
        db.query(SupportTicket)
        .options(joinedload(SupportTicket.activities))
        .filter(SupportTicket.id == ticket_id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")
    if current_user.role == UserRole.customer and ticket.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied.")
    return _ticket_to_full_response(ticket, db)


# ── Staff: list all tickets ────────────────────────────────────────────────────

@router.get("/staff/all", response_model=List[TicketListResponse])
def list_all_tickets(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    category_filter: Optional[str] = Query(None, alias="category"),
    department_filter: Optional[str] = Query(None, alias="department"),
    search: Optional[str] = Query(None),
    mine_only: bool = Query(False),
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    """Staff/Admin: list all tickets with optional filters."""
    q = db.query(SupportTicket)

    if status_filter:
        q = q.filter(SupportTicket.status == status_filter)
    if priority_filter:
        q = q.filter(SupportTicket.priority == priority_filter)
    if category_filter:
        q = q.filter(
            (SupportTicket.confirmed_category == category_filter) |
            (SupportTicket.predicted_category == category_filter)
        )
    if department_filter:
        q = q.filter(SupportTicket.assigned_department == department_filter)
    if search:
        q = q.filter(
            SupportTicket.subject.ilike(f"%{search}%") |
            SupportTicket.reference.ilike(f"%{search}%") |
            SupportTicket.customer_name.ilike(f"%{search}%")
        )
    if mine_only:
        q = q.filter(SupportTicket.assigned_staff_id == current_user.id)

    return q.order_by(SupportTicket.created_at.desc()).all()


# ── Staff: update ticket ───────────────────────────────────────────────────────

@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: str,
    payload: TicketUpdateRequest,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db),
):
    """
    Staff: update ticket fields (category, priority, status, assignment, response).
    Every change is logged to ticket_activities for audit trail.
    """
    ticket = (
        db.query(SupportTicket)
        .options(joinedload(SupportTicket.activities))
        .filter(SupportTicket.id == ticket_id)
        .first()
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")

    now = datetime.now(timezone.utc)
    activities = []

    # Status transition validation
    if payload.status and payload.status != ticket.status.value:
        allowed = VALID_TRANSITIONS.get(ticket.status.value, [])
        if payload.status not in allowed:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid transition: {ticket.status.value} → {payload.status}. Allowed: {allowed}",
            )
        activities.append(TicketActivity(
            id=str(uuid.uuid4()), ticket_id=ticket.id,
            actor_id=current_user.id, actor_name=current_user.full_name,
            action="status_changed",
            old_value=ticket.status.value, new_value=payload.status,
        ))
        ticket.status = TicketStatus(payload.status)
        if payload.status == TicketStatus.resolved.value:
            ticket.resolved_at = now
        if payload.status == TicketStatus.in_progress.value and not ticket.first_response_at:
            ticket.first_response_at = now

    if payload.confirmed_category and payload.confirmed_category != getattr(ticket.confirmed_category, 'value', None):
        activities.append(TicketActivity(
            id=str(uuid.uuid4()), ticket_id=ticket.id,
            actor_id=current_user.id, actor_name=current_user.full_name,
            action="category_corrected",
            old_value=getattr(ticket.confirmed_category, 'value', ticket.predicted_category.value if ticket.predicted_category else None),
            new_value=payload.confirmed_category,
        ))
        ticket.confirmed_category = TicketCategory(payload.confirmed_category)
        # Re-route when category is confirmed
        routing = determine_routing(payload.confirmed_category, ticket.description)
        ticket.priority = TicketPriority(routing["priority"])
        ticket.assigned_department = routing["department"]

    if payload.priority:
        ticket.priority = TicketPriority(payload.priority)

    if payload.assigned_department:
        ticket.assigned_department = payload.assigned_department

    if payload.assigned_staff_id is not None:
        activities.append(TicketActivity(
            id=str(uuid.uuid4()), ticket_id=ticket.id,
            actor_id=current_user.id, actor_name=current_user.full_name,
            action="assigned",
            old_value=ticket.assigned_staff_id,
            new_value=payload.assigned_staff_id,
        ))
        ticket.assigned_staff_id = payload.assigned_staff_id or None
        if payload.assigned_staff_id and ticket.status == TicketStatus.open:
            ticket.status = TicketStatus.in_progress
            if not ticket.first_response_at:
                ticket.first_response_at = now

    if payload.staff_response:
        ticket.staff_response = payload.staff_response
        activities.append(TicketActivity(
            id=str(uuid.uuid4()), ticket_id=ticket.id,
            actor_id=current_user.id, actor_name=current_user.full_name,
            action="staff_replied",
            note=payload.staff_response[:100],
        ))

    if payload.is_ai_reviewed is not None:
        ticket.is_ai_reviewed = payload.is_ai_reviewed

    if payload.note:
        activities.append(TicketActivity(
            id=str(uuid.uuid4()), ticket_id=ticket.id,
            actor_id=current_user.id, actor_name=current_user.full_name,
            action="note_added", note=payload.note,
        ))

    for act in activities:
        db.add(act)

    db.commit()
    db.refresh(ticket)
    return _ticket_to_full_response(ticket, db)
