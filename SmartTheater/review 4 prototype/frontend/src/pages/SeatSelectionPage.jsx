import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, Shield, Info } from 'lucide-react';
import { api } from '../services/api';
import BookingStepper from '../components/BookingStepper';

export default function SeatSelectionPage() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Customer Form
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerEmail, setCustomerEmail] = useState('rahul.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('9876543210');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api.getShowSeats(showId)
      .then(data => {
        if (mounted) {
          setShow(data.show);
          setMovie(data.movie);
          setSeats(data.seats);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || 'Failed to load show seating chart');
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [showId]);

  const toggleSeatSelection = (seat) => {
    if (seat.is_booked) return;

    setSelectedSeatIds(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id);
      } else {
        if (prev.length >= 6) {
          alert('You can select a maximum of 6 tickets per booking in this demo.');
          return prev;
        }
        return [...prev, seat.id];
      }
    });
  };

  const selectedSeats = seats.filter(s => selectedSeatIds.includes(s.id));
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const grandTotal = subtotal + convenienceFee;

  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsByRow = {};
  rows.forEach(r => { seatsByRow[r] = []; });
  seats.forEach(s => {
    if (seatsByRow[s.row_label]) {
      seatsByRow[s.row_label].push(s);
    }
  });

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (selectedSeatIds.length === 0) {
      setError('Please select at least one seat to continue.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Please provide your name and email address for ticket issuance.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.createBooking({
        show_id: showId,
        seat_ids: selectedSeatIds,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      });

      if (response.booking && response.booking.id) {
        navigate(`/confirmation/${response.booking.id}`);
      }
    } catch (err) {
      setError(err.message || 'Seat reservation failed. A chosen seat may have just been booked.');
      // Refresh seat status to see which one was taken
      api.getShowSeats(showId).then(data => {
        setSeats(data.seats);
        // remove any newly booked seats from selection
        const bookedIds = data.seats.filter(s => s.is_booked).map(s => s.id);
        setSelectedSeatIds(prev => prev.filter(id => !bookedIds.includes(id)));
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="loading-spinner" style={{ width: '32px', height: '32px', marginBottom: '1rem' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading interactive hall layout...</p>
      </div>
    );
  }

  if (!show || !movie) {
    return (
      <div className="alert-banner alert-error">
        <AlertCircle size={20} />
        <div>Show or movie details could not be found. <button onClick={() => navigate('/')} style={{ textDecoration: 'underline', background: 'none', color: 'inherit' }}>Return to Catalogue</button></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'transparent', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Movies
        </button>
      </div>

      <BookingStepper currentStep={2} />

      {error && (
        <div className="alert-banner alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      <div className="seating-layout-container">
        {/* Left Column: Cinema Seating Layout */}
        <div className="theater-hall-card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
              {movie.title}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {show.theater_name} • {show.screen_name} • <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{show.show_date} at {show.show_time}</span>
            </p>
          </div>

          {/* Curved Cinema Screen */}
          <div className="cinema-screen-wrap">
            <div className="cinema-screen-curve" />
            <div className="cinema-screen-text">Cinema Screen This Way</div>
          </div>

          {/* Legend */}
          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-box available" />
              <span>Available (₹200)</span>
            </div>
            <div className="legend-item">
              <div className="legend-box selected" />
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="legend-box booked" />
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-box premium" />
              <span>Premium (₹320)</span>
            </div>
          </div>

          {/* Grid of seats */}
          <div className="seats-grid">
            {rows.map(rowLabel => {
              const rowSeats = seatsByRow[rowLabel] || [];
              const leftHalf = rowSeats.slice(0, 4);
              const rightHalf = rowSeats.slice(4, 8);

              return (
                <div key={rowLabel} className="seat-row">
                  <span className="seat-row-label">{rowLabel}</span>
                  
                  {leftHalf.map(seat => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={seat.is_booked}
                        onClick={() => toggleSeatSelection(seat)}
                        className={`seat-button ${seat.seat_type === 'premium' ? 'premium' : ''} ${isSelected ? 'selected' : ''} ${seat.is_booked ? 'booked' : ''}`}
                        title={`${seat.seat_number} (${seat.seat_type}) — ₹${seat.price}`}
                      >
                        {seat.seat_number}
                      </button>
                    );
                  })}

                  <div className="seat-aisle" />

                  {rightHalf.map(seat => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={seat.is_booked}
                        onClick={() => toggleSeatSelection(seat)}
                        className={`seat-button ${seat.seat_type === 'premium' ? 'premium' : ''} ${isSelected ? 'selected' : ''} ${seat.is_booked ? 'booked' : ''}`}
                        title={`${seat.seat_number} (${seat.seat_type}) — ₹${seat.price}`}
                      >
                        {seat.seat_number}
                      </button>
                    );
                  })}

                  <span className="seat-row-label">{rowLabel}</span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Info size={14} />
            <span>Rows A–D: Standard (₹200) | Rows E–F: Premium Recliners (₹320)</span>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Form */}
        <div className="order-summary-card">
          <h3 className="summary-title">Booking Summary</h3>

          <div className="selected-movie-info">
            <div className="summary-movie-title">{movie.title}</div>
            <div className="summary-meta-line">{show.theater_name} ({show.screen_name})</div>
            <div className="summary-meta-line" style={{ color: '#a5b4fc', marginTop: '0.2rem' }}>
              {show.show_date} • {show.show_time}
            </div>
          </div>

          <div style={{ marginBottom: '0.5rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Selected Seats ({selectedSeats.length})
          </div>

          <div className="selected-seats-chip-container">
            {selectedSeats.length === 0 ? (
              <span className="empty-seat-note">Click on available seats to select</span>
            ) : (
              selectedSeats.map(s => (
                <span key={s.id} className="selected-seat-tag">
                  {s.seat_number} <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({s.seat_type})</span>
                </span>
              ))
            )}
          </div>

          {/* Price Breakdown */}
          <div className="price-breakdown">
            <div className="price-row">
              <span>Tickets ({selectedSeats.length})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Convenience Fee</span>
              <span>{convenienceFee > 0 ? `₹${convenienceFee.toFixed(2)}` : '₹0.00'}</span>
            </div>
            <div className="price-row total">
              <span>Grand Total</span>
              <span style={{ color: '#10b981' }}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Details Form */}
          <form onSubmit={handleConfirmBooking}>
            <div className="customer-form-section">
              <div className="form-group">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  required 
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={customerEmail} 
                  onChange={e => setCustomerEmail(e.target.value)} 
                  required 
                  placeholder="For ticket delivery"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)} 
                  placeholder="Optional 10-digit number"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-confirm-booking"
              disabled={selectedSeats.length === 0 || submitting}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner" />
                  <span>Reserving in SQLite...</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Confirm Demo Booking ({selectedSeats.length})</span>
                </>
              )}
            </button>
          </form>

          <div className="demo-reservation-banner">
            <strong>Academic Review Prototype</strong>
            <div>Instant atomic reservation in persistent SQLite. No real payment charge applied.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
