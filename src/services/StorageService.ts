/**
 * Storage Service
 * Handles all localStorage operations with error handling and data migration
 */

import { AppError, ErrorType } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Generic storage service for type-safe localStorage operations
 */
class StorageService {
  /**
   * Checks if localStorage is available
   */
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Gets an item from localStorage with type safety
   */
  get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      throw new AppError(
        ErrorType.STORAGE_ERROR,
        'localStorage is not available in this browser'
      );
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      throw new AppError(
        ErrorType.STORAGE_ERROR,
        `Failed to retrieve item from storage: ${key}`,
        error as Error
      );
    }
  }

  /**
   * Sets an item in localStorage
   */
  set<T>(key: string, value: T): void {
    if (!this.isAvailable()) {
      throw new AppError(
        ErrorType.STORAGE_ERROR,
        'localStorage is not available in this browser'
      );
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new AppError(
          ErrorType.STORAGE_ERROR,
          'Storage quota exceeded. Please clear some data.',
          error as Error
        );
      }

      throw new AppError(
        ErrorType.STORAGE_ERROR,
        `Failed to save item to storage: ${key}`,
        error as Error
      );
    }
  }

  /**
   * Removes an item from localStorage
   */
  remove(key: string): void {
    if (!this.isAvailable()) {
      throw new AppError(
        ErrorType.STORAGE_ERROR,
        'localStorage is not available in this browser'
      );
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new AppError(
        ErrorType.STORAGE_ERROR,
        `Failed to remove item from storage: ${key}`,
        error as Error
      );
    }
  }

  /**
   * Clears all application data from localStorage
   */
  clear(): void {
    if (!this.isAvailable()) {
      throw new AppError(
        ErrorType.STORAGE_ERROR,
        'localStorage is not available in this browser'
      );
    }

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key as string);
      });
    } catch (error) {
      throw new AppError(
        ErrorType.STORAGE_ERROR,
        'Failed to clear storage',
        error as Error
      );
    }
  }

  /**
   * Gets the size of stored data in bytes
   */
  getStorageSize(): number {
    let total = 0;

    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        total += new Blob([item]).size;
      }
    });

    return total;
  }

  /**
   * Exports all application data
   */
  exportData(): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          data[key] = JSON.parse(item);
        } catch {
          data[key] = item;
        }
      }
    });

    return data;
  }

  /**
   * Imports application data
   */
  importData(data: Record<string, unknown>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key as any)) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error(`Failed to import data for key: ${key}`, error);
        }
      }
    });
  }
}

// Export singleton instance
export const storageService = new StorageService();
