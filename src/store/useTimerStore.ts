/**
 * Timer Store
 * Central state management for timer functionality using Zustand
 */

import { create } from 'zustand';
import {
  SessionType,
  TimerState,
  TimerStatus,
  Session,
  Settings,
} from '@/types';
import { minutesToSeconds, generateTimestampId, getCurrentDate } from '@/utils/time';
import { storageService } from '@/services/StorageService';
import { STORAGE_KEYS } from '@/utils/constants';

interface TimerStore extends TimerStatus {
  // Timer control actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  
  // Timer update actions
  tick: () => void;
  setTaskLabel: (label: string | null) => void;
  
  // Session management
  completeSession: () => void;
  startNextSession: () => void;
  
  // Settings integration
  updateFromSettings: (settings: Settings) => void;
  
  // Persistence
  saveState: () => void;
  loadState: () => void;
}

/**
 * Creates initial timer state
 */
function createInitialState(settings?: Settings): TimerStatus {
  const focusDuration = settings?.focusDuration || 25;
  
  return {
    state: TimerState.IDLE,
    sessionType: SessionType.FOCUS,
    timeRemaining: minutesToSeconds(focusDuration),
    timeElapsed: 0,
    totalDuration: minutesToSeconds(focusDuration),
    currentSession: null,
    focusSessionCount: 0,
    taskLabel: null,
  };
}

/**
 * Timer store with Zustand
 */
