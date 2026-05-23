---
id: handoff
version: 1.0.0
status: active
current_phase: Ship
deploy_url: null
---

# Handoff — Live Status

> **Coordinator:** update this file at every phase boundary. Implementers: read only § Latest + § Active locks + your phase checklist.

## Latest handoff

```markdown
## Handoff — Design V2 complete (D8)
**Status:** complete
**Agent:** implementer D8 (docs + ship prep)
**Changed:** `docs/DESIGN-V2.md` (copied from design pack); `docs/DESIGN.md` superseded; `docs/prompts/PHASE-7-design-implement.md` coordinator pointer; HANDOFF checklist
**Verified:** npm run build ✓ · npm test ✓ (45) · npm run test:e2e ✓ (3) · `rg '--magik-' src/` empty ✓
**Integration:** D1–D8 complete — tokens, ball, triangle, chrome, share card, motion, e2e, docs
**Polish:** README/docs sync · theme-color `#1a1a20` · touch targets ≥44px
**Next:** Ship — overseer pushes `main`, connects Vercel, sets `deploy_url` below
**Blockers:** none (device QA: iPhone audio, Android shake — overseer backlog)
```

## Phase checklist

- [x] **PHASE-0** — Docs & PRD (`docs/`)
- [x] **PHASE-1** — Scaffold (Vite, React, TS, Tailwind, PWA shell, Vitest)
- [x] **PHASE-2** — Core ritual (state machine, ball UI, reveal, tap fallback)
- [x] **PHASE-3** — Sensors (`useShake`, iOS permission, haptics)
- [x] **FIX-3** — iPhone ritual lock + sensitivity
- [x] **PHASE-4** — Themes wiring, audio, easter eggs
- [x] **PHASE-5** — Share card, manifest/icons, offline shell
- [x] **PHASE-6** — QA matrix, Lighthouse, Playwright smoke
- [x] **Design V2** — Claude Design pack (`magik-8_CLAUDE_DESIGN/`) integrated D1–D8; spec in [`DESIGN-V2.md`](./DESIGN-V2.md)
- [ ] **Ship** — Overseer: GitHub push → Vercel connect → set `deploy_url` below

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| _(none)_ | — | Design V2 complete; Ship is overseer-only |

## Design V2 integration summary

| Phase | Scope |
|-------|--------|
| D1 | Fonts, `--m8-*` tokens, grain/vignette |
| D2 | `MagikBall` 5-layer sphere |
| D3 | `AnswerTriangle` SVG ink rise |
| D4 | Chrome + App shell (Wordmark, HUD, CTA, sheets) |
| D5 | `ShareCard` 1080×1920 export |
| D6 | Motion + `prefers-reduced-motion` |
| D7 | E2E smoke alignment |
| D8 | Docs + ship prep |

Archive: `magik-8_CLAUDE_DESIGN/` (exports, prompts, prototype — do not delete).

## Sensor tuning (post FIX-3)

| Parameter | Value |
|-----------|--------|
| threshold | 18 |
| cooldownMs | 2000 |
| spikeDelta | 5 |
| sustainedSamples | 3 |
| strategy | hypot + EMA baseline jerk + sustained samples |

## QA results (PHASE-6 + Design V2 D7)

| Check | Pass | Notes |
|-------|------|-------|
| iPhone Safari shake | ✓ | FIX-3 verified prior; ritual lock intact |
| iPhone audio mute/unlock | pending | overseer device pass (BACKLOG B-02) |
| Android shake | pending | overseer device pass (BACKLOG B-03) |
| Lighthouse mobile | ✓ | perf 95 · a11y 100 · best-practices 100 — post Design V2 D7 (`npm run test:lighthouse`) |
| Playwright smoke | ✓ | chrome shell · tap reveal · share CTA · theme switch (`npm run test:e2e`) |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Brand | Magik 8 (no Mattel marks) |
| Platform | Mobile-first PWA |
| Stack | Vite + React + TypeScript + Tailwind v4 |
| Themes v1 | Classic, Career Coach, Party Mode |
| Easter egg rate | 1/40 shakes + first-visit egg |
| Deploy | **Overseer only** — ready after Design V2 |

## Environment secrets

None required for v1. No API keys.

## Deploy (overseer — ready)

| Field | Value |
|-------|-------|
| Target | Vercel (`vercel.json` present) or Cloudflare Pages |
| URL | _null until you connect repo and deploy; paste prod URL here_ |

**Steps (you, not agents):** push `main` → import repo in Vercel → deploy → set `deploy_url` in frontmatter → link from external case study.
