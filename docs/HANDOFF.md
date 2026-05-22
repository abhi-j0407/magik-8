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
## Handoff — PHASE-6
**Status:** complete
**Agent:** implementer (PHASE-6 QA)
**Changed:** Playwright smoke (`e2e/smoke.spec.ts`, `playwright.config.ts`), Lighthouse script (`scripts/lighthouse.mjs`), vitest exclude e2e, `docs/BACKLOG.md`, package scripts `test:e2e` / `test:lighthouse`
**Verified:** npm run build ✓ · npm test ✓ (45) · npm run test:e2e ✓ (3) · npm run test:lighthouse ✓
**Lighthouse (mobile, preview http://127.0.0.1:4173):** performance 89 · accessibility 100 · best-practices 100 · PWA — not scored on HTTP preview (see BACKLOG B-04)
**Acceptance:** automated QA gate; manual device matrix partial (see § QA results)
**Deploy:** skipped — overseer connects GitHub → Vercel after PHASE-6
**Next:** Design spec (`docs/prompts/DESIGN-AGENT-visual-spec.md`) → implement (`PHASE-7-design-implement.md`) → Ship
**Blockers:** none
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
- [ ] **Design V2** — Spec (`DESIGN-V2.md`) + implement (PHASE-7)
- [ ] **Ship** — Overseer: GitHub push → Vercel connect → set `deploy_url` below

## Active locks

| File area | Owner | Until |
|-----------|-------|-------|
| — | — | PHASE-6 complete |

## Sensor tuning (post FIX-3)

| Parameter | Value |
|-----------|--------|
| threshold | 18 |
| cooldownMs | 2000 |
| spikeDelta | 5 |
| sustainedSamples | 3 |
| strategy | hypot + EMA baseline jerk + sustained samples |

## QA results (PHASE-6 fills in)

| Check | Pass | Notes |
|-------|------|-------|
| iPhone Safari shake | ✓ | FIX-3 verified prior; ritual lock intact |
| iPhone audio mute/unlock | pending | overseer device pass (BACKLOG B-02) |
| Android shake | pending | overseer device pass (BACKLOG B-03) |
| Lighthouse mobile | ✓ | perf 89 · a11y 100 · best-practices 100 (`npm run test:lighthouse`) |
| Playwright smoke | ✓ | load · tap reveal · theme switch (`npm run test:e2e`) |

## Decisions log (frozen unless user changes)

| Decision | Value |
|----------|-------|
| Brand | Magik 8 (no Mattel marks) |
| Platform | Mobile-first PWA |
| Stack | Vite + React + TypeScript + Tailwind v4 |
| Themes v1 | Classic, Career Coach, Party Mode |
| Easter egg rate | 1/40 shakes + first-visit egg |
| Deploy | **Overseer only** after PHASE-6 (GitHub + Vercel) |

## Environment secrets

None required for v1. No API keys.

## Deploy (overseer — after PHASE-6)

| Field | Value |
|-------|-------|
| Target | Vercel (`vercel.json` present) or Cloudflare Pages |
| URL | _null until you connect repo and deploy; paste prod URL here_ |

**Steps (you, not agents):** push `main` → import repo in Vercel → deploy → set `deploy_url` in frontmatter → link from external case study.
