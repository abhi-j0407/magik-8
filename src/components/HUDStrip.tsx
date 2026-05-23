import { useOracle } from '../context/OracleContext';

const STATUS_LABEL: Record<string, string> = {
  idle: 'ready',
  shaking: 'agitating',
  revealing: 'revealing',
  answered: 'settled',
};

export function HUDStrip({ shakeCount }: { shakeCount: number }) {
  const { phase, packId } = useOracle();
  return (
    <div
      className="flex w-full items-center gap-2.5 font-(--m8-font-hud) text-(--m8-chrome-dim) uppercase"
      style={{
        fontSize: 14,
        letterSpacing: '0.12em',
        whiteSpace: 'nowrap',
      }}
      aria-hidden
    >
      <span>sesh</span>
      <span className="text-(--m8-chrome)">{String(shakeCount).padStart(3, '0')}</span>
      <span className="text-(--m8-rule-hi)">/</span>
      <span className="text-(--m8-chrome)">{packId}</span>
      <span
        className={`ml-auto rounded-sm border px-2 py-[2px] text-[13px] ${
          phase === 'idle'
            ? 'border-(--m8-rule) text-(--m8-chrome-dim)'
            : phase === 'shaking'
              ? 'border-(--m8-amber-dim) text-(--m8-amber)'
              : phase === 'revealing'
                ? 'border-(--m8-fluid-mid) text-(--m8-fluid-hi)'
                : 'border-(--m8-fluid-hi) text-(--m8-fluid-meniscus)'
        }`}
      >
        {STATUS_LABEL[phase] ?? phase}
      </span>
    </div>
  );
}
