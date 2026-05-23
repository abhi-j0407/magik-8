---
id: plan-visual-v3
version: 1.0.0
status: active
supersedes_render_layer: DESIGN-V2 (CSS ball + SVG triangle)
---

# Plan — Visual V3 ("3D Oracle")

> **Audience:** the **Coordinator** ([`prompts/COORDINATOR-VISUAL-V3.md`](./prompts/COORDINATOR-VISUAL-V3.md))
> and the **phase implementer** sub-agents it spawns. This is the single source of truth for the V3
> visual upgrade. The phase table (§6) is the source of deliverables, acceptance, owned files, and
> locks. The canonical 3D spec (§5) holds the exact material params, motion timings, and token
> mapping every implementer copies into code.
>
> **Read order for a new agent:** [`README.md`](./README.md) → [`HANDOFF-VISUAL-V3.md`](./HANDOFF-VISUAL-V3.md) → this file (your phase row + §5).

---

## 1. Context — what we are fixing

Functionality and the first design (DESIGN-V2) shipped and are stable. The ball is currently a
**DOM/CSS gradient sphere** ([`src/components/MagikBall.tsx`](../src/components/MagikBall.tsx)) with an
**SVG triangle** ([`src/components/AnswerTriangle.tsx`](../src/components/AnswerTriangle.tsx)). It works
but reads low-fidelity. Six defects + one goal:

| # | Defect | Root cause | V3 fix |
|---|--------|-----------|--------|
| 1 | Mode (theme) options not centered | 2D layout bug | center in chrome phase (G8) |
| 2 | Ball blends into background | flat gradient, no light separation | env-map reflections + rim light + `ContactShadows` (G2) |
| 3 | Triangle sits low | hard-coded SVG position | window centered when the ball settles (G3/G5) |
| 4 | Triangle doesn't fit text | fixed SVG box | text mesh lives on the die face, auto-fit/wrap (G6) |
| 5 | Idle: triangle covers the "8" | both drawn on one plane | idle = die sunk + window faces away; only "8" shows (G3/G5) |
| 6 | Oval shadow over triangle looks bad | blurred CSS ellipse | real glass refraction + `ContactShadows` (G3/G2) |

**Goal:** graphically stimulating, realistic, "video-game" quality while keeping the early-2000s vibe —
a real ball that shakes, real light interaction, a moving blurred gradient backdrop, a triangle that
**wraps around the ball as it rotates**, liquid that **bobs** inside the window, and answer text that
reads as if it's **behind glass**, not an overlay.

**Why 3D:** every defect is a symptom of faking a 3D mechanism in 2D. A real Magic-8-Ball is a **d20
die floating in dark-blue alcohol that surfaces to a window**. Modelling that mechanism in WebGL fixes
the defects structurally instead of patching CSS.

---

## 2. Locked decisions (do not relitigate)

| Decision | Value |
|----------|-------|
| **Reveal concept** | Ball **rotates**. Idle = white "8" disc faces the user. Shake = chaotic tumble. Reveal = ball settles with the **answer window rotated to dead-center**, triangular die-face pressed to the glass. Reset = rotates "8" back. |
| **Perf / a11y** | **Lazy-loaded WebGL** (code-split, DPR-clamped, paused when tab hidden). The existing CSS ball **stays as the fallback** for `prefers-reduced-motion`, low-power/no-WebGL. |
| **Merge policy** | **Coordinator auto-merges** each phase PR once CI is green. Pauses for the human only on a real decision or merge conflict. |
| **Assets** | One **small bundled CC0 HDRI** (or baked cubemap) for reflections; "8", die faces, liquid normals **procedural / tiny textures**. Must cache offline via existing workbox config. |
| **State logic** | `useOracleMachine`, `useShake`, `OracleContext`, audio, haptics, themes, answers — **unchanged**. V3 swaps only the render layer. |
| **Deploy** | Overseer-only (unchanged policy). No agent runs Vercel CLI. |

---

## 3. Architecture — the integration seam

