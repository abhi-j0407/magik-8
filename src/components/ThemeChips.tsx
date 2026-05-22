import { THEME_PACKS } from '../data/answers';
import { useOracle } from '../context/OracleContext';
import type { ThemePack } from '../types/oracle';

export function ThemeChips() {
  const { packId, phase, setTheme } = useOracle();
  const canChangeTheme = phase === 'idle' || phase === 'answered';

  return (
    <div
      className="flex w-full max-w-md gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
      className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--magik-fluid-light) disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? 'border-(--magik-fluid-light) bg-(--magik-fluid) text-(--magik-answer-text)'
          : 'border-(--magik-sphere-highlight) bg-(--magik-sphere) text-(--magik-muted) hover:text-(--magik-answer-text)'
      }`}
    >
      {pack.label}
    </button>
  );
}
