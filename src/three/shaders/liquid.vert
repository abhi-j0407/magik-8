varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormalW;
varying float vFill;
varying float vMeniscus;

uniform float uTime;
uniform float uSlosh;
uniform float uBob;
uniform float uHalfHeight;
uniform float uTopRadius;

void main() {
  vUv = uv;
  vec3 pos = position;
  float yNorm = (pos.y + uHalfHeight) / (2.0 * uHalfHeight);

  float surfaceMask = smoothstep(0.72, 0.98, yNorm);
  float edge = length(pos.xz) / max(uTopRadius, 0.001);

  float bob =
    sin(uTime * 1.15 + pos.x * 5.0) * 0.012 +
    cos(uTime * 0.95 + pos.z * 4.5) * 0.01;
  float slosh =
    sin(uTime * 5.5 + pos.x * 3.2 + pos.z * 2.1) * 0.045 * uSlosh +
    cos(uTime * 4.8 - pos.z * 2.8 + pos.x * 1.6) * 0.038 * uSlosh;
  float ripple =
    sin(uTime * 2.2 + length(pos.xz) * 14.0) * 0.006 * (uSlosh * 0.35 + uBob);

  float disp = (bob * uBob + slosh + ripple) * surfaceMask;
  pos.y += disp;

  vFill = yNorm;
  vMeniscus = surfaceMask * smoothstep(0.62, 1.0, edge);

  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorldPos = world.xyz;
  vNormalW = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
