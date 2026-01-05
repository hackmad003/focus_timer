/**
 * Time Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatTime,
  minutesToSeconds,
  secondsToMinutes,
  formatDuration,
  calculateProgress,
  isSameDay,
} from '@/utils/time';

describe('Time Utilities', () => {
  describe('minutesToSeconds', () => {
    it('should convert minutes to seconds', () => {
      expect(minutesToSeconds(1)).toBe(60);
      expect(minutesToSeconds(5)).toBe(300);
      expect(minutesToSeconds(25)).toBe(1500);
    });
  });

  describe('secondsToMinutes', () => {
    it('should convert seconds to minutes', () => {
      expect(secondsToMinutes(60)).toBe(1);
      expect(secondsToMinutes(300)).toBe(5);
      expect(secondsToMinutes(1500)).toBe(25);
    });
  });

  describe('formatTime', () => {
    it('should format seconds as MM:SS', () => {
      expect(formatTime(0, false)).toBe('00:00');
      expect(formatTime(59, false)).toBe('00:59');
      expect(formatTime(60, false)).toBe('01:00');
      expect(formatTime(3599, false)).toBe('59:59');
    });

    it('should format seconds as HH:MM:SS when hours present', () => {
      expect(formatTime(3600, true)).toBe('01:00:00');
      expect(formatTime(3661, true)).toBe('01:01:01');
    });
  });

  describe('formatDuration', () => {
    it('should format duration in human-readable way', () => {
      expect(formatDuration(60)).toBe('1m');
      expect(formatDuration(3600)).toBe('1h 0m');
      expect(formatDuration(3660)).toBe('1h 1m');
    });
  });

  describe('calculateProgress', () => {
    it('should calculate percentage progress', () => {
      expect(calculateProgress(0, 100)).toBe(0);
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(100, 100)).toBe(100);
    });

    it('should handle edge cases', () => {
      expect(calculateProgress(0, 0)).toBe(0);
      expect(calculateProgress(150, 100)).toBe(100);
    });
  });

  describe('isSameDay', () => {
    it('should check if timestamps are on same day', () => {
      const date1 = new Date('2024-01-01 10:00:00').getTime();
      const date2 = new Date('2024-01-01 15:00:00').getTime();
      const date3 = new Date('2024-01-02 10:00:00').getTime();

      expect(isSameDay(date1, date2)).toBe(true);
      expect(isSameDay(date1, date3)).toBe(false);
    });
  });
});
