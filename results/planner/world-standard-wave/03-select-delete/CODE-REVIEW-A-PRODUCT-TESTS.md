# CODE-REVIEW A — P03 product path vs tests

**Seat:** Code-review A (product path vs tests)  
**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only (no worktrees)  
**Reviewer HEAD (read time):** `cd3b7cdcbb244f140ba5c2564fe9af7b5d8c9b3d`  
**Evidence root:** `results/planner/world-standard-wave/03-select-delete/`  
**Law:** NO PAPER MOON · unit alone ≠ W3 · write only under `results/` for this seat

---

## Verdict

# **APPROVE-WITH-FIXES**

Product select → delete → undo spine is **real and correctly wired**. Residual unit suites match product behavior with **id / pose / preventDefault / same-ref** asserts — not theater. Coverage ≥90% claims for the hard-required files are **honest**; Feasibility full-file residual is **honestly residual**, not sold as 90.

**Do not ship a hard W3 PASS narrative from unit alone.** Browser evidence exists and recent Playwright logs show exit 0, but the e2e gate is **soft on counts** and **silent on id/pose**, and phase meta still **drifts** across documents. Fix the three items below before treating CP-03 as closed without caveat.

---

## Scope audited (live code)

### Product

| Artifact | Path | Live read |
|----------|------|-----------|
| Pure delete | `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` `applySelectionDelete` | Empty/`none` same-ref; locked stay; multi-id one revision; wall → door/window cascade |
| Keyboard | `…/editor/useWorkspaceKeyboard.ts` | Del/Bksp `!mod` → `preventDefault` + `deleteSelection?.()`; editable early-return |
| Workspace wire | `…/editor/OOPlannerWorkspace.tsx` `deleteSelection` | **One** `updateProject(applySelectionDelete)` then clear selection — **not** N-loop |
| Keyboard mount | same file `useWorkspaceKeyboard({… deleteSelection …})` | Wired; Esc cancel clears selection |
| Pick | `…/lib/geometry/canvasPicking.ts` `pickFurnitureAtPoint` | Reverse scan (top-most); inverse-rot AABB; default 600; padding |
| Select pointer | `…/canvas-feasibility/FeasibilityCanvas.tsx` select tool | Furniture → openings → wall → room → none |

### Tests

| Suite | Path |
|-------|------|
| Pure + history | `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` |
| Keyboard | `…/open3dWorkspaceKeyboard.test.tsx` |
| Pick | `…/geometry/canvasPicking.test.ts` |
| Canvas select | `…/open3dFeasibilityCanvas.test.tsx` (select cases) |
| E2E | `site/tests/e2e/open3d-w3-select-delete.spec.ts` |
| History residual (coverage seat) | `…/open3dHistory.w3.test.ts` (not in original brief list; supports history 90%) |

---

## Judge 1 — Do tests match real product behavior?

### Unit pack: **YES — honest**

| Area | Product behavior | Test honesty |
|------|------------------|--------------|
| `applySelectionDelete` | Remove selected unlocked ids in one project revision; same ref on no-op | **Real ids** (`furn-1`/`a`/`b`/`c`), multi-id one past, locked same-ref, wall cascade door/window ids, missing-id same-ref |
| History undo | `updateOpen3dProject` + undo restores entity | **Id + pose** (`position`, `rotation`, `width`, `depth`, `catalogId` via `poseSnapshot`) — not count-only |
| Multi-id history | One past entry | Asserts `history.past` length **1** then full pose restore |
| Keyboard Del/Bksp | preventDefault + call product handler | Asserts `defaultPrevented` **and** `deleteSelection` call count; Ctrl/Cmd+Bksp **not** delete; input focus no-op |
| `pickFurnitureAtPoint` | Rotated footprint, top-most, padding, default 600 | Hit/miss/top-most/rot90/pad/empty/default-600 with **returned ids** |
| Feasibility select | pointer → `setSelection` with type+id | Furniture / empty / wall / door / window / room → **exact** `{ type, ids: [NAMED_ID] }` |

Mocks used where appropriate:

- Keyboard suite mocks **handlers** (correct isolation of the hook). It does **not** re-implement product delete — it proves the key path calls the wire slot.
- Feasibility mocks **2D block render** only; selection path still runs real `pickFurnitureAtPoint` + real `useWorkspaceCanvas` selection state.

**Not fake:** no always-true mocks, no empty expects on the W3 spine, no “called once” without id/pose on pure delete/history.

### Integration gap (non-blocking if unit+browser honest)

- **No** `workspaceDeleteSelection.wire.test.ts` (optional U12 from older live review).  
  React boundary `OOPlannerWorkspace.deleteSelection` is audited by code read + e2e Delete key, not a dedicated unit wire. Pure + history carry the multi-id single-history proof.

