import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-primary)',
      padding: '36px 0',
      marginTop: '60px',
      transition: 'background-color 0.25s ease, border-color 0.25s ease',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        color: 'var(--text-muted)',
        fontSize: '0.86rem',
      }}>
        <div>
          <span>© 2026 SmartTheater. A smarter way to experience cinema.</span>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          <a href="#privacy" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>
            Privacy policy
          </a>
          <a href="#terms" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>
            Terms of service
          </a>
          <Link to="/support" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>
            Help center
          </Link>
        </div>
      </div>
    </footer>
  );
}
