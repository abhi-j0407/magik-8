import { lazy, Suspense } from 'react';
import { MagikBall } from './MagikBall';
import { OracleErrorBoundary } from './OracleErrorBoundary';
import { useWebglCapability } from '../three/useWebglCapability';

const OracleScene = lazy(() => import('../three/OracleScene'));

/** G9 flips default; until then WebGL stays off in production. */
const webglEnabled = import.meta.env.VITE_WEBGL === 'true';
/** Playwright Path B only — bypass strict GPU probe; never set in prod deploy. */
const webglE2E = import.meta.env.VITE_WEBGL_E2E === 'true';

export function OracleStage() {
  const { capable, prefersReducedMotion, isLowPower } = useWebglCapability();
  const useWebGL =
    webglEnabled &&
    (webglE2E || (capable && !prefersReducedMotion && !isLowPower));

  if (!useWebGL) {
    return <MagikBall />;
  }

  return (
    <Suspense fallback={<MagikBall renderingLocked />}>
      <OracleErrorBoundary>
        <OracleScene />
      </OracleErrorBoundary>
    </Suspense>
  );
}
