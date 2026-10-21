import React from 'react';
import { Check } from 'lucide-react';

export default function BookingStepper({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: 'Select Movie' },
    { number: 2, label: 'Choose Seats' },
    { number: 3, label: 'Confirmation' }
  ];

  return (
    <div className="booking-stepper">
      {steps.map((step, idx) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <React.Fragment key={step.number}>
            <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-number">
                {isCompleted ? <Check size={14} /> : step.number}
              </div>
              <span>{step.label}</span>
            </div>
            {idx < steps.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
