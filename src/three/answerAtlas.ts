import { CanvasTexture } from 'three';
import { EASTER_EGGS, THEME_PACKS } from '../data/answers';
import type { OracleResult } from '../types/oracle';

const CANVAS_SIZE = 256;
const FONT_SIZE = 30;
const WRAP_CHARS = 10;

/** Split on `|` (cywarr) or wrap at ~10 characters per line. */
export function wrapPhraseLines(text: string): string[] {
  if (text.includes('|')) return text.split('|');
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [text];
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > WRAP_CHARS && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** cywarr createTextures recipe — 256×256 canvas, Oswald/Courier, white on transparent. */
export function createTextureForPhrase(text: string): CanvasTexture {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { fontSmooth: 'never' });
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const size = FONT_SIZE;
  const sizeRatio = 1;
  ctx.font = `bold ${size}px 'Oswald','Courier New',sans-serif`;

  const phraseChunks = wrapPhraseLines(text);
  const startPoint = (phraseChunks.length - 1) * 0.5 * size * sizeRatio;
  ctx.fillStyle = '#fff';
  phraseChunks.forEach((chunk, idx) => {
    ctx.fillText(
      chunk.toUpperCase(),
      CANVAS_SIZE / 2,
      CANVAS_SIZE / 2 - startPoint + idx * size * sizeRatio,
    );
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function collectAllAnswerStrings(): string[] {
  const packTexts = THEME_PACKS.flatMap((p) => p.answers.map((a) => a.text));
  const eggTexts = EASTER_EGGS.map((e) => e.text);
  return [...new Set([...packTexts, ...eggTexts])];
}

const answerAtlas = new Map<string, CanvasTexture>();

function ensureAtlasBuilt(): void {
  if (answerAtlas.size > 0 || typeof document === 'undefined') return;
  for (const text of collectAllAnswerStrings()) {
    answerAtlas.set(text, createTextureForPhrase(text));
  }
}

if (typeof document !== 'undefined') {
  ensureAtlasBuilt();
}

export function getAnswerTexture(answerKey: string, _isEasterEgg = false): CanvasTexture {
  ensureAtlasBuilt();
  let tex = answerAtlas.get(answerKey);
  if (!tex) {
    if (typeof document === 'undefined') {
      throw new Error(`Answer atlas unavailable (no DOM): ${answerKey}`);
    }
    tex = createTextureForPhrase(answerKey);
    answerAtlas.set(answerKey, tex);
  }
  return tex;
}

export function getAnswerDisplayText(result: OracleResult | null): string | undefined {
  if (!result) return undefined;
  return result.isEasterEgg
    ? result.easterEggText ?? result.answer.text
    : result.answer.text;
}

/** Test-only: clear cached textures between cases. */
export function __resetAnswerAtlasForTests(): void {
  answerAtlas.clear();
}

export function __buildAnswerAtlasForTests(): void {
  __resetAnswerAtlasForTests();
  ensureAtlasBuilt();
}
