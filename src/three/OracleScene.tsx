import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { Color } from 'three';
import { useOracle } from '../context/OracleContext';
import type { OraclePhase } from '../types/oracle';
import { resolveM8Color } from './tokens';

const BALL_SIZE = 'min(70vh, 360px)';

function PlaceholderSphere({ phase }: { phase: OraclePhase }) {
  const meshRef = useRef<Mesh>(null);
  const ballColor = useMemo(() => new Color(resolveM8Color('sphereCore')), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (phase === 'shaking') {
      mesh.rotation.x += delta * 9;
      mesh.rotation.y += delta * 7;
      mesh.rotation.z += delta * 5;
      return;
    }

    if (phase === 'revealing' || phase === 'answered') {
      mesh.rotation.x *= 0.88;
      mesh.rotation.y *= 0.88;
      mesh.rotation.z *= 0.88;
      return;
    }

    mesh.rotation.y += delta * 0.35;
    mesh.position.y = Math.sin(performance.now() * 0.0015) * 0.06;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial color={ballColor} roughness={0.35} metalness={0.05} />
    </mesh>
  );
}

function OracleCanvas() {
  const { phase } = useOracle();

  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', touchAction: 'manipulation' }}
    >
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} />
      <PlaceholderSphere phase={phase} />
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
        style={{
          filter:
            'drop-shadow(0 18px 28px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        }}
      >
        <OracleCanvas />
      </button>
    </div>
  );
}

export default OracleScene;
