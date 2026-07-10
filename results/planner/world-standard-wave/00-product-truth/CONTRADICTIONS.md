# P01 Product Truth — CONTRADICTIONS

**Date:** 2026-07-10  
**HEAD:** `ab930b89c5dcd089f9dcc46490ab2d4dd50cdb96`  
**Rule:** Paper PASS without disk under `results/` = **FAIL** (plans1 START-HERE).  
**This pack:** Re-proves inventory on disk; does **not** claim full CP-01 closeout until reviewer accepts map-min + smoke.

---

## 1. Plan / card PASS vs missing results (critical)

| Claim source | Claim | Live disk on this checkout | Verdict |
|--------------|-------|----------------------------|---------|
| `Plans/phases/P01-product-truth/P01-product-truth.md` status table | Inventory pack **DONE** 2026-07-09; CP-01 **PASS** with `INVENTORY.md`, `CONTRADICTIONS.md`, greps, smoke 27/27, `run.json` | Evidence tree was **gone / empty** at residual start; historical artifacts not present on HEAD before this re-deposit | **NARRATIVE ONLY — unproven until re-deposit** |
| `Plans/Others/00-PENDING.md` | W1–W8 **GATE PASS (artifacts)**; pack GATE PASS; honesty line “GATE PASS ≠ product finished” | `results/planner/world-standard-wave/**` gate folders largely empty shells; no prior artifact content re-proved | **Artifact PASS not re-proven on this HEAD** |
| CODE-REVIEW-REPORT (plans1 P01) 2026-07-10 | `results/` **does not exist** at review time; CP-01 unproven | After session zero, `results/` skeleton + `00-start/` exist; `00-product-truth/` filled by **this** residual pack | Review snapshot was accurate then; residual wave is re-proving |
| plans1 START-HERE | Evidence root `results/planner/world-standard-wave/` only | Correct folder name; content must be non-empty to count | **Enforce** |

**Honesty line:** Status tables that say CP-01 / GATE PASS without non-empty files under the FOLDER-LOCK path are **stale narrative**, not current proof.

---

## 2. Idiots2 path

| Plan / prose | Live path | Verdict |
|--------------|-----------|---------|
| Repo-root `Idiots2/P01-product-truth/...` (some plan/README citations) | `Idiots2/` at repo root → **FALSE** | **STALE PATH** |
| Live brainstorm / report | `archive/Idiots2/P01-product-truth/REPORT.md` → **TRUE** | **USE THIS** |
| Archive tree | `archive/Idiots2/` has P01–P10 phase folders | Present |

**Fix for agents:** Always open `archive/Idiots2/...`, never invent root `Idiots2/`.

---

## 3. Others / ayushdocs path

| Claim | Live path | Verdict |
|-------|-----------|---------|
| Root `ayushdocs/` honesty baseline (phase card Architecture / AGENTS thin pointer) | `ayushdocs/` → **FALSE** | **MISSING at root** |
| Live claim / pending / product context docs | `Plans/Others/` → **TRUE** (`00-PENDING.md`, `04-HONEST-QUALITY.md`, `08-EVIDENCE-INDEX.md`, `09-VERIFY-SNAPSHOT.md`, `18-PRODUCT-CONTEXT.md`, `19-GOALS-SLICES.md`, `SESSION-RECAP.md`, …) | **USE THIS** |
| Plan prose “`Plans/Research/Others/`” (CODE-REVIEW table) | `Plans/Research/Others` → **FALSE** | **WRONG NESTING** — Others is sibling of Research under `Plans/` |
| `Plans/trustdata/` authority cited in phase card | `Plans/trustdata/` not the live residual execute path; maps live under `Plans/Research/RESULTS-MAP.md`; execute under `plans1/` | **Stale authority path for residual wave** |

---

## 4. open3d README / docs overclaims (product-truth seeds)

Document only — **do not “fix” product code in P01**.

| Source | Claim | Live truth | Verdict |
|--------|-------|------------|---------|
| `open3d/README.md` route table | guest/canvas → `Open3dPlannerHost` | guest/canvas → **`Open3dPlannerWorkspaceRoute`** then Host | **Docs omit WorkspaceRoute** |
| `open3d/README.md` | `/planner/fabric/*` legacy top-level Fabric fallback → `_archive/fabric/` | No fabric app pages; **permanent redirect** to `/planner/open3d/` | **Legacy fallback narrative is overstated** — redirects, not live fabric shell |
| Guest/canvas page comments | “archive fallback: /planner/fabric/guest\|canvas” | fabric app routes **False**; redirects only | **Stale comment** |
| `cleanup/importGraphProof.ts` | fabric-legacy graph rows / “legacy fallback” language | Useful as proof graph; fabric pages absent | **Graph rows may read as live paths if not carefully read** |
| Design spec note (CODE-REVIEW) | design §1 “no furniture select/delete” still in world-standard design doc | Select/delete code + unit/e2e exist in tree | **Stale design prose seed** (product may still need residual W3 browser proof) |

---

## 5. Tooling contradictions (execute risk)

| Claim | Live fact | Verdict |
|-------|-----------|---------|
| Plan Tasks 02–04 assume `rg` on PATH | `rg` may be missing (CODE-REVIEW confirmed missing earlier) | Use **Select-String / Get-ChildItem / Test-Path** fallback |
| Phase card cites smoke “27/27” | This residual smoke re-ran **hostWiringP01 only** → **4/4 pass** | Historical 27/27 not re-run here; do not recycle the number without a full suite log |

---

## 6. Residual-wave posture (binding)

1. **Inventory pack minimum (RESULTS-MAP CP-01 floor):** `INVENTORY.md` + `CONTRADICTIONS.md` under `00-product-truth/` — **this pack deposits them**.
2. **Smoke:** non-silent vitest log required — `vitest-hostWiringP01.log` (exit 0, 4 tests).
3. **No open3d thrash:** contradictions in README/importGraphProof/design docs are **catalogued**, not patched in P01.
4. **Later phases** re-prove W-gates with their own folders; this pack does not clear W1–W8.

---

## 7. Path quick-reference (truth table)

| Path | Exists |
|------|--------|
| `results/planner/world-standard-wave/00-product-truth/` | TRUE (this pack) |
| `archive/Idiots2/P01-product-truth/REPORT.md` | TRUE |
| `Idiots2/` (repo root) | FALSE |
| `Plans/Others/` | TRUE |
| `Plans/Research/Others/` | FALSE |
| `ayushdocs/` (repo root) | FALSE |
| `site/app/planner/**/fabric` pages | FALSE |
| fabric → open3d redirects in next.config | TRUE |
| `site/features/planner/open3d/` (143 files) | TRUE |
| `site/tests/unit/features/planner/open3d/` (91 test files) | TRUE |
