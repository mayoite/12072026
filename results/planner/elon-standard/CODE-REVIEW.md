# CODE-REVIEW — Elon standard

| | |
|--|--|
| **Date** | 2026-07-09 |
| **Checkout** | `D:\OandO07072026` |
| **Range** | `eda1f1e..HEAD` + dirty worktree |
| **HEAD** | `79648b4` |
| **Prior tip** | `eda1f1e` (gate:open3d wire) |
| **Bar** | Ship product that works. No half claims. Gate green = claim true. |

## Scope

| Slice | State |
|-------|--------|
| TopBar / OOPlannerWorkspace a11y labels | **dirty** (`TopBar.tsx`, `OOPlannerWorkspace.tsx`) + untracked `TopBar.a11y.test.tsx` |
| inventory.module.css scroll fixes | **dirty** |
| e2e place path / wall retry | committed `eda1f1e` + `79648b4` |
| gate:open3d wire | committed `eda1f1e` |
| pickOpening unit edges | committed `bda0de6` |
| tool rail / keyboard units | **dirty** + untracked `canvasToolRail.a11y.test.tsx` |

## Independent re-run (this review)

```text
pnpm exec vitest run
  canvasPicking.test.ts
  open3dWorkspaceKeyboard.test.tsx
  toolShortcutTruth.test.ts
  canvasToolRail.a11y.test.tsx
  playwrightOpen3dWorldSpecs.test.ts
→ 5 files · 54 tests · EXIT 0
```

Gate pack evidence (prior run, not re-executed here):  
`results/planner/world-standard-wave/gate-e2e/run.json` — **PASS**, exit 0, 5/5 specs (~28s).

---

## Strengths

1. **gate:open3d is real, not folder theater**  
   Root + site scripts → `run-open3d-world-e2e.mjs` → manifest `playwright-open3d-world-specs.json` → disk existence check → `run.json` + raw log. Unit contract locks specs, W-gate basenames, workers=1, package scripts. That is a callable gate.

2. **A11y label-in-name fixes match WCAG 2.5.3 and prior LH fails**  
   Visible **Focus** / **Restore** / **Prefs** / **Commands** now appear inside `aria-label`. LH previously failed on `"Maximize canvas"`, `"Open preferences menu"`, `"Open command palette (Ctrl+K)"` vs visible text. Fix is the right pattern; `TopBar.a11y.test.tsx` asserts it.

3. **pickOpening tests hit real edges**  
   Endpoints 0/1, diagonal interpolate + perpendicular in-tol, inclusive `distance === tol` hit / `tol+ε` miss. Matches `canvasPicking.ts` (`if (distance > toleranceMm) continue`). Not vanity coverage.

4. **W3/W4/W5 place path honesty**  
   Save / select-delete / orbit use configurator `Place N seats` and say so. Correct product job for those gates.

5. **Inventory CSS is minimal and scoped**  
   `scroll-padding-block` / `scroll-margin-block` on grid + card — scroll-into-view margin only. Comments do not claim full hit-test fix.

---

## Issues

### Critical (Must Fix before claiming the thing green)

#### C1 — Journey gate can pass without catalog place while still titled as catalog

**File:** `site/tests/e2e/open3d-world-standard-journey.spec.ts`  
**Title:** `guest enter → draw wall → place ≥2 catalog items → 2D/3D`  
**Body:** try catalog → catch → `placeSeatsFromConfigurator(4)` → assert furniture Δ ≥ 2 only.

**Why Critical:** Gate pack includes this as **W1–W2**. Green pack does **not** prove catalog Add + canvas place. Configurator is a different product surface. Title/claim lie when fallback wins. That is unlock-theater’s cousin: **green theater**.

**Fix (pick one):**
- A) Rename test + comments to “place ≥2 furniture (catalog preferred, configurator fallback)” **and** record `placedViaCatalog` in evidence JSON; scoreboard must not say “catalog place closed.”  
- B) Split: journey uses configurator only (honest); dedicated catalog hit-test e2e **fails** if only `el.click()` / fallback works.  
- C) Fail the journey if catalog path fails (strict) — only after product hit-test is actually fixed.

**Do not ship the narrative “W1–W2 catalog journey closed” until A/B/C is chosen and scoreboard matches.**

#### C2 — Wall contract half-assert (comment vs code)

**File:** same, ~85–106 (commit `79648b4`)  
**Comment:** “assert +1 from our draw”  
**Code:** retry second segment; final `wallsAfterDraw > wallsBefore` (not `=== wallsBefore + 1`).

