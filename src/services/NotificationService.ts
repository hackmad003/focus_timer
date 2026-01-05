/**
 * Notification Service
 * Handles desktop notifications and push notifications
 */

import { AppError, ErrorType, NotificationPayload } from '@/types';

/**
 * Service for managing browser notifications
 */
class NotificationService {
  private permissionGranted: boolean = false;

  constructor() {
    this.checkPermission();
  }

  /**
   * Checks current notification permission status
   */
  private checkPermission(): void {
    if ('Notification' in window) {
      this.permissionGranted = Notification.permission === 'granted';
    }
  }

  /**
   * Requests notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      throw new AppError(
        ErrorType.NOTIFICATION_ERROR,
        'This browser does not support desktop notifications'
      );
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    } catch (error) {
      throw new AppError(
        ErrorType.NOTIFICATION_ERROR,
        'Failed to request notification permission',
        error as Error
      );
    }
  }

  /**
   * Shows a desktop notification
   */
  async show(payload: NotificationPayload): Promise<void> {
    if (!this.permissionGranted) {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        tag: payload.tag || 'focus-timer',
        icon: payload.icon || '/pwa-192x192.png',
        requireInteraction: payload.requireInteraction || false,
        badge: '/pwa-192x192.png',
      });

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!payload.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    } catch (error) {
      throw new AppError(
        ErrorType.NOTIFICATION_ERROR,
        'Failed to show notification',
        error as Error
      );
    }
  }

  /**
   * Gets the current permission status
   */
  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  /**
   * Checks if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Checks if permission is granted
   */
  hasPermission(): boolean {
    return this.permissionGranted;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
