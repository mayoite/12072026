# A11Y Audit — open3d guest chrome

| Field | Value |
|-------|--------|
| **Date** | 2026-07-09 |
| **URL** | `http://localhost:3000/planner/guest/?plannerDevTools=1` |
| **Scope** | Tool rail, top bar, status bar, workstation configurator (open3d chrome) |
| **Agent** | a11y-debugging |
| **Lighthouse a11y** | **98** (snapshot, desktop) |
| **Critical fixes applied** | **None** (no missing accessible names on chrome icon/buttons) |

## Evidence artifacts

| File | Description |
|------|-------------|
| `A11Y-REPORT.md` | This report |
| `chrome-overview.png` | Viewport screenshot of guest planner chrome |
| `report.json` / `report.html` | Lighthouse full report |

## Method

1. Navigate to guest workspace with `plannerDevTools=1`
2. Accessibility tree snapshot (`take_snapshot`)
3. Lighthouse accessibility audit (`mode: snapshot`, desktop)
4. Chrome issue list (`list_console_messages` types=`issue`) — none
5. Scripted DOM checks: unnamed controls, label-in-name mismatches, landmarks, headings, tap sizes, status/configurator structure
6. Focus order sample (first ~15 tab stops)

## Baseline (good)

| Area | Finding |
|------|---------|
| **Names** | **0** interactive controls without accessible name (97 checked) |
| **Orphaned inputs** | **0** |
| **Tool rail** | `nav[aria-label="Canvas tools"]`; each tool has `aria-label` + `aria-pressed` + `title`; icons `aria-hidden` |
| **Top bar** | `header.pw-topbar[aria-label="Planner workspace"]`; floor/unit/undo/redo/panels labeled |
| **View mode** | `role="radiogroup"` + `aria-label="View mode"`; 2D/3D `role="radio"` |
| **Configurator** | `section[aria-label="Workstation systems configurator"]`; shape/size/modules use `fieldset`/`legend` + `aria-pressed` |
| **Canvas** | `aria-label="Floor plan drawing surface"`, `tabIndex=0`, live status region |
| **Skip link** | Present → `#main-content` |
| **`lang`** | `en-IN` on `<html>` |
| **Console a11y issues** | None |

---

## Critical

**None found.**

No icon-only chrome controls lack an accessible name. Tool rail, panel chrome (undock/minimize/close), undo/redo, maximize, prefs, palette trigger, and catalog actions all expose names via `aria-label` and/or visible text.

**Code fix:** not applied (nothing Critical of the “missing `aria-label` on icon button” class).

---

## Important

### 1. Label-in-Name mismatch (WCAG 2.5.3) — Lighthouse fail

Visible label is **not** contained in the accessible name. Breaks speech/voice commands (“click Focus”) vs SR name (“Maximize canvas”).

| Visible text | Accessible name | Selector / source |
|--------------|-----------------|-------------------|
| `Focus` | `Maximize canvas` | `header.pw-topbar button.workspace_btn__G2SqP` — `TopBar.tsx` (~157) |
| `Prefs` | `Open preferences menu` | `header.pw-topbar … Button` — `TopBar.tsx` (~297) |
| `Commands (Ctrl+K)` | `Open command palette (Ctrl+K)` | `footer … button.open3d-palette-trigger` — `OOPlannerWorkspace.tsx` (~876) |

**Fix pattern (not applied — not Critical):** include visible words in `aria-label`, e.g. `"Focus — maximize canvas"`, `"Prefs — open preferences menu"`, `"Commands (Ctrl+K)"` as both text and name (or drop redundant `aria-label` when text is sufficient).

### 2. Heading order skip (H1 → H3) — Lighthouse fail

| Level | Text | Selector |
|-------|------|----------|
| H1 | Untitled plan | `h1.workspace_brandTitle__*` |
| H3 | Inventory | `aside#panel-left h3.workspace_panelTitle__*` |
| H3 | Properties | right panel title |
| H3 | No Selection | properties empty state |

No H2 between brand H1 and panel H3s (when first-use overlay is closed).

**Selector:** `div.workspace_workspace__* > aside#panel-left … > h3.workspace_panelTitle__*`

### 3. Focusable but zero-size (mobile panel toggles)

| Control | Size | Name |
|---------|------|------|
| Toggle inventory panel | **0×0** | still in tab order |
| Toggle properties panel | **0×0** | still in tab order |

**Selectors:** `header.pw-topbar button.workspace_mobilePanelBtn__*`

Desktop CSS hides them visually but they remain keyboard-focusable → empty focus stops.

**Fix pattern:** `visibility`/`display`/`inert`/`tabindex="-1"` when not applicable for viewport, or only mount on mobile breakpoints.

### 4. Sub-44×44px tap targets (desktop chrome)

WCAG 2.5.5 AAA / common 44–48px guidance. Desktop product chrome is often denser; still Important for touch/hybrid.

