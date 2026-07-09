# CODE-REVIEW — quality-wave-agents

| Field | Value |
|-------|--------|
| **Date** | 2026-07-09 |
| **Reviewer** | code-review subagent (`/using-superpowers` + `/requesting-code-review` bar) |
| **Checkout** | `D:\OandO07072026` |
| **Head (at review)** | `79648b4` + dirty worktree (test-writer-2 + inventory CSS uncommitted) |
| **Prior tip before wave tests** | `eda1f1e` (e2e gate wiring) / `bda0de6` (pickOpening tests) |
| **Quality bar** | Real tests · no unlock theater · no half claims · evidence under `results/planner/quality-wave-agents/` |

## Scope reviewed

| Agent / role | Evidence | Product touch |
|--------------|----------|---------------|
| **1 Test writer 1** — opening pick units | `test-writer-1/NOTES.md`, `vitest.log`; commit `bda0de6` | `site/tests/.../canvasPicking.test.ts` (+3 cases) |
| **2 Test writer 2** — tool rail / keyboard | `test-writer-2/NOTES.md`, `vitest.log` | `toolShortcutTruth.test.ts`, `open3dWorkspaceKeyboard.test.tsx`, **new** `canvasToolRail.a11y.test.tsx` (**uncommitted**) |
| **3 Chrome DevTools** live guest | `chrome-devtools/LIVE-NOTES.md` + PNG/txt shots | none (facts only) |
| **4 A11y audit** | `a11y/A11Y-REPORT.md`, LH `report.json` (score **0.98**) | none (Critical-only brief → 0 code edits) |
| **5 Systematic debug** catalog pointer | `debug/ROOT-CAUSE.md` | `inventory.module.css` scroll-padding/margin (**uncommitted**) |
| **8 Verify** | `VERIFY.md` | re-ran tsc + partial vitest (claimed 40/40) |
| **E2e pack (orchestrator/main)** | commit `79648b4`, gate-e2e `run.json` | `open3d-world-standard-journey.spec.ts` wall retry + place fallback |
| **This reviewer’s re-run** | `code-review-vitest.log` | **50/50** on wave unit set (5 files) |

**Independent re-run (reviewer):**

```text
pnpm exec vitest run
  geometry/canvasPicking.test.ts
  geometry/canvasPicking.quality.test.ts
  open3dWorkspaceKeyboard.test.tsx
  toolShortcutTruth.test.ts
  canvasToolRail.a11y.test.tsx
→ Test Files  5 passed · Tests  50 passed · EXIT 0
```

---

## Strengths

1. **Real pick-edge tests, not coverage theater (TW1)**  
   Added contracts the prior quality review called out: wall endpoints (`position` 0/1), **diagonal** wall interpolation + perpendicular offset + far miss, and **inclusive** tolerance (`distance === tol` hit / `tol+ε` miss). Matches `pickOpeningAtPoint` (`distance > toleranceMm` skip). No production rewrite for vanity coverage.  
   Fixtures: `canvasPicking.test.ts` ~372–433.

2. **Map-driven keyboard + rail a11y tests assert authority, not a second table (TW2)**  
   - Opening `O` via `CANVAS_TOOL_SHORTCUTS` + live `keydown` → `setTool("opening")`.  
   - Rail DOM: `getByRole("button", { name: "Select (V)" / "Opening (O)" })`, `aria-pressed`, nav `Canvas tools`.  
   Aligns with `CanvasToolRail.tsx` (`aria-label={\`${label} (${shortcut})\`}`) and `useWorkspaceKeyboard` inverted map. Real behavior.

3. **Live browser honesty (Chrome DevTools)**  
   `LIVE-NOTES.md` records what works (Select/Wall/Opening, status bar, local save) **and** what fails for mice: catalog height ≈0 when systems configurator expanded; `elementFromPoint` hits **footer status**, tool rail, or canvas for many Add centers. Does not claim “catalog place proven green” from a11y/programmatic click alone. Correct bar.

4. **A11y agent did not invent Critical fixes**  
   Lighthouse a11y **98**; **0** unnamed interactive controls in scripted pass; Explicit “Critical fixes applied: **None**”. Label-in-name / heading-order / 0×0 mobile toggles logged as Important with file pointers. No half claim that chrome is “a11y complete.”

5. **Debug agent rejected force-click theater**  
   Root cause is **geometry/hit-test** (short nested scrollport + tall cards + in-flow status/results chrome), not a floating z-index modal. Correctly rejects `force: true`, status `pointer-events: none`, and “gate must only use catalog.” Configurator path for furniture **gates** called product-correct. Minimal CSS (`scroll-padding-block` / `scroll-margin-block`) is scoped and documented as **not** a full density redesign.

