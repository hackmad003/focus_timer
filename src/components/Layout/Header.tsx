/**
 * Header Component
 * Top navigation bar
 */

import React from 'react';
import { FaCog, FaChartBar } from 'react-icons/fa';
import './Header.css';

interface HeaderProps {
  onSettingsClick: () => void;
  onStatisticsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onStatisticsClick }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="app-logo">
          <span className="logo-icon">🎯</span>
          <h1 className="app-title">Focus Timer Pro</h1>
        </div>

        <nav className="header-nav">
          <button
            className="nav-btn"
            onClick={onStatisticsClick}
            aria-label="View statistics"
            title="Statistics"
          >
            <FaChartBar />
            <span className="nav-label">Stats</span>
          </button>

          <button
            className="nav-btn"
            onClick={onSettingsClick}
            aria-label="Open settings"
            title="Settings"
          >
            <FaCog />
            <span className="nav-label">Settings</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