### E2E: **PARTIAL — soft, not fake**

`open3d-w3-select-delete.spec.ts` proves live journey shape:

1. Guest workspace → place 4 seats  
2. Select tool (via `selectPlannerTool` / Navigation rail)  
3. Canvas click → “No Selection” heading gone  
4. Delete → furniture count **decreases**  
5. Ctrl+Z → furniture count **increases**  
6. PNGs 01–04 deposited under evidence root  

**Softness (honesty tax):**

| Assert | Spec | Problem |
|--------|------|---------|
| Place | `toBe(furnitureBefore + 4)` | **Exact** — good |
| Delete | `toBeLessThan(afterPlace)` | Accepts delete **any** positive delta (not forced `afterPlace - 1`) |
| Undo | `toBeGreaterThan(afterDelete)` | Accepts **partial** restore; not forced back to `afterPlace` |
| Selection | `No Selection` heading count 0 | Negative check only — **no furniture id / properties id** |
| Identity | — | **Count-only**; no same entity id/pose after undo |

Unit id/pose bar **does** cover what browser omits. That split is acceptable **only if** NOTES and W3 acceptance documents say so and no one sells browser as identity proof. `NOTES.md` previously admitted count-only residual; that admission must stay true.

Recent Playwright deposits (`browser-w3-raw.log`, `browser-w3-playwright-live.log`) show **1 passed**. Eyes narrative (4 → 3 → 4) is stronger than the **coded** expects — the **code** still allows softer outcomes.

---

## Judge 2 — `any` / skip / unused / hardcoding smells

| Check | Result |
|-------|--------|
| `it.skip` / `describe.skip` / `test.skip` / `xit` in scoped W3 suites | **0** found |
| `any` type in scoped product + residual unit suites | **0** (only English “any furniture” in a test **title**) |
| `@ts-ignore` / `eslint-disable` on product helpers/keyboard | **0** |
| Hardcoded dims in select residual | Named consts (`DEFAULT_FOOTPRINT_MM`, `WALL_LENGTH_MM`, `ROOM_SIZE_MM`, `FURNITURE_ID`, …) — **OK** |
| Coverage theater (empty expects / product weakened for %) | **None observed** on W3 residual |

**Smells (non-fatal):**

1. E2E inequality asserts (above) — primary smell.  
2. Keyboard tests **cannot** prove `applySelectionDelete` runs — only that the handler slot fires (by design).  
3. One non-W3 Feasibility case still uses bare `expect(onPlace).toHaveBeenCalled()` (place path) — out of select residual quality bar; do not confuse with select cases.  
4. Stale `CODE-REVIEW-LIVE.md` residual table (U1–U11 “missing”) is **obsolete** vs current disk suites — do not re-open those as new work without re-read.

---

## Judge 3 — Coverage 90% claims vs Feasibility residual

Source: `results/planner/world-standard-wave/03-select-delete/coverage/coverage-summary.json` + `coverage/COVERAGE-90.md`.

| File | Lines % | Stmts % | Claim vs bar |
|------|--------:|--------:|--------------|
| `workspaceEntityHelpers.ts` | **98.48** | **98.75** | **≥90 PASS** (honest) |
| `useWorkspaceKeyboard.ts` | **100** | **100** | **≥90 PASS** (honest) |
| `canvasPicking.ts` | **100** | **100** | **≥90 PASS** (honest) |
| `history.ts` | **100** | **100** | **≥90 PASS** (residual pack incl. history suite) |
| `FeasibilityCanvas.tsx` | **76.86** | **74.63** | **RESIDUAL** — **not** claimed as full-file 90 |

**Honesty:** COVERAGE-90.md correctly labels Feasibility residual and refuses theater paint/search tests for fake 90. That matches owner law. Residual uncovered mass is shell/proof chrome, not the select pointer path covered by real id asserts.

**Caveat:** overall pack aggregate ~83% lines is **not** a W3 bar failure — bar is per hard-required file + honest Feasibility residual report.

---

## Judge 4 — Browser vs unit: can anyone claim W3 PASS?

| Half | Disk state (this seat) | Can claim? |
|------|------------------------|------------|
| Unit residual pack | Logs show **62/62** (4 files) green historically; pure suites strong | **Unit half pass** — yes |
| Browser hard gate | Playwright list logs **1 passed**; PNGs on disk; `run.json.status` = **`pass`** | **Browser exit green** — yes on tip of that prove |
| Combined W3 / CP-03 | **Unit alone ≠ W3** still binding | Combined claim requires **both** halves + no paper docs |

**Conflicts (paper-moon risk if cherry-picked):**

