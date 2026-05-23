import { AdaptiveDpr, ContactShadows } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { useOracle } from '../context/OracleContext';
import { getAnswerDisplayText } from './AnswerText';
import { Background } from './Background';
import { Ball } from './Ball';
import { Effects } from './Effects';
import { Lighting } from './Lighting';
import { useWebglCapability } from './useWebglCapability';

const BALL_SIZE = 'min(70vh, 360px)';

/** Mobile DPR clamp — AdaptiveDpr may lower further under load. */
const DPR_MIN = 1;
const DPR_MAX = 1.5;

function OracleCanvas() {
  const { phase, onAnimationDone } = useOracle();
  const { prefersReducedMotion } = useWebglCapability();
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>('always');

  useEffect(() => {
    const sync = () => setFrameloop(document.hidden ? 'demand' : 'always');
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 42 }}
      dpr={[DPR_MIN, DPR_MAX]}
      frameloop={frameloop}
      gl={{
        antialias: true,
        alpha: true,
        // G8: required for share PNG readback when WebGL is on. No Lighthouse impact while VITE_WEBGL default is false.
        preserveDrawingBuffer: true,
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute('data-m8-oracle-canvas', '');
      }}
      style={{ width: '100%', height: '100%', touchAction: 'manipulation' }}
    >
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
  const answered = phase === 'answered';
  const busy = phase === 'shaking' || phase === 'revealing';

  const handleBallClick = () => {
    if (answered) reset();
    else shakeOrTap();
  };

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
        <OracleCanvas />
      </button>
    </div>
  );
}

export default OracleScene;
