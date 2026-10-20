import React, { useState } from 'react';
import {
  Download,
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Headphones,
  Plus,
  MoreHorizontal,
  Sparkles,
  ArrowUpRight,
  Bell
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [activeDateRange, setActiveDateRange] = useState('10–16 Oct 2026');

  // Revenue chart days
  const revenuePoints = [
    { day: '10 Oct', amount: 84000, lastWeek: 78000 },
    { day: '11 Oct', amount: 96000, lastWeek: 82000 },
    { day: '12 Oct', amount: 118000, lastWeek: 104000 },
    { day: '13 Oct', amount: 102000, lastWeek: 99000 },
    { day: '14 Oct', amount: 124000, lastWeek: 110000 },
    { day: '15 Oct', amount: 142000, lastWeek: 125000 },
    { day: '16 Oct', amount: 157920, lastWeek: 135000 },
  ];

  const occupancyMovies = [
    { name: 'The Last Orbit', percentage: 86 },
    { name: 'Velocity', percentage: 73 },
    { name: 'Midnight in Kyoto', percentage: 65 },
    { name: 'The Wild Within', percentage: 72 },
  ];

  const moviesTable = [
    {
      title: 'The Last Orbit',
      format: 'English · IMAX 2D',
      poster: '/images/last_orbit.jpg',
      bookings: 486,
      revenue: '₹3,11,040',
      occupancy: '86%',
      status: 'Now showing',
    },
    {
      title: 'Velocity',
      format: 'English · Dolby Atmos',
      poster: '/images/velocity.jpg',
      bookings: 312,
      revenue: '₹1,99,680',
      occupancy: '73%',
      status: 'Now showing',
    },
    {
      title: 'Midnight in Kyoto',
      format: 'Japanese · 2D',
      poster: '/images/midnight_kyoto.jpg',
      bookings: 248,
      revenue: '₹1,58,720',
      occupancy: '65%',
      status: 'Now showing',
    },
    {
      title: 'The Wild Within',
      format: 'English · 2D',
      poster: '/images/wild_within.jpg',
      bookings: 202,
      revenue: '₹1,29,280',
      occupancy: '72%',
      status: 'Now showing',
    },
  ];

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
            <span>Workspace</span> / <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Overview</span>
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
              background: '#1b2a47',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.76rem',
              fontWeight: 700,
            }}>
              PM
            </div>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE HEADER & CONTROLS ── */}
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
              PLATFORM OVERVIEW
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '6px' }}>
              The big picture.
            </h1>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)' }}>
              A clear view of your movies, bookings and customer experience.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-outline"
              style={{ padding: '9px 16px', fontSize: '0.86rem' }}
            >
              <Calendar size={15} />
              <span>{activeDateRange}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="btn-navy"
              style={{ padding: '9px 18px', fontSize: '0.86rem' }}
            >
              <Download size={15} />
              <span>Export report</span>
            </button>
          </div>
        </div>

        {/* ── 4 KPI CARDS (Exact match to crop_admin.png) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginTop: '28px',
        }}>
          {/* Total Bookings */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Total bookings</span>
              <Ticket size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              1,248
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              +18.6% vs last week
            </div>
          </div>

          {/* Net Ticket Revenue */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Net ticket revenue</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--teal-primary)' }}>₹</span>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              ₹7,98,720
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              +12.4% vs last week
            </div>
          </div>

          {/* Average Occupancy */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Average occupancy</span>
              <TrendingUp size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              74%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              +8 pts vs last week
            </div>
          </div>

          {/* Open Support Tickets */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Open support tickets</span>
              <Headphones size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '8px' }}>
              48
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
              12 fewer vs last week
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW: REVENUE OVERVIEW & SEAT OCCUPANCY ── */}
      <div className="container" style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '24px',
        }}>
          {/* Left: Revenue Overview Line Chart Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800 }}>Revenue overview</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Net ticket revenue · 10–16 Oct 2026
                </p>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal-primary)' }} />
                  <span>This week</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-dim)' }} />
                  <span>Last week</span>
                </div>
              </div>
            </div>

            {/* SVG Interactive Line Chart matching crop_admin.png */}
            <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '20px' }}>
              <svg width="100%" height="100%" viewBox="0 0 650 200" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="40" y1="30" x2="630" y2="30" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="630" y2="100" stroke="var(--border-subtle)" strokeDasharray="3 3" />
                <line x1="40" y1="170" x2="630" y2="170" stroke="var(--border-subtle)" />

                {/* Y-axis labels */}
                <text x="35" y="34" fill="var(--text-dim)" fontSize="11" textAnchor="end">₹160k</text>
                <text x="35" y="104" fill="var(--text-dim)" fontSize="11" textAnchor="end">₹80k</text>
                <text x="35" y="174" fill="var(--text-dim)" fontSize="11" textAnchor="end">₹0</text>

                {/* Filled area for This Week */}
                <path
                  d="M 50 110 L 140 102 L 230 84 L 320 90 L 410 65 L 500 48 L 590 32 L 590 170 L 50 170 Z"
                  fill="var(--teal-soft)"
                  opacity="0.75"
                />

                {/* Last Week Dashed Line */}
                <path
                  d="M 50 118 L 140 112 L 230 96 L 320 102 L 410 82 L 500 70 L 590 56"
                  stroke="var(--text-dim)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                />

                {/* This Week Solid Line */}
                <path
                  d="M 50 110 L 140 102 L 230 84 L 320 90 L 410 65 L 500 48 L 590 32"
                  stroke="var(--teal-primary)"
                  strokeWidth="2.5"
                  fill="none"
                />

                {/* Data Points */}
                {revenuePoints.map((pt, i) => {
                  const x = 50 + i * 90;
                  const y = 170 - (pt.amount / 160000) * 140;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="var(--teal-primary)" stroke="#ffffff" strokeWidth="2" />
                      <text x={x} y="192" fill="var(--text-muted)" fontSize="11" textAnchor="middle">
                        {pt.day}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip badge for Oct 16 matching prototype */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '40px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.78rem',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>16 OCT</div>
                <div style={{ fontWeight: 800, color: 'var(--teal-primary)' }}>₹1,57,920</div>
              </div>
            </div>
          </div>

          {/* Right: Seat Occupancy Horizontal Bars */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800 }}>Seat occupancy</h3>
              <span style={{
                background: 'var(--bg-secondary)',
                fontSize: '0.74rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
              }}>
                This week
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Booked seats as a share of available seats
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {occupancyMovies.map((m) => (
                <div key={m.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span>{m.name}</span>
                    <span>{m.percentage}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-secondary)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${m.percentage}%`,
                      height: '100%',
                      background: 'var(--teal-primary)',
                      borderRadius: 'var(--radius-full)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOVIE MANAGEMENT TABLE CARD (Exact match to crop_admin.png) ── */}
      <div className="container" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Movie management</h3>
              <span style={{
                background: 'var(--teal-soft)',
                color: 'var(--teal-primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                4 active movies
              </span>
            </div>

            <button className="btn-navy" style={{ padding: '8px 16px', fontSize: '0.86rem' }}>
              <Plus size={15} />
              <span>Add movie</span>
            </button>
          </div>

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
                  <th style={{ padding: '10px 14px' }}>MOVIE</th>
                  <th style={{ padding: '10px 14px' }}>BOOKINGS</th>
                  <th style={{ padding: '10px 14px' }}>NET REVENUE</th>
                  <th style={{ padding: '10px 14px' }}>OCCUPANCY</th>
                  <th style={{ padding: '10px 14px' }}>STATUS</th>
                  <th style={{ padding: '10px 14px' }}></th>
                </tr>
              </thead>
              <tbody>
                {moviesTable.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={m.poster}
                        alt={m.title}
                        style={{ width: '38px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.title}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{m.format}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{m.bookings}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{m.revenue}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        background: 'var(--teal-soft)',
                        color: 'var(--teal-primary)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                      }}>
                        {m.occupancy}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        background: 'var(--teal-soft)',
                        color: 'var(--teal-primary)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                      }}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button style={{ color: 'var(--text-muted)' }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            1,248 bookings · Revenue excludes convenience fees and GST · Manage titles, showtimes and availability
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: SUPPORT TICKET ANALYTICS & MEASURABLE IMPACT ── */}
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          {/* Card 1: Support ticket analytics */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800 }}>Support ticket analytics</h3>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
                <span>View report</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>176</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Received</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>128</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Resolved</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--teal-primary)' }}>48</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Open</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)' }}>12</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>High priority</div>
              </div>
            </div>

            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em', marginBottom: '8px' }}>
              PREDICTED CATEGORY DISTRIBUTION
            </div>

            {/* Segmented bar */}
            <div style={{
              display: 'flex',
              height: '10px',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: '12px',
            }}>
              <div style={{ width: '42%', background: '#0f766e' }} title="Billing 42%" />
              <div style={{ width: '28%', background: '#1e293b' }} title="Booking 28%" />
              <div style={{ width: '16%', background: '#cbd5e1' }} title="Theater 16%" />
              <div style={{ width: '14%', background: '#e2e8f0' }} title="Other 14%" />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
            }}>
              <span>Billing 42%</span>
              <span>Booking 28%</span>
              <span>Theater 16%</span>
              <span>Other 14%</span>
            </div>
          </div>

          {/* Card 2: Smarter support, measurable impact */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={18} color="var(--teal-primary)" />
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800 }}>Smarter support, measurable impact</h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--teal-primary)' }}>94.2%</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>AI triage accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>12 min</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>First response</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>96%</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>SLA compliance</div>
              </div>
            </div>

            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em', marginBottom: '8px' }}>
              CUSTOMER SENTIMENT
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <span style={{
                background: 'var(--danger-soft)',
                color: 'var(--danger-text)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}>
                Negative 54%
              </span>
              <span style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}>
                Neutral 31%
              </span>
              <span style={{
                background: 'var(--teal-soft)',
                color: 'var(--teal-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}>
                Positive 15%
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              AI suggests category, sentiment and routing. Staff review every decision before responding.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
