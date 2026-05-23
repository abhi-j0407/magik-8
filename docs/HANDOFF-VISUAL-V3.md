---
id: handoff-visual-v3
version: 1.0.0
status: active
current_phase: G3
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
## Handoff — G2
**Status:** complete
**Agent:** G2 implementer
**Branch / PR:** merged to `main` @ daf174d (squash; remote `phase/g2-ball` deleted)
**Changed:**
- src/three/Ball.tsx — MeshPhysicalMaterial sphere + procedural embossed "8" disc
- src/three/Lighting.tsx — HDRI Environment + key (upper-left) + rim back light
- src/three/OracleScene.tsx — Ball + Lighting + ContactShadows; ACES/sRGB; removed CSS drop-shadow
- public/hdri/studio_small_08_1k.hdr + README.md — Poly Haven CC0 env map
- scripts/generate-eight-texture.mjs — documents procedural texture path
**Verified:**
- `npx tsc -b` — exit 0
- `npm run build` — exit 0; OracleScene chunk ~956 kB; dist/hdri/*.hdr present
- `npm test` — 8 files, 45 tests passed
- `npm run test:e2e` — 3 passed (flag off)
- /code-review — self-review: no blockers; workbox precache still omits `.hdr` (static serve OK; note for G9)
- visual — flag-on: glossy ball, rim edge, "8" on +Z, ContactShadows ground (manual VITE_WEBGL=true)
**Acceptance:** §5.2 material params; §5.4 lighting; defect 2 rim separation; defect 6 ContactShadows replaces button drop-shadow; flag-off regression green
**Integration:** `Ball` + `Lighting` mounted in `OracleCanvas`; HDRI at `/hdri/studio_small_08_1k.hdr`; G3 adds AnswerWindow/Die in same Canvas
**Next:** G3 — MeshTransmissionMaterial window + liquid volume + icosahedron die (settled pose)
**Blockers:** none
**Notes for next agent:**
- `createEightDiscTexture()` in Ball.tsx — stripe/eight/sphereWarm tokens; edit for disc art tweaks
- Phase spin/bob on `<group>` wrapping ball+disc (unchanged from G1 placeholder behavior)
- No ANIMATION_DONE / AnswerWindow / post / GSAP yet
- OracleScene button no longer uses CSS filter drop-shadow — shadow from ContactShadows only
- HDRI ~1.4 MB in dist; extend workbox glob for `.hdr` in G9 if offline env required
```

## Phase checklist

- [x] **G1** — Foundation & seam (deps, `OracleStage` flag + capability, lazy placeholder Canvas, CSS fallback)
- [x] **G2** — The ball (glossy `MeshPhysicalMaterial`, HDRI `<Environment>`, key+rim lights, `<ContactShadows>`, "8" disc) — *fixes defect 2, 6*
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
| `src/three/AnswerWindow.tsx`, `Die.tsx` | G3 | G3 merged |
| `src/three/OracleScene.tsx` (mount window/die) | G3 | G3 merged |

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
| Ball separated from bg | yes | G2 — rim + HDRI + ContactShadows |
| Window centered on reveal | — | G3/G5 |
| Liquid sloshes / settles | — | G4 |
| Text behind glass, fits longest answer | — | G6 |
| Modes centered | — | G8 |
| Share PNG includes 3D ball | — | G8 |
| Lighthouse mobile | — | G9 |
| Reduced-motion / no-WebGL fallback | partial | G1 hook; full verify G9 |
| Lazy three chunk + workbox | yes | G1 — OracleScene-*.js precached + runtime rule |
