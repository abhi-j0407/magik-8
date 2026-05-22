# Magik 8

Mobile-first PWA fortune ball — ask a yes/no question, shake (or tap), reveal the oracle.

## Documentation (AI-first)

All specs live in [`docs/`](./docs/). **Start:** [`docs/README.md`](./docs/README.md)

| Doc | Purpose |
|-----|---------|
| [WORKFLOW.md](./docs/WORKFLOW.md) | Multi-agent phases, context limits |
| [HANDOFF.md](./docs/HANDOFF.md) | Current phase status |
| [PRD.md](./docs/PRD.md) | Requirements (`REQ-*`) |

## Status

**PHASE-6 complete** — core ritual, sensors, polish, share/PWA, automated QA (Vitest + Playwright + Lighthouse script).

## Development

```bash
npm install
npm run dev          # HTTP dev server (LAN-friendly via --host)
npm run dev:https    # HTTPS — required for shake testing on a phone
npm run build
npm test             # Vitest unit tests
npm run test:e2e     # Playwright smoke (starts preview; first run: npx playwright install chromium)
npm run test:lighthouse  # Mobile Lighthouse vs preview (requires local Chrome)
```

Open the HTTPS URL on your phone (same Wi‑Fi) before testing device motion in later phases.

## Project layout

```
src/
  components/   # MagikBall, AnswerTriangle, …
  hooks/        # useShake, useOracleMachine, …
  lib/          # pickAnswer, rng, easterEgg
  data/         # answers (from ANSWERS.md)
  types/        # oracle.ts
```

## License

Personal portfolio project. Not affiliated with Mattel.
