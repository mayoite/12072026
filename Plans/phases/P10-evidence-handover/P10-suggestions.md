# P10 suggestions — consistency review (planning expert)

**Date:** 2026-07-09  
**Plan:** `Plans/trustdata/phases/P10-evidence-handover/P10-evidence-handover.md`  
**Authority cross-check:** `INDEX.md` · `checkpoints/CHECKPOINTS.md` · `RESULTS-MAP.md` · `checklists/MASTER-CHECKLIST.md` · `00-START.md` · `AGENTS.md`

**Scope of this review:** Plan-doc only. No product code. No push.

---

## Consistency findings

| # | Severity | Finding | Source of truth | Suggested fix |
|---|----------|---------|-----------------|---------------|
| S1 | High | P10 soft-allows product work “if gate fails”; CP-10 / INDEX treat P10 as pack+backup only. Failures must **reopen owning phase**, not patch `site/` under P10. | INDEX P10 role; CP-10 evidence paths; user constraint **no product code** | Hard **Out of scope**: no `site/` edits in P10; reopen P03–P09 with owner if evidence missing |
| S2 | High | Dual `08-*` folders can be confused; P09 phase header still says `09-shortcuts-chrome/` while RESULTS-MAP / MASTER / CP-09 bind **W8 → `08-shortcuts-chrome/`** and **W7 → `08-mesh-quality/`**. | RESULTS-MAP rows; MASTER P08/P09; CP-08/CP-09 | Lock canonical paths in P10 W-gate table + explicit “do not invent `09-…`” note |
| S3 | High | MASTER sync steps only name W0–W8 + ethics + agent-ops; MASTER has **9 sections / 94 boxes** including Testing (T.*), Backup (B.*), Git (G.*), Non-claims (N.*). | MASTER-CHECKLIST tally + §§5–8 | Expand MASTER sync to all sections; require MASTER-SYNC.md tallies match § Tally |
| S4 | Med | No ordered Task 00+ runbook; other phases and AGENTS.md expect Task 00 Setup checklist. Commit cadence exists but order vs E: backup is easy to scramble. | AGENTS.md §8; AGENT-RULES commit slices; CP-10 | Add Task 00–06 sequence: preconditions → pack → W-GATES verify → MASTER → commits → E: backup → CP-10 mark |
| S5 | Med | Preconditions list W1–W8 only; CP-10 / MASTER also need **W0** + CP-00–CP-09 PASS/WAIVE before green. | CP-10 criterion (6); MASTER W0 | Preconditions: W0–W8 paths (or WAIVE); CP-00–09 status |
| S6 | Med | BACKUP-LOG “robocopy exit code” singular; procedure runs **multiple** robocopy/Copy-Item calls; MASTER B.5–B.6 need per-call outcomes + spot-check `INDEX.md` + `10-handover\README.md`. | MASTER B.1–B.7; RESULTS-MAP E: mirror | BACKUP-LOG schema: per-source exit code; 0–7 success; B.6 paths mandatory |
| S7 | Low | Missing Related footer to INDEX / CHECKPOINTS / RESULTS-MAP / MASTER (other phases link back). | INDEX related pattern | Add Related table |
| S8 | Low | Superpowers stated in banner but not as a Task 00 checkbox; user standing rule wants it explicit per phase. | AGENTS.md skills; MASTER A.1 | Task 00: superpowers + verification-before-completion loaded |

---

## Already correct (do not thrash)

- E: root `E:\OandO-backups\trustdata-YYYY-MM-DD\` matches CP-10 and MASTER B.2.
- Six handover files match CP-10 and RESULTS-MAP `10-handover/` minimum artifacts.
- Commit cadence four-slice model + **no push without ask** matches AGENTS.md / A.7–A.8 / G.3.
- W7 primary `08-mesh-quality/` already correct in draft W-gate table.
- No worktrees / main checkout `D:\OandO07072026` already stated.

---

## Apply order (for reviser)

1. S1 scope hard-stop (no product code).  
2. S2 canonical mesh/shortcuts paths.  
3. S3 full MASTER section sync + 94 tally.  
4. S4 Task 00–06 + commit/backup order.  
5. S5–S6 preconditions + BACKUP-LOG schema.  
6. S7–S8 Related + Expert revision note 2026-07-09.

**Status:** Applied into `phases/P10-evidence-handover/P10-evidence-handover.md` same day (see Expert revision note in that file).
