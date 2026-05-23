import { describe, expect, it } from 'vitest';
import { EASTER_EGGS, THEME_PACKS } from '../data/answers';
import {
  ANSWER_TEXT_MAX_WIDTH,
  computeAnswerFontSize,
  getAnswerDisplayText,
} from './AnswerText';
import { DIE_WINDOW_RADIUS } from './AnswerText';

describe('computeAnswerFontSize', () => {
  it('shrinks monotonically for longer strings', () => {
    const short = computeAnswerFontSize('Yes');
    const long = computeAnswerFontSize('Approved in the parallel timeline');
    expect(long).toBeLessThan(short);
  });

  it('fits every theme-pack and easter-egg string above minimum size', () => {
    const all = [
      ...THEME_PACKS.flatMap((p) => p.answers.map((a) => a.text)),
      ...EASTER_EGGS.map((e) => e.text),
    ];
    for (const text of all) {
      expect(computeAnswerFontSize(text)).toBeGreaterThanOrEqual(0.042);
    }
  });
});

describe('getAnswerDisplayText', () => {
  it('prefers easter egg copy', () => {
    expect(
      getAnswerDisplayText({
        isEasterEgg: true,
        easterEggText: 'Error 8: fate overflow',
        answer: { id: 'x', category: 'affirmative', text: 'Yes' },
      }),
    ).toBe('Error 8: fate overflow');
  });
});

describe('ANSWER_TEXT_MAX_WIDTH', () => {
  it('scales with die window radius', () => {
    expect(ANSWER_TEXT_MAX_WIDTH).toBeCloseTo(DIE_WINDOW_RADIUS * 1.48, 5);
  });
});
