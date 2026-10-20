import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(8, 11, 17, 0.95)',
      padding: '40px 0 30px',
      marginTop: '60px',
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        color: 'var(--text-dim)',
        fontSize: '0.86rem',
      }}>
        <div>
          <span>© 2026 SmartTheater. A smarter way to experience cinema.</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#privacy" style={{ color: 'var(--text-muted)' }}>Privacy policy</a>
          <a href="#terms" style={{ color: 'var(--text-muted)' }}>Terms of service</a>
          <Link to="/support" style={{ color: 'var(--text-muted)' }}>Help center</Link>
        </div>
      </div>
    </footer>
  );
}