6. **No unlock / W0 wait theater**  
   Pack and notes execute against unlocked open3d guest; no “blocked on owner unlock” language. Matches standing trust-data unlock docs.

7. **Verify coordinator recorded a real first-fail race**  
   `VERIFY.md` documents transient `wall is not a function` from describe-local fixture shadowing during concurrent TW1 edit, then green re-run. That is honest process evidence, not a silent rewrite of history.

---

## Critical (Must Fix)

**None for production safety.**

No shipping security issue, data loss path, or broken pure-geometry pick contract found in this wave’s product diffs. Opening pick units and keyboard/rail units green on re-run.

*(Critical would apply if the wave claimed “catalog mouse-click is fixed” or “W1 always draws exactly one wall under all flakes” without proof — see Important.)*

---

## Important (Should Fix)

### I1 — Journey e2e weakened wall contract (half claim risk)

**Where:** `site/tests/e2e/open3d-world-standard-journey.spec.ts` ~85–106 (commit `79648b4`)

**What:**
- Comment still says “assert **+1** from our draw.”
- Code now asserts only `wallsAfterDraw > wallsBefore`.
- Retry path: if first two-tap “fails” the poll (or flaky poll), second segment may run while the first actually landed → **+2 walls**, still green.

**Why it matters:**  
This is classic flake-papering. Gate can pass while W1 “one intentional interior wall” is no longer locked. Quality bar: **no half claims**.

**Fix:**
- Keep one retry if needed, but restore **`toBe(wallsBefore + 1)`** after the successful path (or assert `+1` when first succeeds, and if retrying, **undo/clear** failed partial state first).
- Or: single draw with longer poll + better hit coords; only loosen assertion with an explicit residual doc in PARTIALS — not a silent comment/code mismatch.

### I2 — Journey place path can skip catalog without failing the catalog job

**Where:** same file ~108–142; helpers use `el.click()` for catalog Add (`plannerCanvasHelpers` — documented in ROOT-CAUSE).

**What:** Catalog try/catch → silent fallback to `placeSeatsFromConfigurator(4)`. Final assert is furniture delta ≥2 only. Spec still branded as W1–W2 journey including catalog preference.

**Why it matters:**  
Configurator place is a **different product job** (honest for W3/select gates per ROOT-CAUSE). For a journey that still *tries* catalog, green does **not** prove catalog Add is mouse-reachable. Chrome live notes say it often is not.

**Fix:**
- Either split: (A) journey = configurator-only with honest title/comments, or (B) dedicated catalog hit-test e2e that **fails** if only `el.click`/fallback works.  
- Do not treat `79648b4` as “catalog place closed.”

### I3 — Product CSS fix is undersized vs live root cause (and unproven)

**Where:** `site/features/planner/open3d/editor/inventory.module.css` (`.itemGrid` `scroll-padding-block`, `.emptyAction` `scroll-margin-block`) — **uncommitted** at review time.

**What:** Helps scroll-into-view margins; does **not** address LIVE-NOTES finding that **expanded systems configurator collapses catalog height ≈0**, or tool-rail/canvas stealing hits for cards wider than the inventory column.

**Why it matters:**  
Risk of half claim: “pointer intercept fixed” when only scroll-margin landed. ROOT-CAUSE §7 already marks dedicated hit-test e2e as follow-up — keep that honesty in commits/PR text.

**Fix:** Land CSS with message limited to “scroll-into-view margin,” not “catalog click fixed.” Prefer a follow-up density/layout slice for configurator vs catalog vertical budget.

### I4 — Wave product tests not fully landed in git

**Where:** worktree at review:

| Path | State |
|------|--------|
| TW1 `canvasPicking.test.ts` | committed `bda0de6` |
| TW2 keyboard / shortcut / `canvasToolRail.a11y.test.tsx` | **dirty / untracked** |
| inventory CSS | **dirty** |

**Why it matters:** VERIFY and agent NOTES can claim green while `main` tip lacks TW2 + CSS. Remote gate can lag session truth.

**Fix:** Single commit (or two: tests + css) before calling the wave closed; re-run targeted vitest in that commit’s evidence folder.

### I5 — VERIFY pack incomplete vs full wave unit surface

**Where:** `VERIFY.md` — 3 files / 40 tests; omits `toolShortcutTruth.test.ts` and `canvasToolRail.a11y.test.tsx` (TW2 core).

**Why it matters:** Coordinator-2 “GREEN” is true for the subset run, easy to misread as whole-wave unit gate.

