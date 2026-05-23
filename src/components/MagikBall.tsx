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
        className="m8-ball relative block h-full w-full cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-(--m8-fluid-hi)"
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
            : idleFloat && !reducedMotion
              ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              : { duration: reducedMotion ? 0 : 0.3 }
        }
        style={{
          filter:
            'drop-shadow(0 18px 28px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        }}
      >
        <div className="relative isolate h-full w-full overflow-hidden rounded-full">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, var(--m8-sphere-mid) 0%, var(--m8-sphere-core) 45%, var(--m8-sphere-rim) 100%)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse 60% 35% at 50% 95%, var(--m8-sphere-warm) 0%, transparent 70%)',
              mixBlendMode: 'screen',
              opacity: 0.6,
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                'inset 0 0 30px rgba(0,0,0,0.85), inset -12px -22px 40px rgba(0,0,0,0.55), inset 6px 8px 18px rgba(255,255,255,0.04)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '6%',
              left: '12%',
              width: '55%',
              height: '45%',
              background:
                'radial-gradient(circle at 30% 30%, var(--m8-sphere-hi) 0%, transparent 65%)',
              opacity: 0.55,
              filter: 'blur(4px)',
              mixBlendMode: 'screen',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '12%',
              left: '22%',
              width: '14%',
              height: '10%',
              background:
                'radial-gradient(circle at 50% 50%, var(--m8-sphere-spec) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)',
              filter: 'blur(2px)',
              opacity: 0.85,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '22%',
              left: '38%',
              width: '4%',
              height: '3%',
              background: 'rgba(255,255,255,0.55)',
              filter: 'blur(0.5px)',
            }}
          />

          <div
            className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full"
            style={{
              top: '18%',
              width: '42%',
              aspectRatio: '1',
              background:
                'radial-gradient(circle at 50% 30%, var(--m8-stripe) 0%, var(--m8-stripe) 70%, var(--m8-stripe-shadow) 100%)',
              boxShadow:
                'inset 0 -3px 8px rgba(0,0,0,0.18), inset 0 2px 6px rgba(255,255,255,0.6), 0 1px 0 rgba(0,0,0,0.4)',
              opacity: hideEight ? 0 : 1,
              transition: 'opacity var(--m8-dur-text-fade) ease',
            }}
            aria-hidden={hideEight}
          >
            <span
              className="font-(--m8-font-numeral) leading-[0.95] text-(--m8-eight)"
              style={{
                fontWeight: 900,
                fontSize: 'var(--m8-text-eight)',
                letterSpacing: '-0.02em',
                textShadow: '0 1px 0 rgba(255,255,255,0.4)',
              }}
              aria-hidden
            >
              8
            </span>
          </div>

          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
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

      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: '-16px',
          width: '75%',
          height: '22px',
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        aria-hidden
      />
    </div>
  );
}
