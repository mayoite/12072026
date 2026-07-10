# CODE-REVIEW-REPORT — P01 Product Truth

**Date:** 2026-07-10  
**Plan:** `idiotplanners/P01-product-truth/IMPLEMENTATION-PLAN.md`  
**Source brainstorm:** `archive/Idiots2/P01-product-truth/REPORT.md` (live path; plan prose says `Idiots2/` root — **stale**)  
**Reviewer role:** receiving-code-review rigor against **live repo truth** only  
**Scope of this review:** Plan vs disk. **No product code changes. IMPLEMENTATION-PLAN.md not edited.**  
**Verdict:** **APPROVE-WITH-FIXES**

---

## Executive summary

- **Solid:** Inventory-only re-proof is the correct phase shape for a checkout where `results/` is gone while plan/PENDING tables still say GATE PASS / CP-01 PASS. FOLDER-LOCK (`00-product-truth/`), Approach A, dual-host truth, fabric permanent redirects, status vocabulary, false-green catalog, and required vitest smoke with non-silent skip are all aligned with live authority (`Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`, `AGENTS.md`).
- **Solid:** Almost every production path, unit/e2e filename, symbol, and line anchor the plan pre-reads was **re-verified True** on `D:\OandO07072026` (open3d tree ~143 files; unit open3d ~91 files; dual host chains correct; OrbitControls + default ON; Delete/Backspace → `deleteSelection`; local save labels; fabric env exact `"1"`; `newEntityId` = `crypto.randomUUID`).
- **Wrong / fix before execute:** Brainstormer input path is **`archive/Idiots2/...`**, not repo-root `Idiots2/`. Plan (and `idiotplanners/README.md`) still point at a non-existent root folder.
- **Wrong / fix before execute:** Plan Task 02–04 greps depend on **`rg` (ripgrep). On this machine `rg` is not on PATH** — as written, host/W-gate greps hard-fail. Need Select-String / findstr fallback or an install step.
- **Wrong / fix for self-check honesty:** Task 07 artifact self-check omits artifacts Task 00/02 create (`authority-path-map.md`, `import-graph-stale-paths.tsv`) while §4.1 / Appendix A list them — fail-closed script can green while pack is incomplete relative to the plan’s own contract.
- **Not a product rebuild:** Plan correctly forbids open3d feature edits and treats importGraphProof / README fabric lies as **contradictions only**. Do not “fix” those in P01.
- **Ship readiness of plan:** Executable after the operational fixes above. Quality of product-truth framing is high; residual is tooling + path hygiene, not conceptual rework.
- **Do not treat this review as CP-01 pass.** CP-01 is still unproven until `results/planner/world-standard-wave/00-product-truth/` exists with non-empty INVENTORY + CONTRADICTIONS + smoke log.

---

## Repo truth checked

### Brutal workspace facts (this review session)

