import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';
import {
  CanvasTexture,
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  SRGBColorSpace,
} from 'three';
import type { OraclePhase } from '../types/oracle';
import { resolveM8Color } from './tokens';

const BALL_RADIUS = 1;
const SEGMENTS = 64;
/** Front (+Z) disc — matches CSS MagikBall ~18% from top. */
const EIGHT_DISC_Y = 0.36;
const EIGHT_DISC_Z = 0.93;
const EIGHT_DISC_RADIUS = 0.42;
const EIGHT_EMBOSSED_OFFSET = 0.028;

/** Procedural "8" disc texture (regenerate via `node scripts/generate-eight-texture.mjs`). */
export function createEightDiscTexture(): CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');

  const stripe = resolveM8Color('stripe');
  const stripeShadow = resolveM8Color('sphereWarm');
  const digit = resolveM8Color('eight');

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.48;

  const discGrad = ctx.createRadialGradient(cx, cy * 0.88, r * 0.1, cx, cy, r);
  discGrad.addColorStop(0, stripe);
  discGrad.addColorStop(0.72, stripe);
  discGrad.addColorStop(1, stripeShadow);
  ctx.fillStyle = discGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'rgba(255,255,255,0.45)';
  ctx.shadowBlur = size * 0.02;
  ctx.shadowOffsetY = -size * 0.008;
  ctx.fillStyle = digit;
  ctx.font = `900 ${Math.round(size * 0.58)}px "Arial Black", "Helvetica Neue", Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('8', cx, cy * 1.02);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

type BallProps = {
  phase: OraclePhase;
};

export function Ball({ phase }: BallProps) {
  const groupRef = useRef<Group>(null);

  const ballColor = useMemo(() => new Color(resolveM8Color('sphereCore')), []);
  const eightTexture = useMemo(() => createEightDiscTexture(), []);

  const ballMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: ballColor,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMapIntensity: 1.2,
      }),
    [ballColor],
  );

  const discMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        map: eightTexture,
        roughness: 0.22,
        metalness: 0,
        clearcoat: 0.65,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.85,
        transparent: true,
        side: DoubleSide,
      }),
    [eightTexture],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (phase === 'shaking') {
      group.rotation.x += delta * 9;
      group.rotation.y += delta * 7;
      group.rotation.z += delta * 5;
      return;
    }

    if (phase === 'revealing' || phase === 'answered') {
      group.rotation.x *= 0.88;
      group.rotation.y *= 0.88;
      group.rotation.z *= 0.88;
      return;
    }

    group.rotation.y += delta * 0.35;
    group.position.y = Math.sin(performance.now() * 0.0015) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh material={ballMaterial}>
        <sphereGeometry args={[BALL_RADIUS, SEGMENTS, SEGMENTS]} />
      </mesh>
      <mesh
        position={[0, EIGHT_DISC_Y, EIGHT_DISC_Z + EIGHT_EMBOSSED_OFFSET]}
        material={discMaterial}
        renderOrder={2}
      >
        <circleGeometry args={[EIGHT_DISC_RADIUS, 64]} />
      </mesh>
    </group>
  );
}
