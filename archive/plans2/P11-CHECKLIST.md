# P11 — World-standard integration / close-out checklist

> **For agentic workers:** `/using-superpowers` + verification-before-completion.  
> **P11 is not a product feature phase.** It is the **final integration gate** after P01–P10 residuals.  
> **Does not exist in idiotplanners2** — added by `plans2` (see CHANGES-JUSTIFICATION).

---

## Definition

**P11** = prove that the residual wave is **internally consistent** and **honest**:

1. Every W0–W8 (or explicit WAIVE) has **map-minimum artifacts** under live  
   `D:\OandO07072026\results\planner\world-standard-wave\`  
2. Kill-order dependencies hold (no “W3 green” without unit **and** browser when claimed).  
3. Cross-gate contradictions resolved or logged (Fabric OFF proofs, degrees honesty, SVG triple-path, orbit three-layer).  
4. Dual language locked: **GATE pack state** vs **buyer product ship**.  
5. Git backup logged; Failures.md residual open items not hidden.  
6. No claim of “world-standard complete product” without buyer-unaided journey smoke.

**P11 does not:** rewrite engines, open Fabric cutover, author new SKUs, or paper-over red gates.

---

## Prerequisites

| Prereq | Rule |
|--------|------|
| P01–P09 residual tasks | Attempted; each either GREEN, OPEN with path, or owner WAIVE |
| P10 pack | Six-file handover exists under `10-handover/` (Mode A or B) |
| `results/` on D: | Present for claimed greens; Mode A P10 OK if fail-honest |
| Active checkout | `D:\OandO07072026` only |
| HEAD honesty | `git rev-parse HEAD` matches or notes drift vs phase HEAD.txt files |

**Stop:** If multiple W gates still MISSING and owner wants “P11 PASS product,” refuse — finish residuals or Mode A honesty only.

---

## Evidence path

Canonical (plans2 addition):

```
D:\OandO07072026\results\planner\world-standard-wave\11-world-standard-closeout\
```

Minimum files:

| File | Role |
|------|------|
| `NOTES.md` | Date, HEAD, agent, dual language, residual list |
| `CROSSWALK.md` | W0–W8 → folder → status → path re-read this session |
| `INTEGRATION-SMOKE.md` | Commands run + expected vs actual |
| `run.json` | Machine-readable close-out meta |
| `HEAD.txt` | `git rev-parse HEAD` + optional `git status -sb` |
| `DUAL-LANGUAGE.md` | GATE vs PRODUCT statements (must not collapse) |

Optional: screenshots from one end-to-end guest smoke (not a substitute for per-gate packs).

If owner prefers zero new folder: store the same six names under `10-handover/p11/` with NOTES pointer — still call the gate **P11**.

---

## Checkbox checklist

### A. Process & honesty

- [ ] Session used `plans1/00-START.md` posture (no worktrees; results root legal)
- [ ] Live execute confirmed as **plans1/** (this plans2 P11 is reference only)
- [ ] CODE-REVIEW under `plans2/P0X-*/` present when cross-checking hardness
- [ ] `pnpm run check:layout` exit 0 at close-out
- [ ] Failures.md updated for any open residual (or explicit “none new”)
- [ ] Dual language written: CP/W pack ≠ product ship

### B. Per-gate re-read (paths, not memory)

For each row: open folder on disk; do not tick from phase headers.

- [ ] **W0 / CP-00** — `00-start/NOTES.md` exists (or WAIVE with reason)
- [ ] **CP-01** — `00-product-truth/INVENTORY.md` + `CONTRADICTIONS.md`
- [ ] **CP-02** — `01-engine-lock/NOTES.md` + ENGINE-LOCK-RECORD (or phase pack minimum)
- [ ] **W3 / CP-03** — `03-select-delete/` unit log **and** browser proof when W3 claimed
- [ ] **W1–W2 place / CP-07** — `02-browser-open3d-journey/` PNGs + playwright-run/run.json
- [ ] **W5–W6 / CP-06** — `06-save-honesty/` (+ `save-reload/` for W5 ids)
- [ ] **W4 / CP-04** — `04-orbit-continuity/` unit + browser (or written deferral)
- [ ] **W2 symbols / CP-05** — `05-symbols-svg/` vitest + NOTES honesty
- [ ] **W7 / CP-08** — `08-mesh-quality/` NOTES + visual smoke + run.json
- [ ] **W8 / CP-09** — `09-shortcuts-chrome/` logs + NOTES
- [ ] **CP-10** — `10-handover/` six files; Mode A or B criteria honest

### C. Cross-cutting integration asserts

- [ ] Fabric flag **not** required ON for any claimed W2/W3 symbol/select proof
- [ ] Furniture document rotation remains **degrees** (no false reverse to radians)
- [ ] Orbit claims cite three-layer (defaults + workspace props + proof) not “unit default only”
- [ ] SVG triple-path honesty: Block2D canvas ≠ publish svg-catalog ≠ mesh footprint string
- [ ] Save labels never bare “Saved” / account cloud when only IDB
- [ ] Dimension key **M**, Door **D** (no reverse “fix”)
- [ ] Journey place path is **not** configurator-only for CP-07 claim
- [ ] Unit-alone never marks W3 or browser W1–W2

### D. Integration smoke commands

Record outputs under `11-world-standard-closeout/INTEGRATION-SMOKE.md`.

```powershell
cd D:\OandO07072026
git rev-parse HEAD | Tee-Object results\planner\world-standard-wave\11-world-standard-closeout\HEAD.txt
pnpm run check:layout

