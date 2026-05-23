# Magik 8

Mobile-first PWA fortune ball — ask a yes/no question, shake (or tap), reveal the oracle.

## Documentation (AI-first)

All specs live in [`docs/`](./docs/). **Start:** [`docs/README.md`](./docs/README.md)

| Doc | Purpose |
|-----|---------|
| [WORKFLOW.md](./docs/WORKFLOW.md) | Multi-agent phases, context limits |
| [HANDOFF.md](./docs/HANDOFF.md) | Current phase status |
| [PRD.md](./docs/PRD.md) | Requirements (`REQ-*`) |
| [DESIGN-V2.md](./docs/DESIGN-V2.md) | Visual spec (tokens, motion, components) |

## Status

**Design V2 complete (D1–D8)** — core ritual, sensors, polish, share/PWA. Automated QA: Vitest (45) · Playwright (3) · Lighthouse mobile (`npm run test:lighthouse`). **Production deploy:** personal Vercel team [abhij0407s-projects](https://vercel.com/abhij0407s-projects) — follow **[`docs/DEPLOY-VERCEL.md`](./docs/DEPLOY-VERCEL.md)** (dashboard); then paste prod URL into [`HANDOFF`](./docs/HANDOFF.md) `deploy_url`.

**Git:** `main` pushed to GitHub. Prefer SSH remote: `git@github.com:abhi-j0407/magik-8.git` (HTTPS can hit wrong cached credentials).

Design reference pack (archived): [`magik-8_CLAUDE_DESIGN/`](./magik-8_CLAUDE_DESIGN/).

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

Open the HTTPS URL on your phone (same Wi‑Fi) before testing device motion.

## Project layout

```
src/
  components/   # MagikBall, AnswerTriangle, Wordmark, HUDStrip, …
  context/      # OracleContext, AudioContext
  hooks/        # useShake, useOracleMachine, useAudio, …
  lib/          # pickAnswer, rng, easterEgg, shareExport
  data/         # answers (from ANSWERS.md)
  types/        # oracle.ts
docs/           # PRD, DESIGN-V2, HANDOFF, …
magik-8_CLAUDE_DESIGN/  # design export (reference + exports)
```

## License

Personal portfolio project. Not affiliated with Mattel.
