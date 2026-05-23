import { Environment } from '@react-three/drei';

const HDRI_PATH = '/hdri/studio_small_08_1k.hdr';

/**
 * Key + rim + HDRI environment (plan §5.4).
 * Key upper-left matches CSS specular hot-spot (~30% 30% from top-left).
 */
export function Lighting() {
  return (
    <>
      <Environment files={HDRI_PATH} background={false} />
      <directionalLight position={[-3.5, 5.5, 4]} intensity={1.15} />
      <directionalLight position={[0.5, 1.5, -5]} intensity={0.55} color="#c8d4e8" />
      <ambientLight intensity={0.12} />
    </>
  );
}

export { HDRI_PATH };
