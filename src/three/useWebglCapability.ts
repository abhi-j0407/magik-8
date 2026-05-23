import { useEffect, useState } from 'react';

/** Fail-closed WebGL1/2 probe (detached canvas, context released immediately). */
function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext('experimental-webgl' as 'webgl', {
        failIfMajorPerformanceCaveat: true,
      });
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Low-power heuristic: ≤2 logical cores or ≤2 GiB device memory (when exposed).
 * Documented in HANDOFF-VISUAL-V3 — keeps WebGL off constrained phones.
 */
function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (cores <= 2) return true;
  if (memory !== undefined && memory <= 2) return true;
  return false;
}

export type WebglCapability = {
  /** WebGL context can be created. */
  capable: boolean;
  prefersReducedMotion: boolean;
  isLowPower: boolean;
};

export function useWebglCapability(): WebglCapability {
  const [capable] = useState(detectWebGL);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPower] = useState(detectLowPower);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return { capable, prefersReducedMotion, isLowPower };
}
