import { useLoader, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import {
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  TextureLoader,
} from 'three';

export const ENV_MAP_PATH = '/env/cywarr-env.jpg';

/** Ambient-only + bundled equirect env (preloaded in OracleScene). */
export function Lighting() {
  const scene = useThree((s) => s.scene);
  const tex = useLoader(TextureLoader, ENV_MAP_PATH);

  useEffect(() => {
    tex.colorSpace = SRGBColorSpace;
    tex.mapping = EquirectangularReflectionMapping;
    scene.environment = tex;
    return () => {
      if (scene.environment === tex) scene.environment = null;
    };
  }, [scene, tex]);

  return <ambientLight intensity={1.0} />;
}
