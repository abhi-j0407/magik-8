import { motion, useReducedMotion } from 'motion/react';
import { THEME_PACKS } from '../data/answers';
import { useOracle } from '../context/OracleContext';
import type { ThemePack } from '../types/oracle';

export function ThemeChips() {
  const { packId, phase, setTheme } = useOracle();
  const reducedMotion = useReducedMotion();
  const canChangeTheme = phase === 'idle' || phase === 'answered';

  return (
    <div
      className="relative flex w-full max-w-md items-stretch gap-1 rounded-[11px] border border-(--m8-rule) bg-[oklch(15%_0.008_270)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_2px_rgba(0,0,0,0.4)]"
      role="tablist"
      aria-label="Answer theme"
    >
      {THEME_PACKS.map((pack) => (
        <ThemeChip
          key={pack.id}
          pack={pack}
          selected={packId === pack.id}
          disabled={!canChangeTheme}
          reducedMotion={!!reducedMotion}
          onSelect={() => setTheme(pack.id)}
        />
      ))}
    </div>
  );
}

function ThemeChip({
  pack,
  selected,
  disabled,
  reducedMotion,
  onSelect,
}: {
  pack: ThemePack;
  selected: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`group relative flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-(--m8-font-ui) text-[11px] font-bold lowercase tracking-[0.04em] whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--m8-accent) disabled:cursor-not-allowed ${
        selected
          ? 'text-(--m8-accent-strong)'
          : 'text-(--m8-chrome-dim) enabled:hover:text-(--m8-chrome)'
      } ${disabled && !selected ? 'opacity-40' : ''}`}
    >
      {selected && (
        <motion.span
          layoutId="m8-chip-active"
          aria-hidden
          className="absolute inset-0 rounded-lg border border-(--m8-accent-line) bg-(--m8-accent-ghost)"
          style={{ boxShadow: '0 0 16px -6px var(--m8-accent)' }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 520, damping: 40 }
          }
        />
      )}
      <span
        aria-hidden
        className="relative z-1 h-1.5 w-1.5 rounded-full transition-shadow"
        style={{
          background: selected ? 'var(--m8-accent)' : 'var(--m8-rule-hi)',
          boxShadow: selected ? '0 0 7px var(--m8-accent)' : undefined,
        }}
      />
      <span className="relative z-1">{pack.label.toLowerCase()}</span>
    </button>
  );
}
