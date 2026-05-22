import { useCallback, useRef, useState } from 'react';

export const MUTE_STORAGE_KEY = 'magik_mute';

export type SfxId = 'shake_start' | 'reveal' | 'easter_egg';

export function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0');
  } catch {
    /* localStorage unavailable */
  }
}

function createContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  return new Ctor();
}

/** SFX-01 — muffled slosh (~300ms) */
function playShakeStart(ctx: AudioContext, destination: AudioNode, when: number) {
  const duration = 0.3;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 280;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, when);
  gain.gain.exponentialRampToValueAtTime(0.01, when + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(when);
  source.stop(when + duration);
}

/** SFX-02 — soft triangle ping (~400ms) */
function playReveal(ctx: AudioContext, destination: AudioNode, when: number) {
  const duration = 0.4;
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, when);
  osc.frequency.exponentialRampToValueAtTime(780, when + 0.08);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(0.22, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, when + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(when);
  osc.stop(when + duration);
}

/** SFX-03 — sparkle layer (~600ms) */
function playEasterEgg(ctx: AudioContext, destination: AudioNode, when: number) {
  const tones = [880, 1175, 1568, 2093];
  tones.forEach((freq, i) => {
    const t = when + i * 0.1;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}

export function playSfx(ctx: AudioContext, id: SfxId): void {
  const when = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  switch (id) {
    case 'shake_start':
      playShakeStart(ctx, master, when);
      break;
    case 'reveal':
      playReveal(ctx, master, when);
      break;
    case 'easter_egg':
      playEasterEgg(ctx, master, when);
      break;
  }
}

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMutedState] = useState(loadMuted);

  const ensureContext = useCallback(async (): Promise<AudioContext | null> => {
    if (!ctxRef.current) {
      ctxRef.current = createContext();
    }
    const ctx = ctxRef.current;
    if (!ctx) return null;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return null;
      }
    }
    return ctx;
  }, []);

  /** REQ-040: unlock AudioContext on first user gesture (iOS). */
  const unlock = useCallback(() => {
    void ensureContext();
  }, [ensureContext]);

  const play = useCallback(
    async (id: SfxId) => {
      if (muted) return;
      const ctx = await ensureContext();
      if (!ctx) return;
      playSfx(ctx, id);
    },
    [muted, ensureContext],
  );

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    saveMuted(value);
  }, []);

  const playShakeStart = useCallback(() => play('shake_start'), [play]);
  const playReveal = useCallback(() => play('reveal'), [play]);
  const playEasterEgg = useCallback(() => play('easter_egg'), [play]);

  return {
    muted,
    setMuted,
    unlock,
    playShakeStart,
    playReveal,
    playEasterEgg,
  };
}

export type AudioControls = ReturnType<typeof useAudio>;