# Representative unit re-smoke (adjust if paths change)
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/hostWiringP01.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  --reporter=verbose
```

Optional browser (dev server up):

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
# Prefer already-green journey / pack specs; do not invent skip-green
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

- [ ] Unit re-smoke exit 0 **or** honest fail logged (no filter)
- [ ] Optional Playwright: pass logged **or** explicit skip with reason (not silent)
- [ ] Buyer smoke narrative: open guest/open3d → draw or place → 3D toggle → save label honesty (manual OK if documented)

### E. Backup & handoff

- [ ] origin pushed if landable (or logged cannot)
- [ ] mayoite mirror if ~45m / big land (or logged cannot)
- [ ] P10 BACKUP-LOG considered / updated if E: backup ran
- [ ] SESSION-RECAP or Failures note for open product residual
- [ ] Next work named: module-wise global-standard **or** residual reopen list — not “done vibes”

---

## Exit criteria

### P11 Mode A — Honest close (results partial)

| Criterion | Pass |
|-----------|------|
| CROSSWALK lists every gate with real status | Yes |
| No GREEN without path re-read | Yes |
| Dual language refuses product ship if gates incomplete | Yes |
| Integration smoke attempted | Yes |
| CP-11 “PASS product” **not** claimed | Yes |

### P11 Mode B — Wave residual closed (gates green)

| Criterion | Pass |
|-----------|------|
| All B checklist greens or owner WAIVE with risk | Yes |
| Cross-cutting asserts hold | Yes |
| Unit re-smoke green | Yes |
| Browser journey still green on this HEAD (or WAIVE) | Yes |
| Dual language: gate closed **and** product residual explicit | Yes |
| Evidence under `11-world-standard-closeout/` complete | Yes |

**Still never equals:** photoreal product, Fabric full walls, multiplayer, or competitor feature parity.

---

## Stop-if-fail

| Fail | Action |
|------|--------|
| Claiming P11 Mode B with missing map-minimum folders | Reopen owning phase |
| Collapsing GATE PASS into “product finished” | Rewrite DUAL-LANGUAGE; Failures.md |
| Editing product code under P11 label for gate fixes | Stop; reopen P0X |
| Filtering test logs | FAIL integrity |
| Using E: historical PASS as live re-proof without restore + re-run | Mark historical-only |

---

## References

| Doc | Path |
|-----|------|
| Master plan | `plans2/EXECUTABLE-PLAN.md` Task P11 |
| Start card | `plans2/00-START.md` |
| Justification | `plans2/CHANGES-JUSTIFICATION.md` |
| P10 deep | `plans2/P10-evidence-handover/IMPLEMENTATION-PLAN.md` |
| Folder lock | `Plans/Research/RESULTS-MAP.md` |
| Design W1–W8 | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Program kill order | `Plans/INDEX.md` |
