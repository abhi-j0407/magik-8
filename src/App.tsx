import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
  const { phase, packId, shakeOrTap } = useOracle();
  const { motionDenied } = useShakeSensorStatus();
  const reducedMotion = useReducedMotion();
  const prevPhase = useRef(phase);

  // Drive the per-mode palette: classic / party / career swap CSS tokens.
  useEffect(() => {
    document.documentElement.dataset.pack = packId;
  }, [packId]);

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
    <main className="relative isolate mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-5 overflow-hidden bg-(--m8-bg) px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] font-(--m8-font-ui) text-(--m8-chrome) m8-grain m8-vignette">
      <AnimatePresence mode="sync">
        <motion.div
          key={packId}
          className={`m8-aurora m8-aurora--${packId}`}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      <span className="m8-corner m8-corner-tl" aria-hidden />
      <span className="m8-corner m8-corner-tr" aria-hidden />
      <span className="m8-corner m8-corner-bl" aria-hidden />
      <span className="m8-corner m8-corner-br" aria-hidden />

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

      <div className="z-2 flex w-full flex-col items-center gap-4">
        <div className="flex h-5 items-center justify-center">
          <AnimatePresence mode="wait">
            {instruction && (
              <motion.p
                key={instruction}
                id="oracle-instruction"
                className="m-0 inline-flex items-center gap-2 text-center text-(--m8-chrome-dim)"
                style={{ fontSize: 12, letterSpacing: '0.08em' }}
                initial={reducedMotion ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <span aria-hidden className="text-(--m8-chrome-mute)">
                  ┄
                </span>
                {instruction}
                <span aria-hidden className="text-(--m8-chrome-mute)">
                  ┄
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <ThemeChips />
        <ShakeCTA />
        <ShareSheet />
      </div>
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
