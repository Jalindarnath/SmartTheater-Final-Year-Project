import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import BookingStepper from '../components/BookingStepper';
import { Clock, ShieldCheck, Info, ArrowRight } from 'lucide-react';

export default function SeatSelectionPage() {
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

  // Grid rows: Standard: A, B, C, D; Premium: E, F, G, H, J, K
  const rows = [
    { row: 'A', type: 'standard', price: 220 },
    { row: 'B', type: 'standard', price: 220 },
    { row: 'C', type: 'standard', price: 220 },
    { row: 'D', type: 'standard', price: 220 },
    { row: 'E', type: 'premium', price: 320 },
    { row: 'F', type: 'premium', price: 320 },
    { row: 'G', type: 'premium', price: 320 },
    { row: 'H', type: 'premium', price: 320 },
    { row: 'J', type: 'premium', price: 320 },
    { row: 'K', type: 'premium', price: 320 },
  ];

  // Booked seats matching prototype
  const bookedSet = new Set([
    'A1', 'A2', 'A6', 'A11',
    'B3', 'B4', 'B12',
    'C1', 'C5', 'C6', 'C7', 'C10', 'C12',
    'D3', 'D8', 'D9', 'D12',
    'E1', 'E5', 'E6', 'E9', 'E10',
    'F3', 'F7', 'F8', 'F11', 'F12',
    'G1', 'G2', 'G3', 'G4', 'G8', 'G9', 'G10',
    'H2', 'H3', 'H4', 'H10', 'H11',
    'J3', 'J4', 'J5', 'J9', 'J10',
    'K1', 'K2', 'K7', 'K11', 'K12',
  ]);

  // Pre-select H7 & H8 by default to match prototype
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setSelectedSeats([
        { id: 'H7', seat_label: 'H7', row_label: 'H', seat_number: 7, seat_type: 'premium', price: 320 },
        { id: 'H8', seat_label: 'H8', row_label: 'H', seat_number: 8, seat_type: 'premium', price: 320 },
      ]);
    }
  }, []);

  const handleSeatClick = (rowLabel, colNum, type, price) => {
    const seatId = `${rowLabel}${colNum}`;
    if (bookedSet.has(seatId)) return;

    toggleSeat({
      id: seatId,
      seat_label: seatId,
      row_label: rowLabel,
      seat_number: colNum,
      seat_type: type,
      price: price,
    });
  };

  const isSeatSelected = (seatId) => selectedSeats.some((s) => s.id === seatId || s.seat_label === seatId);

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }
    navigate('/booking/checkout');
  };

  const movieTitle = selectedMovie?.title || 'The Last Orbit';
  const seatsSummary = selectedSeats.length > 0
    ? selectedSeats.map((s) => s.seat_label).join(', ')
    : 'H7, H8';
  const premiumCount = selectedSeats.filter((s) => s.seat_type === 'premium').length;

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* ── STEPPER (Step 2 Active) ── */}
      <BookingStepper currentStep={2} />

      {/* ── HEADER & COUNTDOWN TIMER ── */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Choose your favorite spot.
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            The Last Orbit · Cinepolis, Nexus Shantiniketan · Fri, 16 Oct · 7:30 PM
          </p>
        </div>

        {/* Hold timer pill from PDF */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--warning-soft)',
          border: '1px solid var(--warning-border)',
          color: 'var(--warning-text)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.86rem',
          fontWeight: 600,
        }}>
          <Clock size={16} />
          <span>Seats held for {formattedTimer()}</span>
        </div>
      </div>

      {/* ── MAIN SEATING WORKSPACE (2 Column Layout) ── */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 390px',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column: Seat Map Card */}
          <div className="card" style={{ padding: '32px 28px' }}>
            {/* Screen Header & Legend */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '36px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Screen 03 · IMAX 2D
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    border: '1px solid var(--seat-avail-border)',
                    background: 'var(--seat-avail-bg)',
                  }} />
                  <span style={{ color: 'var(--text-muted)' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    background: 'var(--seat-selected-bg)',
                  }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Selected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    background: 'var(--seat-booked-bg)',
                  }} />
                  <span style={{ color: 'var(--text-muted)' }}>Booked</span>
                </div>
              </div>
            </div>

            {/* Curved Screen Arc matching prototype */}
            <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
              <svg width="100%" height="40" viewBox="0 0 600 40" fill="none" style={{ maxWidth: '520px', margin: '0 auto' }}>
                <path d="M 20 30 Q 300 0 580 30" stroke="var(--teal-primary)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--teal-primary)',
                marginTop: '-4px',
              }}>
                ALL EYES THIS WAY
              </div>
            </div>

            {/* Standard Rows (A-D) */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-dim)',
                marginBottom: '14px',
              }}>
                STANDARD · ₹220
              </div>

              {rows.slice(0, 4).map(({ row, type, price }) => (
                <div
                  key={row}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ width: '18px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {row}
                  </span>

                  {/* Seats 1-3 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3].map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = bookedSet.has(seatId);
                      const isSelected = isSeatSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(row, num, type, price)}
                          disabled={isBooked}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected
                              ? 'var(--seat-selected-bg)'
                              : isBooked
                              ? 'var(--seat-booked-bg)'
                              : 'var(--seat-avail-bg)',
                            color: isSelected
                              ? 'var(--seat-selected-text)'
                              : isBooked
                              ? 'var(--seat-booked-text)'
                              : 'var(--seat-avail-text)',
                            border: isSelected
                              ? '1px solid var(--seat-selected-border)'
                              : isBooked
                              ? '1px solid var(--seat-booked-border)'
                              : '1px solid var(--seat-avail-border)',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Spacer */}
                  <div style={{ width: '24px' }} />

                  {/* Seats 4-10 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = bookedSet.has(seatId);
                      const isSelected = isSeatSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(row, num, type, price)}
                          disabled={isBooked}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected
                              ? 'var(--seat-selected-bg)'
                              : isBooked
                              ? 'var(--seat-booked-bg)'
                              : 'var(--seat-avail-bg)',
                            color: isSelected
                              ? 'var(--seat-selected-text)'
                              : isBooked
                              ? 'var(--seat-booked-text)'
                              : 'var(--seat-avail-text)',
                            border: isSelected
                              ? '1px solid var(--seat-selected-border)'
                              : isBooked
                              ? '1px solid var(--seat-booked-border)'
                              : '1px solid var(--seat-avail-border)',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Spacer */}
                  <div style={{ width: '24px' }} />

                  {/* Seats 11-12 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[11, 12].map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = bookedSet.has(seatId);
                      const isSelected = isSeatSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(row, num, type, price)}
                          disabled={isBooked}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected
                              ? 'var(--seat-selected-bg)'
                              : isBooked
                              ? 'var(--seat-booked-bg)'
                              : 'var(--seat-avail-bg)',
                            color: isSelected
                              ? 'var(--seat-selected-text)'
                              : isBooked
                              ? 'var(--seat-booked-text)'
                              : 'var(--seat-avail-text)',
                            border: isSelected
                              ? '1px solid var(--seat-selected-border)'
                              : isBooked
                              ? '1px solid var(--seat-booked-border)'
                              : '1px solid var(--seat-avail-border)',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  <span style={{ width: '18px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {row}
                  </span>
                </div>
              ))}
            </div>

            {/* Premium Rows (E-K) */}
            <div>
              <div style={{
                textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-dim)',
                marginBottom: '14px',
              }}>
                PREMIUM · ₹320
              </div>

              {rows.slice(4).map(({ row, type, price }) => (
                <div
                  key={row}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ width: '18px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {row}
                  </span>

                  {/* Seats 1-3 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3].map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = bookedSet.has(seatId);
                      const isSelected = isSeatSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(row, num, type, price)}
                          disabled={isBooked}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected
                              ? 'var(--seat-selected-bg)'
                              : isBooked
                              ? 'var(--seat-booked-bg)'
                              : 'var(--seat-avail-bg)',
                            color: isSelected
                              ? 'var(--seat-selected-text)'
                              : isBooked
                              ? 'var(--seat-booked-text)'
                              : 'var(--seat-avail-text)',
                            border: isSelected
                              ? '1px solid var(--seat-selected-border)'
                              : isBooked
                              ? '1px solid var(--seat-booked-border)'
                              : '1px solid var(--seat-avail-border)',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Spacer */}
                  <div style={{ width: '24px' }} />

                  {/* Seats 4-10 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = bookedSet.has(seatId);
                      const isSelected = isSeatSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(row, num, type, price)}
                          disabled={isBooked}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected
                              ? 'var(--seat-selected-bg)'
                              : isBooked
                              ? 'var(--seat-booked-bg)'
                              : 'var(--seat-avail-bg)',
                            color: isSelected
                              ? 'var(--seat-selected-text)'
                              : isBooked
                              ? 'var(--seat-booked-text)'
                              : 'var(--seat-avail-text)',
                            border: isSelected
                              ? '1px solid var(--seat-selected-border)'
                              : isBooked
                              ? '1px solid var(--seat-booked-border)'
                              : '1px solid var(--seat-avail-border)',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Spacer */}
                  <div style={{ width: '24px' }} />

                  {/* Seats 11-12 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[11, 12].map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = bookedSet.has(seatId);
                      const isSelected = isSeatSelected(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => handleSeatClick(row, num, type, price)}
                          disabled={isBooked}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected
                              ? 'var(--seat-selected-bg)'
                              : isBooked
                              ? 'var(--seat-booked-bg)'
                              : 'var(--seat-avail-bg)',
                            color: isSelected
                              ? 'var(--seat-selected-text)'
                              : isBooked
                              ? 'var(--seat-booked-text)'
                              : 'var(--seat-avail-text)',
                            border: isSelected
                              ? '1px solid var(--seat-selected-border)'
                              : isBooked
                              ? '1px solid var(--seat-booked-border)'
                              : '1px solid var(--seat-avail-border)',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  <span style={{ width: '18px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {row}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: '32px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <Info size={14} />
              <span>Seat numbers run left to right. Your selected seats are together.</span>
            </div>
          </div>

          {/* Right Column: Sticky Booking Summary Card */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
                Your evening, reserved.
              </h3>

              {/* Movie info snippet */}
              <div style={{
                display: 'flex',
                gap: '14px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}>
                <img
                  src="/images/last_orbit.jpg"
                  alt={movieTitle}
                  style={{
                    width: '64px',
                    height: '84px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                    {movieTitle}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    U/A 13+ · English · 2h 18m
                  </div>
                  <span style={{
                    background: 'var(--teal-soft)',
                    color: 'var(--teal-primary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                  }}>
                    IMAX 2D
                  </span>
                </div>
              </div>

              {/* Theater & Showtime */}
              <div style={{
                fontSize: '0.86rem',
                color: 'var(--text-main)',
                lineHeight: 1.5,
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}>
                <div style={{ fontWeight: 700 }}>Cinepolis · Nexus Shantiniketan</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Whitefield, Bengaluru · Screen 03
                </div>
                <div style={{ marginTop: '6px', fontWeight: 600 }}>
                  Fri, 16 Oct 2026 · 7:30 PM
                </div>
                <div style={{ color: 'var(--teal-primary)', fontWeight: 600, marginTop: '4px' }}>
                  {seatsSummary} · {selectedSeats.length || 2} Premium seats
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{
                fontSize: '0.86rem',
                lineHeight: 1.8,
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Tickets ({selectedSeats.length || 2} × ₹320)
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    ₹{(selectedSeats.length > 0 ? ticketSubtotal : 640).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Convenience fee</span>
                  <span style={{ fontWeight: 600 }}>₹{convenienceFee > 0 ? convenienceFee.toFixed(2) : '40.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST on fee (18%)</span>
                  <span style={{ fontWeight: 600 }}>₹{gstOnFee > 0 ? gstOnFee.toFixed(2) : '7.20'}</span>
                </div>
              </div>

              {/* Total Amount */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Total amount</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ₹{(totalAmount > 0 ? totalAmount : 687.2).toFixed(2)}
                </span>
              </div>

              {/* Continue to Payment Button */}
              <button
                onClick={handleContinue}
                className="btn-navy"
                style={{ width: '100%', padding: '12px', fontSize: '0.94rem', marginBottom: '14px' }}
              >
                <ArrowRight size={16} />
                <span>
                  Continue to payment · ₹{(totalAmount > 0 ? totalAmount : 687.2).toFixed(2)}
                </span>
              </button>

              {/* Policy notes */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600, marginBottom: '6px' }}>
                <ShieldCheck size={15} />
                <span>Your seats are reserved while you pay.</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                Tickets are non-transferable. Cancellation is available up to 2 hours before the show.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