**Why Critical for W1 claim:** Retry after soft-fail poll can land **+2** walls and still pass. W1 “one intentional interior wall” is unlocked. Flake paper.

**Fix:** After successful path, assert exact +1; on retry, reset/undo partial wall or use one draw + longer poll + stable coords. Align comment with assert.

---

### Important (Should Fix)

#### I1 — Worktree not landed

Dirty/untracked at review tip:

| Path | State |
|------|--------|
| `TopBar.tsx`, `OOPlannerWorkspace.tsx` | modified |
| `inventory.module.css` | modified |
| keyboard + shortcut tests | modified |
| `canvasToolRail.a11y.test.tsx`, `TopBar.a11y.test.tsx` | untracked |

Remote `main` lacks a11y + CSS + rail tests. Commit before calling wave closed.

#### I2 — Catalog helper bypasses pointer hit-test

**File:** `site/tests/e2e/plannerCanvasHelpers.ts` — `clickCatalogAddToCanvas` uses `el.click()` / synthetic MouseEvent.

**Why:** Status bar / inventory geometry intercepts real clicks (debug + Chrome live notes). Helper proves React arming, **not** mouse reachability.

**Fix:** Keep helper for non-catalog gates; never cite it as “catalog mouse fixed.” Need dedicated hit-test e2e without DOM click bypass.

#### I3 — CSS does not close catalog vertical collapse

**File:** `inventory.module.css`  
**Live fact:** systems configurator expanded → catalog height ≈ 0; rail/status steal centers.

Scroll margin helps scroll-into-view; does not restore height budget. Commit message must not say “catalog click fixed.”

#### I4 — Mobile panel toggles still 0×0 focusable

**Out of this diff’s “Critical-only a11y” brief**, still open: Inventory/Properties mobile buttons tabbable when visually gone. Next a11y slice: `display:none` / unmount on desktop.

#### I5 — Opening shortcut test duplication

`O` covered in both `toolShortcutTruth` and `open3dWorkspaceKeyboard`. Fine for now; one arming test is enough long-term.

---

### Minor

- `canvasPicking` describe-local `wall` shadows helper name — rename to `baseWall` (VERIFY race already logged).
- Journey still searches “chair” with loose `/Add .* to canvas/i` — ok with honest fallback policy.
- Deleted `debug-wall.mjs` from evidence tree in `79648b4` — good cleanup if no longer needed.

---

## Slice verdicts

| Slice | Verdict | Note |
|-------|---------|------|
| **TopBar / Commands a11y labels** | **SHIP** | Correct label-in-name; land + keep `TopBar.a11y.test.tsx` |
| **inventory scroll CSS** | **SHIP** | Scoped; claim only scroll-into-view margin |
| **pickOpening units** | **SHIP** | Real edges; green 31 pick tests in file |
| **tool rail / keyboard units** | **SHIP** | Real role/name + setTool; land untracked file |
| **gate:open3d wire** | **SHIP** | Callable + contract + prior 5/5 PASS |
| **W3/W4/W5 place path** | **SHIP** | Configurator + honest comments |
| **Journey W1 wall + W2 catalog claim** | **FIX C1+C2 first** | Do not advertise closed |

---

## Recommendations

1. Commit dirty a11y + CSS + unit tests in one landable slice; re-run 54-test set; log under `results/planner/elon-standard/`.  
2. Fix C1+C2 before scoreboard language for W1–W2.  
3. Leave configurator as furniture prep for W3–W5.  
4. Next product slice for catalog: layout budget when configurator open + hit-test e2e (no `force`, no silent fallback as sole green path).  
5. Do not re-run a11y agent claiming chrome clean until Focus/Prefs/Commands LH re-pass after land.

---

## Assessment

### Overall verdict: **SHIP product units + a11y labels + CSS + gate wire; FIX Critical first on journey claim honesty**

| Question | Answer |
|----------|--------|
| Ready to merge a11y labels + CSS + unit tests? | **Yes** (after commit) |
| Ready to keep `gate:open3d` as callable entry? | **Yes** |
| Ready to treat pack green as “catalog place + exact +1 wall closed”? | **No — C1/C2** |
| Production security / data loss in this diff? | **None found** |

**Reasoning:** Wiring, geometry units, and label-in-name are solid and re-verified. The failure mode that matters for Elon bar is **gates that pass while the advertised job is not done**. Journey wall loosen + catalog→configurator silent success is that failure mode. Ship the honest product fixes; fix the lying assertions/titles before calling W1–W2 closed.

**Reviewer:** elon-standard code-review subagent  
**Output:** `results/planner/elon-standard/CODE-REVIEW.md`
