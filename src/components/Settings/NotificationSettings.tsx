/**
 * Notification Settings Component
 * Configuration for notifications and alerts
 */

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { NotificationSound } from '@/types';
import { audioService } from '@/services/AudioService';
import './SettingsForm.css';

export const NotificationSettings: React.FC = () => {
  const settings = useSettingsStore();
  const { permission, isGranted, requestPermission, isRequesting } = useNotificationPermission();

  const handleSoundTest = () => {
    audioService.playNotificationSound(settings.notificationSound, settings.notificationVolume);
  };

  return (
    <div className="settings-section">
      <h3 className="section-title">Notifications & Alerts</h3>

      {/* Desktop Notifications */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.enableDesktopNotifications}
            onChange={(e) => settings.updateSettings({ enableDesktopNotifications: e.target.checked })}
            disabled={!isGranted}
          />
          <span>Enable desktop notifications</span>
        </label>
        <span className="form-help">Show notifications when sessions complete</span>
      </div>

      {/* Permission Status */}
      {permission !== 'granted' && permission !== 'unsupported' && (
        <div className="form-group">
          <button
            className="btn-primary"
            onClick={requestPermission}
            disabled={isRequesting || permission === 'denied'}
          >
            {permission === 'denied'
              ? 'Notifications Blocked'
              : isRequesting
              ? 'Requesting...'
              : 'Grant Notification Permission'}
          </button>
          {permission === 'denied' && (
            <span className="form-help error">
              Notifications are blocked. Please enable them in your browser settings.
            </span>
          )}
        </div>
      )}

      {/* Notification Sound */}
      <div className="form-group">
        <label className="form-label" htmlFor="notification-sound">
          Notification Sound
        </label>
        <div className="input-group">
          <select
            id="notification-sound"
            className="form-select"
            value={settings.notificationSound}
            onChange={(e) =>
              settings.updateSettings({ notificationSound: e.target.value as NotificationSound })
            }
          >
            {Object.values(NotificationSound).map((sound) => (
              <option key={sound} value={sound}>
                {sound.charAt(0) + sound.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button
            className="btn-secondary"
            onClick={handleSoundTest}
            disabled={settings.notificationSound === NotificationSound.NONE}
          >
            Test
          </button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="form-group">
        <label className="form-label" htmlFor="notification-volume">
          Notification Volume
        </label>
        <div className="slider-group">
          <input
            type="range"
            id="notification-volume"
            className="form-slider"
            value={settings.notificationVolume}
            onChange={(e) =>
              settings.updateSettings({ notificationVolume: parseInt(e.target.value) })
            }
            min={0}
            max={100}
            step={5}
          />
          <span className="slider-value">{settings.notificationVolume}%</span>
        </div>
      </div>

      {/* Vibration */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.enableVibration}
            onChange={(e) => settings.updateSettings({ enableVibration: e.target.checked })}
          />
          <span>Enable vibration (mobile)</span>
        </label>
        <span className="form-help">Vibrate device on notifications</span>
      </div>
    </div>
  );
};
