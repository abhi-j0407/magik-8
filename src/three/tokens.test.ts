import { describe, expect, it } from 'vitest';
import { normalizeCssColorToHex, resolveM8Hex, resolvePackHex } from './tokens';

describe('normalizeCssColorToHex', () => {
  it('converts rgb() to hex', () => {
    expect(normalizeCssColorToHex('rgb(12, 22, 48)', 'rgb(0, 0, 0)')).toBe('#0c1630');
  });

  it('falls back when input is empty', () => {
    expect(normalizeCssColorToHex('', 'rgb(12, 22, 48)')).toBe('#0c1630');
  });
});

describe('resolveM8Hex', () => {
  it('returns fallback hex without document', () => {
    expect(resolveM8Hex('fluidDeep')).toBe('#0c1630');
  });
});

describe('resolvePackHex', () => {
  it('differs by pack for fluid hi (classic cobalt vs party red)', () => {
    expect(resolvePackHex('classic', 'fluidHi')).toBe('#0055b7');
    expect(resolvePackHex('party', 'fluidHi')).toBe('#c90014');
  });
});
