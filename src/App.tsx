import { useEffect, useRef, useState } from 'react';
import { OracleStage } from './components/OracleStage';
import { HUDStrip } from './components/HUDStrip';
import { MuteToggle } from './components/MuteToggle';
import { OracleAudioBridge } from './components/OracleAudioBridge';
import { ShakeCTA } from './components/ShakeCTA';
import { ShakeSensorsProvider, useShakeSensorStatus } from './components/ShakeSensors';
import { ShareSheet } from './components/ShareSheet';
import { ThemeChips } from './components/ThemeChips';
import { Wordmark } from './components/Wordmark';
import { AudioProvider } from './context/AudioContext';
import { OracleProvider, useOracle } from './context/OracleContext';

function OracleScreen() {
  const { phase, shakeOrTap } = useOracle();
  const { motionDenied } = useShakeSensorStatus();
  const prevPhase = useRef(phase);

  const [shakeCount, setShakeCount] = useState(() => {
    return parseInt(localStorage.getItem('m8_sesh') || '0', 10) || 0;
  });

  useEffect(() => {
    if (prevPhase.current !== 'answered' && phase === 'answered') {
      setShakeCount((c) => {
        const next = c + 1;
        localStorage.setItem('m8_sesh', String(next));
        return next;
      });
    }
    prevPhase.current = phase;
  }, [phase]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      e.preventDefault();
      shakeOrTap();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shakeOrTap]);

  const instruction =
    phase === 'idle'
      ? motionDenied
        ? 'hold your question · then tap'
        : 'hold your question · shake or tap'
      : phase === 'answered'
        ? 'ask again when ready'
        : null;

  return (
    <main className="relative isolate mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-4 overflow-hidden bg-(--m8-bg) px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] font-(--m8-font-ui) text-(--m8-chrome) m8-grain m8-vignette">
      <h1 className="sr-only">Magik 8</h1>

      <header className="relative z-10 flex w-full items-center justify-between gap-2">
        <Wordmark size={22} />
        <MuteToggle />
      </header>

      <HUDStrip shakeCount={shakeCount} />

      <section
        className="z-[1] flex w-full flex-1 flex-col items-center justify-center"
        aria-labelledby="oracle-instruction"
      >
        <OracleStage />
      </section>

      {instruction && (
        <p
          id="oracle-instruction"
          className="z-[2] m-0 text-center text-(--m8-chrome-dim)"
          style={{ fontSize: 13, letterSpacing: '0.02em' }}
        >
          {instruction}
        </p>
      )}

      <ThemeChips />
      <ShakeCTA />
      <ShareSheet />
    </main>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <OracleProvider>
        <OracleAudioBridge />
        <ShakeSensorsProvider>
          <OracleScreen />
        </ShakeSensorsProvider>
      </OracleProvider>
    </AudioProvider>
  );
}
