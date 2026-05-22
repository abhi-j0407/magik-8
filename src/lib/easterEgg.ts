import { EASTER_EGGS } from '../data/answers';
import { randomInt } from './rng';

export const FIRST_VISIT_STORAGE_KEY = 'magik_first_visit';
export const EASTER_EGG_DENOMINATOR = 40;

const FIRST_VISIT_EGG = EASTER_EGGS.find((e) => e.id === 'egg-first-visit')!;
const RANDOM_EGGS = EASTER_EGGS.filter((e) => e.id !== 'egg-first-visit');

export type EasterEggResult = {
  triggered: boolean;
  id?: string;
  text?: string;
};

export type EasterEggDeps = {
  getFirstVisitDone: () => boolean;
  setFirstVisitDone: () => void;
  rollInt: (max: number) => number;
};

const defaultDeps = (): EasterEggDeps => ({
  getFirstVisitDone: () => {
    try {
      return localStorage.getItem(FIRST_VISIT_STORAGE_KEY) === '1';
    } catch {
      return true;
    }
  },
  setFirstVisitDone: () => {
    try {
      localStorage.setItem(FIRST_VISIT_STORAGE_KEY, '1');
    } catch {
      /* localStorage unavailable */
    }
  },
  rollInt: randomInt,
});

/**
 * REQ-045: first-visit egg once, then 1/40 on each reveal.
 */
export function maybeEasterEgg(deps: EasterEggDeps = defaultDeps()): EasterEggResult {
  if (!deps.getFirstVisitDone()) {
    deps.setFirstVisitDone();
    return {
      triggered: true,
      id: FIRST_VISIT_EGG.id,
      text: FIRST_VISIT_EGG.text,
    };
  }

  if (deps.rollInt(EASTER_EGG_DENOMINATOR) === 0) {
    const egg = RANDOM_EGGS[deps.rollInt(RANDOM_EGGS.length)];
    return { triggered: true, id: egg.id, text: egg.text };
  }

  return { triggered: false };
}
