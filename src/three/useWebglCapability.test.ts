import { describe, expect, it } from 'vitest';
import { detectLowPower } from './useWebglCapability';

describe('detectLowPower', () => {
  it('returns false when cores and memory are above thresholds', () => {
    const nav = { hardwareConcurrency: 8, deviceMemory: 8 } as unknown as Navigator;
    expect(detectLowPower(nav)).toBe(false);
  });

  it('returns true when hardwareConcurrency <= 2', () => {
    const nav = { hardwareConcurrency: 2 } as unknown as Navigator;
    expect(detectLowPower(nav)).toBe(true);
  });

  it('returns true when deviceMemory <= 2 GiB', () => {
    const nav = { hardwareConcurrency: 8, deviceMemory: 2 } as unknown as Navigator;
    expect(detectLowPower(nav)).toBe(true);
  });
});
