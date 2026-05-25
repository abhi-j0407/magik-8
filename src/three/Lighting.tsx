import { Environment, Lightformer } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, type AmbientLight, type Mesh, type MeshBasicMaterial } from 'three';
import { useOracle } from '../context/OracleContext';
import {
  ballThemeLightColors,
  getEnvBakeKey,
  useBallThemePalette,
} from './useBallThemeSpring';

const lightProbe = new Color();

/**
 * Coherent studio env (sets scene.environment via drei). The chrome shell is a
 * mirror at metalness 1, so its look is entirely this rig's reflection: neutral sky
 * + themed key (upper-left) and fill (rear) softboxes tint the shell.
 */
export function Lighting() {
  const { packId } = useOracle();
  const palette = useBallThemePalette();
  const envBakeKey = getEnvBakeKey(packId, palette);
  const ambientRef = useRef<AmbientLight>(null);
  const fillRef = useRef<Mesh>(null);
  const keyRef = useRef<Mesh>(null);

  useFrame(() => {
    const ambient = ambientRef.current;
    if (ambient) {
      lightProbe.set(ballThemeLightColors.envAmbient);
      ambient.color.copy(lightProbe);
    }

    const fill = fillRef.current;
    const fillMat = fill?.material as MeshBasicMaterial | undefined;
    if (fillMat) {
      lightProbe.set(ballThemeLightColors.envFill);
      fillMat.color.copy(lightProbe);
      fillMat.color.multiplyScalar(1);
    }

    const key = keyRef.current;
    const keyMat = key?.material as MeshBasicMaterial | undefined;
    if (keyMat) {
      lightProbe.set(ballThemeLightColors.envKey);
      keyMat.color.copy(lightProbe);
      keyMat.color.multiplyScalar(2.2);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.85} color={palette.envAmbient} />
      <Environment
        key={envBakeKey}
        frames={1}
        resolution={256}
        background={false}
        environmentIntensity={1}
      >
        <Lightformer
          form="rect"
          color="#e6e8ff"
          intensity={1.8}
          scale={[10, 10, 1]}
          position={[0, 5, 2]}
          target={[0, 0, 0]}
        />
        <Lightformer
          ref={keyRef}
          form="rect"
          color={palette.envKey}
          intensity={2.2}
          scale={[5, 8, 1]}
          position={[-3, 2, 4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={1.4}
          scale={[4, 6, 1]}
          position={[3.5, 0.5, 2.5]}
          target={[0, 0, 0]}
        />
        <Lightformer
          ref={fillRef}
          form="rect"
          color={palette.envFill}
          intensity={1.0}
          scale={[12, 12, 1]}
          position={[0, -1, -5]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          color="#ffffff"
          intensity={4.0}
          scale={[1.2, 1.2, 1]}
          position={[-1.2, 2.6, 1.6]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}
