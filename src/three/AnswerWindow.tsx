import { MeshTransmissionMaterial } from '@react-three/drei';
import { useMemo } from 'react';
import { Color, DoubleSide, MeshStandardMaterial } from 'three';
import type { OraclePhase } from '../types/oracle';
import { Die } from './Die';
import { resolveM8Color } from './tokens';

/** Matches Ball.tsx BALL_RADIUS — duplicated to avoid editing Ball in G3. */
const BALL_RADIUS = 1;

/**
 * Recess on the rear hemisphere (−Z), opposite the embossed "8" on +Z.
 * Settled: rotate π about Y so the aperture faces the camera (+Z).
 */
const WINDOW_ANCHOR: [number, number, number] = [0, 0, -BALL_RADIUS * 0.998];
const ROT_HIDDEN: [number, number, number] = [0, 0, 0];
const ROT_SETTLED: [number, number, number] = [0, Math.PI, 0];

/** Circular answer aperture. */
export const WINDOW_RADIUS = 0.3;
const RECESS_DEPTH = 0.06;
const GLASS_OFFSET = 0.02;
const LIQUID_DEPTH = 0.12;

type AnswerWindowProps = {
  phase: OraclePhase;
};

function isWindowVisible(phase: OraclePhase): boolean {
  return phase === 'revealing' || phase === 'answered';
}

export function AnswerWindow({ phase }: AnswerWindowProps) {
  const visible = isWindowVisible(phase);
  const rotation = visible ? ROT_SETTLED : ROT_HIDDEN;

  const fluidDeep = useMemo(() => new Color(resolveM8Color('fluidDeep')), []);
  const fluidMid = useMemo(() => new Color(resolveM8Color('fluidMid')), []);
  const fluidMeniscus = useMemo(() => new Color(resolveM8Color('fluidMeniscus')), []);
  const glassTint = useMemo(() => new Color(resolveM8Color('fluidDeep')), []);

  const recessMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(resolveM8Color('sphereRim')),
        roughness: 0.95,
        metalness: 0,
      }),
    [],
  );

  const liquidBaseMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: fluidDeep,
        roughness: 0.35,
        metalness: 0.05,
        emissive: fluidMid,
        emissiveIntensity: 0.25,
      }),
    [fluidDeep, fluidMid],
  );

  const liquidMidMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: fluidMid,
        roughness: 0.28,
        metalness: 0.08,
        transparent: true,
        opacity: 0.85,
      }),
    [fluidMid],
  );

  const meniscusMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: fluidMeniscus,
        roughness: 0.12,
        metalness: 0.15,
        emissive: fluidMeniscus,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.9,
        side: DoubleSide,
      }),
    [fluidMeniscus],
  );

  return (
    <group position={WINDOW_ANCHOR} rotation={rotation} visible={visible}>
      {/* Recess cavity along local +Z (outward from −Z hemisphere patch) */}
      <mesh
        position={[0, 0, RECESS_DEPTH * 0.5]}
        rotation={[Math.PI / 2, 0, 0]}
        material={recessMaterial}
        renderOrder={0}
      >
        <cylinderGeometry
          args={[WINDOW_RADIUS * 1.02, WINDOW_RADIUS * 1.08, RECESS_DEPTH, 48, 1, true]}
        />
      </mesh>

      {/* Static liquid volume (G4 adds animated shader) */}
      <mesh
        position={[0, 0, LIQUID_DEPTH * 0.45]}
        rotation={[Math.PI / 2, 0, 0]}
        material={liquidBaseMaterial}
        renderOrder={1}
      >
        <cylinderGeometry args={[WINDOW_RADIUS * 0.92, WINDOW_RADIUS * 0.88, LIQUID_DEPTH, 48]} />
      </mesh>
      <mesh
        position={[0, 0, LIQUID_DEPTH * 0.12]}
        rotation={[Math.PI / 2, 0, 0]}
        material={liquidMidMaterial}
        renderOrder={2}
      >
        <cylinderGeometry args={[WINDOW_RADIUS * 0.78, WINDOW_RADIUS * 0.72, LIQUID_DEPTH * 0.55, 48]} />
      </mesh>
      <mesh position={[0, 0, -LIQUID_DEPTH * 0.08]} material={meniscusMaterial} renderOrder={3}>
        <torusGeometry args={[WINDOW_RADIUS * 0.62, 0.012, 12, 48]} />
      </mesh>

      <Die phase={phase} />

      {/* Glass disc — toward camera when settled (+Z local after π Y rotation) */}
      <mesh position={[0, 0, GLASS_OFFSET]} renderOrder={10}>
        <circleGeometry args={[WINDOW_RADIUS, 64]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.06}
          thickness={0.8}
          ior={1.45}
          chromaticAberration={0.03}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          samples={6}
          resolution={512}
          backside
          color={glassTint}
        />
      </mesh>
    </group>
  );
}
