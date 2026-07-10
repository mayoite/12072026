# P11 — Integration / world-standard close-out / final gate (PlansA)

**Phase:** P11 (new — not in original P01–P10 set)  
**Type:** Checkbox-only execute board  
**Authority after residual:** `plans1/START-HERE.md` residual DONE + live `results/` + `AGENTS.md` (PlansA P11 = research copy only)  
**Date:** 2026-07-10  
**Merge:** plans1 buyer-journey + SHIP-HONESTY **plus** plans2 CROSSWALK + DUAL-LANGUAGE

---

## What P11 is

**P11 is not another feature phase.** It is the **integration and honesty close-out** after P01–P10 residual work:

1. **End-to-end buyer journey** — one serial story a buyer would recognize with **artifacts on disk for this HEAD**.
2. **Evidence pack integrity** — every RESULTS-MAP primary folder exists with **map-minimum** artifacts.
3. **Layout gate green** — `pnpm run check:layout` PASS.
4. **No false-green** — unit ≠ W browser; folder presence ≠ GATE PASS without map-min.
5. **Product package shippable honesty** — either honest **READY** or honest **NOT READY**. Never paper ship.
6. **Dual language** — GATE pack state ≠ buyer product ship (must not collapse).

**Evidence home for P11 meta:**

```
results/planner/world-standard-wave/11-integration-closeout/
```

(Alias note: plans2 used `11-world-standard-closeout/` — PlansA canonical is **`11-integration-closeout/`**. If an older pack used the plans2 name, point NOTES at this folder.)

---

## Prerequisites (P01–P10 residual DONE)

Do **not** start P11 until all of the following are true **on disk** (or explicitly owner-WAIVED with NOTES):

### Process

- [ ] Session zero complete (`plans1/00-START.md`)
- [ ] Brainstormer path discipline used: `archive/Idiots2/` + `archive/Idiots/` as needed
- [ ] No product thrash outside residual lists
- [ ] Fabric flag OFF for all W browser proofs
- [ ] Execute path was **plans1 only** (not PlansA, not dual plans2)

### Per-phase residual DONE (short form)

| Phase | Residual DONE means | Checkbox |
|-------|---------------------|----------|
| **P01** | `00-product-truth/` has non-empty INVENTORY + CONTRADICTIONS + smoke log | [ ] |
| **P02** | `01-engine-lock/` map-min + ENGINE-LOCK-RECORD + unit raw logs; OWNER A or DEFERRAL | [ ] |
| **P03** | `03-select-delete/` unit pack log **and** browser W3 artifacts | [ ] |
| **P07** | `02-browser-open3d-journey/` serial journey green: wall Δ + Opening + cabinet-v0 + second SKU + PNGs + playwright-run.json | [ ] |
| **P06** | `06-save-honesty/` + `save-reload/`: UUID reload proof; help honesty; labels dual-surface | [ ] |
| **P04** | `04-orbit-continuity/` three-layer audit + unit logs + browser orbit pack | [ ] |
| **P05** | `05-symbols-svg/` unit re-prove logs + prim-JSON/NOTES | [ ] |
| **P08** | `08-mesh-quality/` NOTES + visual smoke PNGs + run.json; G5 honest | [ ] |
| **P09** | `09-shortcuts-chrome/` aria residual closed + unfiltered vitest logs + run.json | [ ] |
| **P10** | `10-handover/` six files; Mode A FAIL-honest **or** Mode B only if all above true | [ ] |

---

## P11 checklist (executable)

### P11.0 — Scaffold

- [ ] Create `results/planner/world-standard-wave/11-integration-closeout/`
- [ ] Write `HEAD.txt` (`git rev-parse HEAD`)
- [ ] Write `DIRTY.txt` (`git status -sb`) or `CLEAN.txt`
- [ ] Write `NOTES.md` — purpose, date, agent, Fabric flag OFF confirmation
- [ ] Write `run.json` skeleton: `{ "phase": "P11", "status": "in-progress", "head": "…", "gates": {} }`

### P11.1 — Layout & dump hygiene

- [ ] Confirm no `site/results/` or `site/test-results/`
- [ ] Run: `pnpm run check:layout` — expect PASS
- [ ] Save raw log: `11-integration-closeout/check-layout-raw.log`

### P11.2 — Folder lock audit (RESULTS-MAP)

For each primary folder, assert **exists** and has map-minimum (not empty mkdir):

