# 04 — Chrome components (Wordmark, HUDStrip, chips, CTA, mute, sheets, App header)

## Files touched
- **new** `src/components/Wordmark.tsx`
- **new** `src/components/HUDStrip.tsx`
- `src/components/ThemeChips.tsx`
- `src/components/ShakeCTA.tsx`
- `src/components/MuteToggle.tsx`
- `src/components/PermissionSheet.tsx`
- `src/components/ShareSheet.tsx`
- `src/components/ShareCard.tsx` *(only the wordmark portion — full layout in `05-share-card.md`)*
- `src/App.tsx`
- `src/index.css` (append component classes — see end of file)

## Reference image
- `exports/08-components.png` (chips, CTA, mute, sheet)
- `exports/10-prototype-states.png` (full app screen with header + HUD + footer)

---

## A. New file — `src/components/Wordmark.tsx`

```tsx
type WordmarkProps = {
  size?: number;
  className?: string;
};

/** Brand wordmark — VT323, with amber "8" and embossed shadow stack. */
export function Wordmark({ size = 22, className = '' }: WordmarkProps) {
  return (
    <span
      className={`m8-wordmark inline-flex items-baseline ${className}`}
      style={{
        fontFamily: 'var(--m8-font-wordmark)',
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '0.04em',
        color: 'var(--m8-stripe)',
        textShadow:
          '0 1px 0 rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.06), 0 2px 6px rgba(0,0,0,0.5)',
  gap: '0.5em',
        userSelect: 'none',
      }}
    >
      <span>magik</span>
      <span
        style={{
          color: 'var(--m8-amber)',
          fontSize: '1.25em',
          textShadow:
            '0 1px 0 rgba(0,0,0,0.9), 0 0 14px oklch(78% 0.135 78 / 0.55), 0 0 2px oklch(78% 0.135 78 / 0.85)',
        }}
      >
        8
      </span>
    </span>
  );
}
```

---

## B. New file — `src/components/HUDStrip.tsx`

```tsx
import { useOracle } from '../context/OracleContext';

const STATUS_LABEL: Record<string, string> = {
  idle:      'ready',
  shaking:   'agitating',
  revealing: 'revealing',
  answered:  'settled',
};

export function HUDStrip({ shakeCount }: { shakeCount: number }) {
  const { phase, packId } = useOracle();
  return (
    <div
      className="flex items-center gap-2.5 w-full font-(--m8-font-hud) text-(--m8-chrome-dim) uppercase"
      style={{
        fontSize: 14,
        letterSpacing: '0.12em',
        whiteSpace: 'nowrap',
      }}
      aria-hidden  // decorative — the live status comes from aria-live on the answer
    >
      <span>sesh</span>
      <span className="text-(--m8-chrome)">{String(shakeCount).padStart(3, '0')}</span>
      <span className="text-(--m8-rule-hi)">/</span>
      <span className="text-(--m8-chrome)">{packId}</span>
      <span
        className={`ml-auto px-2 py-[2px] border rounded-sm text-[13px] ${
          phase === 'idle'      ? 'border-(--m8-rule)       text-(--m8-chrome-dim)' :
          phase === 'shaking'   ? 'border-(--m8-amber-dim)  text-(--m8-amber)' :
          phase === 'revealing' ? 'border-(--m8-fluid-mid)  text-(--m8-fluid-hi)' :
                                  'border-(--m8-fluid-hi)   text-(--m8-fluid-meniscus)'
        }`}
      >
        {STATUS_LABEL[phase] ?? phase}
      </span>
    </div>
  );
}
```

> Wire `shakeCount` from `App.tsx` — increment a `useState` whenever `phase` transitions to `'shaking'`. (Persist if desired via `localStorage`.)

---

## C. `ThemeChips.tsx`

Replace the body of `ThemeChip` (and remove all `--magik-*` references — already done in step 01):

```tsx
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
      className={`inline-flex items-center gap-1.5 min-h-8 px-3 py-1.5 rounded-full border transition-colors lowercase tracking-[0.02em]
        font-(--m8-font-ui) text-[11px] font-bold
        disabled:opacity-45 disabled:cursor-not-allowed
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--m8-amber)
        ${
          selected
            ? 'border-(--m8-amber-dim) text-(--m8-stripe) bg-[rgba(180,130,30,0.06)]'
            : 'border-(--m8-rule) text-(--m8-chrome-dim) hover:text-(--m8-chrome) hover:border-(--m8-rule-hi)'
        }`}
    >
      <span
        aria-hidden
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: selected ? 'var(--m8-amber)' : 'var(--m8-rule)',
          boxShadow: selected ? '0 0 6px var(--m8-amber)' : undefined,
        }}
      />
      {pack.label.toLowerCase()}
    </button>
  );
}
```

