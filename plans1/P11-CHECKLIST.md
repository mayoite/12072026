# P11 — Integration / world-standard close-out / final gate

**Phase:** P11 (new — not in original P01–P10 idiotplanners set)  
**Type:** Checkbox-only execute board  
**Authority after residual:** `plans1/EXECUTABLE-PLAN.md` residual DONE + live `results/` + `AGENTS.md`  
**Date:** 2026-07-10

---

## What P11 is

**P11 is not another feature phase.** It is the **integration and honesty close-out** after P01–P10 residual work:

1. **End-to-end buyer journey** — one serial story a buyer would recognize (guest open → draw → place cabinet-v0 → select/delete/undo → 2D↔3D orbit → save/reload identity → shortcuts match labels → mesh parts readable) with **artifacts on disk for this HEAD**.
2. **Evidence pack integrity** — every RESULTS-MAP primary folder exists with **map-minimum** artifacts; no empty-folder theater; no `site/results/` dumps.
3. **Layout gate green** — `pnpm run check:layout` PASS with honest root `results/`.
4. **No false-green** — unit ≠ W browser; folder presence ≠ GATE PASS without map-min; research scores ≠ W proof; phase-card PASS ≠ disk; historical E:/git packs ≠ live HEAD proof unless re-verified.
5. **Product package shippable honesty** — either honest **READY** (all W map-min green + buyer journey pack) or honest **NOT READY** with residual list. Never paper ship.

**Evidence home for P11 meta:**

```
results/planner/world-standard-wave/11-integration-closeout/
```

(Plus re-use of existing W folders — do not duplicate W proofs under 11- only; 11 holds the **integration index** and cross-gate run records.)

---

## Prerequisites (P01–P10 residual DONE)

Do **not** start P11 until all of the following are true **on disk** (or explicitly owner-WAIVED with NOTES):

### Process

- [ ] Session zero complete (`plans1/00-START.md`)
- [ ] Brainstormer path discipline used: `archive/Idiots2/` only
- [ ] No product thrash outside residual lists in CODE-REVIEW reports
- [ ] Fabric flag OFF for all W browser proofs

### Per-phase residual DONE (short form)

| Phase | Residual DONE means | Checkbox |
|-------|---------------------|----------|
| **P01** | `00-product-truth/` has non-empty `INVENTORY.md` + `CONTRADICTIONS.md` + smoke log; ready-for-review or pass | [ ] |
| **P02** | `01-engine-lock/` map-min + ENGINE-LOCK-RECORD + unit raw logs; OWNER Template A **or** explicit DEFERRAL NOTES | [ ] |
| **P03** | `03-select-delete/` unit pack log **and** browser W3 artifacts; not unit-only | [ ] |
| **P07** | `02-browser-open3d-journey/` serial journey green: wall Δ + Opening + cabinet-v0 + second SKU + PNGs + playwright-run.json; **no** configurator sole green; identity honest | [ ] |
| **P06** | `06-save-honesty/` + `save-reload/`: UUID (not count-only) reload proof; help honesty; labels dual-surface | [ ] |
| **P04** | `04-orbit-continuity/` three-layer audit + unit logs + browser orbit pack (console contract honest) | [ ] |
| **P05** | `05-symbols-svg/` unit re-prove logs + prim-JSON/NOTES; **no** geometry thrash | [ ] |
| **P08** | `08-mesh-quality/` NOTES + visual smoke PNGs + run.json; G5 story honest; **no** toe rewrite if units green | [ ] |
| **P09** | `09-shortcuts-chrome/` aria-keyshortcuts residual closed + unfiltered vitest logs + run.json | [ ] |
| **P10** | `10-handover/` six files exist; Mode A FAIL-honest **or** Mode B only if all above true; never empty PASS | [ ] |

Full residual task lists: [EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md).

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
- [ ] Run: `pnpm run check:layout`  
  **Expected:** PASS (exit 0)
- [ ] Save raw log: `11-integration-closeout/check-layout-raw.log`
- [ ] Confirm all evidence under repo-root `results/` only

### P11.2 — Folder lock audit (RESULTS-MAP)

