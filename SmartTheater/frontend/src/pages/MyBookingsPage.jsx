import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CheckCircle2,
  Download,
  MapPin,
  Clock,
  Smartphone,
  ShieldCheck,
  Headphones,
  ArrowUpRight,
  AlertCircle,
  X
} from 'lucide-react';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const customerEmail = user?.email || 'arjun.shah@gmail.com';

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setShowCancelModal(false);
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── HEADER SECTION ── */}
      <div className="container" style={{ marginTop: '32px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{
              color: 'var(--teal-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              YOUR CINEMA JOURNEY
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '6px' }}>
              My bookings
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)' }}>
              Your tickets, your plans, your next great story.
            </p>
          </div>

          <button
            onClick={() => navigate('/movies')}
            className="btn-navy"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            <ArrowUpRight size={16} />
            <span>Explore movies</span>
          </button>
        </div>

        {/* Green Success Banner from PDF */}
        {!isCancelled && (
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
            marginBottom: '24px',
          }}>
            <CheckCircle2 size={18} color="var(--success-text)" />
            <div>
              <strong>Booking confirmed. You're going to the movies!</strong>{' '}
              <span>A ticket has been sent to {customerEmail}.</span>
            </div>
          </div>
        )}

        {isCancelled && (
          <div style={{
            background: 'var(--danger-soft)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--danger-text)',
            fontSize: '0.88rem',
            marginBottom: '24px',
          }}>
            <AlertCircle size={18} color="var(--danger-text)" />
            <div>
              <strong>Booking cancelled.</strong>{' '}
              <span>Refund of ₹640.00 initiated to original UPI ID (arjun.shah@okhdfcbank). Expected within 5–7 business days.</span>
            </div>
          </div>
        )}

        {/* Tabs: Upcoming (1), Past bookings (2), Cancelled (1) */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'upcoming' ? 700 : 500,
              background: activeTab === 'upcoming' ? '#f59e0b' : 'transparent',
              color: activeTab === 'upcoming' ? '#0f172a' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            Upcoming ({isCancelled ? 0 : 1})
          </button>

          <button
            onClick={() => setActiveTab('past')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'past' ? 700 : 500,
              background: activeTab === 'past' ? 'var(--btn-navy-bg)' : 'transparent',
              color: activeTab === 'past' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            Past bookings (2)
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'cancelled' ? 700 : 500,
              background: activeTab === 'cancelled' ? 'var(--btn-navy-bg)' : 'transparent',
              color: activeTab === 'cancelled' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            Cancelled ({isCancelled ? 2 : 1})
          </button>
        </div>
      </div>

      {/* ── CURRENT BOOKINGS CONTENT WORKSPACE ── */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column: Active Bookings */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Current bookings</h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Your active ticket is ready. Review the details, scan at the entrance, or cancel before the deadline.
                </p>
              </div>
              <span style={{
                background: 'var(--success-soft)',
                color: 'var(--success-text)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
              }}>
                {isCancelled ? '0 active tickets' : '1 active ticket'}
              </span>
            </div>

            {!isCancelled ? (
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
                    alt="The Last Orbit"
                    style={{
                      width: '64px',
                      height: '84px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
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
                      The Last Orbit
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                      English · IMAX 2D · U/A 13+
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Cinepolis · Nexus Shantiniketan Whitefield, Bengaluru
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
                        Fri, 16 Oct 2026
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                        SHOWTIME
                      </div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                        7:30 PM
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                        SCREEN
                      </div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                        03 · IMAX
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                        SEATS
                      </div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--teal-primary)', marginTop: '2px' }}>
                        H7, H8 · Premium
                      </div>
                    </div>

                    <div style={{ gridColumn: 'span 2', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                          BOOKING ID
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          ST-261016-0842
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          2 tickets · Paid via UPI
                        </div>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹687.20
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div style={{
                    textAlign: 'center',
                    paddingLeft: '24px',
                    borderLeft: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      background: '#ffffff',
                      padding: '6px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      marginBottom: '8px',
                    }}>
                      <svg viewBox="0 0 100 100" width="100%" height="100%">
                        <rect width="100" height="100" fill="#ffffff" />
                        <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                        <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                        <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="1" />
                        <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                        <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                        <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="1" />
                        <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                        <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                        <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="1" />
                        <rect x="38" y="10" width="6" height="6" fill="#0f172a" />
                        <rect x="48" y="10" width="10" height="6" fill="#0f172a" />
                        <rect x="38" y="22" width="14" height="6" fill="#0f172a" />
                        <rect x="56" y="22" width="6" height="6" fill="#0f172a" />
                        <rect x="38" y="38" width="8" height="8" fill="#0f172a" />
                        <rect x="50" y="38" width="12" height="6" fill="#0f172a" />
                        <rect x="68" y="38" width="10" height="10" fill="#0f172a" />
                        <rect x="84" y="38" width="6" height="6" fill="#0f172a" />
                        <rect x="10" y="52" width="12" height="6" fill="#0f172a" />
                        <rect x="38" y="50" width="6" height="12" fill="#0f172a" />
                        <rect x="58" y="48" width="10" height="8" fill="#0f172a" />
                        <rect x="74" y="52" width="8" height="6" fill="#0f172a" />
                        <rect x="38" y="68" width="8" height="6" fill="#0f172a" />
                        <rect x="50" y="68" width="6" height="10" fill="#0f172a" />
                        <rect x="62" y="68" width="12" height="6" fill="#0f172a" />
                        <rect x="78" y="68" width="12" height="8" fill="#0f172a" />
                        <rect x="38" y="80" width="16" height="8" fill="#0f172a" />
                        <rect x="70" y="80" width="10" height="8" fill="#0f172a" />
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

                {/* Bottom Actions Row matching crop_my_bookings.png */}
                <div style={{
                  padding: '16px 28px',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => window.print()}
                      className="btn-navy"
                      style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    >
                      <Download size={15} />
                      <span>Download ticket</span>
                    </button>

                    <button
                      onClick={() => window.open('https://maps.google.com/?q=Cinepolis+Nexus+Shantiniketan', '_blank')}
                      className="btn-outline"
                      style={{ padding: '8px 16px', fontSize: '0.86rem' }}
                    >
                      <MapPin size={15} />
                      <span>Get directions</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    style={{
                      color: 'var(--danger)',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      padding: '8px 12px',
                    }}
                  >
                    Cancel booking
                  </button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <Ticket size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  No active upcoming bookings
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Ready for your next movie night? Explore now showing blockbusters in IMAX & 4DX.
                </p>
                <button
                  onClick={() => navigate('/movies')}
                  className="btn-navy"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Browse movies
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Widgets */}
          <div>
            {/* Widget 1: Before the lights go down */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px' }}>
                Before the lights go down
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Clock size={18} color="var(--teal-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Arrive 20 minutes early</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Doors open at 7:10 PM.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Smartphone size={18} color="var(--teal-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>No printing needed</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show your QR code at the entrance.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={18} color="var(--teal-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Bring a valid ID</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age verification may be required.</div>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                lineHeight: 1.45,
              }}>
                Cancel before 5:30 PM on 16 Oct for a ₹640 ticket refund. Fees are non-refundable.
              </div>
            </div>

            {/* Widget 2: Need a hand with this booking? */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--teal-soft)',
                color: 'var(--teal-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <Headphones size={18} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
                Need a hand with this booking?
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.45 }}>
                Send us a ticket. Our team will help you get back to enjoying the show.
              </p>
              <button
                onClick={() => navigate('/support', { state: { relatedBookingRef: 'ST-261016-0842' } })}
                className="btn-navy"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
              >
                Contact support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CANCELLATION MODAL (Matching Prototype Section 02) ── */}
      {showCancelModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          padding: '20px',
        }}>
          <div className="card" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-cinema)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Confirm cancellation</h3>
              <button onClick={() => setShowCancelModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to cancel your booking for <strong>The Last Orbit</strong> at Cinepolis, Nexus Shantiniketan?
            </p>

            {/* Refund Calculation Box */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '0.86rem',
              lineHeight: 1.7,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ticket amount (2 × ₹320)</span>
                <span style={{ fontWeight: 600 }}>₹640.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Convenience fee + GST</span>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Non-refundable (₹47.20)</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                marginTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                fontWeight: 700,
                fontSize: '0.94rem',
              }}>
                <span>Total refund to original UPI</span>
                <span style={{ color: 'var(--teal-primary)' }}>₹640.00</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                Refunds return to arjun.shah@okhdfcbank. Allow 5–7 business days.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn-outline"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
              >
                Keep booking
              </button>
              <button
                onClick={handleConfirmCancel}
                style={{
                  background: 'var(--danger)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                Confirm cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
