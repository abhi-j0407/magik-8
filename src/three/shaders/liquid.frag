precision mediump float;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormalW;
varying float vFill;
varying float vMeniscus;

uniform vec3 uColorDeep;
uniform vec3 uColorMid;
uniform vec3 uColorMeniscus;
uniform float uTime;
uniform float uSlosh;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - max(dot(normalize(vNormalW), viewDir), 0.0), 2.4);

  float depthMix = smoothstep(0.05, 0.92, vFill);
  vec3 base = mix(uColorDeep, uColorMid, depthMix * 0.72 + fresnel * 0.18);

  float spec = pow(fresnel, 5.0) * (0.22 + uSlosh * 0.12);
  float meniscusRing =
    vMeniscus *
    (0.65 + 0.35 * sin(uTime * 1.4 + vUv.x * 12.0)) *
    (0.4 + uSlosh * 0.55);
  vec3 meniscus = uColorMeniscus * meniscusRing;

  vec3 color = base + spec * uColorMeniscus + meniscus * 0.55;
  float alpha = 0.94 + fresnel * 0.04;

  gl_FragColor = vec4(color, alpha);
}
