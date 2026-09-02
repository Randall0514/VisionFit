import { useEffect, useRef, useCallback } from 'react';

const TIMEOUT_DURATION = 30 * 60 * 1000;
const WARNING_DURATION = 28 * 60 * 1000;
const ACTIVITY_DEBOUNCE = 1000;

interface UseSessionTimeoutProps {
  onWarning: (timeLeft: number) => void;
  onTimeout: () => void;
  enabled: boolean;
}

export default function useSessionTimeout({ onWarning, onTimeout, enabled }: UseSessionTimeoutProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    let remaining = 120;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearAllTimers();
        onTimeout();
      }
    }, 1000);
  }, [clearAllTimers, onTimeout]);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    lastActivityRef.current = Date.now();

    warningRef.current = setTimeout(() => {
      onWarning(WARNING_DURATION);
      startCountdown();
    }, WARNING_DURATION);

    timeoutRef.current = setTimeout(() => {
      clearAllTimers();
      onTimeout();
    }, TIMEOUT_DURATION);
  }, [clearAllTimers, onWarning, onTimeout, startCountdown]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastActivityRef.current > ACTIVITY_DEBOUNCE) {
      if (!warningRef.current) {
        resetTimer();
      }
    }
  }, [resetTimer]);

  const dismissWarning = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) {
      clearAllTimers();
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));

    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearAllTimers();
    };
  }, [enabled, handleActivity, resetTimer, clearAllTimers]);

  return { dismissWarning };
}
