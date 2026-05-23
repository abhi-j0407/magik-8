import { toPng } from 'html-to-image';

export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1920;

/** Ball slot on the off-screen share card (matches ShareCard BallCrop). */
export const SHARE_BALL_SIZE = 620;
export const SHARE_BALL_SLOT_SELECTOR = '[data-m8-share-ball-slot]';
export const ORACLE_CANVAS_SELECTOR = '[data-m8-oracle-canvas]';

export type ShareBallRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function isWebglShareCaptureEnabled(): boolean {
  return import.meta.env.VITE_WEBGL === 'true';
}

export function getOracleCanvas(): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const el = document.querySelector(ORACLE_CANVAS_SELECTOR);
  return el instanceof HTMLCanvasElement ? el : null;
}

/** Default ball slot when layout measurement is unavailable. */
export function getShareBallRectFallback(): ShareBallRect {
  const size = SHARE_BALL_SIZE;
  return {
    x: (SHARE_CARD_WIDTH - size) / 2,
    y: (SHARE_CARD_HEIGHT - size) / 2 - 80,
    width: size,
    height: size,
  };
}

/** Map ball slot position from share card layout to export pixel coords. */
export function getShareBallRect(cardRoot: HTMLElement): ShareBallRect {
  const cardWidth = cardRoot.offsetWidth || SHARE_CARD_WIDTH;
  const cardHeight = cardRoot.offsetHeight || SHARE_CARD_HEIGHT;
  const scaleX = SHARE_CARD_WIDTH / cardWidth;
  const scaleY = SHARE_CARD_HEIGHT / cardHeight;

  const slot = cardRoot.querySelector(SHARE_BALL_SLOT_SELECTOR);
  if (slot instanceof HTMLElement && slot.offsetWidth > 0) {
    const cardRect = cardRoot.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    return {
      x: (slotRect.left - cardRect.left) * scaleX,
      y: (slotRect.top - cardRect.top) * scaleY,
      width: slotRect.width * scaleX,
      height: slotRect.height * scaleY,
    };
  }

  return getShareBallRectFallback();
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load share image'));
    img.src = dataUrl;
  });
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  if (!blob.type) {
    return new Blob([await res.arrayBuffer()], { type: 'image/png' });
  }
  return blob;
}

/** Draw WebGL oracle frame over the html-to-image share card at the ball slot. */
export async function compositeOracleBallOntoShare(
  cardDataUrl: string,
  ballDataUrl: string,
  ballRect: ShareBallRect,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');

  const [cardImg, ballImg] = await Promise.all([
    loadImage(cardDataUrl),
    loadImage(ballDataUrl),
  ]);

  ctx.drawImage(cardImg, 0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  const cx = ballRect.x + ballRect.width / 2;
  const cy = ballRect.y + ballRect.height / 2;
  const r = Math.min(ballRect.width, ballRect.height) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(ballImg, ballRect.x, ballRect.y, ballRect.width, ballRect.height);
  ctx.restore();

  return dataUrlToBlob(canvas.toDataURL('image/png'));
}

export function captureOracleCanvasDataUrl(canvas: HTMLCanvasElement): string | null {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl.startsWith('data:image/png') ? dataUrl : null;
  } catch {
    return null;
  }
}

export function getShareAnswerText(
  result: { isEasterEgg: boolean; easterEggText?: string; answer: { text: string } } | null,
): string {
  if (!result) return '';
  return result.isEasterEgg
    ? result.easterEggText ?? result.answer.text
    : result.answer.text;
}

export async function captureShareCard(node: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(node, {
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
    skipFonts: false,
  });

  return dataUrlToBlob(dataUrl);
}

/** html-to-image share card; composites live WebGL ball when flag + canvas are present. */
export async function captureShareCardForExport(node: HTMLElement): Promise<Blob> {
  const cardDataUrl = await toPng(node, {
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
    skipFonts: false,
  });

  if (!isWebglShareCaptureEnabled()) {
    return dataUrlToBlob(cardDataUrl);
  }

  const oracleCanvas = getOracleCanvas();
  if (!oracleCanvas) {
    return dataUrlToBlob(cardDataUrl);
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  const ballDataUrl = captureOracleCanvasDataUrl(oracleCanvas);
  if (!ballDataUrl) {
    return dataUrlToBlob(cardDataUrl);
  }

  const ballRect = getShareBallRect(node);
  return compositeOracleBallOntoShare(cardDataUrl, ballDataUrl, ballRect);
}

export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  if (!navigator.canShare) return false;
  try {
    const probe = new File([''], 'magik-8.png', { type: 'image/png' });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

export async function shareOrDownloadPng(blob: Blob, filename: string): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], filename, { type: 'image/png' });

  if (canShareFiles()) {
    await navigator.share({
      files: [file],
      title: 'Magik 8',
      text: 'My oracle answer from Magik 8',
    });
    return 'shared';
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
