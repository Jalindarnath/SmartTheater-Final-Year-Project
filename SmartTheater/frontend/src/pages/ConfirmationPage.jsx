import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import BookingStepper from '../components/BookingStepper';
import {
  CheckCircle2,
  Download,
  Ticket,
  MapPin,
  Clock,
  Smartphone,
  ShieldCheck,
  Headphones,
  Printer
} from 'lucide-react';

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const bookingRef = state.bookingRef || 'ST-261016-0842';
  const movieTitle = state.movieTitle || 'The Last Orbit';
  const theaterName = state.theaterName || 'Cinepolis · Nexus Shantiniketan';
  const screenName = state.screenName || '03 · IMAX';
  const showDate = state.showDate || 'Fri, 16 Oct 2026';
  const showTime = state.showTime || '7:30 PM';
  const seats = state.seats || 'H7, H8 · Premium';
  const customerName = state.customerName || 'Arjun';
  const customerEmail = state.customerEmail || 'arjun.shah@gmail.com';
  const customerMobile = state.customerMobile || '+91 98765 43210';
  const amountPaid = state.amountPaid || '687.20';

  const handleDownload = () => {
    window.print();
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── STEPPER (Step 4 Complete) ── */}
      <BookingStepper currentStep={4} />

      {/* ── HEADER BANNER ── */}
      <div className="container" style={{ marginBottom: '28px' }}>
        <div style={{
          color: 'var(--teal-primary)',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          YOUR TICKET IS READY
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '6px' }}>
          You're going to the movies!
        </h1>
        <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          {customerName}, your seats are confirmed. Here's everything you need for movie night.
        </p>

        {/* Green Success Banner from PDF */}
        <div style={{
          background: 'var(--success-soft)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--success-text)',
          fontSize: '0.88rem',
        }}>
          <CheckCircle2 size={18} color="var(--success-text)" />
          <div>
            <strong>Booking confirmed · {bookingRef}.</strong>{' '}
            <span>Your digital ticket has been sent to {customerEmail} and {customerMobile}.</span>
          </div>
        </div>
      </div>

      {/* ── MAIN TICKET & RECEIPT WORKSPACE (2 Column Layout) ── */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 390px',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column: Digital Ticket Card + Actions + Guidelines */}
          <div>
            {/* The Cinema Digital Ticket Card */}
            <div className="card" style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              marginBottom: '20px',
            }}>
              {/* Hero Banner Header of Ticket */}
              <div style={{
                background: 'var(--bg-hero)',
                backgroundImage: `linear-gradient(to right, rgba(14, 23, 42, 0.96) 35%, rgba(14, 23, 42, 0.8) 70%, rgba(14, 23, 42, 0.45) 100%), url(/images/last_orbit.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                padding: '24px 28px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}>
                <img
                  src="/images/last_orbit.jpg"
                  alt={movieTitle}
                  style={{
                    width: '64px',
                    height: '84px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  }}
                />
                <div>
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{
                      background: 'var(--success)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                    }}>
                      CONFIRMED
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
                    {movieTitle}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    English · IMAX 2D · U/A 13+
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {theaterName} · Whitefield, Bengaluru
                  </div>
                </div>
              </div>

              {/* Lower Section of Ticket: Details + QR Code */}
              <div style={{
                padding: '28px',
                display: 'grid',
                gridTemplateColumns: '1fr 200px',
                gap: '24px',
                alignItems: 'center',
              }}>
                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px 24px',
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                      DATE
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {showDate}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                      SHOWTIME
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {showTime}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                      SCREEN
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {screenName}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                      SEATS
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--teal-primary)', marginTop: '2px' }}>
                      {seats}
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                        BOOKING ID
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {bookingRef}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Paid via UPI
                      </div>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      ₹{amountPaid}
                    </div>
                  </div>
                </div>

                {/* QR Code Container */}
                <div style={{
                  textAlign: 'center',
                  paddingLeft: '24px',
                  borderLeft: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  {/* High Resolution SVG QR Code matching prototype */}
                  <div style={{
                    width: '128px',
                    height: '128px',
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    marginBottom: '10px',
                  }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Outer corner finders */}
                      <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                      <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="1" />

                      <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                      <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="1" />

                      <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                      <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="1" />

                      {/* Matrix patterns */}
                      <rect x="38" y="10" width="6" height="6" fill="#0f172a" />
                      <rect x="48" y="10" width="10" height="6" fill="#0f172a" />
                      <rect x="38" y="22" width="14" height="6" fill="#0f172a" />
                      <rect x="56" y="22" width="6" height="6" fill="#0f172a" />

                      <rect x="10" y="38" width="6" height="10" fill="#0f172a" />
                      <rect x="22" y="38" width="6" height="6" fill="#0f172a" />
                      <rect x="38" y="38" width="8" height="8" fill="#0f172a" />
                      <rect x="50" y="38" width="12" height="6" fill="#0f172a" />
                      <rect x="68" y="38" width="10" height="10" fill="#0f172a" />
                      <rect x="84" y="38" width="6" height="6" fill="#0f172a" />

                      <rect x="10" y="52" width="12" height="6" fill="#0f172a" />
                      <rect x="26" y="52" width="6" height="6" fill="#0f172a" />
                      <rect x="38" y="50" width="6" height="12" fill="#0f172a" />
                      <rect x="48" y="48" width="6" height="6" fill="#0f172a" />
                      <rect x="58" y="48" width="10" height="8" fill="#0f172a" />
                      <rect x="74" y="52" width="8" height="6" fill="#0f172a" />
                      <rect x="86" y="48" width="6" height="10" fill="#0f172a" />

                      <rect x="38" y="68" width="8" height="6" fill="#0f172a" />
                      <rect x="50" y="68" width="6" height="10" fill="#0f172a" />
                      <rect x="62" y="68" width="12" height="6" fill="#0f172a" />
                      <rect x="78" y="68" width="12" height="8" fill="#0f172a" />

                      <rect x="38" y="80" width="16" height="8" fill="#0f172a" />
                      <rect x="58" y="82" width="8" height="6" fill="#0f172a" />
                      <rect x="70" y="80" width="10" height="8" fill="#0f172a" />
                      <rect x="84" y="82" width="8" height="6" fill="#0f172a" />
                    </svg>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Scan at the entrance
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', maxWidth: '140px' }}>
                    One code admits 2 guests. Keep this ticket handy.
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'var(--bg-secondary)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                  }}>
                    <Smartphone size={12} />
                    <span>Digital ticket</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={handleDownload}
                className="btn-navy"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <Download size={16} />
                <span>Download ticket</span>
              </button>

              <button
                onClick={() => navigate('/my-bookings')}
                className="btn-outline"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <Ticket size={16} />
                <span>My Bookings</span>
              </button>

              <button
                onClick={() => window.open('https://maps.google.com/?q=Cinepolis+Nexus+Shantiniketan', '_blank')}
                className="btn-outline"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <MapPin size={16} />
                <span>Get directions</span>
              </button>
            </div>

            {/* Information Card: Before the lights go down */}
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
                Before the lights go down
              </h4>

              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '10px' }}>
                  • <strong>Arrive 20 minutes early</strong> — doors open at 7:10 PM. No printing needed; show this digital ticket and bring a valid ID for age verification.
                </p>
                <p>
                  • <strong>Need to cancel?</strong> Cancel strictly before 5:30 PM on 16 Oct 2026 for a ₹640 ticket refund. Convenience fee and GST (₹47.20) are non-refundable.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Receipt & Support */}
          <div>
            {/* Card 1: Payment Receipt */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800 }}>Payment receipt</h3>
                <span style={{
                  background: 'var(--success-soft)',
                  color: 'var(--success-text)',
                  border: '1px solid var(--success-border)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                }}>
                  PAID VIA UPI
                </span>
              </div>

              {/* Breakdown */}
              <div style={{
                fontSize: '0.86rem',
                lineHeight: 1.8,
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tickets (2 × ₹320)</span>
                  <span style={{ fontWeight: 600 }}>₹640.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Convenience fee</span>
                  <span style={{ fontWeight: 600 }}>₹40.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST on fee (18%)</span>
                  <span style={{ fontWeight: 600 }}>₹7.20</span>
                </div>
              </div>

              {/* Total Amount */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '1.02rem', fontWeight: 700 }}>Total amount</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ₹{amountPaid}
                </span>
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '18px',
              }}>
                Paid by {customerName} Shah · UPI · arjun.shah@okhdfcbank
              </div>

              <button
                onClick={handleDownload}
                className="btn-outline"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
              >
                <Download size={15} />
                <span>Download receipt</span>
              </button>
            </div>

            {/* Card 2: Need a hand? */}
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
                Need a hand?
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.45 }}>
                Our team can help with this booking. Keep your reference handy.
              </p>
              <button
                onClick={() => navigate('/support', { state: { relatedBookingRef: bookingRef } })}
                className="btn-outline"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
              >
                <Headphones size={15} />
                <span>Contact support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
