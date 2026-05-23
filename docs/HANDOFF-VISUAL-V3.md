---
id: handoff-visual-v3
version: 1.0.0
status: active
current_phase: G4
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
## Handoff — G3
**Status:** complete
**Agent:** G3 implementer
**Branch / PR:** merged to `main` @ 7072158 (squash; remote `phase/g3-window` deleted)
**Changed:**
- src/three/AnswerWindow.tsx — glass recess on −Z, MeshTransmissionMaterial, static liquid, phase visibility
- src/three/Die.tsx — icosahedron d20, triangular placeholder facet, sunk/surfaced by phase
- src/three/OracleScene.tsx — Ball + AnswerWindow in shared assembly group
**Verified:**
- `npx tsc -b` — exit 0
- `npm run build` — exit 0; OracleScene chunk ~972 kB
- `npm test` — 45 passed
- `npm run test:e2e` — 3 passed (flag off)
- /code-review — no blockers
- visual — manual VITE_WEBGL=true recommended (idle only "8"; reveal shows centered glass + die)
**Acceptance:** §5.2 glass params; static liquid tokens; die facet; window −Z vs "8" +Z; idle/shaking hidden; revealing/answered visible; flag-off green; Ball.tsx untouched
**Integration:** Exports AnswerWindow, Die, WINDOW_RADIUS, DIE_WINDOW_RADIUS; parenting `<group><Ball/><AnswerWindow/></group>`; ROT_SETTLED=[0,π,0]; G4 replaces cylinder liquid with Liquid.tsx; G5 unified tumble + ANIMATION_DONE
**Next:** G4 — animated liquid surface + meniscus + shake slosh
**Blockers:** none
**Notes for next agent:**
- BALL_RADIUS=1 duplicated in AnswerWindow/Die (export from Ball in G5 if needed)
- G5: move AnswerWindow into Ball groupRef for unified spin; hide "8" disc when window front-center
- WebGL still no ANIMATION_DONE until G5; CSS path uses AnswerTriangle
- Cylinders along window Z; glass renderOrder above liquid
```

## Phase checklist

- [x] **G1** — Foundation & seam (deps, `OracleStage` flag + capability, lazy placeholder Canvas, CSS fallback)
- [x] **G2** — The ball (glossy `MeshPhysicalMaterial`, HDRI `<Environment>`, key+rim lights, `<ContactShadows>`, "8" disc) — *fixes defect 2, 6*
- [x] **G3** — Window mechanism (glass + cobalt liquid + d20 die + triangular answer face, settled) — *fixes defect 3, 5, 6*
- [ ] **G4** — Liquid & bob (animated surface shader, meniscus, shake-driven slosh)
- [ ] **G5** — Motion choreography (GSAP reveal + `<Float>` idle + "8"→window rotation; dispatch `ANIMATION_DONE`)
- [ ] **G6** — Text behind glass (die-face `Text`/`Text3D`, auto-fit/wrap, amber easter-egg) — *fixes defect 4*
- [ ] **G7** — Backdrop & post (mesh-gradient bg, Bloom/CA/Vignette/Noise) — *∥ after G2*
- [ ] **G8** — Chrome & integration (center modes, share-card WebGL capture, theme retint) — *fixes defect 1, ∥ after G1*
- [ ] **G9** — QA, perf, a11y (Lighthouse budget, AdaptiveDpr, fallback verify, e2e both paths) — *no deploy*

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| `src/three/Liquid.tsx`, `src/three/shaders/liquid.*` | G4 | G4 merged |
| `src/three/AnswerWindow.tsx` (swap static liquid → Liquid) | G4 | G4 merged |

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
| Liquid sloshes / settles | — | G4 |
| Text behind glass, fits longest answer | — | G6 |
| Modes centered | — | G8 |
| Share PNG includes 3D ball | — | G8 |
| Lighthouse mobile | — | G9 |
| Reduced-motion / no-WebGL fallback | partial | G1 hook; full verify G9 |
| Lazy three chunk + workbox | yes | G1 — OracleScene-*.js precached + runtime rule |
