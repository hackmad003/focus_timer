/**
 * Statistics Panel Component
 * Displays user statistics and analytics
 */

import React, { useState } from 'react';
import { useStatisticsStore } from '@/store/useStatisticsStore';
import { formatDuration } from '@/utils/time';
import { FaChartLine, FaDownload, FaTrash } from 'react-icons/fa';
import { StatisticsChart } from './StatisticsChart';
import './StatisticsPanel.css';

interface StatisticsPanelProps {
  onClose: () => void;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ onClose }) => {
  const statistics = useStatisticsStore();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleExport = () => {
    const data = statistics.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-timer-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    statistics.resetStatistics();
    setShowConfirmReset(false);
  };

  return (
    <div className="statistics-overlay" onClick={onClose}>
      <div className="statistics-panel" onClick={(e) => e.stopPropagation()}>
        <div className="statistics-header">
          <h2>📊 Your Statistics</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close statistics">
            ✕
          </button>
        </div>

        <div className="statistics-content">
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{statistics.totalFocusSessions}</div>
              <div className="stat-label">Total Focus Sessions</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{formatDuration(statistics.totalFocusTime)}</div>
              <div className="stat-label">Total Focus Time</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{statistics.currentStreak}</div>
              <div className="stat-label">Current Streak (days)</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{statistics.longestStreak}</div>
              <div className="stat-label">Longest Streak (days)</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">{formatDuration(statistics.averageFocusTime)}</div>
              <div className="stat-label">Avg Focus Time/Day</div>
            </div>

            {statistics.mostProductiveHour !== undefined && (
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-value">
                  {statistics.mostProductiveHour}:00
                </div>
                <div className="stat-label">Most Productive Hour</div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="chart-section">
            <h3>Focus Time Over Last 7 Days</h3>
            <StatisticsChart />
          </div>

          {/* Actions */}
          <div className="statistics-actions">
            <button className="action-btn export" onClick={handleExport}>
              <FaDownload />
              <span>Export Data</span>
            </button>

            {!showConfirmReset ? (
              <button
                className="action-btn reset"
                onClick={() => setShowConfirmReset(true)}
              >
                <FaTrash />
                <span>Reset Statistics</span>
              </button>
            ) : (
              <div className="confirm-reset">
                <span>Are you sure?</span>
                <button className="btn-danger" onClick={handleReset}>
                  Yes, Reset
                </button>
                <button className="btn-secondary" onClick={() => setShowConfirmReset(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
