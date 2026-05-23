import { lazy, Suspense } from 'react';
import { MagikBall } from './MagikBall';
import { useWebglCapability } from '../three/useWebglCapability';

const OracleScene = lazy(() => import('../three/OracleScene'));

/** G9 flips default; until then WebGL stays off in production. */
const webglEnabled = import.meta.env.VITE_WEBGL === 'true';

export function OracleStage() {
  const { capable, prefersReducedMotion, isLowPower } = useWebglCapability();
  const useWebGL =
    webglEnabled && capable && !prefersReducedMotion && !isLowPower;

  if (!useWebGL) {
    return <MagikBall />;
  }

  return (
    <Suspense fallback={<MagikBall />}>
      <OracleScene />
    </Suspense>
  );
}
