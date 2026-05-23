import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import gsap from 'gsap';
import { Group } from 'three';
import type { OracleResult } from '../types/oracle';
import { answerPanelUniforms } from './AnswerPanel';
import { __buildAnswerAtlasForTests, __resetAnswerAtlasForTests } from './answerAtlas';
import { oracleSceneTimeScale } from './oracleSceneClock';
import {
  SHAKE_POS_AMPLITUDE,
  SHAKE_TILT_RAD,
  applyOracleChoreographyPhase,
} from './useOracleChoreography';

function installCanvasDocument(): void {
  vi.stubGlobal('getComputedStyle', () => ({
    color: 'rgb(245, 245, 238)',
  }));
  vi.stubGlobal('document', {
    documentElement: { appendChild: vi.fn() },
    createElement: (tag: string) => {
      if (tag === 'span') {
        return {
          style: { display: '', color: '' },
          isConnected: false,
        };
      }
      if (tag !== 'canvas') throw new Error(`Unexpected element: ${tag}`);
      let w = 0;
      let h = 0;
      return {
        style: {} as CSSStyleDeclaration,
        get width() {
          return w;
        },
        set width(v: number) {
          w = v;
        },
        get height() {
          return h;
        },
        set height(v: number) {
          h = v;
        },
        getContext: () => ({
          clearRect: vi.fn(),
          fillText: vi.fn(),
          textAlign: 'center',
          textBaseline: 'middle',
          fillStyle: '#fff',
          font: '',
        }),
      };
    },
  });
}

/** Finish in-flight tweens/timelines (avoids cross-test GSAP root pollution). */
function completeActiveGsap(): void {
  const children = gsap.globalTimeline.getChildren(true, true, true);
  for (const child of children) {
    if ('progress' in child && typeof child.progress === 'function') {
      child.progress(1);
    }
  }
}

const sampleResult: OracleResult = {
  answer: {
    id: 'yes',
    text: 'Yes',
    category: 'affirmative',
  },
  isEasterEgg: false,
};

function resetUniforms(): void {
  gsap.globalTimeline.clear(true);
  gsap.killTweensOf([
    answerPanelUniforms.baseVisibility,
    answerPanelUniforms.textVisibility,
    oracleSceneTimeScale,
  ]);
  answerPanelUniforms.baseVisibility.value = 1;
  answerPanelUniforms.textVisibility.value = 0;
  answerPanelUniforms.isEasterEgg.value = 0;
  oracleSceneTimeScale.value = 1;
}