For each primary folder, assert **exists** and has map-minimum (not empty mkdir):

- [ ] `00-product-truth/` — INVENTORY.md, CONTRADICTIONS.md
- [ ] `01-engine-lock/` — NOTES.md (+ richer pack if phase required)
- [ ] `02-browser-open3d-journey/` — run/playwright-run.json + raw log + screenshots 01–N
- [ ] `03-select-delete/` — run.json + vitest raw + browser when claimed
- [ ] `04-orbit-continuity/` — run.json + screenshots + console excerpt
- [ ] `05-symbols-svg/` — run.json/vitest + PNG or prim-JSON + NOTES honesty
- [ ] `06-save-honesty/` — run.json + logs; prefer `save-reload/` for W5
- [ ] `08-mesh-quality/` — NOTES.md + screenshots + optional vitest
- [ ] `09-shortcuts-chrome/` — run.json + keyboard/vitest logs
- [ ] `10-handover/` — six files: README, W-GATES, MASTER-SYNC, HEAD, FAILURES-SNIP, BACKUP-LOG

Forbidden present as “canonical”?

- [ ] No `01-product-truth/` as live claim
- [ ] No `02-engine-lock/` as P02 claim
- [ ] No `08-shortcuts-chrome/` as W8 claim
- [ ] Write `FOLDER-LOCK-AUDIT.md` with path:exists:min-ok matrix

### P11.3 — False-green scan

- [ ] Grep/read `10-handover/W-GATES.md` — any GATE PASS without map-min on **this HEAD** → rewrite to FAIL or re-prove
- [ ] Confirm W5 claims are **UUID-level** not count-only (`06-save-honesty` NOTES)
- [ ] Confirm journey does **not** treat configurator/chair as W2 sole green
- [ ] Confirm W3 not claimed from unit-only or P07 journey folder alone
- [ ] Confirm W7 not claimed from units alone without NOTES/visual
- [ ] Confirm W8 not claimed without aria residual closed
- [ ] Confirm research / PENDING / phase cards not used as PASS proof
- [ ] Write `FALSE-GREEN-SCAN.md` listing traps checked + result

### P11.4 — Cross-gate unit re-prove (unfiltered)

Run and tee raw logs under `11-integration-closeout/unit/`:

```powershell
cd D:\OandO07072026\site

# Representative spine (adjust if paths move — prefer existing suites)
pnpm exec vitest run `
  tests/unit/features/planner/open3d `
  --reporter=verbose 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\11-integration-closeout\unit\open3d-unit-raw.log"
```

- [ ] Exit code recorded in `unit/open3d-unit-run.json`
- [ ] No silent skip; no `--silent` for sign-off
- [ ] Failures triaged: fix residual **or** mark honest FAIL in P11 NOTES (do not hide)

Optional focused packs if full open3d too heavy:

- [ ] W3: applySelectionDelete + pick + keyboard
- [ ] W4: orbit + pose
- [ ] W5: saveReloadContinuity + label suites
- [ ] W7: modularCabinetV0 + GlbExport (+ honest meshStages story)
- [ ] W8: toolShortcutTruth + keyboard + rail a11y
- [ ] W2 symbols: cabinet-v0 + renderBlock2D

### P11.5 — Buyer journey browser pack (serial)

**Goal:** One honest end-to-end path on open3d or guest with Fabric OFF.

Minimum story (can be one Playwright project or ordered specs):

1. Enter guest/open3d workspace (storage clear when guest)
2. Draw wall(s) — **metric Δ** not absolute seed
3. Place Opening/door — **objects Δ** on a wall that exists
4. Place **cabinet-v0** + second real SKU (not configurator sole green)
5. Select furniture → Delete → Undo (W3)
6. Toggle 2D|3D → orbit enabled attr (W4)
7. Save → hard reload → **same entity UUIDs** (W5)
8. Status/help does not claim cloud slots when cloud off (W6 spot-check)
9. Tool label matches key (spot-check M=dimension, D=door) (W8)
10. 3D readable multi-part cabinet (screenshot) (W7 visual)

Commands (prefer existing scripts):

