/**
 * Keyboard Shortcuts Hook
 * Manages keyboard shortcuts for timer controls
 */

import { useEffect } from 'react';
import { useTimer } from './useTimer';
import { TimerState } from '@/types';

/**
 * Keyboard shortcuts:
 * - Space: Start/Pause
 * - R: Reset
 * - S: Skip to next session
 */
export function useKeyboardShortcuts(enabled: boolean = true) {
  const timer = useTimer();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (timer.state === TimerState.IDLE || timer.state === TimerState.COMPLETED) {
            timer.start();
          } else if (timer.state === TimerState.RUNNING) {
            timer.pause();
          } else if (timer.state === TimerState.PAUSED) {
            timer.resume();
          }
          break;

        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            return; // Don't interfere with browser reload
          }
          event.preventDefault();
          timer.reset();
          break;

        case 'KeyS':
          if (event.ctrlKey || event.metaKey) {
            return; // Don't interfere with browser save
          }
          event.preventDefault();
          timer.skip();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled, timer]);
}