State is already fully decoupled from rendering:
[`useOracleMachine.ts`](../src/hooks/useOracleMachine.ts) (`idle → shaking → revealing → answered`),
[`useShake.ts`](../src/hooks/useShake.ts) (device motion + tap/Space), `OracleContext`. **None of it
changes.** Introduce one seam component that chooses the renderer:

```
OracleStage (new)
 ├─ webglEnabled && capable && !reducedMotion → <Suspense fallback={<MagikBall/>}><OracleScene/></Suspense>
 └─ else                                       → <MagikBall />   (existing CSS ball, untouched)
```

- `OracleScene` consumes the **same** `OracleContext` phase + answer the CSS ball consumes.
- The reveal-complete signal currently dispatched by `AnswerTriangle` (`ANIMATION_DONE` at the end of
  the ~600 ms fill) **must still be dispatched** by the 3D choreography at the equivalent moment, or
  the machine never reaches `answered`. Preserve this contract (see G5).
- `aria-live` answer announcement must remain (accessibility + e2e). Keep a visually-hidden live region
  fed by the answer text regardless of renderer.

---

## 4. Stack additions

Current: React 19.1 · TS 5.8 · Vite 6.3 · Tailwind v4 · `motion/react` v12 · `vite-plugin-pwa`/workbox ·
Vitest · Playwright · Lighthouse script.

Add (G1 verifies exact peer-compatible versions for **React 19 / fiber v9** before pinning):

| Package | Target | Use |
|---------|--------|-----|
| `three` | latest stable (~r17x) | core |
| `@react-three/fiber` | `^9` | React 19 renderer |
| `@react-three/drei` | `^10` | `Environment`, `Float`, `MeshTransmissionMaterial`, `ContactShadows`, `useTexture`, `Text`/`Text3D`, `AdaptiveDpr`, `Preload`, `Bvh` |
| `@react-three/postprocessing` + `postprocessing` | `^3` | `Bloom`, `ChromaticAberration`, `Vignette`, `Noise` |
| `gsap` | latest | reveal/settle timeline orchestration |

`motion/react` stays for 2D chrome. Idle bob via drei `<Float>`; per-frame damping via `useFrame` +
`maath` (or hand-rolled lerp). **G1 must confirm fiber v9 + drei v10 + postprocessing v3 resolve on
React 19** and adjust majors if the registry differs — record the pinned versions in its handoff.

---

## 5. Canonical 3D spec (implementers copy these values)

### 5.1 Scene anatomy
- **Ball body** — `THREE.SphereGeometry` (64+ segments). `MeshPhysicalMaterial`.
- **"8" disc** — white circular feature on the **front (+Z)** hemisphere; Arial-Black/Helvetica "8".
  Procedural canvas texture or a small PNG decal; sits slightly proud, embossed.
- **Answer window** — a circular recess on a **second face** (e.g. local +Y/-Z, opposite-ish the "8"),
  containing front-to-back: glass disc → liquid volume → the d20 die's surfacing triangular face.
- **Die** — `THREE.IcosahedronGeometry`; the face that surfaces carries the **answer text mesh**.
- **Ground** — drei `<ContactShadows>` (soft, blurred) — replaces the bad CSS oval.

### 5.2 Materials (exact starting params — tune within ±20%)
```
Ball  MeshPhysicalMaterial:
  color: from --m8-sphere-core  (oklch 9% 0.004 270 → near-black)
  roughness: 0.10   metalness: 0.0   clearcoat: 1.0   clearcoatRoughness: 0.03
  envMapIntensity: 1.2   (reflections from <Environment>)

Glass  <MeshTransmissionMaterial> (drei):
  transmission: 1   roughness: 0.06   thickness: 0.8   ior: 1.45
  chromaticAberration: 0.03   distortion: 0.1   distortionScale: 0.2   temporalDistortion: 0.1
  samples: 6   resolution: 512   backside: true
  // tint via `color` toward --m8-fluid-deep for "looking into ink"

Liquid  custom ShaderMaterial / animated normal map (G4):
  base color: --m8-fluid-deep  oklch(18% 0.150 262)
  mid:        --m8-fluid-mid   oklch(30% 0.170 258)
  meniscus highlight: --m8-fluid-meniscus  oklch(72% 0.110 240)

Die face text (G6):  --m8-answer-ink oklch(95% 0.014 92); easter-egg → --m8-amber oklch(78% 0.135 78)
```

