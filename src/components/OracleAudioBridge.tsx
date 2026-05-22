import { useEffect, useRef } from 'react';
import { useAppAudio } from '../context/AudioContext';
import { useOracle } from '../context/OracleContext';

/**
 * Plays SFX on oracle phase transitions (REQ-040).
 * Does not edit MagikBall animation timings.
 */
export function OracleAudioBridge() {
  const { phase, result } = useOracle();
  const { playShakeStart, playReveal, playEasterEgg } = useAppAudio();
  const prevPhase = useRef(phase);

  useEffect(() => {
    const prev = prevPhase.current;
    if (prev !== 'shaking' && phase === 'shaking') {
      void playShakeStart();
    }
    if (prev !== 'revealing' && phase === 'revealing') {
      if (result?.isEasterEgg) {
        void playEasterEgg();
      } else {
        void playReveal();
      }
    }
    prevPhase.current = phase;
  }, [phase, result, playShakeStart, playReveal, playEasterEgg]);

  return null;
}
