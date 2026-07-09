# INTERCEPT-STATUS — Catalog Add pointer intercept

| Field | Value |
|-------|--------|
| **Date** | 2026-07-09 |
| **Agent** | systematic-debugging (Elon standard / role 5) |
| **Checkout** | `D:\OandO07072026` |
| **Verdict** | **CLOSED** (root-cause CSS) · **RESIDUAL** (proof + secondary geometry) |

---

## 1. Verdict (one line)

**CLOSED** for the documented root cause (vertical nested-scrollport clip → wrong `elementFromPoint` target).  
**RESIDUAL** for live mouse/e2e hit-test proof without `el.click()`, plus secondary paths (horizontal bleed, configurator height collapse).

Do **not** claim “catalog mouse place fully fixed.” Do claim: **the CSS fix matches and addresses ROOT-CAUSE §3.**

---

## 2. Phase 1 — Root cause (read, not guessed)

**Authority:** `results/planner/quality-wave-agents/debug/ROOT-CAUSE.md`

| Item | Fact |
|------|------|
| **Symptom** | Playwright `locator.click()` on `Add … to canvas` → timeout **pointer intercept** |
| **Reported interceptors** | `footer.workspace_status` / `inventory_resultsInfo` (module hashes) |
| **Mechanism** | Tall cards in short `.itemGrid` (`overflow-y: auto`) → actionability uses **layout-box center** → center can sit **outside overflow clip** → hit lands on in-flow chrome below/adjacent (status grid row, results strip) |
| **Not the cause** | Fixed/sticky modal overlay; missing React handlers; need for `force: true` |
| **Status chrome** | `workspace.module.css` `.status` = `grid-area: status`, `min-height: 2.25rem` — **not** `position: fixed` |

Supporting evidence (prior wave, not re-run this task):

- `results/planner/world-standard-wave/gate-e2e/AGENT2-NOTES.md` — W3 smoke intercept
- `results/planner/quality-wave-agents/chrome-devtools/LIVE-NOTES.md` §5 — `elementFromPoint` footer / rail / canvas samples
- `site/tests/e2e/plannerCanvasHelpers.ts` `clickCatalogAddToCanvas` — documents intercept; uses `scrollIntoViewIfNeeded` + **`el.click()`** (bypasses hit-test)

**Engines:** untouched this investigation (no place-model / three / fabric thrash).

---

## 3. Phase 2 — Product fix vs ROOT-CAUSE mapping

**File:** `site/features/planner/open3d/editor/inventory.module.css`  
**Diff status at verify:** uncommitted working tree (`git status` → `M` on this file only for the two scroll props)

| ROOT-CAUSE need | Landed CSS | Match? |
|-----------------|------------|--------|
| Improve scroll-into-view so Add **center stays inside** `.itemGrid` clip | `.itemGrid { scroll-padding-block: 0.75rem; }` | **Yes** — padding on the **scrollport** |
| Same for the Add control’s scroll target box | `.emptyAction { scroll-margin-block: 0.75rem; }` | **Yes** — margin on the **Add** control |
| Avoid `pointer-events: none` on status | Not applied | **Yes** — rejected hack |
| Avoid `force: true` as product “fix” | Not applied | **Yes** |
| No engine thrash | CSS only | **Yes** |

**Wiring proof (Add uses the margined class):**

```646:660:site/features/planner/open3d/editor/InventoryPanel.tsx
                <button
                  type="button"
                  className={styles.emptyAction}
                  aria-label={`Add ${item.shortName} to canvas`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onItemPlace?.(item.id, null, { x: 0, y: 0 });
                    ...
                  }}
                >
                  Add {item.shortName} to canvas
                </button>
```

**CSS proof (landed props + comments):**

```377:386:site/features/planner/open3d/editor/inventory.module.css
.itemGrid {
  ...
  overflow-y: auto;
  /* Keep Add actions fully inside the scrollport after scroll-into-view
     (Playwright + real pointer hit-tests fail when card center is clipped). */
  scroll-padding-block: 0.75rem;
```

```605:618:site/features/planner/open3d/editor/inventory.module.css
.emptyAction {
  ...
  /* Nested overflow: when only the edge of a tall card is visible, the
     layout-box center can sit under status / results chrome — leave margin. */
  scroll-margin-block: 0.75rem;
}
```

**Panel containment (context, not part of this fix):** `.panel { overflow: hidden; min-height: 0; }` — inventory column already clips; issue is **nested** `.itemGrid` scrollport vs tall cards.

---

## 4. Phase 3 — Hypothesis test (no thrash)

| Hypothesis | Result |
|------------|--------|
| CSS targets wrong selector (e.g. margin on card, not Add) | **Rejected** — `emptyAction` is the catalog Add button class |
| Status is a fixed overlay; need z-index/pointer-events | **Rejected** — ROOT-CAUSE + workspace CSS |
| scroll-padding/margin incomplete for this RC → need another CSS knob now | **Rejected** — mechanism is scroll-into-view geometry; both ends of the pair (scrollport + target) are set |
| Fix “closes all catalog mouse risk” | **Rejected** — see residuals |

**One more minimal CSS fix?** **No.**  
Further density redesign, sticky Add, or horizontal clip hacks would expand scope past ROOT-CAUSE §4C and risk thrash. Optional follow-ups stay in ROOT-CAUSE §7.

---

## 5. Closed vs residual

### CLOSED (this slice)

| Claim | Proof |
|-------|--------|
| Root cause identified and recorded | `quality-wave-agents/debug/ROOT-CAUSE.md` |
| Minimal product CSS matches RC mechanism | scroll-padding on `.itemGrid` + scroll-margin on `.emptyAction` |
| Wrong fixes not applied | no force-click product path; no status `pointer-events: none`; engines untouched |
| Gate place policy still product-correct | configurator / harness `el.click()` remain intentional; not re-opened here |

### RESIDUAL (open — do not greenwash)

| Residual | Why still open | Owner next |
|----------|----------------|------------|
| **R1** No dedicated e2e: catalog Add under Desktop Chrome **without** `el.click()` / force | Gates/helpers still bypass hit-test → CSS not regression-locked | ROOT-CAUSE §7.1 |
| **R2** `clickCatalogAddToCanvas` still uses `evaluate(el => el.click())` | Honest harness for non-hit-test paths; not proof of mouse reachability | Keep comment; optional real-click contract later |
| **R3** Horizontal hit steal (tool rail / canvas) per LIVE-NOTES | Different geometry than vertical scrollport clip; **not** this RC | Separate slice if product-critical |
| **R4** Systems configurator expanded → catalog browser height ≈ 0 | Layout competition; mouse cannot reach Add until collapse | Separate layout slice |
| **R5** CSS still **uncommitted** at this write | Evidence exists; land with quality-wave commit | Main agent merge |

---

## 6. What was not done (scope discipline)

- No Playwright / Vitest re-run of engines or world-standard pack (would not prove CSS alone while helpers use `el.click()`)
- No second CSS “just in case” bump of 0.75rem without failing hit-test evidence
- No `force: true`, no status `pointer-events` change
- No engine / place-model edits

---

## 7. Return for orchestrator

```
STATUS: CLOSED (root-cause CSS) + RESIDUAL (R1–R5)
```

- **Product fix for ROOT-CAUSE:** complete and correctly targeted.  
- **Intercept “gone for all catalog mouse paths”:** **not** claimed — residual list above.  
- **Next landable work (not this agent):** commit CSS + pack; optional real hit-test e2e (R1).

---

**Agent** · systematic-debugging · `results/planner/elon-standard/debug/INTERCEPT-STATUS.md` · 2026-07-09
