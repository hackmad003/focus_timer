/**
 * Settings Store
 * Manages user preferences and settings
 */

import { create } from 'zustand';
import { Settings, TimerPreset } from '@/types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/utils/constants';
import { storageService } from '@/services/StorageService';
import {
  validateFocusDuration,
  validateShortBreakDuration,
  validateLongBreakDuration,
  validateLongBreakInterval,
  validateVolume,
  validateFontSize,
} from '@/utils/validation';

interface SettingsStore extends Settings {
  // Actions
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
  applyPreset: (preset: TimerPreset) => void;
  exportSettings: () => string;
  importSettings: (jsonString: string) => void;
}

/**
 * Settings store with Zustand
 */
export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,

  /**
   * Updates settings with validation
   */
  updateSettings: (partial: Partial<Settings>) => {
    try {
      const validated: Partial<Settings> = {};

      // Validate each field if present
      if (partial.focusDuration !== undefined) {
        validated.focusDuration = validateFocusDuration(partial.focusDuration);
      }
      if (partial.shortBreakDuration !== undefined) {
        validated.shortBreakDuration = validateShortBreakDuration(partial.shortBreakDuration);
      }
      if (partial.longBreakDuration !== undefined) {
        validated.longBreakDuration = validateLongBreakDuration(partial.longBreakDuration);
      }
      if (partial.longBreakInterval !== undefined) {
        validated.longBreakInterval = validateLongBreakInterval(partial.longBreakInterval);
      }
      if (partial.notificationVolume !== undefined) {
        validated.notificationVolume = validateVolume(
          partial.notificationVolume,
          'Notification volume'
        );
      }
      if (partial.ambientVolume !== undefined) {
        validated.ambientVolume = validateVolume(partial.ambientVolume, 'Ambient volume');
      }
      if (partial.fontSize !== undefined) {
        validated.fontSize = validateFontSize(partial.fontSize);
      }

      // Copy over other fields without validation
      Object.keys(partial).forEach((key) => {
        if (!(key in validated) && key in partial) {
          (validated as any)[key] = (partial as any)[key];
        }
      });

      set(validated);
      get().saveSettings();
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },

  /**
   * Resets settings to defaults
   */
  resetSettings: () => {
    set(DEFAULT_SETTINGS);
    get().saveSettings();
  },

  /**
   * Loads settings from localStorage
   */
  loadSettings: () => {
    try {
      const saved = storageService.get<Settings>(STORAGE_KEYS.SETTINGS);
      if (saved) {
        // Merge with defaults to handle new settings added in updates
        set({ ...DEFAULT_SETTINGS, ...saved });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  /**
   * Saves settings to localStorage
   */
  saveSettings: () => {
    try {
      const state = get();
      const settings: Settings = {
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        longBreakInterval: state.longBreakInterval,
        timerMode: state.timerMode,
        autoStartBreaks: state.autoStartBreaks,
        autoStartPomodoros: state.autoStartPomodoros,
        notificationSound: state.notificationSound,
        notificationVolume: state.notificationVolume,
        enableVibration: state.enableVibration,
        enableDesktopNotifications: state.enableDesktopNotifications,
        ambientSound: state.ambientSound,
        ambientVolume: state.ambientVolume,
        theme: state.theme,
        show24HourFormat: state.show24HourFormat,
        showMilliseconds: state.showMilliseconds,
        highContrast: state.highContrast,
        fontSize: state.fontSize,
        reduceMotion: state.reduceMotion,
      };
      storageService.set(STORAGE_KEYS.SETTINGS, settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  /**
   * Applies a timer preset
   */
  applyPreset: (preset: TimerPreset) => {
    set({
      focusDuration: preset.focusDuration,
      shortBreakDuration: preset.shortBreakDuration,
      longBreakDuration: preset.longBreakDuration,
      longBreakInterval: preset.longBreakInterval,
    });
    get().saveSettings();
  },

  /**
   * Exports settings as JSON string
   */
  exportSettings: () => {
    const state = get();
    const settings: Settings = {
      focusDuration: state.focusDuration,
      shortBreakDuration: state.shortBreakDuration,
      longBreakDuration: state.longBreakDuration,
      longBreakInterval: state.longBreakInterval,
      timerMode: state.timerMode,
      autoStartBreaks: state.autoStartBreaks,
      autoStartPomodoros: state.autoStartPomodoros,
      notificationSound: state.notificationSound,
      notificationVolume: state.notificationVolume,
      enableVibration: state.enableVibration,
      enableDesktopNotifications: state.enableDesktopNotifications,
      ambientSound: state.ambientSound,
      ambientVolume: state.ambientVolume,
      theme: state.theme,
      show24HourFormat: state.show24HourFormat,
      showMilliseconds: state.showMilliseconds,
      highContrast: state.highContrast,
      fontSize: state.fontSize,
      reduceMotion: state.reduceMotion,
    };
    return JSON.stringify(settings, null, 2);
  },

  /**
   * Imports settings from JSON string
   */
  importSettings: (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as Partial<Settings>;
      get().updateSettings(imported);
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw new Error('Invalid settings file');
    }
  },
}));
