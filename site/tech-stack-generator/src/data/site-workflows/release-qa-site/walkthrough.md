# Release & QA Site Walkthrough

Canonical path from local change to production with full evidence for site surfaces.

1. Local gate: typecheck + lint + test relevant scope. Use evidence wrapper scripts. (pnpm --filter oando-site run test:unit)
2. Full release gate: Per START.md + Failures.md. Captures all artifacts under results/. (pnpm run release:gate)
3. Tech docs sync: Regenerate + build tech-stack to validate rendered workflows. (pnpm run docs:build:tech-stack)
4. Screenshots & a11y: Playwright + MCP lighthouse runs. Attach to gate evidence.

Current: Gates exist and are wired. Evidence policy is enforced by testing-handbook. Some pre-existing lint in unrelated files.

Goal: Zero tolerance on missing artifacts. Every workflow module has live visual proof + declared skips only.

InstructionsNote: Never bypass reporters. Log to Failures.md before claiming ship-ready.