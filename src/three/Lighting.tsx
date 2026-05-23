import { Environment } from '@react-three/drei';
import { useMemo } from 'react';
import { useOracle } from '../context/OracleContext';
import { PACK_FLUID_ACCENTS } from './tokens';

const HDRI_PATH = '/hdri/studio_small_08_1k.hdr';

/**
 * Key + rim + HDRI environment (plan §5.4).
 * Key upper-left matches CSS specular hot-spot (~30% 30% from top-left).
 */
export function Lighting() {
  const { packId } = useOracle();
  const rimColor = useMemo(() => PACK_FLUID_ACCENTS[packId].rimLight, [packId]);

  return (
    <>
      <Environment files={HDRI_PATH} background={false} />
      <directionalLight position={[-3.5, 5.5, 4]} intensity={1.15} />
      <directionalLight position={[0.5, 1.5, -5]} intensity={0.55} color={rimColor} />
      <ambientLight intensity={0.12} />
    </>
  );
}

export { HDRI_PATH };
