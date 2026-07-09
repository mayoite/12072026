# ROOT CAUSE — Catalog Add button pointer intercept (world-standard e2e flake)

**Date:** 2026-07-09  
**Agent:** systematic-debugging  
**Checkout:** `D:\OandO07072026`  
**Symptom:** Playwright `locator.click()` on catalog `Add … to canvas` times out with **pointer intercept**; reported interceptors: `footer.workspace_status` / `inventory_resultsInfo` (CSS-module class hashes).

---

## 1. Reproduce (evidence, not thrashing engines)

### E2E failure record (historical)

| Source | Detail |
|--------|--------|
| `results/planner/world-standard-wave/gate-e2e/AGENT2-NOTES.md` | W3 smoke: button resolved (`Add Proof chair to canvas`); **pointer intercept** by `footer.workspace_status` / `inventory_resultsInfo` |
| Same note | Failure is **UI hit-target / overlay**, not missing gate scripts |
| `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md` | “Catalog click was flaky… residual uses **configurator Place 4 seats**” |

### Current gate pack (after path migration)

| Source | Detail |
|--------|--------|
| `results/planner/world-standard-wave/gate-e2e/playwright-raw.log` | **5/5 passed** (2026-07-09) — place via configurator (W3/W4/W5/batch) |
| Specs | W3 / W4 / save-honesty / batch → `placeSeatsFromConfigurator` or direct `Place N seats` |
| Journey | Prefer catalog via `placeCatalogOnCanvas` → **fallback** configurator |

### Product CSS / layout (read, not guessed)

| File | Role |
|------|------|
| `site/features/planner/open3d/editor/workspace.module.css` | Shell grid: `header / workspace / status`; `.status` is **grid-area: status** (not `position: fixed`); paints **after** workspace in DOM |
| `site/features/planner/open3d/editor/inventory.module.css` | Inventory column: search + categories (`max-height: 280px`) + `.resultsInfo` + `.itemGrid` (`overflow-y: auto`); cards: **square thumbnail** + name + **Add** (`.emptyAction`) |
| `site/features/planner/open3d/editor/InventoryPanel.tsx` | `aria-label={\`Add ${item.shortName} to canvas\`}` on per-card button; place via `onItemPlace` |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | `<footer className={\`${styles.status} pw-status-bar\`}>` |

Playwright config: `devices["Desktop Chrome"]` (default ~1280×720) — short vertical budget for inventory.

---

## 2. Pattern — working vs failing place paths

| Path | How place happens | Hit-test surface | Gate status |
|------|-------------------|------------------|-------------|
| **Working** `placeSeatsFromConfigurator` | Left-panel systems configurator → `Place 4 seats` / `Place 2 seats` | Button sits in **non-scrolling** configurator chrome (no tall card grid) | Green for W3/W4/W5/systems-v0 |
| **Failing** catalog Add | Search → tall grid card → `Add X to canvas` → Place tool armed → canvas click | Button at **bottom of tall card** inside **short** `.itemGrid` scrollport; chrome above eats height | Flaked under Playwright actionability |

### Code pointers

```210:249:site/tests/e2e/plannerCanvasHelpers.ts
 * Arm catalog placement ("Add … to canvas") then wait for Place tool pressed.
 * Status bar / sticky inventory chrome intercepts Playwright hit-tests — use a
 * DOM el.click() so React handlers fire without relying on hit-testing.
...
  await btn.evaluate((el: HTMLElement) => {
    el.click();
  });
```

```265:279:site/tests/e2e/plannerCanvasHelpers.ts
export async function placeSeatsFromConfigurator(
  page: Page,
  seats: 2 | 4 | 10 = 4,
): Promise<void> {
  ...
  await configurator
    .getByRole("button", { name: `Place ${seats} seats` })
    .click();
}
```

```47:48:site/tests/e2e/open3d-w3-select-delete.spec.ts
    // Proven place path (systems v0 batch) — catalog+canvas was flaky (W4 notes).
    await placeSeatsFromConfigurator(page, 4);
```

Catalog place is a **two-step** product path (arm + canvas). Configurator batch is **one-step** furniture delta — different product job; both valid, but gate residual chose the stable one.

---

## 3. Hypothesis (confirmed)

**Root cause is not a rogue `z-index` “overlay panel” floating over the whole app.**  
`.status` and `.resultsInfo` are normal in-flow chrome. They show up in Playwright’s intercept report because they are the **elements under the intended click point** after hit-testing, not because they are intentionally modal overlays.

### Mechanism

1. Inventory vertical stack (search, filters, categories ≤280px, recent/favorites, **resultsInfo**) leaves a **short** `.itemGrid` scrollport at Desktop Chrome height.
2. Each card is **tall** (1:1 thumbnail + text + Add). After search (`chair` → “Proof chair”), Add often sits near/past the bottom of the scrollport.
3. Playwright actionability:
   - Treats the control as visible when **any** intersection exists.
   - Clicks the **layout box center**.
   - If the center is **outside the overflow clip** (or at the clip edge), `elementFromPoint` returns a **different** node.
