import { useEffect } from 'react';
import { MagikBall } from './components/MagikBall';
import { MuteToggle } from './components/MuteToggle';
import { OracleAudioBridge } from './components/OracleAudioBridge';
import { ShakeCTA } from './components/ShakeCTA';
import { ShakeSensorsProvider, useShakeSensorStatus } from './components/ShakeSensors';
import { ShareSheet } from './components/ShareSheet';
import { ThemeChips } from './components/ThemeChips';
import { AudioProvider } from './context/AudioContext';
import { OracleProvider, useOracle } from './context/OracleContext';

function OracleScreen() {
  const { phase, shakeOrTap } = useOracle();
  const { motionDenied } = useShakeSensorStatus();

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
        ? 'Hold your question in mind, then tap.'
        : 'Hold your question in mind, then shake or tap.'
      : phase === 'answered'
        ? 'Ask again when ready.'
        : null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center gap-6 bg-(--magik-bg) px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] font-(--font-ui) text-(--magik-answer-text)">
      <header className="relative w-full text-center">
        <div className="absolute top-0 right-0">
          <MuteToggle />
        </div>
        <h1 className="font-(--font-answer) text-3xl tracking-widest uppercase">Magik 8</h1>
        {instruction && (
          <p className="mt-2 text-sm text-(--magik-muted)" id="oracle-instruction">
            {instruction}
          </p>
        )}
      </header>

      <section className="flex w-full flex-1 flex-col items-center justify-center" aria-labelledby="oracle-instruction">
        <MagikBall />
      </section>

      <ThemeChips />
      <ShareSheet />
      <ShakeCTA />
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
