import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useOracle } from '../context/OracleContext';
import { useHaptics } from '../hooks/useHaptics';
import { isMotionSensorEnabled } from '../hooks/useOracleMachine';
import { useShake } from '../hooks/useShake';
import { PermissionSheet } from './PermissionSheet';

type ShakeSensorContextValue = {
  needsPermissionPrompt: boolean;
  motionDenied: boolean;
  requestPermission: () => Promise<void>;
};

const ShakeSensorContext = createContext<ShakeSensorContextValue>({
  needsPermissionPrompt: false,
  motionDenied: false,
  requestPermission: async () => {},
});

export function useShakeSensorStatus(): ShakeSensorContextValue {
  return useContext(ShakeSensorContext);
}

/**
 * Wires device motion to the oracle machine (PHASE-3 integration contract).
 * Does not touch MagikBall animation timings.
 */
export function ShakeSensorsProvider({ children }: { children: ReactNode }) {
  const { phase, onShakeDetected, onThresholdMet } = useOracle();
  const { onShakeDetected: hapticShake, onReveal: hapticReveal } = useHaptics();
  const [sheetDismissed, setSheetDismissed] = useState(false);
  const revealedHapticRef = useRef(false);

  const isShaking = phase === 'shaking';
  const motionEnabled = isMotionSensorEnabled(phase);

  const handleShakeDetected = useCallback(() => {
    hapticShake();
    onShakeDetected();
  }, [hapticShake, onShakeDetected]);

  const handleThresholdMet = useCallback(() => {
    onThresholdMet();
  }, [onThresholdMet]);

  const {
    requestPermission,
    dismissPermissionPrompt,
    needsPermissionPrompt,
    motionDenied,
  } = useShake({
    enabled: motionEnabled,
    isShaking,
    onShakeDetected: handleShakeDetected,
    onThresholdMet: handleThresholdMet,
  });

  const showPermissionSheet =
    needsPermissionPrompt && !sheetDismissed && phase === 'idle';

  const handleEnable = useCallback(async () => {
    await requestPermission();
    setSheetDismissed(true);
  }, [requestPermission]);

  const handleDismiss = useCallback(() => {
    dismissPermissionPrompt();
    setSheetDismissed(true);
  }, [dismissPermissionPrompt]);

  useEffect(() => {
    if (phase === 'revealing' && !revealedHapticRef.current) {
      revealedHapticRef.current = true;
      hapticReveal();
    }
    if (phase === 'idle') {
      revealedHapticRef.current = false;
    }
  }, [phase, hapticReveal]);

  return (
    <ShakeSensorContext.Provider
      value={{ needsPermissionPrompt, motionDenied, requestPermission }}
    >
      {children}
      <PermissionSheet
        open={showPermissionSheet}
        onEnable={handleEnable}
        onDismiss={handleDismiss}
      />
    </ShakeSensorContext.Provider>
  );
}
