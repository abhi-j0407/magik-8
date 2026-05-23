import { useEffect, useState } from 'react';

const SWIFT_SHADER_RE = /SwiftShader|llvmpipe/i;

/** Fail-closed WebGL1/2 probe (detached canvas, context released immediately). */
export function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl' as 'webgl');
    if (!gl) return false;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
      if (SWIFT_SHADER_RE.test(renderer)) {
        const lose = gl.getExtension('WEBGL_lose_context');
        lose?.loseContext();
        return false;
      }
    }

    const lose = gl.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Low-power heuristic: ≤2 logical cores (when exposed).
 */
export function detectLowPower(nav: Navigator = typeof navigator !== 'undefined' ? navigator : ({} as Navigator)): boolean {
  const cores = nav.hardwareConcurrency ?? 8;
  return cores <= 2;
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
