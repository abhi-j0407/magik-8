import { useCallback, useEffect, useReducer, useRef } from 'react';
import { getPackById, loadStoredThemeId, saveThemeId } from '../data/answers';
import { maybeEasterEgg } from '../lib/easterEgg';
import { pickAnswer } from '../lib/pickAnswer';
import type { OraclePhase, OracleResult, ThemePack } from '../types/oracle';

const SHAKE_DURATION_MS = 400;

/** Motion / tap may start a ritual only from idle (FIX-3 ritual lock). */
export function canAcceptShakeStart(phase: OraclePhase): boolean {
  return phase === 'idle';
}

/** devicemotion listener: idle (start) or shaking (complete threshold). */
export function isMotionSensorEnabled(phase: OraclePhase): boolean {
  return phase === 'idle' || phase === 'shaking';
}

export type OracleEvent =
  | { type: 'SHAKE_OR_TAP' }
  | { type: 'THRESHOLD_MET' }
  | { type: 'ANIMATION_DONE' }
  | { type: 'RESET' }
  | { type: 'THEME_CHANGE'; packId: ThemePack['id'] };

export type OracleState = {
  phase: OraclePhase;
  packId: ThemePack['id'];
  result: OracleResult | null;
};

export const initialOracleState = (): OracleState => ({
  phase: 'idle',
  packId: loadStoredThemeId(),
  result: null,
});

export function oracleReducer(state: OracleState, event: OracleEvent): OracleState {
  switch (event.type) {
    case 'SHAKE_OR_TAP':
      if (state.phase === 'idle') {
        return { ...state, phase: 'shaking', result: null };
      }
      return state;

    case 'THRESHOLD_MET':
      if (state.phase === 'shaking') {
        const pack = getPackById(state.packId);
        const answer = pickAnswer(pack);
        const egg = maybeEasterEgg();
        return {
          ...state,
          phase: 'revealing',
          result: egg.triggered
            ? { answer, isEasterEgg: true, easterEggText: egg.text }
            : { answer, isEasterEgg: false },
        };
      }
      return state;

    case 'ANIMATION_DONE':
      if (state.phase === 'revealing') {
        return { ...state, phase: 'answered' };
      }
      return state;

    case 'RESET':
      if (state.phase === 'answered') {
        return { ...state, phase: 'idle', result: null };
      }
      return state;

    case 'THEME_CHANGE':
      if (state.phase === 'idle' || state.phase === 'answered') {
        saveThemeId(event.packId);
        return { ...state, packId: event.packId };
      }
      return state;

    default:
      return state;
  }
}

export function useOracleMachine() {
  const [state, dispatch] = useReducer(oracleReducer, undefined, initialOracleState);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(state.phase);
  phaseRef.current = state.phase;

  const clearShakeTimer = useCallback(() => {
    if (shakeTimerRef.current) {
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = null;
    }
  }, []);

  /** PHASE-3 sensors call this when device shake threshold is met */
  const onShakeDetected = useCallback(() => {
    if (!canAcceptShakeStart(phaseRef.current)) return;
    dispatch({ type: 'SHAKE_OR_TAP' });
  }, []);

  const shakeOrTap = useCallback(() => {
    if (canAcceptShakeStart(state.phase)) {
      dispatch({ type: 'SHAKE_OR_TAP' });
    }
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === 'shaking') {
      clearShakeTimer();
      shakeTimerRef.current = setTimeout(() => {
        dispatch({ type: 'THRESHOLD_MET' });
      }, SHAKE_DURATION_MS);
    } else {
      clearShakeTimer();
    }
    return clearShakeTimer;
  }, [state.phase, clearShakeTimer]);

  /** PHASE-3: call when accelerometer threshold is met (skips tap timer) */
  const onThresholdMet = useCallback(() => {
    clearShakeTimer();
    dispatch({ type: 'THRESHOLD_MET' });
  }, [clearShakeTimer]);

  const onAnimationDone = useCallback(() => {
    dispatch({ type: 'ANIMATION_DONE' });
  }, []);

  const setTheme = useCallback((packId: ThemePack['id']) => {
    dispatch({ type: 'THEME_CHANGE', packId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const selectedPack = getPackById(state.packId);

  return {
    phase: state.phase,
    packId: state.packId,
    result: state.result,
    selectedPack,
    shakeOrTap,
    onShakeDetected,
    onThresholdMet,
    onAnimationDone,
    setTheme,
    reset,
    dispatch,
  };
}

export type OracleMachine = ReturnType<typeof useOracleMachine>;
