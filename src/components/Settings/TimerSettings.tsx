/**
 * Timer Settings Component
 * Configuration for timer durations and behavior
 */

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTimerStore } from '@/store/useTimerStore';
import { TIMER_PRESETS, DURATION_LIMITS } from '@/utils/constants';
import { TimerMode } from '@/types';
import './SettingsForm.css';

export const TimerSettings: React.FC = () => {
  const settings = useSettingsStore();
  const timer = useTimerStore();

  const handleDurationChange = (field: string, value: number) => {
    try {
      settings.updateSettings({ [field]: value });
      timer.updateFromSettings(settings);
    } catch (error) {
      console.error('Invalid duration:', error);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = TIMER_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      settings.applyPreset(preset);
      timer.updateFromSettings(settings);
    }
  };

  return (
    <div className="settings-section">
      <h3 className="section-title">Timer Configuration</h3>

      {/* Presets */}
      <div className="form-group">
        <label className="form-label">Quick Presets</label>
        <div className="preset-grid">
          {TIMER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="preset-btn"
              onClick={() => handlePresetSelect(preset.id)}
            >
              <span className="preset-icon">{preset.icon}</span>
              <span className="preset-name">{preset.name}</span>
              <span className="preset-time">{preset.focusDuration}m</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration Settings */}
      <div className="form-group">
        <label className="form-label" htmlFor="focus-duration">
          Focus Duration (minutes)
        </label>
        <input
          type="number"
          id="focus-duration"
          className="form-input"
          value={settings.focusDuration}
          onChange={(e) => handleDurationChange('focusDuration', parseInt(e.target.value))}
          min={DURATION_LIMITS.MIN_FOCUS}
          max={DURATION_LIMITS.MAX_FOCUS}
        />
        <span className="form-help">
          How long each focus session lasts ({DURATION_LIMITS.MIN_FOCUS}-{DURATION_LIMITS.MAX_FOCUS} minutes)
        </span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="short-break-duration">
          Short Break Duration (minutes)
        </label>
        <input
          type="number"
          id="short-break-duration"
          className="form-input"
          value={settings.shortBreakDuration}
          onChange={(e) => handleDurationChange('shortBreakDuration', parseInt(e.target.value))}
          min={DURATION_LIMITS.MIN_BREAK}
          max={DURATION_LIMITS.MAX_BREAK}
        />
        <span className="form-help">
          Short break between focus sessions ({DURATION_LIMITS.MIN_BREAK}-{DURATION_LIMITS.MAX_BREAK} minutes)
        </span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="long-break-duration">
          Long Break Duration (minutes)
        </label>
        <input
          type="number"
          id="long-break-duration"
          className="form-input"
          value={settings.longBreakDuration}
          onChange={(e) => handleDurationChange('longBreakDuration', parseInt(e.target.value))}
          min={DURATION_LIMITS.MIN_BREAK}
          max={DURATION_LIMITS.MAX_BREAK}
        />
        <span className="form-help">
          Longer break after completing multiple sessions
        </span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="long-break-interval">
          Long Break Interval (sessions)
        </label>
        <input
          type="number"
          id="long-break-interval"
          className="form-input"
          value={settings.longBreakInterval}
          onChange={(e) => handleDurationChange('longBreakInterval', parseInt(e.target.value))}
          min={DURATION_LIMITS.MIN_LONG_BREAK_INTERVAL}
          max={DURATION_LIMITS.MAX_LONG_BREAK_INTERVAL}
        />
        <span className="form-help">
          Take a long break after this many focus sessions
        </span>
      </div>

      {/* Timer Mode */}
      <div className="form-group">
        <label className="form-label">Timer Mode</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="timer-mode"
              checked={settings.timerMode === TimerMode.COUNTDOWN}
              onChange={() => settings.updateSettings({ timerMode: TimerMode.COUNTDOWN })}
            />
            <span>Countdown (default)</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="timer-mode"
              checked={settings.timerMode === TimerMode.COUNTUP}
              onChange={() => settings.updateSettings({ timerMode: TimerMode.COUNTUP })}
            />
            <span>Count Up</span>
          </label>
        </div>
      </div>

      {/* Auto-start Options */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.autoStartBreaks}
            onChange={(e) => settings.updateSettings({ autoStartBreaks: e.target.checked })}
          />
          <span>Auto-start breaks</span>
        </label>
        <span className="form-help">Automatically start break timers</span>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.autoStartPomodoros}
            onChange={(e) => settings.updateSettings({ autoStartPomodoros: e.target.checked })}
          />
          <span>Auto-start focus sessions</span>
        </label>
        <span className="form-help">Automatically start next focus session after break</span>
      </div>
    </div>
  );
};
