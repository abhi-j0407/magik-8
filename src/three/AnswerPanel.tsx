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
import { useOracle } from '../context/OracleContext';
import { resolveM8Color } from './tokens';

/** cywarr lens stack Y — 0.75 × ball radius (R=4 → 3.0; R=1 → 0.75). */
export const LENS_TOP_Y = 0.75;

const INK_STEP = 0.05;
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
col = mix(col, phraseTex.rgb * inkTextTint, tx);

float f = max(b, tx);

diffuseColor.rgb = col;
diffuseColor.a *= f;
`;

function cssColorToVec3(css: string, target: Vector3): Vector3 {
  const c = new Color(css);
  return target.set(c.r, c.g, c.b);
}

/** F4 tweens these refs — do not replace the object identity. */
export const answerPanelUniforms = {
  baseVisibility: { value: 1 },
  textVisibility: { value: 0 },
  text: { value: null as CanvasTexture | null },
  isEasterEgg: { value: 0 },
  inkTextTint: { value: new Vector3(0.95, 0.95, 0.93) },
  setText(texture: CanvasTexture | null) {
    this.text.value = texture;
    if (texture) texture.needsUpdate = true;
  },
};

export function AnswerPanel() {
  const { packId } = useOracle();

  const geometry = useMemo(() => {
    const g = new PlaneGeometry(0.4, 0.4);
    g.rotateX(-Math.PI * 0.5);
    g.setAttribute('instId', new InstancedBufferAttribute(new Float32Array([0, 1, 2, 3]), 1));
    return g;
  }, []);

  const material = useMemo(() => {
    const inkColor = new Color(resolveM8Color('fluidHi'));
    const mat = new MeshBasicMaterial({
      color: inkColor,
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
      shader.uniforms.inkTextTint = answerPanelUniforms.inkTextTint;

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
        uniform vec3 inkTextTint;
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
  }, [packId]);

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

  useEffect(() => {
    cssColorToVec3(resolveM8Color('answerInk'), answerPanelUniforms.inkTextTint.value);
  }, [packId]);

  useEffect(() => {
    material.color.set(resolveM8Color('fluidHi'));
  }, [material, packId]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, INSTANCE_COUNT]}
      renderOrder={9998}
    />
  );
}
