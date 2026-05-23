# 02 — Rebuild `MagikBall.tsx`

## File touched
- `src/components/MagikBall.tsx`

## Reference image
- `exports/03-ball-anatomy.png` (anatomy + callouts A–G)
- `exports/07-states.png` (idle / shaking / revealing / answered)

## Preserve (do NOT change)
- The `motion.button` wrapper and all of its props (`onClick`, `disabled`, `aria-label`, `focus-visible:outline-*`, etc.)
- The `useOracle()` destructuring + `handleBallClick` callback
- The `useReducedMotion()` branch — keep the same `animate` / `transition` logic
- `BALL_SIZE` constant
- The fact that the inner `<AnswerTriangle/>` is rendered at the bottom of the ball

## Replace
The inner JSX **inside** the `motion.button` (i.e. the existing `<div>` with the sphere gradient + the "8" field + the `<AnswerTriangle/>` slot). Replace it with the layered sphere stack below.

## New JSX

```tsx
import { motion, useReducedMotion } from 'motion/react';
import { useOracle } from '../context/OracleContext';
import { AnswerTriangle } from './AnswerTriangle';

const BALL_SIZE = 'min(70vh, 360px)';

export function MagikBall() {
  const { phase, shakeOrTap, reset } = useOracle();
  const reducedMotion = useReducedMotion();

  const isShaking = phase === 'shaking';
  const hideEight = phase === 'revealing' || phase === 'answered';
  const idleFloat = phase === 'idle';
  const busy = phase === 'shaking' || phase === 'revealing';
  const answered = phase === 'answered';

  const handleBallClick = () => {
    if (answered) reset();
    else shakeOrTap();
  };

  return (
    <div className="relative mx-auto" style={{ width: BALL_SIZE, height: BALL_SIZE }}>
      <motion.button
        type="button"
        className="m8-ball relative block w-full h-full p-0 border-0 bg-transparent cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-(--m8-fluid-hi)"
        aria-label={
          answered
            ? 'Magik 8 ball — tap to ask again'
            : 'Magik 8 ball — tap or shake to reveal'
        }
        disabled={busy}
        onClick={handleBallClick}
        animate={
          reducedMotion
            ? isShaking
              ? { opacity: [1, 0.85, 1] }
              : { opacity: 1 }
            : isShaking
              ? { rotate: [-8, 7, -6, 5, 0] }
              : idleFloat
                ? { y: [0, -6, 0] }
                : { y: 0 }
        }
        transition={
          isShaking
            ? { duration: 0.4, ease: 'easeInOut' }
            : idleFloat
              ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
        }
        style={{
          filter:
            'drop-shadow(0 18px 28px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        }}
      >
        {/* ── sphere ────────────────────────────────────────────────── */}
        <div className="relative h-full w-full overflow-hidden rounded-full isolate">
          {/* base radial */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, var(--m8-sphere-mid) 0%, var(--m8-sphere-core) 45%, var(--m8-sphere-rim) 100%)',
            }}
          />
          {/* warm bottom bounce */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse 60% 35% at 50% 95%, var(--m8-sphere-warm) 0%, transparent 70%)',
              mixBlendMode: 'screen',
              opacity: 0.6,
            }}
          />
          {/* rim darkening */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                'inset 0 0 30px rgba(0,0,0,0.85), inset -12px -22px 40px rgba(0,0,0,0.55), inset 6px 8px 18px rgba(255,255,255,0.04)',
            }}
          />
          {/* diffuse upper-left highlight */}
          <div
            className="absolute rounded-full"
            style={{
              top: '6%', left: '12%', width: '55%', height: '45%',
              background:
                'radial-gradient(circle at 30% 30%, var(--m8-sphere-hi) 0%, transparent 65%)',
              opacity: 0.55,
              filter: 'blur(6px)',
              mixBlendMode: 'screen',
            }}
          />
          {/* hard specular */}
          <div
            className="absolute rounded-full"
            style={{
              top: '12%', left: '22%', width: '14%', height: '10%',
              background:
                'radial-gradient(circle at 50% 50%, var(--m8-sphere-spec) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)',
              filter: 'blur(2px)',
              opacity: 0.85,
            }}
          />
          {/* secondary tiny spec */}
          <div
            className="absolute rounded-full"
            style={{
              top: '22%', left: '38%', width: '4%', height: '3%',
              background: 'rgba(255,255,255,0.55)',
              filter: 'blur(0.5px)',
            }}
          />

          {/* ── white "8" field ───────────────────────────────────── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full transition-opacity duration-300"
            style={{
              top: '18%',
              width: '42%',
              aspectRatio: '1',
              background:
                'radial-gradient(circle at 50% 30%, var(--m8-stripe) 0%, var(--m8-stripe) 70%, var(--m8-stripe-shadow) 100%)',
              boxShadow:
                'inset 0 -3px 8px rgba(0,0,0,0.18), inset 0 2px 6px rgba(255,255,255,0.6), 0 1px 0 rgba(0,0,0,0.4)',
              opacity: hideEight ? 0 : 1,
            }}
            aria-hidden={hideEight}
          >
            <span
              className="font-(--m8-font-numeral) leading-[0.95] text-(--m8-eight)"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(64px, 22vw, 124px)',
                letterSpacing: '-0.02em',
                textShadow: '0 1px 0 rgba(255,255,255,0.4)',
              }}
              aria-hidden
            >
              8
            </span>
          </div>

          {/* ── triangle window ──────────────────────────────────── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              bottom: '12%',
              width: '38%',
              aspectRatio: '1 / 0.866',
            }}
          >
            <AnswerTriangle />
          </div>
        </div>
      </motion.button>

      {/* contact shadow — separate from ball, below */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: '-16px',
          width: '75%',
          height: '22px',
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}
```

## Verification

```bash
npm run dev
```

You should see:

- **Idle:** ball reads as a black glossy plastic sphere with the off-center white "8" field, a soft upper-left highlight + a tight specular hotspot, a faint warm rim at the bottom, and a soft contact shadow underneath. Floats gently.
- **Shaking:** ball wobbles ±8° for 400ms.
- **Revealing/answered:** the white "8" field fades out (the triangle window becomes the visual focus).

If the ball looks flat / button-like, check that all five gradient layers are stacked (the `box-shadow` + the `mix-blend-mode: screen` layers are easy to drop accidentally).

## Tests to keep passing
- `src/hooks/oracleMachine.test.ts` (no DOM in there — should be fine)
- E2E `e2e/smoke.spec.ts` — the existing selectors / aria-labels are preserved.