### 5.3 Token mapping (reuse, do not invent colors)
Existing CSS vars in [`src/index.css`](../src/index.css) remain the palette source. Read them at
runtime (or mirror as JS constants in `src/three/tokens.ts`) so theme switching + the CSS fallback stay
in sync: `--m8-sphere-rim/core/mid/hi/spec/warm`, `--m8-stripe`, `--m8-eight`,
`--m8-fluid-deep/mid/hi/meniscus`, `--m8-answer-ink`, `--m8-answer-glow`, `--m8-amber`, `--m8-bg`.

### 5.4 Lighting
- drei `<Environment>` with the **bundled HDRI** under `public/hdri/` (G2 adds it) → reflections + ambient.
- **Key light** upper-left (matches the current specular hot-spot direction).
- **Rim/back light** → bright edge that separates the ball from the dark backdrop (**defect 2**).
- `ToneMapping`: ACES Filmic; `outputColorSpace` sRGB.

### 5.5 Postprocessing (G7 — tasteful, not noisy)
`<EffectComposer>` → `Bloom` (`luminanceThreshold ≈ 0.9`, low `intensity`, selective — lift only spec +
text-glow colors above 1.0) · `ChromaticAberration` (`offset ≈ [0.0006, 0.0006]`) · `Vignette`
(`darkness ≈ 0.5`) · `Noise` (`opacity ≈ 0.04`, or keep the existing CSS grain and skip here — pick one
grain source, don't double).

### 5.6 Motion timings (map to oracle phases; honor `useReducedMotion`)
| Phase | Ball | Window/die | Notes |
|-------|------|-----------|-------|
| `idle` | slow `<Float>` bob (~4 s loop, small) + "8" toward user | die sunk, window away | "8" only |
| `shaking` | chaotic tumble ~**400 ms** (matches THRESHOLD timer) | liquid sloshes hard | random axis spin |
| `revealing` | GSAP rotates window to **dead-center**, eases to settle ~**600 ms** | die surfaces, presses glass | dispatch `ANIMATION_DONE` at end |
| `answered` | settled, micro-bob | text legible, liquid calm | answer announced via `aria-live` |
| RESET | rotate "8" back to front | die sinks | back to `idle` |

**Reduced-motion / fallback:** the CSS `MagikBall` handles those users. If WebGL is forced on with
reduced-motion, shorten/skip tumble — never invent motion.

### 5.7 Theme packs
Theme switch retints **liquid color + lighting accent** only (classic cobalt / career / party), read
from the same tokens. Ball + glass unchanged.

---

## 6. Phases

Branch per phase `phase/g{N}-<slug>`; one PR per phase; coordinator auto-merges on green. All `src/three/*`
files are new unless noted.

### G1 — Foundation & seam
- **Deliver:** install + pin deps (verify React-19 compat, record versions); `OracleStage` feature
  flag + `useWebglCapability` (WebGL test + `prefers-reduced-motion` + optional low-power heuristic);
  lazy `OracleScene` `<Canvas>` rendering a **placeholder sphere** that reacts to `OracleContext` phase;
  CSS `MagikBall` fallback wired via Suspense; workbox globs updated so three.js chunks cache offline.
- **Files:** new `src/components/OracleStage.tsx`, `src/three/OracleScene.tsx`,
  `src/three/useWebglCapability.ts`, `src/three/tokens.ts`; edit `src/App.tsx` (swap `MagikBall`→`OracleStage`),
  `vite.config.ts` (workbox `globPatterns`/runtime caching for chunks).
- **Accept:** `tsc -b`+build+test+e2e green; **flag OFF ⇒ identical to today** (CSS ball, all existing
  tests pass); flag ON ⇒ placeholder sphere reacts to tap/shake; pinned versions in handoff.

### G2 — The ball *(after G1)*
- **Deliver:** glossy `MeshPhysicalMaterial` sphere per §5.2; bundled HDRI `<Environment>`; key + **rim**
  lights; `<ContactShadows>`; the "8" disc decal. Fixes **defect 2 + 6 (oval)**.
- **Files:** `src/three/Ball.tsx`, `src/three/Lighting.tsx`, `public/hdri/*`, asset-gen note/script;
  edit `OracleScene.tsx` (mount Ball+Lighting).
- **Accept:** ball clearly separated from bg; reflections track the light; "8" crisp & embossed; ≥50 fps desktop.

### G3 — Window mechanism *(after G2)*
- **Deliver:** `MeshTransmissionMaterial` glass disc + cobalt liquid volume + icosahedron die with a
  triangular answer face, in the **settled** (static) position. Fixes **defects 3, 5, 6** structurally.
- **Files:** `src/three/AnswerWindow.tsx`, `src/three/Die.tsx`; edit `OracleScene.tsx`.
- **Accept:** window dead-center when settled; die face fills the window; no overlay/oval; "8" and window
  on different faces; idle shows only "8".

### G4 — Liquid & bob *(after G3)*
- **Deliver:** animated liquid surface (custom `ShaderMaterial` / animated normal map) per §5.2, meniscus,
  slosh that scales with shake intensity. The "liquid bob."
- **Files:** `src/three/Liquid.tsx`, `src/three/shaders/liquid.vert|frag` (or `.glsl`); edit `AnswerWindow.tsx`.
- **Accept:** sloshes on shake, settles on reveal; reads as fluid behind glass; no fps cliff on mid mobile.

### G5 — Motion choreography *(after G4)*
- **Deliver:** GSAP reveal timeline + drei `<Float>` idle + `useFrame` damping mapped to all phases per
  §5.6, incl. **"8"→window rotation** and realistic shake. **Dispatch `ANIMATION_DONE`** at reveal end
  so the machine reaches `answered`.
- **Files:** `src/three/useOracleChoreography.ts`; edit `OracleScene.tsx`, `Ball.tsx`, `Die.tsx`.
- **Accept:** each phase visually distinct & physical; rotation feels like a real ball; reduced-motion
  path shortens; machine reaches `answered`; e2e reveal still passes.

### G6 — Text behind glass *(after G5)*
- **Deliver:** answer text on the die face (drei `Text`/`Text3D`) **refracted by the glass**; auto-fit +
  wrap for the longest answer; easter-egg amber; legibility pass. Fixes **defect 4 + "behind glass"**.
- **Files:** `src/three/AnswerText.tsx`; edit `Die.tsx`, `AnswerWindow.tsx`.
- **Accept:** longest answer in [`src/data/answers.ts`](../src/data/answers.ts) fits & wraps; text reads
  as *inside* the glass; amber path works; readable on mobile.

### G7 — Backdrop & post *(∥ may start after G2)*
- **Deliver:** animated blurred mesh-gradient backdrop (full-screen shader plane, dark cobalt/black, slow
  drift); `EffectComposer` per §5.5; composite with existing grain/vignette (one grain source). The
  "video-game vibe."
- **Files:** `src/three/Background.tsx`, `src/three/Effects.tsx`, `src/three/shaders/gradient.*`; edit
  `OracleScene.tsx`. **Do not touch** Ball/Window/Die internals (G2–G6 own those).
- **Accept:** bg drifts subtly, stays dark so the ball pops; effects tasteful; 2000s overlays intact; fps held.

### G8 — Chrome & integration *(∥ may start after G1)*
- **Deliver:** **center the mode/theme options (defect 1)**; align Wordmark/HUD/ShareCTA with the new
  visuals; **share-card capture from the WebGL canvas** (current [`src/lib/shareExport.ts`](../src/lib/shareExport.ts)
  uses html-to-image — handle WebGL: `preserveDrawingBuffer` or `gl.readPixels`/`toDataURL` composite);
  theme-pack retint of liquid + lighting.
- **Files:** `src/components/ThemeChips.tsx`, `src/lib/shareExport.ts`, `src/components/ShareCard.tsx`,
  theme wiring. **Avoid** `src/three/*` files owned by active phases.
- **Accept:** modes centered at all breakpoints; share PNG includes the 3D ball; theme switch retints liquid.

### G9 — QA, perf, a11y *(after all)*
- **Deliver:** Lighthouse budget tuning, `<AdaptiveDpr>`/DPR clamp, mobile-GPU notes, verify
  reduced-motion + no-WebGL fallback, Playwright/Vitest updates for both render paths, confirm `aria-live`
  answer announcement. **No deploy.**
- **Files:** `tests/*`, `scripts/lighthouse.mjs` thresholds, perf tweaks in `OracleScene.tsx`.
- **Accept:** Lighthouse ≥ target (record numbers); fallback verified; e2e green on both paths; answer
  announced to AT; chunks lazy-load + cache offline.

---

## 7. Dependency graph & locks

```
G1 ──┬─> G2 ──> G3 ──> G4 ──> G5 ──> G6 ──┐
     │         └────────> G7 (∥ after G2) ├─> G9
     └─> G8 (∥ after G1) ─────────────────┘
```
- **Critical path:** G1→G2→G3→G4→G5→G6→G9.
- **Never two agents** on `src/three/OracleScene.tsx`, `src/App.tsx`, or `src/index.css` at once.
- G7 owns backdrop/effects only; G8 owns chrome/share/theme only — neither edits Ball/Window/Die/Liquid.
- Coordinator records active file ownership in `HANDOFF-VISUAL-V3.md` § Active locks before spawning.

## 8. Risk register

| Risk | Mitigation |
|------|------------|
| fiber v9 / drei v10 peer mismatch on React 19 | G1 verifies + pins; record versions; fall back to compatible majors |
| Bundle weight hurts Lighthouse | code-split Canvas (lazy); DPR clamp; `AdaptiveDpr`; G9 budget gate |
| `MeshTransmissionMaterial` cost on mobile | low `samples`/`resolution`; G4/G9 perf pass; fallback path for low-power |
| Machine never reaches `answered` | G5 must dispatch `ANIMATION_DONE` (preserve `AnswerTriangle` contract) |
| Share capture blank (WebGL canvas) | G8 `preserveDrawingBuffer` / readback composite; test PNG output |
| Two agents collide on a file | enforce § Active locks; coordinator sequences edits to shared files |
| Reduced-motion / a11y regression | CSS fallback retained; `aria-live` preserved; G9 verifies both paths |

## 9. Verification (each phase + final)

- **Per phase (implementer):** `tsc -b` · `npm run build` · `npm test` · `npm run test:e2e` · self-review
  (`/code-review`) · open PR via `gh`.
- **Flag-off regression:** WebGL flag off ⇒ today's behavior exactly; existing suites pass unchanged.
- **Flag-on:** `npm run dev:https` → idle float, tap/shake tumble, rotate-to-center reveal, behind-glass
  text, theme retint, share PNG with the 3D ball.
- **Fallback:** `prefers-reduced-motion` + forced no-WebGL ⇒ CSS ball; answer announced via `aria-live`.
- **Budget (G9):** `npm run test:lighthouse` meets threshold; chunks lazy-load + cached offline.

## 10. Conventions (match existing repo)

- **Branch:** `phase/g{N}-<slug>` (e.g. `phase/g2-ball`). `main` stays deployable.
- **PR:** one per phase, opened with `gh pr create`; body links the phase + acceptance checklist.
- **Commits:** `[Type]: [what]` (e.g. `Add: glossy MeshPhysicalMaterial ball + rim lighting`).
- **No deploy by agents.** No `--no-verify`. No force-push to `main`. Stage specific files.
- **Handoff block** (returned by every implementer, copied into `HANDOFF-VISUAL-V3.md`) — see
  [`prompts/COORDINATOR-VISUAL-V3.md`](./prompts/COORDINATOR-VISUAL-V3.md) § Handoff template.
