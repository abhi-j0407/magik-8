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
      className={`m8-cta ${busy ? 'm8-cta-busy' : ''}`}
    >
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
      <span className="m8-cta-label">{label}</span>
    </button>
  );
}
