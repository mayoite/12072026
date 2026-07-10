# CP-00 rebaseline — NOTES

**Date:** 2026-07-10  
**Agent:** head (Grok) under `Agents/Agents-ELON-STANDARD.md`  
**Owner ask:** start from 00 after process/git confusion  

## 00.2 Unlock (repo + plan)

| Criterion | Result |
|-----------|--------|
| `Plans/trustdata/00-START.md` Approach A checked | **YES** |
| Implementation unlock recorded | **YES** |
| Evidence `00-start/NOTES.md` | Present (prior HEAD `f31c35c`) |
| Re-ask owner unlock? | **NO** — still ACTIVE |

## 00.3 Git / backup

| Item | Result |
|------|--------|
| Checkout | `D:\OandO07072026` only |
| Worktrees | none in use |
| origin | `pglcarpets/Codex07072026` — push works as **pglcarpets** |
| mayoite | `mayoite/OandO07072026` — push works as **mayoite** |
| Dual-account | Must `gh auth switch` per remote (documented in Failures resolved) |

## 00.4 Evidence folder matrix (existence only — not re-run PASS)

| Folder | Exists | NOTES | run.json | File count | Paper CP status |
|--------|--------|-------|----------|------------|-----------------|
| `00-start/` | Y | Y | N | 1 | CP-00 PASS (unlock text) |
| `00-product-truth/` | Y | Y | Y | 34 | CP-01 PASS |
| `01-engine-lock/` | Y | Y | Y | 14 | CP-02 PASS |
| `03-select-delete/` | Y | Y | Y | 9 | CP-03 PASS |
| `04-orbit-continuity/` | Y | Y | N* | 16 | CP-04 PASS (*browser-run.json present) |
| `05-symbols-svg/` | Y | N root | N root | 39 | CP-05 PASS (nested SUMMARY/CP-05.json) |
| `06-save-honesty/` | Y | Y | N | 7 | CP-06 PASS (save-reload has run) |
| `02-browser-open3d-journey/` | Y | Y | Y | 10 | CP-07 PASS |
| `08-mesh-quality/` | Y | Y | Y | 9 | CP-08 PASS |
| `09-shortcuts-chrome/` | Y | Y | N | 5 | CP-09 PASS (logs present) |
| `10-handover/` | **N** | N | N | 0 | **CP-10 OPEN** |
| `gate-e2e/` | Y | Y | Y | 8 | Related pack |

**Honesty:** This matrix proves **folders exist**, not that every gate is still green on current HEAD. Full re-proof = later tasks per CP, not claimed here.

## 00.5–00.7 Layout

| Check | Result |
|-------|--------|
| `pnpm run check:layout` first run | **FAIL** — `site/test-results` present |
| Action | Deleted stale Playwright dump under `site/test-results` (2 files, error-context only) |
| Re-run | **OK** — no forbidden site/ paths |

## Doc contradictions (do not ignore)

| Doc | Says | ELON/AGENTS says |
|-----|------|------------------|
| `CHECKPOINTS.md` line ~7 | “push only on owner ask” | Push origin when green; mayoite ~45m — **agent call** |
| TRUTH-LOCK / boards | CP-00…09 PASS | Existence pack only until re-run; treat as **hypothesis** if claiming ship |

**Resolution for this phase:** Follow **AGENTS.md + Agents-ELON-STANDARD.md** for git. Treat CHECKPOINTS push line as **stale** — fix in a later docs task (do not expand master plan now).

## Licenses path

`ayushdocs/17-LICENSES-CLEARED.md` **exists** (CP-00 ethics path known). Firecrawl = historical only / dead for active work.

## What went wrong (session honesty)

1. Process docs thrash before product  
2. mayoite 404 = wrong gh account, not missing repo  
3. Forbidden `site/test-results` left layout red  
4. A11y phase started mid-flight without 00 ground pass  
5. Paper PASS boards outrun live re-proof  

## Next (after 00 close)

Kill order remaining real work:

1. **CP-10** `10-handover/` still missing (program pack)  
2. **Residuals** (a11y LH, etc.) — secondary unless owner prioritizes  

Or continue sequential **re-proof** CP-01→… if owner wants full rebaseline of every gate (days of work).

## Status this phase

| Item | Bar |
|------|-----|
| CP-00 unlock still valid | **PASS** (plan + notes) |
| Layout clean | **PASS** after delete |
| Dual remote backup procedure | **PASS** (accounts functional) |
| Full W1–W8 re-run on HEAD | **NOT DONE** — not claimed |
| CP-10 | **OPEN** |
