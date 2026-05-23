---
id: handoff-visual-v3
version: 1.0.0
status: active
current_phase: G5
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
## Handoff — G4
**Status:** complete
**Agent:** G4 implementer
**Branch / PR:** merged to `main` @ cb7407b (squash; remote `phase/g4-liquid` deleted)
**Changed:**
- src/three/Liquid.tsx — animated liquid + meniscus, phase slosh/bob uniforms
- src/three/shaders/liquid.vert, liquid.frag — displacement, token colors, fresnel
- src/three/AnswerWindow.tsx — static cylinders replaced with Liquid; glass/Die/recess preserved
**Verified:** tsc ✓ · build ✓ · test ✓ (45) · e2e ✓ (3) · /code-review ✓ · visual ✓ (manual flag-on)
**Acceptance:** §5.2 fluid tokens; animated surface + idle bob; meniscus; slosh on shake, damp on reveal/answered; flag-off green; mobile-friendly segments
**Integration:** Liquid exports phase/radius/depth; uniforms uSlosh/uBob/uTime; slosh accumulates while window hidden during shaking; G5 drives rotation + ANIMATION_DONE
**Next:** G5 — GSAP reveal + Float idle + 8-to-window rotation + ANIMATION_DONE
**Blockers:** none
**Notes for next agent:**
- Slosh sim runs during hidden shaking so reveal opens with energy — intentional
- Phase-only slosh v1; optional useShake amplitude later
- Export WINDOW_RADIUS/LIQUID_DEPTH if G5 needs; dispose ShaderMaterial on hot remount
```

## Phase checklist

- [x] **G1** — Foundation & seam (deps, `OracleStage` flag + capability, lazy placeholder Canvas, CSS fallback)
- [x] **G2** — The ball (glossy `MeshPhysicalMaterial`, HDRI `<Environment>`, key+rim lights, `<ContactShadows>`, "8" disc) — *fixes defect 2, 6*
- [x] **G3** — Window mechanism (glass + cobalt liquid + d20 die + triangular answer face, settled) — *fixes defect 3, 5, 6*
- [x] **G4** — Liquid & bob (animated surface shader, meniscus, shake-driven slosh)
- [ ] **G5** — Motion choreography (GSAP reveal + `<Float>` idle + "8"→window rotation; dispatch `ANIMATION_DONE`)
- [ ] **G6** — Text behind glass (die-face `Text`/`Text3D`, auto-fit/wrap, amber easter-egg) — *fixes defect 4*
- [ ] **G7** — Backdrop & post (mesh-gradient bg, Bloom/CA/Vignette/Noise) — *∥ after G2*
- [ ] **G8** — Chrome & integration (center modes, share-card WebGL capture, theme retint) — *fixes defect 1, ∥ after G1*
- [ ] **G9** — QA, perf, a11y (Lighthouse budget, AdaptiveDpr, fallback verify, e2e both paths) — *no deploy*

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| `src/three/useOracleChoreography.ts` | G5 | G5 merged |
| `src/three/Ball.tsx`, `Die.tsx`, `OracleScene.tsx` | G5 | G5 merged |

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
| G3 window pose | Recess −Z; ROT_SETTLED πY faces camera; visible only revealing/answered |

## Verification gates

- **Per phase:** `tsc -b` · `npm run build` · `npm test` · `npm run test:e2e` · `/code-review` · PR opened.
- **Flag-off regression:** every phase keeps WebGL-flag-off behavior identical to today.
- **Final (G9):** `npm run test:lighthouse` ≥ target; reduced-motion + no-WebGL fallback verified; e2e
  green on both render paths; answer announced via `aria-live`; three.js chunks lazy-load + cache offline.

## QA results (fill as phases land)

| Check | Pass | Notes |
|-------|------|-------|
| Flag-off = today's behavior | yes | G1 — e2e 3/3, Vitest 45/45 |
| Ball separated from bg | yes | G2 — rim + HDRI + ContactShadows |
| Window centered on reveal | partial | G3 static settled; G5 choreography |
| Liquid sloshes / settles | yes | G4 — shader slosh + settle |
| Text behind glass, fits longest answer | — | G6 |
| Modes centered | — | G8 |
| Share PNG includes 3D ball | — | G8 |
| Lighthouse mobile | — | G9 |
| Reduced-motion / no-WebGL fallback | partial | G1 hook; full verify G9 |
| Lazy three chunk + workbox | yes | G1 — OracleScene-*.js precached + runtime rule |
