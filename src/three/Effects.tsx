import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';
import { useMemo } from 'react';
import { Vector2 } from 'three';

/**
 * Post stack per plan §5.5 (G7).
 * Grain: CSS `.m8-grain` on `<main>` is canonical — no post Noise (avoids doubling).
 */
export function Effects() {
  const chromaticOffset = useMemo(() => new Vector2(0.0006, 0.0006), []);

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.025}
        intensity={0.28}
        mipmapBlur
        radius={0.55}
      />
      <ChromaticAberration offset={chromaticOffset} radialModulation={false} />
      <Vignette eskil={false} offset={0.42} darkness={0.5} />
    </EffectComposer>
  );
}
