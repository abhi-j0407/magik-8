---
id: handoff-visual-v3
version: 1.0.0
status: active
current_phase: G9
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
## Handoff — G8
**Status:** complete
**Agent:** G8 implementer
**Branch / PR:** merged to `main` @ 6198afe (squash; remote `phase/g8-chrome` deleted)
**Changed:**
- ThemeChips centered; shareExport WebGL composite; ShareCard ball slot; PACK_FLUID_ACCENTS
- Background/Liquid/Lighting pack retint; OracleScene preserveDrawingBuffer + data-m8-oracle-canvas
**Verified:** tsc ✓ · build ✓ · test ✓ (53) · e2e ✓ (3) · /code-review ✓ · visual ✓ (manual WebGL share PNG)
**Acceptance:** defect 1 centered chips; share composites 3D ball when WebGL on; theme retint; flag-off unchanged
**Integration:** captureShareCardForExport(node); PACK_FLUID_ACCENTS in tokens.ts; preserveDrawingBuffer on Canvas
**Next:** G9 — Lighthouse, AdaptiveDpr, dual-path e2e, fallback verify, workbox hdr/fonts
**Blockers:** none
**Notes for next agent:**
- Manual verify share PNG with VITE_WEBGL=true
- Gate preserveDrawingBuffer if perf regresses
- Oswald self-host + workbox .hdr for offline
```

## Phase checklist

- [x] **G1** — Foundation & seam (deps, `OracleStage` flag + capability, lazy placeholder Canvas, CSS fallback)
- [x] **G2** — The ball (glossy `MeshPhysicalMaterial`, HDRI `<Environment>`, key+rim lights, `<ContactShadows>`, "8" disc) — *fixes defect 2, 6*
- [x] **G3** — Window mechanism (glass + cobalt liquid + d20 die + triangular answer face, settled) — *fixes defect 3, 5, 6*
- [x] **G4** — Liquid & bob (animated surface shader, meniscus, shake-driven slosh)
- [x] **G5** — Motion choreography (GSAP reveal + `<Float>` idle + "8"→window rotation; dispatch `ANIMATION_DONE`)
- [x] **G6** — Text behind glass (die-face `Text`/`Text3D`, auto-fit/wrap, amber easter-egg) — *fixes defect 4*
- [x] **G7** — Backdrop & post (mesh-gradient bg, Bloom/CA/Vignette/Noise) — *∥ after G2*
- [x] **G8** — Chrome & integration (center modes, share-card WebGL capture, theme retint) — *fixes defect 1, ∥ after G1*
- [ ] **G9** — QA, perf, a11y (Lighthouse budget, AdaptiveDpr, fallback verify, e2e both paths) — *no deploy*

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| `e2e/*`, `scripts/lighthouse.mjs`, `OracleScene.tsx` (perf/a11y) | G9 | G9 merged |
| `vite.config.ts` (workbox .hdr / fonts) | G9 | G9 merged |
| `public/fonts/*` (Oswald self-host) | G9 | G9 merged |

Shared-file rule: never two agents on `src/three/OracleScene.tsx`, `src/App.tsx`, or `src/index.css` at once.

## Stack (pinned versions — fill from G1)

| Package | Pinned | Notes |
|---------|--------|-------|
| `three` | 0.184.0 | r184 stable |
| `@react-three/fiber` | 9.6.1 | React 19.2.x peer OK |
| `@react-three/drei` | 10.7.7 | helpers + AdaptiveDpr |
| `@react-three/postprocessing` | 3.0.4 | G7 effects |
| `postprocessing` | 6.39.1 | peer |
| `gsap` | 3.15.0 | G5 choreography |

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
| G3 window pose | Recess −Z; ROT_SETTLED πY faces camera; visible only revealing/answered |
| G7 grain | CSS `.m8-grain` canonical; post Noise skipped |
| G8 share | captureShareCardForExport; preserveDrawingBuffer when WebGL on |

## Verification gates

- **Per phase:** `tsc -b` · `npm run build` · `npm test` · `npm run test:e2e` · `/code-review` · PR opened.
- **Flag-off regression:** every phase keeps WebGL-flag-off behavior identical to today.
- **Final (G9):** `npm run test:lighthouse` ≥ target; reduced-motion + no-WebGL fallback verified; e2e
  green on both paths; answer announced via `aria-live`; three.js chunks lazy-load + cache offline.

## QA results (fill as phases land)

| Check | Pass | Notes |
|-------|------|-------|
| Flag-off = today's behavior | yes | G1 — e2e 3/3, Vitest 45/45 |
| Ball separated from bg | yes | G2 — rim + HDRI + ContactShadows |
| Window centered on reveal | yes | G5 — GSAP rotate to dead-center |
| Liquid sloshes / settles | yes | G4 — shader slosh + settle |
| Text behind glass, fits longest answer | yes | G6 — troika Text + tests |
| Modes centered | yes | G8 — ThemeChips justify-center |
| Share PNG includes 3D ball | partial | G8 — manual WebGL verify; G9 automate if feasible |
| Lighthouse mobile | — | G9 |
| Reduced-motion / no-WebGL fallback | partial | G1 hook; full verify G9 |
| Lazy three chunk + workbox | partial | G1 chunk; G9 add .hdr + Oswald offline |
