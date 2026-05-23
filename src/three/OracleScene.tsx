import { AdaptiveDpr, ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace, TextureLoader, Vector3 } from 'three';
import { MagikBall } from '../components/MagikBall';
import { useOracle } from '../context/OracleContext';
import { getAnswerDisplayText } from './answerAtlas';
import { Background } from './Background';
import { Ball } from './Ball';
import { Effects } from './Effects';
import { ENV_MAP_PATH, Lighting } from './Lighting';
import { useWebglCapability } from './useWebglCapability';

useLoader.preload(TextureLoader, ENV_MAP_PATH);

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

type OracleCanvasProps = {
  canvasKey: number;
  onContextLost: () => void;
  onContextRestored: () => void;
};

function SceneControls() {
  const { phase } = useOracle();
  const orbitEnabled = phase === 'idle' || phase === 'answered';

  return (
    <OrbitControls
      enabled={orbitEnabled}
      enableDamping
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI * 0.2}
      maxPolarAngle={Math.PI * 0.55}
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
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.0;
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
      <color attach="background" args={['transparent']} />
      <Background />
      <Lighting />
      <Ball
        phase={phase}
        onAnimationDone={onAnimationDone}
        reducedMotion={prefersReducedMotion}
      />
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.6}
        scale={10}
        blur={2.8}
        far={1.15}
        resolution={256}
        color="#000000"
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

  const handleBallClick = () => {
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
      <OracleAnswerLiveRegion />
      <button
        type="button"
        className="relative block h-full w-full cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-(--m8-fluid-hi)"
        aria-label={
          answered
            ? 'Magik 8 ball — tap to ask again'
            : 'Magik 8 ball — tap or shake to reveal'
        }
        disabled={busy}
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
