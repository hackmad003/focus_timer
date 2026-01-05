/**
 * Session Counter Component
 * Displays current focus session count and progress towards long break
 */

import React from 'react';
import './SessionCounter.css';

interface SessionCounterProps {
  currentCount: number;
  totalCount: number;
}

export const SessionCounter: React.FC<SessionCounterProps> = ({ currentCount, totalCount }) => {
  return (
    <div className="session-counter">
      <div className="counter-label">Focus Sessions</div>
      <div className="counter-indicators">
        {Array.from({ length: totalCount }).map((_, index) => (
          <div
            key={index}
            className={`indicator ${index < currentCount ? 'completed' : ''}`}
            aria-label={`Session ${index + 1} ${index < currentCount ? 'completed' : 'pending'}`}
          >
            {index < currentCount && '✓'}
          </div>
        ))}
      </div>
      <div className="counter-text">
        {currentCount} of {totalCount} completed
      </div>
    </div>
  );
};
