// magik8-chrome.jsx — UX-003..007 chrome components
// Wordmark, MuteToggle, ShakeCTA, ThemeChips, PermissionSheet, ShareSheet

// ─────────────────────────────────────────────────────────────────────────
// WORDMARK — "magik 8"
// ─────────────────────────────────────────────────────────────────────────
function Wordmark({ size = 22, withBrackets = false, tagline = false }) {
  return (
    <div className="m8-wordmark-wrap">
      <div className="m8-wordmark" style={{ fontSize: size }}>
        {withBrackets && <span className="m8-wm-bracket">[</span>}
        <span>magik</span>
        <span className="m8-wm-eight">8</span>
        {withBrackets && <span className="m8-wm-bracket">]</span>}
      </div>
      {tagline && (
        <div className="m8-wordmark-tag">ask · shake · know</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MUTE TOGGLE
// ─────────────────────────────────────────────────────────────────────────
function MuteToggle({ muted = false, onToggle }) {
  return (
    <button
      type="button"
      className="m8-icon-btn"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3v-5Z" fill="currentColor"/>
          <path d="M11 6l3 3M14 6l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3v-5Z" fill="currentColor"/>
          <path d="M11 5.5c1 .8 1 4.2 0 5M13 4c1.5 1.4 1.5 6.6 0 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHAKE CTA — primary tap-to-shake button
// ─────────────────────────────────────────────────────────────────────────
function ShakeCTA({ phase = 'idle', needsPermission = false, onTap }) {
  const busy = phase === 'shaking' || phase === 'revealing';
  const answered = phase === 'answered';

  const label = busy
    ? 'consulting…'
    : answered
      ? 'ask again'
      : needsPermission
        ? 'enable shake'
        : 'tap to shake';

  return (
    <button
      type="button"
      className={`m8-cta ${busy ? 'm8-cta-busy' : ''} ${answered ? 'm8-cta-answered' : ''}`}
      onClick={onTap}
      disabled={busy}
    >
      <span className="m8-cta-corner m8-cta-corner-tl">┌</span>
      <span className="m8-cta-corner m8-cta-corner-tr">┐</span>
      <span className="m8-cta-corner m8-cta-corner-bl">└</span>
      <span className="m8-cta-corner m8-cta-corner-br">┘</span>
      <span className="m8-cta-label">{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// THEME CHIPS
// ─────────────────────────────────────────────────────────────────────────
const DEFAULT_PACKS = [
  { id: 'classic', label: 'classic' },
  { id: 'career',  label: 'career' },
  { id: 'party',   label: 'party' },
];

function ThemeChips({ packs = DEFAULT_PACKS, selected = 'classic', disabled = false, onSelect }) {
  return (
    <div className="m8-chips" role="tablist" aria-label="Answer theme">
      {packs.map((p) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={selected === p.id}
          disabled={disabled}
          onClick={() => onSelect?.(p.id)}
          className={`m8-chip ${selected === p.id ? 'm8-chip-on' : ''}`}
        >
          <span className="m8-chip-dot" aria-hidden="true" />
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PERMISSION SHEET
// ─────────────────────────────────────────────────────────────────────────
function PermissionSheet({ open = false, onEnable, onDismiss }) {
  if (!open) return null;
  return (
    <div className="m8-sheet-scrim" role="presentation" onClick={onDismiss}>
      <div
        className="m8-sheet"
        role="dialog"
        aria-labelledby="m8-perm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="m8-sheet-handle" aria-hidden="true" />
        <h2 id="m8-perm-title" className="m8-sheet-title">enable shake</h2>
        <p className="m8-sheet-body">
          Magik 8 uses motion to feel your shake.
          <br />
          Tap to allow — we never store sensor data.
        </p>
        <div className="m8-sheet-actions">
          <button type="button" className="m8-cta" onClick={onEnable}>
            <span className="m8-cta-corner m8-cta-corner-tl">┌</span>
            <span className="m8-cta-corner m8-cta-corner-tr">┐</span>
            <span className="m8-cta-corner m8-cta-corner-bl">└</span>
            <span className="m8-cta-corner m8-cta-corner-br">┘</span>
            <span className="m8-cta-label">allow motion</span>
          </button>
          <button type="button" className="m8-link-btn" onClick={onDismiss}>
            not now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHARE SHEET (button + status)
// ─────────────────────────────────────────────────────────────────────────
function ShareSheet({ visible = false, busy = false, status = 'idle', onShare }) {
  if (!visible) return null;
  return (
    <div className="m8-share-row">
      <button
        type="button"
        className="m8-share-btn"
        disabled={busy}
        onClick={onShare}
        aria-busy={busy}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 2v8M5 5l3-3 3 3M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {busy ? 'preparing…' : 'share answer'}
      </button>
      {status === 'shared' && <p className="m8-share-status">shared — check your share sheet</p>}
      {status === 'downloaded' && <p className="m8-share-status">image saved to downloads</p>}
      {status === 'error' && <p className="m8-share-status m8-share-status-err">export failed — try again</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHARE CARD — 1080×1920 (story format)
// ─────────────────────────────────────────────────────────────────────────
function ShareCard({ answer = '', themeLabel = 'classic', isEasterEgg = false, scale = 1 }) {
  return (
    <div className="m8-share-card-wrap" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <div className="m8-share-card">
        {/* grain layer */}
        <div className="m8-share-card-grain" />
        {/* corner brackets */}
        <span className="m8-sc-corner m8-sc-corner-tl">┌</span>
        <span className="m8-sc-corner m8-sc-corner-tr">┐</span>
        <span className="m8-sc-corner m8-sc-corner-bl">└</span>
        <span className="m8-sc-corner m8-sc-corner-br">┘</span>

        {/* top wordmark */}
        <div className="m8-sc-header">
          <div className="m8-wordmark" style={{ fontSize: 56 }}>
            <span>magik</span>
            <span className="m8-wm-eight">8</span>
          </div>
          <div className="m8-sc-pack">pack · {themeLabel}</div>
        </div>

        {/* ball cropped — bottom half emphasis */}
        <div className="m8-sc-ball-wrap">
          <MagikBall phase="answered" answer={answer} isEasterEgg={isEasterEgg} size={620} />
        </div>

        {/* main answer */}
        <div className="m8-sc-answer" style={{ color: isEasterEgg ? 'var(--m8-amber)' : 'var(--m8-answer-ink)' }}>
          {answer || '—'}
        </div>

        {/* HUD footer */}
        <div className="m8-sc-footer">
          <span>m8://oracle</span>
          <span className="m8-sc-footer-dot">●</span>
          <span>shake.respond.share</span>
        </div>
      </div>
    </div>
  );
}

// Export
Object.assign(window, {
  Wordmark, MuteToggle, ShakeCTA, ThemeChips,
  PermissionSheet, ShareSheet, ShareCard,
});
