import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  Color,
  InstancedBufferAttribute,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
  type CanvasTexture,
} from 'three';

/** cywarr lens stack Y — 0.75 × ball radius (R=4 → 3.0; R=1 → 0.75). */
export const LENS_TOP_Y = 0.75;

/** cywarr panel edge — 3.2 on R=4 → 0.8 on R=1. */
export const ANSWER_PLANE_SIZE = 0.8;

/** cywarr step 0.05 on R=4 → 0.0125 on R=1. */
export const INK_STEP = 0.0125;

const INSTANCE_COUNT = 4;

const INK_FRAGMENT_REPLACE = `
vec4 diffuseColor = vec4( diffuse, opacity * ((vInstId / 3.) * 0.9 + 0.1) );

vec2 uv = (vUv - 0.5) * 6.;

float fw = length(fwidth(uv));

float fb = tri(uv, 3);
float b = 0.;
b = max(b, ss(1.1 - fw, 1.1, fb) - ss(1.2, 1.2 + fw, fb));

vec2 uv81 = uv - vec2(0., 0.5);
fb = tri(uv81, 60);
b = max(b, ss(0.25 - fw, 0.25, fb) - ss(0.45, 0.45 + fw, fb));

vec2 uv82 = uv + vec2(0., 0.25);
fb = tri(uv82, 60);
b = max(b, ss(0.3 - fw, 0.3, fb) - ss(0.5, 0.5 + fw, fb));

b *= baseVisibility;

vec3 col = vec3(0.);
vec3 inkDiffuse = diffuse;
if (isEasterEgg > 0.5) {
  inkDiffuse = mix(diffuse, vec3(1.0, 0.65, 0.18), 0.35);
}
col = mix(col, inkDiffuse, b);

vec4 phraseTex = texture2D(text, vUv);
float tx = phraseTex.a * textVisibility;
col = mix(col, phraseTex.rgb * vec3(1.0, 0.5, 0.0), tx);

float f = max(b, tx);

diffuseColor.rgb = col;
diffuseColor.a *= f;
`;

/** F4 tweens these refs — do not replace the object identity. */
export const answerPanelUniforms = {
  baseVisibility: { value: 1 },
  textVisibility: { value: 0 },
  text: { value: null as CanvasTexture | null },
  isEasterEgg: { value: 0 },
  /** Kept for F4 choreography API; text tint is cywarr orange in the fragment shader. */
  inkTextTint: { value: new Vector3(1, 0.5, 0) },
  setText(texture: CanvasTexture | null) {
    this.text.value = texture;
    if (texture) texture.needsUpdate = true;
  },
};

export function AnswerPanel() {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(ANSWER_PLANE_SIZE, ANSWER_PLANE_SIZE);
    g.rotateX(-Math.PI * 0.5);
    g.setAttribute('instId', new InstancedBufferAttribute(new Float32Array([0, 1, 2, 3]), 1));
    return g;
  }, []);

  const material = useMemo(() => {
    const mat = new MeshBasicMaterial({
      color: new Color(0, 0.5, 1),
      transparent: true,
      opacity: 0.9,
      blending: AdditiveBlending,
    });
    mat.defines = { USE_UV: '' };
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.baseVisibility = answerPanelUniforms.baseVisibility;
      shader.uniforms.textVisibility = answerPanelUniforms.textVisibility;
      shader.uniforms.text = answerPanelUniforms.text;
      shader.uniforms.isEasterEgg = answerPanelUniforms.isEasterEgg;

      shader.vertexShader = `
        attribute float instId;
        varying float vInstId;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vInstId = instId;`,
      );

      shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float baseVisibility;
        uniform float textVisibility;
        uniform sampler2D text;
        uniform float isEasterEgg;
        varying float vInstId;

        float tri(vec2 uv, int N){
          float Pi = 3.1415926;
          float Pi2 = Pi * 2.;
          float a = atan(uv.x, uv.y) + Pi;
          float r = Pi2 / float(N);
          return cos(floor(.5 + a / r) * r - a) * length(uv);
        }

        ${shader.fragmentShader}
      `.replace('vec4 diffuseColor = vec4( diffuse, opacity );', INK_FRAGMENT_REPLACE);
    };
    return mat;
  }, []);

  const meshRef = useRef<import('three').InstancedMesh>(null);
  const matrixScratch = useMemo(() => new Matrix4(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      matrixScratch.setPosition(0, LENS_TOP_Y - INK_STEP * (3 - i), 0);
      mesh.setMatrixAt(i, matrixScratch);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrixScratch]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, INSTANCE_COUNT]}
      renderOrder={9998}
    />
  );
}
