import { ContactShadows } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { useOracle } from '../context/OracleContext';
import { AnswerWindow } from './AnswerWindow';
import { Ball } from './Ball';
import { Lighting } from './Lighting';

const BALL_SIZE = 'min(70vh, 360px)';

function OracleCanvas() {
  const { phase } = useOracle();

  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 42 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      style={{ width: '100%', height: '100%', touchAction: 'manipulation' }}
    >
      <color attach="background" args={['transparent']} />
      <Lighting />
      <group>
        <Ball phase={phase} />
        <AnswerWindow phase={phase} />
      </group>
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.6}
        scale={10}
        blur={2.8}
        far={1.15}
        resolution={256}
        color="#000000"
      />
    </Canvas>
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
