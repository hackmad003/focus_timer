/**
 * Notification Permission Hook
 * Manages notification permission state
 */

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/NotificationService';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    notificationService.getPermissionStatus()
  );
  const [isRequesting, setIsRequesting] = useState(false);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    if (!notificationService.isSupported()) {
      return false;
    }

    setIsRequesting(true);

    try {
      const granted = await notificationService.requestPermission();
      setPermission(granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  /**
   * Check permission status on mount
   */
  useEffect(() => {
    setPermission(notificationService.getPermissionStatus());
  }, []);

  return {
    permission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isDefault: permission === 'default',
    isSupported: notificationService.isSupported(),
    isRequesting,
    requestPermission,
  };
}
