# Generator Maintenance — Goal

**Targets (measurable, industry best + GS):**

- 100% of workflow data for site modules lives under src/data/site-workflows/<module>/* (this structure).
- Sync + gate always produce clean output; no hand edits to Documents/.
- Package coverage: expand per handbook (currently narrow; track in COVERAGE-REPORT).
- Commands consistent: npm.cmd on win for generator; pnpm at root.
- All changes have full evidence: json+log + exit codes in results/site/generator-maintenance/.
- Generator UI surfaces the new module workflows (future: update Workflows.tsx + data loaders to consume md or derived json).
- Best practice: conventional commits `chore(tech-stack-generator):`, test on edit.
- GS: any generator UI/UX change must pass global standard (benchmark, anti-copy, 5-product ref if visuals).
- Maintenance: this trio kept in sync with actual scripts/START; refer/revise owners first.

**Verifiable:**
- `pnpm run test:tech-stack` + `docs:gate:tech-stack` green with artifacts.
- list_dir shows complete structure for all 7 modules.
- Cross refs in generator CONTENTS/Readme updated only when owning docs change.
- Refer `site/tech-stack-generator/README.md` + root `Readme.md` + `docs/INDEX.md`.
