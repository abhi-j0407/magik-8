---
id: prd
version: 1.0.0
status: active
---

# PRD — Magik 8 v1

## Document control

| Field | Value |
|-------|-------|
| Product | Magik 8 PWA |
| Version | 1.0.0 |
| Status | Implemented (v1 + Design V2) |
| Case study | External (not in repo) |

**Related docs:** [PRODUCT](./PRODUCT.md) · [DESIGN-V2](./DESIGN-V2.md) · [ARCHITECTURE](./ARCHITECTURE.md) · [ANSWERS](./ANSWERS.md) · [SENSORS](./SENSORS.md) · [WORKFLOW](./WORKFLOW.md)

---

## Problem statement

Users want the nostalgic **yes/no oracle ritual** on mobile without carrying a physical ball. Existing web clones feel like buttons with CSS — not shakes, themes, or shareable moments.

## Solution

Mobile-first installable PWA with shake-to-reveal (and accessible fallback), three answer packs, sound/haptics, share export, and rare easter eggs — visually faithful to the classic 8-ball.

## Requirements index

| ID | Title | Phase | Priority |
|----|-------|-------|----------|
| REQ-001 | Single-screen oracle ritual | 2 | P0 |
| REQ-010 | State machine | 2 | P0 |
| REQ-015 | Neutral answer hint | 2 | P1 |
| REQ-020 | Motion design + reduced motion | 2 | P0 |
| REQ-030 | Shake detection | 3 | P0 |
| REQ-031 | iOS motion permission UX | 3 | P0 |
| REQ-032 | Tap/keyboard fallback | 2 | P0 |
| REQ-033 | HTTPS dev/prod | 1 | P0 |
| REQ-040 | Sound effects + mute | 4 | P0 |
| REQ-041 | Haptic feedback | 3 | P1 |
| REQ-045 | Easter eggs | 4 | P1 |
| REQ-050 | Share card export | 5 | P0 |
| REQ-060 | PWA install + offline shell | 5 | P0 |
| REQ-070 | Accessibility | 2–6 | P0 |

---

## REQ-001 — Single-screen oracle ritual

**User story:** As a visitor, I hold a yes/no question, shake, and read one answer without navigation.

**Acceptance:**
- [x] One viewport-focused screen; no router required
- [x] Instruction visible in `idle`: mental question + shake hint
- [x] Theme chips visible before shake
- [x] No question text field; no history list

**Components:** UX-001–007 per [DESIGN-V2.md](./DESIGN-V2.md)

---

## REQ-010 — State machine

**Acceptance:**
- [x] Phases: `idle` → `shaking` → `revealing` → `answered`
- [x] `THEME_CHANGE` only when `idle` or `answered`
- [x] New cycle from `answered` requires explicit `RESET`, then shake/tap from `idle` (FIX-3 ritual lock)
- [x] Unit tests for transition guards

**Spec:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## REQ-015 — Neutral answer hint

**Acceptance:**
- [x] After reveal, if `category === 'neutral'`, show secondary hint text
- [x] User can reset and ask again immediately (CTA / ball tap)

---

## REQ-020 — Motion design

**Acceptance:**
- [x] Idle float, shake wobble, fluid reveal per DESIGN-V2
- [x] `prefers-reduced-motion: reduce` disables float/wobble; answer still shows
- [x] No Three.js

---

## REQ-030 — Shake detection

**Acceptance:**
- [x] `useShake` implements SENSORS algorithm
- [x] Throttle ~30Hz; cooldown 2000ms (FIX-3 tuning)
- [x] Fires `onShake` → oracle `SHAKE_OR_TAP`

**Spec:** [SENSORS.md](./SENSORS.md)

---

## REQ-031 — iOS motion permission

**Acceptance:**
- [x] PermissionSheet with explainer + button
- [x] `requestPermission` only on click
- [x] Granted → listener attached; denied → fallback mode

---

## REQ-032 — Fallback input

**Acceptance:**
- [x] ShakeCTA visible always on desktop
- [x] Space key triggers shake event on desktop
- [x] Denied iOS motion → CTA primary

---

## REQ-033 — HTTPS

**Acceptance:**
- [x] `dev:https` script documented in README
- [ ] Production deploy on HTTPS host (overseer)
- [ ] HANDOFF records `deploy_url` (overseer)

---

## REQ-040 — Sound

**Acceptance:**
- [x] SFX-01 on shake start, SFX-02 on reveal
- [x] Mute toggle persists
- [x] No sound until user gesture if platform requires

---

## REQ-041 — Haptics

**Acceptance:**
- [x] Vibrate on shake detect and reveal (if supported)
- [x] No error if unsupported

---

## REQ-045 — Easter eggs

**Acceptance:**
- [x] First-visit egg once (ANSWERS `egg-first-visit`)
- [x] 1/40 random egg otherwise
- [x] SFX-03 + accent color on egg
- [x] Unit test: RNG stub hits egg at expected rate (statistical smoke)

**Copy:** [ANSWERS.md](./ANSWERS.md)

---

## REQ-050 — Share

**Acceptance:**
- [x] Generate 1080×1920 PNG from ShareCard component
- [x] Web Share API with file if supported; else download
- [x] Includes answer text + Magik 8 wordmark + theme label

---

## REQ-060 — PWA

**Acceptance:**
- [x] manifest: name, icons 192/512, `display: standalone`, theme_color
- [x] Service worker precaches app shell
- [x] Airplane mode: app loads after prior visit

---

## REQ-070 — Accessibility

**Acceptance:**
- [x] `aria-live` announces new answer
- [x] All controls keyboard-focusable with visible focus
- [x] Touch targets ≥44px
- [x] Lighthouse a11y ≥95 mobile (100 in automated run)

---

## Theme packs (REQ-001)

| pack id | Label | Source |
|---------|-------|--------|
| classic | Classic | ANSWERS § classic |
| career | Career Coach | ANSWERS § career |
| party | Party Mode | ANSWERS § party |

Implement `pickAnswer` uniform random 0..19.

---

## Out of scope v1

- Question input, history, accounts, analytics
- In-repo case study page
- Mattel branding
- Custom answer editor

---

## Phase acceptance (Coordinator)

| Phase | Gate |
|-------|------|
| PHASE-1 | `npm run build` succeeds; PWA plugin configured |
| PHASE-2 | Tap reveals answer; state tests pass |
| PHASE-3 | iPhone shake works after grant; fallback works on deny |
| PHASE-4 | All themes + mute + eggs |
| PHASE-5 | Share PNG + PWA icons/manifest + offline shell |
| PHASE-6 | QA matrix signed; Lighthouse targets met |
| Design V2 (D1–D8) | Visual integration per DESIGN-V2 + coordinator doc |
| Post–PHASE-6 | Overseer deploys; HANDOFF `deploy_url` set (not an agent task) |

---

## Open items (user)

| Item | Status |
|------|--------|
| Deploy host preference | Vercel (`vercel.json` present) |
| Custom domain | Optional |
| Device QA (audio, Android shake) | Overseer — see BACKLOG B-02, B-03 |
