import { useCallback, useRef, useState } from 'react';
import { useOracle } from '../context/OracleContext';
import {
  captureShareCard,
  getShareAnswerText,
  shareOrDownloadPng,
} from '../lib/shareExport';
import { ShareCard } from './ShareCard';

export function ShareSheet() {
  const { phase, result, selectedPack } = useOracle();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'shared' | 'downloaded' | 'error'>('idle');

  const show = phase === 'answered' && result !== null;
  const answerText = getShareAnswerText(result);

  const handleShare = useCallback(async () => {
    if (!cardRef.current || !result) return;
    setBusy(true);
    setStatus('idle');
    try {
      const blob = await captureShareCard(cardRef.current);
      const outcome = await shareOrDownloadPng(blob, `magik-8-${Date.now()}.png`);
      setStatus(outcome);
    } catch {
      setStatus('error');
    } finally {
      setBusy(false);
    }
  }, [result]);

  if (!show) return null;

  return (
    <>
      <ShareCard
        ref={cardRef}
        answerText={answerText}
        themeLabel={selectedPack.label}
        isEasterEgg={result.isEasterEgg}
      />

      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="min-h-11 w-full rounded-full border border-(--magik-fluid-light) bg-(--magik-fluid) px-6 py-3 text-sm font-semibold text-(--magik-answer-text) transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--magik-fluid-light) disabled:cursor-wait disabled:opacity-60"
          aria-busy={busy}
        >
          {busy ? 'Preparing image…' : 'Share answer'}
        </button>
        {status === 'shared' && (
          <p className="text-xs text-(--magik-muted)" role="status">
            Shared — check your share sheet.
          </p>
        )}
        {status === 'downloaded' && (
          <p className="text-xs text-(--magik-muted)" role="status">
            Image saved — use your gallery or files app.
          </p>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-400" role="alert">
            Could not export. Try again.
          </p>
        )}
      </div>
    </>
  );
}
