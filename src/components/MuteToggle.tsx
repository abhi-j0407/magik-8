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
      className="m8-icon-btn"
      aria-pressed={muted}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3v-5Z" fill="currentColor" />
          <path
            d="M11 6l3 3M14 6l-3 3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3v-5Z" fill="currentColor" />
          <path
            d="M11 5.5c1 .8 1 4.2 0 5M13 4c1.5 1.4 1.5 6.6 0 8"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
