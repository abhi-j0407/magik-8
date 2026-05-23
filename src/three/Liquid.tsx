import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, DoubleSide, MeshStandardMaterial, ShaderMaterial } from 'three';
import type { OraclePhase } from '../types/oracle';
import { resolveM8Color } from './tokens';
import liquidFrag from './shaders/liquid.frag?raw';
import liquidVert from './shaders/liquid.vert?raw';

/** Phase targets for slosh energy (0–1). Window hidden on idle/shaking; sim still runs for reveal settle. */
const SLOSH_TARGET: Record<OraclePhase, number> = {
  idle: 0,
  shaking: 1,
  revealing: 0.12,
  answered: 0.03,
};

const BOB_TARGET: Record<OraclePhase, number> = {
  idle: 0,
  shaking: 0.15,
  revealing: 0.25,
  answered: 1,
};

type LiquidProps = {
  phase: OraclePhase;
  radius: number;
  depth: number;
};

export function Liquid({ phase, radius, depth }: LiquidProps) {
  const sloshRef = useRef(0);
  const bobRef = useRef(0);

  const fluidDeep = useMemo(() => new Color(resolveM8Color('fluidDeep')), []);
  const fluidMid = useMemo(() => new Color(resolveM8Color('fluidMid')), []);
  const fluidMeniscus = useMemo(() => new Color(resolveM8Color('fluidMeniscus')), []);

  const halfHeight = depth * 0.5;
  const topRadius = radius * 0.92;
  const bottomRadius = radius * 0.88;

  const liquidMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: liquidVert,
      fragmentShader: liquidFrag,
      uniforms: {
        uTime: { value: 0 },
        uSlosh: { value: 0 },
        uBob: { value: 0 },
        uHalfHeight: { value: halfHeight },
        uTopRadius: { value: topRadius },
        uColorDeep: { value: fluidDeep.clone() },
        uColorMid: { value: fluidMid.clone() },
        uColorMeniscus: { value: fluidMeniscus.clone() },
      },
      transparent: true,
      depthWrite: true,
    });
  }, [fluidDeep, fluidMid, fluidMeniscus, halfHeight, topRadius]);

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

  useFrame((state, delta) => {
    const targetSlosh = SLOSH_TARGET[phase];
    const targetBob = BOB_TARGET[phase];
    const sloshRate = phase === 'shaking' ? 7.5 : phase === 'revealing' ? 4 : 2.5;
    const bobRate = phase === 'answered' ? 2 : 4;

    sloshRef.current += (targetSlosh - sloshRef.current) * Math.min(1, delta * sloshRate);
    bobRef.current += (targetBob - bobRef.current) * Math.min(1, delta * bobRate);

    const t = state.clock.elapsedTime;
    const slosh = sloshRef.current;
    const bob = bobRef.current;

    liquidMaterial.uniforms.uTime.value = t;
    liquidMaterial.uniforms.uSlosh.value = slosh;
    liquidMaterial.uniforms.uBob.value = bob;

    const meniscusPulse =
      0.28 + slosh * 0.45 + bob * 0.12 + Math.sin(t * 1.4) * 0.08 * (0.3 + slosh);
    meniscusMaterial.emissiveIntensity = meniscusPulse;
    meniscusMaterial.opacity = 0.82 + slosh * 0.1;
  });

  return (
    <>
      <mesh
        position={[0, 0, depth * 0.45]}
        rotation={[Math.PI / 2, 0, 0]}
        material={liquidMaterial}
        renderOrder={1}
      >
        <cylinderGeometry args={[topRadius, bottomRadius, depth, 40, 1]} />
      </mesh>
      <mesh position={[0, 0, -depth * 0.08]} material={meniscusMaterial} renderOrder={3}>
        <torusGeometry args={[radius * 0.62, 0.012, 10, 40]} />
      </mesh>
    </>
  );
}
