/**
 * Timer Hook
 * Custom hook that manages timer lifecycle and integrates with services
 */

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '@/store/useTimerStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStatisticsStore } from '@/store/useStatisticsStore';
import { notificationService } from '@/services/NotificationService';
import { audioService } from '@/services/AudioService';
import { vibrationService } from '@/services/VibrationService';
import { TimerState, SessionType } from '@/types';
import { NOTIFICATION_MESSAGES } from '@/utils/constants';

/**
 * Main timer hook that coordinates all timer functionality
 */
export function useTimer() {
  const timerState = useTimerStore();
  const settings = useSettingsStore();
  const statistics = useStatisticsStore();
  const intervalRef = useRef<number | null>(null);
  const previousStateRef = useRef<TimerState>(TimerState.IDLE);

  /**
   * Handles session completion notifications and sounds
   */
  const handleSessionComplete = useCallback(async () => {
    const { sessionType, currentSession } = timerState;

    // Play notification sound
    if (settings.notificationSound) {
      try {
        await audioService.playNotificationSound(
          settings.notificationSound,
          settings.notificationVolume
        );
      } catch (error) {
        console.error('Failed to play notification sound:', error);
      }
    }

    // Trigger vibration
    if (settings.enableVibration && vibrationService.isSupported()) {
      vibrationService.success();
    }

    // Show desktop notification
    if (settings.enableDesktopNotifications && notificationService.hasPermission()) {
      let notificationPayload;
      
      switch (sessionType) {
        case SessionType.FOCUS:
          notificationPayload = NOTIFICATION_MESSAGES.FOCUS_COMPLETE;
          break;
        case SessionType.SHORT_BREAK:
          notificationPayload = NOTIFICATION_MESSAGES.SHORT_BREAK_COMPLETE;
          break;
        case SessionType.LONG_BREAK:
          notificationPayload = NOTIFICATION_MESSAGES.LONG_BREAK_COMPLETE;
          break;
      }

      try {
        await notificationService.show(notificationPayload);
      } catch (error) {
        console.error('Failed to show notification:', error);
      }
    }

    // Add session to statistics
    if (currentSession) {
      statistics.addSession(currentSession);
    }
  }, [timerState, settings, statistics]);

  /**
   * Start the timer interval
   */
  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      timerState.tick();
    }, 1000);
  }, [timerState]);

  /**
   * Stop the timer interval
   */
  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Handle timer state changes
   */
  useEffect(() => {
    const currentState = timerState.state;
    const previousState = previousStateRef.current;

    // Start interval when timer starts running
    if (currentState === TimerState.RUNNING && previousState !== TimerState.RUNNING) {
      startInterval();
    }

    // Stop interval when timer is paused or idle
    if (currentState !== TimerState.RUNNING && previousState === TimerState.RUNNING) {
      stopInterval();
    }

    // Handle session completion
    if (currentState === TimerState.COMPLETED && previousState !== TimerState.COMPLETED) {
      stopInterval();
      handleSessionComplete();
    }

    previousStateRef.current = currentState;
  }, [timerState.state, startInterval, stopInterval, handleSessionComplete]);

  /**
   * Handle ambient sound based on timer state
   */
  useEffect(() => {
    if (timerState.state === TimerState.RUNNING && settings.ambientSound) {
      audioService.playAmbientSound(settings.ambientSound, settings.ambientVolume)
        .catch(error => console.error('Failed to play ambient sound:', error));
    } else {
      audioService.pauseAmbientSound();
    }
  }, [timerState.state, settings.ambientSound, settings.ambientVolume]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopInterval();
      audioService.cleanup();
    };
  }, [stopInterval]);

  /**
   * Handle page visibility changes (background timer support)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - timer continues via interval
        if (timerState.state === TimerState.RUNNING) {
          audioService.pauseAmbientSound();
        }
      } else {
        // Page is visible again
        if (timerState.state === TimerState.RUNNING) {
          audioService.resumeAmbientSound();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerState.state]);

  return {
    // Timer state
    state: timerState.state,
    sessionType: timerState.sessionType,
    timeRemaining: timerState.timeRemaining,
    timeElapsed: timerState.timeElapsed,
    totalDuration: timerState.totalDuration,
    focusSessionCount: timerState.focusSessionCount,
    taskLabel: timerState.taskLabel,

    // Timer controls
    start: timerState.start,
    pause: timerState.pause,
    resume: timerState.resume,
    reset: timerState.reset,
    skip: timerState.skip,
    setTaskLabel: timerState.setTaskLabel,
    startNextSession: timerState.startNextSession,

    // Computed values
    isRunning: timerState.state === TimerState.RUNNING,
    isPaused: timerState.state === TimerState.PAUSED,
    isIdle: timerState.state === TimerState.IDLE,
    isCompleted: timerState.state === TimerState.COMPLETED,
  };
}
