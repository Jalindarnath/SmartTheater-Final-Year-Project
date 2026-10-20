"""
Database seed script.
Creates realistic demo data for SmartTheater:
- 3 demo users (customer, staff, admin)
- 4 movies matching the PDF prototype
- 2 theaters (Cinepolis Nexus Shantiniketan, PVR Phoenix Marketcity)
- Screens with seats and upcoming shows
- Some pre-existing bookings and support tickets

Run from backend/ directory:
    python -m app.db.seed

Or:
    python scripts/seed_database.py
"""

import sys
import uuid
from pathlib import Path
from datetime import datetime, timezone, timedelta

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User, UserRole
from app.models.movie import Movie
from app.models.theater import Theater, Screen, Seat, SeatType, Show, ShowSeat, ShowSeatStatus
from app.models.booking import Booking, BookingItem, BookingStatus, Payment, PaymentStatus
from app.models.support_ticket import (
    SupportTicket, TicketActivity, TicketCategory, TicketPriority,
    TicketStatus, TicketSentiment,
)
from app.core.security import hash_password


def seed():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Skip seed if data already exists
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding demo data...")
        now = datetime.now(timezone.utc)

        # ── Users ────────────────────────────────────────────────
        customer = User(
            id=str(uuid.uuid4()),
            full_name="Arjun Shah",
            email="arjun.shah@gmail.com",
            mobile="+919876543210",
            hashed_password=hash_password("Demo@1234"),
            role=UserRole.customer,
        )
        staff = User(
            id=str(uuid.uuid4()),
            full_name="Meera Nair",
            email="meera.nair@smarttheater.in",
            mobile="+918765432109",
            hashed_password=hash_password("Staff@1234"),
            role=UserRole.staff,
        )
        admin = User(
            id=str(uuid.uuid4()),
            full_name="Priya Mehta",
            email="priya.mehta@smarttheater.in",
            mobile="+917654321098",
            hashed_password=hash_password("Admin@1234"),
            role=UserRole.admin,
        )
        db.add_all([customer, staff, admin])

        # ── Movies (matching PDF) ────────────────────────────────
        movies = [
            Movie(
                id=str(uuid.uuid4()),
                title="The Last Orbit",
                description=(
                    "When a distress signal arrives from the edge of the solar system, "
                    "a lone astronaut must choose between returning home and uncovering "
                    "a secret that could change humanity forever."
                ),
                genre="Sci-fi, Adventure",
                language="English",
                duration_minutes=138,
                rating=9.1,
                rating_count=2400,
                certification="U/A 13+",
                director="Maya Reynolds",
                cast="Ethan Cole, Naomi Park, Idris Vale",
                format="IMAX 2D",
                poster_url="/images/last_orbit.jpg",
                is_active=True,
                critics_choice=True,
            ),
            Movie(
                id=str(uuid.uuid4()),
                title="Velocity",
                description=(
                    "A high-octane thriller where a former race driver must outwit "
                    "an international crime syndicate across three continents."
                ),
                genre="Action, Thriller",
                language="English",
                duration_minutes=115,
                rating=8.6,
                rating_count=1800,
                certification="U/A 16+",
                director="Sam Ortiz",
                cast="Jake Morrison, Aisha Patel",
                format="Dolby Atmos",
                poster_url="/images/velocity.jpg",
                is_active=True,
                critics_choice=False,
            ),
            Movie(
                id=str(uuid.uuid4()),
                title="Midnight in Kyoto",
                description=(
                    "A quiet drama about two strangers who meet during a power outage "
                    "in Kyoto and discover unexpected connections across different lives."
                ),
                genre="Drama, Romance",
                language="Japanese",
                duration_minutes=98,
                rating=8.4,
                rating_count=950,
                certification="U/A 13+",
                director="Hana Mori",
                cast="Yuki Tanaka, Kenji Ito",
                format="2D",
                poster_url="/images/midnight_kyoto.jpg",
                is_active=True,
                critics_choice=False,
            ),
            Movie(
                id=str(uuid.uuid4()),
                title="The Wild Within",
                description=(
                    "An adventurer documents the last untouched wilderness on Earth, "
                    "revealing both its breathtaking beauty and the forces threatening it."
                ),
                genre="Adventure, Documentary",
                language="English",
                duration_minutes=106,
                rating=8.8,
                rating_count=1100,
                certification="U",
                director="Lena Brooks",
                cast="Marco Vieri, Elena Sousa",
                format="2D",
                poster_url="/images/wild_within.jpg",
                is_active=True,
                critics_choice=False,
            ),
        ]
        db.add_all(movies)

        # ── Theaters ─────────────────────────────────────────────
        cinepolis = Theater(
            id=str(uuid.uuid4()),
            name="Cinepolis · Nexus Shantiniketan",
            location="Whitefield, Bengaluru",
            distance_km=3.2,
        )
        pvr = Theater(
            id=str(uuid.uuid4()),
            name="PVR · Phoenix Marketcity",
            location="Mahadevapura, Bengaluru",
            distance_km=5.8,
        )
        db.add_all([cinepolis, pvr])
        db.flush()

        # ── Screens ───────────────────────────────────────────────
        screen03 = Screen(
            id=str(uuid.uuid4()),
            theater_id=cinepolis.id,
            screen_number=3,
            screen_format="IMAX 2D",
            total_rows=10,
            total_cols=12,
        )
        screen01_pvr = Screen(
            id=str(uuid.uuid4()),
            theater_id=pvr.id,
            screen_number=1,
            screen_format="IMAX 2D",
            total_rows=10,
            total_cols=12,
        )
        screen02 = Screen(
            id=str(uuid.uuid4()),
            theater_id=cinepolis.id,
            screen_number=2,
            screen_format="Dolby Atmos",
            total_rows=8,
            total_cols=10,
        )
        db.add_all([screen03, screen01_pvr, screen02])
        db.flush()

        # ── Seats for screen03 (rows A-K, cols 1-12) ─────────────
        def create_seats(screen, rows, cols):
            """Create Seat rows for a screen. Rows E-K are premium."""
            seats = []
            for row in rows:
                for col in range(1, cols + 1):
                    seat_type = SeatType.premium if row in ("F", "G", "H", "J", "K") else SeatType.standard
                    seat = Seat(
                        id=str(uuid.uuid4()),
                        screen_id=screen.id,
                        row_label=row,
                        col_number=col,
                        seat_label=f"{row}{col}",
                        seat_type=seat_type,
                        is_accessible=(row == "A" and col in (1, 12)),
                    )
                    seats.append(seat)
            return seats

        rows_large = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"]
        seats_03 = create_seats(screen03, rows_large, 12)
        seats_pvr = create_seats(screen01_pvr, rows_large, 12)
        rows_small = ["A", "B", "C", "D", "E", "F", "G", "H"]
        seats_02 = create_seats(screen02, rows_small, 10)
        db.add_all(seats_03 + seats_pvr + seats_02)
        db.flush()

        # ── Shows (multiple dates) ────────────────────────────────
        def create_shows(movie, screen, times, standard_price, premium_price, fmt=None):
            shows = []
            for show_dt in times:
                s = Show(
                    id=str(uuid.uuid4()),
                    movie_id=movie.id,
                    screen_id=screen.id,
                    show_datetime=show_dt,
                    standard_price=standard_price,
                    premium_price=premium_price,
                    convenience_fee=40.0,
                    gst_rate=0.18,
                    cancellation_cutoff_hours=2,
                    language=fmt or movie.language,
                )
                shows.append(s)
            return shows

        today = now.replace(hour=0, minute=0, second=0, microsecond=0)

        # The Last Orbit — Cinepolis Screen 03 (IMAX)
        orbit_times_cin = [
            today + timedelta(hours=10, minutes=45),
            today + timedelta(hours=14, minutes=15),
            today + timedelta(hours=19, minutes=30),
            today + timedelta(hours=22, minutes=45),
            today + timedelta(days=1, hours=10, minutes=45),
            today + timedelta(days=1, hours=14, minutes=15),
            today + timedelta(days=1, hours=19, minutes=30),
            today + timedelta(days=2, hours=14, minutes=15),
            today + timedelta(days=2, hours=19, minutes=30),
            today + timedelta(days=3, hours=19, minutes=30),
        ]
        orbit_shows_cin = create_shows(movies[0], screen03, orbit_times_cin, 220, 320)

        # The Last Orbit — PVR Screen 01
        orbit_times_pvr = [
            today + timedelta(hours=11, minutes=30),
            today + timedelta(hours=16),
            today + timedelta(hours=20, minutes=15),
        ]
        orbit_shows_pvr = create_shows(movies[0], screen01_pvr, orbit_times_pvr, 220, 320)

        # Velocity — Cinepolis Screen 02 (Dolby)
        velocity_times = [
            today + timedelta(hours=12),
            today + timedelta(hours=16, minutes=30),
            today + timedelta(hours=21),
            today + timedelta(days=1, hours=16, minutes=30),
            today + timedelta(days=1, hours=21),
        ]
        velocity_shows = create_shows(movies[1], screen02, velocity_times, 180, 280)

        all_shows = orbit_shows_cin + orbit_shows_pvr + velocity_shows
        db.add_all(all_shows)
        db.flush()

        # ── ShowSeats for all shows ───────────────────────────────
        def create_show_seats(shows, screen_seats, standard_price, premium_price):
            show_seats = []
            for show in shows:
                for seat in screen_seats:
                    price = premium_price if seat.seat_type == SeatType.premium else standard_price
                    ss = ShowSeat(
                        id=str(uuid.uuid4()),
                        show_id=show.id,
                        seat_id=seat.id,
                        status=ShowSeatStatus.available,
                        price=price,
                    )
                    show_seats.append(ss)
            return show_seats

        all_show_seats = (
            create_show_seats(orbit_shows_cin, seats_03, 220, 320)
            + create_show_seats(orbit_shows_pvr, seats_pvr, 220, 320)
            + create_show_seats(velocity_shows, seats_02, 180, 280)
        )
        db.add_all(all_show_seats)
        db.flush()

        # ── Demo booking (Arjun Shah — The Last Orbit H7, H8) ────
        # Use the 7:30 PM show from today on screen03
        demo_show = orbit_shows_cin[2]  # 19:30 today

        # Find show_seats for H7 and H8
        h7_seat = next((s for s in seats_03 if s.seat_label == "H7"), None)
        h8_seat = next((s for s in seats_03 if s.seat_label == "H8"), None)

        if h7_seat and h8_seat:
            booking_ref = "ST-261016-0842"
            booking_id = str(uuid.uuid4())
            demo_booking = Booking(
                id=booking_id,
                reference=booking_ref,
                user_id=customer.id,
                status=BookingStatus.confirmed,
                ticket_amount=640.0,
                convenience_fee=40.0,
                gst_amount=7.20,
                total_amount=687.20,
                contact_email="arjun.shah@gmail.com",
                contact_mobile="+919876543210",
                payment_method="upi",
                upi_id="arjun.shah@okhdfcbank",
                created_at=now - timedelta(hours=2),
            )
            db.add(demo_booking)

            for seat in [h7_seat, h8_seat]:
                item = BookingItem(
                    id=str(uuid.uuid4()),
                    booking_id=booking_id,
                    show_id=demo_show.id,
                    seat_id=seat.id,
                    seat_label=seat.seat_label,
                    seat_type="premium",
                    price=320.0,
                )
                db.add(item)

            demo_payment = Payment(
                id=str(uuid.uuid4()),
                booking_id=booking_id,
                amount=687.20,
                status=PaymentStatus.success,
                gateway_payment_id="SIM-DEMO0001",
                is_simulated=True,
            )
            db.add(demo_payment)

            # Mark H7 and H8 as booked in show_seats
            for ss in all_show_seats:
                if ss.show_id == demo_show.id and ss.seat_id in (h7_seat.id, h8_seat.id):
                    ss.status = ShowSeatStatus.booked
                    ss.booked_by_booking_id = booking_id

        # ── Demo support tickets ──────────────────────────────────
        demo_tickets = [
            SupportTicket(
                id=str(uuid.uuid4()),
                reference="ST-1048",
                customer_id=customer.id,
                customer_name="Arjun Shah",
                customer_email="arjun.shah@gmail.com",
                subject="Duplicate debit",
                description="My UPI account was debited ₹687.20 twice, but I only booked two seats. Please check and refund the duplicate payment.",
                related_booking_ref="ST-261016-0842",
                predicted_category=TicketCategory.payment,
                prediction_confidence=0.984,
                sentiment=TicketSentiment.negative,
                ai_summary="Customer reports a duplicate UPI charge of ₹687.20 on one confirmed booking. Verify gateway transaction IDs before refunding the extra debit.",
                priority=TicketPriority.high,
                assigned_department="Finance & Payments",
                status=TicketStatus.in_progress,
                created_at=now - timedelta(hours=5),
            ),
            SupportTicket(
                id=str(uuid.uuid4()),
                reference="ST-1047",
                customer_id=customer.id,
                customer_name="Riya Patel",
                customer_email="riya.patel@gmail.com",
                subject="Seats not confirmed",
                description="Payment succeeded but seats are missing from the confirmation email.",
                related_booking_ref=None,
                predicted_category=TicketCategory.booking,
                prediction_confidence=0.962,
                sentiment=TicketSentiment.negative,
                ai_summary="Payment succeeded but seats are missing from the confirmation email.",
                priority=TicketPriority.high,
                assigned_department="Booking Operations",
                status=TicketStatus.open,
                created_at=now - timedelta(hours=6),
            ),
            SupportTicket(
                id=str(uuid.uuid4()),
                reference="ST-1046",
                customer_id=None,
                customer_name="Dev Menon",
                customer_email="dev.menon@gmail.com",
                subject="Wheelchair access",
                description="Needs wheelchair access and a companion seat for the evening show.",
                related_booking_ref=None,
                predicted_category=TicketCategory.seating,
                prediction_confidence=0.962,
                sentiment=TicketSentiment.neutral,
                ai_summary="Needs wheelchair access and a companion seat for the evening show.",
                priority=TicketPriority.medium,
                assigned_department="Theater Operations",
                status=TicketStatus.open,
                assigned_staff_id=staff.id,
                created_at=now - timedelta(hours=7),
            ),
            SupportTicket(
                id=str(uuid.uuid4()),
                reference="ST-1045",
                customer_id=None,
                customer_name="Anika Rao",
                customer_email="anika.rao@gmail.com",
                subject="Excellent sound quality",
                description="I just wanted to say the IMAX sound quality at the last screening was incredible. The staff was also very helpful. Thank you!",
                related_booking_ref=None,
                predicted_category=TicketCategory.booking,
                prediction_confidence=0.700,
                sentiment=TicketSentiment.positive,
                ai_summary="Customer praises IMAX sound quality and helpful staff at yesterday's screening.",
                priority=TicketPriority.low,
                assigned_department="Customer Experience",
                status=TicketStatus.resolved,
                created_at=now - timedelta(hours=9),
            ),
        ]
        db.add_all(demo_tickets)

        # Activity for ST-1048
        db.add(TicketActivity(
            id=str(uuid.uuid4()),
            ticket_id=demo_tickets[0].id,
            actor_name="System",
            action="ticket_created",
            new_value="ST-1048",
            note="Ticket created. ML predicted: Payment (98.4% confidence).",
            created_at=now - timedelta(hours=5),
        ))
        db.add(TicketActivity(
            id=str(uuid.uuid4()),
            ticket_id=demo_tickets[0].id,
            actor_name="Meera Nair",
            actor_id=staff.id,
            action="status_changed",
            old_value="Open",
            new_value="In Progress",
            created_at=now - timedelta(hours=3),
        ))

        db.commit()
        print("[OK] Seed complete!")
        print("\nDemo accounts:")
        print("  Customer: arjun.shah@gmail.com / Demo@1234")
        print("  Staff:    meera.nair@smarttheater.in / Staff@1234")
        print("  Admin:    priya.mehta@smarttheater.in / Admin@1234")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
