/**
 * Validation Tests
 */

import { describe, it, expect } from 'vitest';
import {
  validateFocusDuration,
  validateVolume,
  sanitizeTaskLabel,
  validateEmail,
  clamp,
} from '@/utils/validation';
import { AppError } from '@/types';

describe('Validation Utilities', () => {
  describe('validateFocusDuration', () => {
    it('should accept valid duration', () => {
      expect(validateFocusDuration(25)).toBe(25);
      expect(validateFocusDuration(1)).toBe(1);
      expect(validateFocusDuration(120)).toBe(120);
    });

    it('should reject invalid duration', () => {
      expect(() => validateFocusDuration(0)).toThrow(AppError);
      expect(() => validateFocusDuration(121)).toThrow(AppError);
      expect(() => validateFocusDuration(-1)).toThrow(AppError);
    });
  });

  describe('validateVolume', () => {
    it('should accept valid volume', () => {
      expect(validateVolume(50, 'Volume')).toBe(50);
      expect(validateVolume(0, 'Volume')).toBe(0);
      expect(validateVolume(100, 'Volume')).toBe(100);
    });

    it('should reject invalid volume', () => {
      expect(() => validateVolume(-1, 'Volume')).toThrow(AppError);
      expect(() => validateVolume(101, 'Volume')).toThrow(AppError);
    });
  });

  describe('sanitizeTaskLabel', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeTaskLabel('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeTaskLabel('Hello <b>World</b>')).toBe('Hello World');
    });

    it('should trim whitespace', () => {
      expect(sanitizeTaskLabel('  Hello World  ')).toBe('Hello World');
    });

    it('should limit length', () => {
      const longString = 'a'.repeat(150);
      expect(sanitizeTaskLabel(longString).length).toBe(100);
    });
  });

  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });
});