| Doc | Status claim |
|-----|----------------|
| `run.json` | `status: "pass"` (HEAD pin may lag tip) |
| `W3-ACCEPTANCE.md` | **PASS** |
| `PROOF-INDEX.md` | Combined **`open`**, browser tip fail narrative |
| `NOTES.md` (Agent 9) | **`open`**, browser RED on tip |
| `CODE-REVIEW-LIVE.md` | Empty evidence / residual missing (stale) |

**Rule for head / next seats:**  
- **Do not** claim W3 from unit logs alone.  
- **Do not** claim identity undo from browser (count-only).  
- **Do not** treat residual PNGs without matching tip `browser-w3-raw.log` exit 0 as proof.  
- Reconcile `PROOF-INDEX` / `NOTES` with latest green browser **or** re-prove and re-pin HEAD — status drift is itself a honesty defect.

**Can anyone claim W3 PASS right now?**  
**Only with caveats:** browser soft asserts + document drift. A clean CP-03 close wants exact count chain + synced meta. **Unit product-path quality is APPROVE; phase gate packaging is APPROVE-WITH-FIXES.**

---

## Product path correctness (brief)

```text
Select tool pointer
  → pickFurnitureAtPoint (or opening/wall/room)
  → workspaceCanvas.setSelection({ type, ids })

Delete | Backspace
  → useWorkspaceKeyboard preventDefault
  → OOPlannerWorkspace.deleteSelection
  → updateProject(p => applySelectionDelete(p, selection))  // one history step
  → setSelection({ type: "none", ids: [] })

Ctrl+Z
  → undoOpen3dAction / runUndo  // restores prior project revision (ids+pose)
```

This matches the W3 spine. Multi-id is **not** an N× `updateProject` loop on the live wire.

---

## Top fixes required (ordered)

### F1 — Harden e2e count contract (Important)

In `site/tests/e2e/open3d-w3-select-delete.spec.ts`:

- After Delete: expect **exactly** `afterPlace - 1` (or `afterPlace - deletedCount` if multi intentionally).  
- After Ctrl+Z: expect **exactly** `afterPlace`.  
- Drop `toBeLessThan` / `toBeGreaterThan` as sole proof.

Optional strength: assert properties panel shows a furniture-related heading/id, not only absence of “No Selection”.

### F2 — Reconcile phase meta (Important / honesty)

Single source of truth under `03-select-delete/`:

- Align `run.json`, `PROOF-INDEX.md`, `NOTES.md`, `HEAD.txt` to the **same** tip prove.  
- Either mark browser green with soft-assert caveat **or** re-prove after F1 and mark pass cleanly.  
- Mark `CODE-REVIEW-LIVE.md` residual U-table as **superseded** by residual land (do not leave “missing tests” as live truth).

### F3 — Optional wire unit (Minor / residual doubt)

If multi-id history at React boundary is ever disputed again: add thin `workspaceDeleteSelection.wire` (or extend workspace shell) that:

- multi-select furniture → invoke same logic as `deleteSelection`  
- assert **one** history past push + selection cleared  

Not required if F1 exact counts land and pure U4/U5 stay green.

---

## What must **not** be rebuilt

- Pure `applySelectionDelete` design (return project only; same-ref no-ops).  
- pickFurniture / keyboard preventDefault product paths.  
- Fabric furniture ON for W3 proof (must stay OFF).  
- Fake Feasibility 90% via proof-mode UI tests.

---

## Summary scorecard

| Criterion | Score |
|-----------|-------|
| Product path correct | **PASS** |
| Unit tests match product (id/pose/preventDefault) | **PASS** |
| Unit soft/fake | **NONE material** |
| skip / any | **PASS (0)** |
| Coverage hard files ≥90 | **PASS (honest)** |
| Feasibility residual honesty | **PASS (reported residual)** |
| E2e contract strength | **WEAK** (inequality + count-only) |
| Evidence meta consistency | **FAIL / drift** |
| Claim “W3 PASS” without caveat | **REJECT** |
| Seat verdict | **APPROVE-WITH-FIXES** |

---

## One-line verdict

**APPROVE-WITH-FIXES** — unit product-path honest; harden e2e exact counts; sync proof meta; no unit-alone W3 PASS.

### Top 3 issues

1. **E2E soft asserts** (`toBeLessThan` / `toBeGreaterThan`) — not exact 4→3→4; selection is negative-only.  
2. **Evidence status drift** — `run.json` pass vs `PROOF-INDEX`/`NOTES` open; stale residual-missing tables.  
3. **No React-boundary wire unit** for `OOPlannerWorkspace.deleteSelection` (pure+history cover multi-id; browser count-only).
