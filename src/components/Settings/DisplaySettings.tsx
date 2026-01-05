/**
 * Display Settings Component
 * Configuration for theme and display preferences
 */

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Theme } from '@/types';
import './SettingsForm.css';

export const DisplaySettings: React.FC = () => {
  const settings = useSettingsStore();

  return (
    <div className="settings-section">
      <h3 className="section-title">Display & Theme</h3>

      {/* Theme Selection */}
      <div className="form-group">
        <label className="form-label">Theme</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="theme"
              checked={settings.theme === Theme.DARK}
              onChange={() => settings.updateSettings({ theme: Theme.DARK })}
            />
            <span>🌙 Dark</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="theme"
              checked={settings.theme === Theme.LIGHT}
              onChange={() => settings.updateSettings({ theme: Theme.LIGHT })}
            />
            <span>☀️ Light</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="theme"
              checked={settings.theme === Theme.AUTO}
              onChange={() => settings.updateSettings({ theme: Theme.AUTO })}
            />
            <span>🔄 Auto</span>
          </label>
        </div>
      </div>

      {/* Time Format */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.show24HourFormat}
            onChange={(e) => settings.updateSettings({ show24HourFormat: e.target.checked })}
          />
          <span>Use 24-hour time format</span>
        </label>
      </div>

      {/* Show Milliseconds */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.showMilliseconds}
            onChange={(e) => settings.updateSettings({ showMilliseconds: e.target.checked })}
          />
          <span>Show milliseconds</span>
        </label>
        <span className="form-help">Display more precise time (00:00:00:00)</span>
      </div>
    </div>
  );
};
