import { toPng } from 'html-to-image';

export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1920;

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

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  if (!blob.type) {
    return new Blob([await res.arrayBuffer()], { type: 'image/png' });
  }
  return blob;
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
