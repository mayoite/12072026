# Trust-Data Checkpoints (CP-00 → CP-10)

> **For agentic workers:** REQUIRED: `/using-superpowers`. A checkpoint is **pass** only when every pass criterion is proven by a path under `results/` or an explicit owner waiver in this file.  
> **Stop-if-fail is mandatory:** do not start the next phase while the prior CP is red unless the owner writes a waiver with reason + date.  
> **Governance revision:** 2026-07-09 — see [../reviews/GOVERNANCE-suggestions.md](../reviews/GOVERNANCE-suggestions.md).

**Checkout:** `D:\OandO07072026` only · no worktrees · commit as you go · push only on owner ask.  
**Evidence root:** `D:\OandO07072026\results\planner\world-standard-wave\`  
**Plan root:** `D:\OandO07072026\Plans\trustdata\`

### Status legend

| Status | Meaning |
|--------|---------|
| `OPEN` | Not started or incomplete |
| `PASS` | All pass criteria met; evidence paths exist |
| `FAIL` | Attempted; criteria not met; stop |
| `WAIVE` | Owner waived in writing in this file (date + reason) |

Update the **Status** column when a CP resolves. Do not delete rows.

---

## CP lock table (phase · gate · folder)

Agents **must not invent** alternate phase↔CP↔folder mappings. Folder numbers are mostly phase-aligned; exceptions are called out.

| CP | Phase file | Gate(s) | Canonical evidence folder (under `world-standard-wave/`) |
|----|------------|---------|----------------------------------------------------------|
| **CP-00** | `00-START.md` | W0 | `00-start/` (optional NOTES) |
| **CP-01** | `phases/P01-product-truth.md` | Baseline | `00-product-truth/` |
| **CP-02** | `phases/P02-engine-lock.md` | Engine | `01-engine-lock/` |
| **CP-03** | `phases/P03-select-delete.md` | **W3** | `03-select-delete/` |
| **CP-04** | `phases/P04-orbit-continuity.md` | **W4** | `04-orbit-continuity/` |
| **CP-05** | `phases/P05-symbols-svg.md` | **W2** symbols | `05-symbols-svg/` |
| **CP-06** | `phases/P06-save-honesty.md` | **W5–W6** | `06-save-honesty/` (+ `save-reload/` for W5) |
| **CP-07** | `phases/P07-draw-place-journey.md` | **W1–W2** browser | `02-browser-open3d-journey/` (gold path; optional alias `07-browser-journey/` with pointer only) |
| **CP-08** | `phases/P08-mesh-quality.md` | **W7** | **`08-mesh-quality/`** |
| **CP-09** | `phases/P09-shortcuts-chrome.md` | **W8** | **`09-shortcuts-chrome/`** |
| **CP-10** | `phases/P10-evidence-handover.md` | Pack + E: | `10-handover/` |

**Folder anti-drift (owner 2026-07-09):**

| Work | Canonical | Forbidden / non-canonical |
|------|-----------|---------------------------|
| Mesh W7 | `08-mesh-quality/` | Do not park W8 artifacts here |
| Shortcuts W8 | **`09-shortcuts-chrome/`** | Legacy name `08-shortcuts-chrome/` is **non-canonical** — rehome or leave pointer `NOTES.md` only; do not mark CP-09 PASS from legacy folder alone |
| Product truth P01 | **`00-product-truth/`** | Legacy `01-product-truth/` non-canonical — pointer only |
| Engine P02 | **`01-engine-lock/`** | Not `02-engine-lock/` (journey owns `02-`) |
| Journey W1–W2 | `02-browser-open3d-journey/` | Do not invent a second journey root without pointer |

---

## Master table

| CP | Phase | Title | Gates | Pass criteria (all required) | Stop-if-fail | Evidence paths | Status |
|----|-------|-------|-------|------------------------------|--------------|----------------|--------|
| **CP-00** | `00-START.md` | Ground truth + unlock | W0 foundation | (1) INDEX + 00-START read by executing agent. (2) Approach A/B/C checkbox recorded in 00-START (default **A** if owner silent after unlock). (3) Ethics table acknowledged (inspiration only; MIT/open packages). (4) Owner unlock for implementation **or** explicit “plan only”. (5) No worktree created. | If approach unset and owner has not unlocked: **do not implement product code**. If ethics violated (competitor assets in `site/`): stop all streams; purge; log Failures.md. | `Plans/trustdata/00-START.md`; `Plans/trustdata/INDEX.md`; optional note `results/planner/world-standard-wave/00-start/NOTES.md` | OPEN |
| **CP-01** | `phases/P01-product-truth.md` | Product truth inventory | Baseline data | (1) Written inventory of what open3d actually does vs claims (select/delete, orbit, save, mesh, symbols). (2) Contradictions listed with file paths in repo. (3) Links to existing results (`results/planner/*`) that are spine-only vs world-standard. (4) No “works” claim without browser proof. | If inventory is opinion-only (no file paths): FAIL; rewrite. Do not start P03–P09 feature work from myths. | `results/planner/world-standard-wave/00-product-truth/` (`INVENTORY.md`, `CONTRADICTIONS.md`); may cite `results/planner/world-standard-wave/WAVE.md` | OPEN |
| **CP-02** | `phases/P02-engine-lock.md` | Engine lock | Stop thrash | (1) 2D destination = Fabric v7 full stage; interim = FeasibilityCanvas. (2) 3D = Three + R3F + orbit ON. (3) No Konva+Fabric hybrid interactive. (4) Catalog strategy = manufacturer SKU / O&O products. (5) Success metric = BOQ/quote path > photoreal. (6) Checkboxes mirrored in 00-START engine section. | If agent proposes Unity / Konva hybrid / photoreal-first: FAIL; re-read ENGINE-DECISION. Do not thrash engines mid-W gates. | `results/planner/world-standard-wave/01-engine-lock/NOTES.md`; research ref `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`; repo copy `results/planner/world-standard-wave/COMPARISON-CHART.md` | OPEN |
| **CP-03** | `phases/P03-select-delete.md` | Select + delete + undo | **W3** | (1) **Furniture** selectable on default 2D FeasibilityCanvas (product bar = furniture only; openings/door-window first-class select = stretch, not required). (2) Delete/Backspace removes selection. (3) Undo restores same entity id + pose. (4) Unit tests green with full console artifacts (unfiltered). (5) **Browser proof hard gate:** Playwright **or** chrome-devtools select→delete→undo under `03-select-delete/` with minimum artifacts: `run.json` + raw log + screenshots **or** trace. | Unit-only without browser select→delete→undo = **W3 FAIL**. Agents **must not** self-waive browser. Stop P07 full journey claims while CP-03 red. Do not mark W3 from keyboard handler existence alone. | `results/planner/world-standard-wave/03-select-delete/` (`run.json`, vitest logs, browser screenshots or Playwright/devtools trace) | OPEN |
| **CP-04** | `phases/P04-orbit-continuity.md` | Orbit + 2D↔3D continuity | **W4** | (1) 3D orbit controls enabled on open3d viewer. (2) Toggle 2D↔3D preserves entity poses (ids + transforms). (3) Console clean of hard errors on toggle path. (4) Playwright or scripted browser proof + screenshots. | If 3D is boxes without orbit and no continuity assert: FAIL. Do not start mesh-polish celebration before orbit works. | `results/planner/world-standard-wave/04-orbit-continuity/` (`run.json`, screenshots, console log) | OPEN |
| **CP-05** | `phases/P05-symbols-svg.md` | Block2D symbols / SVG path | **W2** symbol quality | (1) Block2D cabinet-v0 symbols readable (not empty blob) with unit proof. (2) Visual PNG or prim-JSON evidence. (3) Admin SVG pipeline is **not** falsely claimed as plan-canvas symbol authority unless wired and proven. (4) Honesty NOTES for canvas vs publish authority. | If symbols empty/unreadable: FAIL W2 symbol half; P07 journey cannot claim full W2. | `results/planner/world-standard-wave/05-symbols-svg/`; browser place PNGs also under `02-browser-open3d-journey/`; prior `results/planner/svg-authority*/` secondary only | OPEN |
| **CP-06** | `phases/P06-save-honesty.md` | Save honesty + reload | **W5–W6** | (1) Save → hard reload → same walls + furniture **ids** (W5). (2) Member/status UI does not claim cloud when only IDB (W6). (3) Either cloud wire works with proof **or** label is explicitly local-only. (4) Playwright wait for autosave/flush documented. | If status says “Saved” implying cloud without wire: FAIL W6. If reload loses entities: FAIL W5. Do not ship lying copy. | `results/planner/world-standard-wave/06-save-honesty/` (include `save-reload/` subfolder or dual NOTES for W5+W6) | OPEN |
| **CP-07** | `phases/P07-draw-place-journey.md` | Browser draw→place journey | **W1–W2** browser | (1) Playwright journey on `/planner/open3d` or guest: draw walls + door opening (W1). (2) Place ≥2 catalog items including cabinet-v0 (W2 place half). (3) Gold evidence folder mirrors admin-svg-publish pattern: screenshots + `playwright-run.json` / `run.json`. (4) No silent skip of steps. Full W2 symbol honesty still owned by CP-05. | Missing screenshots or skipped steps = FAIL (testing-handbook). Thin “journey 1” without world bar = FAIL. Do not call product working. CP-07 must not claim full W1–W2 while CP-03 or CP-05 red unless owner partial-scope WAIVE. | `results/planner/world-standard-wave/02-browser-open3d-journey/` (`playwright-raw.log` or equivalent, `run.json`, PNGs) | OPEN |
| **CP-08** | `phases/P08-mesh-quality.md` | Mesh quality bar | **W7** | (1) Written bar doc for modular cabinet-v0 (toe / door / carcass readable). (2) Visual smoke (screenshot or headless mesh PNG) shows non-apology mesh. (3) Unit/smoke for footprint/mesh generation as applicable. (4) NOTES.md states remaining debt honestly. | If still default unit boxes with no bar doc: FAIL W7. Do not claim Homestyler-class photoreal; bar is readable modular parts. | **`results/planner/world-standard-wave/08-mesh-quality/`** (`NOTES.md`, screenshots, optional vitest logs) | OPEN |
| **CP-09** | `phases/P09-shortcuts-chrome.md` | Shortcuts + blocking chrome | **W8** | (1) Tool/shortcut labels match handlers (e.g. map D=door / M=dimension — no live keydown that arms the wrong tool). (2) Unit + keyboard tests. (3) Only 2A chrome that **blocks** W gates (dead prefs, hidden tools, a11y noise that breaks place) is in scope. (4) Non-blocking premium chrome deferred. | Label lies left shipping: FAIL W8. Expanding into full RAC/mobile redesign before W1–W7 green: scope creep — stop and ask owner. Artifacts only under **`09-shortcuts-chrome/`**. | **`results/planner/world-standard-wave/09-shortcuts-chrome/`** (`run.json`, vitest logs, optional keyboard Playwright) | OPEN |
| **CP-10** | `phases/P10-evidence-handover.md` | Evidence pack + E: backup + handover | Pack + backup | (1) `10-handover/` complete (README, W-GATES, MASTER-SYNC, HEAD.txt, FAILURES-SNIP, BACKUP-LOG). (2) MASTER-CHECKLIST.md synced to evidence. (3) E: backup under `E:\OandO-backups\trustdata-YYYY-MM-DD\` verified. (4) Local commits for each landable P10 slice. (5) Push not done unless owner asked; status recorded. (6) CP-00–CP-09 all PASS or WAIVE. | Any W1–W8 evidence missing → FAIL CP-10; reopen owning phase. E: unavailable → FAIL backup criterion; log Failures.md. Push without ask → integrity FAIL. Secrets in pack → scrub and FAIL until fixed. W7 folder must be `08-mesh-quality/`; W8 folder must be `09-shortcuts-chrome/`. | `results/planner/world-standard-wave/10-handover/*`; MASTER `Plans/trustdata/checklists/MASTER-CHECKLIST.md`; E: dest logged in BACKUP-LOG.md | OPEN |

---

## Dependency order (do not skip)

```
CP-00 → CP-01 → CP-02 → CP-03 (W3) → CP-04 (W4)
                      ↘ CP-05 (W2 symbols) 
                      ↘ CP-06 (W5–W6)
         CP-03 + CP-05 (+ CP-06 as needed) feed → CP-07 (W1–W2 browser full journey)
         CP-04 + mesh work → CP-08 (W7)  [evidence: 08-mesh-quality/]
         Label truth anytime after CP-00 but must land → CP-09 (W8) before CP-10
              [evidence: 09-shortcuts-chrome/]
         All green → CP-10
```

**Agents / one-task rule:** `AGENTS.md` (authority). Do not restate concurrency here.

- CP-07 full claim needs CP-03 + CP-05 not red unless owner WAIVE.
- **W3:** unit alone ≠ pass; browser proof under `03-select-delete/` required.

---

## Waiver template (owner only)

Copy under the CP row notes or below:

```markdown
### WAIVE CP-XX
- Date:
- Owner statement (quote):
- Reason:
- Residual risk:
- Re-open condition:
```

Agents must not self-waive. **Especially forbidden:** self-waiving CP-03 browser proof.

---

## Global stop rules (all CPs)

1. **No worktrees** — any `git worktree add` = stop; return to `D:\OandO07072026`.
2. **Push policy** — normal `git push` to origin/mirror follows `AGENTS.md` (push when right; mirror cadence). **Force-push**, remote branch delete, or history rewrite still require owner ask.
3. **No competitor copy** — competitor JS/CSS/GLB/logos/brands in `site/` = stop; ethics FAIL.
4. **No `any` in handwritten TS** — type exceptions need adjacent reason, owner, removal condition.
5. **Zero suppression** of test output — missing console or skipped tests = FAIL for that CP’s test criterion.
6. **Trust data** — if evidence contradicts a cheerful status report, evidence wins; update Failures.md.
7. **Folder names** — W7 = `08-mesh-quality/`; W8 = `09-shortcuts-chrome/`; W3 browser = `03-select-delete/` (not only journey folder).

---

## Quick re-verify commands (evidence only; adjust filters per phase)

Run from `D:\OandO07072026\site` when executing CPs that need tests. Capture under the CP evidence folder via project evidence scripts when available (`scripts/run-evidence-cmd.ps1` / site scripts). Do not delete logs.

| Intent | Example |
|--------|---------|
| Unit non-regression | `pnpm` scripts already used for p0/unit open3d (see START.md / package.json); full raw log retained |
| Playwright journey (W1–W2) | Spec targeting open3d world-standard; output → `02-browser-open3d-journey/` |
| Playwright / chrome-devtools W3 | Narrow select→delete→undo; output → `03-select-delete/` |
| Mesh W7 | Unit + visual smoke → `08-mesh-quality/` |
| Shortcuts W8 | Unit/keyboard → `09-shortcuts-chrome/` |
| HEAD snapshot | `git rev-parse HEAD` → `10-handover/HEAD.txt` |

Exact script names: follow `START.md` and `site/package.json` at execution time; record the command line inside each `run.json`.

---

## Related files

| File | Role |
|------|------|
| [../INDEX.md](../INDEX.md) | Program index |
| [../00-START.md](../00-START.md) | Ethics + approach + phase order |
| [../checklists/MASTER-CHECKLIST.md](../checklists/MASTER-CHECKLIST.md) | Owner single checklist |
| [../checklists/AGENT-RULES.md](../checklists/AGENT-RULES.md) | Subagent contract |
| [../RESULTS-MAP.md](../RESULTS-MAP.md) | Folder → phase map (**follow-up:** sync W8 to `09-shortcuts-chrome/` if still on legacy `08-`) |
| [../phases/P10-evidence-handover.md](../phases/P10-evidence-handover.md) | Final pack + E: backup |
| [../reviews/GOVERNANCE-suggestions.md](../reviews/GOVERNANCE-suggestions.md) | 2026-07-09 governance review |
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | W1–W8 definitions |

---

## Expert revision note — 2026-07-09

Governance pass (no product code). Applied from [GOVERNANCE-suggestions.md](../reviews/GOVERNANCE-suggestions.md):

1. **CP lock table** — CP-00–CP-10 ↔ phase ↔ gate ↔ folder explicit.  
2. **W3 browser hard gate** — unit alone = FAIL; minimum browser artifacts listed; no agent self-waive.  
3. **CP-03 product bar** — furniture only (matches P03).  
4. **W7** evidence locked to **`08-mesh-quality/`**.  
5. **W8** evidence locked to **`09-shortcuts-chrome/`** (replaces legacy dual-`08-*` collision with mesh).  
6. Dependency + re-verify commands updated for new W8 path.

All statuses remain **OPEN**.
