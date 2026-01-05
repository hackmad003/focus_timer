/**
 * Core Type Definitions for Focus Timer Pro
 * Defines all TypeScript interfaces and types used throughout the application
 */

/**
 * Represents different session types in the Pomodoro Technique
 */
export enum SessionType {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

/**
 * Timer state enumeration
 */
export enum TimerState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

/**
 * Timer mode - countdown or count-up
 */
export enum TimerMode {
  COUNTDOWN = 'COUNTDOWN',
  COUNTUP = 'COUNTUP',
}

/**
 * Available notification sounds
 */
export enum NotificationSound {
  BELL = 'BELL',
  CHIME = 'CHIME',
  DING = 'DING',
  GONG = 'GONG',
  NONE = 'NONE',
}

/**
 * Available background music/ambient sounds
 */
export enum AmbientSound {
  NONE = 'NONE',
  RAIN = 'RAIN',
  OCEAN = 'OCEAN',
  FOREST = 'FOREST',
  CAFE = 'CAFE',
  WHITE_NOISE = 'WHITE_NOISE',
}

/**
 * Theme options
 */
export enum Theme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  AUTO = 'AUTO',
}

/**
 * User settings configuration
 */
export interface Settings {
  // Timer durations (in minutes)
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // After how many focus sessions

  // Timer preferences
  timerMode: TimerMode;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;

  // Notifications
  notificationSound: NotificationSound;
  notificationVolume: number; // 0-100
  enableVibration: boolean;
  enableDesktopNotifications: boolean;

  // Audio
  ambientSound: AmbientSound;
  ambientVolume: number; // 0-100

  // Display
  theme: Theme;
  show24HourFormat: boolean;
  showMilliseconds: boolean;

  // Accessibility
  highContrast: boolean;
  fontSize: number; // 100 = default, 150 = 1.5x, etc.
  reduceMotion: boolean;
}

/**
 * Represents a single timer session
 */
export interface Session {
  id: string;
  type: SessionType;
  startTime: number; // Unix timestamp
  endTime?: number; // Unix timestamp
  plannedDuration: number; // in seconds
  actualDuration?: number; // in seconds
  completed: boolean;
  taskLabel?: string;
  interrupted: boolean;
  focusSessionNumber?: number; // Which focus session this was (1, 2, 3, etc.)
}

/**
 * Daily statistics
 */
export interface DailyStats {
  date: string; // YYYY-MM-DD format
  focusSessions: number;
  totalFocusTime: number; // in seconds
  totalBreakTime: number; // in seconds
  completedSessions: number;
  interruptedSessions: number;
  tasks: string[]; // Task labels used
}

/**
 * User statistics and analytics
 */
export interface Statistics {
  totalFocusSessions: number;
  totalFocusTime: number; // in seconds
  totalBreakTime: number; // in seconds
  longestStreak: number; // days
  currentStreak: number; // days
  lastSessionDate?: string; // YYYY-MM-DD
  dailyStats: Record<string, DailyStats>; // Keyed by date
  averageFocusTime: number; // Average per day in seconds
  mostProductiveHour?: number; // 0-23
}

/**
 * Timer preset for quick start
 */
export interface TimerPreset {
  id: string;
  name: string;
  icon: string;
  focusDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  longBreakInterval: number;
}

/**
 * Current timer state
 */
export interface TimerStatus {
  state: TimerState;
  sessionType: SessionType;
  timeRemaining: number; // in seconds
  timeElapsed: number; // in seconds
  totalDuration: number; // in seconds
  currentSession: Session | null;
  focusSessionCount: number; // Current count towards long break
  taskLabel: string | null;
}

/**
 * Notification payload
 */
export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  requireInteraction?: boolean;
}

/**
 * Export data format
 */
export interface ExportData {
  version: string;
  exportDate: string;
  settings: Settings;
  statistics: Statistics;
  sessions: Session[];
}

/**
 * Error types for consistent error handling
 */
export enum ErrorType {
  STORAGE_ERROR = 'STORAGE_ERROR',
  NOTIFICATION_ERROR = 'NOTIFICATION_ERROR',
  AUDIO_ERROR = 'AUDIO_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Application error class
 */
export class AppError extends Error {
  type: ErrorType;
  originalError?: Error;

  constructor(type: ErrorType, message: string, originalError?: Error) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
  }
}
