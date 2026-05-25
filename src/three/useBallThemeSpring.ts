import gsap from 'gsap';
import { createContext, createElement, useContext, useEffect, useMemo, useRef } from 'react';
import { Color, type Vector3 } from 'three';
import type { ThemePack } from '../types/oracle';
import { useOracle } from '../context/OracleContext';
import { answerPanelUniforms } from './AnswerPanel';
import { ballCavityUniforms, ballSidesUniforms } from './ballFluidUniforms';
import type { MeshBasicMaterial, MeshLambertMaterial } from 'three';
import { resolvePackHex } from './tokens';

const THEME_MS = 420;
const THEME_EASE = 'power2.inOut';

export type BallThemePalette = {
  cavity: string;
  sides: string;
  inkBase: string;
  inkPhrase: string;
  envAmbient: string;
  envFill: string;
  /** Key softbox (upper-left) — tints chrome highlight on the shell. */
  envKey: string;
};

const probe = new Color();
const workColor = new Color();

/** Resolve themed ball colors for a pack (does not depend on CSS `data-pack` timing). */
export function resolveBallThemePalette(packId: ThemePack['id']): BallThemePalette {
  const fluidDeep = resolvePackHex(packId, 'fluidDeep');
  const fluidMid = resolvePackHex(packId, 'fluidMid');
  const fluidHi = resolvePackHex(packId, 'fluidHi');

  const envAmbient = new Color(fluidMid);
  envAmbient.lerp(new Color('#c8ccd8'), 0.42);

  return {
    cavity: fluidDeep,
    sides: fluidHi,
    inkBase: fluidHi,
    inkPhrase: resolvePackHex(packId, 'answerGlow'),
    envAmbient: `#${envAmbient.getHexString()}`,
    envFill: fluidDeep,
    envKey: fluidHi,
  };
}

type CavityMaterial = MeshLambertMaterial;
type SidesMaterial = MeshBasicMaterial;

export const ballThemeMaterialSlots: {
  cavity: CavityMaterial | null;
  sides: SidesMaterial | null;
  ink: MeshBasicMaterial | null;
} = {
  cavity: null,
  sides: null,
  ink: null,
};

const bootPalette = resolveBallThemePalette('classic');

/** Updated during theme tweens; Lighting reads these each frame. */
export const ballThemeLightColors = {
  envAmbient: bootPalette.envAmbient,
  envFill: bootPalette.envFill,
  envKey: bootPalette.envKey,
};

function applyHexToMaterial(mat: CavityMaterial | SidesMaterial | null, hex: string): void {
  if (!mat || !hex) return;
  mat.color.set(hex);
}

function applyFluidUniform(uniform: { value: Color }, hex: string): void {
  if (!hex) return;
  uniform.value.set(hex);
}

function applyInkMaterialColor(hex: string): void {
  if (!ballThemeMaterialSlots.ink || !hex) return;
  probe.set(hex);
  ballThemeMaterialSlots.ink.color.copy(probe);
}

function applyVec3FromHex(vec: Vector3, hex: string): void {
  probe.set(hex);
  vec.set(probe.r, probe.g, probe.b);
}

export function applyPalette(palette: BallThemePalette): void {
  applyFluidUniform(ballCavityUniforms.fluidColor, palette.cavity);
  applyFluidUniform(ballSidesUniforms.fluidColor, palette.sides);
  applyHexToMaterial(ballThemeMaterialSlots.cavity, palette.cavity);
  applyHexToMaterial(ballThemeMaterialSlots.sides, palette.sides);
  applyInkMaterialColor(palette.inkBase);
  applyVec3FromHex(answerPanelUniforms.inkBaseTint.value, palette.inkBase);
  applyVec3FromHex(answerPanelUniforms.inkPhraseTint.value, palette.inkPhrase);
  ballThemeLightColors.envAmbient = palette.envAmbient;
  ballThemeLightColors.envFill = palette.envFill;
  ballThemeLightColors.envKey = palette.envKey;
}

let activeThemeTween: gsap.core.Timeline | null = null;

function lerpThemedMaterial(
  mat: CavityMaterial | SidesMaterial | null,
  fluidUniform: { value: Color },
  from: Color,
  to: Color,
  t: number,
): void {
  workColor.copy(from).lerp(to, t);
  fluidUniform.value.copy(workColor);
  if (mat) mat.color.copy(workColor);
}

function lerpInkMaterial(
  mat: MeshBasicMaterial | null,
  from: Color,
  to: Color,
  t: number,
): void {
  if (!mat) return;
  workColor.copy(from).lerp(to, t);
  mat.color.copy(workColor);
}

