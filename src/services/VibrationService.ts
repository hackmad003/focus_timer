/**
 * Vibration Service
 * Manages device vibration feedback
 */

import { VIBRATION_PATTERNS } from '@/utils/constants';

/**
 * Service for managing device vibration
 */
class VibrationService {
  /**
   * Checks if vibration API is supported
   */
  isSupported(): boolean {
    return 'vibrate' in navigator;
  }

  /**
   * Triggers a vibration pattern
   */
  vibrate(pattern: number | number[]): void {
    if (!this.isSupported()) {
      return;
    }

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.error('Vibration failed:', error);
    }
  }

  /**
   * Triggers a short vibration
   */
  short(): void {
    this.vibrate(VIBRATION_PATTERNS.SHORT);
  }

  /**
   * Triggers a medium vibration
   */
  medium(): void {
    this.vibrate(VIBRATION_PATTERNS.MEDIUM);
  }

  /**
   * Triggers a long vibration
   */
  long(): void {
    this.vibrate(VIBRATION_PATTERNS.LONG);
  }

  /**
   * Triggers a double vibration
   */
  double(): void {
    this.vibrate(VIBRATION_PATTERNS.DOUBLE);
  }

  /**
   * Triggers a success vibration pattern
   */
  success(): void {
    this.vibrate(VIBRATION_PATTERNS.SUCCESS);
  }

  /**
   * Stops any ongoing vibration
   */
  stop(): void {
    if (this.isSupported()) {
      navigator.vibrate(0);
    }
  }
}

// Export singleton instance
export const vibrationService = new VibrationService();