```powershell
cd D:\OandO07072026
# Ensure env Fabric OFF
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue

pnpm --filter oando-site run test:e2e:open3d-world
# and/or journey-specific script if added in P07 residual
```

- [ ] Serial mode / no parallel PNG race for the story
- [ ] Artifacts under `11-integration-closeout/buyer-journey/` **and/or** pointer NOTES to canonical W folders used
- [ ] Screenshots named `01-…` … `N-…` (non-blank)
- [ ] `buyer-journey/playwright-run.json` with exit 0 only after asserts
- [ ] `buyer-journey/IDENTITY.md` — how UUIDs / cabinet identity were proven (not body-text theater)

### P11.6 — Handover consistency

- [ ] Re-read `10-handover/README.md` — points at live folders only
- [ ] `W-GATES.md` rows match FOLDER-LOCK-AUDIT (no “PASS not re-run on HEAD”)
- [ ] `MASTER-SYNC.md` honest about missing MASTER file if still absent
- [ ] `HEAD.txt` matches P11 HEAD
- [ ] `FAILURES-SNIP.md` does not re-certify dead Failures.md paths as live
- [ ] `BACKUP-LOG.md` records any E: use with remap honesty

### P11.7 — Static gates (ship honesty, not theater)

```powershell
cd D:\OandO07072026
pnpm run typecheck 2>&1 | Tee-Object results\planner\world-standard-wave\11-integration-closeout\typecheck-raw.log
pnpm run lint 2>&1 | Tee-Object results\planner\world-standard-wave\11-integration-closeout\lint-raw.log
# Optional full gate if owner wants release-level:
# pnpm run gate
```

- [ ] typecheck exit recorded
- [ ] lint exit recorded
- [ ] Failures explained in NOTES if red (do not claim ship if red without WAIVE)

### P11.8 — Exit criteria decision

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
- [ ] Prefer archive over delete for failed artifacts

### P11.9 — Closeout

- [ ] Finalize `run.json` status: `ready` | `not-ready` | `blocked`
- [ ] Commit landable evidence + residual code (main agent)
- [ ] Push origin when green enough not to strand remote (AGENTS)
- [ ] Mayoite mirror if ~45m / big land
- [ ] SESSION-RECAP / owner note if process requires

---

## Commands summary

| Step | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Unit spine | `cd site; pnpm exec vitest run tests/unit/features/planner/open3d --reporter=verbose` |
| Open3d world e2e | `pnpm --filter oando-site run test:e2e:open3d-world` |
| Typecheck | `pnpm run typecheck` |
| Lint | `pnpm run lint` |
| Optional full gate | `pnpm run gate` |

Evidence always under:

```
results/planner/world-standard-wave/11-integration-closeout/
results/planner/world-standard-wave/<W-folders>/
```

---

## Exit criteria — “product package shippable” honesty

| Claim | Allowed only if |
|-------|-----------------|
| **World-standard gates green** | P11.2 + P11.3 clean + P11.5 PASS |
| **Buyer can complete core journey** | P11.5 with deltas + cabinet-v0 + UUID save |
| **Evidence package shippable** | P11.6 six-file pack consistent; layout PASS |
| **Marketing “local save / no cloud theater”** | P06 residual + help greps clean |
| **Mesh class-leading** | **Not** required for P11 READY — P08 NOTES residual OK if manufacturer-readable bar met |
| **Fabric full stage shipped** | **Never** from P11 — destination spike only |

**Honesty rule:** Prefer **NOT READY** over paper READY.

---

## References to prior phases

| Need | Source |
|------|--------|
| Residual tasks | [EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md) |
| Justifications | [CHANGES-JUSTIFICATION.md](./CHANGES-JUSTIFICATION.md) |
| Session zero | [00-START.md](./00-START.md) |
| Path map | [REFERENCES.md](./REFERENCES.md) |
| Folder lock | `Plans/Research/RESULTS-MAP.md` |
| Kill order | `Plans/INDEX.md` · this package README |
| Reviews | `idiotplanners/P0X-*/CODE-REVIEW-REPORT.md` |
| Design W1–W8 | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
