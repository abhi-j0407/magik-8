type PermissionSheetProps = {
  open: boolean;
  onEnable: () => void;
  onDismiss: () => void;
};

export function PermissionSheet({ open, onEnable, onDismiss }: PermissionSheetProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="presentation"
      onClick={onDismiss}
    >
      <div
        role="dialog"
        aria-labelledby="permission-sheet-title"
        aria-describedby="permission-sheet-desc"
        className="w-full max-w-md rounded-2xl border border-(--magik-sphere-highlight) bg-(--magik-sphere) p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="permission-sheet-title"
          className="font-(--font-answer) text-xl tracking-wide uppercase"
        >
          Enable shake
        </h2>
        <p id="permission-sheet-desc" className="mt-3 text-sm leading-relaxed text-(--magik-muted)">
          Magik 8 uses motion to feel your shake. Tap to allow — we never store sensor data.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={onEnable}
            className="min-h-11 rounded-full bg-(--magik-fluid) px-6 py-3 text-sm font-medium text-(--magik-answer-text) transition-colors hover:bg-(--magik-fluid-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--magik-fluid-light)"
          >
            Allow motion
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="min-h-11 rounded-full border border-(--magik-sphere-highlight) px-6 py-3 text-sm text-(--magik-muted) transition-colors hover:border-(--magik-fluid-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--magik-fluid-light)"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