- [ ] `00-product-truth/` — INVENTORY.md, CONTRADICTIONS.md
- [ ] `01-engine-lock/` — NOTES.md (+ richer pack if required)
- [ ] `02-browser-open3d-journey/` — run/playwright-run.json + raw log + screenshots 01–N
- [ ] `03-select-delete/` — run.json + vitest raw + browser when claimed
- [ ] `04-orbit-continuity/` — run.json + screenshots + console excerpt
- [ ] `05-symbols-svg/` — run.json/vitest + PNG or prim-JSON + NOTES honesty
- [ ] `06-save-honesty/` — run.json + logs; prefer `save-reload/` for W5
- [ ] `08-mesh-quality/` — NOTES.md + screenshots + optional vitest
- [ ] `09-shortcuts-chrome/` — run.json + keyboard/vitest logs
- [ ] `10-handover/` — six files: README, W-GATES, MASTER-SYNC, HEAD, FAILURES-SNIP, BACKUP-LOG

Forbidden as canonical claim?

- [ ] No `01-product-truth/` as live claim
- [ ] No `02-engine-lock/` as P02 claim
- [ ] No `08-shortcuts-chrome/` as W8 claim
- [ ] Write `FOLDER-LOCK-AUDIT.md` with path:exists:min-ok matrix

### P11.3 — CROSSWALK (disk re-read)

- [ ] Write `CROSSWALK.md`: each W0–W8 / CP → folder → status → path re-read **this session** (not memory)

### P11.4 — False-green scan

- [ ] Grep/read `10-handover/W-GATES.md` — any GATE PASS without map-min on **this HEAD** → rewrite to FAIL or re-prove
- [ ] Confirm W5 claims are **UUID-level** not count-only
- [ ] Confirm journey does **not** treat configurator/chair as W2 sole green
- [ ] Confirm W3 not claimed from unit-only
- [ ] Confirm W7 not claimed from units alone without NOTES/visual
- [ ] Confirm W8 not claimed without aria residual closed
- [ ] Confirm research / PENDING / phase cards not used as PASS proof
- [ ] Write `FALSE-GREEN-SCAN.md`

### P11.5 — Cross-cutting integration asserts

- [ ] Fabric flag **not** required ON for any claimed W2/W3 symbol/select proof
- [ ] Furniture document rotation remains **degrees**
- [ ] Orbit claims cite three-layer not “unit default only”
- [ ] SVG triple-path honesty: Block2D ≠ publish svg-catalog ≠ mesh footprint string
- [ ] Save labels never bare “Saved” / account cloud when only IDB
- [ ] Dimension key **M**, Door **D**
- [ ] Journey place path is **not** configurator-only for CP-07 claim
- [ ] Unit-alone never marks W3 or browser W1–W2

### P11.6 — Cross-gate unit re-prove (unfiltered)

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\11-integration-closeout\unit\open3d-unit-raw.log
```

Optional focused packs if full open3d too heavy: W3 delete/pick/keyboard · W4 orbit/pose · W5 saveReloadContinuity · W7 modularCabinetV0 · W8 toolShortcutTruth · W2 cabinet-v0.

- [ ] Exit code recorded in `unit/open3d-unit-run.json`
- [ ] No silent skip; no `--silent` for sign-off

### P11.7 — Buyer journey browser pack (serial)

**Minimum story:**

1. Enter guest/open3d workspace (storage clear when guest)
2. Draw wall(s) — metric Δ
3. Place Opening/door — objects Δ on a wall that exists
4. Place **cabinet-v0** + second real SKU
5. Select furniture → Delete → Undo (W3)
6. Toggle 2D|3D → orbit enabled attr (W4)
7. Save → hard reload → **same entity UUIDs** (W5)
8. Status/help does not claim cloud slots when cloud off (W6 spot-check)
9. Tool label matches key (M=dimension, D=door) (W8)
10. 3D readable multi-part cabinet screenshot (W7 visual)

```powershell
cd D:\OandO07072026
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
pnpm --filter oando-site run test:e2e:open3d-world
# and/or journey-specific script from P07 residual
```

- [ ] Serial mode / no parallel PNG race
- [ ] Artifacts under `11-integration-closeout/buyer-journey/` **and/or** pointer NOTES to canonical W folders
- [ ] Screenshots named `01-…` … `N-…` (non-blank)
- [ ] `buyer-journey/playwright-run.json`
- [ ] `buyer-journey/IDENTITY.md` — how UUIDs / cabinet identity were proven

### P11.8 — DUAL-LANGUAGE.md

Write explicit statements that must not collapse:

```markdown
# DUAL-LANGUAGE
## GATE pack state
- (list W gates GREEN/OPEN/FAIL from CROSSWALK)

