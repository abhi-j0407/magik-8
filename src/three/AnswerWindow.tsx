import { useLoader } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import {
  Color,
  EquirectangularReflectionMapping,
  MeshStandardMaterial,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import type { OraclePhase } from '../types/oracle';
import { Die } from './Die';
import { Liquid } from './Liquid';
import { ENV_MAP_PATH } from './Lighting';
import { resolveM8Color } from './tokens';

/** Matches Ball.tsx BALL_RADIUS — local to avoid Ball↔AnswerWindow import cycle. */
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
  reducedMotion?: boolean;
};

function isWindowVisible(phase: OraclePhase): boolean {
  return phase === 'revealing' || phase === 'answered';
}

export function AnswerWindow({ phase, reducedMotion = false }: AnswerWindowProps) {
  const visible = isWindowVisible(phase);
  const rotation = visible ? ROT_SETTLED : ROT_HIDDEN;
  const envMap = useLoader(TextureLoader, ENV_MAP_PATH);

  useEffect(() => {
    envMap.colorSpace = SRGBColorSpace;
    envMap.mapping = EquirectangularReflectionMapping;
  }, [envMap]);

  const recessMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(resolveM8Color('sphereRim')),
        roughness: 0.95,
        metalness: 0,
      }),
    [],
  );

  const glassMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        envMap,
        envMapIntensity: 10,
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        metalness: 1,
        roughness: 0,
      }),
    [envMap],
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

      <Liquid phase={phase} radius={WINDOW_RADIUS} depth={LIQUID_DEPTH} />

      <Die phase={phase} reducedMotion={reducedMotion} />

      {/* Temporary cywarr-style lens cap until F2/F3 */}
      <mesh position={[0, 0, GLASS_OFFSET]} renderOrder={10} material={glassMaterial}>
        <circleGeometry args={[WINDOW_RADIUS, 64]} />
      </mesh>
    </group>
  );
}
