import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { api } from '../services/api';
import BookingStepper from '../components/BookingStepper';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Smartphone,
  Building2,
  Mail,
  Phone,
  Headphones,
  Check
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedMovie,
    selectedShow,
    selectedSeats,
    formattedTimer,
    ticketSubtotal,
    convenienceFee,
    gstOnFee,
    totalAmount,
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('arjun.shah@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const movieTitle = selectedMovie?.title || 'The Last Orbit';
  const seatsSummary = selectedSeats.length > 0
    ? selectedSeats.map((s) => s.seat_label).join(', ')
    : 'H7, H8';
  const totalDisplay = (totalAmount > 0 ? totalAmount : 687.2).toFixed(2);
  const ticketsSubtotalDisplay = (ticketSubtotal > 0 ? ticketSubtotal : 640).toFixed(2);

  const handleVerify = () => {
    if (upiId.includes('@')) {
      setUpiVerified(true);
    } else {
      alert('Please enter a valid UPI ID (e.g. username@bank)');
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SMART50') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "SMART50"');
    }
  };

  const handlePayAndConfirm = async () => {
    if (!agreeTerms) {
      alert('Please accept the booking terms to proceed.');
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        show_id: selectedShow?.id || 'demo-show-id',
        seat_ids: selectedSeats.map((s) => s.id),
        customer_name: user?.full_name || 'Arjun Shah',
        customer_email: user?.email || 'arjun.shah@gmail.com',
        customer_mobile: '+91 98765 43210',
        payment_method: paymentMethod,
      };

      let bookingRef = 'ST-261016-0842';
      let bookingId = 'ST-261016-0842';

      try {
        const res = await api.createBooking(payload);
        if (res && res.id) {
          bookingId = res.id;
          bookingRef = res.reference || bookingRef;
        }
      } catch (backendErr) {
        console.warn('Real booking failed, proceeding to prototype confirmation:', backendErr);
      }

      navigate(`/booking/confirmation/${bookingId}`, {
        state: {
          bookingRef,
          movieTitle,
          theaterName: 'Cinepolis · Nexus Shantiniketan',
          screenName: '03 · IMAX',
          showDate: 'Fri, 16 Oct 2026',
          showTime: '7:30 PM',
          seats: seatsSummary,
          amountPaid: totalDisplay,
          customerName: user?.full_name ? user.full_name.split(' ')[0] : 'Arjun',
          customerEmail: user?.email || 'arjun.shah@gmail.com',
          customerMobile: '+91 98765 43210',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── STEPPER (Step 3 Active) ── */}
      <BookingStepper currentStep={3} />

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
            One last step to movie night.
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Review your details and pay securely. Your seats {seatsSummary} are on hold.
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

      {/* ── MAIN CHECKOUT WORKSPACE (2 Column Layout) ── */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 390px',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column: Contact + Payment Details */}
          <div>
            {/* Card 1: Contact Details */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
              }}>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 700 }}>Contact details</h3>
                <span style={{
                  background: 'var(--teal-soft)',
                  color: 'var(--teal-primary)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  Signed in as {user?.full_name || 'Arjun Shah'}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Your digital ticket will be sent to these details.
              </p>

              {/* Two input columns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                    Email address
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    background: 'var(--bg-card)',
                  }}>
                    <input
                      type="email"
                      defaultValue={user?.email || 'arjun.shah@gmail.com'}
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.88rem',
                        width: '100%',
                        color: 'var(--text-main)',
                      }}
                    />
                    <Mail size={16} color="var(--text-muted)" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                    Mobile number
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    background: 'var(--bg-card)',
                  }}>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.88rem',
                        width: '100%',
                        color: 'var(--text-main)',
                      }}
                    />
                    <Phone size={16} color="var(--text-muted)" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Payment Method */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 700 }}>Payment method</h3>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'var(--teal-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  <ShieldCheck size={15} />
                  <span>100% secure</span>
                </span>
              </div>

              {/* Payment Tabs: UPI, Card, Net Banking */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'upi' ? '1.5px solid var(--teal-primary)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'upi' ? 'var(--teal-soft)' : 'var(--bg-card)',
                    color: paymentMethod === 'upi' ? 'var(--teal-primary)' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                  }}
                >
                  <span>UPI</span>
                  {paymentMethod === 'upi' && <Check size={16} color="var(--teal-primary)" />}
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'card' ? '1.5px solid var(--teal-primary)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'card' ? 'var(--teal-soft)' : 'var(--bg-card)',
                    color: paymentMethod === 'card' ? 'var(--teal-primary)' : 'var(--text-main)',
                    fontWeight: 500,
                    fontSize: '0.86rem',
                  }}
                >
                  <CreditCard size={16} />
                  <span>Credit / debit card</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'netbanking' ? '1.5px solid var(--teal-primary)' : '1px solid var(--border-subtle)',
                    background: paymentMethod === 'netbanking' ? 'var(--teal-soft)' : 'var(--bg-card)',
                    color: paymentMethod === 'netbanking' ? 'var(--teal-primary)' : 'var(--text-main)',
                    fontWeight: 500,
                    fontSize: '0.86rem',
                  }}
                >
                  <Building2 size={16} />
                  <span>Net banking</span>
                </button>
              </div>

              {/* UPI ID Field & Verification */}
              {paymentMethod === 'upi' && (
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                    UPI ID
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      style={{
                        flex: 1,
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        fontSize: '0.9rem',
                        background: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleVerify}
                      className="btn-outline"
                      style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    >
                      Verify
                    </button>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    A payment request will be sent to your UPI app.
                  </div>

                  {upiVerified && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--teal-soft)',
                      color: 'var(--teal-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}>
                      <CheckCircle2 size={14} />
                      <span>UPI ID verified · Arjun Shah</span>
                    </div>
                  )}
                </div>
              )}

              {/* Terms Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}>
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--teal-primary)' }}
                />
                <label htmlFor="agree-terms" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, cursor: 'pointer' }}>
                  I agree to the booking terms and cancellation policy. I understand that the convenience fee is non-refundable.
                </label>
              </div>

              {/* Confirm & Pay Button */}
              <button
                onClick={handlePayAndConfirm}
                disabled={isProcessing}
                className="btn-navy"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.96rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <Lock size={16} />
                <span>Pay ₹{totalDisplay} & confirm booking</span>
              </button>

              <div style={{
                textAlign: 'center',
                fontSize: '0.76rem',
                color: 'var(--text-dim)',
              }}>
                Powered by Razorpay · Encrypted payment · No card details stored
              </div>
            </div>

            {/* Card 3: Refund Policy Notice */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
                Plans can change. We understand.
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Cancel before 5:30 PM on 16 Oct for a refund of the ₹{ticketsSubtotalDisplay} ticket amount. Convenience fee and GST are non-refundable.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Summary & Promo */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
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
                  {seatsSummary} · 2 Premium seats
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
                  <span style={{ color: 'var(--text-muted)' }}>Tickets (2 × ₹320)</span>
                  <span style={{ fontWeight: 600 }}>₹{ticketsSubtotalDisplay}</span>
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
                marginBottom: '18px',
              }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Total amount</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ₹{totalDisplay}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--teal-soft)',
                color: 'var(--teal-primary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
              }}>
                <ShieldCheck size={15} />
                <span>Secure, encrypted payment</span>
              </div>
            </div>

            {/* Promo Code Card */}
            <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>
                Have a promo code?
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    fontSize: '0.86rem',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div style={{ color: 'var(--teal-primary)', fontSize: '0.78rem', marginTop: '6px', fontWeight: 600 }}>
                  ✓ Promo SMART50 applied!
                </div>
              )}
            </div>

            {/* Support link */}
            <button
              onClick={() => navigate('/support')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                fontSize: '0.84rem',
                color: 'var(--teal-primary)',
                fontWeight: 600,
                padding: '8px',
              }}
            >
              <Headphones size={15} />
              <span>Payment trouble? We're here to help.</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