## Buyer product ship
- READY only if SHIP-HONESTY READY criteria met
- NEVER claim "world-standard product complete" from pack files alone
```

- [ ] DUAL-LANGUAGE written and consistent with SHIP-HONESTY

### P11.9 — Handover consistency

- [ ] Re-read `10-handover/README.md` — points at live folders only
- [ ] `W-GATES.md` rows match FOLDER-LOCK-AUDIT
- [ ] `MASTER-SYNC.md` honest if MASTER missing
- [ ] `HEAD.txt` matches P11 HEAD
- [ ] `FAILURES-SNIP.md` does not re-certify dead paths as live
- [ ] `BACKUP-LOG.md` records any E: use with remap honesty

### P11.10 — Static gates

```powershell
cd D:\OandO07072026
pnpm run typecheck 2>&1 | Tee-Object results\planner\world-standard-wave\11-integration-closeout\typecheck-raw.log
pnpm run lint 2>&1 | Tee-Object results\planner\world-standard-wave\11-integration-closeout\lint-raw.log
```

- [ ] typecheck exit recorded
- [ ] lint exit recorded

### P11.11 — Exit criteria decision

Fill `11-integration-closeout/SHIP-HONESTY.md`:

```markdown
# SHIP-HONESTY
- Date:
- HEAD:
- Layout gate: PASS | FAIL
- All RESULTS-MAP primaries map-min: YES | NO (list gaps)
- Buyer journey: PASS | FAIL | PARTIAL
- False-green scan: CLEAN | ISSUES (list)
- Decision: READY | NOT READY
- Residual (if NOT READY):
  - …
- Owner WAIVEs (if any):
  - …
```

#### READY requires **all**

- [ ] Layout PASS
- [ ] All primary W folders map-min on this HEAD
- [ ] Buyer journey pack PASS with identity honesty
- [ ] False-green scan CLEAN (or only owner-WAIVED rows)
- [ ] P10 six-file pack consistent with READY
- [ ] No open blocking residual from P06 help/UUID, P07 identity, P09 aria, P08 visual

#### NOT READY is valid ship-honesty

- [ ] Document residual; do **not** mark phase cards PASS to hide gaps

### P11.12 — Closeout

- [ ] Finalize `run.json` status: `ready` | `not-ready` | `blocked`
- [ ] Commit landable evidence + residual code
- [ ] Push origin when green enough not to strand remote
- [ ] Mayoite mirror if ~45m / big land
- [ ] SESSION-RECAP / Failures note if process requires

---

## Exit criteria modes

### Mode A — Honest close (results partial)

| Criterion | Pass |
|-----------|------|
| CROSSWALK lists every gate with real status | Yes |
| No GREEN without path re-read | Yes |
| Dual language refuses product ship if gates incomplete | Yes |
| Integration smoke attempted | Yes |
| CP-11 “PASS product” **not** claimed | Yes |

### Mode B — Wave residual closed (gates green)

| Criterion | Pass |
|-----------|------|
| All gate map-mins green or owner WAIVE | Yes |
| Cross-cutting asserts hold | Yes |
| Unit re-smoke green | Yes |
| Browser journey still green on this HEAD | Yes |
| Dual language: gate closed **and** product residual explicit | Yes |

**Still never equals:** photoreal product, Fabric full walls, multiplayer, competitor feature parity.

**Honesty rule:** Prefer **NOT READY** over paper READY.

---

## Stop-if-fail

| Fail | Action |
|------|--------|
| Claiming Mode B with missing map-minimum folders | Reopen owning phase |
| Collapsing GATE PASS into “product finished” | Rewrite DUAL-LANGUAGE |
| Editing product code under P11 label for gate fixes | Stop; reopen P0X |
| Filtering test logs | FAIL integrity |
| Using E: historical PASS as live re-proof without restore + re-run | Mark historical-only |

---

## Commands summary

| Step | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Unit spine | `cd site; pnpm exec vitest run tests/unit/features/planner/open3d --reporter=verbose` |
| Open3d world e2e | `pnpm --filter oando-site run test:e2e:open3d-world` |
| Typecheck | `pnpm run typecheck` |
| Lint | `pnpm run lint` |

---

## References

| Need | Source |
|------|--------|
| Residual tasks | [EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md) |
| Merge decisions | [MERGE-NOTES.md](./MERGE-NOTES.md) |
| Session zero | [00-START.md](./00-START.md) |
| Folder lock | `Plans/Research/RESULTS-MAP.md` |
| Design W1–W8 | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| plans1 P11 (buyer-heavy) | `plans1/P11-CHECKLIST.md` |
| plans2 P11 (crosswalk-heavy) | `plans2/P11-CHECKLIST.md` |
