# Phase checklist (00–10)

Date: 2026-07-07 (rev session 07)

**Planner work:** repo-root [`Plans.md`](../../../Plans.md) · conduct: [`AGENTS.md`](../../../AGENTS.md) · open items: [`00Failures.md`](00Failures.md)

**Proof order:** live check first; stale `[x]` loses to fresh evidence.

---

## Snapshot

| Phases | Done | Open |
|--------|------|------|
| 00 | precheck 6/7 | `00-PRE-06` git clean, Accepted sign-off |
| 01–03 | primary checks | — |
| 04–06 | Implemented, verification pending | `0412` browser soak; release `0408`/`0410`/`0413` |
| 07 | Implemented, verification pending | cross-matrix live soak; `0412` |
| 08–10 | not started | — |

PLAN-FAIL open: `0408` · `0410` · `0412` · `0413` — see [`00Failures.md`](00Failures.md)

**Session evidence (2026-07-07):** `results/site/phase-04|05|06|07/` (vitest + http-probe); not **Verified in staging** until `0412` closes.

---

## Phase 00 precheck

| ID | Item | Status |
|----|------|--------|
| `00-PRE-01` | Lockfile / pins | ☑ |
| `00-PRE-02` | No forbidden `any`/bypass | ☑ |
| `00-PRE-03` | Workspace + validate-launch-env | ☑ |
| `00-PRE-04` | Governance pack on disk | ☑ |
| `00-PRE-05` | R2 bucket in I-D | ☑ |
| `00-PRE-06` | Git clean at boundary | ☐ |
| `00-PRE-07` | `AGENTS.md` is conduct authority | ☑ |

---

## Phases 01–10

`[x]` = evidence on record · `[ ]` = open

### 01 — Engine lock · Done
- [x] `01-INST-00` · [x] `01-WORK-04`

### 02 — BlockDescriptor · Verified
- [x] `02-CAT-01` · [x] `02-LOAD-01` · [x] `02-ERR-01` · [x] `02-CAT-02`…`11`

### 03 — SVG pipeline · Verified
- [x] `03-SVG-01` · [x] `03-SVG-GS-01` · [x] `03-TEST-01`

### 04 — Admin editor · Implemented, verification pending
- [x] `04-ADMIN-01` · [x] `04-ADMIN-02` · [x] `04-ADMIN-09`
- Evidence: `results/site/phase-04/vitest/` (71/71) · `results/site/phase-04/http-probe/`

### 05 — Portal · Implemented, verification pending
- [x] `05-PORT-01` · [x] `05-PORT-02` · [x] `05-PORT-09`
- Evidence: `results/site/phase-05/vitest/` · `results/site/phase-05/http-probe/`

### 06 — Inventory · Implemented, verification pending
- [x] `06-INV-01` · [x] `06-INV-05` · [x] `06-TEST-01`
- Evidence: `results/site/phase-06/vitest/` (14/14) · `results/site/phase-06/http-probe/`

### 07 — Auth · Implemented, verification pending
- [x] `07-AUTH-01` · [x] `07-AUTH-04` · [x] `07-AUTH-09`
- Evidence: `results/site/phase-07/vitest/` (49/49) · `results/site/phase-07/http-probe/`

### 08 — Persistence · Planned
- [ ] `08-PERS-04` · [ ] `08-PERS-10` · dual-read · `0409` deferred

### 09 — 3D / export / AI · Planned
- [ ] `09-3D-01` · [ ] `09-EXP-04` · [ ] `09-AI-03`

### 10 — Route swap · Planned
- [ ] `10-FLAG-01` · [ ] `10-ROLL-01` · [ ] `10-HAND-01`

### Release only (not per phase slice)
- [ ] `0408` coverage · `0410` lint · `0413` full vitest · `0412` browser

---

## Links

`Plans.md` · `AGENTS.md` · `00-handover-routing.md` · `01-implementation-decisions.md` · `00Failures.md`
