import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { Group, Mesh, Texture } from 'three';
import {
  BackSide,
  Color,
  EquirectangularReflectionMapping,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  Spherical,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { useOracle } from '../context/OracleContext';
import type { OraclePhase } from '../types/oracle';
import { AnswerPanel } from './AnswerPanel';
import { ENV_MAP_PATH } from './Lighting';
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

export function Ball({ phase, onAnimationDone, reducedMotion = false }: BallProps) {
  const { result } = useOracle();
  const jitterRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const envTex = useLoader(TextureLoader, ENV_MAP_PATH) as Texture;

  useOracleChoreography(jitterRef, {
    phase,
    result,
    onAnimationDone,
    reducedMotion,
  });

  const geometry = useMemo(() => buildCywarrBallGeometry(BALL_RADIUS), []);

  useEffect(() => {
    envTex.colorSpace = SRGBColorSpace;
    envTex.mapping = EquirectangularReflectionMapping;
  }, [envTex]);

  const materials = useMemo(() => {
    const shell = new MeshStandardMaterial({
      envMap: envTex,
      color: new Color('indigo').addScalar(0.25).multiplyScalar(5),
      roughness: 0.75,
      metalness: 1,
    });
    shell.defines = { USE_UV: '' };
    shell.onBeforeCompile = (shader) => {
      shader.uniforms.time = oracleSceneTime;
      shader.vertexShader = `
        varying vec3 vPos;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vPos = position;`,
      );
      shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float time;
        varying vec3 vPos;
        ${CYWARR_FBM}
        ${shader.fragmentShader}
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
      color: 0x000088,
      side: BackSide,
    });

    const sides = new MeshLambertMaterial({
      color: 0xaa0000,
    });
    sides.defines = { USE_UV: '' };
    sides.onBeforeCompile = (shader) => {
      shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        #ifndef PI2
        #define PI2 6.28318530718
        #endif
        ${shader.fragmentShader}
      `.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
        vec3 col = diffuse;
        vec2 uv = vUv;

        vec2 wUv = uv - 0.5;
        wUv.y *= 5.;
        wUv.y += sin(uv.x * PI2 * 100.) * 0.04;
        float fw = length(fwidth(wUv * PI));
        float l = ss(fw, 0., abs(sin(wUv.y * PI)));

        col = mix(col * 0.5, col, l);

        vec4 diffuseColor = vec4( col, opacity );
        `,
      );
    };

    const lens = new MeshStandardMaterial({
      envMap: envTex,
      envMapIntensity: 10,
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      metalness: 1,
      roughness: 0,
    });

    return [shell, cavity, sides, lens];
  }, [envTex]);

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
