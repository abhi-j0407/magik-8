import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { Color, ShaderMaterial } from 'three';
import { useOracle } from '../context/OracleContext';
import gradientFrag from './shaders/gradient.frag?raw';
import gradientVert from './shaders/gradient.vert?raw';
import { PACK_FLUID_ACCENTS, resolveM8Color } from './tokens';

/** Full-screen gradient plane behind ball content (plan §5.5 / G7). */
const BG_Z = -6;
const BG_SIZE = 14;

export function Background() {
  const { packId } = useOracle();
  const colorBg = useMemo(() => new Color(resolveM8Color('bg')), []);
  const colorDeep = useMemo(() => new Color(resolveM8Color('fluidDeep')), []);
  const colorMid = useMemo(() => new Color(resolveM8Color('fluidMid')), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: gradientVert,
        fragmentShader: gradientFrag,
        uniforms: {
          uTime: { value: 0 },
          uColorBg: { value: colorBg.clone() },
          uColorDeep: { value: colorDeep.clone() },
          uColorMid: { value: colorMid.clone() },
        },
        depthWrite: true,
        depthTest: true,
      }),
    [colorBg, colorDeep, colorMid],
  );

  useEffect(() => {
    const accent = PACK_FLUID_ACCENTS[packId];
    material.uniforms.uColorDeep.value.set(accent.bgDeep);
    material.uniforms.uColorMid.value.set(accent.bgMid);
  }, [packId, material]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, BG_Z]} renderOrder={-100} frustumCulled={false} material={material}>
      <planeGeometry args={[BG_SIZE, BG_SIZE]} />
    </mesh>
  );
}
