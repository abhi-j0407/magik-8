import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectLowPower, detectWebGL } from './useWebglCapability';

describe('detectLowPower', () => {
  it('returns false when cores are above threshold', () => {
    const nav = { hardwareConcurrency: 8, deviceMemory: 2 } as unknown as Navigator;
    expect(detectLowPower(nav)).toBe(false);
  });

  it('returns true when hardwareConcurrency <= 2', () => {
    const nav = { hardwareConcurrency: 2 } as unknown as Navigator;
    expect(detectLowPower(nav)).toBe(true);
  });

  it('ignores deviceMemory (F1: only core count gates low-power)', () => {
    const nav = { hardwareConcurrency: 8, deviceMemory: 1 } as unknown as Navigator;
    expect(detectLowPower(nav)).toBe(false);
  });
});

describe('detectWebGL', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects SwiftShader renderer via debug extension', () => {
    const loseContext = vi.fn();
    const getExtension = vi.fn((name: string) => {
      if (name === 'WEBGL_debug_renderer_info') {
        return { UNMASKED_RENDERER_WEBGL: 0x9246 };
      }
      if (name === 'WEBGL_lose_context') return { loseContext };
      return null;
    });
    const getParameter = vi.fn((p: number) =>
      p === 0x9246 ? 'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader)' : null,
    );
    const gl = { getExtension, getParameter };
    const getContext = vi.fn(() => gl);

    vi.stubGlobal('document', {
      createElement: () => ({ getContext }),
    });

    expect(detectWebGL()).toBe(false);
    expect(loseContext).toHaveBeenCalled();
  });

  it('rejects llvmpipe renderer via debug extension', () => {
    const loseContext = vi.fn();
    const getExtension = vi.fn((name: string) => {
      if (name === 'WEBGL_debug_renderer_info') {
        return { UNMASKED_RENDERER_WEBGL: 0x9246 };
      }
      if (name === 'WEBGL_lose_context') return { loseContext };
      return null;
    });
    const getParameter = vi.fn((p: number) =>
      p === 0x9246 ? 'Mesa DRI Intel(R) HD Graphics (llvmpipe)' : null,
    );
    const gl = { getExtension, getParameter };
    const getContext = vi.fn(() => gl);

    vi.stubGlobal('document', {
      createElement: () => ({ getContext }),
    });

    expect(detectWebGL()).toBe(false);
    expect(loseContext).toHaveBeenCalled();
  });

  it('accepts capable GPU when debug extension reports a real renderer', () => {
    const loseContext = vi.fn();
    const getExtension = vi.fn((name: string) => {
      if (name === 'WEBGL_debug_renderer_info') {
        return { UNMASKED_RENDERER_WEBGL: 0x9246 };
      }
      if (name === 'WEBGL_lose_context') return { loseContext };
      return null;
    });
    const getParameter = vi.fn((p: number) =>
      p === 0x9246 ? 'Apple GPU' : null,
    );
    const gl = { getExtension, getParameter };
    const getContext = vi.fn(() => gl);

    vi.stubGlobal('document', {
      createElement: () => ({ getContext }),
    });

    expect(detectWebGL()).toBe(true);
    expect(loseContext).toHaveBeenCalled();
  });
});
