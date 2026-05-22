---
id: docs-index
version: 1.0.0
status: active
---

# Magik 8 — Documentation Index

**Read this file first in any new agent chat.** It routes you to the smallest doc set for your phase.

## Project in one sentence

Mobile-first PWA **Magik 8**: faithful Magic-8-Ball-style ritual (ask → shake → reveal), canonical + themed answer packs, built with Vite + React + TypeScript.

## Doc map (do not load everything)

| Phase | Agent role | Read (in order) | Max files |
|-------|------------|-----------------|-----------|
| Any | Coordinator | `README.md` → `HANDOFF.md` → `WORKFLOW.md` | 3 |
| 0 | Spec | `PRODUCT.md`, `PRD.md` (delta only) | 2 |
| 1 | Scaffold | `ARCHITECTURE.md`, `PRD.md` § Tech | 2 |
| 2 | UI Core | `DESIGN.md`, `ARCHITECTURE.md`, `ANSWERS.md` § Schema | 3 |
| 3 | Sensors | `SENSORS.md`, `ARCHITECTURE.md` § Hooks | 2 |
| 4 | Polish | `DESIGN.md` § Audio, `PRD.md` § REQ-040–060 | 2 |
| 5 | PWA/Share | `PRD.md` § REQ-050, `ARCHITECTURE.md` § PWA | 2 |
| 6 | QA | `SENSORS.md` § Matrix, `PRD.md` § Acceptance | 2 |

**Source of truth hierarchy:** `PRD.md` (requirements) → domain docs (`ANSWERS`, `SENSORS`, `DESIGN`) → `HANDOFF.md` (runtime status).

## Stable IDs

- Requirements: `REQ-###`
- UX: `UX-###`
- Phases: `PHASE-#`
- Agent sessions: `AGENT-###` (logged in `HANDOFF.md`)

## Out of repo scope

Portfolio **case study narrative** lives on the user's main portfolio site (external). This repo ships the app + technical docs only. Provide `DEPLOY_URL` in `HANDOFF.md` when known.

## Quick links

- [WORKFLOW.md](./WORKFLOW.md) — multi-agent orchestration, context limits, chat prompts
- [HANDOFF.md](./HANDOFF.md) — current phase, blockers, last acceptance
- [PRD.md](./PRD.md) — full requirements
- [PRODUCT.md](./PRODUCT.md) — brand, users, anti-goals
- [DESIGN.md](./DESIGN.md) — tokens, motion, sound
- [ARCHITECTURE.md](./ARCHITECTURE.md) — modules, state, file tree
- [ANSWERS.md](./ANSWERS.md) — all theme copy (implement `src/data/answers.ts` from here)
- [SENSORS.md](./SENSORS.md) — shake algorithm, permissions, QA matrix
