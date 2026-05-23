---
id: docs-index
version: 1.1.0
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
| 2 | UI Core | `DESIGN-V2.md`, `ARCHITECTURE.md`, `ANSWERS.md` § Schema | 3 |
| 3 | Sensors | `SENSORS.md`, `ARCHITECTURE.md` § Hooks | 2 |
| 4 | Polish | `DESIGN-V2.md` § Audio, `PRD.md` § REQ-040–060 | 2 |
| 5 | PWA/Share | `PRD.md` § REQ-050, `ARCHITECTURE.md` § PWA | 2 |
| 6 | QA | `SENSORS.md` § Matrix, `PRD.md` § Acceptance | 2 |
| Ship | Overseer | [`HANDOFF.md`](./HANDOFF.md) § Deploy, [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md) | 2 |

**Source of truth hierarchy:** `PRD.md` (requirements) → domain docs (`ANSWERS`, `SENSORS`, `DESIGN-V2`) → `HANDOFF.md` (runtime status).

## Stable IDs

- Requirements: `REQ-###`
- UX: `UX-###`
- Phases: `PHASE-#` (build) · `D#` (Design V2 integration)
- Agent sessions: `AGENT-###` (logged in `HANDOFF.md`)

## Out of repo scope

Portfolio **case study narrative** lives on the user's main portfolio site (external). This repo ships the app + technical docs only. Provide `deploy_url` in `HANDOFF.md` when known.

## Quick links

- [WORKFLOW.md](./WORKFLOW.md) — multi-agent orchestration, context limits, chat prompts
- [HANDOFF.md](./HANDOFF.md) — current phase, blockers, last acceptance
- [PRD.md](./PRD.md) — full requirements
- [PRODUCT.md](./PRODUCT.md) — brand, users, anti-goals
- [DESIGN-V2.md](./DESIGN-V2.md) — tokens, motion, components (canonical visual spec)
- [DESIGN.md](./DESIGN.md) — V1 tokens (superseded; migration map in DESIGN-V2)
- [COORDINATOR-DESIGN-V2-INTEGRATION.md](./COORDINATOR-DESIGN-V2-INTEGRATION.md) — D1–D8 playbook (complete)
- [PLAN-VISUAL-V3.md](./PLAN-VISUAL-V3.md) — **active** 3D Oracle upgrade: phases G1–G9 + canonical 3D spec
- [prompts/COORDINATOR-VISUAL-V3.md](./prompts/COORDINATOR-VISUAL-V3.md) — Visual V3 coordinator prompt + kickoff + per-phase template
- [HANDOFF-VISUAL-V3.md](./HANDOFF-VISUAL-V3.md) — Visual V3 live status (current phase, locks, decisions)
- [ARCHITECTURE.md](./ARCHITECTURE.md) — modules, state, file tree
- [ANSWERS.md](./ANSWERS.md) — all theme copy (implement `src/data/answers.ts` from here)
- [SENSORS.md](./SENSORS.md) — shake algorithm, permissions, QA matrix
- [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md) — Vercel dashboard deploy (personal team **abhij0407s-projects**), branch `main`
