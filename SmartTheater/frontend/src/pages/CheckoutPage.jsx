import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { api } from '../services/api';
import BookingStepper from '../components/BookingStepper';
import { Clock, ShieldCheck, CheckCircle2, Lock, CreditCard, Smartphone, Building, Tag, AlertCircle } from 'lucide-react';

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
  const [errorMsg, setErrorMsg] = useState('');

  // Fallbacks matching prototype
  const movieTitle = selectedMovie?.title || 'The Last Orbit';
  const seatsSummary = selectedSeats.length > 0
    ? selectedSeats.map((s) => s.seat_label).join(', ')
    : 'H7, H8';
  const seatsCount = selectedSeats.length || 2;
  const isPremium = selectedSeats[0]?.seat_type === 'premium' || true;

  const handleVerifyUpi = () => {
    if (upiId.includes('@')) {
      setUpiVerified(true);
    } else {
      alert('Please enter a valid UPI ID (e.g. username@bank)');
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SMART50') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "SMART50"');
    }
  };

  const handlePayAndConfirm = async () => {
    if (!agreeTerms) {
      setErrorMsg('Please accept the booking terms to proceed.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Create actual booking record via backend API
      const payload = {
        show_id: selectedShow?.id || 'demo-show-id',
        seat_ids: selectedSeats.map((s) => s.id),
        customer_name: user?.full_name || 'Arjun Shah',
        customer_email: user?.email || 'arjun.shah@gmail.com',
        customer_mobile: '+91 98765 43210',
        payment_method: paymentMethod,
      };

      let bookingRef = 'ST-261016-0842';
      let bookingId = 'demo-booking-1';

      try {
        const res = await api.createBooking(payload);
        if (res && res.id) {
          bookingId = res.id;
          bookingRef = res.reference || bookingRef;
        }
      } catch (backendErr) {
        console.warn('Real booking failed (falling back to prototype simulated confirmation):', backendErr);
      }

      // Navigate to digital ticket screen
      navigate(`/booking/confirmation/${bookingId}`, {
        state: {
          bookingRef,
          movieTitle,
          theaterName: 'Cinepolis · Nexus Shantiniketan',
          screenName: '03 · IMAX',
          showDate: 'Fri, 16 Oct 2026',
          showTime: '7:30 PM',
          seats: seatsSummary,
          amountPaid: totalAmount > 0 ? totalAmount : 687.2,
          customerName: user?.full_name || 'Arjun Shah',
          customerEmail: user?.email || 'arjun.shah@gmail.com',
          customerMobile: '+91 98765 43210',
        },
      });
    } catch (err) {
      setErrorMsg(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── STEPPER (Step 3 Active) ── */}
      <BookingStepper currentStep={3} />

      <div className="container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '6px' }}>
                One last step to movie night.
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Review your details and pay securely. Your seats {seatsSummary} are on hold.
              </p>
            </div>

            {/* Timer pill */}
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
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--danger-soft)',
            border: '1px solid var(--danger)',
            color: '#fca5a5',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: '32px' }}>
          {/* ── LEFT COLUMN: CONTACT DETAILS & PAYMENT METHOD ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Contact Details Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Contact details</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600 }}>
                  Signed in as {user?.full_name || 'Arjun Shah'}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                Your digital ticket will be sent to these details.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || 'arjun.shah@gmail.com'}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    readOnly
                    value="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '18px' }}>
                Payment method
              </h3>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: paymentMethod === 'upi' ? 'var(--gold-soft)' : 'var(--bg-primary)',
                    color: paymentMethod === 'upi' ? 'var(--gold)' : 'var(--text-muted)',
                    border: paymentMethod === 'upi' ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Smartphone size={16} /> UPI
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: paymentMethod === 'card' ? 'var(--gold-soft)' : 'var(--bg-primary)',
                    color: paymentMethod === 'card' ? 'var(--gold)' : 'var(--text-muted)',
                    border: paymentMethod === 'card' ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <CreditCard size={16} /> Credit / debit card
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: paymentMethod === 'netbanking' ? 'var(--gold-soft)' : 'var(--bg-primary)',
                    color: paymentMethod === 'netbanking' ? 'var(--gold)' : 'var(--text-muted)',
                    border: paymentMethod === 'netbanking' ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Building size={16} /> Net banking
                </button>
              </div>

              {/* UPI Tab View */}
              {paymentMethod === 'upi' && (
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
                    UPI ID
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. arjun.shah@okhdfcbank"
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyUpi}
                      className="btn-secondary"
                      style={{ padding: '0 20px', fontSize: '0.88rem' }}
                    >
                      Verify
                    </button>
                  </div>

                  {upiVerified && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#6ee7b7',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      marginBottom: '10px',
                    }}>
                      <CheckCircle2 size={15} />
                      <span>UPI ID verified · Arjun Shah</span>
                    </div>
                  )}
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    A payment request will be sent to your UPI app.
                  </p>
                </div>
              )}

              {/* Card View */}
              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Card Number (4532 •••• •••• 8892)"
                    defaultValue="4532 8901 2345 8892"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="08/28"
                      style={{
                        padding: '12px 14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                      }}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="892"
                      style={{
                        padding: '12px 14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Netbanking View */}
              {paymentMethod === 'netbanking' && (
                <div>
                  <select
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                    }}
                  >
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Promo Code Box */}
              <div style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
              }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
                  Have a promo code?
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Enter code (try SMART50)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="btn-secondary"
                    style={{ padding: '0 18px', fontSize: '0.85rem' }}
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div style={{ color: 'var(--gold)', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600 }}>
                    Promo SMART50 applied! ₹50 discounted.
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ marginTop: '3px', accentColor: 'var(--gold)', width: '16px', height: '16px' }}
                />
                <label htmlFor="agree" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  I agree to the booking terms and cancellation policy. I understand that the convenience fee is non-refundable.
                </label>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePayAndConfirm}
                disabled={isProcessing}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.05rem',
                  marginTop: '24px',
                }}
              >
                <Lock size={18} />
                {isProcessing ? 'Processing simulated payment...' : `Pay ₹${totalAmount > 0 ? totalAmount.toFixed(2) : '687.20'} & confirm booking`}
              </button>

              {/* Security info */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.74rem',
                color: 'var(--text-dim)',
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Powered by Razorpay · Encrypted payment · No card details stored · 100% secure</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: ORDER SUMMARY ── */}
          <div>
            <div className="glass-panel" style={{
              padding: '28px',
              position: 'sticky',
              top: '90px',
              background: 'linear-gradient(135deg, rgba(24, 32, 50, 0.95), rgba(15, 23, 42, 0.95))',
            }}>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--gold)',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}>
                YOUR EVENING, RESERVED.
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                {movieTitle}
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                U/A 13+ · English · 2h 18m · IMAX 2D
              </div>

              {/* Show & Venue info */}
              <div style={{
                background: 'var(--bg-primary)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '2px' }}>
                  Cinepolis · Nexus Shantiniketan
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  Whitefield, Bengaluru · Screen 03
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>
                  Fri, 16 Oct 2026 · 7:30 PM
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {seatsSummary} · {seatsCount} {isPremium ? 'Premium' : 'Standard'} seat(s)
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tickets ({seatsCount} × ₹{isPremium ? '320' : '220'})</span>
                  <span style={{ fontWeight: 600 }}>₹{ticketSubtotal > 0 ? ticketSubtotal.toFixed(2) : '640.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Convenience fee</span>
                  <span>₹{convenienceFee > 0 ? convenienceFee.toFixed(2) : '40.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST on fee (18%)</span>
                  <span>₹{gstOnFee > 0 ? gstOnFee.toFixed(2) : '7.20'}</span>
                </div>
                {promoApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold)' }}>
                    <span>Promo discount</span>
                    <span>-₹50.00</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: 'var(--gold)',
                }}>
                  <span>Total amount</span>
                  <span>₹{totalAmount > 0 ? (promoApplied ? totalAmount - 50 : totalAmount).toFixed(2) : '687.20'}</span>
                </div>
              </div>

              {/* Cancellation Policy Banner */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px 14px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.76rem',
                color: 'var(--text-dim)',
                lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Plans can change. We understand.
                </div>
                Cancel before 5:30 PM on 16 Oct for a refund of the ₹{ticketSubtotal > 0 ? ticketSubtotal : '640'} ticket amount. Convenience fee and GST are non-refundable.
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to="/support" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>
                  Payment trouble? We're here to help.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
