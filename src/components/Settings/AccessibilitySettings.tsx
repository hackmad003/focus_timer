/**
 * Accessibility Settings Component
 * Configuration for accessibility features
 */

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import './SettingsForm.css';

export const AccessibilitySettings: React.FC = () => {
  const settings = useSettingsStore();

  return (
    <div className="settings-section">
      <h3 className="section-title">Accessibility</h3>

      {/* High Contrast */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => settings.updateSettings({ highContrast: e.target.checked })}
          />
          <span>High contrast mode</span>
        </label>
        <span className="form-help">Increases contrast for better visibility</span>
      </div>

      {/* Font Size */}
      <div className="form-group">
        <label className="form-label" htmlFor="font-size">
          Font Size
        </label>
        <div className="slider-group">
          <input
            type="range"
            id="font-size"
            className="form-slider"
            value={settings.fontSize}
            onChange={(e) => settings.updateSettings({ fontSize: parseInt(e.target.value) })}
            min={50}
            max={200}
            step={25}
          />
          <span className="slider-value">{settings.fontSize}%</span>
        </div>
        <span className="form-help">Adjust text size throughout the application</span>
      </div>

      {/* Reduce Motion */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.reduceMotion}
            onChange={(e) => settings.updateSettings({ reduceMotion: e.target.checked })}
          />
          <span>Reduce motion</span>
        </label>
        <span className="form-help">Minimize animations and transitions</span>
      </div>

      <div className="info-box">
        <strong>ℹ️ Screen Reader Support:</strong> This application supports screen readers and
        keyboard navigation. Press Tab to navigate between elements and Space/Enter to activate
        buttons.
      </div>
    </div>
  );
};
