precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform vec3 uColorBg;
uniform vec3 uColorDeep;
uniform vec3 uColorMid;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float t = uTime * 0.07;

  vec2 b1 = vec2(0.28 + sin(t * 0.62) * 0.14, 0.38 + cos(t * 0.48) * 0.11);
  vec2 b2 = vec2(-0.32 + cos(t * 0.55) * 0.16, -0.18 + sin(t * 0.72) * 0.13);
  vec2 b3 = vec2(0.06 + sin(t * 0.85 + 1.2) * 0.18, -0.42 + cos(t * 0.5) * 0.1);
  vec2 b4 = vec2(-0.08 + cos(t * 0.4 + 0.5) * 0.12, 0.52 + sin(t * 0.38) * 0.09);

  float w1 = smoothstep(0.88, 0.22, length(p - b1));
  float w2 = smoothstep(0.92, 0.26, length(p - b2));
  float w3 = smoothstep(0.95, 0.28, length(p - b3));
  float w4 = smoothstep(0.9, 0.24, length(p - b4));

  vec3 col = uColorBg;
  col = mix(col, uColorDeep, w1 * 0.32);
  col = mix(col, uColorMid, w2 * 0.14);
  col = mix(col, uColorDeep * 0.92, w3 * 0.2);
  col = mix(col, uColorDeep * 0.75, w4 * 0.12);

  float edge = length(p) * 0.42;
  col *= 1.0 - edge * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
