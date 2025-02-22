import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Initial value
    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should handle multiple rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Initial value
    expect(result.current).toBe('initial');

    // Multiple rapid updates
    rerender({ value: 'update1', delay: 500 });
    rerender({ value: 'update2', delay: 500 });
    rerender({ value: 'update3', delay: 500 });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should have the last update only
    expect(result.current).toBe('update3');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Update value with different delay
    rerender({ value: 'updated', delay: 1000 });

    // Advance time by original delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Advance remaining time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should clean up timeout on unmount', () => {
    const { result, unmount } = renderHook(() => useDebounce('test', 500));

    // Initial value
    expect(result.current).toBe('test');

    // Unmount
    unmount();

    // Advance time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // No errors should occur
    expect(result.current).toBe('test');
  });
});