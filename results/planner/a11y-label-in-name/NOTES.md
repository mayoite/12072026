# A11y label-in-name — phase close

**Date:** 2026-07-10  
**HEAD:** see git tip at commit  
**Call:** head chose this residual after GATE≠product honesty pass  

## What was wrong

Old Lighthouse (`quality-wave-agents/a11y/`) scored **98** with **`label-content-name-mismatch` fail** on pre-fix strings (`Maximize canvas` / prefs / command palette labels that did not match visible text).

## Repo truth (code + unit)

| Control | Accessible name |
|---------|-----------------|
| Focus | `Focus — maximize canvas` |
| Prefs | `Prefs — open preferences menu` |
| Commands | `Commands (Ctrl+K)` |
| Unit | `workspaceShell.test.tsx` 31/31 — `vitest-workspaceShell.log` |

## Fresh Lighthouse (T2)

| Field | Value |
|-------|--------|
| URL | `http://localhost:3000/planner/guest/?plannerDevTools=1` |
| Mode | desktop, accessibility only, headless Chrome |
| Command | `npx lighthouse … --only-categories=accessibility` |
| Artifacts | `lh-open3d-guest.report.json` · `lh-open3d-guest.report.html` |
| **categories.accessibility.score** | **1.0** (100) |
| **label-content-name-mismatch.score** | **1** (pass; no items) |

## Claim bar

| Claim | Bar |
|-------|-----|
| Label-in-name residual for this chrome path | **PASS** (fresh LH) |
| Site-wide a11y clean | **NOT claimed** |
| Product finished | **NOT claimed** |

## Residual chrome (not this phase)

H1→H3 order, 0×0 mobile toggles, status landmark — still open if they appear in other audits; not this kill.
