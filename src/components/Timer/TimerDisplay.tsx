/**
 * Timer Display Component
 * Shows the current time with flip-card animation
 */

import React from 'react';
import { formatTime } from '@/utils/time';
import { SessionType } from '@/types';
import './TimerDisplay.css';

interface TimerDisplayProps {
  timeRemaining: number;
  sessionType: SessionType;
  isRunning: boolean;
}

/**
 * Individual digit card with flip animation
 */
const DigitCard: React.FC<{ digit: string; animate: boolean }> = ({ digit, animate }) => {
  return (
    <div className={`digit-card ${animate ? 'flip' : ''}`}>
      <div className="digit-card-inner">
        <div className="digit-card-face">{digit}</div>
      </div>
    </div>
  );
};

/**
 * Main timer display component
 */
export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  sessionType,
  isRunning,
}) => {
  const timeStr = formatTime(timeRemaining, true);
  const [hours, minutes, seconds] = timeStr.split(':');
  const [prevTime, setPrevTime] = React.useState(timeStr);

  React.useEffect(() => {
    setPrevTime(timeStr);
  }, [timeStr]);

  // Determine which digits changed for animation
  const hoursChanged = prevTime.split(':')[0] !== hours;
  const minutesChanged = prevTime.split(':')[1] !== minutes;
  const secondsChanged = prevTime.split(':')[2] !== seconds;

  // Session type indicator
  const getSessionColor = () => {
    switch (sessionType) {
      case SessionType.FOCUS:
        return 'focus';
      case SessionType.SHORT_BREAK:
        return 'break';
      case SessionType.LONG_BREAK:
        return 'long-break';
    }
  };

  const getSessionLabel = () => {
    switch (sessionType) {
      case SessionType.FOCUS:
        return 'Focus Session';
      case SessionType.SHORT_BREAK:
        return 'Short Break';
      case SessionType.LONG_BREAK:
        return 'Long Break';
    }
  };

  return (
    <div className="timer-display-container">
      <div className={`session-indicator ${getSessionColor()}`}>
        <span className="session-icon">
          {sessionType === SessionType.FOCUS && '🎯'}
          {sessionType === SessionType.SHORT_BREAK && '☕'}
          {sessionType === SessionType.LONG_BREAK && '🌟'}
        </span>
        <span className="session-label">{getSessionLabel()}</span>
      </div>

      <div className={`timer-display ${isRunning ? 'running' : ''} ${getSessionColor()}`}>
        <div className="time-group">
          <DigitCard digit={hours[0]} animate={hoursChanged} />
          <DigitCard digit={hours[1]} animate={hoursChanged} />
        </div>

        <div className="time-separator">:</div>

        <div className="time-group">
          <DigitCard digit={minutes[0]} animate={minutesChanged} />
          <DigitCard digit={minutes[1]} animate={minutesChanged} />
        </div>

        <div className="time-separator">:</div>

        <div className="time-group">
          <DigitCard digit={seconds[0]} animate={secondsChanged} />
          <DigitCard digit={seconds[1]} animate={secondsChanged} />
        </div>
      </div>

      {isRunning && (
        <div className="progress-indicator">
          <div className="pulse-ring"></div>
        </div>
      )}
    </div>
  );
};
