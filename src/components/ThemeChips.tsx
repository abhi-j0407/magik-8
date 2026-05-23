import { THEME_PACKS } from '../data/answers';
import { useOracle } from '../context/OracleContext';
import type { ThemePack } from '../types/oracle';

export function ThemeChips() {
  const { packId, phase, setTheme } = useOracle();
  const canChangeTheme = phase === 'idle' || phase === 'answered';

  return (
    <div
      className="mx-auto flex w-full max-w-md justify-center gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Answer theme"
    >
      {THEME_PACKS.map((pack) => (
        <ThemeChip
          key={pack.id}
          pack={pack}
          selected={packId === pack.id}
          disabled={!canChangeTheme}
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
  onSelect,
}: {
  pack: ThemePack;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 font-(--m8-font-ui) text-[11px] font-bold lowercase tracking-[0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--m8-amber) disabled:cursor-not-allowed disabled:opacity-45 ${
        selected
          ? 'border-(--m8-amber-dim) bg-[rgba(180,130,30,0.06)] text-(--m8-stripe)'
          : 'border-(--m8-rule) text-(--m8-chrome-dim) hover:border-(--m8-rule-hi) hover:text-(--m8-chrome)'
      }`}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: selected ? 'var(--m8-amber)' : 'var(--m8-rule)',
          boxShadow: selected ? '0 0 6px var(--m8-amber)' : undefined,
        }}
      />
      {pack.label}
    </button>
  );
}
