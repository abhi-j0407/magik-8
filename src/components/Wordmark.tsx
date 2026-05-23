type WordmarkProps = {
  size?: number;
  className?: string;
};

/** Brand wordmark — VT323, with amber "8" and embossed shadow stack. */
export function Wordmark({ size = 22, className = '' }: WordmarkProps) {
  return (
    <span className={`m8-wordmark ${className}`.trim()} style={{ fontSize: size }}>
      <span>magik</span>
      <span className="m8-wm-eight">8</span>
    </span>
  );
}
