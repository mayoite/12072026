# Phase temp task list — a11y label-in-name

**Phase:** a11y chrome residual (label-in-name + re-proof)  
**Head bar:** `Agents/Agents-ELON-STANDARD.md`  
**Opened:** 2026-07-10  
**Goal unchanged:** buyer-usable planner; honest a11y, not paper PASS  
**Package ownership:** single-writer on planner chrome (`site/features/planner/open3d/...`)

## Repo truth (opening)

| Claim | Status |
|-------|--------|
| TopBar Focus aria | **Code present:** `Focus — maximize canvas` (`TopBar.tsx`) |
| Prefs aria | **Code present:** `Prefs — open preferences menu` |
| Commands trigger | **Code present:** `Commands (Ctrl+K)` |
| Unit maximize query | **Updated:** `workspaceShell.test.tsx` matches Focus — |
| Post-fix Lighthouse | **OPEN** — need fresh LH under this folder or `results/planner/` |
| OWNER-BOARD / 00-PENDING text | May still say uncommitted / old unit name — **stale claims** |

## Tasks

- [ ] **T0** Confirm all related unit queries (Prefs/Commands/Focus) match live aria
- [ ] **T1** Run targeted vitest for workspace shell / topbar a11y; log under this folder
- [ ] **T2** Re-run Lighthouse a11y on open3d planner (or document blocker); store report.json + notes
- [ ] **T3** Update OWNER-BOARD / 00-PENDING only if repo proof changes claims
- [ ] **T4** Commit + push origin; try mayoite (log if 404)
- [ ] **T5** SESSION-RECAP + phase close or HALF residual named

## Do not claim

- A11y clean site-wide  
- LH PASS without fresh report path  
