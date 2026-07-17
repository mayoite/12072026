# Tech stack — blocker

**Date:** 2026-07-17  
**Status:** OPEN — stack not release-healthy

## Blocker

**Full typecheck / lint / test / release:gate are not green.**

## Fixed (CI install)

**pnpm/action-setup “Multiple versions of pnpm specified”** — workflows had both `version: 11.13.0` and root `packageManager: pnpm@11.13.0+sha512…`. Action treats those as two pins. Fix: drop explicit `version` in all workflows; Corepack uses `package.json` only.

## Still open

- Product typing residual (`PlannerFabricStage` TS2345; `publishDescriptorWithPipeline` DEFAULT_DEPS omit list if still failing)
- Full unit / build / a11y / coverage in `release:gate`

## Why open

- Lockfile/CI pins and gates are release bar (`plan/TechStack/COMPLETION-CONTRACT.md`)  
- Product track failures still fail monorepo gates  

## Not this file

Engines/deps facts: `docs/Lockedfiles/03-dependencies-engines-current.md`.  
SVG cutover: `Failures.md` (Admin).
