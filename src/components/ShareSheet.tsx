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

      <div className="m8-share-row">
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="m8-share-btn"
          aria-busy={busy}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 2v8M5 5l3-3 3 3M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {busy ? 'preparing…' : 'share answer'}
        </button>
        {status === 'shared' && (
          <p className="m8-share-status" role="status">
            shared — check your share sheet
          </p>
        )}
        {status === 'downloaded' && (
          <p className="m8-share-status" role="status">
            image saved to downloads
          </p>
        )}
        {status === 'error' && (
          <p className="m8-share-status m8-share-status-err" role="alert">
            export failed — try again
          </p>
        )}
      </div>
    </>
  );
}
