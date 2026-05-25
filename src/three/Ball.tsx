import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import type { Group, Mesh } from 'three';
import {
  BackSide,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  Spherical,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { useOracle } from '../context/OracleContext';
import type { OraclePhase } from '../types/oracle';
import { AnswerPanel } from './AnswerPanel';
import { ballCavityUniforms, ballSidesUniforms } from './ballFluidUniforms';
import {
  ballThemeMaterialSlots,
  resolveBallThemePalette,
  syncBallThemeOnMount,
} from './useBallThemeSpring';
import { useOracleChoreography } from './useOracleChoreography';

export const BALL_RADIUS = 1;

export { oracleSceneTime, oracleSceneTimeScale } from './oracleSceneClock';
import { oracleSceneTime, oracleSceneTimeScale } from './oracleSceneClock';

// https://github.com/yiwenl/glsl-fbm/blob/master/3d.glsl (cywarr index.html)
const CYWARR_FBM = `
#define NUM_OCTAVES 6

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
`;

function shiftSphereSurface(
  g: SphereGeometry,
  hole: boolean,
): void {
  const sectors = 5;
  const sph = new Spherical();
  const v3 = new Vector3();
  const n = new Vector3();
  for (let i = 0; i < g.attributes.position.count; i++) {
    v3.fromBufferAttribute(g.attributes.position, i);
    sph.setFromVector3(v3);
    const localTheta = (Math.abs(sph.theta) * sectors) / (Math.PI * 2);
    const localThetaMod = localTheta % 1;
    const phiShift = 1 - (Math.cos(localThetaMod * Math.PI * 2) * 0.5 + 0.5);
    let phiAspect = sph.phi / Math.PI;
    phiAspect = hole ? 1 - phiAspect : phiAspect;
    const phiVal = Math.pow(phiShift, 0.9) * 0.05 * phiAspect;
    sph.phi += hole ? -phiVal : phiVal;
    v3.setFromSpherical(sph);
    g.attributes.position.setXYZ(i, v3.x, v3.y, v3.z);
    n.copy(v3).normalize();
    g.attributes.normal.setXYZ(i, n.x, n.y, n.z);
  }
}

function buildSides(g: SphereGeometry): PlaneGeometry {
  const v3 = new Vector3();
  const segs = g.parameters.widthSegments;
  const pts: Vector3[] = new Array((segs + 1) * 2);
  for (let i = 0; i <= segs; i++) {
    v3.fromBufferAttribute(g.attributes.position, i);
    pts[i] = v3.clone().setLength(v3.length() * 0.9);
    pts[i + (segs + 1)] = v3.clone();
  }
  const sg = new PlaneGeometry(1, 1, segs, 1);
  sg.setFromPoints(pts);
  sg.computeVertexNormals();
  return sg;
}

function buildCywarrBallGeometry(R: number) {
  const g1 = new SphereGeometry(
    R,
    200,
    100,
    0,
    Math.PI * 2,
    Math.PI * 0.15,
    Math.PI * 0.85,
  );
  shiftSphereSurface(g1, true);
  const g2 = g1.clone();
  g2.scale(0.9, 0.9, 0.9);
  const g3 = buildSides(g1);
  const g4 = new SphereGeometry(R * 0.9975, 200, 25, 0, Math.PI * 2, 0, Math.PI * 0.15);
  return mergeGeometries([g1, g2, g3, g4], true);
}

type BallProps = {
  phase: OraclePhase;
  onAnimationDone: () => void;
  reducedMotion?: boolean;
};

const DIFFUSE_COLOR_LINE = 'vec4 diffuseColor = vec4( diffuse, opacity );';

export function Ball({ phase, onAnimationDone, reducedMotion = false }: BallProps) {
  const { result, packId } = useOracle();
  const jitterRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const cavityMatRef = useRef<MeshLambertMaterial | null>(null);
  const sidesMatRef = useRef<MeshBasicMaterial | null>(null);

  useOracleChoreography(jitterRef, {
    phase,
    result,
    onAnimationDone,
    reducedMotion,
  });

  const geometry = useMemo(() => buildCywarrBallGeometry(BALL_RADIUS), []);

  const materials = useMemo(() => {
    const theme = resolveBallThemePalette(packId);

    const shell = new MeshStandardMaterial({
      // Boosted indigo (cywarr recipe) — at metalness 1 this tints the env
      // reflection so the whole ball reads as one unified purple chrome.
      color: new Color('indigo').addScalar(0.75).multiplyScalar(0),
      roughness: 0.75,
      metalness: 1,
      envMapIntensity: 1.2,
    });
    shell.defines = { USE_UV: '' };
    shell.onBeforeCompile = (parameters) => {
      parameters.uniforms.time = oracleSceneTime;
      parameters.vertexShader = `
        varying vec3 vPos;
        ${parameters.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vPos = position;`,
      );
      parameters.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float time;
        varying vec3 vPos;
        ${CYWARR_FBM}
        ${parameters.fragmentShader}
      `.replace(
        '#include <roughnessmap_fragment>',
        `
        float roughnessFactor = roughness;

        vec2 v2d = normalize(vPos.xz) * 1.;
        vec3 nCoord = vPos + vec3(0, time, 0);

        float nd = clamp(fbm(nCoord) * 0.25, 0., 1.);
        nd = pow(nd, 0.5);
        float hFactor = vUv.y;
        nd = mix(0.25, nd, ss(0.4, 0.6, hFactor));
        nd = mix(nd, 0., ss(0.9, 1., hFactor));

        roughnessFactor *= clamp((nd * 0.8) + 0.2, 0., 1.);
        `,
      );
    };

    const cavity = new MeshLambertMaterial({
      color: new Color(theme.cavity),
      side: BackSide,
    });
    cavity.defines = { USE_UV: '' };
    cavity.onBeforeCompile = (parameters) => {
      parameters.uniforms.time = oracleSceneTime;
      parameters.uniforms.fluidColor = ballCavityUniforms.fluidColor;
      parameters.vertexShader = `
        varying vec3 vPos;
        ${parameters.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vPos = position;`,
      );
      parameters.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float time;
        uniform vec3 fluidColor;
        varying vec3 vPos;
        ${CYWARR_FBM}
        ${parameters.fragmentShader}
      `.replace(
        DIFFUSE_COLOR_LINE,
        `
        vec4 diffuseColor = vec4( fluidColor, opacity );
        {
          vec3 col = diffuseColor.rgb;
          float horizR = length(vPos.xz);
          float rim = ss(0.02, 0.14, horizR);
          col *= mix(1.06, 0.74, rim);
          float shimmer = fbm(vPos + vec3(0.0, time * 0.2, 0.0));
          col *= 1.0 + (shimmer - 0.5) * 0.06;
          diffuseColor.rgb = col;
        }
        `,
      );
    };
    cavityMatRef.current = cavity;

    // Unlit so the rim is always full-bright regardless of scene lighting
    // (cywarr's Lambert+full-white-ambient reads as effectively unlit). DoubleSide
    // so the thin bridging wall is never back-face culled at grazing hole angles.
    // White rim; the shader renders the woven thread valleys at col * 0.5,
    // giving a grey line shade automatically.
    const sides = new MeshBasicMaterial({
      color: new Color(theme.sides),
      side: DoubleSide,
    });
    sides.defines = { USE_UV: '' };
    sides.onBeforeCompile = (parameters) => {
      parameters.uniforms.fluidColor = ballSidesUniforms.fluidColor;
      parameters.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform vec3 fluidColor;
        ${parameters.fragmentShader}
      `.replace(
        DIFFUSE_COLOR_LINE,
        `
        vec4 diffuseColor = vec4( fluidColor, opacity );
        {
          vec3 col = diffuseColor.rgb;
          vec2 uv = vUv;
          vec2 wUv = uv - 0.5;
          wUv.y *= 5.;
          wUv.y += sin(uv.x * PI2 * 100.) * 0.1;
          float fw = length(fwidth(wUv * PI));
          float l = ss(fw, 0., abs(sin(wUv.y * PI)));
          col = mix(col * 0.5, col, l);
          diffuseColor.rgb = col;
        }
        `,
      );
    };
    sidesMatRef.current = sides;

    const lens = new MeshStandardMaterial({
      envMapIntensity: 2.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      metalness: 1,
      roughness: 0,
    });

    ballThemeMaterialSlots.cavity = cavity;
    ballThemeMaterialSlots.sides = sides;

    return [shell, cavity, sides, lens];
  }, []);

  useLayoutEffect(() => {
    const palette = resolveBallThemePalette(packId);
    ballCavityUniforms.fluidColor.value.set(palette.cavity);
    ballSidesUniforms.fluidColor.value.set(palette.sides);
    const cavityMat = cavityMatRef.current;
    const sidesMat = sidesMatRef.current;
    cavityMat?.color.set(palette.cavity);
    sidesMat?.color.set(palette.sides);
    // Bust program cache so onBeforeCompile re-binds fluidColor after pack change.
    if (cavityMat) cavityMat.needsUpdate = true;
    if (sidesMat) sidesMat.needsUpdate = true;
    syncBallThemeOnMount(packId, reducedMotion);
  }, [packId, reducedMotion]);

  useFrame((state) => {
    oracleSceneTime.value = state.clock.elapsedTime * oracleSceneTimeScale.value;
  });

  return (
    <group ref={jitterRef}>
      <mesh ref={meshRef} geometry={geometry} material={materials} renderOrder={9999} />
      <AnswerPanel />
    </group>
  );
}
