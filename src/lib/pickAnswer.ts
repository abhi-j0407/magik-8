import type { Answer, ThemePack } from '../types/oracle';
import { randomInt } from './rng';

export function pickAnswer(pack: ThemePack): Answer {
  const index = randomInt(pack.answers.length);
  return pack.answers[index];
}
