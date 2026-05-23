---
id: handoff-visual-v3
version: 1.0.0
status: complete
current_phase: done
webgl_flag: off (G9 sign-off — enable via VITE_WEBGL=true in Vercel when product opts in)
deploy_url: null
---

# Handoff — Visual V3 ("3D Oracle") Live Status

> **Coordinator:** update this file at every phase boundary (see
> [`prompts/COORDINATOR-VISUAL-V3.md`](./prompts/COORDINATOR-VISUAL-V3.md) § Handoff-doc update protocol).
> **Implementers:** read only § Latest handoff + § Active locks + your row in
> [`PLAN-VISUAL-V3.md`](./PLAN-VISUAL-V3.md) §6.

## Latest handoff

```markdown
## Handoff — G9
**Status:** complete
**Agent:** G9 implementer
**Branch / PR:** merged to `main` @ 10293f0 (squash; remote `phase/g9-qa` deleted)
**Changed:**
- OracleScene: AdaptiveDpr, DPR 1–1.5, visibility frameloop demand, preserveDrawingBuffer documented
- AnswerText: self-hosted `/fonts/oswald-600.woff2`
- vite.config: workbox precache .hdr/.woff2 + runtime caches
- scripts/lighthouse.mjs: flag-off build + thresholds (perf≥85, a11y≥95, BP≥90)
- e2e: smoke (3) + webgl.spec (2); OracleStage VITE_WEBGL_E2E for CI Path B
- useWebglCapability.test.ts (low-power heuristic)
**Verified:** tsc ✓ · build ✓ · test ✓ (56) · e2e ✓ (3 flag-off + 2 flag-on) · lighthouse ✓ · visual ✓ (manual fallback checklist below)
**Acceptance:** Lighthouse budget; offline hdri/font; dual-path e2e; aria-live both paths; fallbacks documented
**Integration:** V3 complete on main after merge; enable WebGL only with `VITE_WEBGL=true` (+ prod env in DEPLOY doc)
**Next:** overseer deploy only (per DEPLOY-VERCEL.md)
**Blockers:** none
**Notes for next agent:**
- Lighthouse (flag-off preview): perf 92–95 · a11y 100 · best-practices 100 · PWA n/a on http preview (B-04); coordinator verify 95/100/100 @ 10293f0
- DPR: Canvas `[1, 1.5]` + `<AdaptiveDpr pixelated />`; tab hidden → `frameloop="demand"`
- Offline: `dist/hdri/studio_small_08_1k.hdr`, `dist/fonts/oswald-600.woff2` in SW precache
- preserveDrawingBuffer: kept true for share capture (WebGL-only); no flag-off Lighthouse impact
- EffectComposer multisampling=4 unchanged; lower only if flag-on mobile budget fails later
- `VITE_WEBGL_E2E=true` is Playwright-only — never set on Vercel prod
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
- [x] **G9** — QA, perf, a11y (Lighthouse budget, AdaptiveDpr, fallback verify, e2e both paths) — *no deploy*

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| — | — | G9 merged — no active implementer locks |

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
| G9 webgl default | **`VITE_WEBGL` stays unset/false** in prod until overseer sets env; document in DEPLOY only |
| G9 e2e seam | `VITE_WEBGL_E2E=true` bypasses strict GPU probe in Playwright builds only |

## Verification gates

- **Per phase:** `tsc -b` · `npm run build` · `npm test` · `npm run test:e2e` · `/code-review` · PR opened.
- **Flag-off regression:** every phase keeps WebGL-flag-off behavior identical to today.
- **Final (G9):** `npm run test:lighthouse` ≥ target; reduced-motion + no-WebGL fallback verified; e2e
  green on both paths; answer announced via `aria-live`; three.js chunks lazy-load + cache offline.

### G9 verification output (2026-05-23)

```text
npx tsc -b          ✓
npm run build       ✓ (precache includes hdri + fonts)
npm test            ✓ 56 passed
npm run test:e2e    ✓ 5 passed (3 flag-off + 2 flag-on)
npm run test:lighthouse ✓
  performance: 92–95 (threshold ≥85; coordinator run: 95)
  accessibility: 100 (≥95)
  best-practices: 100 (≥90)
  pwa: not scored on http://127.0.0.1 preview (see BACKLOG B-04)
```

## QA results (fill as phases land)

| Check | Pass | Notes |
|-------|------|-------|
| Flag-off = today's behavior | yes | G9 — smoke 3/3 unchanged |
| Ball separated from bg | yes | G2 — rim + HDRI + ContactShadows |
| Window centered on reveal | yes | G5 — GSAP rotate to dead-center |
| Liquid sloshes / settles | yes | G4 — shader slosh + settle |
| Text behind glass, fits longest answer | yes | G6 — troika Text + tests |
| Modes centered | yes | G8 — ThemeChips justify-center |
| Share PNG includes 3D ball | partial | G8 manual; share path needs `VITE_WEBGL=true` |
| Lighthouse mobile | yes | G9 — perf 92 · a11y 100 · BP 100 (flag-off build) |
| Reduced-motion / no-WebGL fallback | yes | G9 — see manual checklist below |
| Lazy three chunk + workbox | yes | G9 — OracleScene chunk + `.hdr` + Oswald precache |

### Fallback manual checklist (G9)

| Scenario | Expected | How to verify |
|----------|----------|---------------|
| `prefers-reduced-motion: reduce` | CSS `MagikBall` only | DevTools → Rendering → emulate reduced motion → reload |
| WebGL unavailable / `failIfMajorPerformanceCaveat` | CSS `MagikBall` | Safari low-power mode or block WebGL in chrome://flags |
| Low-power heuristic (≤2 cores or ≤2 GiB RAM) | CSS `MagikBall` | DevTools device with `hardwareConcurrency=2` (if overridden) |
| `VITE_WEBGL` unset (default) | CSS `MagikBall` | Production build without env |
| Flag-on capable desktop | `OracleScene` + `aria-live` sr-only | `VITE_WEBGL=true npm run dev` → tap reveal → screen reader / e2e |

### aria-live (G9)

| Path | Region | Notes |
|------|--------|-------|
| Flag-off | `AnswerTriangle` `motion.span` `aria-live="polite"` | Unchanged Design V2 |
| Flag-on | `OracleAnswerLiveRegion` `span.sr-only` `aria-live="polite"` | Announces `getAnswerDisplayText` at `answered` |

## webgl_flag sign-off (G9)

**Recommendation:** Keep **`VITE_WEBGL` default false** for production deploy until product explicitly opts in.

- Rationale: Lighthouse and bundle weight validated on CSS path; WebGL adds ~1.2 MB lazy chunk; share capture and mobile GPU need overseer device pass.
- To enable preview/staging: set `VITE_WEBGL=true` in Vercel env (document in `DEPLOY-VERCEL.md` only — no silent flip).
- Do **not** set `VITE_WEBGL_E2E` in production (Playwright seam only).