describe('applyOracleChoreographyPhase', () => {
  beforeEach(() => {
    installCanvasDocument();
    __buildAnswerAtlasForTests();
    resetUniforms();
  });

  afterEach(() => {
    resetUniforms();
    __resetAnswerAtlasForTests();
    vi.unstubAllGlobals();
  });

  it('revealing ends at baseVisibility≈0.375, textVisibility≈1, onAnimationDone once', () => {
    const onAnimationDone = vi.fn();
    applyOracleChoreographyPhase('revealing', 'shaking', {
      result: sampleResult,
      onAnimationDone,
    });

    expect(onAnimationDone).not.toHaveBeenCalled();
    completeActiveGsap();
    expect(answerPanelUniforms.baseVisibility.value).toBeCloseTo(0.375, 2);
    expect(answerPanelUniforms.textVisibility.value).toBeCloseTo(1, 2);
    expect(onAnimationDone).toHaveBeenCalledTimes(1);

    applyOracleChoreographyPhase('answered', 'revealing', { result: sampleResult });
    expect(answerPanelUniforms.baseVisibility.value).toBeCloseTo(0.375, 2);
    expect(answerPanelUniforms.textVisibility.value).toBeCloseTo(1, 2);
  });

  it('full cycle idle → shaking → revealing → answered → idle restores idle uniforms', () => {
    const onAnimationDone = vi.fn();
    const opts = { result: sampleResult, onAnimationDone };

    applyOracleChoreographyPhase('idle', 'idle', opts);
    applyOracleChoreographyPhase('shaking', 'idle', opts);
    applyOracleChoreographyPhase('revealing', 'shaking', opts);
    completeActiveGsap();
    expect(onAnimationDone).toHaveBeenCalledTimes(1);

    applyOracleChoreographyPhase('answered', 'revealing', opts);
    applyOracleChoreographyPhase('idle', 'answered', opts);
    completeActiveGsap();
    expect(answerPanelUniforms.baseVisibility.value).toBeCloseTo(1, 2);
    expect(answerPanelUniforms.textVisibility.value).toBeCloseTo(0, 2);
    expect(oracleSceneTimeScale.value).toBeCloseTo(1, 2);
  });

  it('reducedMotion: instant reveal values and onAnimationDone still fires', () => {
    const onAnimationDone = vi.fn();
    applyOracleChoreographyPhase('revealing', 'shaking', {
      reducedMotion: true,
      result: sampleResult,
      onAnimationDone,
    });

    expect(answerPanelUniforms.baseVisibility.value).toBeCloseTo(0.375, 2);
    expect(answerPanelUniforms.textVisibility.value).toBeCloseTo(1, 2);
    expect(onAnimationDone).toHaveBeenCalledTimes(1);
  });

  it('shaking ramps timeScale toward 3', () => {
    applyOracleChoreographyPhase('shaking', 'idle', {});
    completeActiveGsap();
    expect(oracleSceneTimeScale.value).toBeCloseTo(3, 1);
  });

  it('shaking tweens jitter with perceptible multi-axis translate + tilt', () => {
    const jitterGroup = new Group();
    applyOracleChoreographyPhase('shaking', 'idle', { jitterGroup });

    const posTweens = gsap.getTweensOf(jitterGroup.position);
    const rotTweens = gsap.getTweensOf(jitterGroup.rotation);
    expect(posTweens.length).toBeGreaterThan(0);
    expect(rotTweens.length).toBeGreaterThan(0);

    const posTween = posTweens.find((t) => t.vars.yoyo === true) ?? posTweens[0];
    expect(Math.abs(posTween.vars.x as number)).toBeGreaterThanOrEqual(0.06);
    expect(Math.abs(posTween.vars.y as number)).toBeGreaterThanOrEqual(0.06);
    expect(Math.abs(posTween.vars.z as number)).toBeGreaterThanOrEqual(0.06);
    expect(posTween.vars.yoyo).toBe(true);

    const rotTween = rotTweens.find((t) => t.vars.yoyo === true) ?? rotTweens[0];
    expect(Math.abs(rotTween.vars.x as number)).toBeGreaterThanOrEqual(0.08);
    expect(Math.abs(rotTween.vars.z as number)).toBeGreaterThanOrEqual(0.08);
    expect(rotTween.vars.yoyo).toBe(true);

    expect(SHAKE_POS_AMPLITUDE).toBeGreaterThanOrEqual(0.06);
    expect(SHAKE_TILT_RAD).toBeGreaterThanOrEqual(0.08);
  });

  it('shaking settles jitter transform to zero after tweens complete', () => {
    vi.useFakeTimers();
    const jitterGroup = new Group();
    applyOracleChoreographyPhase('shaking', 'idle', { jitterGroup });
    vi.advanceTimersByTime(450);
    expect(jitterGroup.position.x).toBeCloseTo(0, 5);
    expect(jitterGroup.position.y).toBeCloseTo(0, 5);
    expect(jitterGroup.position.z).toBeCloseTo(0, 5);
    expect(jitterGroup.rotation.x).toBeCloseTo(0, 5);
    expect(jitterGroup.rotation.y).toBeCloseTo(0, 5);
    expect(jitterGroup.rotation.z).toBeCloseTo(0, 5);
    vi.useRealTimers();
  });

  it('reducedMotion shaking skips position/rotation tweens but ramps timeScale', () => {
    const jitterGroup = new Group();
    applyOracleChoreographyPhase('shaking', 'idle', {
      jitterGroup,
      reducedMotion: true,
    });
    expect(gsap.getTweensOf(jitterGroup.position)).toHaveLength(0);
    expect(gsap.getTweensOf(jitterGroup.rotation)).toHaveLength(0);
    expect(oracleSceneTimeScale.value).toBe(3);
  });

  it('revealing resets jitter immediately when entering from shaking', () => {
    const jitterGroup = new Group();
    applyOracleChoreographyPhase('shaking', 'idle', { jitterGroup });
    jitterGroup.position.set(0.2, 0.1, -0.1);
    jitterGroup.rotation.set(0.1, 0, -0.12);
    applyOracleChoreographyPhase('revealing', 'shaking', {
      jitterGroup,
      result: sampleResult,
    });
    expect(jitterGroup.position.x).toBe(0);
    expect(jitterGroup.rotation.z).toBe(0);
  });
});
