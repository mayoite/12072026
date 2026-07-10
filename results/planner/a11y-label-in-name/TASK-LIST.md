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

- [x] **T0** Confirm all related unit queries (Prefs/Commands/Focus) match live aria — Focus unit updated; Prefs/Commands aria in TopBar + CommandsPaletteTrigger; no stale Maximize-only query in workspaceShell
- [x] **T1** Run targeted vitest workspaceShell — **31/31 PASS** — `vitest-workspaceShell.log`
- [ ] **T2** Re-run Lighthouse a11y on open3d planner; store report.json + notes
- [ ] **T3** Update OWNER-BOARD / 00-PENDING only if repo proof changes claims (after T2)
- [x] **T4** Docs/process commit + origin `ff662b9`; mayoite still 404 from agent
- [ ] **T5** SESSION-RECAP + phase close or HALF residual named

## Do not claim

- A11y clean site-wide  
- LH PASS without fresh report path  
