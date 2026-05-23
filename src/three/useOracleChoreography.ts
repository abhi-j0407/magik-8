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
/** Perceptible translate amplitude (world units); plan §4: ±0.06–0.12. */
export const SHAKE_POS_AMPLITUDE = 0.09;
/** Perceptible tilt (rad); plan §4: ±~0.08–0.15 (~6°). */
export const SHAKE_TILT_RAD = 0.12;
const SHAKE_SETTLE_S = 0.06;
const SHAKE_CYCLE_HALF_S = 0.035;

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

/** Multi-axis translate + tilt on jitterRef; yoyo cycles then ease out to zero within SHAKE_DURATION_MS. */
function runTransformShake(jitterGroup: Group): void {
  resetJitter(jitterGroup);
  const shakeWindowS = SHAKE_DURATION_MS / 1000 - SHAKE_SETTLE_S;
  const repeats = Math.max(
    2,
    Math.floor(shakeWindowS / (SHAKE_CYCLE_HALF_S * 2)) - 1,
  );

  const tl = gsap.timeline({
    onComplete: () => resetJitter(jitterGroup),
  });

  tl.to(
    jitterGroup.position,
    {
      x: SHAKE_POS_AMPLITUDE,
      y: SHAKE_POS_AMPLITUDE * 0.85,
      z: -SHAKE_POS_AMPLITUDE * 0.7,
      duration: SHAKE_CYCLE_HALF_S,
      yoyo: true,
      repeat: repeats,
      ease: 'sine.inOut',
    },
    0,
  );
  tl.to(
    jitterGroup.rotation,
    {
      x: SHAKE_TILT_RAD,
      z: -SHAKE_TILT_RAD * 0.85,
      duration: SHAKE_CYCLE_HALF_S,
      yoyo: true,
      repeat: repeats,
      ease: 'sine.inOut',
    },
    0,
  );
  tl.to(
    jitterGroup.position,
    { x: 0, y: 0, z: 0, duration: SHAKE_SETTLE_S, ease: 'power2.out' },
    '>',
  );
  tl.to(
    jitterGroup.rotation,
    { x: 0, y: 0, z: 0, duration: SHAKE_SETTLE_S, ease: 'power2.out' },
    '<',
  );
}

function prepareRevealInk(result: OracleResult | null | undefined): void {
  const egg = result?.isEasterEgg ?? false;
  answerPanelUniforms.isEasterEgg.value = egg ? 1 : 0;
  if (egg) {
    cssColorToVec3(resolveM8Color('amber'), answerPanelUniforms.inkTextTint.value);
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
      runTransformShake(jitterGroup);
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
