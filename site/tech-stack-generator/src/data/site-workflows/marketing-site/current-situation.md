# Marketing Site — Current Situation

**Lens:** using-superpowers — evidence first. Read live files + results/ before claiming state. Anti-copy: refers only; revise owners.

**Baseline date:** 2026-07-05 (per `docs/Lockedfiles/site/current.md`)

## Honest State (from reads + grep)

- Marketing lives in `site/app/(site)/` + `site/components/site/` + `site/lib/site-data/` (static copy + local catalog index).
- Chrome (header/footer/menu) in `site/components/site/`.
- Homepage blocks documented in `docs/architecture/SITE-MARKETING-UI-CONTRACT.md` (inventory of 8 sections).
- Uses next-intl (localePrefix: never), gsap/lenis/swiper for motion (marketing only).
- No hex in marketing components per contract (enforced via check:site-ui:dialect).
- Evidence refs: `results/site/` (oando-site runs), `site/tests/e2e/README.md` (marketing lanes), `results/site-ui/route-matrix.csv`.

## Gaps

- No dedicated `site-workflows/marketing-site/` existed before this creation (confirmed via list_dir + grep on generator/src/data).
- Marketing docs in tech-stack-generator are high-level only (see `src/pages/Workflows.tsx` common tasks; no module breakdown).
- Deferred per `SITE-MARKETING-UI-CONTRACT.md`: full dialect cleanup is UI-3 (post 1A/1B).
- Portal svg-catalog preview (Puck Render) is site-adjacent but owned by 1B (not accepted yet per Lockedfiles).
- Cross refs between lib/site-data and features/catalog exist but can blur "catalog" meaning (site vs planner).

## GS Application

- Evidence required before any "complete" claim on marketing flows (see superpowers spec §6 Global Standard Gate: benchmark report + anti-copy attestation + UI review).
- Anti-copy: marketing visuals must not replicate donor sites; cite 5-product model when benchmarking.
- Refer/revise: this file cites `docs/Lockedfiles/site/current.md` + `docs/Lockedfiles/site/proposed.md`; update those on real change, not here.

**No live gate run performed for this doc creation** (minimal scope). See Failures.md for active coverage items.
