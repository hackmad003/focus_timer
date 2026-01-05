/**
 * Test Setup Configuration
 * Sets up the testing environment
 */

import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
(globalThis as any).localStorage = localStorageMock;

// Mock Notification API
(globalThis as any).Notification = {
  permission: 'default',
  requestPermission: vi.fn(() => Promise.resolve('granted')),
};

// Mock Audio API
(globalThis as any).Audio = vi.fn(() => ({
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  value: vi.fn(),
  writable: true,
});
