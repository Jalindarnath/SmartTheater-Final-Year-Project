import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Film, Calendar, Clock, MapPin, User, Mail, LifeBuoy, ArrowLeft, Printer } from 'lucide-react';
import { api } from '../services/api';
import BookingStepper from '../components/BookingStepper';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.getBooking(bookingId)
      .then(data => {
        if (mounted) {
          setBooking(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || 'Unable to retrieve booking details from database.');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [bookingId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="loading-spinner" style={{ width: '32px', height: '32px', marginBottom: '1rem' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying booking in SQLite database...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="confirmation-container">
        <div className="alert-banner alert-error">
          <div>
            <strong>Booking Lookup Failed:</strong> {error || 'Booking ID does not exist.'}
          </div>
        </div>
        <button onClick={() => navigate('/')} className="btn-book-now" style={{ width: 'auto', margin: '1rem auto' }}>
          Back to Catalogue
        </button>
      </div>
    );
  }

  const seatsList = booking.seats?.map(s => s.seat_number).join(', ') || 'N/A';

  return (
    <div className="confirmation-container">
      <BookingStepper currentStep={3} />

      <div className="success-header">
        <div className="success-icon-badge">
          <CheckCircle2 size={36} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Your cinema seats have been permanently locked and reserved in SQLite.
        </p>
      </div>

      {/* Digital Ticket Boarding Pass Card */}
      <div className="digital-ticket-card">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
              SmartTheater E-Ticket
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {booking.movie?.title || 'Cinema Ticket'}
            </div>
          </div>
          <div className="ticket-ref-box">
            <div className="ticket-ref-label">Booking Reference</div>
            <div className="ticket-ref-number">{booking.booking_reference}</div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="ticket-body">
          <div className="ticket-grid-details">
            <div className="ticket-detail-item">
              <div className="label">Date & Time</div>
              <div className="value" style={{ color: '#a5b4fc' }}>
                {booking.show?.show_date} • {booking.show?.show_time}
              </div>
            </div>

            <div className="ticket-detail-item">
              <div className="label">Cinema & Hall</div>
              <div className="value">
                {booking.show?.theater_name} ({booking.show?.screen_name})
              </div>
            </div>

            <div className="ticket-detail-item">
              <div className="label">Reserved Seats ({booking.seats?.length || 0})</div>
              <div className="value" style={{ color: '#10b981', fontSize: '1.1rem' }}>
                {seatsList}
              </div>
            </div>

            <div className="ticket-detail-item">
              <div className="label">Total Paid</div>
              <div className="value">
                ₹{parseFloat(booking.total_amount).toFixed(2)}
              </div>
            </div>

            <div className="ticket-detail-item">
              <div className="label">Customer</div>
              <div className="value" style={{ fontSize: '0.92rem' }}>
                {booking.customer_name}
              </div>
            </div>

            <div className="ticket-detail-item">
              <div className="label">Status</div>
              <div className="value" style={{ color: '#10b981', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                ● {booking.status}
              </div>
            </div>
          </div>

          {/* Ticket QR Section */}
          <div className="ticket-qr-section">
            <div className="qr-placeholder">
              {/* Clean SVG QR code representation */}
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                {/* Top-left position marker */}
                <rect x="10" y="10" width="28" height="28" fill="#1e1b4b" />
                <rect x="16" y="16" width="16" height="16" fill="white" />
                <rect x="20" y="20" width="8" height="8" fill="#1e1b4b" />
                {/* Top-right position marker */}
                <rect x="62" y="10" width="28" height="28" fill="#1e1b4b" />
                <rect x="68" y="16" width="16" height="16" fill="white" />
                <rect x="72" y="20" width="8" height="8" fill="#1e1b4b" />
                {/* Bottom-left position marker */}
                <rect x="10" y="62" width="28" height="28" fill="#1e1b4b" />
                <rect x="16" y="68" width="16" height="16" fill="white" />
                <rect x="20" y="72" width="8" height="8" fill="#1e1b4b" />
                {/* Pattern dots */}
                <rect x="44" y="14" width="8" height="8" fill="#1e1b4b" />
                <rect x="44" y="28" width="8" height="8" fill="#1e1b4b" />
                <rect x="44" y="44" width="12" height="12" fill="#1e1b4b" />
                <rect x="24" y="46" width="8" height="8" fill="#1e1b4b" />
                <rect x="62" y="46" width="14" height="8" fill="#1e1b4b" />
                <rect x="62" y="62" width="8" height="16" fill="#1e1b4b" />
                <rect x="76" y="70" width="12" height="16" fill="#1e1b4b" />
              </svg>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              ENTRY SCANNER
            </span>
          </div>
        </div>

        {/* Tear-off footer */}
        <div className="ticket-footer-tearoff">
          <div style={{ color: 'var(--text-secondary)' }}>
            <span>Notice: </span>
            <span style={{ color: 'var(--text-muted)' }}>Demo reservation. Show this at cinema gate.</span>
          </div>
          <button 
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'transparent', color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Confirmation Actions */}
      <div className="confirmation-actions">
        <button 
          onClick={() => navigate('/')} 
          className="btn-book-now"
          style={{ flex: 1 }}
        >
          <Film size={16} />
          <span>Book Another Movie</span>
        </button>

        <Link
          to={`/support?bookingRef=${booking.booking_reference}`}
          className="nav-item"
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            color: '#a5b4fc',
            fontWeight: 600
          }}
        >
          <LifeBuoy size={16} />
          <span>Need Help with this Ticket?</span>
        </Link>
      </div>
    </div>
  );
}
