/**
 * Application-wide constants
 */

import { Settings, TimerMode, NotificationSound, AmbientSound, Theme, TimerPreset } from '@/types';

/**
 * Default application settings
 */
export const DEFAULT_SETTINGS: Settings = {
  // Timer durations (in minutes)
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 10,
  longBreakInterval: 4,

  // Timer preferences
  timerMode: TimerMode.COUNTDOWN,
  autoStartBreaks: false,
  autoStartPomodoros: false,

  // Notifications
  notificationSound: NotificationSound.BELL,
  notificationVolume: 80,
  enableVibration: true,
  enableDesktopNotifications: true,

  // Audio
  ambientSound: AmbientSound.NONE,
  ambientVolume: 50,

  // Display
  theme: Theme.DARK,
  show24HourFormat: true,
  showMilliseconds: false,

  // Accessibility
  highContrast: false,
  fontSize: 100,
  reduceMotion: false,
};

/**
 * Timer duration limits (in minutes)
 */
export const DURATION_LIMITS = {
  MIN_FOCUS: 1,
  MAX_FOCUS: 120,
  MIN_BREAK: 1,
  MAX_BREAK: 60,
  MIN_LONG_BREAK_INTERVAL: 2,
  MAX_LONG_BREAK_INTERVAL: 10,
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  SETTINGS: 'focus_timer_settings',
  STATISTICS: 'focus_timer_statistics',
  SESSIONS: 'focus_timer_sessions',
  TIMER_STATE: 'focus_timer_state',
  CURRENT_TASK: 'focus_timer_current_task',
} as const;

/**
 * Predefined timer presets
 */
export const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'classic',
    name: 'Classic Pomodoro',
    icon: '🍅',
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 10,
    longBreakInterval: 4,
  },
  {
    id: 'extended',
    name: 'Extended Focus',
    icon: '🎯',
    focusDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 20,
    longBreakInterval: 4,
  },
  {
    id: 'short',
    name: 'Quick Sprints',
    icon: '⚡',
    focusDuration: 15,
    shortBreakDuration: 3,
    longBreakDuration: 8,
    longBreakInterval: 4,
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: '⚙️',
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 10,
    longBreakInterval: 4,
  },
];

/**
 * Notification messages
 */
export const NOTIFICATION_MESSAGES = {
  FOCUS_COMPLETE: {
    title: '🎉 Focus Session Complete!',
    body: 'Great work! Time for a well-deserved break.',
  },
  SHORT_BREAK_COMPLETE: {
    title: '⏰ Break Over',
    body: 'Ready to get back to work?',
  },
  LONG_BREAK_COMPLETE: {
    title: '🌟 Long Break Over',
    body: "You're refreshed and ready for the next session!",
  },
  FOCUS_START: {
    title: '🔥 Focus Time!',
    body: 'Let\'s get productive!',
  },
} as const;

/**
 * Audio file paths (relative to public/sounds directory)
 */
export const SOUND_FILES = {
  [NotificationSound.BELL]: '/sounds/bell.mp3',
  [NotificationSound.CHIME]: '/sounds/chime.mp3',
  [NotificationSound.DING]: '/sounds/ding.mp3',
  [NotificationSound.GONG]: '/sounds/gong.mp3',
  [NotificationSound.NONE]: null,
} as const;

/**
 * Ambient sound file paths (relative to public/sounds directory)
 */
export const AMBIENT_FILES = {
  [AmbientSound.NONE]: null,
  [AmbientSound.RAIN]: '/sounds/rain.mp3',
  [AmbientSound.OCEAN]: '/sounds/ocean.mp3',
  [AmbientSound.FOREST]: '/sounds/forest.mp3',
  [AmbientSound.CAFE]: '/sounds/cafe.mp3',
  [AmbientSound.WHITE_NOISE]: '/sounds/white-noise.mp3',
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  FLIP_CARD: 600,
  BUTTON_PRESS: 150,
  FADE_IN: 300,
  SLIDE_IN: 400,
} as const;

/**
 * Application metadata
 */
export const APP_METADATA = {
  NAME: 'Focus Timer Pro',
  VERSION: '1.0.0',
  DESCRIPTION: 'Enterprise-grade Focus Timer implementing the Pomodoro Technique',
  AUTHOR: 'Focus Timer Pro Team',
  REPOSITORY: 'https://github.com/your-org/focus-timer-pro',
  PRIVACY_POLICY_URL: '/privacy-policy',
  TERMS_OF_SERVICE_URL: '/terms-of-service',
} as const;

/**
 * Performance thresholds
 */
export const PERFORMANCE = {
  TARGET_FPS: 60,
  FRAME_TIME_MS: 1000 / 60,
  MAX_RENDER_TIME_MS: 16,
} as const;

/**
 * Chart colors for statistics
 */
export const CHART_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  FOCUS: '#6366f1',
  BREAK: '#10b981',
  BACKGROUND: '#1a1a2e',
  GRID: '#2a2a3e',
} as const;

/**
 * Date format strings
 */
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_TIME: 'HH:mm:ss',
  DISPLAY_TIME_12H: 'hh:mm:ss a',
  STORAGE_DATE: 'yyyy-MM-dd',
  FULL_DATETIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

/**
 * Vibration patterns (in milliseconds)
 */
export const VIBRATION_PATTERNS = {
  SHORT: [100],
  MEDIUM: [200],
  LONG: [400],
  DOUBLE: [100, 100, 100],
  SUCCESS: [50, 100, 50],
} as const;
