import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import type { Group } from 'three';
import type { OraclePhase } from '../types/oracle';

/** Matches AnswerTriangle REVEAL_MS and CSS reveal contract. */
export const REVEAL_MS = 600;

/** Matches useOracleMachine SHAKE_DURATION_MS. */
export const SHAKE_DURATION_MS = 400;

const REVEAL_DURATION_S = REVEAL_MS / 1000;
const REVEAL_EASE = 'cubic-bezier(0.16, 0.8, 0.3, 1)';

/** Idle: white "8" on +Z faces camera. */
const IDLE_ROT = { x: 0, y: 0, z: 0 };

/** Settled reveal: window recess (−Z) rotated to face camera (+Z). */
const SETTLED_ROT = { x: 0, y: Math.PI, z: 0 };

const SHAKE_SPIN = { x: 9, y: 7, z: 5 };
const IDLE_DAMP = 0.88;

export type OracleChoreographyOptions = {
  phase: OraclePhase;
  onAnimationDone: () => void;
  reducedMotion?: boolean;
};

export function useOracleChoreography(
  groupRef: React.RefObject<Group | null>,
  { phase, onAnimationDone, reducedMotion = false }: OracleChoreographyOptions,
) {
  const prevPhaseRef = useRef<OraclePhase>(phase);
  const revealDoneRef = useRef(false);
  const gsapActiveRef = useRef(false);
  const onAnimationDoneRef = useRef(onAnimationDone);
  onAnimationDoneRef.current = onAnimationDone;

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;

    const ctx = gsap.context(() => {
      if (phase === 'revealing') {
        revealDoneRef.current = false;
        if (reducedMotion) {
          group.rotation.set(SETTLED_ROT.x, SETTLED_ROT.y, SETTLED_ROT.z);
          revealDoneRef.current = true;
          onAnimationDoneRef.current();
          return;
        }
        gsapActiveRef.current = true;
        gsap.to(group.rotation, {
          x: SETTLED_ROT.x,
          y: SETTLED_ROT.y,
          z: SETTLED_ROT.z,
          duration: REVEAL_DURATION_S,
          ease: REVEAL_EASE,
          overwrite: true,
          onComplete: () => {
            gsapActiveRef.current = false;
            if (!revealDoneRef.current) {
              revealDoneRef.current = true;
              onAnimationDoneRef.current();
            }
          },
        });
        return;
      }

      if (phase === 'idle' && prev === 'answered') {
        if (reducedMotion) {
          group.rotation.set(IDLE_ROT.x, IDLE_ROT.y, IDLE_ROT.z);
          return;
        }
        gsapActiveRef.current = true;
        gsap.to(group.rotation, {
          x: IDLE_ROT.x,
          y: IDLE_ROT.y,
          z: IDLE_ROT.z,
          duration: REVEAL_DURATION_S,
          ease: REVEAL_EASE,
          overwrite: true,
          onComplete: () => {
            gsapActiveRef.current = false;
          },
        });
        return;
      }

      if (phase === 'idle' && prev !== 'answered') {
        group.rotation.set(IDLE_ROT.x, IDLE_ROT.y, IDLE_ROT.z);
      }
    }, group);

    return () => {
      ctx.revert();
      gsapActiveRef.current = false;
    };
  }, [phase, reducedMotion, groupRef]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || gsapActiveRef.current) return;

    if (phase === 'shaking') {
      if (reducedMotion) return;
      group.rotation.x += delta * SHAKE_SPIN.x;
      group.rotation.y += delta * SHAKE_SPIN.y;
      group.rotation.z += delta * SHAKE_SPIN.z;
      return;
    }

    if (phase === 'answered') {
      group.rotation.set(SETTLED_ROT.x, SETTLED_ROT.y, SETTLED_ROT.z);
      return;
    }

    if (phase === 'revealing') {
      return;
    }

    if (phase === 'idle') {
      group.rotation.x *= IDLE_DAMP;
      group.rotation.y *= IDLE_DAMP;
      group.rotation.z *= IDLE_DAMP;
    }
  });
}

export function isEightDiscVisible(phase: OraclePhase): boolean {
  return phase !== 'revealing' && phase !== 'answered';
}