The container `ThemeChips` keeps its existing `role="tablist"`, `aria-label`, and horizontal-scroll classes — just update the chip rendering.

---

## D. `ShakeCTA.tsx`

```tsx
import { useOracle } from '../context/OracleContext';
import { useShakeSensorStatus } from './ShakeSensors';

export function ShakeCTA() {
  const { phase, shakeOrTap, reset } = useOracle();
  const { needsPermissionPrompt, motionDenied, requestPermission } =
    useShakeSensorStatus();
  const busy = phase === 'shaking' || phase === 'revealing';
  const answered = phase === 'answered';

  const handleClick = () => {
    if (needsPermissionPrompt) { void requestPermission(); return; }
    if (answered) { reset(); return; }
    shakeOrTap();
  };

  const label = busy
    ? 'consulting…'
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
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={ariaLabel}
      className="relative inline-flex items-center justify-center min-h-11 px-7 py-3 rounded-sm
        font-(--m8-font-ui) text-[15px] font-bold lowercase tracking-[0.02em]
        text-(--m8-chrome) border border-(--m8-rule)
        hover:border-(--m8-amber-dim) hover:text-(--m8-stripe)
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--m8-amber)
        active:translate-y-[1px] disabled:opacity-55 disabled:cursor-not-allowed transition-colors"
      style={{
        background: 'linear-gradient(180deg, oklch(20% 0.005 270) 0%, oklch(14% 0.005 270) 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(0,0,0,0.6)',
      }}
    >
      {(['tl','tr','bl','br'] as const).map((c) => (
        <span
          key={c}
          aria-hidden
          className="absolute font-(--m8-font-hud) text-[14px] leading-none pointer-events-none"
          style={{
            color: 'var(--m8-chrome-mute)',
            top: c.startsWith('t') ? 2 : 'auto',
            bottom: c.startsWith('b') ? 2 : 'auto',
            left: c.endsWith('l') ? 4 : 'auto',
            right: c.endsWith('r') ? 4 : 'auto',
          }}
        >
          {c === 'tl' ? '┌' : c === 'tr' ? '┐' : c === 'bl' ? '└' : '┘'}
        </span>
      ))}
      <span>{label}</span>
    </button>
  );
}
```

On hover, the corner brackets should transition to amber — append this rule to `src/index.css`:

```css
button:hover > span[aria-hidden]:has(+ span) { color: var(--m8-amber) !important; }
/* ↑ note: this is overly broad. Prefer a dedicated class on the CTA span:
   give the corner spans className="m8-cta-corner", then:
   .m8-cta:hover .m8-cta-corner { color: var(--m8-amber); }
*/
```

Prefer the class-based version. Add `.m8-cta` to the button's className.

---

## E. `MuteToggle.tsx`

Replace the emoji with inline SVGs:

```tsx
import { useAppAudio } from '../context/AudioContext';

export function MuteToggle() {
  const { muted, setMuted, unlock } = useAppAudio();
  const handleClick = () => { unlock(); setMuted(!muted); };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-(--m8-rule)
        text-(--m8-chrome-dim) hover:text-(--m8-chrome) hover:border-(--m8-rule-hi) hover:bg-white/[0.02]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--m8-amber)
        transition-colors"
      aria-pressed={muted}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3v-5Z" fill="currentColor"/>
          <path d="M11 6l3 3M14 6l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3v-5Z" fill="currentColor"/>
          <path d="M11 5.5c1 .8 1 4.2 0 5M13 4c1.5 1.4 1.5 6.6 0 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}
```

---

## F. `PermissionSheet.tsx`

Replace the body of the dialog `<div>` with the new design (the outer scrim + role="dialog" stays unchanged):

```tsx
<div
  role="dialog"
  aria-labelledby="permission-sheet-title"
  aria-describedby="permission-sheet-desc"
  className="w-full max-w-md mx-4 p-5 pb-[max(20px,env(safe-area-inset-bottom))] rounded-2xl border border-(--m8-rule) bg-(--m8-bg-elev)"
  style={{
    boxShadow: '0 -8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
    animation: 'm8-rise 280ms cubic-bezier(.22, 1, .36, 1)',
  }}
  onClick={(e) => e.stopPropagation()}
>
  <div className="w-9 h-1 rounded-full bg-(--m8-rule-hi) mx-auto mb-4" aria-hidden />
  <h2
    id="permission-sheet-title"
    className="m-0 mb-2 font-(--m8-font-answer) text-(--m8-stripe) uppercase"
    style={{ fontWeight: 600, fontSize: 22, letterSpacing: '0.04em' }}
  >
    enable shake
  </h2>
  <p id="permission-sheet-desc" className="m-0 mb-4 text-sm leading-relaxed text-(--m8-chrome-dim)">
    Magik 8 uses motion to feel your shake.<br/>
    Tap to allow — we never store sensor data.
  </p>
  <div className="flex flex-col gap-2 items-stretch">
    {/* Primary CTA — reuse ShakeCTA-style styling. Inline here, or extract a <PrimaryButton/>. */}
    <button type="button" onClick={onEnable} className="/* same classes as ShakeCTA */">
      allow motion
    </button>
    <button
      type="button"
      onClick={onDismiss}
      className="appearance-none bg-transparent border-0 text-(--m8-chrome-dim) hover:text-(--m8-chrome) py-3 underline decoration-(--m8-rule) underline-offset-[3px]"
    >
      not now
    </button>
  </div>
</div>
```

