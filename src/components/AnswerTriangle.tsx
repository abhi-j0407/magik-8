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

  const showWindow = phase === 'revealing' || phase === 'answered';
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
      className="relative mx-auto aspect-[1/0.866] w-[38%] min-w-[88px] overflow-hidden"
      aria-hidden={!showWindow}
    >
      <svg
        viewBox="0 0 100 87"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <polygon
          points="50,4 96,83 4,83"
          className="fill-(--magik-sphere-highlight) stroke-(--magik-sphere-highlight)"
          strokeWidth="1"
        />
      </svg>

      <div className="absolute inset-x-[8%] bottom-[12%] top-[28%] overflow-hidden rounded-sm">
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-(--magik-fluid)"
          initial={false}
          animate={{
            height: showWindow ? '100%' : '0%',
          }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: REVEAL_MS / 1000, ease: 'easeOut' }
          }
        />
        <AnimatePresence mode="wait">
          {showWindow && answerText && (
            <motion.p
              key={answerText}
              className={`relative z-10 flex h-full items-center justify-center px-2 text-center font-(--font-answer) text-[clamp(0.55rem,2.8vw,0.75rem)] leading-tight tracking-wide uppercase ${
                isEasterEgg ? 'text-(--magik-accent)' : 'text-(--magik-answer-text)'
              }`}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { delay: REVEAL_MS / 1000, duration: 0.2 }
              }
              aria-live="polite"
              aria-atomic="true"
            >
              {answerText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {phase === 'answered' && isNeutral && (
        <p className="absolute -bottom-8 left-1/2 w-[140%] -translate-x-1/2 text-center text-xs text-(--magik-muted)">
          The oracle is unclear — ask again.
        </p>
      )}
    </div>
  );
}