| Check | Live fact | Plan claim | Status |
|-------|-----------|------------|--------|
| Checkout | `D:/OandO07072026` single worktree on `main` | main only, no worktrees | **MATCH** |
| `results/` | **Does not exist** | Missing; re-prove | **MATCH** |
| `results/planner/world-standard-wave/` | Missing | Missing | **MATCH** |
| `WAVE.md` / `COMPARISON-CHART.md` | Missing | Missing | **MATCH** |
| `Plans/trustdata/` | Not present | Not present; use `Plans/phases` + `Plans/Research` | **MATCH** |
| Root `ayushdocs/` | Not present | Map to `Plans/Research/Others/` | **MATCH** |
| `Idiots2/` at repo root | **Not present** | Inputs cite `Idiots2/P01-...` | **MISMATCH** |
| `archive/Idiots2/P01-product-truth/REPORT.md` | **Present** | Not stated as live path | **Plan path wrong** |
| `D:\websites` | Present | Present (ideas only) | **MATCH** |
| `E:\OandO-backups\trustdata-2026-07-10\` | **Present** (this session) | Optional restore note | **MATCH (available)** |
| `rg` on PATH | **Missing** | Assumed available in PowerShell tasks | **MISMATCH / exec risk** |

### Files / paths verified (plan claim → repo reality)

| Plan claim | Repo reality | Status |
|------------|--------------|--------|
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Exists; `FeasibilityCanvasHandle` undo/redo/cancel/commit/resetZoom/fitToView/setTool/getProject; uses `addOpen3dWall`, `pickFurnitureAtPoint` | **OK** |
| `…/editor/OOPlannerWorkspace.tsx` | Exists; `deleteSelection` ~326; `handleInventoryPlace` ~358; Lazy3DViewer + `getOpen3dViewerControlProps()` ~1010–1012; `formatAutosaveStatus` ~909 | **OK** (line ~1010 pre-fill is ~1012 — within tolerance) |
| `…/3d/ThreeViewerInner.tsx` | Exists; dynamic `OrbitControls` import ~172–176; default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` | **OK** |
| `…/3d/ThreeLazyViewer.tsx` + `Lazy3DViewer` export | Exists; `export function Lazy3DViewer`; re-export via `3d/index.ts` | **OK** |
| `…/3d/orbitDefaults.ts` | `OPEN3D_ORBIT_DEFAULT_ENABLED = true`; `getOpen3dViewerControlProps()` returns `{ enableControls: true }` | **OK** |
| `…/ui/Open3dNativeHost.tsx` | Exists → OOPlannerWorkspace | **OK** |
| `site/features/planner/ui/Open3dPlannerHost.tsx` | Thin wrapper → NativeHost only | **OK** |
| `…/Open3dPlannerWorkspaceRoute.tsx` | Providers + ProjectSetupGate + dynamic Host `ssr:false` | **OK** |
| `…/useWorkspaceKeyboard.ts` | Delete/Backspace → `handlers.deleteSelection` ~83–86 | **OK** |
| `…/useWorkspaceCanvas.ts` | Exists | **OK** |
| `…/persistence/useOpen3dWorkspaceAutosave.ts` | `createAutoSaver` + `schedulePersist` present | **OK** |
| `…/workspaceStatusLabels.ts` `formatAutosaveStatus` | Always local honesty strings (“Saving locally…”, “Saved locally”, “Draft saved locally”, etc.) ~31–48 | **OK** |
| `…/workspaceEntityHelpers.ts` `applySelectionDelete` | ~112 | **OK** |
| `…/canvas-fabric-stage/fabricFurnitureFlag.ts` | Exact env `"1"` only | **OK** |
| `…/cleanup/importGraphProof.ts` | fabric-legacy rows for `…/fabric/guest|canvas/page.tsx`; comment still says fabric routes “remain legacy fallback” | **OK (stale as claimed)** |
| `site/features/planner/_archive/fabric/` | Present; README rollback claims `/planner/fabric/guest|canvas` | **OK** |
| `site/config/build/next.config.js` ~206–207 | Permanent redirects `/planner/fabric` and `/planner/fabric/:path*` → `/planner/open3d/` | **OK** |
| `site/features/planner/lib/newEntityId.ts` | `crypto.randomUUID` only | **OK** |
| Guest page | `Open3dPlannerWorkspaceRoute guestMode`; comment still mentions fabric archive fallback | **OK** |
| Canvas page | WorkspaceRoute (auth-derived guest) | **OK** (not fully re-read; path exists + pattern matches guest) |
| Open3d pilot page | Direct `Open3dPlannerHost`; force-dynamic; guest from auth | **OK** |
| Fabric app pages | `site/app/planner/(workspace)/fabric/...` and `site/app/planner/fabric` **False** | **OK (staleness proof)** |
| open3d README route table | Claims guest/canvas → `Open3dPlannerHost` (omits WorkspaceRoute); fabric/* legacy fallback | **OK (docs-overclaim seed)** |
| Design §1 “no furniture select/delete” | Still present in `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | **OK (stale docs seed)** |
| Phase card CP-01 PASS / inventory DONE | `Plans/phases/P01-product-truth/P01-product-truth.md` status table | **OK (narrative only)** |
| `00-PENDING` GATE PASS + product not finished | Live; W1–W8 GATE PASS (artifacts); product OPEN | **OK** |
| Unit smoke file names | All five required + hostWiringP01, orbitControlsDefault, applySelectionDelete, poseContinuityW4, toolShortcutTruth | **OK** |
| E2E names | open3d-world-standard-journey, w3, w4, save-honesty, admin-svg-publish-p01, sketch-to-plan-pipeline | **OK** |
| Package `oando-site` + `test:planner` | `site/package.json` | **OK** |
| `vitest.site.config.ts` | Exists; includes `tests/**/*.test.ts(x)` so open3d unit paths are runnable | **OK** (prefer default planner config also fine — see Medium) |
| RESULTS-MAP CP-01 floor | `INVENTORY.md` + `CONTRADICTIONS.md` under `00-product-truth/` | **OK** |
| Claim sources under `Plans/Research/Others/*` | 00-PENDING, 04, 08, 09, 18, 19, SESSION-RECAP present | **OK** |
| `Plans/phases/P01-product-truth/P01-suggestions.md` | Present; plan correctly absorbs expert fixes (INVENTORY names, fabric, dual host, required vitest) | **OK** |

### Commands / scripts verified

| Plan command pattern | Live fact | Status |
|----------------------|-----------|--------|
| `pnpm --filter oando-site exec vitest run … --config vitest.site.config.ts` | Filter name + config exist; include globs cover unit paths | **OK** (config choice slightly odd — see Medium) |
| `pnpm --filter oando-site run test:planner` / `cd site; pnpm run test:planner` | Script `vitest run planner` exists | **OK** |
| `rg -n …` in Tasks 02–04 | **`rg` not on PATH** this session | **FAIL as written** |
| PowerShell `Test-Path` / `Get-ChildItem` inventories | Fine on this shell | **OK** |
| `git worktree list` single tree | Confirmed | **OK** |
| Commit evidence under `results/…` | `results/` currently absent; not blanket-ignored in observed `.gitignore` (PNG global ignore has `!results/planner/**/*.png`). No tracked `results/*` yet (`git ls-files results` empty). | **OK with care** — if a future ignore lands, force-add needed |

### Tests / evidence status

| Layer | Status |
|-------|--------|
| Historical `results/planner/**` | **Missing entire tree** — treat all prior GATE PASS / CP-01 PASS as **unproven** on this checkout |
| Unit test sources | Present and dense under `site/tests/unit/features/planner/open3d/` |
| E2E sources | Present (open3d-* and planner-* families) |
| This review’s vitest run | **Not executed** (read-only plan review; smoke is executor Task 05) |
| Browser proof | **browser-missing** by definition until artifacts recreated |
| E: backup pack path | Exists on this machine — optional restore **possible**, but plan correctly prefers full re-inventory into `00-product-truth/` |

---

## Findings

### Blocking

#### B1 — Plan greps assume `rg`; tool missing on this checkout

- **Claim:** Tasks 02–04 use `rg -n … | Set-Content …` for host wiring, fabric redirect, W1–W8 gates, fabric flag.
- **Verified:** `Get-Command rg` / `where.exe rg` → not found. Select-String is available.
- **Judgment:** **Fix plan (executor must not proceed with empty greps).** This is an environment/tooling hole in an otherwise correct task list. Empty greps would produce false “code-absent” matrix rows — classic false-green/false-red.
- **Action for implementer:**
  1. Before Task 02: assert `rg` or install (e.g. scoop/choco/winget ripgrep), **or**
  2. Provide PowerShell fallback using `Select-String -Path -Pattern -Recurse` with the same output files, **or**
  3. Use a one-liner that fails closed: if `rg` missing → write blocker to `Failures.md` and `run.json.blockers`, do not invent greps.
  4. Do **not** mark CAPABILITY-MATRIX from memory if greps empty.

#### B2 — Brainstormer / Idiots2 path is wrong on disk

- **Claim:** Inputs / §2 / self-review: `Idiots2/P01-product-truth/REPORT.md` only (wave-1 not opened).
- **Verified:** Repo-root `Idiots2` **does not exist**. Live file: `D:\OandO07072026\archive\Idiots2\P01-product-truth\REPORT.md`. Wave-1 is `archive/Idiots/…`. `idiotplanners/README.md` also points at `Idiots2/` root.
- **Judgment:** **Fix plan path references for execution.** Content of the archived report matches the plan’s synthesis (results missing, Approach A, five surfaces) — the defect is path, not substance.
- **Action for implementer:** Open **`archive/Idiots2/P01-product-truth/REPORT.md`**. Do not fail Task 00 because root `Idiots2` is missing. Do not reopen `archive/Idiots/` unless owner changes the rule.

---

### High

#### H1 — Task 07 self-check incompleteness vs §4.1 / Appendix A

- **Claim:** Fail-closed script lists required non-empty artifacts for CP-01 ready-for-review.
- **Verified:** Script omits at least `authority-path-map.md` (Task 00) and `import-graph-stale-paths.tsv` (Task 02). Appendix A lists both; self-check does not.
- **Judgment:** **Fix plan self-check** (or explicitly demote those two to optional). As written, “PASS all required artifacts” can green while the plan’s own file map is incomplete.
- **Action for implementer:** Extend `$required` to match Appendix A minimum for CP-01, or document intentional optional set. Prefer **include both** — they are load-bearing for path honesty and fabric-graph contradiction.

#### H2 — Historical CP-01 / W-gate PASS is plan narrative only

- **Claim:** Phase card DONE/PASS + PENDING GATE PASS must not be trusted without artifacts.
- **Verified:** Phase status table claims inventory DONE + CP-01 PASS 2026-07-09 with evidence under `00-product-truth/`. `results/` absent. PENDING still says GATE PASS (artifacts) and product not finished.
- **Judgment:** **Accept plan stance.** This is the core reason the re-proof exists. Push back hard if any executor auto-marks `cp01: pass` from phase card prose.
- **Action for implementer:** Seed CONTRADICTIONS X01/C12 first. Land pack as `ready-for-review`; only owner/reviewer Task 08 sets pass/fail.

#### H3 — `importGraphProof` unit can pass while FS rows are dead

- **Claim:** hostWiringP01 / graph unit may pass; fabric-legacy paths missing on disk.
- **Verified:** `PRODUCTION_IMPORT_GRAPH` includes fabric guest/canvas paths; files Test-Path **False**. hostWiringP01 tests graph shape + fabric flag, not FS existence of every path string.
- **Judgment:** **Accept.** Critical honesty note — keep Task 05 Step 6 + import-graph-stale-paths.tsv.
- **Action for implementer:** Never cite hostWiringP01 green as “fabric routes exist.” Cross-link contradiction X03.

#### H4 — Guest/canvas page comments still advertise fabric fallback URLs

- **Claim:** Fabric routes are redirect-only; comments/docs may lie.
- **Verified:** guest page comment: “archive fallback: /planner/fabric/guest”. next.config permanent redirect to open3d. Archive README still lists explicit fallback routes.
- **Judgment:** **Accept as contradiction inventory**, not P01 product fix.
- **Action for implementer:** Quote comments in ROUTES.md / CLAIMS-REGISTER. Do not edit page comments in P01.

---

### Medium

#### M1 — Vitest config choice for capability smoke

- **Claim:** Smoke uses `--config vitest.site.config.ts`.
- **Verified:** site config includes all `tests/**/*.test.ts(x)` so files run. Default `vitest.config.ts` is the planner-oriented full suite config used by `test:planner`. Both can work.
- **Judgment:** **Accept with preference.** Prefer default config (or omit `--config` so package default applies) for open3d capability smoke to match START.md planner habits; site config is not wrong.
- **Action for implementer:** If smoke fails for config/env reasons, retry with default `vitest.config.ts` before marking `vitestSmoke=failed`. Log both attempts if needed.

#### M2 — W6 grep pattern still noisy

- **Claim:** Plan expands W6 beyond `*Status*` (good) but pattern includes bare `local|cloud`.
- **Verified:** Pattern in Task 03: `Saved locally|local|cloud|statusLabel|…` — bare `local` will hit many unrelated identifiers.
- **Judgment:** **Fix plan / tighten when grepping.** Honesty still recoverable via `formatAutosaveStatus` deep read.
- **Action for implementer:** Prefer tighter patterns (`Saved locally`, `Draft saved locally`, `formatAutosaveStatus`, `Saving locally`) for matrix path:line; use wide grep only as discovery, not as sole proof.

#### M3 — Task 02 Select-String escape fragility

- **Claim:** `Select-String … -Pattern "destination: \"/planner/open3d"` after rg dump.
- **Verified:** next.config has `destination: "/planner/open3d/"`. PowerShell escaping of nested quotes in the plan snippet is easy to botch; if rg fallback is Select-String-only, pattern must be re-tested.
- **Judgment:** **Fix plan / smoke the pattern.**
- **Action for implementer:** Match simpler: `destination:.*planner/open3d` or fixed-string search for `/planner/open3d/`.

#### M4 — Push policy tension with AGENTS.md

- **Claim:** Plan: push only on owner ask. AGENTS: agent may push landable slices to origin; mayoite ~45m.
- **Verified:** Standing AGENTS git rules allow agent-call push.
- **Judgment:** **User Wins / AGENTS standing.** Plan is more conservative — acceptable for pure evidence, but implementer should not treat “never push” as AGENTS violation if owner standing allows landable push.
- **Action for implementer:** Follow plan if owner reaffirmed push-on-ask for this wave; otherwise AGENTS push-when-right after green evidence land is fine. Never force-push.

#### M5 — Phase card still documents dead authority paths

- **Claim:** Plan §1.10 maps trustdata/ayushdocs → live paths.
- **Verified:** Live `P01-product-truth.md` still says `Plans/trustdata/…`, `ayushdocs/`, and assumes WAVE/COMPARISON already present under results.
- **Judgment:** **Accept plan’s live-path table.** Do not thrash phase card historical DONE table during re-proof (plan already prefers evidence over rewriting DONE).
- **Action for implementer:** Use plan §1.10 + `authority-path-map.md`. Optional note only; do not rewrite historical status to invent a new program plan.

#### M6 — RESULTS-MAP still says WAVE/COMPARISON “Exists (already)”

- **Claim:** Plan treats WAVE as expect MISSING.
- **Verified:** RESULTS-MAP root context table says WAVE/COMPARISON exist; on disk they do not.
- **Judgment:** **Accept plan; register as process/docs contradiction.**
- **Action for implementer:** claims-sources-concat marks WAVE MISSING; do not fail CP for missing WAVE if design+PENDING cover orbit/gate claims (plan already resolves this).

#### M7 — Parallelism appendix vs single-writer evidence

- **Claim:** Appendix E allows up to 8 agents on disjoint evidence files.
- **Verified:** AGENTS parallel rule: ≤8, hard 10, never two writers on same package — evidence-only under one folder is OK if files exclusive.
- **Judgment:** **Accept with caution.** Merger-only for INVENTORY/CONTRADICTIONS/run.json is correct.
- **Action for implementer:** Prefer serial on small machines; if parallel, exclusive file ownership only, single merger for canonical pack.

---

### Low / nits

#### L1 — Lazy3DViewer mount line ~1010 vs ~1010–1012

- **Claim:** Appendix D ~1010.
- **Verified:** JSX starts line 1010; spread props line 1012.
- **Judgment:** Accept. Re-verify from grep.

#### L2 — FeasibilityCanvas handle note template matches code

- **Claim:** NOTE template lists handle methods.
- **Verified:** Interface matches (undo/redo/cancel/commit/resetZoom/fitToView/setTool/getProject). Good pre-fill.
- **Judgment:** Accept. Still deep-read for selection/furniture paths.

#### L3 — “≥11 claims” vs template ≥13–15 rows

- Done-when says ≥11; templates show 15. Harmless; prefer filling all template rows.

#### L4 — Optional full `test:planner` log

- Correctly optional; do not let optional work delay INVENTORY land.

#### L5 — Firecrawl dead / anti-copy fence

- Aligned with AGENTS. Keep research ideas-only under `D:\websites`.

#### L6 — Commit message cadence (9 commits)

- Reasonable for evidence slices. Squash not required.

---

## What already exists (do not re-build)

Do **not** implement product features “while inventorying.” The following are already in tree:

| Capability | Live location | P01 action |
|------------|---------------|------------|
| Hybrid planner routes | guest / canvas / open3d | Document dual host only |
| 2D interim engine | FeasibilityCanvas | Inventory as live 2D |
| Fabric full stage | `_archive/fabric` + Phase 2B destination language | Not live; redirect + archive |
| Fabric furniture overlay | flag-gated default OFF | Confirm env exact `"1"` |
| Select/delete code | `deleteSelection`, keyboard, `applySelectionDelete`, pickFurniture | code-present; browser-missing |
| Orbit code | OrbitControls + default true + control props | code-present; product-usable unproven without browser pack |
| Local autosave honesty strings | `formatAutosaveStatus` | code-present for W6 honesty path |
| UUID entity ids | `newEntityId` | supported |
| Unit suites for W3/W4/W5/W6/W8 smoke names | under `site/tests/unit/features/planner/open3d/` | Run smoke; do not rewrite tests in P01 |
| Playwright **sources** for journey/w3/w4/save | `site/tests/e2e/open3d-*.spec.ts` | List only; **do not claim green** without results artifacts |
| Permanent fabric redirects | next.config.js | Document |
| Engine decision research | `D:\websites\…\ENGINE-DECISION.md` etc. | Ideas only; freeze narrative in INVENTORY for P02 — no engine thrash |

**Do not “fix” in P01:** importGraphProof stale rows, open3d README route table, guest page fabric fallback comments, design §1 select/delete lag, phase card PASS table, PENDING GATE PASS wording.

---

## What is residual / re-prove only

| Residual | Owner phase (after CP-01) | P01 duty |
|----------|---------------------------|----------|
| Entire missing `results/planner/world-standard-wave/**` | P01 re-materializes **only** `00-product-truth/`; later folders are other phases | Re-prove inventory pack |
| Browser W1–W2 journey green | P07 → `02-browser-open3d-journey/` | browser-missing |
| Browser W3 select/delete | P03 → `03-select-delete/` | browser-missing; code-present ok |
| Browser W4 orbit continuity | P04 → `04-orbit-continuity/` | browser-missing |
| Save reload + honesty e2e | P06 → `06-save-honesty/` (+ save-reload) | unit smoke only |
| Mesh bar browser | P08 → `08-mesh-quality/` | code-partial note |
| Shortcuts chrome browser | P09 → `09-shortcuts-chrome/` | code-present + unit |
| Engine lock freeze | P02 → `01-engine-lock/` | INVENTORY handoff inputs only |
| Docs/README/graph fabric lies | Later docs/P02 cleanup if owned | CONTRADICTIONS only |
| Optional E: backup merge | Ops / owner | Prefer re-proof; may pointer-note backup if used |

---

## False-green / evidence risks

| Trap | Why it bites on THIS checkout | Plan mitigation quality |
|------|-------------------------------|-------------------------|
| Phase card CP-01 PASS | Status table green; disk empty | **Strong** — re-proof required |
| PENDING GATE PASS | Artifacts language without folders | **Strong** — C12 / X01 |
| Unit file exists ⇒ unit-green | Many tests on disk | **Strong** — green only after smoke log |
| hostWiringP01 green ⇒ fabric routes live | Graph data ≠ FS | **Strong** if stale-paths tsv landed |
| e2e spec exists ⇒ browser green | Specs present | **Strong** — browser-missing rule |
| Research SYNTHESIS scores | Competitive packs present | **Strong** — ethics section |
| Orbit/select code-present ⇒ product-usable | Handlers exist | **Strong** — three-layer honesty |
| Silent vitest skip | Tempting if env flaky | **Strong** — pending forbidden at close |
| Empty `rg` output if tool missing | **Not mitigated in plan** | **Weak** — see B1 |
| Self-check PASS with incomplete pack | Optional files omitted from check | **Medium** — see H1 |
| Restore E: backup then claim old PASS without re-verify | Backup path **exists** here | Plan prefers re-proof — **keep that** |
| Writing evidence under `site/results/` | AGENTS forbidden | Plan correctly uses root `results/` |
| Folder `01-product-truth/` | FOLDER-LOCK forbid | **Strong** |

**Policy reminder:** testing-handbook requires preserved stdout/stderr and forbids silent skip. Plan’s `vitest-capability-smoke-raw.log` + `vitestSmoke` enum matches that intent. This review did **not** re-run vitest; any future “smoke green” claim without that log is incomplete.

---

## Plan quality score (1–10) + why

**Score: 8 / 10**

| Dimension | Score | Note |
|-----------|-------|------|
| Repo-first accuracy | 9 | Paths, hosts, redirects, symbols, lines largely correct |
| Honesty / false-green defense | 9 | Best part of the plan |
| Scope discipline (inventory-only) | 9 | Clear hard stops; no P03/P04 thrash |
| Executability on this Windows box | 5 | `rg` hole; Idiots2 path; self-check gap |
| Authority path hygiene | 8 | Correct live maps; phase card still stale (acknowledged) |
| Artifact contract vs RESULTS-MAP | 9 | INVENTORY + CONTRADICTIONS canonical |
| YAGNI | 8 | Long but justified for re-proof; optional full planner suite OK |

Not a 9–10 because operational blockers (B1–B2) would waste an executor hour or produce empty greps if ignored. Not below 7 because the product-truth architecture is correct for this monorepo and phase.

---

## Recommended kill order adjustments for this phase

Execute in this order (adjusted from plan Tasks 00–08):

1. **Tooling preflight (new micro-step before Task 00)**  
   - Confirm single worktree.  
   - Confirm `rg` **or** install **or** arm Select-String fallback.  
   - Note brainstormer path = `archive/Idiots2/...`.  
   - Optional: note E: backup exists but **do not** substitute for re-proof without disk re-verify.

2. **Task 00** — scaffold `00-product-truth/`, HEAD, run.json, authority-path-map (use live paths table).

3. **Task 01** — tree inventory + key-files-exist (fail closed on False).

4. **Task 02** — routes/hosts/fabric redirects + **import-graph-stale-paths.tsv** (must land).

5. **Task 03** — W1–W8 greps + CAPABILITY-MATRIX with **browser-missing** and **unit-missing** until smoke.

6. **Task 04** — claims concat + CLAIMS-REGISTER (≥13 rows including evidence-missing + import graph).

7. **Task 05** — unit/e2e lists + **required vitest smoke** + EVIDENCE-COVERAGE; update matrix unit tokens only from log.

8. **Task 06** — three NOTE deep-reads (path:line).

9. **Task 07** — INVENTORY + CONTRADICTIONS + PRODUCT-TRUTH + README + finalize run.json; **self-check with complete required set**.

10. **Task 08** — owner/reviewer only; do not auto-pass.

**Do not** interleave open3d product fixes. **Do not** start P02 execution until CP-01 pass. Planning P02 is fine.

**Kill-order note for later phases (out of P01):** after CP-01, program order remains P02 engine lock before buyer-visible thrash; P07 browser journey is not a substitute for P01 inventory.

---

## Bottom line

The P01 implementation plan is the right work for this checkout: **re-materialize product truth under `results/planner/world-standard-wave/00-product-truth/` because every prior PASS is currently non-falsifiable with no `results/` tree.** Live open3d code already carries dual hosts, FeasibilityCanvas interim 2D, flag-gated Fabric overlay, permanent fabric→open3d redirects, select/delete handlers, OrbitControls default ON, and local-only autosave labels — the plan correctly inventories those instead of rewriting them. **Approve with fixes:** (1) make greps work without assuming `rg`, (2) read brainstormer from `archive/Idiots2/…`, (3) align the fail-closed artifact checklist with the plan’s full contract, then execute inventory-only and refuse any auto CP-01 pass. Owner should treat CP-01 as **unproven until the pack is on disk and reviewed**, regardless of phase-card DONE prose.

---

## Review method note

- Order followed: **repo first** (Readme/START skim, open3d tree, hosts, next.config, tests, Plans authority) → **then plan full read** → optional brainstormer at **archive** path.  
- Skills applied: receiving-code-review (verify, pushback, no performative agreement).  
- No edits to `IMPLEMENTATION-PLAN.md`. No product code changes.  
- This file is the sole deliverable of the review agent.