function lerpInkUniforms(inkBase: Color, inkPhrase: Color): void {
  answerPanelUniforms.inkBaseTint.value.set(inkBase.r, inkBase.g, inkBase.b);
  answerPanelUniforms.inkPhraseTint.value.set(inkPhrase.r, inkPhrase.g, inkPhrase.b);
}

export function animateBallTheme(palette: BallThemePalette, reducedMotion: boolean): void {
  activeThemeTween?.kill();
  activeThemeTween = null;

  const { cavity, sides, ink } = ballThemeMaterialSlots;
  if (!cavity && !sides && !ink) return;

  if (reducedMotion) {
    applyPalette(palette);
    return;
  }

  const duration = THEME_MS / 1000;
  const fromCavity = ballCavityUniforms.fluidColor.value.clone();
  const toCavity = new Color(palette.cavity);
  const fromSides = ballSidesUniforms.fluidColor.value.clone();
  const toSides = new Color(palette.sides);
  const fromInk = new Color(ink?.color ?? palette.inkBase);
  const toInk = new Color(palette.inkBase);
  const fromPhrase = new Color(
    answerPanelUniforms.inkPhraseTint.value.x,
    answerPanelUniforms.inkPhraseTint.value.y,
    answerPanelUniforms.inkPhraseTint.value.z,
  );
  const toPhrase = new Color(palette.inkPhrase);

  const progress = { t: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      applyPalette(palette);
      activeThemeTween = null;
    },
  });
  activeThemeTween = tl;

  tl.to(
    progress,
    {
      t: 1,
      duration,
      ease: THEME_EASE,
      onUpdate: () => {
        const t = progress.t;
        lerpThemedMaterial(cavity, ballCavityUniforms.fluidColor, fromCavity, toCavity, t);
        lerpThemedMaterial(sides, ballSidesUniforms.fluidColor, fromSides, toSides, t);
        lerpInkMaterial(ink, fromInk, toInk, t);
        workColor.copy(fromInk).lerp(toInk, t);
        const phrase = fromPhrase.clone().lerp(toPhrase, t);
        lerpInkUniforms(workColor, phrase);
      },
    },
    0,
  );

  tl.to(
    ballThemeLightColors,
    {
      envAmbient: palette.envAmbient,
      envFill: palette.envFill,
      envKey: palette.envKey,
      duration,
      ease: THEME_EASE,
    },
    0,
  );
}

const BallThemePaletteContext = createContext<BallThemePalette>(bootPalette);

export function useBallThemePalette(): BallThemePalette {
  return useContext(BallThemePaletteContext);
}

/** Env key includes light colors so the cubemap bakes after palette is current for this render. */
export function getEnvBakeKey(packId: ThemePack['id'], palette: BallThemePalette): string {
  return `${packId}:${palette.envKey}:${palette.envFill}`;
}

type BallThemeProviderProps = {
  reducedMotion?: boolean;
  children: React.ReactNode;
};

export function BallThemeProvider({ reducedMotion = false, children }: BallThemeProviderProps) {
  const { packId } = useOracle();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const palette = useMemo(() => resolveBallThemePalette(packId), [packId]);

  // Sync light colors during render so Environment's child useLayoutEffect bakes the new pack.
  useMemo(() => {
    ballThemeLightColors.envAmbient = palette.envAmbient;
    ballThemeLightColors.envFill = palette.envFill;
    ballThemeLightColors.envKey = palette.envKey;
    return null;
  }, [palette]);

  useEffect(() => {
    const run = () => animateBallTheme(palette, reducedMotionRef.current);

    if (ballThemeMaterialSlots.cavity || ballThemeMaterialSlots.sides || ballThemeMaterialSlots.ink) {
      run();
      return;
    }

    let attempts = 0;
    const waitForSlots = () => {
      if (
        ballThemeMaterialSlots.cavity ||
        ballThemeMaterialSlots.sides ||
        ballThemeMaterialSlots.ink
      ) {
        animateBallTheme(palette, reducedMotionRef.current);
        return;
      }
      if (attempts++ < 120) requestAnimationFrame(waitForSlots);
    };
    requestAnimationFrame(waitForSlots);
  }, [packId, palette, reducedMotion]);

  return createElement(BallThemePaletteContext.Provider, { value: palette }, children);
}

/** Call after ball materials mount so the first palette apply hits real slots. */
export function syncBallThemeOnMount(
  packId: ThemePack['id'],
  reducedMotion: boolean,
): void {
  animateBallTheme(resolveBallThemePalette(packId), reducedMotion);
}
