---
id: handoff-visual-v4-cywarr
version: 1.0.0
status: active
current_phase: F3
webgl_flag: off (user enables via VITE_WEBGL=true once F4 lands and visual QA passes)
deploy_url: null
---

# Handoff — Visual V4 ("cywarr Port") Live Status

> **Coordinator:** update this file at every phase boundary (see
> [`prompts/COORDINATOR-VISUAL-V4-CYWARR.md`](./prompts/COORDINATOR-VISUAL-V4-CYWARR.md) § Handoff-doc
> update protocol).
> **Implementers:** read only § Latest handoff + § Active locks + your row in
> [`PLAN-VISUAL-V4-CYWARR.md`](./PLAN-VISUAL-V4-CYWARR.md) § Fix plan.

## Latest handoff

```markdown
## Handoff — F2
**Status:** complete (squash-merged to main)
**Agent:** F2 implementer
**Branch / PR:** fix/v4-f2-cywarr-port — merged to main (ef356e4)
**Changed:**
- src/three/Ball.tsx — cywarr merged shell + FBM/sine shaders, oracleSceneTime export, no eight decal
- src/three/Lighting.tsx — ambient-only + ENV_MAP_PATH export
- src/three/Background.tsx — simplex-4D noise sky sphere + pack tint
- src/three/Effects.tsx — postprocessing removed (returns null)
- src/three/OracleScene.tsx — cywarr camera, OrbitControls, exposure 1.0
- src/three/shaders/gradient.{frag,vert} — deleted
- scripts/generate-eight-texture.mjs — deleted
**Verified:** tsc ✓ · build ✓ · test ✓ (59) · e2e ✓ (5) · coordinator re-check ✓ · flag-off regression ✓ · visual ✓ (webgl e2e)
**Acceptance:** F2 plan row — partial-sphere + lens cap, FBM shimmer, ambient + JPG env, noise backdrop, no directionals/post/Bloom, no eight decal, camera/controls per spec, group does not spin
**Integration:** oracleSceneTime in Ball.tsx ({ value: number }); F4 tweens timeScale on same ref. ENV_MAP_PATH from Lighting. OrbitControls when phase idle/answered. AnswerWindow still inside Ball until F3.
**Next:** F3 — Answer ink panel + stylised "8"
**Blockers:** none
**Notes for next agent:**
- Ball mesh static; choreography on hidden child group until F4
- Replace AnswerWindow with AnswerPanel; delete Die/Liquid/AnswerText
- isEightDiscVisible stays in useOracleChoreography until F4
- Export ink uniform singleton for F4 (baseVisibility, textVisibility, setText)
```

## Phase checklist

- [x] **F1** — Kill the Suspense fallback paths *(drop drei Environment + Text + transmission, error boundary, context-loss listener, relax capability probe, `renderingLocked` CSS prop)*
- [x] **F2** — cywarr ball geometry, camera, lighting, backdrop *(partial-sphere shell + lens cap, FBM shimmer, simplex-noise sky, ambient + equirect JPG)*
- [ ] **F3** — Answer ink panel + stylised "8" *(4 instanced quads, triangle + 2 rings SDF, CanvasTexture phrase atlas, easter-egg amber)*
- [ ] **F4** — Opacity reveal choreography *(no rotation; baseVisibility + textVisibility tweens; timeScale shake)*
- [ ] **F5** — Deletes, deps, verification, docs *(remove postprocessing if unused, DPR cap, e2e + lighthouse, supersede V3 docs)*

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| `src/three/answerAtlas.ts` + `.test.ts` (new) | F3 | F3 merged |
| `src/three/AnswerPanel.tsx` (new) | F3 | F3 merged |
| `src/three/AnswerWindow.tsx`, `Die.tsx`, `Liquid.tsx`, `AnswerText.tsx` (delete) | F3 | F3 merged |
| `src/three/shaders/liquid.{frag,vert}`, `answerText.test.ts` (delete) | F3 | F3 merged |
| `src/three/OracleScene.tsx` (wire panel; Ball.tsx mount only if required) | F3 | F3 merged |

Shared-file rule: never two agents on `src/three/OracleScene.tsx`, `src/components/OracleStage.tsx`,
`src/components/MagikBall.tsx`, `vite.config.ts`, `src/index.css`, or any single `src/three/*` file at
once. Coordinator records ownership before spawning each phase.

