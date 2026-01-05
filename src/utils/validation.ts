/**
 * Input validation utilities
 * Ensures all user inputs are properly validated and sanitized
 */

import { DURATION_LIMITS } from './constants';
import { AppError, ErrorType } from '@/types';

/**
 * Validates timer duration input
 * @param value - Duration value in minutes
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param fieldName - Name of the field for error messages
 * @returns Validated number or throws AppError
 */
export function validateDuration(
  value: number,
  min: number,
  max: number,
  fieldName: string
): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      `${fieldName} must be a valid number`
    );
  }

  if (!Number.isInteger(value)) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      `${fieldName} must be a whole number`
    );
  }

  if (value < min || value > max) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      `${fieldName} must be between ${min} and ${max} minutes`
    );
  }

  return value;
}

/**
 * Validates focus duration
 */
export function validateFocusDuration(value: number): number {
  return validateDuration(
    value,
    DURATION_LIMITS.MIN_FOCUS,
    DURATION_LIMITS.MAX_FOCUS,
    'Focus duration'
  );
}

/**
 * Validates short break duration
 */
export function validateShortBreakDuration(value: number): number {
  return validateDuration(
    value,
    DURATION_LIMITS.MIN_BREAK,
    DURATION_LIMITS.MAX_BREAK,
    'Short break duration'
  );
}

/**
 * Validates long break duration
 */
export function validateLongBreakDuration(value: number): number {
  return validateDuration(
    value,
    DURATION_LIMITS.MIN_BREAK,
    DURATION_LIMITS.MAX_BREAK,
    'Long break duration'
  );
}

/**
 * Validates long break interval
 */
export function validateLongBreakInterval(value: number): number {
  return validateDuration(
    value,
    DURATION_LIMITS.MIN_LONG_BREAK_INTERVAL,
    DURATION_LIMITS.MAX_LONG_BREAK_INTERVAL,
    'Long break interval'
  );
}

/**
 * Validates volume level (0-100)
 */
export function validateVolume(value: number, fieldName: string): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      `${fieldName} must be a valid number`
    );
  }

  if (value < 0 || value > 100) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      `${fieldName} must be between 0 and 100`
    );
  }

  return value;
}

/**
 * Validates font size (50-200%)
 */
export function validateFontSize(value: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      'Font size must be a valid number'
    );
  }

  if (value < 50 || value > 200) {
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      'Font size must be between 50% and 200%'
    );
  }

  return value;
}

/**
 * Sanitizes task label input
 * Removes potentially harmful characters and limits length
 */
export function sanitizeTaskLabel(value: string): string {
  if (typeof value !== 'string') {
    return '';
  }

  // Remove HTML tags and limit length
  return value
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 100);
}

/**
 * Validates email format (for export/sharing features)
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates date string in YYYY-MM-DD format
 */
export function validateDateString(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return false;
  }

  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates and clamps a number within a range
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Checks if a value is a valid enum member
 */
export function isValidEnumValue<T extends Record<string, string>>(
  enumObj: T,
  value: string
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}
