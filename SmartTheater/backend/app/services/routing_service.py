"""
Deterministic ticket routing and priority rules.

This module is SEPARATE from the ML classifier.
- ML classifier → predicts the ticket CATEGORY from text.
- This module  → determines PRIORITY and DEPARTMENT from the category and other metadata.

Rules are explicit and documented so they can be easily explained to faculty
and modified by the team without touching ML code.
"""

from app.models.support_ticket import TicketCategory, TicketPriority


# ── Department mapping ────────────────────────────────────────────────────────
# Each category maps to one responsible department.
CATEGORY_TO_DEPARTMENT: dict[str, str] = {
    TicketCategory.booking.value:   "Booking Operations",
    TicketCategory.payment.value:   "Finance & Payments",
    TicketCategory.refund.value:    "Finance & Payments",
    TicketCategory.seating.value:   "Theater Operations",
    TicketCategory.technical.value: "Technical Support",
    TicketCategory.discounts.value: "Customer Experience",
}

# ── Priority keywords ─────────────────────────────────────────────────────────
# If the ticket description contains any of these keywords,
# the priority is escalated to HIGH regardless of base priority.
HIGH_ESCALATION_KEYWORDS = [
    "twice", "double", "duplicate", "charged twice", "charged double",
    "money deducted", "not refunded", "fraud", "unauthorized",
    "bank deducted", "upi deducted", "debit",
]

CRITICAL_ESCALATION_KEYWORDS = [
    "fraud", "unauthorized charge", "data breach", "security",
]

LOW_PRIORITY_KEYWORDS = [
    "discount", "offer", "coupon", "promo", "loyalty points",
    "information", "how do i", "is there", "can i", "do you",
]


# ── Base priority per category ────────────────────────────────────────────────
# Default priority before keyword escalation is applied.
CATEGORY_BASE_PRIORITY: dict[str, str] = {
    TicketCategory.booking.value:   TicketPriority.medium.value,
    TicketCategory.payment.value:   TicketPriority.high.value,    # payment issues = high by default
    TicketCategory.refund.value:    TicketPriority.medium.value,
    TicketCategory.seating.value:   TicketPriority.medium.value,
    TicketCategory.technical.value: TicketPriority.medium.value,
    TicketCategory.discounts.value: TicketPriority.low.value,
}


def determine_routing(category: str, description: str) -> dict:
    """
    Apply deterministic rules to determine ticket priority, department, and
    escalation reason.

    Args:
        category: Predicted or confirmed ticket category string.
        description: Original ticket description text (used for keyword checks).

    Returns:
        Dict with keys:
            priority (str)          – Low | Medium | High | Critical
            department (str)        – responsible department name
            escalation_reason (str) – human-readable reason if escalated, else ""
    """
    description_lower = description.lower()

    # Look up base priority and department
    priority = CATEGORY_BASE_PRIORITY.get(category, TicketPriority.medium.value)
    department = CATEGORY_TO_DEPARTMENT.get(category, "Customer Experience")
    escalation_reason = ""

    # Check critical keywords first
    for kw in CRITICAL_ESCALATION_KEYWORDS:
        if kw in description_lower:
            priority = TicketPriority.critical.value
            escalation_reason = f"Critical keyword detected: '{kw}'"
            break

    # Check high escalation keywords (only if not already critical)
    if priority not in (TicketPriority.critical.value,):
        for kw in HIGH_ESCALATION_KEYWORDS:
            if kw in description_lower:
                priority = TicketPriority.high.value
                escalation_reason = f"Escalated: keyword '{kw}' suggests financial impact."
                break

    # Downgrade to Low for clearly informational tickets (if not already escalated)
    if priority == TicketPriority.medium.value:
        for kw in LOW_PRIORITY_KEYWORDS:
            if description_lower.startswith(kw) or f" {kw}" in description_lower:
                priority = TicketPriority.low.value
                break

    return {
        "priority": priority,
        "department": department,
        "escalation_reason": escalation_reason,
    }


def get_all_departments() -> list[str]:
    """Return a list of all department names for the staff dashboard."""
    return sorted(set(CATEGORY_TO_DEPARTMENT.values()))
