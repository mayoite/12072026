# Phase 00 — rebaseline (start from CP-00)

**Opened:** 2026-07-10  
**Head:** `Agents/Agents-ELON-STANDARD.md`  
**Why:** Owner — lots went wrong; start from 00. Repo is truth; paper PASS is hypothesis.  
**Not:** Re-implement all W gates from zero without evidence. **Is:** re-verify ground + matrix + fix known layout rot, then advance kill order honestly.

## Tasks

- [x] **00.0** Lock grain: one checkout, no worktrees, ELON head bar, Firecrawl dead
- [x] **00.1** Read `Plans/trustdata/00-START.md` + `INDEX.md` + `CHECKPOINTS.md`
- [x] **00.2** Confirm W0 unlock still recorded (Approach A + implementation unlock)
- [x] **00.3** Git remotes: origin + mayoite dual-account push proven (see Failures resolved)
- [x] **00.4** Evidence folder existence matrix (CP-00…10 + gate-e2e)
- [x] **00.5** `pnpm run check:layout` — **FAIL** `site/test-results` forbidden (fix in 00.6)
- [x] **00.6** Deleted forbidden `site/test-results` (stale e2e dump)
- [x] **00.7** `check:layout` **OK**
- [x] **00.8** `NOTES.md` + HEAD.txt
- [x] **00.9** Refresh `00-start/NOTES.md` (unlock still ACTIVE)
- [ ] **00.10** Next phase — owner: CP-10 pack vs residual re-proof vs continue a11y T2
- [x] **00.11** Commit + push origin + mayoite (this land)

## Stop-if-fail

- Cannot prove unlock in 00-START → stop product claims  
- Layout still red after 00.6–00.7 → do not claim clean tree  
- Do not mark CP-01…09 re-PASS without re-running their gates (existence ≠ green)  
