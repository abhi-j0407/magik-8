import { describe, expect, it } from 'vitest';
import { ANSWER_PLANE_SIZE, INK_STEP, LENS_TOP_Y } from './AnswerPanel';

describe('AnswerPanel cywarr scale', () => {
  it('uses R=1 panel size and instance step from cywarr R=4', () => {
    expect(ANSWER_PLANE_SIZE).toBe(0.8);
    expect(INK_STEP).toBe(0.0125);
    expect(LENS_TOP_Y).toBe(0.75);
  });

  it('positions four instances at LENS_TOP_Y - INK_STEP * (3 - i)', () => {
    const ys = [0, 1, 2, 3].map((i) => LENS_TOP_Y - INK_STEP * (3 - i));
    expect(ys[0]).toBeCloseTo(0.7125, 5);
    expect(ys[3]).toBeCloseTo(0.75, 5);
    expect(ys[1] - ys[0]).toBeCloseTo(INK_STEP, 5);
  });
});
