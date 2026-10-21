import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div>
          <strong style={{ color: '#f8fafc' }}>SmartTheater</strong> — Review 4 Academic Prototype
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
            Intelligent Movie Booking & Automated Support Ticket Triage and Routing System
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem' }}>
          <Link to="/" style={{ color: '#94a3b8' }}>Movies</Link>
          <Link to="/support" style={{ color: '#94a3b8' }}>Customer Support</Link>
          <Link to="/admin" style={{ color: '#94a3b8' }}>Admin Dashboard</Link>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          Demo Mode • SQLite Persistent Store • Rule-Based Explainable Triage
        </div>
      </div>
    </footer>
  );
}
