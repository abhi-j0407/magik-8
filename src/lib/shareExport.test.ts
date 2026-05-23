import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canShareFiles,
  getShareAnswerText,
  getShareBallRectFallback,
  isWebglShareCaptureEnabled,
  SHARE_BALL_SIZE,
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
} from './shareExport';

describe('getShareAnswerText', () => {
  it('returns answer text for normal results', () => {
    expect(
      getShareAnswerText({
        isEasterEgg: false,
        answer: { text: 'Yes definitely' },
      }),
    ).toBe('Yes definitely');
  });

  it('returns easter egg text when triggered', () => {
    expect(
      getShareAnswerText({
        isEasterEgg: true,
        easterEggText: 'The void whispers back',
        answer: { text: 'Yes' },
      }),
    ).toBe('The void whispers back');
  });

  it('falls back to answer when egg text missing', () => {
    expect(
      getShareAnswerText({
        isEasterEgg: true,
        answer: { text: 'Outlook good' },
      }),
    ).toBe('Outlook good');
  });

  it('returns empty string when no result', () => {
    expect(getShareAnswerText(null)).toBe('');
  });
});

describe('canShareFiles', () => {
  const originalShare = navigator.share;
  const originalCanShare = navigator.canShare;

  beforeEach(() => {
    vi.stubGlobal(
      'navigator',
      {
        share: vi.fn(),
        canShare: vi.fn(() => true),
      } as unknown as Navigator,
    );
  });

  afterEach(() => {
    vi.stubGlobal('navigator', {
      share: originalShare,
      canShare: originalCanShare,
    } as Navigator);
  });

  it('returns true when file share is supported', () => {
    expect(canShareFiles()).toBe(true);
  });

  it('returns false without canShare', () => {
    vi.stubGlobal('navigator', { share: vi.fn() } as unknown as Navigator);
    expect(canShareFiles()).toBe(false);
  });
});

describe('share card dimensions', () => {
  it('uses story aspect 1080×1920', () => {
    expect(SHARE_CARD_WIDTH).toBe(1080);
    expect(SHARE_CARD_HEIGHT).toBe(1920);
  });

  it('uses 620px ball slot matching ShareCard', () => {
    expect(SHARE_BALL_SIZE).toBe(620);
  });
});

describe('isWebglShareCaptureEnabled', () => {
  it('is false when VITE_WEBGL is unset', () => {
    vi.stubEnv('VITE_WEBGL', undefined);
    expect(isWebglShareCaptureEnabled()).toBe(false);
  });

  it('is true when VITE_WEBGL=true', () => {
    vi.stubEnv('VITE_WEBGL', 'true');
    expect(isWebglShareCaptureEnabled()).toBe(true);
  });
});

describe('getShareBallRectFallback', () => {
  it('centers 620px ball on the story card', () => {
    const rect = getShareBallRectFallback();
    expect(rect).toEqual({
      x: 230,
      y: 570,
      width: SHARE_BALL_SIZE,
      height: SHARE_BALL_SIZE,
    });
  });
});
