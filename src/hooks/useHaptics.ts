import { useCallback } from 'react';

const SHAKE_PATTERN: number | number[] = [30, 50, 30];
const REVEAL_PATTERN: number | number[] = [80];

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

export function useHaptics() {
  const onShakeDetected = useCallback(() => {
    if (canVibrate()) navigator.vibrate(SHAKE_PATTERN);
  }, []);

  const onReveal = useCallback(() => {
    if (canVibrate()) navigator.vibrate(REVEAL_PATTERN);
  }, []);

  return { onShakeDetected, onReveal };
}
