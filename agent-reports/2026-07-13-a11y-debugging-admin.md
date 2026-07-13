# A11y debugging — Admin primary journeys (2026-07-13)

Skill agent: a11y-debugging.  
Scope: Admin primary journeys only.  
No production code changes. No commit.

## Verdict (brutal)

| Layer | Result | What it proves |
|-------|--------|----------------|
| Unit ADM-A11Y-02..04 | Present; contract + jsdom | Control surface exists in isolation |
| Browser axe WCAG 2.2 AA (Playwright Chromium) | **0 violations** on 3 scoped shells | Automated rules on load snapshot |
| Chrome DevTools MCP / Lighthouse | **FAIL** | Not run this session; no usable MCP Chrome path |
| Full browser WCAG acceptance | **Not fully proven** | Unit green + axe 0 ≠ complete WCAG |

**Do not claim:** Admin is fully WCAG 2.2 AA compliant end-to-end.  
**May claim:** Axe found **zero** violations on the three primary journey shells under `DEV_AUTH_BYPASS=1` in run `2026-07-13T-admin-phases-final`. Unit tests assert keyboard/nudge/live-region contracts for the SVG studio.

---

## Evidence read (verified paths)

### Axe reports

| File | Content |
|------|---------|
| `results/admin/2026-07-13T-admin-phases-final/reports/axe-summary.json` | `totalViolations: 0` |
| `results/admin/2026-07-13T-admin-phases-final/reports/axe-admin-primary.json` | svg-list / svg-edit / price-books each `count: 0`, empty `ids` |

### How axe was scoped (source of truth)

`site/tests/e2e/admin-phases-live.spec.ts` — test `ADM-A11Y-01 axe on primary Admin journeys`:

- Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`
- **Included regions only** (not full document chrome outside these nodes):
  - svg-list → `[data-testid=admin-svg-primary-journey]` @ `/admin/svg-editor`
  - svg-edit → `[data-testid=admin-svg-edit-shell]` @ `/admin/svg-editor/desk-linear-1200-001`
  - price-books → `[data-testid=admin-price-book-page]` @ `/admin/price-books`
- Screenshots: `a11y-svg-list.png`, `a11y-svg-edit.png`, `a11y-price-books.png`
- Auth: `DEV_AUTH_BYPASS=1` (see `run-meta.json`)

### Unit a11y tests

`site/tests/unit/admin/svg-editor/adminA11y.admA11y02_04.test.tsx`

| ID | What unit covers | Limit |
|----|------------------|-------|
| ADM-A11Y-02 | Toolbar roles, stage `role=application` + `tabindex=0`, geom inspector, Publish not `tabindex=-1`, Arrow nudge fires `onDocumentChange` | jsdom; no real AT; heavy mocks (engine, form, previews, router) |
| ADM-A11Y-03 | Drag action data attrs; zoom buttons; inspector alts for move/resize | Path nodes **cannot** nudge (`nudgeSceneNodePatch` → `null`); no live drag path tested |
| ADM-A11Y-04 | `aria-live` on stage status, publish feedback, shell state; CSS contains `:focus-visible` selectors | Asserts attribute + stylesheet text; **not** that AT announces or that outline paints in a browser |

### Supporting browser logs (same run)

| Artifact | Note |
|----------|------|
| `logs/p1-keyboard-focus.json` | After 2× Tab from studio, focus landed on **Bring to front** button — only a sample, not a full tab order audit |
| `logs/mobile-scroll.json` | 390px: `clientWidth === scrollWidth` (no page H-overflow on list) |
| `logs/run-meta.json` | Routes smoked include catalog/inventory/planner-catalog; **axe not run on those** |

### Prior related report

`agent-reports/2026-07-13-admin-playwright-live.md` — same axe 0 claim; badge contrast fix for ADM-A11Y-01; MCP Lighthouse blocked.

### Active blocker (already catalogued)

`Failures.md` — **GAP: Chrome DevTools MCP / Lighthouse a11y path blocked** (no Google Chrome stable on host; Playwright Chromium ≠ MCP channel).

---

## Chrome DevTools MCP / Lighthouse attempt

| Check | Result |
|-------|--------|
| This agent tool surface | No invocable Chrome DevTools MCP tool schema available for Lighthouse navigation |
| Host Chrome (documented) | Missing at standard install paths (Failures.md + prior live report) |
| Path status | **FAIL for MCP/Lighthouse** |

Mitigation already used elsewhere: Playwright + `@axe-core/playwright`. That does **not** close the MCP/Lighthouse gap.

---

## Primary journeys vs coverage holes

### In axe primary set (0 violations)

1. SVG inventory list (`/admin/svg-editor`)
2. SVG studio edit (`/admin/svg-editor/:slug`)
3. Price books (`/admin/price-books`)

### Smoked in live suite but **no axe evidence**

- `/admin` dashboard
- `/admin/catalog`
- `/admin/inventory`
- `/admin/planner-catalog`
- `/admin/workspace-catalog`

Residual risk: contrast, labels, landmark, and table issues on those pages are **unknown** under WCAG automation.

---

## Residual WCAG risks (honest)

Risks remain even with axe `0` and unit green.

### 1. Axe scope and timing (high)

- Only three shells; `include()` excludes outer layout/nav.
- Run is a **static load** analyze — not post-dialog, post-confirm, post-error, post-filter, or post-publish DOM.
- Dynamic content (validation errors, busy states, history panel updates) may introduce issues never scanned.

### 2. Keyboard completeness (medium–high)

- Unit proves controls exist and Arrow nudge works for **rect** in jsdom.
- Live Tab sample only shows focus can move; not a complete author→publish keyboard path.
- Stage uses `role="application"` — AT users must know application keyboard model; trap/escape behavior not fully E2E-proven.
- **Path nodes:** keyboard nudge returns `null`. Move without drag relies on whatever inspector path UI exists; residual for freeform geometry authors.

### 3. Native `window.confirm` dialogs (medium)

Used for high-risk Admin actions (examples):

- `AdminSvgEditorEditView` — discard navigation, reset, publish confirm
- `SvgStudioCanvas` — delete layer
- `AdminPriceBookPageView` — approve/activate/rollback-style actions
- `DescriptorRevisionPanel` — rollback
- `AdminCatalogManager` — destructive catalog confirm

Browser-native confirms are keyboard-operable but **outside** axe tree, custom focus management, and branded live regions. Residual: no in-app dialog semantics, poor recovery messaging, no custom `aria-describedby` for impact text beyond confirm string.

### 4. Live regions vs real announcement (medium)

- Unit checks `aria-live="polite"` / `aria-atomic` presence.
- Status bar packs many fields into one polite region; frequent status updates may **flood or suppress** meaningful selection/publish announcements under real SR timing.
- No screen-reader session evidence (NVDA/JAWS/VoiceOver).

### 5. Focus visibility (low–medium)

- CSS defines `:focus-visible` on toolbar, stage, layers, inspector inputs.
- Unit only greps CSS source. No pixel/contrast proof of focus ring in browser themes or forced-colors.

### 6. Contrast (low residual on known fix; medium elsewhere)

- `.admin-badge--warn` was raised toward ≥4.5:1 (comment in `admin-pages.css`).
- Axe 0 on three shells reduces likelihood of AA contrast failures **inside those includes**.
- Unscanned Admin pages and transient toasts/badges remain unchecked.

### 7. Canvas / SVG engine surface (high for pure canvas interaction)

- Engine mount is a focusable application region; pointer hit-testing, selection of shapes on canvas without layer list, and resize handles are pointer-first.
- Non-drag alternatives exist for move/resize/pan/zoom **by contract**, but path editing and multi-select remain weak or absent for keyboard-only users.

### 8. Auth environment (process residual)

- All live a11y evidence under `DEV_AUTH_BYPASS=1`.
- Does not prove production auth chrome, redirect pages, or access-denied UI accessibility.

### 9. MCP Lighthouse (open)

- No performance/a11y Lighthouse scores for Admin routes.
- Documented gap; not closed this session.

---

## Mapping to checklist IDs

| ID | Checklist claim | This audit |
|----|-----------------|------------|
| ADM-A11Y-01 | Primary journey WCAG 2.2 AA (browser axe) | **Supported for three included shells** at 0 violations in `2026-07-13T-admin-phases-final`. Not whole Admin app. Not MCP Lighthouse. |
| ADM-A11Y-02 | Keyboard-completable author→publish | **Unit + partial live Tab sample**. Not full AT journey. |
| ADM-A11Y-03 | Every drag has non-drag alt | **Contract + unit**. Path nudge gap remains. |
| ADM-A11Y-04 | Focus + state announcements | **Attributes + CSS text in unit**. No AT verification. |

---

## What would close residual claims

1. Install Google Chrome stable (or wire MCP to Chromium) → Lighthouse navigation on list, edit, price-books.
2. Expand axe to catalog, inventory, dashboard, planner-catalog, workspace-catalog (full `main` or no over-narrow include).
3. Axe after key state changes: validation error, publish confirm path, price-book action message, inventory filter empty state.
4. Manual SR pass (one keyboard-only author→publish; one price-book approve/activate).
5. Replace or wrap high-risk `window.confirm` with accessible in-app dialogs if product wants consistent focus return + live feedback.
6. Explicit keyboard path for path-node geometry (or documented “path = pointer/path editor only” acceptance exception).

---

## Honest bottom line

- **Axe evidence exists and is clean** for three primary Admin shells under bypass auth.
- **Unit ADM-A11Y-02..04 is structural**, not browser WCAG proof.
- **MCP Lighthouse path: FAIL** this session.
- **Residual risks are real:** unscanned Admin routes, `role=application` canvas model, path nudge hole, native confirms, live-region quality, and no screen-reader evidence.

Unit green ≠ full browser WCAG without broader interactive and AT evidence.

---

## Files touched

- **Written:** `agent-reports/2026-07-13-a11y-debugging-admin.md` (this file)
- **Not changed:** production code, checklists, `Failures.md` (GAP already recorded)
- **Not run:** `pnpm run check:layout` (no shell available in this agent tool surface; report-only task)