Add the `@keyframes m8-rise` and the scrim styles to `src/index.css`:

```css
@keyframes m8-rise {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes m8-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

Update the scrim div to use `bg-black/60 backdrop-blur-sm` and `animation: m8-fade-in 200ms ease-out`.

---

## G. `ShareSheet.tsx`

Replace the button:

```tsx
<button
  type="button"
  onClick={handleShare}
  disabled={busy}
  className="inline-flex items-center gap-2 min-h-10 px-6 py-2.5 rounded-sm
    font-(--m8-font-ui) text-[13px] font-bold lowercase tracking-[0.02em]
    text-(--m8-stripe) border border-(--m8-fluid-hi)
    hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--m8-fluid-hi)
    disabled:opacity-60 disabled:cursor-wait transition"
  style={{
    background: 'linear-gradient(180deg, var(--m8-fluid-mid) 0%, var(--m8-fluid-deep) 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)',
  }}
  aria-busy={busy}
>
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M8 2v8M5 5l3-3 3 3M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
  {busy ? 'preparing…' : 'share answer'}
</button>
```

Update the status text spans to use `font-(--m8-font-hud) text-[11px] tracking-[0.06em] text-(--m8-chrome-dim)` and `text-(--m8-danger)` for error.

---

## H. `App.tsx` — header + HUD + grain

Wrap the existing `<main>` with grain/vignette classes and add the header:

```tsx
import { useEffect, useState } from 'react';
import { MagikBall } from './components/MagikBall';
import { MuteToggle } from './components/MuteToggle';
import { Wordmark } from './components/Wordmark';
import { HUDStrip } from './components/HUDStrip';
// ...existing imports unchanged

function OracleScreen() {
  const { phase, shakeOrTap } = useOracle();
  const { motionDenied } = useShakeSensorStatus();

  // ── HUD session counter ──
  const [shakeCount, setShakeCount] = useState(() => {
    return parseInt(localStorage.getItem('m8_sesh') || '0', 10) || 0;
  });
  useEffect(() => {
    if (phase === 'shaking') {
      setShakeCount((c) => {
        const next = c + 1;
        localStorage.setItem('m8_sesh', String(next));
        return next;
      });
    }
  }, [phase]);

  // ... existing keyDown effect unchanged

  const instruction =
    phase === 'idle'
      ? motionDenied
        ? 'hold your question · then tap'
        : 'hold your question · shake or tap'
      : phase === 'answered'
        ? 'ask again when ready'
        : null;

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-4 bg-(--m8-bg) px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] font-(--m8-font-ui) text-(--m8-chrome) overflow-hidden m8-grain m8-vignette isolate">
      <header className="relative w-full flex items-center justify-between gap-2 z-10">
        <Wordmark size={22} />
        <MuteToggle />
      </header>

      <HUDStrip shakeCount={shakeCount} />

      <section className="flex w-full flex-1 flex-col items-center justify-center z-[1]" aria-labelledby="oracle-instruction">
        <MagikBall />
      </section>

      {instruction && (
        <p
          id="oracle-instruction"
          className="m-0 text-(--m8-chrome-dim) text-center z-[2]"
          style={{ fontSize: 13, letterSpacing: '0.02em' }}
        >
          {instruction}
        </p>
      )}

      <ThemeChips />
      <ShakeCTA />
      <ShareSheet />
    </main>
  );
}
```

The `m8-grain` and `m8-vignette` classes were added in step 01.

## Verification

```bash
npm run dev
```

You should see (compared with `exports/10-prototype-states.png`):

- Header: tiny wordmark on the left (the amber "8" glows softly), 36×36 mute toggle on the right.
- HUD strip directly under the header — VT323 monospace, `sesh 000 / classic   [READY]`.
- Ball dominates the middle.
- Below the ball: instruction line (Tahoma 13px muted), chips, the CTA with ASCII corner brackets, and (when answered) the cobalt share button.
- Film grain + vignette visible if you stare at flat dark areas — should not be obvious, just adds depth.

## Tests

The existing tests don't probe these visuals; the only thing to confirm is that the `aria-*` attributes match what the e2e test queries. Run:

```bash
npm test
npx playwright test e2e
```
