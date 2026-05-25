import { AdaptiveDpr, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NeutralToneMapping, SRGBColorSpace, Vector3 } from 'three';
import { MagikBall } from '../components/MagikBall';
import { useOracle } from '../context/OracleContext';
import { getAnswerDisplayText } from './answerAtlas';
import { Ball } from './Ball';
import { Effects } from './Effects';
import { Lighting } from './Lighting';
import { useWebglCapability } from './useWebglCapability';

const BALL_SIZE = 'min(70vh, 360px)';

/** DPR floor — AdaptiveDpr may lower further under load. */
const DPR_MIN = 1;

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return coarse;
}

const CAM_POS = new Vector3(0, 1, 0.375).setLength(3.75);

/** Euclidean px — orbit drag must not fire shake/reset (plan F1). */
const ORBIT_DRAG_THRESHOLD_PX = 8;

type OracleCanvasProps = {
  canvasKey: number;
  onContextLost: () => void;
  onContextRestored: () => void;
};

function SceneControls() {
  return (
    <OrbitControls
      enabled
      enableDamping
      enablePan={false}
      enableZoom={false}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
    />
  );
}

function OracleCanvas({ canvasKey, onContextLost, onContextRestored }: OracleCanvasProps) {
  const { phase, onAnimationDone } = useOracle();
  const { prefersReducedMotion } = useWebglCapability();
  const coarsePointer = useCoarsePointer();
  const dprMax = coarsePointer ? 1.25 : 1.5;
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>('always');
  const camera = useMemo(
    () => ({
      fov: 60,
      near: 0.05,
      far: 50,
      position: CAM_POS.toArray() as [number, number, number],
    }),
    [],
  );

  useEffect(() => {
    const sync = () => setFrameloop(document.hidden ? 'demand' : 'always');
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <Canvas
      key={canvasKey}
      camera={camera}
      dpr={[DPR_MIN, dprMax]}
      frameloop={frameloop}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        toneMapping: NeutralToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.1;
        gl.domElement.setAttribute('data-m8-oracle-canvas', '');

        const onLost = (event: Event) => {
          event.preventDefault();
          onContextLost();
        };
        const onRestored = () => {
          onContextRestored();
        };

        gl.domElement.addEventListener('webglcontextlost', onLost);
        gl.domElement.addEventListener('webglcontextrestored', onRestored);

        return () => {
          gl.domElement.removeEventListener('webglcontextlost', onLost);
          gl.domElement.removeEventListener('webglcontextrestored', onRestored);
        };
      }}
      style={{ width: '100%', height: '100%', touchAction: 'manipulation' }}
    >
      <SceneControls />
      <AdaptiveDpr pixelated />
      <Lighting />
      <Ball
        phase={phase}
        onAnimationDone={onAnimationDone}
        reducedMotion={prefersReducedMotion}
      />
      <Effects />
    </Canvas>
  );
}

function OracleAnswerLiveRegion() {
  const { phase, result } = useOracle();
  const answerText = getAnswerDisplayText(result ?? null);
  if (phase !== 'answered' || !answerText) return null;

  return (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {answerText}
    </span>
  );
}

export function OracleScene() {
  const { phase, shakeOrTap, reset } = useOracle();
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const answered = phase === 'answered';
  const busy = phase === 'shaking' || phase === 'revealing';
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    suppressClickRef.current = false;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStart.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > ORBIT_DRAG_THRESHOLD_PX) {
      suppressClickRef.current = true;
    }
    pointerStart.current = null;
  };

  const handleBallClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (answered) reset();
    else shakeOrTap();
  };

  const handleContextRestored = () => {
    setContextLost(false);
    setCanvasKey((k) => k + 1);
  };

  if (contextLost) {
    return (
      <div className="relative mx-auto" style={{ width: BALL_SIZE, height: BALL_SIZE }}>
        <MagikBall renderingLocked />
      </div>
    );
  }

  return (
    <div className="relative mx-auto" style={{ width: BALL_SIZE, height: BALL_SIZE }}>
      <div className="m8-oracle-glow" aria-hidden="true" />
      <OracleAnswerLiveRegion />
      <button
        type="button"
        className="relative z-1 block h-full w-full cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-(--m8-fluid-hi)"
        aria-label={
          answered
            ? 'Magik 8 ball — tap to ask again'
            : 'Magik 8 ball — tap or shake to reveal'
        }
        disabled={busy}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
        onClick={handleBallClick}
      >
        <OracleCanvas
          canvasKey={canvasKey}
          onContextLost={() => setContextLost(true)}
          onContextRestored={handleContextRestored}
        />
      </button>
    </div>
  );
}

export default OracleScene;
