import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, ChevronDown, Sun, Moon, Laptop, ShieldCheck, Headphones, Ticket, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, switchPersona, DEMO_USERS } = useAuth();
  const { themePreference, resolvedTheme, setThemeMode, toggleTheme } = useTheme();
  const location = useLocation();

  const [locationOpen, setLocationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Bengaluru');

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/movies';
    return location.pathname.startsWith(path);
  };

  const cities = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai'];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background-color 0.25s ease, border-color 0.25s ease',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Left: Brand Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Exact spiral iris brand logo from PDF */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#0d9488" strokeWidth="2.5" />
              <path d="M16 4C22.6274 4 28 9.37258 28 16" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
              <circle cx="16" cy="16" r="6" fill="#0f766e" />
              <path d="M10 16C10 12.6863 12.6863 10 16 10" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.28rem',
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
            }}>
              SmartTheater
            </span>
          </Link>

          {/* Main Nav Links (Movies · My Bookings · Support) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link
              to="/movies"
              style={{
                fontSize: '0.94rem',
                fontWeight: isActive('/') ? 600 : 500,
                color: isActive('/') ? 'var(--text-main)' : 'var(--text-muted)',
                position: 'relative',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
            >
              Movies
              {isActive('/') && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--teal-primary)',
                  borderRadius: '2px',
                }} />
              )}
            </Link>

            <Link
              to="/my-bookings"
              style={{
                fontSize: '0.94rem',
                fontWeight: isActive('/my-bookings') ? 600 : 500,
                color: isActive('/my-bookings') ? 'var(--text-main)' : 'var(--text-muted)',
                position: 'relative',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
            >
              My Bookings
              {isActive('/my-bookings') && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--teal-primary)',
                  borderRadius: '2px',
                }} />
              )}
            </Link>

            <Link
              to="/support"
              style={{
                fontSize: '0.94rem',
                fontWeight: isActive('/support') ? 600 : 500,
                color: isActive('/support') ? 'var(--text-main)' : 'var(--text-muted)',
                position: 'relative',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
            >
              Support
              {isActive('/support') && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--teal-primary)',
                  borderRadius: '2px',
                }} />
              )}
            </Link>
          </div>
        </div>

        {/* Right Section: Location + Theme Switcher + User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Location Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setLocationOpen(!locationOpen);
                setUserMenuOpen(false);
                setThemeMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--text-main)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <MapPin size={16} color="var(--text-muted)" />
              <span>{currentCity}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {locationOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px 0',
                minWidth: '150px',
                zIndex: 200,
              }}>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setCurrentCity(city);
                      setLocationOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      fontSize: '0.88rem',
                      color: city === currentCity ? 'var(--teal-primary)' : 'var(--text-main)',
                      fontWeight: city === currentCity ? 600 : 400,
                      background: city === currentCity ? 'var(--teal-soft)' : 'transparent',
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher (System / Dark / Light) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setThemeMenuOpen(!themeMenuOpen);
                setLocationOpen(false);
                setUserMenuOpen(false);
              }}
              title={`Current Theme: ${themePreference === 'system' ? `System (${resolvedTheme})` : themePreference}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 500,
              }}
            >
              {themePreference === 'system' ? (
                <Laptop size={15} color="var(--teal-primary)" />
              ) : resolvedTheme === 'dark' ? (
                <Moon size={15} color="#38bdf8" />
              ) : (
                <Sun size={15} color="#f59e0b" />
              )}
              <span style={{ textTransform: 'capitalize' }}>
                {themePreference === 'system' ? `Auto (${resolvedTheme})` : themePreference}
              </span>
              <ChevronDown size={13} color="var(--text-dim)" />
            </button>

            {themeMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                minWidth: '160px',
                zIndex: 200,
              }}>
                <button
                  onClick={() => {
                    setThemeMode('system');
                    setThemeMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.86rem',
                    borderRadius: 'var(--radius-sm)',
                    background: themePreference === 'system' ? 'var(--teal-soft)' : 'transparent',
                    color: themePreference === 'system' ? 'var(--teal-primary)' : 'var(--text-main)',
                    fontWeight: themePreference === 'system' ? 600 : 400,
                  }}
                >
                  <Laptop size={16} />
                  <span>System (Auto)</span>
                </button>
                <button
                  onClick={() => {
                    setThemeMode('light');
                    setThemeMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.86rem',
                    borderRadius: 'var(--radius-sm)',
                    background: themePreference === 'light' ? 'var(--teal-soft)' : 'transparent',
                    color: themePreference === 'light' ? 'var(--teal-primary)' : 'var(--text-main)',
                    fontWeight: themePreference === 'light' ? 600 : 400,
                  }}
                >
                  <Sun size={16} color="#f59e0b" />
                  <span>Light Mode</span>
                </button>
                <button
                  onClick={() => {
                    setThemeMode('dark');
                    setThemeMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.86rem',
                    borderRadius: 'var(--radius-sm)',
                    background: themePreference === 'dark' ? 'var(--teal-soft)' : 'transparent',
                    color: themePreference === 'dark' ? 'var(--teal-primary)' : 'var(--text-main)',
                    fontWeight: themePreference === 'dark' ? 600 : 400,
                  }}
                >
                  <Moon size={16} color="#38bdf8" />
                  <span>Dark Mode</span>
                </button>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

          {/* User Profile Avatar (AS Arjun ⌄) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setLocationOpen(false);
                setThemeMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {/* Initials circle */}
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#134e4a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}>
                {user?.initials || 'AS'}
              </div>
              <span style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}>
                {user?.full_name ? user.full_name.split(' ')[0] : 'Arjun'}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '10px',
                minWidth: '240px',
                zIndex: 200,
              }}>
                <div style={{ padding: '6px 12px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {user?.full_name || 'Arjun Shah'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {user?.email || 'arjun.shah@gmail.com'}
                  </div>
                  <div style={{
                    marginTop: '6px',
                    display: 'inline-block',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: 'var(--teal-primary)',
                    background: 'var(--teal-soft)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    {user?.role || 'Customer'}
                  </div>
                </div>

                {/* Workspace Navigation */}
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <Link
                    to="/my-bookings"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      fontSize: '0.86rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <Ticket size={16} color="var(--text-muted)" />
                    <span>My Bookings</span>
                  </Link>
                  <Link
                    to="/staff/tickets"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      fontSize: '0.86rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <Headphones size={16} color="var(--teal-primary)" />
                    <span>Staff Workspace (Ticket Queue)</span>
                  </Link>
                  <Link
                    to="/admin/analytics"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      fontSize: '0.86rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <LayoutDashboard size={16} color="#3b82f6" />
                    <span>Admin Platform Overview</span>
                  </Link>
                </div>

                {/* Persona Switcher Quick Helper */}
                <div style={{ padding: '8px 6px 4px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', padding: '0 6px 6px' }}>
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => {
                      switchPersona('customer');
                      setUserMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span>Arjun Shah (Customer)</span>
                    {user?.role === 'customer' && <span style={{ color: 'var(--teal-primary)', fontWeight: 700 }}>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchPersona('staff');
                      setUserMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span>Meera Nair (Staff Lead)</span>
                    {user?.role === 'staff' && <span style={{ color: 'var(--teal-primary)', fontWeight: 700 }}>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchPersona('admin');
                      setUserMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span>Priya Mehta (Admin)</span>
                    {user?.role === 'admin' && <span style={{ color: 'var(--teal-primary)', fontWeight: 700 }}>✓</span>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
