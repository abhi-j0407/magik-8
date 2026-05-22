import { forwardRef } from 'react';
import { SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from '../lib/shareExport';

export type ShareCardProps = {
  answerText: string;
  themeLabel: string;
  isEasterEgg?: boolean;
};

/** Off-screen 1080×1920 story card for html-to-image export (REQ-050). */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { answerText, themeLabel, isEasterEgg = false },
  ref,
) {
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 overflow-hidden opacity-0"
      style={{ width: SHARE_CARD_WIDTH, height: SHARE_CARD_HEIGHT, zIndex: -1 }}
      aria-hidden
    >
      <div
        className="flex h-full w-full flex-col items-center justify-between px-16 py-20 text-(--magik-answer-text)"
        style={{
          width: SHARE_CARD_WIDTH,
          height: SHARE_CARD_HEIGHT,
          background: 'linear-gradient(165deg, var(--magik-fluid-light) 0%, var(--magik-fluid) 45%, #061f35 100%)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <p
          className="text-center tracking-[0.35em] uppercase"
          style={{
            fontFamily: 'var(--font-answer)',
            fontSize: 72,
            margin: 0,
          }}
        >
          Magik 8
        </p>

        <div className="flex flex-1 flex-col items-center justify-center gap-12">
          <div
            className="relative shrink-0 rounded-full shadow-[inset_-24px_-48px_80px_rgba(0,0,0,0.55)]"
            style={{
              width: 520,
              height: 520,
              background:
                'radial-gradient(circle at 32% 28%, var(--magik-sphere-highlight) 0%, var(--magik-sphere) 55%, #050505 100%)',
            }}
          >
            <div
              className="absolute left-1/2 top-[18%] flex h-[42%] w-[42%] -translate-x-1/2 items-center justify-center rounded-full bg-(--magik-stripe)"
              style={{ opacity: 0.35 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-answer)',
                  fontSize: 140,
                  color: 'var(--magik-eight)',
                  lineHeight: 1,
                }}
              >
                8
              </span>
            </div>
            <div
              className="absolute left-1/2 bottom-[14%] flex w-[38%] -translate-x-1/2 items-center justify-center rounded-sm bg-(--magik-fluid)"
              style={{ minHeight: 120, padding: '16px 20px' }}
            >
              <p
                className="m-0 text-center uppercase leading-tight"
                style={{
                  fontFamily: 'var(--font-answer)',
                  fontSize: 36,
                  color: isEasterEgg ? 'var(--magik-accent)' : 'var(--magik-answer-text)',
                }}
              >
                {answerText}
              </p>
            </div>
          </div>

          <p
            className="m-0 max-w-[900px] text-center uppercase leading-tight"
            style={{
              fontFamily: 'var(--font-answer)',
              fontSize: isEasterEgg ? 88 : 80,
              color: isEasterEgg ? 'var(--magik-accent)' : 'var(--magik-answer-text)',
              letterSpacing: '0.04em',
            }}
          >
            {answerText}
          </p>
        </div>

        <p
          className="m-0 text-center uppercase tracking-widest"
          style={{ fontSize: 36, color: 'var(--magik-muted)' }}
        >
          {themeLabel}
        </p>
      </div>
    </div>
  );
});
