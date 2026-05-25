import { motion, useReducedMotion } from 'motion/react';
import { useOracle } from '../context/OracleContext';

const STATUS_LABEL: Record<string, string> = {
  idle: 'ready',
  shaking: 'agitating',
  revealing: 'revealing',
  answered: 'settled',
};

export function HUDStrip({ shakeCount }: { shakeCount: number }) {
  const { phase, packId } = useOracle();
  const reducedMotion = useReducedMotion();
  const busy = phase === 'shaking' || phase === 'revealing';

  const statusTone =
    phase === 'idle'
      ? 'border-(--m8-rule) text-(--m8-chrome-dim)'
      : phase === 'answered'
        ? 'border-(--m8-accent-line) text-(--m8-accent-strong)'
        : 'border-(--m8-accent-dim) text-(--m8-accent)';

  return (
    <div
      className="flex w-full items-center gap-2.5 border-b border-(--m8-rule) pb-2.5 font-(--m8-font-hud) text-(--m8-chrome-dim) uppercase"
      style={{ fontSize: 12, letterSpacing: '0.14em', whiteSpace: 'nowrap' }}
      aria-hidden
    >
      <span className="text-(--m8-chrome-mute)">sesh</span>
      <span className="m8-tabnum text-(--m8-chrome)">
        {String(shakeCount).padStart(3, '0')}
      </span>
      <span className="text-(--m8-rule-hi)">·</span>
      <span
        className="font-bold text-(--m8-accent-strong)"
        style={{ transition: 'color var(--m8-dur-theme) var(--m8-ease-toy)' }}
      >
        {packId}
      </span>

      <span
        className={`ml-auto inline-flex items-center gap-1.5 rounded-sm border px-2 py-[3px] text-[11px] ${statusTone}`}
        style={{ transition: 'color 200ms, border-color 200ms' }}
      >
        <motion.span
          className="h-1 w-1 rounded-full"
          style={{ background: 'currentColor' }}
          animate={busy && !reducedMotion ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
          transition={busy ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
        />
        {STATUS_LABEL[phase] ?? phase}
      </span>
    </div>
  );
}
