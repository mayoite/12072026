# P06 Save Honesty — Evidence NOTES (live residual)

| Field | Value |
|-------|--------|
| **Phase** | P06 W5–W6 save honesty |
| **Evidence root** | `results/planner/world-standard-wave/06-save-honesty/` |
| **Date** | 2026-07-10 |
| **HEAD (scaffold write)** | `9d2f56ca9cd63f33108bd5c06b82bf99077e76ea` |
| **Agent** | P06-A8 (evidence scaffold + cloud cancel NOTES) |
| **Approach** | **A — local-first honesty** |
| **cloudEnabled** | **`false` (default)** |

---

## CP-06 status — DO NOT CLAIM PASS

**Verdict: NOT PASS / residual open.**

This pack is hygiene + status only. Presence of folders, unit logs, or partial chrome strings is **not** CP-06 green.

Live gate review (authoritative residual list):

- **`CODE-REVIEW-LIVE.md`** (same directory) — agent #1 re-proof; overall ~3.5/10 FAIL

Plan / execute:

- `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md`
- `plans1/P06-save-honesty/CODE-REVIEW-REPORT.md`
- `plans1/START-HERE.md` (kill order; Task 07 cancel rule)
- `plans1/CHECKLIST-MASTER.md` § P06

---

## Task 07 — Cloud wire: **CANCELLED**

| Item | Decision |
|------|----------|
| **Task 07 cloud autosave wire** | **CANCELLED** |
| **Reason** | `cloudEnabled=false`; **Approach A local-first** — open3d autosave stays browser IDB (`createAutoSaver` / `saveProject`) |
| **Not doing** | No half-wire of account autosave; no `memberPlanRepository` / `guestPromotion` as autosave path; no “Saving to account…” chrome while writes are local-only |
| **Unlock** | Only if **owner explicitly** unlocks Approach B / dual local+cloud in this phase |

Binding sources: `plans1/START-HERE.md` stricter rule #7; `CODE-REVIEW-LIVE.md` § Stop rules; plan Task 07 default cancel.

---

## Live residual status (honest)

### Landed (do not rebuild)

- Local IDB flush spine: `createAutoSaver` flush + `pendingSnapshot`, pagehide / unmount flush-before-cancel, explicit Save → `flushPersist`
- Partial W6 wording: “Saved locally” / “Saving … locally…” on some surfaces
- Unit continuity / session UUID envelope suites exist (see baseline JSON)
- Evidence **folder shell** under this path (this NOTES + scaffold)

### Still open (blocks CP-06)

| Residual | Why still red |
|----------|----------------|
| **W5 UUID hard-reload E2E** | Spec is furniture **count**-only; need wall + furniture **UUID** equality after hard reload |
| **`save-reload/` browser artifacts** | Directory exists; **no PNGs / no browser-run JSON** yet (see `save-reload/README.md`) |
| **Help / FAQ honesty** | `05-copy-grep.txt` shows **“named save slots” absent** and local-first copy present (parallel help work) — **do not treat as full W6** until dual surface + testids + toast + CP checklist closed |
| **Single label table + testids** | Labels unit residual run green (`02-labels-*`); dual chrome / `open3d-save-status` testids / toast may still be residual — re-prove vs product, not log alone |
| **projectRef + leave-latest envelope** | Flush/schedule must read latest project under thrash (not stale render closure) |
| **Write-proof / dual-surface / toast** | Residual product + units per `CODE-REVIEW-LIVE.md` TDD order |
| **Help unit suite** | **green-when-ready** in baseline JSON — copy grep ≠ full unit gate unless suite path is landed and green |

**Unit PASS ≠ W5 browser ≠ CP-06.** Continuity / autosave / labels units do not substitute for hard-reload id proof + help clean + dual-surface contract.

---

## Agent workstreams A1–A7

Point of truth for ordered residual slices: **`CODE-REVIEW-LIVE.md`** § “Residual list ordered for TDD”.

| Agent / stream | Slice (plan task) | Focus |
|----------------|-------------------|--------|
| **A1** | Task 00 scaffold ops (shared with A8 hygiene) | Pack dirs, NOTES, baseline JSON — **no product claim** |
| **A2** | Task 01 AutoSaver write-proof | `planner-autosave` mock write / flush / cancel / no silent drop |
| **A3** | Task 02 single label table | `workspaceStatusLabels` + forbidden bare Saved / cloud when `cloudEnabled=false` |
| **A4** | Task 03 hook `projectRef` | `useOpen3dWorkspaceAutosave` latest envelope; export storage/cloud/isLocalSaved; visibility listener cleanup |
| **A5** | Task 04 dual surface + testids + toast | TopBar + status bar same helper; success toast after flush ack |
| **A6** | Task 05 help honesty | `helpSections` rewrite + unit/grep artifact when ready |
| **A7** | Task 06 W5 UUID E2E + `save-reload/` PNGs | Hard reload UUID equality; browser-run under `save-reload/` |

| Stream | Slice | Focus |
|--------|-------|--------|
| **A8 (this file)** | Task 00 hygiene + **Task 07 cancel** | NOTES / baseline / `save-reload` pointer only; **no site/ edits**; **no fake PNGs** |
| **A10 (observed log)** | Residual unit re-run | `01-autosave-flush-run.json` / vitest logs — unit evidence only |

Do not treat parallel A* work as CP-06 closeout until W5 browser + W6 honesty checklist items are path-backed under this folder.

---

## Pack inventory (this machine)

| Path | Role | Status |
|------|------|--------|
| `NOTES.md` | This file — residual + cancel | Live |
| `CODE-REVIEW-LIVE.md` | Full residual / stop rules | Live FAIL review |
| `00-baseline-run.json` | Suites that **should** be green | Scaffold (honest expected list) |
| `01-autosave-flush-run.json` + `01-autosave-flush-vitest.log` | planner-autosave residual run | Present (unit only; A10 observed) |
| `02-labels-run.json` + `02-labels-vitest.log` | workspaceStatusLabels residual run | Present (unit only; 20 tests noted green) |
| `03-session-uuid-vitest.log` | open3dSession UUID envelope | Present (unit only) |
| `05-copy-grep.txt` | Help/copy forbidden-phrase grep | Present — help phrase fix evidence; not CP-06 |
| `save-reload/` | W5 browser artifacts | **Empty of PNGs** — pointer only: `save-reload/README.md` |
| `00-baseline-vitest.log` | Optional combined baseline tee | May be absent until Task 00 step 3 re-run |

---

## Claim rules

1. **Do not claim CP-06 PASS** from this scaffold.
2. **Do not claim W5** without UUID hard-reload proof + `save-reload/` screenshots / run JSON.
3. **Do not claim W6 complete** while help still sells account slots or dual surfaces drift.
4. **Task 07 remains CANCELLED** unless owner unlocks cloud.
5. Evidence only under repo-root `results/` — never `site/results/`.
