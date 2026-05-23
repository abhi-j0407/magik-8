import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import { Color } from 'three';
import type { OraclePhase, OracleResult } from '../types/oracle';
import { resolveM8Color } from './tokens';

/** Answer-window aperture on die face — keep in sync with AnswerWindow recess. */
export const DIE_WINDOW_RADIUS = 0.26;

/** Oswald 600 — self-hosted; matches `--m8-font-answer` in index.css (G9 workbox precache). */
const ANSWER_FONT = '/fonts/oswald-600.woff2';

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

function isWindowSettled(phase: OraclePhase): boolean {
  return phase === 'revealing' || phase === 'answered';
}

export function AnswerText({
  text,
  isEasterEgg,
  phase,
  z = 0.128,
}: AnswerTextProps) {
  const settled = isWindowSettled(phase);
  const showText = settled && phase === 'answered';
  const display = useMemo(() => text.toUpperCase(), [text]);
  const fontSize = useMemo(() => computeAnswerFontSize(text), [text]);

  const ink = useMemo(() => new Color(resolveM8Color('answerInk')), []);
  const amber = useMemo(() => new Color(resolveM8Color('amber')), []);
  const glow = useMemo(() => new Color(resolveM8Color('answerGlow')), []);

  const fill = isEasterEgg ? amber : ink;
  const outline = isEasterEgg ? amber : glow;

  if (!showText) return null;

  return (
    <Text
      position={[0, 0, z]}
      font={ANSWER_FONT}
      fontSize={fontSize}
      maxWidth={ANSWER_TEXT_MAX_WIDTH}
      lineHeight={0.92}
      letterSpacing={0.018}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
      color={fill}
      fillOpacity={1}
      outlineWidth={0.012}
      outlineColor={outline}
      outlineOpacity={isEasterEgg ? 0.55 : 0.42}
      overflowWrap="break-word"
      renderOrder={5}
      depthOffset={-0.002}
    >
      {display}
    </Text>
  );
}