**Fix:** Expand VERIFY command to the full five-file set (or whatever the pack lists) and refresh counts; or rename verdict to “partial wave vitest.”

### I6 — Label-in-name a11y Important left open (acceptable this wave; do not over-claim)

**Where:** `a11y/A11Y-REPORT.md` — Focus/Prefs/Commands visible text vs `aria-label` (Lighthouse fail); 0×0 mobile panel toggles still tabbable.

**Why it matters:** Score 98 with binary fails is fine if reported; product cannot claim “a11y chrome clean” without fixing label-in-name.

**Fix:** Next a11y slice: align three names (`TopBar.tsx`, `OOPlannerWorkspace.tsx`) + hide/unmount mobile toggles on desktop — as agent already recommended. Out of Critical for this pack’s brief.

---

## Minor (Nice to Have)

1. **Opening `O` coverage triplicated** — map resolve + keyboard arm appear in both `toolShortcutTruth.test.ts` and `open3dWorkspaceKeyboard.test.tsx`. Acceptable belt-and-suspenders; could keep map in truth file and arming once in keyboard suite.

2. **Select accessible-name string test** in `toolShortcutTruth` only checks template concat, not DOM — mitigated by real `canvasToolRail.a11y.test.tsx` `getByRole`. Keep the rail test as the authority for a11y surface.

3. **`canvasPicking.quality.test.ts` empty openings** — one real null path; fine as non-reg sibling file. Could fold into main describe later to reduce file count.

4. **Describe-local `const wall` shadows helper** — TW1 notes it; diagonal fixture correctly inlined. Prefer rename local fixture to `baseWall` to prevent the race VERIFY saw.

5. **Chrome screenshots** — dense and useful; missing `NOTES` cross-link from AGENT-PACK checklist until `LIVE-NOTES.md` landed late. Next pack: require LIVE-NOTES path in pack table.

6. **Tool rail lacks `data-testid`** — LIVE-NOTES fact; not a defect for unit a11y tests that use roles. Optional e2e ergonomics only.

7. **robots.txt SEO fail** in LH report — correctly scoped out of a11y product chrome.

---

## Recommendations

1. **Commit TW2 tests + inventory CSS** with honest messages; re-VERIFY five unit files → evidence log under this folder.  
2. **Tighten journey wall assert** (I1) before advertising W1 closed in scoreboards.  
3. **Split or relabel catalog vs configurator place** in journey (I2); keep configurator for W3–W5 furniture proofs.  
4. **Optional next slices (priority):** label-in-name three buttons; desktop-hide 0×0 panel toggles; catalog vertical layout when configurator expanded; dedicated catalog hit-test e2e **without** `el.click()`.  
5. Do **not** reintroduce `force: true` on catalog Add.  
6. Integration coordinator (agent 7): one-page rollup of landed vs residual so owner status stays half-honest (spine green ≠ catalog mouse perfect).

---

## Verdict

| Dimension | Assessment |
|-----------|------------|
| Real unit tests (pick + keyboard/rail) | **Pass** — behavior assertions, re-run 50/50 |
| Unlock / wait theater | **None** |
| Live browser + a11y honesty | **Pass** — strengths and residuals both recorded |
| Debug quality (pointer intercept) | **Pass** — root cause solid; force-click rejected |
| Product CSS minimal fix | **Acceptable scoped**; **not** full catalog hit-test close |
| Journey e2e claim strength | **Weakened** — retry + looser wall assert + catalog fallback |
| Git land completeness | **Incomplete** — TW2 + CSS still dirty at review |
| Half claims risk | **Present** on e2e/journey narrative if oversold |

### Assessment

**Ready to merge / close wave?** **With fixes**

**Reasoning:** The quality-wave unit landings are strong where they stay pure: opening pick edges and map-driven tool rail/keyboard a11y tests are real and green. Live + a11y + debug agents stayed honest and avoided unlock theater and force-click theater. Blocking process gaps: **commit the dirty TW2 + CSS**, **stop half-claiming W1 exact wall / catalog mouse place from the loosened journey**, and treat scroll-margin as a partial hit-test aid only. No Critical production bug in pure pick/keyboard code; do not call the wave “fully closed” until I1–I4 are addressed or explicitly residualed on the scoreboard.

| Ready to merge product pure-tests (pick)? | **Yes** (`bda0de6`) |
| Ready to merge TW2 + CSS as-is? | **Yes after commit** (I4) |
| Ready to treat journey e2e as strict W1/catalog proof? | **No** (I1–I2) |

**Reviewer:** code-review subagent · quality-wave-agents · 2026-07-09  
**Output:** `results/planner/quality-wave-agents/CODE-REVIEW.md`
