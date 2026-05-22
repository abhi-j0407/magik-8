import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadMuted, MUTE_STORAGE_KEY, saveMuted } from './useAudio';

describe('audio mute storage', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) delete store[key];
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to unmuted', () => {
    expect(loadMuted()).toBe(false);
  });

  it('persists mute in localStorage', () => {
    saveMuted(true);
    expect(store[MUTE_STORAGE_KEY]).toBe('1');
    expect(loadMuted()).toBe(true);
    saveMuted(false);
    expect(loadMuted()).toBe(false);
  });
});
