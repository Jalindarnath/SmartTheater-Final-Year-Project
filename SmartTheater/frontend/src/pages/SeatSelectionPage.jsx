import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useBooking } from '../contexts/BookingContext';
import BookingStepper from '../components/BookingStepper';
import { Clock, ShieldAlert, ChevronRight } from 'lucide-react';

export default function SeatSelectionPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const {
    selectedMovie,
    selectedShow,
    selectedSeats,
    toggleSeat,
    setSelectedSeats,
    formattedTimer,
    ticketSubtotal,
    convenienceFee,
    gstOnFee,
    totalAmount,
  } = useBooking();

  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate realistic seat matrix rows A to K, columns 1 to 12
  useEffect(() => {
    async function loadSeats() {
      try {
        if (showId) {
          const data = await api.getShowSeats(showId);
          if (data && data.length > 0) {
            setSeatMap(data);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend show seats endpoint fallback to generated grid:', err);
      }

      // Fallback matrix matching prototype
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
      const generated = [];

      rows.forEach((rowLetter) => {
        const isPremium = ['H', 'J', 'K'].includes(rowLetter);
        const price = isPremium ? 320.0 : 220.0;
        const seatType = isPremium ? 'premium' : 'standard';

        for (let col = 1; col <= 12; col++) {
          const seatLabel = `${rowLetter}${col}`;
          // Simulated booked seats
          const isBooked =
            (rowLetter === 'C' && [4, 5, 6].includes(col)) ||
            (rowLetter === 'F' && [7, 8, 9].includes(col)) ||
            (rowLetter === 'J' && [2, 3].includes(col));

          generated.push({
            id: `seat-${seatLabel}`,
            row_label: rowLetter,
            seat_number: col,
            seat_label: seatLabel,
            seat_type: seatType,
            price: price,
            status: isBooked ? 'booked' : 'available',
          });
        }
      });

      setSeatMap(generated);

      // Pre-select H7 & H8 to match PDF prototype if none selected
      if (selectedSeats.length === 0) {
        const h7 = generated.find((s) => s.seat_label === 'H7');
        const h8 = generated.find((s) => s.seat_label === 'H8');
        if (h7 && h8) {
          setSelectedSeats([h7, h8]);
        }
      }
      setLoading(false);
    }

    loadSeats();
  }, [showId]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    toggleSeat(seat);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }
    navigate('/booking/checkout');
  };

  // Group seats by row
  const rowsOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const seatsByRow = {};
  rowsOrder.forEach((r) => (seatsByRow[r] = []));
  seatMap.forEach((seat) => {
    if (seatsByRow[seat.row_label]) {
      seatsByRow[seat.row_label].push(seat);
    }
  });

  return (
    <div style={{ paddingBottom: '140px' }}>
      {/* ── STEPPER (Step 2 Active) ── */}
      <BookingStepper currentStep={2} />

      {/* ── HEADER & COUNTDOWN TIMER ── */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
          Choose your favorite spot.
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '14px' }}>
          {selectedMovie?.title || 'The Last Orbit'} · {selectedShow?.theater_name || 'Cinepolis, Nexus Shantiniketan'} · Fri, 16 Oct · 7:30 PM
        </div>

        {/* Live Timer Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          color: '#fca5a5',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}>
          <Clock size={15} color="#ef4444" />
          <span>Seats held for {formattedTimer()}</span>
        </div>
      </div>

      {/* ── CINEMA CURVED SCREEN ── */}
      <div className="container" style={{ maxWidth: '840px', margin: '0 auto 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
            SCREEN 03 · IMAX 2D
          </span>
        </div>

        {/* Curved Glowing Arc */}
        <div style={{ position: 'relative', height: '40px', overflow: 'hidden' }}>
          <svg viewBox="0 0 800 60" style={{ width: '100%', height: '100%' }}>
            <path
              d="M 20 50 Q 400 10 780 50"
              fill="none"
              stroke="url(#screenGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(245, 197, 24, 0.1)" />
                <stop offset="50%" stopColor="#f5c518" />
                <stop offset="100%" stopColor="rgba(245, 197, 24, 0.1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--gold)', marginTop: '-8px' }}>
          ALL EYES THIS WAY
        </div>
      </div>

      {/* ── SEAT LAYOUT MATRIX ── */}
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* STANDARD SECTION */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--text-dim)',
          letterSpacing: '0.08em',
          margin: '24px 0 16px',
        }}>
          STANDARD · ₹220
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((row) => (
            <div key={row} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textAlign: 'right' }}>
                {row}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(seatsByRow[row] || []).map((seat) => {
                  const isSelected = selectedSeats.some((s) => s.seat_label === seat.seat_label);
                  const isBooked = seat.status === 'booked';

                  return (
                    <button
                      key={seat.seat_label}
                      disabled={isBooked}
                      onClick={() => handleSeatClick(seat)}
                      style={{
                        width: '32px',
                        height: '30px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected
                          ? 'var(--gold)'
                          : isBooked
                          ? '#1e2433'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#0f172a' : isBooked ? '#475569' : 'var(--text-muted)',
                        border: isSelected
                          ? 'none'
                          : isBooked
                          ? '1px solid rgba(255, 255, 255, 0.03)'
                          : '1px solid var(--border-subtle)',
                        boxShadow: isSelected ? '0 0 12px var(--gold-glow)' : 'none',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                      title={`${seat.seat_label} (${seat.seat_type} - ₹${seat.price})`}
                    >
                      {seat.seat_number}
                    </button>
                  );
                })}
              </div>
              <span style={{ width: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textAlign: 'left' }}>
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* PREMIUM SECTION */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.08em',
          margin: '36px 0 16px',
        }}>
          PREMIUM · ₹320
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['H', 'J', 'K'].map((row) => (
            <div key={row} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ width: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textAlign: 'right' }}>
                {row}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(seatsByRow[row] || []).map((seat) => {
                  const isSelected = selectedSeats.some((s) => s.seat_label === seat.seat_label);
                  const isBooked = seat.status === 'booked';

                  return (
                    <button
                      key={seat.seat_label}
                      disabled={isBooked}
                      onClick={() => handleSeatClick(seat)}
                      style={{
                        width: '32px',
                        height: '30px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected
                          ? 'var(--gold)'
                          : isBooked
                          ? '#1e2433'
                          : 'rgba(245, 197, 24, 0.05)',
                        color: isSelected ? '#0f172a' : isBooked ? '#475569' : 'var(--gold)',
                        border: isSelected
                          ? 'none'
                          : isBooked
                          ? '1px solid rgba(255, 255, 255, 0.03)'
                          : '1px solid rgba(245, 197, 24, 0.25)',
                        boxShadow: isSelected ? '0 0 12px var(--gold-glow)' : 'none',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                      title={`${seat.seat_label} (${seat.seat_type} - ₹${seat.price})`}
                    >
                      {seat.seat_number}
                    </button>
                  );
                })}
              </div>
              <span style={{ width: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textAlign: 'left' }}>
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '28px',
          marginTop: '36px',
          padding: '14px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: 'rgba(255, 255, 255, 0.05)' }} />
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--gold)' }} />
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#1e2433' }} />
            <span>Booked</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.78rem', marginTop: '10px' }}>
          Seat numbers run left to right. Your selected seats are together.
        </div>
      </div>

      {/* ── STICKY FLOATING BOTTOM BAR ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: 'rgba(10, 14, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-cinema)',
        padding: '16px 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
              YOUR EVENING, RESERVED
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {selectedSeats.length > 0
                  ? `${selectedSeats.map((s) => s.seat_label).join(', ')} · ${selectedSeats.length} ${selectedSeats[0]?.seat_type} seat(s)`
                  : 'No seats selected'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Cinepolis · Nexus Shantiniketan · Fri, 16 Oct · 7:30 PM
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Total (inc. GST)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: '1rem',
                opacity: selectedSeats.length === 0 ? 0.5 : 1,
              }}
            >
              Continue to payment · ₹{totalAmount.toFixed(2)}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
