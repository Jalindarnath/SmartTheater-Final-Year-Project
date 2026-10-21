import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Film, Ticket, LifeBuoy, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.checkHealth()
      .then(res => {
        if (mounted && res.status === 'ok') setBackendOnline(true);
      })
      .catch(() => {
        if (mounted) setBackendOnline(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand-link">
          <div className="brand-icon">
            <Film size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-text">SmartTheater</span>
              <span className="brand-badge">Review 4</span>
            </div>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
          >
            <Film size={16} />
            <span>Movies</span>
          </NavLink>

          <NavLink 
            to="/support" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LifeBuoy size={16} />
            <span>Support Triage</span>
          </NavLink>

          <NavLink 
            to="/admin" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <ShieldCheck size={16} />
            <span>Admin Queue</span>
          </NavLink>

          <div className="system-status" title={backendOnline ? 'Backend SQLite connected' : 'Connecting to backend...'}>
            <span className={`status-dot ${backendOnline ? '' : 'status-dot-offline'}`} style={backendOnline ? {} : { backgroundColor: '#ef4444', boxShadow: 'none' }}></span>
            <span>{backendOnline ? 'Backend Active' : 'Checking API...'}</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
