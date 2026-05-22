import { useOracle } from '../context/OracleContext';
import { useShakeSensorStatus } from './ShakeSensors';

export function ShakeCTA() {
  const { phase, shakeOrTap, reset } = useOracle();
  const { needsPermissionPrompt, motionDenied, requestPermission } =
    useShakeSensorStatus();
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
    ? 'Consulting the oracle…'
    : answered
      ? 'Ask again'
      : needsPermissionPrompt
        ? 'Enable shake'
        : 'Tap to shake';

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
      className="min-h-11 min-w-[11rem] rounded-full border border-(--magik-sphere-highlight) bg-(--magik-sphere) px-6 py-3 text-sm font-medium text-(--magik-answer-text) transition-colors hover:border-(--magik-fluid-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--magik-fluid-light) disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
