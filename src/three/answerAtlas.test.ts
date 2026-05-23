import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EASTER_EGGS, THEME_PACKS } from '../data/answers';
import type { OracleResult } from '../types/oracle';
import {
  __buildAnswerAtlasForTests,
  __resetAnswerAtlasForTests,
  createTextureForPhrase,
  getAnswerDisplayText,
  getAnswerTexture,
  wrapPhraseLines,
} from './answerAtlas';

function installCanvasDocument(): { lastFont: { current: string } } {
  const lastFont = { current: '' };
  const createCanvas = () => {
    let w = 0;
    let h = 0;
    const ctx = {
      clearRect: vi.fn(),
      fillText: vi.fn(),
      textAlign: 'center',
      textBaseline: 'middle',
      fillStyle: '#fff',
      font: '',
    };
    Object.defineProperty(ctx, 'font', {
      get: () => lastFont.current,
      set: (v: string) => {
        lastFont.current = v;
      },
      configurable: true,
    });
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
      getContext: () => ctx,
    };
  };

  vi.stubGlobal('document', {
    createElement: (tag: string) => {
      if (tag !== 'canvas') throw new Error(`Unexpected element: ${tag}`);
      return createCanvas();
    },
  });
  return { lastFont };
}

function allAnswerStrings(): string[] {
  return [
    ...THEME_PACKS.flatMap((p) => p.answers.map((a) => a.text)),
    ...EASTER_EGGS.map((e) => e.text),
  ];
}

describe('answerAtlas', () => {
  let lastFont: { current: string };

  beforeEach(() => {
    ({ lastFont } = installCanvasDocument());
    __resetAnswerAtlasForTests();
    __buildAnswerAtlasForTests();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds CanvasTexture with non-zero dimensions for every answer', () => {
    for (const text of allAnswerStrings()) {
      const tex = getAnswerTexture(text);
      expect(tex.image.width).toBeGreaterThan(0);
      expect(tex.image.height).toBeGreaterThan(0);
    }
  });

  it('round-trips keyed lookup', () => {
    const sample = THEME_PACKS[0].answers[0].text;
    const a = getAnswerTexture(sample);
    const b = getAnswerTexture(sample);
    expect(a).toBe(b);
  });

  it('wraps long phrases without pipe delimiters', () => {
    const lines = wrapPhraseLines('Approved in the parallel timeline');
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.every((l) => l.length <= 12)).toBe(true);
  });

  it('createTextureForPhrase sets 256×256 canvas', () => {
    const tex = createTextureForPhrase('Yes');
    expect(tex.image.width).toBe(256);
    expect(tex.image.height).toBe(256);
  });

  it('uses cywarr Courier New font (no Oswald)', () => {
    __resetAnswerAtlasForTests();
    createTextureForPhrase('Yes');
    expect(lastFont.current).toBe("bold 30px 'Courier New'");
    expect(lastFont.current).not.toMatch(/Oswald/i);
  });
});

describe('getAnswerDisplayText', () => {
  beforeEach(() => {
    installCanvasDocument();
    __buildAnswerAtlasForTests();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('prefers easter egg copy', () => {
    const result: OracleResult = {
      isEasterEgg: true,
      easterEggText: 'Error 8: fate overflow',
      answer: { id: 'x', category: 'affirmative', text: 'Yes' },
    };
    expect(getAnswerDisplayText(result)).toBe('Error 8: fate overflow');
    expect(getAnswerTexture(getAnswerDisplayText(result)!)).toBeDefined();
  });
});
