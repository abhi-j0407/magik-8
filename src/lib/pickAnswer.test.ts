import { afterEach, describe, expect, it, vi } from 'vitest';
import { THEME_PACKS } from '../data/answers';
import { pickAnswer } from './pickAnswer';
import * as rng from './rng';

describe('pickAnswer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns answer at random index 0..19', () => {
    vi.spyOn(rng, 'randomInt').mockReturnValue(7);
    const pack = THEME_PACKS[0];
    const answer = pickAnswer(pack);
    expect(answer).toEqual(pack.answers[7]);
    expect(rng.randomInt).toHaveBeenCalledWith(20);
  });

  it('index 0 returns first answer', () => {
    vi.spyOn(rng, 'randomInt').mockReturnValue(0);
    const pack = THEME_PACKS[1];
    expect(pickAnswer(pack)).toEqual(pack.answers[0]);
  });

  it('index 19 returns last answer', () => {
    vi.spyOn(rng, 'randomInt').mockReturnValue(19);
    const pack = THEME_PACKS[2];
    expect(pickAnswer(pack)).toEqual(pack.answers[19]);
  });
});
