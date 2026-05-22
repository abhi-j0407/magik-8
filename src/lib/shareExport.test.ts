import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canShareFiles,
  getShareAnswerText,
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
});
