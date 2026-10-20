import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Sparkles,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState({
    total_bookings: 1248,
    net_ticket_revenue: 798720,
    average_occupancy: 74,
    open_support_tickets: 48,
    ai_triage_accuracy: 94.2,
    avg_first_response: '12 min',
    sla_compliance: 96,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await api.getAnalyticsDashboard();
        if (data) {
          setMetrics((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (err) {
        console.warn('Real analytics API fallback to prototype benchmark:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const movieRows = [
    {
      title: 'The Last Orbit',
      format: 'English · IMAX 2D',
      bookings: 486,
      revenue: '₹3,11,040',
      occupancy: 86,
      status: 'Now showing',
    },
    {
      title: 'Velocity',
      format: 'English · Dolby Atmos',
      bookings: 312,
      revenue: '₹1,99,680',
      occupancy: 73,
      status: 'Now showing',
    },
    {
      title: 'Midnight in Kyoto',
      format: 'Japanese · 2D',
      bookings: 248,
      revenue: '₹1,58,720',
      occupancy: 65,
      status: 'Now showing',
    },
    {
      title: 'The Wild Within',
      format: 'English · 2D',
      bookings: 202,
      revenue: '₹1,29,280',
      occupancy: 72,
      status: 'Now showing',
    },
  ];

  const dailyRevenue = [
    { day: '10 Oct', amount: 95000, height: 60 },
    { day: '11 Oct', amount: 112000, height: 72 },
    { day: '12 Oct', amount: 88000, height: 55 },
    { day: '13 Oct', amount: 104000, height: 66 },
    { day: '14 Oct', amount: 121000, height: 78 },
    { day: '15 Oct', amount: 120800, height: 77 },
    { day: '16 Oct', amount: 157920, height: 100 },
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── HEADER & ADMIN CONTEXT ── */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(20, 27, 43, 0.95), rgba(10, 14, 23, 0.95))',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '30px 0 20px',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="badge badge-gold">ADMIN WORKSPACE</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Workspace / Overview · PLATFORM OVERVIEW
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
                The big picture.
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                A clear view of your movies, bookings and customer experience.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}>
                <span style={{ color: '#10b981', marginRight: '6px' }}>●</span> Live data · Fri, 16 Oct 2026
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  color: '#ffffff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  PM
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Priya Mehta</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Platform administrator</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4 KPI CARDS (PROTOTYPE EXACT METRICS) ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginTop: '28px',
          }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total bookings
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                {metrics.total_bookings.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981' }}>
                ↑ +18.6% vs last week
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Net ticket revenue
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold)', margin: '4px 0' }}>
                ₹{(metrics.net_ticket_revenue || 798720).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981' }}>
                ↑ +12.4% vs last week
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Average occupancy
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                {metrics.average_occupancy}%
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981' }}>
                ↑ +8 pts vs last week
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Open support tickets
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f87171', margin: '4px 0' }}>
                {metrics.open_support_tickets}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981' }}>
                ↓ 12 fewer vs last week
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHARTS & OCCUPANCY BREAKDOWN ── */}
      <div className="container" style={{ marginTop: '36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: '24px' }}>
          {/* Revenue Overview Chart Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Revenue overview</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Net ticket revenue · 10 – 16 Oct 2026
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ■ This week
                </span>
                <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ■ Last week
                </span>
              </div>
            </div>

            {/* Custom CSS Bar Chart */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '180px',
              padding: '20px 10px 0',
              borderBottom: '1px solid var(--border-subtle)',
              gap: '12px',
            }}>
              {dailyRevenue.map((item) => (
                <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                    {item.day === '16 Oct' ? '₹1,57,920' : ''}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${item.height}%`,
                      background: item.day === '16 Oct' ? 'var(--gold)' : 'rgba(245, 197, 24, 0.45)',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease',
                      boxShadow: item.day === '16 Oct' ? '0 0 16px var(--gold-glow)' : 'none',
                    }}
                    title={`${item.day}: ₹${item.amount.toLocaleString()}`}
                  />
                  <span style={{ fontSize: '0.72rem', color: item.day === '16 Oct' ? 'var(--gold)' : 'var(--text-dim)', fontWeight: 600, marginTop: '8px' }}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seat Occupancy by Movie Widget */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
              Seat occupancy
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
              Booked seats as a share of available seats
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {movieRows.map((m) => (
                <div key={m.title}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{m.title}</span>
                    <span style={{ fontWeight: 700, color: m.occupancy >= 80 ? 'var(--gold)' : 'var(--text-main)' }}>
                      {m.occupancy}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    width: '100%',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${m.occupancy}%`,
                      background: m.occupancy >= 80 ? 'var(--gold)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-full)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOVIE MANAGEMENT TABLE ── */}
        <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Movie management</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>4 active movies</p>
            </div>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
              Add movie
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>MOVIE</th>
                  <th style={{ padding: '12px' }}>BOOKINGS</th>
                  <th style={{ padding: '12px' }}>NET REVENUE</th>
                  <th style={{ padding: '12px' }}>OCCUPANCY</th>
                  <th style={{ padding: '12px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {movieRows.map((m) => (
                  <tr key={m.title} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700 }}>{m.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{m.format}</div>
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 600 }}>{m.bookings}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--gold)' }}>{m.revenue}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 600 }}>{m.occupancy}%</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '14px' }}>
            1,248 bookings · Revenue excludes convenience fees and GST · Manage titles, showtimes and availability
          </div>
        </div>

        {/* ── SUPPORT TICKET ANALYTICS WIDGET ── */}
        <div className="glass-panel" style={{
          padding: '28px',
          marginTop: '24px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(24, 32, 50, 0.95))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', marginBottom: '4px' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  AI Support Analytics
                </span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                Smarter support, measurable impact
              </h3>
            </div>

            {/* Counts */}
            <div style={{ display: 'flex', gap: '18px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>176</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Received</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>128</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Resolved</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>48</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Open</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>12</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>High priority</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Category breakdown */}
            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                PREDICTED CATEGORY DISTRIBUTION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Billing & Payments</span>
                  <strong style={{ color: 'var(--gold)' }}>42%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Booking Operations</span>
                  <strong>28%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Theater & Accessibility</span>
                  <strong>16%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Other Inquiries</span>
                  <strong>14%</strong>
                </div>
              </div>
            </div>

            {/* Performance KPIs */}
            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                AI PERFORMANCE METRICS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c4b5fd' }}>94.2%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>AI accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>12 min</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>First response</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>96%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>SLA compliance</div>
                </div>
              </div>
            </div>

            {/* Sentiment breakdown */}
            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                CUSTOMER SENTIMENT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#f87171' }}>Negative</span>
                  <strong>54%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Neutral</span>
                  <strong>31%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6ee7b7' }}>Positive</span>
                  <strong>15%</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '16px', textAlign: 'center' }}>
            AI suggests category, sentiment and routing. Staff review every decision before responding.
          </div>
        </div>
      </div>
    </div>
  );
}
