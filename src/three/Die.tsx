import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import type { Group } from 'three';
import { Color, IcosahedronGeometry, MeshStandardMaterial } from 'three';
import { useOracle } from '../context/OracleContext';
import type { OraclePhase } from '../types/oracle';
import { AnswerText, DIE_WINDOW_RADIUS, getAnswerDisplayText } from './AnswerText';
import { REVEAL_MS } from './useOracleChoreography';
import { resolveM8Color } from './tokens';

/** Matches Ball.tsx BALL_RADIUS — local to avoid Ball↔Die import cycle. */
const BALL_RADIUS = 1;

export { DIE_WINDOW_RADIUS };

const DIE_RADIUS = 0.14;
/** One icosahedron face normal toward +Z (glass / camera). */
const DIE_ORIENTATION: [number, number, number] = [
  Math.atan(2 / (1 + Math.sqrt(5))),
  Math.PI / 5,
  0,
];

const DIE_Z_SUNK = -0.24 - BALL_RADIUS * 0.02;
const DIE_Z_SURFACED = 0.012;

type DieProps = {
  phase: OraclePhase;
  reducedMotion?: boolean;
};

function isWindowSettled(phase: OraclePhase): boolean {
  return phase === 'revealing' || phase === 'answered';
}

export function Die({ phase, reducedMotion = false }: DieProps) {
  const { result } = useOracle();
  const groupRef = useRef<Group>(null);
  const settled = isWindowSettled(phase);
  const answerText = getAnswerDisplayText(result ?? null);
  const isEasterEgg = result?.isEasterEgg ?? false;

  const faceMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(resolveM8Color('answerInk')),
        roughness: 0.35,
        metalness: 0.05,
        emissive: new Color(resolveM8Color('answerGlow')),
        emissiveIntensity: settled ? 0.12 : 0,
      }),
    [settled],
  );

  const bodyMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(resolveM8Color('sphereMid')),
        roughness: 0.55,
        metalness: 0.08,
      }),
    [],
  );

  const geometry = useMemo(() => new IcosahedronGeometry(DIE_RADIUS, 0), []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const targetZ = settled ? DIE_Z_SURFACED : DIE_Z_SUNK;
    const duration = reducedMotion ? 0 : REVEAL_MS / 1000;

    const tween = gsap.to(group.position, {
      z: targetZ,
      duration,
      ease: 'cubic-bezier(0.16, 0.8, 0.3, 1)',
      overwrite: true,
    });

    return () => {
      tween.kill();
    };
  }, [settled, reducedMotion]);

  return (
    <group ref={groupRef} position={[0, 0, settled ? DIE_Z_SURFACED : DIE_Z_SUNK]} rotation={DIE_ORIENTATION}>
      <mesh geometry={geometry} material={bodyMaterial} />
      <mesh position={[0, 0, DIE_RADIUS * 0.92]} material={faceMaterial} renderOrder={4}>
        <circleGeometry args={[DIE_WINDOW_RADIUS * 0.72, 3]} />
      </mesh>
      {answerText && (
        <AnswerText
          text={answerText}
          isEasterEgg={isEasterEgg}
          phase={phase}
          z={DIE_RADIUS * 0.94}
        />
      )}
    </group>
  );
}
