import { afterEach, describe, expect, it, vi } from 'vitest';
import { THEME_PACKS } from '../data/answers';
import * as easterEgg from '../lib/easterEgg';
import {
  canAcceptShakeStart,
  initialOracleState,
  isMotionSensorEnabled,
  oracleReducer,
  type OracleState,
} from './useOracleMachine';

function reduce(state: OracleState, ...events: Parameters<typeof oracleReducer>[1][]) {
  return events.reduce((s, e) => oracleReducer(s, e), state);
}

describe('oracleReducer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts idle', () => {
    const state = initialOracleState();
    expect(state.phase).toBe('idle');
    expect(state.result).toBeNull();
  });

  it('idle → shaking on SHAKE_OR_TAP', () => {
    const next = oracleReducer(initialOracleState(), { type: 'SHAKE_OR_TAP' });
    expect(next.phase).toBe('shaking');
  });

  it('shaking → revealing on THRESHOLD_MET with answer', () => {
    const shaking = reduce(initialOracleState(), { type: 'SHAKE_OR_TAP' });
    const revealing = oracleReducer(shaking, { type: 'THRESHOLD_MET' });
    expect(revealing.phase).toBe('revealing');
    expect(revealing.result?.answer).toBeDefined();
    expect(revealing.result?.answer.text.length).toBeGreaterThan(0);
  });

  it('revealing → answered on ANIMATION_DONE', () => {
    const revealing = reduce(
      initialOracleState(),
      { type: 'SHAKE_OR_TAP' },
      { type: 'THRESHOLD_MET' },
    );
    const answered = oracleReducer(revealing, { type: 'ANIMATION_DONE' });
    expect(answered.phase).toBe('answered');
  });

  it('ignores SHAKE_OR_TAP while answered until RESET', () => {
    const answered = reduce(
      initialOracleState(),
      { type: 'SHAKE_OR_TAP' },
      { type: 'THRESHOLD_MET' },
      { type: 'ANIMATION_DONE' },
    );
    const same = oracleReducer(answered, { type: 'SHAKE_OR_TAP' });
    expect(same.phase).toBe('answered');
    expect(same.result).toEqual(answered.result);

    const idle = oracleReducer(answered, { type: 'RESET' });
    const shaking = oracleReducer(idle, { type: 'SHAKE_OR_TAP' });
    expect(shaking.phase).toBe('shaking');
    expect(shaking.result).toBeNull();
  });

  it('ignores SHAKE_OR_TAP while shaking', () => {
    const shaking = oracleReducer(initialOracleState(), { type: 'SHAKE_OR_TAP' });
    const same = oracleReducer(shaking, { type: 'SHAKE_OR_TAP' });
    expect(same.phase).toBe('shaking');
  });

  it('ignores SHAKE_OR_TAP while revealing', () => {
    const revealing = reduce(
      initialOracleState(),
      { type: 'SHAKE_OR_TAP' },
      { type: 'THRESHOLD_MET' },
    );
    const same = oracleReducer(revealing, { type: 'SHAKE_OR_TAP' });
    expect(same.phase).toBe('revealing');
  });

  it('THEME_CHANGE only from idle or answered', () => {
    const idle = initialOracleState();
    const themed = oracleReducer(idle, { type: 'THEME_CHANGE', packId: 'party' });
    expect(themed.packId).toBe('party');

    const shaking = oracleReducer(idle, { type: 'SHAKE_OR_TAP' });
    const blocked = oracleReducer(shaking, { type: 'THEME_CHANGE', packId: 'career' });
    expect(blocked.packId).toBe(idle.packId);
  });

  it('RESET only from answered', () => {
    const answered = reduce(
      initialOracleState(),
      { type: 'SHAKE_OR_TAP' },
      { type: 'THRESHOLD_MET' },
      { type: 'ANIMATION_DONE' },
    );
    const idle = oracleReducer(answered, { type: 'RESET' });
    expect(idle.phase).toBe('idle');
    expect(idle.result).toBeNull();
  });

  it('ritual lock helpers gate motion and tap start', () => {
    expect(canAcceptShakeStart('idle')).toBe(true);
    expect(canAcceptShakeStart('shaking')).toBe(false);
    expect(canAcceptShakeStart('revealing')).toBe(false);
    expect(canAcceptShakeStart('answered')).toBe(false);

    expect(isMotionSensorEnabled('idle')).toBe(true);
    expect(isMotionSensorEnabled('shaking')).toBe(true);
    expect(isMotionSensorEnabled('revealing')).toBe(false);
    expect(isMotionSensorEnabled('answered')).toBe(false);
  });

  it('picked answer belongs to selected pack', () => {
    const state: OracleState = { phase: 'shaking', packId: 'career', result: null };
    const revealing = oracleReducer(state, { type: 'THRESHOLD_MET' });
    const pack = THEME_PACKS.find((p) => p.id === 'career')!;
    expect(pack.answers).toContainEqual(revealing.result?.answer);
  });

  it('attaches easter egg text when maybeEasterEgg triggers', () => {
    vi.spyOn(easterEgg, 'maybeEasterEgg').mockReturnValue({
      triggered: true,
      id: 'egg-02',
      text: 'Error 8: fate overflow',
    });
    const revealing = reduce(initialOracleState(), { type: 'SHAKE_OR_TAP' }, { type: 'THRESHOLD_MET' });
    expect(revealing.result?.isEasterEgg).toBe(true);
    expect(revealing.result?.easterEggText).toBe('Error 8: fate overflow');
  });
});
