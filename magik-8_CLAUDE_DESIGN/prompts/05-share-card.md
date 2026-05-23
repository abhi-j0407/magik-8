# 05 — Share card (1080 × 1920)

## File touched
- `src/components/ShareCard.tsx`

## Reference image
- `exports/share-card-full.png`

## Preserve
- The `forwardRef<HTMLDivElement, ShareCardProps>` signature
- `SHARE_CARD_WIDTH` / `SHARE_CARD_HEIGHT` constants (1080 × 1920)
- The off-screen positioning (`fixed top-0 left-0 opacity-0`) — the export pipeline (`lib/shareExport.ts`) relies on this
- The `aria-hidden` attribute

## Replace the inner JSX

```tsx
import { forwardRef } from 'react';
import { SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH } from '../lib/shareExport';

export type ShareCardProps = {
  answerText: string;
  themeLabel: string;
  isEasterEgg?: boolean;
};

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
        className="relative flex h-full w-full flex-col items-center text-(--m8-stripe)"
        style={{
          width: SHARE_CARD_WIDTH,
          height: SHARE_CARD_HEIGHT,
          padding: '110px 80px',
          background:
            'radial-gradient(ellipse at 50% 30%, oklch(20% 0.04 268) 0%, oklch(11% 0.012 270) 70%), var(--m8-bg)',
          fontFamily: 'var(--m8-font-ui)',
          isolation: 'isolate',
          overflow: 'hidden',
        }}
      >
        {/* grain layer */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
            backgroundSize: '200px',
            opacity: 0.08,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />

        {/* corner brackets */}
        {(['tl','tr','bl','br'] as const).map((c) => (
          <span
            key={c}
            aria-hidden
            style={{
              position: 'absolute',
              fontFamily: 'var(--m8-font-hud)',
              fontSize: 28,
              color: 'var(--m8-chrome-mute)',
              top: c.startsWith('t') ? 36 : 'auto',
              bottom: c.startsWith('b') ? 36 : 'auto',
              left: c.endsWith('l') ? 44 : 'auto',
              right: c.endsWith('r') ? 44 : 'auto',
              zIndex: 4,
            }}
          >
            {c === 'tl' ? '┌' : c === 'tr' ? '┐' : c === 'bl' ? '└' : '┘'}
          </span>
        ))}

        {/* header — wordmark + pack */}
        <div className="flex flex-col items-center" style={{ gap: 12, marginBottom: 40, zIndex: 2 }}>
          <span
            className="inline-flex items-baseline"
            style={{
              fontFamily: 'var(--m8-font-wordmark)',
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: '0.04em',
              gap: '0.5em',
              color: 'var(--m8-stripe)',
              textShadow: '0 1px 0 rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.06), 0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            <span>magik</span>
            <span style={{
              color: 'var(--m8-amber)',
              fontSize: '1.25em',
              textShadow: '0 1px 0 rgba(0,0,0,0.9), 0 0 24px oklch(78% 0.135 78 / 0.5), 0 0 4px oklch(78% 0.135 78 / 0.85)',
            }}>8</span>
          </span>
          <span
            style={{
              fontFamily: 'var(--m8-font-hud)',
              fontSize: 28,
              color: 'var(--m8-chrome-mute)',
              letterSpacing: '0.18em',
              textTransform: 'lowercase',
            }}
          >
            pack · {themeLabel.toLowerCase()}
          </span>
        </div>

        {/* ball — large crop centered */}
        <div className="flex-1 flex items-center justify-center" style={{ zIndex: 2, width: '100%' }}>
          <BallCrop />
        </div>

        {/* answer — large below */}
        <p
          style={{
            margin: '20px auto 0',
            maxWidth: '90%',
            fontFamily: 'var(--m8-font-answer)',
            fontWeight: 600,
            fontSize: 96,
            lineHeight: 1.02,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: isEasterEgg ? 'var(--m8-amber)' : 'var(--m8-answer-ink)',
            textShadow: isEasterEgg
              ? '0 0 30px oklch(78% 0.135 78 / 0.45)'
              : '0 0 20px var(--m8-answer-glow)',
            textWrap: 'balance',
            zIndex: 2,
          } as React.CSSProperties}
        >
          {answerText}
        </p>

        {/* footer HUD */}
        <div
          className="flex items-center"
          style={{
            gap: 16,
            marginTop: 36,
            fontFamily: 'var(--m8-font-hud)',
            fontSize: 24,
            color: 'var(--m8-chrome-mute)',
            letterSpacing: '0.12em',
            textTransform: 'lowercase',
            zIndex: 2,
          }}
        >
          <span>m8://oracle</span>
          <span style={{ color: 'var(--m8-amber)' }}>●</span>
          <span>shake.respond.share</span>
        </div>
      </div>
    </div>
  );
});

/** Static cropped ball — duplicates layer stack from MagikBall but at fixed size 620. */
function BallCrop() {
  const SIZE = 620;
  return (
    <div style={{ width: SIZE, height: SIZE, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 30%, var(--m8-sphere-mid) 0%, var(--m8-sphere-core) 45%, var(--m8-sphere-rim) 100%)',
        }}/>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(ellipse 60% 35% at 50% 95%, var(--m8-sphere-warm) 0%, transparent 70%)',
          mixBlendMode: 'screen', opacity: 0.6,
        }}/>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.85), inset -20px -36px 60px rgba(0,0,0,0.55)',
        }}/>
        <div style={{ position: 'absolute', top: '6%', left: '12%', width: '55%', height: '45%', borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, var(--m8-sphere-hi) 0%, transparent 65%)',
          opacity: 0.55, filter: 'blur(10px)', mixBlendMode: 'screen',
        }}/>
        <div style={{ position: 'absolute', top: '12%', left: '22%', width: '14%', height: '10%', borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, var(--m8-sphere-spec) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)',
          filter: 'blur(3px)', opacity: 0.85,
        }}/>
        {/* triangle — answered/fluid filled */}
        <div style={{ position: 'absolute', left: '50%', bottom: '12%', transform: 'translateX(-50%)',
          width: '38%', aspectRatio: '1 / 0.866',
        }}>
          <svg viewBox="0 0 100 87" style={{ width: '100%', height: '100%' }} aria-hidden>
            <defs>
              <linearGradient id="m8-sc-ink" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%"  stopColor="var(--m8-fluid-hi)" />
                <stop offset="22%" stopColor="var(--m8-fluid-mid)" />
                <stop offset="100%" stopColor="var(--m8-fluid-deep)" />
              </linearGradient>
              <radialGradient id="m8-sc-recess" cx="50%" cy="25%" r="85%">
                <stop offset="0%"  stopColor="rgba(0,0,0,0)" />
                <stop offset="65%" stopColor="rgba(0,0,0,0.25)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
              </radialGradient>
              <linearGradient id="m8-sc-bezel" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(20% 0.005 270)" />
                <stop offset="100%" stopColor="oklch(2% 0 0)" />
              </linearGradient>
            </defs>
            <polygon points="50,1 99,86 1,86" fill="url(#m8-sc-bezel)" />
            <polygon points="50,4 96,83 4,83" fill="url(#m8-sc-ink)" />
            <polygon points="50,4 96,83 4,83" fill="url(#m8-sc-recess)" opacity="0.55" />
          </svg>
        </div>
      </div>
    </div>
  );
}
```

## Notes

- The ball-on-the-card hides the white "8" field (you're showing the **answered** state — the ink is risen, the triangle is the focus).
- Answer text appears at large size (96px) below the ball. We deliberately also keep the small answer inside the triangle — at the export resolution it's almost invisible, but it's *correct* (preserves the toy feel).
- Easter-egg variant: amber text + softer glow. Existing easter-egg logic in `OracleContext` already passes `isEasterEgg` to this component.

## Verification

There's no live preview for the share card (it's `opacity: 0` off-screen). Trigger the actual export:

1. `npm run dev`
2. Shake to get an answer
3. Tap "share answer"
4. The downloaded PNG should match `exports/share-card-full.png` in composition (your sphere may look slightly crisper because you're rendering at 1080px instead of the scaled-down preview)

## Tests

`src/lib/shareExport.test.ts` checks the helper; the component itself isn't tested. Run `npm test` to confirm no regressions.
