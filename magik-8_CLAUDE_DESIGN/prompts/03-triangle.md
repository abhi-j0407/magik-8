# 03 — Rebuild `AnswerTriangle.tsx`

## File touched
- `src/components/AnswerTriangle.tsx`

## Reference image
- `exports/04-triangle-anatomy.png` (anatomy A–G)

## Preserve (do NOT change)
- The component signature + the `useOracle()` hook usage
- The `REVEAL_MS = 600` constant
- The `useEffect` that calls `onAnimationDone()` after the reveal
- All `aria-*` attributes
- The `useReducedMotion()` branches
- The easter-egg color flip (when `result.isEasterEgg`, use `--m8-amber` for the text)
- The "neutral category" small caption underneath ("The oracle is unclear — ask again.")

## Replace
The inner JSX — both the SVG and the text overlay. The new version uses an inline SVG with a `<linearGradient>` for the cobalt ink + a `<clipPath>` for the rise animation.

## New JSX

```tsx
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { useOracle } from '../context/OracleContext';

const REVEAL_MS = 600;

type AnswerTriangleProps = {
  onRevealComplete?: () => void;
};

export function AnswerTriangle({ onRevealComplete }: AnswerTriangleProps) {
  const { phase, result, onAnimationDone } = useOracle();
  const reducedMotion = useReducedMotion();

  const showInk = phase === 'revealing' || phase === 'answered';
  const showText = phase === 'answered';
  const answerText = result?.isEasterEgg
    ? result.easterEggText ?? result.answer.text
    : result?.answer.text;
  const isEasterEgg = result?.isEasterEgg ?? false;
  const isNeutral = result?.answer.category === 'neutral';

  useEffect(() => {
    if (phase !== 'revealing') return;
    const duration = reducedMotion ? 0 : REVEAL_MS;
    const id = setTimeout(() => {
      onAnimationDone();
      onRevealComplete?.();
    }, duration);
    return () => clearTimeout(id);
  }, [phase, reducedMotion, onAnimationDone, onRevealComplete]);

  return (
    <div
      className="relative mx-auto h-full w-full"
      aria-hidden={!showInk}
    >
      <svg
        viewBox="0 0 100 87"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        style={{
          filter:
            'drop-shadow(0 1px 0 rgba(255,255,255,0.04)) drop-shadow(0 -1px 0 rgba(0,0,0,0.6))',
        }}
      >
        <defs>
          {/* cobalt ink, two-tone vertical */}
          <linearGradient id="m8-ink" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="var(--m8-fluid-hi)" />
            <stop offset="22%" stopColor="var(--m8-fluid-mid)" />
            <stop offset="100%" stopColor="var(--m8-fluid-deep)" />
          </linearGradient>
          {/* cavity recess */}
          <radialGradient id="m8-recess" cx="50%" cy="25%" r="85%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="65%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
          </radialGradient>
          {/* bezel rim */}
          <linearGradient id="m8-bezel" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="oklch(20% 0.005 270)" />
            <stop offset="100%" stopColor="oklch(2% 0 0)" />
          </linearGradient>
          <filter id="m8-blur-soft">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
          <clipPath id="m8-clip">
            <polygon points="50,4 96,83 4,83" />
          </clipPath>
        </defs>

        {/* outer bezel */}
        <polygon points="50,1 99,86 1,86" fill="url(#m8-bezel)" />

        {/* inner cavity */}
        <polygon points="50,4 96,83 4,83" fill="var(--m8-cavity-dark)" />

        {/* clipped ink fill — animates y/height for rise */}
        <g clipPath="url(#m8-clip)">
          <motion.rect
            x={0}
            width={100}
            initial={false}
            animate={{
              y: showInk ? 4 : 83,
              height: showInk ? 79 : 0,
            }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: REVEAL_MS / 1000, ease: [0.16, 0.8, 0.3, 1] }
            }
            fill="url(#m8-ink)"
          />
          {showInk && (
            <line
              x1="6" x2="94" y1="6" y2="6"
              stroke="var(--m8-fluid-meniscus)"
              strokeWidth="0.6"
              opacity="0.55"
              filter="url(#m8-blur-soft)"
            />
          )}
          <polygon
            points="50,4 96,83 4,83"
            fill="url(#m8-recess)"
            opacity={showInk ? 0.55 : 0.75}
          />
          {showInk && (
            <>
              <line x1="32" y1="6" x2="36" y2="78" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
              <line x1="62" y1="6" x2="58" y2="78" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
            </>
          )}
        </g>

        {/* glass dome reflection */}
        <ellipse cx="50" cy="14" rx="22" ry="2.5" fill="rgba(255,255,255,0.06)" />
      </svg>

      {/* answer text — HTML overlay for crisp typography */}
      <div
        className="absolute flex items-center justify-center text-center"
        style={{
          inset: '32% 12% 14% 12%',
          fontFamily: 'var(--m8-font-answer)',
          fontWeight: 600,
          fontSize: 'clamp(14px, 4.4vw, 22px)',
          lineHeight: 1.02,
          letterSpacing: '0.015em',
          textTransform: 'uppercase',
          textWrap: 'balance',
          color: isEasterEgg ? 'var(--m8-amber)' : 'var(--m8-answer-ink)',
          textShadow: isEasterEgg
            ? '0 0 10px oklch(78% 0.135 78 / 0.45)'
            : '0 0 8px var(--m8-answer-glow)',
        } as React.CSSProperties}
      >
        <AnimatePresence mode="wait">
          {showText && answerText && (
            <motion.span
              key={answerText}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { delay: REVEAL_MS / 1000, duration: 0.2 }
              }
              aria-live="polite"
              aria-atomic="true"
            >
              {answerText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* neutral retry caption */}
      {phase === 'answered' && isNeutral && (
        <p
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-xs text-(--m8-chrome-mute)"
          style={{ width: '140%' }}
        >
          The oracle is unclear — ask again.
        </p>
      )}
    </div>
  );
}
```

## Verification

```bash
npm run dev
```

Walk the ritual:

1. **Idle:** triangle reads as a dark recessed cavity. No ink visible. Faint cobalt tint (the `--m8-cavity-dark` value has a small chroma in the blue direction).
2. **Shake (tap the ball):** ball wobbles. Triangle unchanged.
3. **After ~400ms:** ink rises smoothly from the bottom point upward, filling the triangle over 600ms. A thin meniscus line is visible at the surface.
4. **After ~1000ms:** answer text fades in over 200ms in Oswald 600 uppercase.
5. **Easter egg** (you can force this by mocking `result.isEasterEgg = true` in dev): text turns amber with a subtle glow.

If the ink looks like a solid flat blue, check that the SVG `<linearGradient id="m8-ink">` is correctly referenced as `fill="url(#m8-ink)"`. If the cavity looks bright in the idle state, check that you kept the recess overlay `<polygon fill="url(#m8-recess)">`.

## Tests to keep passing
- E2E `e2e/smoke.spec.ts` reads the answer text via `aria-live="polite"` selector — preserved.
