#!/usr/bin/env node
/**
 * Optional offline preview of the procedural "8" disc (browser path uses createEightDiscTexture in Ball.tsx).
 * Writes public/textures/eight-disc.png when run with a DOM shim — for design iteration, open the app with VITE_WEBGL=true.
 *
 * Regeneration in-app: edit createEightDiscTexture() in src/three/Ball.tsx; texture is built at runtime from CSS tokens.
 */
console.log(
  'Eight disc is procedural at runtime (createEightDiscTexture in src/three/Ball.tsx).',
  'Tweak canvas drawing there; no static PNG required for G2.',
);
