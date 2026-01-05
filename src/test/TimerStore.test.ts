/**
 * Timer Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTimerStore } from '@/store/useTimerStore';
import { TimerState, SessionType } from '@/types';

describe('Timer Store', () => {
  beforeEach(() => {
    // Reset store state
    const store = useTimerStore.getState();
    store.reset();
  });

  it('should initialize with idle state', () => {
    const state = useTimerStore.getState();
    expect(state.state).toBe(TimerState.IDLE);
    expect(state.sessionType).toBe(SessionType.FOCUS);
  });

  it('should start timer', () => {
    const store = useTimerStore.getState();
    store.start();
    
    const state = useTimerStore.getState();
    expect(state.state).toBe(TimerState.RUNNING);
    expect(state.currentSession).not.toBeNull();
  });

  it('should pause timer', () => {
    const store = useTimerStore.getState();
    store.start();
    store.pause();
    
    const state = useTimerStore.getState();
    expect(state.state).toBe(TimerState.PAUSED);
  });

  it('should resume timer', () => {
    const store = useTimerStore.getState();
    store.start();
    store.pause();
    store.resume();
    
    const state = useTimerStore.getState();
    expect(state.state).toBe(TimerState.RUNNING);
  });

  it('should reset timer', () => {
    const store = useTimerStore.getState();
    store.start();
    const initialDuration = store.totalDuration;
    
    // Simulate some time passing
    store.tick();
    store.tick();
    
    store.reset();
    
    const state = useTimerStore.getState();
    expect(state.state).toBe(TimerState.IDLE);
    expect(state.timeElapsed).toBe(0);
    expect(state.timeRemaining).toBe(initialDuration);
  });

  it('should tick and decrement time', () => {
    const store = useTimerStore.getState();
    store.start();
    
    const initialRemaining = store.timeRemaining;
    store.tick();
    
    const state = useTimerStore.getState();
    expect(state.timeElapsed).toBe(1);
    expect(state.timeRemaining).toBe(initialRemaining - 1);
  });

  it('should set task label', () => {
    const store = useTimerStore.getState();
    const taskLabel = 'Write documentation';
    
    store.setTaskLabel(taskLabel);
    
    const state = useTimerStore.getState();
    expect(state.taskLabel).toBe(taskLabel);
  });
});
