import { Environment, Lightformer } from '@react-three/drei';

/** Procedural Lightformer studio + dim cool ambient (sets scene.environment via drei). */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#6a6280" />
      <Environment
        frames={1}
        resolution={256}
        background={false}
        environmentIntensity={1}
      >
        <Lightformer
          form="rect"
          color="#7a4bff"
          intensity={2.2}
          scale={[6, 6, 1]}
          position={[-2, 3, 3]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          color="#ffb24a"
          intensity={3.0}
          scale={[3, 5, 1]}
          position={[3, 1.5, 2]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          color="#ff3ea5"
          intensity={1.3}
          scale={[4, 4, 1]}
          position={[2.5, -1, -3]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          color="#ffffff"
          intensity={4.0}
          scale={[1, 1, 1]}
          position={[-1.5, 2.5, 1.5]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          color="#3a2d6b"
          intensity={0.6}
          scale={[8, 8, 1]}
          position={[0, -4, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Environment>
    </>
  );
}
