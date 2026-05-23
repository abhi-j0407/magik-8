import { useLoader, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import {
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { useOracle } from '../context/OracleContext';
import { PACK_FLUID_ACCENTS } from './tokens';

export const ENV_MAP_PATH = '/env/studio.jpg';

/**
 * Key + rim lights + bundled equirect JPG (non-suspending; preloaded in OracleScene).
 */
export function Lighting() {
  const { packId } = useOracle();
  const scene = useThree((s) => s.scene);
  const tex = useLoader(TextureLoader, ENV_MAP_PATH);
  const rimColor = useMemo(() => PACK_FLUID_ACCENTS[packId].rimLight, [packId]);

  useEffect(() => {
    tex.colorSpace = SRGBColorSpace;
    tex.mapping = EquirectangularReflectionMapping;
    scene.environment = tex;
    return () => {
      if (scene.environment === tex) scene.environment = null;
    };
  }, [scene, tex]);

  return (
    <>
      <directionalLight position={[-3.5, 5.5, 4]} intensity={1.15} />
      <directionalLight position={[0.5, 1.5, -5]} intensity={0.55} color={rimColor} />
      <ambientLight intensity={0.12} />
    </>
  );
}
