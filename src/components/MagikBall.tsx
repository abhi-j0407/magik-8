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
    <motion.button
      type="button"
      className="relative mx-auto block cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--magik-fluid-light)"
      style={{ width: BALL_SIZE, height: BALL_SIZE }}
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
            ? { rotate: [-8, 8, -6, 6, 0] }
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
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-full shadow-[inset_-12px_-24px_40px_rgba(0,0,0,0.55),inset_8px_12px_24px_rgba(255,255,255,0.06)]"
        style={{
          background: `radial-gradient(circle at 32% 28%, var(--magik-sphere-highlight) 0%, var(--magik-sphere) 55%, #050505 100%)`,
        }}
      >
        <div
          className="absolute left-1/2 top-[18%] flex h-[42%] w-[42%] -translate-x-1/2 items-center justify-center rounded-full bg-(--magik-stripe) shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] transition-opacity duration-300"
          style={{ opacity: hideEight ? 0 : 1 }}
          aria-hidden={hideEight}
        >
          <span
            className="font-(--font-answer) text-[clamp(3rem,18vw,5.5rem)] leading-none text-(--magik-eight)"
            aria-hidden
          >
            8
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-[14%] flex justify-center">
          <AnswerTriangle />
        </div>
      </div>
    </motion.button>
  );
}
