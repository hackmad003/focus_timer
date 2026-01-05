/**
 * Time utility functions
 * Handles all time-related calculations and formatting
 */

import { format as formatDate } from 'date-fns';
import { DATE_FORMATS } from './constants';

/**
 * Converts minutes to seconds
 */
export function minutesToSeconds(minutes: number): number {
  return Math.round(minutes * 60);
}

/**
 * Converts seconds to minutes
 */
export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

/**
 * Formats seconds into HH:MM:SS or MM:SS format
 */
export function formatTime(totalSeconds: number, showHours: boolean = true): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number): string => num.toString().padStart(2, '0');

  if (showHours && hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats seconds into HH:MM:SS:mmm (with milliseconds)
 */
export function formatTimeWithMilliseconds(
  totalSeconds: number,
  milliseconds: number
): string {
  const baseTime = formatTime(totalSeconds, true);
  const ms = Math.floor(milliseconds / 10).toString().padStart(2, '0');
  return `${baseTime}:${ms}`;
}

/**
 * Parses time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);

  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  throw new Error('Invalid time format');
}

/**
 * Gets the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return formatDate(new Date(), DATE_FORMATS.STORAGE_DATE);
}

/**
 * Formats a timestamp for display
 */
export function formatTimestamp(timestamp: number, use24Hour: boolean = true): string {
  const date = new Date(timestamp);
  const formatStr = use24Hour ? DATE_FORMATS.DISPLAY_TIME : DATE_FORMATS.DISPLAY_TIME_12H;
  return formatDate(date, formatStr);
}

/**
 * Formats a date for display
 */
export function formatDisplayDate(timestamp: number): string {
  return formatDate(new Date(timestamp), DATE_FORMATS.DISPLAY_DATE);
}

/**
 * Gets the start of day timestamp
 */
export function getStartOfDay(date: Date = new Date()): number {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

/**
 * Gets the end of day timestamp
 */
export function getEndOfDay(date: Date = new Date()): number {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

/**
 * Calculates the difference in days between two timestamps
 */
export function daysDifference(timestamp1: number, timestamp2: number): number {
  const day1 = getStartOfDay(new Date(timestamp1));
  const day2 = getStartOfDay(new Date(timestamp2));
  return Math.floor((day2 - day1) / (1000 * 60 * 60 * 24));
}

/**
 * Checks if two timestamps are on the same day
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Gets the hour (0-23) from a timestamp
 */
export function getHourFromTimestamp(timestamp: number): number {
  return new Date(timestamp).getHours();
}

/**
 * Formats duration in a human-readable way
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/**
 * Calculates percentage of time elapsed
 */
export function calculateProgress(elapsed: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, (elapsed / total) * 100);
}

/**
 * Generates a unique timestamp-based ID
 */
export function generateTimestampId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
