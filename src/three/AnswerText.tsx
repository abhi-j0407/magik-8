import type { OraclePhase, OracleResult } from '../types/oracle';

/** Answer-window aperture on die face — keep in sync with AnswerWindow recess. */
export const DIE_WINDOW_RADIUS = 0.26;

/** Longest pack strings (career / party / easter eggs) must fit inside the triangular facet. */
export const ANSWER_TEXT_MAX_WIDTH = DIE_WINDOW_RADIUS * 1.48;
const BASE_FONT_SIZE = 0.095;
const MIN_FONT_SIZE = 0.042;

export function getAnswerDisplayText(result: OracleResult | null): string | undefined {
  if (!result) return undefined;
  return result.isEasterEgg
    ? result.easterEggText ?? result.answer.text
    : result.answer.text;
}

/** Heuristic font size so longest theme-pack answers fit with troika wrap. */
export function computeAnswerFontSize(text: string): number {
  const len = text.toUpperCase().length;
  if (len <= 12) return BASE_FONT_SIZE;
  if (len <= 18) return BASE_FONT_SIZE * 0.9;
  if (len <= 24) return BASE_FONT_SIZE * 0.78;
  if (len <= 30) return BASE_FONT_SIZE * 0.68;
  return Math.max(MIN_FONT_SIZE, BASE_FONT_SIZE * 0.58);
}

type AnswerTextProps = {
  text: string;
  isEasterEgg: boolean;
  phase: OraclePhase;
  /** Local Z on die face (+Z toward glass). */
  z?: number;
};

/** F1 stub — F3 replaces with cywarr ink panel (no troika / drei Text suspend). */
export function AnswerText(_props: AnswerTextProps) {
  return null;
}

export default AnswerText;