export const useTimerStore = create<TimerStore>((set, get) => ({
  ...createInitialState(),

  /**
   * Starts the timer
   */
  start: () => {
    const state = get();
    
    // Create new session
    const session: Session = {
      id: generateTimestampId(),
      type: state.sessionType,
      startTime: Date.now(),
      plannedDuration: state.totalDuration,
      completed: false,
      taskLabel: state.taskLabel || undefined,
      interrupted: false,
      focusSessionNumber: state.sessionType === SessionType.FOCUS 
        ? state.focusSessionCount + 1 
        : undefined,
    };

    set({
      state: TimerState.RUNNING,
      currentSession: session,
    });

    get().saveState();
  },

  /**
   * Pauses the timer
   */
  pause: () => {
    set({ state: TimerState.PAUSED });
    get().saveState();
  },

  /**
   * Resumes the timer
   */
  resume: () => {
    set({ state: TimerState.RUNNING });
    get().saveState();
  },

  /**
   * Resets the timer to initial state
   */
  reset: () => {
    const state = get();
    
    // Mark current session as interrupted if exists
    if (state.currentSession && !state.currentSession.completed) {
      const updatedSession: Session = {
        ...state.currentSession,
        endTime: Date.now(),
        actualDuration: state.timeElapsed,
        interrupted: true,
      };
      
      // Save interrupted session
      saveSession(updatedSession);
    }

    set({
      state: TimerState.IDLE,
      timeRemaining: state.totalDuration,
      timeElapsed: 0,
      currentSession: null,
    });

    get().saveState();
  },

  /**
   * Skips to the next session
   */
  skip: () => {
    const state = get();
    
    // Mark current session as interrupted
    if (state.currentSession) {
      const updatedSession: Session = {
        ...state.currentSession,
        endTime: Date.now(),
        actualDuration: state.timeElapsed,
        interrupted: true,
        completed: false,
      };
      
      saveSession(updatedSession);
    }

    get().startNextSession();
  },

  /**
   * Ticks the timer (called every second)
   */
  tick: () => {
    const state = get();
    
    if (state.state !== TimerState.RUNNING) {
      return;
    }

    const newTimeElapsed = state.timeElapsed + 1;
    const newTimeRemaining = Math.max(0, state.totalDuration - newTimeElapsed);

    set({
      timeElapsed: newTimeElapsed,
      timeRemaining: newTimeRemaining,
    });

    // Check if session is complete
    if (newTimeRemaining === 0) {
      get().completeSession();
    }
  },

  /**
   * Sets the task label for the current session
   */
  setTaskLabel: (label: string | null) => {
    set({ taskLabel: label });
    get().saveState();
  },

  /**
   * Completes the current session
   */
  completeSession: () => {
    const state = get();
    
    if (!state.currentSession) {
      return;
    }

    // Update session as completed
    const completedSession: Session = {
      ...state.currentSession,
      endTime: Date.now(),
      actualDuration: state.timeElapsed,
      completed: true,
      interrupted: false,
    };

    // Save completed session
    saveSession(completedSession);

    // Update focus session count if this was a focus session
    const newFocusSessionCount = state.sessionType === SessionType.FOCUS
      ? state.focusSessionCount + 1
      : state.focusSessionCount;

    set({
      state: TimerState.COMPLETED,
      focusSessionCount: newFocusSessionCount,
    });

    get().saveState();
  },

  /**
   * Starts the next session based on Pomodoro rules
   */
  startNextSession: () => {
    const state = get();
    const settings = getSettings();

    let nextSessionType: SessionType;
    let nextDuration: number;

    if (state.sessionType === SessionType.FOCUS) {
      // After focus, determine break type
      if (state.focusSessionCount >= settings.longBreakInterval) {
        nextSessionType = SessionType.LONG_BREAK;
        nextDuration = minutesToSeconds(settings.longBreakDuration);
      } else {
        nextSessionType = SessionType.SHORT_BREAK;
        nextDuration = minutesToSeconds(settings.shortBreakDuration);
      }
    } else {
      // After any break, go back to focus
      nextSessionType = SessionType.FOCUS;
      nextDuration = minutesToSeconds(settings.focusDuration);
      
      // Reset focus count after long break
      if (state.sessionType === SessionType.LONG_BREAK) {
        set({ focusSessionCount: 0 });
      }
    }

    set({
      sessionType: nextSessionType,
      timeRemaining: nextDuration,
      timeElapsed: 0,
      totalDuration: nextDuration,
      state: TimerState.IDLE,
      currentSession: null,
      taskLabel: nextSessionType === SessionType.FOCUS ? state.taskLabel : null,
    });

    get().saveState();

    // Auto-start if enabled
    if (
      (nextSessionType !== SessionType.FOCUS && settings.autoStartBreaks) ||
      (nextSessionType === SessionType.FOCUS && settings.autoStartPomodoros)
    ) {
      get().start();
    }
  },

  /**
   * Updates timer durations from settings
   */
  updateFromSettings: (settings: Settings) => {
    const state = get();
    
    // Only update if timer is idle
    if (state.state === TimerState.IDLE) {
      let newDuration: number;
      
      switch (state.sessionType) {
        case SessionType.FOCUS:
          newDuration = minutesToSeconds(settings.focusDuration);
          break;
        case SessionType.SHORT_BREAK:
          newDuration = minutesToSeconds(settings.shortBreakDuration);
          break;
        case SessionType.LONG_BREAK:
          newDuration = minutesToSeconds(settings.longBreakDuration);
          break;
      }

      set({
        timeRemaining: newDuration,
        totalDuration: newDuration,
        timeElapsed: 0,
      });
    }
  },

  /**
   * Saves current state to localStorage
   */
  saveState: () => {
    const state = get();
    const stateToSave = {
      state: state.state,
      sessionType: state.sessionType,
      timeRemaining: state.timeRemaining,
      timeElapsed: state.timeElapsed,
      totalDuration: state.totalDuration,
      currentSession: state.currentSession,
      focusSessionCount: state.focusSessionCount,
      taskLabel: state.taskLabel,
      timestamp: Date.now(),
    };

    try {
      storageService.set(STORAGE_KEYS.TIMER_STATE, stateToSave);
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  },

  /**
   * Loads state from localStorage
   */
  loadState: () => {
    try {
      const savedState = storageService.get<typeof state & { timestamp: number }>(
        STORAGE_KEYS.TIMER_STATE
      );

      if (savedState) {
        const timeSinceLastSave = Date.now() - savedState.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        // Only restore if not too old
        if (timeSinceLastSave < maxAge) {
          set({
            state: savedState.state === TimerState.RUNNING ? TimerState.PAUSED : savedState.state,
            sessionType: savedState.sessionType,
            timeRemaining: savedState.timeRemaining,
            timeElapsed: savedState.timeElapsed,
            totalDuration: savedState.totalDuration,
            currentSession: savedState.currentSession,
            focusSessionCount: savedState.focusSessionCount,
            taskLabel: savedState.taskLabel,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load timer state:', error);
    }
  },
}));

/**
 * Helper function to save a session
 */
function saveSession(session: Session): void {
  try {
    const sessions = storageService.get<Session[]>(STORAGE_KEYS.SESSIONS) || [];
    sessions.push(session);
    
    // Keep only last 1000 sessions to prevent storage overflow
    const trimmedSessions = sessions.slice(-1000);
    storageService.set(STORAGE_KEYS.SESSIONS, trimmedSessions);
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Helper function to get current settings
 */
function getSettings(): Settings {
  try {
    return storageService.get<Settings>(STORAGE_KEYS.SETTINGS) || require('@/utils/constants').DEFAULT_SETTINGS;
  } catch {
    return require('@/utils/constants').DEFAULT_SETTINGS;
  }
}