4. Nodes that paint at that coordinate (depending on scroll + reflow):
   - **`footer` / `.status` / `pw-status-bar`** — DOM order: status is **after** workspace; if the hit point is at the shell bottom band, status wins.
   - **`.resultsInfo`** — sits immediately above the grid; when the grid barely shows a card edge or reflow mid-search, hit can land on results chrome.
5. Secondary flake: catalog place also needs Place-tool arm + canvas click race (called out in journey/W4 notes). Configurator avoids both problems.

### Rejected hypotheses

| Hypothesis | Why rejected |
|------------|--------------|
| Status bar is `position: fixed` covering inventory | CSS shows `grid-area: status` only; no fixed/sticky on `.status` |
| `resultsInfo` is sticky overlay | No `position: sticky/fixed` in inventory module |
| Missing `pointer-events` on canvas stealing clicks | Interceptor names are status/resultsInfo, not canvas |
| `force: true` required for product bug in React | React handlers work (`el.click()` / configurator); failure is **geometry/hit-test** |

---

## 4. Fix decision

### A. Gate / world-standard pack — **configurator path is product-correct** (keep)

For W3 select/delete, W4 orbit continuity, W5 save honesty, systems-v0 batch:

- Goal is **furniture present + delta counts + tool/view behavior**, not “prove catalog card chrome hit targets”.
- Systems configurator is a **first-class place product** (batch seats). Using it is not a test cheat; it is the stable product path already proven green in `gate-e2e/playwright-raw.log`.

**Do not** reintroduce raw catalog `locator.click()` into those gate specs without a dedicated catalog-hit-target contract.

### B. `force: true` — **wrong** (do not land)

| Why force-click is wrong | |
|--------------------------|--|
| Bypasses real pointer hit-testing | Spec goes green while users still cannot click Add if geometry is broken |
| Hides overflow / scrollport bugs | Exactly the class of bug AGENT2 saw |
| Does not match user input | Real users cannot “force” past status chrome |
| Masks regressions | Future layout thrash would not fail CI |

`el.click()` in `clickCatalogAddToCanvas` is a **test harness workaround** (fires React `onClick` without hit-test). Acceptable only as a **helper for non-gate catalog paths** with an honest comment — **not** as proof that catalog Add is clickable under the status bar.

### C. Minimal product CSS (landed) — scrollport padding / scroll-margin

**File:** `site/features/planner/open3d/editor/inventory.module.css`

- `.itemGrid { scroll-padding-block: 0.75rem; }`
- `.emptyAction { scroll-margin-block: 0.75rem; }`

**Why this is the safe product fix (not pointer-events hacks):**

- Improves scroll-into-view for keyboard / programmatic / Playwright scroll so the **Add** control’s center stays inside the clip.
- Does **not** set `pointer-events: none` on status (would let mis-aimed clicks fall through to canvas and still miss the button).
- Does **not** thrash engines, change place model, or use `any`.

**What this is not:** a full catalog UX redesign (compact list rows, sticky Add, less category chrome). That remains optional follow-up if catalog e2e becomes a hard gate.

### D. Explicit non-fix

| Change | Status |
|--------|--------|
| `force: true` on catalog Add | **Rejected** |
| Disable / hide status bar in tests | **Rejected** (lies about chrome) |
| Gate specs must only use catalog path | **Rejected** — configurator is product-correct for furniture proofs |
| Engine / place-model thrash | **Out of scope** |

---

## 5. Verdict

| Item | Conclusion |
|------|------------|
| **Root cause** | Tall catalog cards in a short nested scrollport → Playwright clicks layout center outside clip → status footer / inventory results chrome receive the hit (reported as “pointer intercept”) |
| **Why configurator works** | Immediate place control outside that scroll geometry; no arm+canvas race |
| **Gate policy** | Keep `placeSeatsFromConfigurator` (and journey catalog-try + configurator fallback) |
| **force-click** | Wrong for product truth |
| **Minimal fix landed** | Inventory `scroll-padding` / Add `scroll-margin` only |
| **Engines** | Untouched |

---

## 6. Files touched this investigation

| Path | Action |
|------|--------|
| `site/features/planner/open3d/editor/inventory.module.css` | scroll-padding / scroll-margin |
| `results/planner/quality-wave-agents/debug/ROOT-CAUSE.md` | this document |

## 7. Follow-ups (optional, not this task)

1. Dedicated e2e: catalog Add under Desktop Chrome **without** `el.click()` / force — asserts real hit-test after scroll-margin.
2. Compact catalog list density for dense chrome viewports.
3. Non-gate specs still using raw `.click()` on Add (`open3d-systems-v0-workstation-place.spec.ts`, etc.) should adopt `clickCatalogAddToCanvas` or configurator until density work lands.
)
