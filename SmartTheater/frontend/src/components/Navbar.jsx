import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Film, MapPin, User, ShieldCheck, Headphones, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, switchPersona } = useAuth();
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(20px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--gold), #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px var(--gold-glow)',
            }}>
              <Film size={20} color="#0f172a" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                SmartTheater
              </span>
            </div>
          </Link>

          {/* Navigation links (Customer experience) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link
              to="/"
              style={{
                fontSize: '0.92rem',
                fontWeight: 500,
                color: isActive('/') ? 'var(--gold)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}
            >
              Movies
            </Link>
            <Link
              to="/support"
              style={{
                fontSize: '0.92rem',
                fontWeight: 500,
                color: isActive('/support') ? 'var(--gold)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}
            >
              Support
            </Link>
          </div>
        </div>

        {/* Right Section: Location + Quick Persona Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Location badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}>
            <MapPin size={15} color="var(--gold)" />
            <span>Bengaluru</span>
          </div>

          {/* Dedicated workspace links for quick jump */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/staff/tickets"
              className="badge badge-ai"
              style={{
                cursor: 'pointer',
                padding: '6px 12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Open Staff Support Queue"
            >
              <Headphones size={13} />
              <span>Staff Queue</span>
            </Link>

            <Link
              to="/admin/analytics"
              className="badge badge-gold"
              style={{
                cursor: 'pointer',
                padding: '6px 12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Open Admin Analytics"
            >
              <ShieldCheck size={13} />
              <span>Admin Analytics</span>
            </Link>
          </div>

          {/* User Persona Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '5px 12px 5px 6px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-main)',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: user?.role === 'admin'
                  ? 'linear-gradient(135deg, #d97706, #f59e0b)'
                  : user?.role === 'staff'
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'linear-gradient(135deg, #2563eb, #38bdf8)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {user?.initials || 'AS'}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.full_name || 'Arjun Shah'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                  {user?.role || 'Customer'}
                </div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Persona Switcher Menu */}
            {roleMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '260px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 200,
                }}
              >
                <div style={{
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Switch Persona (Evaluator Mode)
                </div>

                <div
                  onClick={() => { switchPersona('customer'); setRoleMenuOpen(false); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: user?.role === 'customer' ? 'var(--bg-surface)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    AS
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Arjun Shah</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Customer (Booking Flow)</div>
                  </div>
                </div>

                <div
                  onClick={() => { switchPersona('staff'); setRoleMenuOpen(false); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: user?.role === 'staff' ? 'var(--bg-surface)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    MN
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Meera Nair</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Staff (Ticket Triage Lead)</div>
                  </div>
                </div>

                <div
                  onClick={() => { switchPersona('admin'); setRoleMenuOpen(false); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: user?.role === 'admin' ? 'var(--bg-surface)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                    PM
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Priya Mehta</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Admin (Analytics & Operations)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
