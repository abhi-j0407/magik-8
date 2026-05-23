type PermissionSheetProps = {
  open: boolean;
  onEnable: () => void;
  onDismiss: () => void;
};

export function PermissionSheet({ open, onEnable, onDismiss }: PermissionSheetProps) {
  if (!open) return null;

  return (
    <div
      className="m8-sheet-scrim"
      role="presentation"
      onClick={onDismiss}
    >
      <div
        role="dialog"
        aria-labelledby="permission-sheet-title"
        aria-describedby="permission-sheet-desc"
        className="m8-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="m8-sheet-handle" aria-hidden />
        <h2 id="permission-sheet-title" className="m8-sheet-title">
          enable shake
        </h2>
        <p id="permission-sheet-desc" className="m8-sheet-body">
          Magik 8 uses motion to feel your shake.
          <br />
          Tap to allow — we never store sensor data.
        </p>
        <div className="m8-sheet-actions">
          <button type="button" className="m8-cta" onClick={onEnable}>
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
