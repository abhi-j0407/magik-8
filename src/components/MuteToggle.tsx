import { useAppAudio } from '../context/AudioContext';

export function MuteToggle() {
  const { muted, setMuted, unlock } = useAppAudio();

  const handleClick = () => {
    unlock();
    setMuted(!muted);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="min-h-11 min-w-11 rounded-full border border-(--magik-sphere-highlight) bg-(--magik-sphere) px-3 text-sm text-(--magik-muted) transition-colors hover:text-(--magik-answer-text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--magik-fluid-light)"
      aria-pressed={muted}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
