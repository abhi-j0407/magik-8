import { describe, expect, it, vi } from 'vitest';
import { EASTER_EGG_DENOMINATOR, maybeEasterEgg, type EasterEggDeps } from './easterEgg';

function makeDeps(overrides: Partial<EasterEggDeps> = {}): EasterEggDeps {
  let firstVisitDone = false;
  return {
    getFirstVisitDone: () => firstVisitDone,
    setFirstVisitDone: () => {
      firstVisitDone = true;
    },
    rollInt: vi.fn(() => 1),
    ...overrides,
  };
}

describe('maybeEasterEgg', () => {

  it('triggers first-visit egg once', () => {
    const deps = makeDeps();
    const first = maybeEasterEgg(deps);
    expect(first.triggered).toBe(true);
    expect(first.id).toBe('egg-first-visit');
    expect(first.text).toBe('Welcome, seeker of dubious wisdom');

    const second = maybeEasterEgg(deps);
    expect(second.id).not.toBe('egg-first-visit');
  });

  it('triggers random egg when roll is 0 (1/40)', () => {
    const rollInt = vi.fn((max: number) => (max === EASTER_EGG_DENOMINATOR ? 0 : 2));
    const deps = makeDeps({
      getFirstVisitDone: () => true,
      rollInt,
    });
    const result = maybeEasterEgg(deps);
    expect(result.triggered).toBe(true);
    expect(result.id).not.toBe('egg-first-visit');
    expect(result.text).toBeDefined();
  });

  it('does not trigger when roll misses', () => {
    const deps = makeDeps({
      getFirstVisitDone: () => true,
      rollInt: () => 5,
    });
    expect(maybeEasterEgg(deps).triggered).toBe(false);
  });

  it('statistical smoke: only roll 0 of 40 triggers random egg', () => {
    const depsTrigger = makeDeps({
      getFirstVisitDone: () => true,
      rollInt: vi.fn((max: number) => (max === EASTER_EGG_DENOMINATOR ? 0 : 2)),
    });
    expect(maybeEasterEgg(depsTrigger).triggered).toBe(true);

    const depsMiss = makeDeps({
      getFirstVisitDone: () => true,
      rollInt: vi.fn((max: number) => (max === EASTER_EGG_DENOMINATOR ? 1 : 2)),
    });
    expect(maybeEasterEgg(depsMiss).triggered).toBe(false);
  });
});
