---
id: product
version: 1.0.0
status: active
---

# PRODUCT — Magik 8

## Summary

**Magik 8** is a digital fortune ball: users hold a **yes/no question**, **shake** (or tap), and receive one of **20 oracle answers**. Faithful to the physical toy's ritual and visual language, elevated with motion, sound, haptics, themes, and shareable results.

## Users

| Segment | Need |
|---------|------|
| Mobile visitor | Quick decision fun, one-thumb use |
| Portfolio viewer | Proof of craft: motion, sensors, PWA, a11y |
| Nostalgia seeker | Recognizable 8-ball without buying plastic |

## Jobs to be done

1. **Decide playfully** — reduce micro-anxiety with low-stakes randomness.
2. **Perform the ritual** — shake feels like "doing something" to the universe.
3. **Share the moment** — export answer card to friends/social.

## Brand

| Element | Guidance |
|---------|----------|
| Name | **Magik 8** (product), never "Magic 8 Ball™" in UI |
| Tagline (optional) | "Ask. Shake. Know." |
| Tone | Mystical toy shelf, not SaaS dashboard; brief copy |
| Legal | Inspired by classic toy; no Mattel logos/names; case study on **external** portfolio explains lineage |

## Anti-goals (do not build in v1)

- Typed/saved questions or answer history
- Accounts, analytics SDKs, ads
- 3D WebGL liquid simulation (too heavy for target phones)
- Mattel branding or exact trademarked product name in UI
- In-repo portfolio case study page (lives on main site)

## Core ritual (non-negotiable)

1. User forms **yes/no question** mentally.
2. User **agitates** (shake or explicit tap fallback).
3. **Suspense** animation (liquid/triangle).
4. **One answer** appears; readable without scrolling on mobile.
5. User may shake again or **share**.

## Theme packs (v1)

| ID | Label | Voice |
|----|-------|-------|
| `classic` | Classic | Canonical toy phrases |
| `career` | Career Coach | Workplace-appropriate, constructive |
| `party` | Party Mode | Silly, chaotic, party energy |

## Success metrics

| Metric | Target |
|--------|--------|
| Shake → reveal on iOS (after grant) | ≥95% intentional shakes in manual test |
| Time to first answer (cold) | <3s after permission granted |
| Lighthouse mobile a11y | ≥95 |
| Lighthouse mobile performance | ≥90 |
| JS bundle (gzip, excl. confetti) | <150KB |

## Portfolio narrative (for external case study — not in repo)

Coordinator/human writes on main portfolio site using these angles:

- Ritual preservation vs. physical toy
- Sensor permission UX on iOS
- Motion + sound nostalgia
- Fair RNG / category balance
- PWA offline shell
- Accessibility & reduced motion

Provide `deploy_url` in HANDOFF when live.
