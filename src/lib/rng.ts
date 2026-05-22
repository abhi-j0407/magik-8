/** Uniform integer in [0, max) via crypto.getRandomValues */
export function randomInt(max: number): number {
  if (max <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}
