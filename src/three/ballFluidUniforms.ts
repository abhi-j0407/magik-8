import { Color } from 'three';
import { resolvePackHex } from './tokens';

/** Shared GPU uniforms — same pattern as answerPanelUniforms (ink). */
export const ballCavityUniforms = {
  fluidColor: { value: new Color(resolvePackHex('classic', 'fluidDeep')) },
};

export const ballSidesUniforms = {
  fluidColor: { value: new Color(resolvePackHex('classic', 'fluidHi')) },
};
