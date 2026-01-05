/**
 * Statistics Store
 * Manages session history and analytics
 */

import { create } from 'zustand';
import { Statistics, Session, DailyStats, SessionType } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { storageService } from '@/services/StorageService';
import { getCurrentDate, daysDifference, getHourFromTimestamp } from '@/utils/time';
import { format } from 'date-fns';

interface StatisticsStore extends Statistics {
  // Actions
  addSession: (session: Session) => void;
  calculateStatistics: () => void;
  loadStatistics: () => void;
  saveStatistics: () => void;
  resetStatistics: () => void;
  getSessionsByDateRange: (startDate: string, endDate: string) => Session[];
  getDailyStatsByDateRange: (startDate: string, endDate: string) => DailyStats[];
  exportData: () => string;
}

/**
 * Creates initial statistics state
 */
function createInitialStatistics(): Statistics {
  return {
    totalFocusSessions: 0,
    totalFocusTime: 0,
    totalBreakTime: 0,
    longestStreak: 0,
    currentStreak: 0,
    dailyStats: {},
    averageFocusTime: 0,
  };
}

/**
 * Statistics store with Zustand
 */
export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  ...createInitialStatistics(),

  /**
   * Adds a completed session and updates statistics
   */
  addSession: (session: Session) => {
    if (!session.completed || !session.endTime) {
      return;
    }

    const dateKey = format(new Date(session.startTime), 'yyyy-MM-dd');
    const state = get();
    const dailyStats = { ...state.dailyStats };

    // Initialize daily stats if not exists
    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = {
        date: dateKey,
        focusSessions: 0,
        totalFocusTime: 0,
        totalBreakTime: 0,
        completedSessions: 0,
        interruptedSessions: 0,
        tasks: [],
      };
    }

    const dayStats = dailyStats[dateKey];
    const duration = session.actualDuration || session.plannedDuration;

    // Update daily stats
    dayStats.completedSessions += 1;
    if (session.interrupted) {
      dayStats.interruptedSessions += 1;
    }

    if (session.type === SessionType.FOCUS) {
      dayStats.focusSessions += 1;
      dayStats.totalFocusTime += duration;
      
      if (session.taskLabel && !dayStats.tasks.includes(session.taskLabel)) {
        dayStats.tasks.push(session.taskLabel);
      }
    } else {
      dayStats.totalBreakTime += duration;
    }

    dailyStats[dateKey] = dayStats;

    set({ dailyStats });
    get().calculateStatistics();
    get().saveStatistics();
  },

  /**
   * Recalculates aggregate statistics from daily stats
   */
  calculateStatistics: () => {
    const state = get();
    const dailyStats = state.dailyStats;
    const dates = Object.keys(dailyStats).sort();

    if (dates.length === 0) {
      set(createInitialStatistics());
      return;
    }

    let totalFocusSessions = 0;
    let totalFocusTime = 0;
    let totalBreakTime = 0;
    const hourlyFocusTime: Record<number, number> = {};

    // Aggregate totals
    dates.forEach((date) => {
      const day = dailyStats[date];
      totalFocusSessions += day.focusSessions;
      totalFocusTime += day.totalFocusTime;
      totalBreakTime += day.totalBreakTime;
    });

    // Calculate streaks
    const currentDate = getCurrentDate();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: string | null = null;

    dates.forEach((date) => {
      if (dailyStats[date].focusSessions > 0) {
        if (lastDate) {
          const daysDiff = daysDifference(
            new Date(lastDate).getTime(),
            new Date(date).getTime()
          );

          if (daysDiff === 1) {
            tempStreak += 1;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }

        lastDate = date;
      }
    });

    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate current streak
    if (lastDate) {
      const daysSinceLastSession = daysDifference(
        new Date(lastDate).getTime(),
        new Date(currentDate).getTime()
      );

      if (daysSinceLastSession === 0 || daysSinceLastSession === 1) {
        currentStreak = tempStreak;
      }
    }

    // Calculate average focus time per day
    const daysWithSessions = dates.filter((date) => dailyStats[date].focusSessions > 0).length;
    const averageFocusTime = daysWithSessions > 0 ? totalFocusTime / daysWithSessions : 0;

    // Calculate most productive hour
    const sessions = get().getSessionsByDateRange(dates[0], dates[dates.length - 1]);
    sessions.forEach((session) => {
      if (session.type === SessionType.FOCUS && session.completed) {
        const hour = getHourFromTimestamp(session.startTime);
        hourlyFocusTime[hour] = (hourlyFocusTime[hour] || 0) + (session.actualDuration || 0);
      }
    });

    let mostProductiveHour: number | undefined;
    let maxHourlyTime = 0;
    Object.entries(hourlyFocusTime).forEach(([hour, time]) => {
      if (time > maxHourlyTime) {
        maxHourlyTime = time;
        mostProductiveHour = parseInt(hour);
      }
    });

    set({
      totalFocusSessions,
      totalFocusTime,
      totalBreakTime,
      currentStreak,
      longestStreak,
      lastSessionDate: lastDate || undefined,
      averageFocusTime,
      mostProductiveHour,
    });

    get().saveStatistics();
  },

  /**
   * Loads statistics from localStorage
   */
  loadStatistics: () => {
    try {
      const saved = storageService.get<Statistics>(STORAGE_KEYS.STATISTICS);
      if (saved) {
        set(saved);
        get().calculateStatistics();
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  },

  /**
   * Saves statistics to localStorage
   */
  saveStatistics: () => {
    try {
      const state = get();
      const stats: Statistics = {
        totalFocusSessions: state.totalFocusSessions,
        totalFocusTime: state.totalFocusTime,
        totalBreakTime: state.totalBreakTime,
        longestStreak: state.longestStreak,
        currentStreak: state.currentStreak,
        lastSessionDate: state.lastSessionDate,
        dailyStats: state.dailyStats,
        averageFocusTime: state.averageFocusTime,
        mostProductiveHour: state.mostProductiveHour,
      };
      storageService.set(STORAGE_KEYS.STATISTICS, stats);
    } catch (error) {
      console.error('Failed to save statistics:', error);
    }
  },

  /**
   * Resets all statistics
   */
  resetStatistics: () => {
    set(createInitialStatistics());
    try {
      storageService.remove(STORAGE_KEYS.STATISTICS);
      storageService.remove(STORAGE_KEYS.SESSIONS);
    } catch (error) {
      console.error('Failed to reset statistics:', error);
    }
  },

  /**
   * Gets sessions within a date range
   */
  getSessionsByDateRange: (startDate: string, endDate: string) => {
    try {
      const sessions = storageService.get<Session[]>(STORAGE_KEYS.SESSIONS) || [];
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      return sessions.filter((session) => {
        return session.startTime >= start && session.startTime <= end;
      });
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  },

  /**
   * Gets daily stats within a date range
   */
  getDailyStatsByDateRange: (startDate: string, endDate: string) => {
    const state = get();
    const stats: DailyStats[] = [];

    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      if (state.dailyStats[dateKey]) {
        stats.push(state.dailyStats[dateKey]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return stats;
  },

  /**
   * Exports all data as JSON string
   */
  exportData: () => {
    const state = get();
    const sessions = storageService.get<Session[]>(STORAGE_KEYS.SESSIONS) || [];

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      statistics: {
        totalFocusSessions: state.totalFocusSessions,
        totalFocusTime: state.totalFocusTime,
        totalBreakTime: state.totalBreakTime,
        longestStreak: state.longestStreak,
        currentStreak: state.currentStreak,
        lastSessionDate: state.lastSessionDate,
        dailyStats: state.dailyStats,
        averageFocusTime: state.averageFocusTime,
        mostProductiveHour: state.mostProductiveHour,
      },
      sessions,
    };

    return JSON.stringify(exportData, null, 2);
  },
}));
