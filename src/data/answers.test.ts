import { describe, expect, it } from 'vitest';
import { THEME_PACKS } from './answers';

describe('theme packs', () => {
  it('has three packs with 20 answers each', () => {
    expect(THEME_PACKS).toHaveLength(3);
    expect(THEME_PACKS.map((p) => p.id)).toEqual(['classic', 'career', 'party']);
    for (const pack of THEME_PACKS) {
      expect(pack.answers).toHaveLength(20);
    }
  });
});
