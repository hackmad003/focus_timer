/**
 * Timer Page Component
 * Main timer interface
 */

import React, { useState, useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStatisticsStore } from '@/store/useStatisticsStore';
import { Header } from '@/components/Layout/Header';
import { TimerDisplay } from '@/components/Timer/TimerDisplay';
import { TimerControls } from '@/components/Timer/TimerControls';
import { SessionCounter } from '@/components/Timer/SessionCounter';
import { TaskLabel } from '@/components/Timer/TaskLabel';
import { SettingsPanel } from '@/components/Settings/SettingsPanel';
import { StatisticsPanel } from '@/components/Statistics/StatisticsPanel';
import './TimerPage.css';

export const TimerPage: React.FC = () => {
  const timer = useTimer();
  const settings = useSettingsStore();
  const statistics = useStatisticsStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  // Enable keyboard shortcuts
  useKeyboardShortcuts(!showSettings && !showStatistics);

  // Load data on mount
  useEffect(() => {
    settings.loadSettings();
    statistics.loadStatistics();
  }, []);

  // Apply theme and accessibility settings
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme.toLowerCase());
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast));
    document.documentElement.setAttribute('data-reduce-motion', String(settings.reduceMotion));
    document.documentElement.setAttribute('data-font-size', String(settings.fontSize));
  }, [settings.theme, settings.highContrast, settings.reduceMotion, settings.fontSize]);

  return (
    <div className="timer-page">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        onStatisticsClick={() => setShowStatistics(true)}
      />

      <main className="timer-main">
        <div className="timer-container">
          <TaskLabel
            taskLabel={timer.taskLabel}
            onTaskLabelChange={timer.setTaskLabel}
            disabled={!timer.isIdle}
          />

          <TimerDisplay
            timeRemaining={timer.timeRemaining}
            sessionType={timer.sessionType}
            isRunning={timer.isRunning}
          />

          <TimerControls
            state={timer.state}
            onStart={timer.start}
            onPause={timer.pause}
            onResume={timer.resume}
            onReset={timer.reset}
            onSkip={timer.skip}
          />

          <SessionCounter
            currentCount={timer.focusSessionCount}
            totalCount={settings.longBreakInterval}
          />
        </div>
      </main>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showStatistics && <StatisticsPanel onClose={() => setShowStatistics(false)} />}
    </div>
  );
};
