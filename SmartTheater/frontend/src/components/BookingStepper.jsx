import React from 'react';
import { Check } from 'lucide-react';

export default function BookingStepper({ currentStep = 1 }) {
  const steps = [
    { num: 1, label: 'Choose showtime' },
    { num: 2, label: 'Select seats' },
    { num: 3, label: 'Payment' },
    { num: 4, label: 'Your ticket' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      margin: '20px auto 30px',
      maxWidth: '720px',
      padding: '0 16px',
    }}>
      {steps.map((s, idx) => {
        const isDone = s.num < currentStep;
        const isActive = s.num === currentStep;

        return (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: isDone
                  ? 'var(--gold)'
                  : isActive
                  ? 'var(--gold)'
                  : 'var(--bg-card)',
                color: isDone || isActive ? '#0f172a' : 'var(--text-dim)',
                border: isDone || isActive
                  ? 'none'
                  : '1px solid var(--border-medium)',
                boxShadow: isActive ? '0 0 12px var(--gold-glow)' : 'none',
              }}>
                {isDone ? <Check size={16} strokeWidth={3} /> : s.num}
              </div>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-main)' : isDone ? 'var(--text-muted)' : 'var(--text-dim)',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                background: isDone ? 'var(--gold)' : 'var(--border-subtle)',
                transition: 'background 0.3s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
