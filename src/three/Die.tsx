import { useMemo } from 'react';
import { Color, IcosahedronGeometry, MeshStandardMaterial } from 'three';
import type { OraclePhase } from '../types/oracle';
import { resolveM8Color } from './tokens';

/** Matches Ball.tsx — not exported from Ball to avoid G3 edits there. */
const BALL_RADIUS = 1;

/** Answer-window aperture — shared with AnswerWindow recess. */
export const DIE_WINDOW_RADIUS = 0.26;

const DIE_RADIUS = 0.14;
/** One icosahedron face normal toward +Z (glass / camera). */
const DIE_ORIENTATION: [number, number, number] = [
  Math.atan(2 / (1 + Math.sqrt(5))),
  Math.PI / 5,
  0,
];

type DieProps = {
  phase: OraclePhase;
};

function isWindowSettled(phase: OraclePhase): boolean {
  return phase === 'revealing' || phase === 'answered';
}

export function Die({ phase }: DieProps) {
  const settled = isWindowSettled(phase);

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

  // Sunk below liquid when idle/shaking; pressed to inner glass when revealing/answered.
  const z = settled ? 0.012 : -0.24 - BALL_RADIUS * 0.02;

  return (
    <group position={[0, 0, z]} rotation={DIE_ORIENTATION}>
      <mesh geometry={geometry} material={bodyMaterial} />
      {/* Placeholder triangular answer facet — G6 adds Text on this face */}
      <mesh position={[0, 0, DIE_RADIUS * 0.92]} material={faceMaterial}>
        <circleGeometry args={[DIE_WINDOW_RADIUS * 0.72, 3]} />
      </mesh>
    </group>
  );
}
