import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LifeBuoy, Send, CheckCircle2, AlertCircle, Sparkles, Shield, ArrowRight, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function SupportTicketPage() {
  const [searchParams] = useSearchParams();
  const initialBookingRef = searchParams.get('bookingRef') || '';

  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerEmail, setCustomerEmail] = useState('rahul.sharma@example.com');
  const [bookingReference, setBookingReference] = useState(initialBookingRef);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [triageResult, setTriageResult] = useState(null);

  // Quick preset test scenarios for Review presentation
  const demoScenarios = [
    {
      label: 'Payment Deducted',
      subject: 'UPI money debited but ticket not generated',
      description: 'I attempted to book 2 tickets via GPay. The transaction succeeded and 430 rupees were deducted, but I got a failure screen and no booking ID was issued.'
    },
    {
      label: 'Booking Modification',
      subject: 'Need to reschedule my movie showtime',
      description: 'I have a confirmed booking reference BK-1042 for Saturday 6:30 PM. I would like to modify or reschedule my showtime to Sunday afternoon.'
    },
    {
      label: 'Technical Glitch',
      subject: 'Seat selection page keeps crashing with white screen',
      description: 'The website seat map freezes when selecting Row E seats in Google Chrome. An unhandled script exception appears and the browser tab crashes.'
    },
    {
      label: 'General Inquiry',
      subject: 'Inquiry regarding outside food and parking facilities',
      description: 'Are outside beverages allowed in Screen 1? Also what are the two-wheeler parking timings for midnight shows?'
    }
  ];

  const applyScenario = (sc) => {
    setSubject(sc.subject);
    setDescription(sc.description);
    setTriageResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Please provide both a ticket subject and a detailed issue description.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setTriageResult(null);

    try {
      const response = await api.createTicket({
        customer_name: customerName,
        customer_email: customerEmail,
        booking_reference: bookingReference || null,
        subject,
        description
      });

      setTriageResult(response.ticket);
    } catch (err) {
      setError(err.message || 'Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'payment': return 'badge-payment';
      case 'booking': return 'badge-booking';
      case 'technical': return 'badge-technical';
      default: return 'badge-general';
    }
  };

  const getPriorityPillClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Automated Support Ticket Triage</h1>
        <p className="page-subtitle">
          Submit an issue ticket to observe backend automated triage in action. Our explainable classification service analyzes keywords to assign Category, Priority, and Routing Team.
        </p>
      </div>

      <div className="support-container">
        {/* Left Column: Form & Scenarios */}
        <div className="support-form-card">
          {/* Quick Demo Scenarios */}
          <div className="quick-scenarios-box">
            <div className="quick-scenarios-title">
              <Sparkles size={14} color="#818cf8" />
              <span>Review 4 Demo Presets (1-Click Test Scenarios)</span>
            </div>
            <div className="scenario-buttons">
              {demoScenarios.map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  className="scenario-btn"
                  onClick={() => applyScenario(sc)}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="alert-banner alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label>Customer Name *</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  value={customerEmail} 
                  onChange={e => setCustomerEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Booking Reference (Optional)</label>
              <input 
                type="text" 
                value={bookingReference} 
                onChange={e => setBookingReference(e.target.value)} 
                placeholder="e.g. BK-1048"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Ticket Subject *</label>
              <input 
                type="text" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                required 
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Issue Description *</label>
              <textarea 
                rows={4} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                placeholder="Detailed description of what occurred..."
              />
            </div>

            <button 
              type="submit" 
              className="btn-book-now"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="loading-spinner" />
                  <span>Classifying & Saving in Backend...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Ticket for Automated Triage</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Automated Triage Explanation & Result */}
        <div>
          {triageResult ? (
            <div className="triage-result-card">
              <div className="triage-header">
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Triage Dispatch Result
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                    {triageResult.ticket_reference}
                  </div>
                </div>

                <div className={`triage-badge ${getCategoryBadgeClass(triageResult.category)}`}>
                  {triageResult.category}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Assigned Priority
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span className={`priority-pill ${getPriorityPillClass(triageResult.priority)}`}>
                      ● {triageResult.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Routed Team
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>
                    {triageResult.assigned_team}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Initial Status
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#93c5fd', marginTop: '0.25rem' }}>
                    {triageResult.status}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Confidence Score
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>
                    {triageResult.confidence_score ? `${Math.round(triageResult.confidence_score * 100)}%` : '85%'}
                  </div>
                </div>
              </div>

              {/* Explainable Decision Box */}
              <div className="triage-explanation-box">
                <div style={{ fontWeight: 700, color: '#a5b4fc', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} /> Explainable Classification Logic:
                </div>
                <div>{triageResult.triage_reason || 'Matched keywords in subject and body.'}</div>
                {triageResult.matched_keywords && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Trigger tokens: <code style={{ color: '#fcd34d' }}>{triageResult.matched_keywords}</code>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <Link 
                  to="/admin" 
                  className="btn-book-now"
                  style={{ width: '100%', fontSize: '0.88rem', padding: '0.65rem' }}
                >
                  <span>View in Admin Dashboard</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 1.75rem',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <LifeBuoy size={42} style={{ color: '#6366f1', margin: '0 auto 1rem', opacity: 0.8 }} />
              <h3 style={{ fontFamily: 'var(--font-display)', color: '#f8fafc', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Awaiting Ticket Submission
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
                Fill out the form or click any Review 4 Demo Preset on the left to see the backend triage engine inspect and categorize the ticket in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
