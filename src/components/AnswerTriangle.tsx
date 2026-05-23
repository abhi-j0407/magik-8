import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId } from 'react';
import { useOracle } from '../context/OracleContext';

const REVEAL_MS = 600;

type AnswerTriangleProps = {
  onRevealComplete?: () => void;
};

export function AnswerTriangle({ onRevealComplete }: AnswerTriangleProps) {
  const { phase, result, onAnimationDone } = useOracle();
  const reducedMotion = useReducedMotion();
  const svgId = useId().replace(/:/g, '');

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

  const inkId = `m8-ink-${svgId}`;
  const recessId = `m8-recess-${svgId}`;
  const bezelId = `m8-bezel-${svgId}`;
  const blurId = `m8-blur-soft-${svgId}`;
  const clipId = `m8-clip-${svgId}`;

  return (
    <div className="relative mx-auto h-full w-full" aria-hidden={!showInk}>
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
          <linearGradient id={inkId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="var(--m8-fluid-hi)" />
            <stop offset="22%" stopColor="var(--m8-fluid-mid)" />
            <stop offset="100%" stopColor="var(--m8-fluid-deep)" />
          </linearGradient>
          <radialGradient id={recessId} cx="50%" cy="25%" r="85%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="65%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
          </radialGradient>
          <linearGradient id={bezelId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="oklch(20% 0.005 270)" />
            <stop offset="100%" stopColor="oklch(2% 0 0)" />
          </linearGradient>
          <filter id={blurId}>
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
          <clipPath id={clipId}>
            <polygon points="50,4 96,83 4,83" />
          </clipPath>
        </defs>

        <polygon points="50,1 99,86 1,86" fill={`url(#${bezelId})`} />
        <polygon points="50,4 96,83 4,83" fill="var(--m8-cavity-dark)" />

        <g clipPath={`url(#${clipId})`}>
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
            fill={`url(#${inkId})`}
          />
          {showInk && (
            <line
              x1="6"
              x2="94"
              y1="6"
              y2="6"
              stroke="var(--m8-fluid-meniscus)"
              strokeWidth="0.6"
              opacity="0.55"
              filter={`url(#${blurId})`}
            />
          )}
          <polygon
            points="50,4 96,83 4,83"
            fill={`url(#${recessId})`}
            opacity={showInk ? 0.55 : 0.75}
          />
          {showInk && (
            <>
              <line
                x1="32"
                y1="6"
                x2="36"
                y2="78"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.3"
              />
              <line
                x1="62"
                y1="6"
                x2="58"
                y2="78"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="0.3"
              />
            </>
          )}
        </g>

        <ellipse cx="50" cy="14" rx="22" ry="2.5" fill="rgba(255,255,255,0.06)" />
      </svg>

      <div
        className="absolute flex items-center justify-center text-center"
        style={{
          inset: '32% 12% 14% 12%',
          fontFamily: 'var(--m8-font-answer)',
          fontWeight: 600,
          fontSize: 'var(--m8-text-answer)',
          lineHeight: 1.02,
          letterSpacing: '0.015em',
          textTransform: 'uppercase',
          textWrap: 'balance',
          color: isEasterEgg ? 'var(--m8-amber)' : 'var(--m8-answer-ink)',
          textShadow: isEasterEgg
            ? '0 0 10px oklch(78% 0.135 78 / 0.45)'
            : '0 0 8px var(--m8-answer-glow)',
        }}
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
