import { useCallback, useEffect, useRef, useState } from 'react';

/** Option B (hypot) — tuned for iPhone Safari L1 false positives at ~15 */
export const SHAKE_THRESHOLD_DEFAULT = 18;
export const SHAKE_COOLDOWN_MS_DEFAULT = 2000;
export const SHAKE_SPIKE_DELTA_DEFAULT = 5;
export const SHAKE_SUSTAINED_SAMPLES_DEFAULT = 3;
export const SHAKE_SAMPLE_THROTTLE_MS = 33;

const MOTION_DENIED_KEY = 'magik_motion_denied';
const BASELINE_EMA_ALPHA = 0.15;

export type MotionPermission = 'prompt' | 'granted' | 'denied' | 'unsupported';

export type UseShakeOptions = {
  threshold?: number;
  cooldownMs?: number;
  spikeDelta?: number;
  sustainedSamples?: number;
  enabled: boolean;
  /** Oracle phase is shaking — sustained spike completes the ritual */
  isShaking: boolean;
  onShakeDetected: () => void;
  onThresholdMet: () => void;
};

export function magnitudeFromMotion(
  x: number,
  y: number,
  z: number,
): number {
  return Math.hypot(x, y, z);
}

/** Pure shake gate for unit tests (start-of-ritual cooldown). */
export function detectShake(
  magnitude: number,
  threshold: number,
  lastShakeTs: number,
  now: number,
  cooldownMs: number,
): boolean {
  if (magnitude <= threshold) return false;
  if (lastShakeTs > 0 && now - lastShakeTs < cooldownMs) return false;
  return true;
}

/** Jerk vs rolling baseline — rejects resting gravity hover near threshold. */
export function detectShakeSpike(
  magnitude: number,
  baseline: number,
  threshold: number,
  spikeDelta: number,
): boolean {
  if (magnitude <= threshold) return false;
  return magnitude - baseline >= spikeDelta;
}

export function hasSustainedShakeSamples(
  consecutiveAbove: number,
  requiredSamples: number,
): boolean {
  return consecutiveAbove >= requiredSamples;
}

export function updateMotionBaseline(
  currentBaseline: number,
  magnitude: number,
): number {
  return currentBaseline * (1 - BASELINE_EMA_ALPHA) + magnitude * BASELINE_EMA_ALPHA;
}

export function readMotionDenied(): boolean {
  try {
    return localStorage.getItem(MOTION_DENIED_KEY) === '1';
  } catch {
    return false;
  }
}

export function persistMotionDenied(): void {
  try {
    localStorage.setItem(MOTION_DENIED_KEY, '1');
  } catch {
    /* ignore */
  }
}

export async function requestMotionPermission(): Promise<
  'granted' | 'denied' | 'unsupported'
> {
  if (typeof DeviceMotionEvent === 'undefined') return 'unsupported';
  const DME = DeviceMotionEvent as typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
  if (typeof DME.requestPermission !== 'function') return 'granted';
  const result = await DME.requestPermission();
  return result === 'granted' ? 'granted' : 'denied';
}

function initialPermission(): MotionPermission {
  if (typeof DeviceMotionEvent === 'undefined') return 'unsupported';
  if (readMotionDenied()) return 'denied';
  const DME = DeviceMotionEvent as typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
  if (typeof DME.requestPermission === 'function') return 'prompt';
  return 'granted';
}

export function useShake({
  threshold = SHAKE_THRESHOLD_DEFAULT,
  cooldownMs = SHAKE_COOLDOWN_MS_DEFAULT,
  spikeDelta = SHAKE_SPIKE_DELTA_DEFAULT,
  sustainedSamples = SHAKE_SUSTAINED_SAMPLES_DEFAULT,
  enabled,
  isShaking,
  onShakeDetected,
  onThresholdMet,
}: UseShakeOptions) {
  const [permission, setPermission] = useState<MotionPermission>(initialPermission);
  const [isListening, setIsListening] = useState(false);
  const lastShakeTsRef = useRef(0);
  const thresholdMetRef = useRef(false);
  const lastSampleTsRef = useRef(0);
  const baselineRef = useRef(9.8);
  const ritualBaselineRef = useRef(9.8);
  const sustainedCountRef = useRef(0);

  const onShakeDetectedRef = useRef(onShakeDetected);
  const onThresholdMetRef = useRef(onThresholdMet);
  onShakeDetectedRef.current = onShakeDetected;
  onThresholdMetRef.current = onThresholdMet;

  useEffect(() => {
    if (!isShaking) {
      thresholdMetRef.current = false;
      sustainedCountRef.current = 0;
      return;
    }
    ritualBaselineRef.current = baselineRef.current;
    sustainedCountRef.current = 0;
  }, [isShaking]);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - lastSampleTsRef.current < SHAKE_SAMPLE_THROTTLE_MS) return;
      lastSampleTsRef.current = now;

      const x = event.accelerationIncludingGravity?.x ?? 0;
      const y = event.accelerationIncludingGravity?.y ?? 0;
      const z = event.accelerationIncludingGravity?.z ?? 0;
      const magnitude = magnitudeFromMotion(x, y, z);
      const baseline = baselineRef.current;

      if (magnitude <= threshold) {
        sustainedCountRef.current = 0;
        baselineRef.current = updateMotionBaseline(baseline, magnitude);
        return;
      }

      if (isShaking) {
        if (thresholdMetRef.current) return;

        if (
          detectShakeSpike(magnitude, ritualBaselineRef.current, threshold, spikeDelta)
        ) {
          sustainedCountRef.current += 1;
        } else {
          sustainedCountRef.current = 0;
        }

        if (
          hasSustainedShakeSamples(sustainedCountRef.current, sustainedSamples)
        ) {
          thresholdMetRef.current = true;
          lastShakeTsRef.current = now;
          onThresholdMetRef.current();
        }
        return;
      }

      baselineRef.current = updateMotionBaseline(baseline, magnitude);

      if (
        detectShake(magnitude, threshold, lastShakeTsRef.current, now, cooldownMs) &&
        detectShakeSpike(magnitude, baseline, threshold, spikeDelta)
      ) {
        lastShakeTsRef.current = now;
        ritualBaselineRef.current = baseline;
        onShakeDetectedRef.current();
      }
    },
    [threshold, cooldownMs, spikeDelta, sustainedSamples, isShaking],
  );

  useEffect(() => {
    if (!enabled || permission !== 'granted') {
      setIsListening(false);
      return;
    }

    window.addEventListener('devicemotion', handleMotion);
    setIsListening(true);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      setIsListening(false);
    };
  }, [enabled, permission, handleMotion]);

  const requestPermission = useCallback(async () => {
    const result = await requestMotionPermission();
    if (result === 'granted') {
      setPermission('granted');
    } else if (result === 'denied') {
      persistMotionDenied();
      setPermission('denied');
    } else {
      setPermission('unsupported');
    }
  }, []);

  const dismissPermissionPrompt = useCallback(() => {
    persistMotionDenied();
    setPermission('denied');
  }, []);

  return {
    permission,
    requestPermission,
    dismissPermissionPrompt,
    isListening,
    needsPermissionPrompt: permission === 'prompt',
    motionDenied: permission === 'denied' || permission === 'unsupported',
  };
}
