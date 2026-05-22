import { describe, expect, it } from 'vitest';
import { randomInt } from './rng';

describe('randomInt', () => {
  it('returns values in range [0, max)', () => {
    for (let i = 0; i < 200; i++) {
      const n = randomInt(20);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(20);
    }
  });
});
