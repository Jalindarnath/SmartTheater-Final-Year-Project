import React from 'react';
import { Check } from 'lucide-react';

export default function BookingStepper({ currentStep = 2 }) {
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
      gap: '14px',
      margin: '28px auto 36px',
      maxWidth: '780px',
      padding: '0 20px',
    }}>
      {steps.map((s, idx) => {
        const isDone = s.num < currentStep;
        const isActive = s.num === currentStep;

        return (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: isDone
                  ? 'var(--teal-primary)'
                  : isActive
                  ? 'var(--btn-navy-bg)'
                  : 'transparent',
                color: isDone
                  ? '#ffffff'
                  : isActive
                  ? 'var(--btn-navy-text)'
                  : 'var(--text-dim)',
                border: isDone || isActive
                  ? 'none'
                  : '1.5px solid var(--border-medium)',
                transition: 'all 0.2s ease',
              }}>
                {isDone ? <Check size={14} strokeWidth={2.8} /> : s.num}
              </div>
              <span style={{
                fontSize: '0.88rem',
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
                minWidth: '24px',
                maxWidth: '60px',
                height: '1px',
                background: isDone ? 'var(--teal-primary)' : 'var(--border-subtle)',
                transition: 'background 0.25s ease',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
