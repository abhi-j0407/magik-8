import { motion, useReducedMotion } from 'motion/react';
import { useOracle } from '../context/OracleContext';
import { useShakeSensorStatus } from './ShakeSensors';

export function ShakeCTA() {
  const { phase, shakeOrTap, reset } = useOracle();
  const { needsPermissionPrompt, motionDenied, requestPermission } =
    useShakeSensorStatus();
  const reducedMotion = useReducedMotion();
  const busy = phase === 'shaking' || phase === 'revealing';
  const answered = phase === 'answered';

  const handleClick = () => {
    if (needsPermissionPrompt) {
      void requestPermission();
      return;
    }
    if (answered) {
      reset();
      return;
    }
    shakeOrTap();
  };

  const label = busy
    ? 'consulting'
    : answered
      ? 'ask again'
      : needsPermissionPrompt
        ? 'enable shake'
        : 'tap to shake';

  const ariaLabel = busy
    ? 'Oracle is thinking'
    : answered
      ? 'Ask the oracle again'
      : needsPermissionPrompt
        ? 'Enable shake detection'
        : motionDenied
          ? 'Tap to shake the Magik 8 — motion unavailable'
          : 'Tap to shake the Magik 8';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={ariaLabel}
      className={`m8-cta ${busy ? 'm8-cta-busy' : ''}`}
      whileTap={busy || reducedMotion ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
    >
      <span className="m8-cta-corner m8-cta-corner-tl" aria-hidden>
        ┌
      </span>
      <span className="m8-cta-corner m8-cta-corner-tr" aria-hidden>
        ┐
      </span>
      <span className="m8-cta-corner m8-cta-corner-bl" aria-hidden>
        └
      </span>
      <span className="m8-cta-corner m8-cta-corner-br" aria-hidden>
        ┘
      </span>
      <span className="m8-cta-label inline-flex items-center">
        {label}
        {busy && <BusyDots reducedMotion={!!reducedMotion} />}
      </span>
    </motion.button>
  );
}

function BusyDots({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return <span aria-hidden>…</span>;
  return (
    <span aria-hidden className="inline-flex w-[1.4em] justify-start">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.18,
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}
