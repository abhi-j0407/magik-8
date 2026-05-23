---
id: handoff-visual-v3
version: 1.0.0
status: active
current_phase: G2
webgl_flag: off (default until G9 sign-off)
deploy_url: null
---

# Handoff — Visual V3 ("3D Oracle") Live Status

> **Coordinator:** update this file at every phase boundary (see
> [`prompts/COORDINATOR-VISUAL-V3.md`](./prompts/COORDINATOR-VISUAL-V3.md) § Handoff-doc update protocol).
> **Implementers:** read only § Latest handoff + § Active locks + your row in
> [`PLAN-VISUAL-V3.md`](./PLAN-VISUAL-V3.md) §6.

## Latest handoff

```markdown
## Handoff — G1
**Status:** complete
**Agent:** G1 implementer
**Branch / PR:** phase/g1-foundation — https://github.com/abhi-j0407/magik-8/compare/main...phase/g1-foundation (PR pending: `gh auth login` then create/merge)
**Changed:**
- package.json / package-lock.json — pin three@0.184.0, R3F v9/v10, postprocessing v3, gsap 3.15.0
- src/components/OracleStage.tsx — VITE_WEBGL seam + Suspense/MagikBall fallback
- src/three/OracleScene.tsx — lazy Canvas placeholder sphere (phase spin/settle/idle)
- src/three/useWebglCapability.ts — WebGL probe, reduced-motion, low-power heuristic
- src/three/tokens.ts — CSS var → sRGB resolver for palette
- src/App.tsx — MagikBall → OracleStage
- vite.config.ts — workbox runtime cache for OracleScene/three chunks
**Verified:**
- `npx tsc -b` — exit 0
- `npm run build` — exit 0; lazy chunk `OracleScene-*.js` ~893 kB
- `npm test` — 8 files, 45 tests passed
- `npm run test:e2e` — 3 passed (flag off, no VITE_WEBGL)
- /code-review — self-review: no blockers; WebGL path lacks AnswerTriangle/ANIMATION_DONE until G5/G6
- visual — flag-off matches CSS ball; flag-on smoke: sphere reacts (manual VITE_WEBGL=true)
**Acceptance:** deps pinned on React 19.2.x peers; OracleStage + capability + lazy placeholder; flag OFF unchanged tests; workbox caches lazy chunk; tsc/build/test/e2e green
**Integration:** `OracleStage` exports default seam; lazy `import('../three/OracleScene')`; flag `VITE_WEBGL=true`; tokens via `resolveM8Color()`; G2 mounts Ball in `OracleScene`
**Next:** G2 — glossy MeshPhysicalMaterial ball + HDRI Environment + rim lights + ContactShadows + 8 disc
**Blockers:** none
**Notes for next agent:**
- Pinned: three 0.184.0, @react-three/fiber 9.6.1, @react-three/drei 10.7.7, @react-three/postprocessing 3.0.4, postprocessing 6.39.1, gsap 3.15.0
- Low-power: hardwareConcurrency ≤ 2 OR deviceMemory ≤ 2 GiB → CSS fallback
- Placeholder uses meshStandardMaterial + resolveM8Color('sphereCore'); no HDRI/post/GSAP yet
- VITE_WEBGL=true path does not dispatch ANIMATION_DONE — full ritual e2e still flag-off only until G5
- Build emits single lazy `OracleScene-*.js` (three bundled inside); workbox precache + runtime pattern
```

## Phase checklist

- [x] **G1** — Foundation & seam (deps, `OracleStage` flag + capability, lazy placeholder Canvas, CSS fallback)
- [ ] **G2** — The ball (glossy `MeshPhysicalMaterial`, HDRI `<Environment>`, key+rim lights, `<ContactShadows>`, "8" disc) — *fixes defect 2, 6*
- [ ] **G3** — Window mechanism (glass + cobalt liquid + d20 die + triangular answer face, settled) — *fixes defect 3, 5, 6*
- [ ] **G4** — Liquid & bob (animated surface shader, meniscus, shake-driven slosh)
- [ ] **G5** — Motion choreography (GSAP reveal + `<Float>` idle + "8"→window rotation; dispatch `ANIMATION_DONE`)
- [ ] **G6** — Text behind glass (die-face `Text`/`Text3D`, auto-fit/wrap, amber easter-egg) — *fixes defect 4*
- [ ] **G7** — Backdrop & post (mesh-gradient bg, Bloom/CA/Vignette/Noise) — *∥ after G2*
- [ ] **G8** — Chrome & integration (center modes, share-card WebGL capture, theme retint) — *fixes defect 1, ∥ after G1*
- [ ] **G9** — QA, perf, a11y (Lighthouse budget, AdaptiveDpr, fallback verify, e2e both paths) — *no deploy*

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| `src/three/Ball.tsx`, `Lighting.tsx`, `public/hdri/*` | G2 | G2 merged |
| `src/three/OracleScene.tsx` (mount Ball+Lighting) | G2 | G2 merged |

Shared-file rule: never two agents on `src/three/OracleScene.tsx`, `src/App.tsx`, or `src/index.css` at once.

## Stack (pinned versions — fill from G1)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 | r184 stable |
| `@react-three/fiber` | 9.6.1 | React 19.2.x peer OK |
| `@react-three/drei` | 10.7.7 | helpers |
| `@react-three/postprocessing` | 3.0.4 | effects (unused until G7) |
| `postprocessing` | 6.39.1 | peer |
| `gsap` | 3.15.0 | reveal timeline (unused until G5) |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Reveal concept | Ball rotates; idle "8" front → shake tumble → settle with answer window dead-center; reset rotates "8" back |
| Perf / a11y | Lazy WebGL (code-split, DPR-clamped, paused when hidden); CSS ball is the reduced-motion / low-power / no-WebGL fallback |
| Merge policy | Coordinator auto-merges each phase PR on green; pause for human only on a decision/conflict |
| Assets | One small bundled CC0 HDRI + procedural/tiny textures ("8", die faces, liquid normals); cached offline via workbox |
| State logic | `useOracleMachine` / `useShake` / `OracleContext` / answers — unchanged; V3 swaps render layer only |
| Deploy | Overseer-only; no agent runs Vercel CLI (per `DEPLOY-VERCEL.md`) |
| G1 low-power | `hardwareConcurrency <= 2` OR `deviceMemory <= 2` → CSS MagikBall |

## Verification gates

- **Per phase:** `tsc -b` · `npm run build` · `npm test` · `npm run test:e2e` · `/code-review` · PR opened.
- **Flag-off regression:** every phase keeps WebGL-flag-off behavior identical to today.
- **Final (G9):** `npm run test:lighthouse` ≥ target; reduced-motion + no-WebGL fallback verified; e2e
  green on both render paths; answer announced via `aria-live`; three.js chunks lazy-load + cache offline.

## QA results (fill as phases land)

| Check | Pass | Notes |
|-------|------|-------|
| Flag-off = today's behavior | yes | G1 — e2e 3/3, Vitest 45/45 |
| Ball separated from bg | — | G2 |
| Window centered on reveal | — | G3/G5 |
| Liquid sloshes / settles | — | G4 |
| Text behind glass, fits longest answer | — | G6 |
| Modes centered | — | G8 |
| Share PNG includes 3D ball | — | G8 |
| Lighthouse mobile | — | G9 |
| Reduced-motion / no-WebGL fallback | partial | G1 hook; full verify G9 |
| Lazy three chunk + workbox | yes | G1 — OracleScene-*.js precached + runtime rule |
