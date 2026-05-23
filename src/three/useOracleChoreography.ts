import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Color, Vector3, type Group } from 'three';
import type { OraclePhase, OracleResult } from '../types/oracle';
import { answerPanelUniforms } from './AnswerPanel';
import { getAnswerDisplayText, getAnswerTexture } from './answerAtlas';
import { oracleSceneTimeScale } from './oracleSceneClock';
import { resolveM8Color } from './tokens';

/** Matches AnswerTriangle REVEAL_MS and CSS reveal contract. */
export const REVEAL_MS = 600;

/** Matches useOracleMachine SHAKE_DURATION_MS. */
export const SHAKE_DURATION_MS = 400;

const REVEAL_HALF_S = REVEAL_MS / 2000;
const REVEAL_EASE = 'cubic-bezier(0.16, 0.8, 0.3, 1)';
const IDLE_EASE = 'power2.out';
const IDLE_MS = 0.2;
const SHAKE_RAMP_S = 0.2;
const JITTER_Y = 0.01;
const JITTER_Z_RAD = Math.PI / 180;

function cssColorToVec3(css: string, target: Vector3): Vector3 {
  const c = new Color(css);
  return target.set(c.r, c.g, c.b);
}

function killChoreographyTweens(jitterGroup: Group | null | undefined): void {
  const targets: object[] = [
    answerPanelUniforms.baseVisibility,
    answerPanelUniforms.textVisibility,
    oracleSceneTimeScale,
  ];
  if (jitterGroup) {
    targets.push(jitterGroup.position, jitterGroup.rotation);
  }
  gsap.killTweensOf(targets);
}

function resetJitter(jitterGroup: Group | null | undefined): void {
  if (!jitterGroup) return;
  gsap.set(jitterGroup.position, { x: 0, y: 0, z: 0 });
  gsap.set(jitterGroup.rotation, { x: 0, y: 0, z: 0 });
}

function prepareRevealInk(result: OracleResult | null | undefined): void {
  const egg = result?.isEasterEgg ?? false;
  answerPanelUniforms.isEasterEgg.value = egg ? 1 : 0;
  if (egg) {
    cssColorToVec3(resolveM8Color('amber'), answerPanelUniforms.inkTextTint.value);
  } else {
    cssColorToVec3(resolveM8Color('answerInk'), answerPanelUniforms.inkTextTint.value);
  }
  const displayKey = getAnswerDisplayText(result ?? null);
  if (displayKey) {
    answerPanelUniforms.setText(getAnswerTexture(displayKey, egg));
  }
}

export type OracleChoreographyOptions = {
  phase: OraclePhase;
  result?: OracleResult | null;
  onAnimationDone: () => void;
  reducedMotion?: boolean;
};

/** Pure phase step — exported for unit tests (real GSAP + fake timers). */
export function applyOracleChoreographyPhase(
  phase: OraclePhase,
  prevPhase: OraclePhase,
  {
    reducedMotion = false,
    onAnimationDone,
    jitterGroup,
    result,
  }: {
    reducedMotion?: boolean;
    onAnimationDone?: () => void;
    jitterGroup?: Group | null;
    result?: OracleResult | null;
  },
): void {
  killChoreographyTweens(jitterGroup);

  if (phase === 'idle') {
    resetJitter(jitterGroup);
    if (prevPhase === 'answered') {
      if (reducedMotion) {
        answerPanelUniforms.textVisibility.value = 0;
        answerPanelUniforms.baseVisibility.value = 1;
        oracleSceneTimeScale.value = 1;
        return;
      }
      const resetTl = gsap.timeline();
      resetTl.to(answerPanelUniforms.textVisibility, {
        value: 0,
        duration: IDLE_MS,
        ease: IDLE_EASE,
      });
      resetTl.to(
        answerPanelUniforms.baseVisibility,
        {
          value: 1,
          duration: IDLE_MS,
          ease: IDLE_EASE,
        },
        '>',
      );
      resetTl.to(
        oracleSceneTimeScale,
        { value: 1, duration: IDLE_MS, ease: IDLE_EASE },
        0,
      );
      return;
    }

    if (reducedMotion) {
      answerPanelUniforms.baseVisibility.value = 1;
      answerPanelUniforms.textVisibility.value = 0;
      oracleSceneTimeScale.value = 1;
      return;
    }
    gsap.to(answerPanelUniforms.baseVisibility, {
      value: 1,
      duration: IDLE_MS,
      ease: IDLE_EASE,
    });
    gsap.to(answerPanelUniforms.textVisibility, {
      value: 0,
      duration: IDLE_MS,
      ease: IDLE_EASE,
    });
    gsap.to(oracleSceneTimeScale, { value: 1, duration: IDLE_MS, ease: IDLE_EASE });
    return;
  }

  if (phase === 'shaking') {
    if (reducedMotion) {
      oracleSceneTimeScale.value = 3;
      return;
    }
    gsap.to(oracleSceneTimeScale, {
      value: 3,
      duration: SHAKE_RAMP_S,
      ease: 'power2.out',
    });
    if (jitterGroup) {
      const jitterRepeats = Math.max(0, Math.floor(SHAKE_DURATION_MS / 80) - 1);
      gsap.to(jitterGroup.position, {
        y: JITTER_Y,
        duration: 0.08,
        yoyo: true,
        repeat: jitterRepeats,
        ease: 'sine.inOut',
      });
      gsap.to(jitterGroup.rotation, {
        z: JITTER_Z_RAD,
        duration: 0.1,
        yoyo: true,
        repeat: jitterRepeats,
        ease: 'sine.inOut',
      });
    }
    return;
  }

  if (phase === 'revealing') {
    resetJitter(jitterGroup);
    prepareRevealInk(result);
    oracleSceneTimeScale.value = 1;

    if (reducedMotion) {
      answerPanelUniforms.baseVisibility.value = 0.375;
      answerPanelUniforms.textVisibility.value = 1;
      onAnimationDone?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onAnimationDone?.();
      },
    });
    tl.to(answerPanelUniforms.baseVisibility, {
      value: 0.375,
      duration: REVEAL_HALF_S,
      ease: REVEAL_EASE,
    });
    tl.to(
      answerPanelUniforms.textVisibility,
      {
        value: 1,
        duration: REVEAL_HALF_S,
        ease: REVEAL_EASE,
      },
      '>',
    );
    return;
  }

  if (phase === 'answered') {
    resetJitter(jitterGroup);
    answerPanelUniforms.baseVisibility.value = 0.375;
    answerPanelUniforms.textVisibility.value = 1;
    oracleSceneTimeScale.value = 1;
  }
}

export function useOracleChoreography(
  jitterGroupRef: React.RefObject<Group | null>,
  { phase, result, onAnimationDone, reducedMotion = false }: OracleChoreographyOptions,
) {
  const prevPhaseRef = useRef<OraclePhase>(phase);
  const onAnimationDoneRef = useRef(onAnimationDone);
  onAnimationDoneRef.current = onAnimationDone;

  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;

    applyOracleChoreographyPhase(phase, prev, {
      reducedMotion,
      result,
      jitterGroup: jitterGroupRef.current,
      onAnimationDone: () => onAnimationDoneRef.current(),
    });
  }, [phase, reducedMotion, result, jitterGroupRef]);
}
