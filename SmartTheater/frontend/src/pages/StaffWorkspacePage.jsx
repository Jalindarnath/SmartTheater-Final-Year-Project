import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Send,
  UserCheck,
  Bell,
  Ticket,
  Flag,
  Users,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Paperclip,
  Plus
} from 'lucide-react';

export default function StaffWorkspacePage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'mine'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fallback prototype tickets matching crop_staff.png 100%
  const [tickets, setTickets] = useState([
    {
      id: '1',
      reference: '#ST-1048',
      subject: 'Duplicate debit',
      customer_name: 'Arjun Shah',
      customer_email: 'arjun.shah@gmail.com',
      created_time: '10:42 AM',
      created_date: '16 Oct, 10:42 AM',
      category: 'Payment & billing',
      confidence: '98.4% confidence',
      sentiment: 'Negative',
      ai_summary: 'Two UPI debits of ₹687.20 for one confirmed booking; requests a refund.',
      priority: 'High',
      department: 'Finance & Payments',
      status: 'In progress',
      booking_info: 'ST-261016-0842 · The Last Orbit · H7, H8',
      attachment: 'upi-payment-receipt.png · 284 KB',
      description: '“My UPI account was debited ₹687.20 twice, but I only booked two seats. Please check and refund the duplicate payment.”',
      ai_reasoning: 'Customer reports a duplicate UPI charge of ₹687.20 on one confirmed booking. Verify gateway transaction IDs before refunding the extra debit.',
      suggested_actions: ['Billing · 98.4%', 'Negative · 92.6%', 'Refund verification'],
    },
    {
      id: '2',
      reference: '#ST-1047',
      subject: 'Seats not confirmed',
      customer_name: 'Riya Patel',
      customer_email: 'riya.patel@gmail.com',
      created_time: '10:36 AM',
      created_date: '16 Oct, 10:36 AM',
      category: 'Booking issue',
      confidence: '96.2% confidence',
      sentiment: 'Negative',
      ai_summary: 'Payment succeeded but seats are missing from the confirmation email.',
      priority: 'High',
      department: 'Booking Operations',
      status: 'Open',
      booking_info: 'ST-261016-0790 · Velocity · Screen 01',
      attachment: null,
      description: 'Payment went through on my card but I didn’t receive the confirmed seat numbers in my email or SMS.',
      ai_reasoning: 'Payment gateway captured transaction but booking item synchronization lagged. Check pending session table.',
      suggested_actions: ['Booking · 96.2%', 'Negative · 88.0%', 'Resend confirmation'],
    },
    {
      id: '3',
      reference: '#ST-1046',
      subject: 'Wheelchair access',
      customer_name: 'Dev Menon',
      customer_email: 'dev.menon@gmail.com',
      created_time: '10:21 AM',
      created_date: '16 Oct, 10:21 AM',
      category: 'Accessibility',
      confidence: '96.2% confidence',
      sentiment: 'Neutral',
      ai_summary: 'Needs wheelchair access and a companion seat for the evening show.',
      priority: 'Medium',
      department: 'Theater Operations',
      status: 'Assigned',
      booking_info: 'ST-261016-0710 · Midnight in Kyoto',
      attachment: null,
      description: 'My father requires wheelchair ramp access and companion seating near row E for tonight’s 8:15 PM show.',
      ai_reasoning: 'Accessibility escort needed at Screen 03 entrance ramp. Alert floor supervisor.',
      suggested_actions: ['Theater · 96.2%', 'Neutral · 91.0%', 'Ramp escort'],
    },
    {
      id: '4',
      reference: '#ST-1045',
      subject: 'Excellent sound',
      customer_name: 'Anika Rao',
      customer_email: 'anika.rao@gmail.com',
      created_time: '10:08 AM',
      created_date: '16 Oct, 10:08 AM',
      category: 'Feedback',
      confidence: '96.2% confidence',
      sentiment: 'Positive',
      ai_summary: 'Praises IMAX sound quality and helpful staff at yesterday’s screening.',
      priority: 'Low',
      department: 'Customer Experience',
      status: 'Resolved',
      booking_info: 'ST-261015-0994 · The Last Orbit',
      attachment: null,
      description: 'Just wanted to say the IMAX audio tuning was phenomenal yesterday! The staff helped us find our seats quickly.',
      ai_reasoning: 'Positive guest review for theater sound engineering and hospitality. Logged in customer happiness index.',
      suggested_actions: ['Feedback · 96.2%', 'Positive · 97.4%', 'Send thank you note'],
    },
  ]);

  useEffect(() => {
    if (!selectedTicket && tickets.length > 0) {
      setSelectedTicket(tickets[0]);
    }
  }, [tickets, selectedTicket]);

  const handleUpdateStatus = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleUpdateDepartment = (ticketId, newDept) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, department: newDept } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => ({ ...prev, department: newDept }));
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    alert(`Reply sent to ${selectedTicket.customer_email}: "${replyText}"`);
    setReplyText('');
    setShowReplyModal(false);
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'mine' && t.department !== 'Finance & Payments') return false;
    if (priorityFilter !== 'all' && t.priority.toLowerCase() !== priorityFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.reference.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── TOP BREADCRUMB & METADATA BAR ── */}
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <span>Workspace</span> / <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Ticket queue</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--teal-soft)',
              color: 'var(--teal-primary)',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
            }}>
              ● Live data
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Fri, 16 Oct 2026
            </span>
            <Bell size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#0f766e',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.76rem',
              fontWeight: 700,
            }}>
              MN
            </div>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE HEADER & CREATE BUTTON ── */}
      <div className="container" style={{ marginTop: '28px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{
              color: 'var(--teal-primary)',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              CINEPOLIS · NEXUS SHANTINIKETAN
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Every ticket, understood.
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)' }}>
              Review AI triage, route requests and keep movie nights on track.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-navy"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <Plus size={16} />
            <span>Create ticket</span>
          </button>
        </div>

        {/* ── 4 KPI CARDS (Exact match to crop_staff.png) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginTop: '28px',
        }}>
          {/* KPI 1 */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Theater tickets today</span>
              <Ticket size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              24
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              8 fewer than yesterday
            </div>
          </div>

          {/* KPI 2 */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>High priority</span>
              <Flag size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              8
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              All within response SLA
            </div>
          </div>

          {/* KPI 3 */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Awaiting assignment</span>
              <Users size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              6
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              AI routing available
            </div>
          </div>

          {/* KPI 4 */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>AI triage accuracy</span>
              <Sparkles size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              94.2%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              +2.1 pts this month
            </div>
          </div>
        </div>
      </div>

      {/* ── TICKET QUEUE TABLE (Exact match to crop_staff.png) ── */}
      <div className="container" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px' }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Ticket queue</h2>
              {/* Tabs: All (24), Mine (8) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveTab('all')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: activeTab === 'all' ? 700 : 500,
                    background: activeTab === 'all' ? 'var(--btn-navy-bg)' : 'transparent',
                    color: activeTab === 'all' ? '#ffffff' : 'var(--text-muted)',
                    border: activeTab === 'all' ? 'none' : '1px solid var(--border-subtle)',
                  }}
                >
                  All (24)
                </button>
                <button
                  onClick={() => setActiveTab('mine')}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: activeTab === 'mine' ? 700 : 500,
                    background: activeTab === 'mine' ? 'var(--btn-navy-bg)' : 'transparent',
                    color: activeTab === 'mine' ? '#ffffff' : 'var(--text-muted)',
                    border: activeTab === 'mine' ? 'none' : '1px solid var(--border-subtle)',
                  }}
                >
                  Mine (8)
                </button>
              </div>
            </div>

            {/* Search, Filter, Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                fontSize: '0.84rem',
              }}>
                <Search size={14} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search ticket or customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.84rem',
                    width: '180px',
                  }}
                />
              </div>

              {/* Priority Select */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                  fontSize: '0.84rem',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                <option value="all">All priorities</option>
                <option value="high">High priority</option>
                <option value="medium">Medium priority</option>
                <option value="low">Low priority</option>
              </select>

              {/* Sort Pill */}
              <button
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              >
                ⇅ Newest first
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{
                  color: 'var(--text-dim)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <th style={{ padding: '10px 14px' }}>TICKET</th>
                  <th style={{ padding: '10px 14px' }}>PREDICTED CATEGORY</th>
                  <th style={{ padding: '10px 14px' }}>SENTIMENT</th>
                  <th style={{ padding: '10px 14px' }}>AI SUMMARY</th>
                  <th style={{ padding: '10px 14px' }}>PRIORITY</th>
                  <th style={{ padding: '10px 14px' }}>DEPARTMENT</th>
                  <th style={{ padding: '10px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--teal-soft)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Ticket Col */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.reference}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{t.subject}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {t.customer_name} · {t.created_time}
                        </div>
                      </td>

                      {/* Predicted Category */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.category}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--teal-primary)', fontWeight: 500 }}>
                          {t.confidence}
                        </div>
                      </td>

                      {/* Sentiment */}
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background:
                            t.sentiment === 'Negative'
                              ? 'var(--danger-soft)'
                              : t.sentiment === 'Positive'
                              ? 'var(--teal-soft)'
                              : 'var(--bg-secondary)',
                          color:
                            t.sentiment === 'Negative'
                              ? 'var(--danger-text)'
                              : t.sentiment === 'Positive'
                              ? 'var(--teal-primary)'
                              : 'var(--text-muted)',
                        }}>
                          {t.sentiment}
                        </span>
                      </td>

                      {/* AI Summary */}
                      <td style={{ padding: '14px', maxWidth: '240px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {t.ai_summary}
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background:
                            t.priority === 'High'
                              ? 'var(--danger-soft)'
                              : t.priority === 'Medium'
                              ? 'var(--warning-soft)'
                              : 'var(--bg-secondary)',
                          color:
                            t.priority === 'High'
                              ? 'var(--danger-text)'
                              : t.priority === 'Medium'
                              ? 'var(--warning-text)'
                              : 'var(--text-dim)',
                        }}>
                          {t.priority}
                        </span>
                      </td>

                      {/* Department */}
                      <td style={{ padding: '14px', fontSize: '0.84rem', color: 'var(--text-main)' }}>
                        {t.department}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          background:
                            t.status === 'In progress'
                              ? 'var(--btn-navy-bg)'
                              : t.status === 'Resolved'
                              ? 'var(--teal-primary)'
                              : 'var(--bg-card)',
                          color:
                            t.status === 'In progress' || t.status === 'Resolved'
                              ? '#ffffff'
                              : 'var(--text-main)',
                          border: t.status === 'Open' || t.status === 'Assigned' ? '1px solid var(--border-medium)' : 'none',
                        }}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Row matching crop_staff.png */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            marginTop: '8px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>Showing 1–4 of 24 tickets · Updated 11:10 AM</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>← Previous</button>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <button style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SELECTED TICKET WORKSPACE DRAWER (Exact match to crop_staff.png bottom) ── */}
      {selectedTicket && (
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '24px',
          }}>
            {/* Left Card: Customer Ticket Query */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
                <h3 style={{ fontSize: '1.28rem', fontWeight: 800 }}>
                  {selectedTicket.reference} · {selectedTicket.subject}
                </h3>
                <span style={{
                  background: 'var(--danger-soft)',
                  color: 'var(--danger-text)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  {selectedTicket.priority} priority
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {selectedTicket.customer_name} · {selectedTicket.customer_email} · {selectedTicket.created_date}
              </div>

              <blockquote style={{
                fontSize: '0.94rem',
                color: 'var(--text-main)',
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: '20px',
              }}>
                {selectedTicket.description}
              </blockquote>

              {/* Booking tag */}
              {selectedTicket.booking_info && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '12px',
                }}>
                  <Ticket size={13} color="var(--teal-primary)" />
                  <span>{selectedTicket.booking_info}</span>
                </div>
              )}

              {/* Attachment */}
              {selectedTicket.attachment && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '18px',
                }}>
                  <Paperclip size={14} />
                  <span>{selectedTicket.attachment}</span>
                </div>
              )}

              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
              }}>
                Last reply sent by Meera at 11:05 AM · Next update due 3:05 PM
              </div>
            </div>

            {/* Right Card: AI Triage Insights */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--teal-primary)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>AI triage insights</h3>
                </div>
                <span style={{
                  background: 'var(--teal-primary)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                }}>
                  Human-reviewed
                </span>
              </div>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                marginBottom: '18px',
              }}>
                {selectedTicket.ai_reasoning}
              </p>

              {/* Suggested Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {selectedTicket.suggested_actions?.map((act, i) => (
                  <span
                    key={i}
                    style={{
                      background: i === 1 ? 'var(--danger-soft)' : 'var(--bg-secondary)',
                      color: i === 1 ? 'var(--danger-text)' : 'var(--text-main)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {act}
                  </span>
                ))}
              </div>

              {/* Dropdowns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '24px',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    ASSIGNED DEPARTMENT
                  </label>
                  <select
                    value={selectedTicket.department}
                    onChange={(e) => handleUpdateDepartment(selectedTicket.id, e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 10px',
                      fontSize: '0.84rem',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      outline: 'none',
                    }}
                  >
                    <option value="Finance & Payments">Finance & Payments</option>
                    <option value="Booking Operations">Booking Operations</option>
                    <option value="Theater Operations">Theater Operations</option>
                    <option value="Customer Experience">Customer Experience</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    TICKET STATUS
                  </label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 10px',
                      fontSize: '0.84rem',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      outline: 'none',
                    }}
                  >
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In progress">In progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Reply to customer + Mark resolved */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="btn-navy"
                  style={{ flex: 1, padding: '10px', fontSize: '0.88rem' }}
                >
                  <Send size={15} />
                  <span>Reply to customer</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedTicket.id, 'Resolved')}
                  className="btn-outline"
                  style={{ flex: 1, padding: '10px', fontSize: '0.88rem' }}
                >
                  Mark resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
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
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Reply to {selectedTicket?.customer_name}</h3>
              <button onClick={() => setShowReplyModal(false)}><X size={18} /></button>
            </div>
            <textarea
              rows={5}
              placeholder="Type your response here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.9rem',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                outline: 'none',
                marginBottom: '16px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowReplyModal(false)} className="btn-outline" style={{ padding: '8px 16px' }}>
                Cancel
              </button>
              <button onClick={handleSendReply} className="btn-navy" style={{ padding: '8px 18px' }}>
                Send response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