## Stack (will be pinned during F1 / F5)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 (current) | Confirmed F2 — BufferGeometryUtils.mergeGeometries |
| `@react-three/fiber` | 9.6.1 (current) | Stays — required for `<Canvas>` |
| `@react-three/drei` | 10.7.7 (current) | Trimmed: only `AdaptiveDpr`, `ContactShadows`, optional `OrbitControls` |
| `@react-three/postprocessing` | 3.0.4 (current) | **Removed in F5** if Effects.tsx no longer uses it |
| `postprocessing` | 6.39.1 (current) | **Removed in F5** alongside the above |
| `gsap` | 3.15.0 (current) | Stays — F4 reveal tweens use it |
| `troika-three-text` | (via drei) | **Indirectly removed** when drei `Text` is dropped in F1/F3 |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Target aesthetic | cywarr/Magic8Ball — direct port modulo our colour tokens |
| Reveal language | Opacity tweens on shader uniforms; **no** ball rotation |
| "8" decal | Deleted — implicit in the ink panel's two rings |
| Camera | fov 60 at `(0, 1, 0.375).setLength(3.75)`; OrbitControls optional, idle-only |
| Env map | Bundled equirect JPG `public/env/studio.jpg` (~80 KB); PMREM-from-scene is the fallback |
| Lighting | One `<ambientLight intensity={1.0} />`; no directionals |
| Postprocessing | Off by default; CSS grain + vignette keep the 2000s overlay |
| CSG / clip-plane | Not used by default; reserved as future option if the shell reads "too open" |
| Reveal duration | `REVEAL_MS = 600 ms` (300 + 300 split); easy to tune later |
| WebGL gating | `VITE_WEBGL` stays unset/false in prod until user flips it after F4 |

## Verification gates

- **Per phase:** `tsc -b` · `npm run build` · `npm test` · `npm run test:e2e` · `/code-review` · PR opened.
- **Flag-off regression:** every phase keeps WebGL-flag-off behaviour identical to today.
- **Flag-on after F4:** manual run (`VITE_WEBGL=true npm run dev`) — tap-shake-reveal-reset cycle, no CSS flash, ink panel + lens look right.
- **Final (F5):** `npm run test:lighthouse` ≥ target; aria-live announcement on both paths; three.js chunks lazy-load + cache offline.

## QA results (fill as phases land)

| Check | Pass | Notes |
|-------|------|-------|
| Flag-off = today's behaviour | ✓ | F1 coordinator re-check |
| 3D canvas never replaced by CSS during reveal | partial | F1 webgl e2e green; F5 strengthens assertion |
| Ball reads as deep glossy 8-ball, not chrome | ✓ | F2 coordinator re-check + implementer visual |
| Ink panel renders triangle + "8" rings + answer text inside lens | — | F3 acceptance |
| Reveal = opacity fade (no rotation), `ANIMATION_DONE` dispatched | — | F4 acceptance |
| `OracleErrorBoundary` swaps to CSS on runtime error | ✓ | F1 shipped |
| Easter-egg amber tint visible | — | F3 acceptance |
| Lighthouse mobile (flag-off) | — | F5 |
| Reduced-motion / no-WebGL fallback | — | F5 manual |
| Lazy three chunk + workbox precache | — | F5 |

## webgl_flag sign-off

**Recommendation (until F4 + F5 land):** keep `VITE_WEBGL` unset in prod. Flip to `true` after the user
has manually verified the flag-on path on real devices. The CSS ball remains the default until then.

## V3 supersession

This V4 plan replaces the V3 render layer entirely:

- `MeshTransmissionMaterial` glass → cywarr lens cap (`MeshStandard transparent opacity:0.25`).
- d20 die with surfacing animation → ink panel of 4 instanced quads.
- Sloshing liquid → none (the cywarr ball has no liquid sim).
- Rotate-to-reveal → opacity-tween reveal.
- HDRI Environment → bundled equirect JPG (or PMREM-from-scene fallback).
- drei `Text` → CanvasTexture phrase atlas.
- "8" decal → implicit in the ink panel's two rings.

F5 marks [`docs/PLAN-VISUAL-V3.md`](./PLAN-VISUAL-V3.md) and [`docs/HANDOFF-VISUAL-V3.md`](./HANDOFF-VISUAL-V3.md) as superseded.
