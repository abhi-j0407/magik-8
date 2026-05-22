import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAudio, type AudioControls } from '../hooks/useAudio';

const AudioCtx = createContext<AudioControls | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useAudio();

  const { unlock } = audio;

  useEffect(() => {
    const onGesture = () => unlock();
    window.addEventListener('pointerdown', onGesture, { once: true });
    window.addEventListener('keydown', onGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [unlock]);

  return <AudioCtx.Provider value={audio}>{children}</AudioCtx.Provider>;
}

export function useAppAudio(): AudioControls {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error('useAppAudio must be used within AudioProvider');
  }
  return ctx;
}
