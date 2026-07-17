# Planner — blocker

**Date:** 2026-07-17  
**Status:** OPEN — deploy not ready

## Blocker

**Browser acceptance of the commercial loop is missing.**

Unit work landed (draw/grips, catalog family/compare, validation, BOQ/handoff, underlay, shell, conflict helpers). Without a fresh Chromium proof of:

guest/member → draw/place → Review → branded BOQ → Send to Oando  

(and grip/opening/inventory UI), Planner cannot claim completion or release.

## Why open

- Unit ≠ browser (COMPLETION-CONTRACT)  
- Full `pnpm run test` / `release:gate` not green as release proof  

## Not this file

Plan checklists: `plan/Planner/FINISH-PLAN.md`.  
Contract: `plan/Planner/COMPLETION-CONTRACT.md`.  
Active repo cutover (SVG): `Failures.md` (Admin-owned; affects Planner catalog read).
