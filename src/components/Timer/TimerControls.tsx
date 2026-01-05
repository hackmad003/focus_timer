/**
 * Timer Controls Component
 * Control buttons for the timer
 */

import React from 'react';
import { FaPlay, FaPause, FaRedo, FaForward } from 'react-icons/fa';
import { TimerState } from '@/types';
import { vibrationService } from '@/services/VibrationService';
import './TimerControls.css';

interface TimerControlsProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

/**
 * Timer control buttons
 */
export const TimerControls: React.FC<TimerControlsProps> = ({
  state,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}) => {
  const handlePrimaryAction = () => {
    vibrationService.short();
    
    if (state === TimerState.IDLE || state === TimerState.COMPLETED) {
      onStart();
    } else if (state === TimerState.RUNNING) {
      onPause();
    } else if (state === TimerState.PAUSED) {
      onResume();
    }
  };

  const handleReset = () => {
    vibrationService.short();
    onReset();
  };

  const handleSkip = () => {
    vibrationService.short();
    onSkip();
  };

  const getPrimaryButtonLabel = () => {
    switch (state) {
      case TimerState.IDLE:
      case TimerState.COMPLETED:
        return 'Start';
      case TimerState.RUNNING:
        return 'Pause';
      case TimerState.PAUSED:
        return 'Resume';
    }
  };

  const getPrimaryButtonIcon = () => {
    if (state === TimerState.RUNNING) {
      return <FaPause />;
    }
    return <FaPlay />;
  };

  return (
    <div className="timer-controls">
      {/* Secondary Controls */}
      <div className="secondary-controls">
        <button
          className="control-btn control-btn-secondary"
          onClick={handleReset}
          disabled={state === TimerState.IDLE}
          aria-label="Reset timer"
          title="Reset (R)"
        >
          <FaRedo />
          <span className="control-label">Reset</span>
        </button>

        <button
          className="control-btn control-btn-secondary"
          onClick={handleSkip}
          disabled={state === TimerState.IDLE}
          aria-label="Skip to next session"
          title="Skip (S)"
        >
          <FaForward />
          <span className="control-label">Skip</span>
        </button>
      </div>

      {/* Primary Control */}
      <button
        className={`control-btn control-btn-primary ${state === TimerState.RUNNING ? 'running' : ''}`}
        onClick={handlePrimaryAction}
        aria-label={getPrimaryButtonLabel()}
        title={`${getPrimaryButtonLabel()} (Space)`}
      >
        <span className="btn-icon">{getPrimaryButtonIcon()}</span>
        <span className="btn-label">{getPrimaryButtonLabel()}</span>
      </button>

      {/* Keyboard Shortcuts Help */}
      <div className="keyboard-shortcuts-hint">
        <span className="shortcut-item">
          <kbd>Space</kbd> {getPrimaryButtonLabel()}
        </span>
        <span className="shortcut-item">
          <kbd>R</kbd> Reset
        </span>
        <span className="shortcut-item">
          <kbd>S</kbd> Skip
        </span>
      </div>
    </div>
  );
};