| Region | Typical size | Selectors |
|--------|--------------|-----------|
| Tool rail buttons | **32×32** | `nav.pw-tool-rail button.canvas-tool-rail_toolBtn__*` |
| Panel title actions | **24×24** | `button.workspace_panelActionBtn__*` (Undock / Minimize / Close) |
| View 2D/3D | **40×28** | `div.workspace_viewToggle__* button.workspace_viewToggleBtn__*` |
| Top bar secondary | **~32–58×32** | floor, unit, Focus, Undo, Redo, Prefs |
| Configurator chips | **~26px height** | `button.workstationConfigurator_chip__*` |

### 5. Status bar not exposed as status landmark

Open3d status is a plain `<footer class="… pw-status-bar">` with **no** `role="status"`, **no** `aria-label`, **no** `aria-live`.

**Selector:** `footer.workspace_status__B_LAY.pw-status-bar`  
**Source:** `site/features/planner/open3d/editor/WorkspaceShell.tsx` (~386)

Archive fabric status had `role="status" aria-label="Plan metrics" aria-live="polite"`. Metrics (“4 objects”, walls, floor) are not announced on change unless another live region covers them.

Tool guidance **does** use `aside.open3d-tool-guidance[aria-live="polite"]` (good), but has **no** accessible name.

### 6. Generic “Add to favorites” names

All catalog favorite controls share the same name: `aria-label="Add to favorites"` (× many). Screen reader list loses product identity.

**Selector:** `button.inventory_favoriteButton__*`  
**Better:** `Add {item name} to favorites` (matching “Add {item} to canvas” pattern already used).

### 7. Nested duplicate region name

Two regions named **“Inventory panel”** (shell aside + inner inventory region). AT may announce “Inventory panel” twice.

---

## Minor

| Issue | Detail | Selector / notes |
|-------|--------|------------------|
| Configurator collapse control | Header has `aria-expanded` but no `aria-controls` | `section[aria-label="Workstation systems configurator"] > button.workstationConfigurator_header__*` |
| Shape/size exclusive chips | `aria-pressed` only; not `radiogroup`/`radio` (fieldset helps) | chip buttons under Shape / Size fieldsets |
| Title duplication | Document title `"Planner Workspace \| One&Only \| One&Only"` | `<title>` |
| Status right text | Palette trigger long+short spans both in tree in some cases | `.open3d-palette-trigger` |
| SEO robots.txt | Lighthouse SEO fail — out of a11y scope | n/a |

---

## Focus order (sample)

First tabbable controls (document order, disabled skipped):

1. Skip to main content (sr-only, 1×1 — expected until focused)
2. 2D / 3D
3. Active floor / Display unit
4. Maximize canvas (Focus)
5. **Toggle inventory / properties (0×0 — see Important #3)**
6. Save draft / Export JSON / Prefs
7. Undock / Minimize / Close (inventory)
8. Inventory panel region (`tabindex=0`)

Tool rail tools are later in order (after inventory content) because DOM places inventory before the canvas rail — matches left-panel-first layout; worth confirming with SR users that tools are discoverable.

---

## Region map (chrome)

| Chrome piece | Landmark / role | Label |
|--------------|-----------------|-------|
| Top bar | `header` | Planner workspace |
| Inventory | `aside` + `role="region"` | Inventory panel (×2 nested) |
| Categories | `nav` | Inventory categories |
| Configurator | `section` | Workstation systems configurator |
| Tool rail | `nav` | Canvas tools (+ tool groups) |
| Canvas | (region) | Drawing canvas / canvas name |
| Tool guidance | `aside` live | *(unnamed)* |
| Properties | `aside` + region | Properties panel |
| Status | `footer` only | *(no label / status role)* |

---

## Code touchpoints (for follow-ups)

| File | Relevance |
|------|-----------|
| `site/features/planner/open3d/editor/TopBar.tsx` | Focus / Prefs label-in-name; mobile panel tab order |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Commands palette label-in-name; tool guidance label |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | Status bar `role`/`aria-label`/`aria-live`; panel H3 → H2 |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Labels OK; tap size CSS only |
| `site/features/planner/open3d/editor/WorkstationConfiguratorPanel.tsx` | `aria-controls`; chip roles OK enough with fieldset |

---

## Fixes this pass

| Change | Status |
|--------|--------|
| Critical missing `aria-label` on icon buttons | **N/A — none found** |
| Product code edits | **0 files** (per brief: Critical-only, max 2) |

---

## Top issues (priority for next slice)

1. **Label-in-Name** on Focus / Prefs / Commands (Lighthouse + voice control)
2. **0×0 tab stops** on mobile panel toggle buttons at desktop
3. **Status footer** lacks `role="status"` + name (parity with archive chrome)
4. **Heading order** H1 → H3 panels
5. **Tool rail / panel action** hit targets &lt; 44px (touch density)

## Next step

If a follow-up slice allows Important fixes: align the three label-in-name strings (2 files: `TopBar.tsx`, `OOPlannerWorkspace.tsx`) and add `tabindex="-1"` (or unmount) for hidden mobile panel toggles — highest impact, still small.
