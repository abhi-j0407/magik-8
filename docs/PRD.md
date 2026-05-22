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
| Status | Approved for implementation |
| Case study | External (not in repo) |

**Related docs:** [PRODUCT](./PRODUCT.md) · [DESIGN](./DESIGN.md) · [ARCHITECTURE](./ARCHITECTURE.md) · [ANSWERS](./ANSWERS.md) · [SENSORS](./SENSORS.md) · [WORKFLOW](./WORKFLOW.md)

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
- [ ] One viewport-focused screen; no router required
- [ ] Instruction visible in `idle`: mental question + shake hint
- [ ] Theme chips visible before shake
- [ ] No question text field; no history list

**Components:** UX-001–007 per [DESIGN.md](./DESIGN.md)

---

## REQ-010 — State machine

**Acceptance:**
- [ ] Phases: `idle` → `shaking` → `revealing` → `answered`
- [ ] `THEME_CHANGE` only when `idle` or `answered`
- [ ] New shake from `answered` starts new cycle
- [ ] Unit tests for transition guards

**Spec:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## REQ-015 — Neutral answer hint

**Acceptance:**
- [ ] After reveal, if `category === 'neutral'`, show secondary hint text
- [ ] User can shake again immediately

---

## REQ-020 — Motion design

**Acceptance:**
- [ ] Idle float, shake wobble, fluid reveal per DESIGN
- [ ] `prefers-reduced-motion: reduce` disables float/wobble; answer still shows
- [ ] No Three.js

---

## REQ-030 — Shake detection

**Acceptance:**
- [ ] `useShake` implements SENSORS algorithm
- [ ] Throttle ~30Hz; cooldown 1000ms
- [ ] Fires `onShake` → oracle `SHAKE_OR_TAP`

**Spec:** [SENSORS.md](./SENSORS.md)

---

## REQ-031 — iOS motion permission

**Acceptance:**
- [ ] PermissionSheet with explainer + button
- [ ] `requestPermission` only on click
- [ ] Granted → listener attached; denied → fallback mode

---

## REQ-032 — Fallback input

**Acceptance:**
- [ ] ShakeCTA visible always on desktop
- [ ] Space key triggers shake event on desktop
- [ ] Denied iOS motion → CTA primary

---

## REQ-033 — HTTPS

**Acceptance:**
- [ ] `dev:https` script documented in README
- [ ] Production deploy on HTTPS host
- [ ] HANDOFF records `deploy_url`

---

## REQ-040 — Sound

**Acceptance:**
- [ ] SFX-01 on shake start, SFX-02 on reveal
- [ ] Mute toggle persists
- [ ] No sound until user gesture if platform requires

---

## REQ-041 — Haptics

**Acceptance:**
- [ ] Vibrate on shake detect and reveal (if supported)
- [ ] No error if unsupported

---

## REQ-045 — Easter eggs

**Acceptance:**
- [ ] First-visit egg once (ANSWERS `egg-first-visit`)
- [ ] 1/40 random egg otherwise
- [ ] SFX-03 + accent color on egg
- [ ] Unit test: RNG stub hits egg at expected rate (statistical smoke)

**Copy:** [ANSWERS.md](./ANSWERS.md)

---

## REQ-050 — Share

**Acceptance:**
- [ ] Generate 1080×1920 PNG from ShareCard component
- [ ] Web Share API with file if supported; else download
- [ ] Includes answer text + Magik 8 wordmark + theme label

---

## REQ-060 — PWA

**Acceptance:**
- [ ] manifest: name, icons 192/512, `display: standalone`, theme_color
- [ ] Service worker precaches app shell
- [ ] Airplane mode: app loads after prior visit

---

## REQ-070 — Accessibility

**Acceptance:**
- [ ] `aria-live` announces new answer
- [ ] All controls keyboard-focusable with visible focus
- [ ] Touch targets ≥44px
- [ ] Lighthouse a11y ≥95 mobile

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
| PHASE-5 | Share PNG + PWA icons/manifest + offline shell (`npm run build` passes) |
| PHASE-6 | QA matrix signed; Lighthouse targets met |
| Post–PHASE-6 | Overseer deploys; HANDOFF `deploy_url` set (not an agent task) |

---

## Open items (user)

| Item | Status |
|------|--------|
| Deploy host preference | Vercel or Cloudflare — decide at PHASE-5 |
| Custom domain | Optional |
