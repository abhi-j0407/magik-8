import { describe, expect, it } from 'vitest';
import {
  detectShake,
  detectShakeSpike,
  hasSustainedShakeSamples,
  magnitudeFromMotion,
  SHAKE_COOLDOWN_MS_DEFAULT,
  SHAKE_SPIKE_DELTA_DEFAULT,
  SHAKE_SUSTAINED_SAMPLES_DEFAULT,
  SHAKE_THRESHOLD_DEFAULT,
  updateMotionBaseline,
} from './useShake';

describe('magnitudeFromMotion', () => {
  it('uses hypot magnitude of acceleration including gravity', () => {
    expect(magnitudeFromMotion(3, -4, 5)).toBeCloseTo(Math.hypot(3, 4, 5), 5);
  });
});

describe('detectShake', () => {
  const threshold = SHAKE_THRESHOLD_DEFAULT;
  const cooldown = SHAKE_COOLDOWN_MS_DEFAULT;

  it('returns false below threshold', () => {
    expect(detectShake(17, threshold, 0, 1000, cooldown)).toBe(false);
  });

  it('returns true above threshold with no prior shake', () => {
    expect(detectShake(19, threshold, 0, 1000, cooldown)).toBe(true);
  });

  it('returns false inside cooldown window', () => {
    expect(detectShake(22, threshold, 1000, 2500, cooldown)).toBe(false);
  });

  it('returns true at exactly cooldown boundary', () => {
    expect(detectShake(22, threshold, 1000, 3000, cooldown)).toBe(true);
  });

  it('returns false just before cooldown boundary', () => {
    expect(detectShake(22, threshold, 1000, 2999, cooldown)).toBe(false);
  });
});

describe('detectShakeSpike', () => {
  const threshold = SHAKE_THRESHOLD_DEFAULT;
  const spikeDelta = SHAKE_SPIKE_DELTA_DEFAULT;

  it('rejects magnitude at threshold without jerk above baseline', () => {
    expect(detectShakeSpike(18, 14, threshold, spikeDelta)).toBe(false);
  });

  it('accepts spike when magnitude exceeds baseline by delta', () => {
    expect(detectShakeSpike(22, 9.8, threshold, spikeDelta)).toBe(true);
  });

  it('rejects below threshold even with large delta', () => {
    expect(detectShakeSpike(10, 0, threshold, spikeDelta)).toBe(false);
  });
});

describe('hasSustainedShakeSamples', () => {
  it('requires configured consecutive samples', () => {
    expect(
      hasSustainedShakeSamples(
        SHAKE_SUSTAINED_SAMPLES_DEFAULT - 1,
        SHAKE_SUSTAINED_SAMPLES_DEFAULT,
      ),
    ).toBe(false);
    expect(
      hasSustainedShakeSamples(
        SHAKE_SUSTAINED_SAMPLES_DEFAULT,
        SHAKE_SUSTAINED_SAMPLES_DEFAULT,
      ),
    ).toBe(true);
  });
});

describe('updateMotionBaseline', () => {
  it('smooths toward recent samples', () => {
    const next = updateMotionBaseline(10, 20);
    expect(next).toBeGreaterThan(10);
    expect(next).toBeLessThan(20);
  });
});

describe('motion permission state machine (mock)', () => {
  function transition(
    current: 'prompt' | 'granted' | 'denied' | 'unsupported',
    event: 'grant' | 'deny' | 'unsupported',
  ) {
    if (current === 'unsupported') return 'unsupported';
    if (event === 'unsupported') return 'unsupported';
    if (current === 'prompt' && event === 'grant') return 'granted';
    if (current === 'prompt' && event === 'deny') return 'denied';
    return current;
  }

  it('prompt → granted on grant', () => {
    expect(transition('prompt', 'grant')).toBe('granted');
  });

  it('prompt → denied on deny', () => {
    expect(transition('prompt', 'deny')).toBe('denied');
  });

  it('denied stays denied', () => {
    expect(transition('denied', 'grant')).toBe('denied');
  });

  it('unsupported stays unsupported', () => {
    expect(transition('unsupported', 'grant')).toBe('unsupported');
  });
});
