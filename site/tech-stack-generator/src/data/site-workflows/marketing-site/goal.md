# Marketing Site — Goal

**Targets (measurable, industry best):**

- 100% of marketing copy and nav trees owned in `lib/site-data/` (SSG friendly). Current: partial per site-data CONTENTS.
- Zero hex literals in marketing components (enforced; see CSS-SOLUTION.md + dialect check).
- Full route matrix coverage in `results/site-ui/route-matrix.csv` regenerated on changes.
- E2E nav + a11y pass for marketing routes (Playwright lanes in `site/tests/e2e`).
- i18n parity for all marketing strings (messages/*.json + test mocks).
- Industry best: Follow conventional commits scoped to marketing (e.g. `feat(marketing): ...`); trunk-based per current Workflows.tsx git flow.
- GS alignment: Before claiming "industry standard marketing site", produce dated benchmark report citing `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md` + 5-product reference + anti-copy attestation.
- Tech-stack docs: Module workflows surfaced via site-workflows/marketing-site/ + generator render (target: linked from /workflows page).

**Success criteria (verifiable):**
- `pnpm run docs:check:tech-stack` passes including any new workflow data.
- Live dev + `test:e2e:nav` shows no regressions in hero/collections sections.
- All screenshots + evidence captured under `results/site/marketing-site/`.

Refer to `docs/Lockedfiles/site/proposed.md` for target policy. Update this when measurable deltas land.
