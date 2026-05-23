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
**Next:** Vercel (personal team) — follow [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md) → set `deploy_url` when production URL exists  
**Blockers:** none (device QA: iPhone audio, Android shake — backlog)
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
- [x] **Ship (Git)** — `main` on GitHub; remote `origin` uses SSH (`git@github.com:abhi-j0407/magik-8.git`)
- [ ] **Ship (Vercel)** — Overseer creates project under [abhij0407s-projects](https://vercel.com/abhij0407s-projects) per [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md); set `deploy_url` below after first prod deploy  
  - GitHub **default branch** → `main` if not already (Settings → General → Default branch), or terminal: `gh auth login` → `gh repo edit abhi-j0407/magik-8 --default-branch main`

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
| Deploy | Personal Vercel team [**abhij0407s-projects**](https://vercel.com/abhij0407s-projects) — create project via dashboard only ([`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md)) |

## Deploy — Vercel (personal account)

**Vercel team:** [abhij0407’s projects](https://vercel.com/abhij0407s-projects).

**Instructions:** **[`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md)** (dashboard import of `abhi-j0407/magik-8`, branch `main`).

| Field | Value |
|-------|-------|
| Target | Vercel — personal team **`abhij0407s-projects`** |
| Repo | [`abhi-j0407/magik-8`](https://github.com/abhi-j0407/magik-8) |
| Prod branch | `main` |
| URL | `deploy_url` in frontmatter (_set after deploy_) |

---

## Production verification (after deploy URL exists)

HTTPS production domain only (`deploy_url`). Use DevTools Application tab for manifest + service worker.

| Check | Notes |
|-------|-------|
| App shell | Wordmark, theme chips, mute, CTA loads |
| Tap ritual | Shake/tap reveals answer + share row |
| PWA | Valid manifest; SW registers; revisit offline after first load |
| Share | Generates PNG / share sheet or download |
| Audio | Toggle mute → SFX after user gesture (**B-02** iPhone Safari) |
| Shake | Motion permission → shake completes ritual (**B-03** Android matrix optional) |
| Lighthouse PWA | Run against prod (**B-04**) — DevTools Lighthouse or PageSpeed |

---

## Environment secrets

None required for v1. No API keys.

**After Vercel prod is live:** Paste the production HTTPS URL into frontmatter `deploy_url` and tick **Ship (Vercel)** in the phase checklist above. Link prod from your external case study as needed.
