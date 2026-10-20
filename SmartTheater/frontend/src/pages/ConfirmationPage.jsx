import React from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import BookingStepper from '../components/BookingStepper';
import { CheckCircle, Download, Printer, MessageSquare, ArrowLeft, QrCode } from 'lucide-react';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const bookingRef = state.bookingRef || 'ST-261016-0842';
  const movieTitle = state.movieTitle || 'The Last Orbit';
  const theaterName = state.theaterName || 'Cinepolis · Nexus Shantiniketan';
  const screenName = state.screenName || '03 · IMAX';
  const showDate = state.showDate || 'Fri, 16 Oct 2026';
  const showTime = state.showTime || '7:30 PM';
  const seats = state.seats || 'H7, H8';
  const customerName = state.customerName || 'Arjun';
  const customerEmail = state.customerEmail || 'arjun.shah@gmail.com';
  const customerMobile = state.customerMobile || '+91 98765 43210';

  const handlePrint = () => {
    window.print();
  };

  const handleNeedSupport = () => {
    navigate('/support', { state: { relatedBookingRef: bookingRef } });
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── STEPPER (Step 4 Complete) ── */}
      <BookingStepper currentStep={4} />

      <div className="container" style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Header Notification */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--gold)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            YOUR TICKET IS READY
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>
            You're going to the movies!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            {customerName}, your seats are confirmed. Here's everything you need for movie night.
          </p>

          {/* Confirmation pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--success-soft)',
            border: '1px solid var(--success)',
            color: '#6ee7b7',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            marginTop: '16px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}>
            <CheckCircle size={16} />
            <span>Booking confirmed · {bookingRef}</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            Your digital ticket has been sent to {customerEmail} and {customerMobile}.
          </div>
        </div>

        {/* ── CINEMA TICKET PASS CARD ── */}
        <div className="glass-panel" style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #131a29, #0d121d)',
          border: '1px solid rgba(245, 197, 24, 0.3)',
          boxShadow: 'var(--shadow-cinema)',
        }}>
          {/* Top Brand Banner */}
          <div style={{
            background: 'rgba(245, 197, 24, 0.08)',
            padding: '16px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--gold)' }}>
                SmartTheater
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>| Digital Pass</span>
            </div>
            <span className="badge badge-success">CONFIRMED</span>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 360px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
                  {movieTitle}
                </h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  English · IMAX 2D · U/A 13+
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {theaterName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    Whitefield, Bengaluru
                  </div>
                </div>

                {/* 2x2 Ticket details grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  background: 'var(--bg-primary)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                      DATE
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', marginTop: '2px' }}>
                      {showDate}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                      SHOWTIME
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--gold)', marginTop: '2px' }}>
                      {showTime}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                      SCREEN
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', marginTop: '2px' }}>
                      {screenName}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                      SEATS
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--gold)', marginTop: '2px' }}>
                      {seats}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code / Barcode Simulation */}
              <div style={{
                textAlign: 'center',
                background: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-md)',
                color: '#0f172a',
              }}>
                <div style={{
                  width: '140px',
                  height: '140px',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc',
                  border: '2px solid #0f172a',
                  borderRadius: '8px',
                }}>
                  <QrCode size={110} color="#0f172a" />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                  {bookingRef}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  Scan at theater entrance
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Footer Actions */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '18px 32px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Printer size={15} /> Print ticket
              </button>
              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Download size={15} /> Download PDF
              </button>
            </div>

            <button
              onClick={handleNeedSupport}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--gold)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              <MessageSquare size={15} />
              Need help with this booking? Open support ticket
            </button>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
