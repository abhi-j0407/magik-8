import { Environment, Lightformer } from '@react-three/drei';

/**
 * Coherent studio env (sets scene.environment via drei). The chrome shell is a
 * mirror at metalness 1, so its look is entirely this rig's reflection: a bright
 * neutral upper field + soft white key/rim softboxes give clean highlight streaks
 * that sweep across one unified purple body (the indigo shell tint colours them),
 * and a broad low cobalt fill leans the darker areas toward the cobalt background.
 * Neutral sources only — no competing hues — so there are no separate colour zones.
 */
export function Lighting() {
  return (
    <>
      {/* Brighter, near-neutral ambient lights the Lambert gasket + cavity (metal ignores it). */}
      <ambientLight intensity={0.85} color="#aab0c8" />
      <Environment frames={1} resolution={256} background={false} environmentIntensity={1}>
        {/* Bright neutral "sky" — coherent top-down light field */}
        <Lightformer
          form="rect"
          color="#e6e8ff"
          intensity={1.8}
          scale={[10, 10, 1]}
          position={[0, 5, 2]}
          target={[0, 0, 0]}
        />
        {/* Key softbox — primary highlight streak (neutral white) */}
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={2.2}
          scale={[5, 8, 1]}
          position={[-3, 2, 4]}
          target={[0, 0, 0]}
        />
        {/* Rim softbox — secondary highlight on the opposite side */}
        <Lightformer
          form="rect"
          color="#ffffff"
          intensity={1.4}
          scale={[4, 6, 1]}
          position={[3.5, 0.5, 2.5]}
          target={[0, 0, 0]}
        />
        {/* Broad low cobalt fill — tints the dark hemisphere toward the background hue */}
        <Lightformer
          form="rect"
          color="#3148b0"
          intensity={1.0}
          scale={[12, 12, 1]}
          position={[0, -1, -5]}
          target={[0, 0, 0]}
        />
        {/* Sharp white glint for the top lens spec */}
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
