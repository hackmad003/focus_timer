/**
 * Settings Panel Component
 * Main settings interface with tabs for different configuration sections
 */

import React, { useState } from 'react';
import { FaCog, FaBell, FaMusic, FaPalette, FaAccessibleIcon } from 'react-icons/fa';
import { TimerSettings } from './TimerSettings';
import { NotificationSettings } from './NotificationSettings';
import { AudioSettings } from './AudioSettings';
import { DisplaySettings } from './DisplaySettings';
import { AccessibilitySettings } from './AccessibilitySettings';
import './SettingsPanel.css';

type SettingsTab = 'timer' | 'notifications' | 'audio' | 'display' | 'accessibility';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('timer');

  const tabs = [
    { id: 'timer' as const, label: 'Timer', icon: <FaCog /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <FaBell /> },
    { id: 'audio' as const, label: 'Audio', icon: <FaMusic /> },
    { id: 'display' as const, label: 'Display', icon: <FaPalette /> },
    { id: 'accessibility' as const, label: 'Accessibility', icon: <FaAccessibleIcon /> },
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'timer' && <TimerSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'audio' && <AudioSettings />}
          {activeTab === 'display' && <DisplaySettings />}
          {activeTab === 'accessibility' && <AccessibilitySettings />}
        </div>
      </div>
    </div>
  );
};
