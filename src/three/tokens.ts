/**
 * JS mirror of palette tokens in src/index.css (plan §5.3).
 * Resolves CSS custom properties to computed sRGB for Three.js materials.
 */

export const M8_CSS_VARS = {
  bg: '--m8-bg',
  sphereRim: '--m8-sphere-rim',
  sphereCore: '--m8-sphere-core',
  sphereMid: '--m8-sphere-mid',
  sphereHi: '--m8-sphere-hi',
  sphereSpec: '--m8-sphere-spec',
  sphereWarm: '--m8-sphere-warm',
  stripe: '--m8-stripe',
  eight: '--m8-eight',
  fluidDeep: '--m8-fluid-deep',
  fluidMid: '--m8-fluid-mid',
  fluidHi: '--m8-fluid-hi',
  fluidMeniscus: '--m8-fluid-meniscus',
  answerInk: '--m8-answer-ink',
  answerGlow: '--m8-answer-glow',
  amber: '--m8-amber',
} as const;

export type M8CssVarKey = keyof typeof M8_CSS_VARS;

/** Fallbacks match index.css defaults (oklch → approximate sRGB). */
const FALLBACK_SRGB: Record<M8CssVarKey, string> = {
  bg: 'rgb(26, 26, 32)',
  sphereRim: 'rgb(8, 8, 8)',
  sphereCore: 'rgb(20, 20, 22)',
  sphereMid: 'rgb(34, 34, 38)',
  sphereHi: 'rgb(78, 78, 82)',
  sphereSpec: 'rgb(245, 245, 240)',
  sphereWarm: 'rgb(52, 48, 44)',
  stripe: 'rgb(245, 245, 238)',
  eight: 'rgb(20, 20, 22)',
  fluidDeep: 'rgb(12, 22, 48)',
  fluidMid: 'rgb(28, 42, 72)',
  fluidHi: 'rgb(48, 68, 98)',
  fluidMeniscus: 'rgb(168, 188, 210)',
  answerInk: 'rgb(245, 245, 238)',
  answerGlow: 'rgb(148, 168, 198)',
  amber: 'rgb(218, 178, 88)',
};

let colorProbe: HTMLSpanElement | null = null;

/** Resolve a theme token to computed `rgb(...)` for WebGL color inputs. */
export function resolveM8Color(key: M8CssVarKey): string {
  if (typeof document === 'undefined') return FALLBACK_SRGB[key];
  colorProbe ??= document.createElement('span');
  colorProbe.style.display = 'none';
  colorProbe.style.color = `var(${M8_CSS_VARS[key]})`;
  if (!colorProbe.isConnected) document.documentElement.appendChild(colorProbe);
  const resolved = getComputedStyle(colorProbe).color;
  return resolved && resolved !== '' ? resolved : FALLBACK_SRGB[key];
}
