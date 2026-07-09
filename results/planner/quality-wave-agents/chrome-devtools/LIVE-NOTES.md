# LIVE NOTES — open3d guest planner (Chrome DevTools)

**Date:** 2026-07-09  
**Agent:** Chrome DevTools MCP (`chrome-devtools-*`)  
**URL:** `http://localhost:3000/planner/guest/?plannerDevTools=1`  
**Viewport:** ~929×917  
**Method:** Live browser only (no UI redesign)

---

## 1. Setup / load

| Fact | Result |
|------|--------|
| Dev server | HTTP 200 on `localhost:3000` |
| Guest planner route | Loads **Planner Workspace \| One&Only** |
| Setup wizard | **Not required** — session already had a plan (4 walls rectangle, Ground Floor) |
| `?plannerDevTools=1` | Present in URL; page stable |
| Save state | Cycles `SAVING LOCALLY…` → `SAVED LOCALLY` / `Draft saved locally` |
| Catalog load | Status pill shows **Live catalog** after load; earlier flash of **Loading catalog…** |

No gate blocked entry to the 2D workspace.

---

## 2. Tool rail (Select, Wall, Opening)

**Locator:** `nav[aria-label="Canvas tools"]` (class includes `canvas-tool-rail_rail__* pw-tool-rail`)

**Buttons present (2D mode):**

| Tool | Aria label | Keyboard hint | data-testid |
|------|------------|---------------|-------------|
| Select | Select (V) | V | **none** |
| Pan | Pan (H) | H | **none** |
| Room | Room (R) | R | **none** |
| Wall | Wall (W) | W | **none** |
| Opening | Opening (O) | O | **none** |
| Dimension | Dimension (M) | M | **none** |
| Place | Place (P) | P | **none** |
| Zoom to fit | Zoom to fit (0) | 0 | **none** |

**Live clicks verified:**

1. **Select (V)** → `aria-pressed=true`, canvas description `Tool: select`, status **Select · 2D**, hint “Click an object…”.
2. **Wall (W)** → pressed, status **Wall · 2D**, hint “Click start and end points…”.
3. **Opening (O)** → pressed, status **Opening · 2D**, hint “Click a wall to add an opening.”

**Works.** Tool switching updates status bar + canvas a11y description.

**3D note:** In **3D** mode, `nav[aria-label="Canvas tools"]` was **absent** from the a11y tree (rail is 2D-only or not exposed). Switching back to 2D restored the rail.

**Evidence:** `07-tool-rail-2d.png`, `13-tool-rail-opening.png`, `15-tool-rail-final.png`

---

## 3. Status bar

**Locator:** `footer.workspace_status__* .pw-status-bar`  
**Layout:** `position: static`, `pointer-events: auto`, ~full width, height ~65px, top ≈ y=852 at this viewport.

**Content observed:**

- Counts: `4 objects` · `4 walls` · `0 furniture` · `Floor Ground Floor`
- Active tool: e.g. `Wall · 2D` / `Select · 2D` / `Opening · 2D` / `Place · 2D`
- Shortcut chip: `W` / `V` / `O` / `P`
- Hint text (tool-specific)
- `Zoom 100%`
- Catalog pill: `Live catalog` (or `Loading catalog…` / `Placing chaise-lounge-001` during place)
- Save: `Draft saved locally` / `Saving locally…`
- `Commands (Ctrl+K)`

**Works** for tool/mode feedback. Complements live region on canvas (`Tool: wall. Snap: none. Walls: 4.`).

**data-testid on footer / pills:** **none** observed.

**Evidence:** `05-status-bar.png`, `08-status-bar-2d.png`, `16-status-bar-final.png`

---

## 4. Catalog region

**Locators:**

- Inventory: `region` / `aside` `aria-label="Inventory panel"`
- Catalog: `region` `aria-label="Catalog browser"`
- Search: `searchbox` “Search catalog elements”
- Categories: `nav[aria-label="Inventory categories"]`
- Systems configurator: expandable region “Workstation systems configurator”

**Catalog items (live):** 18 items including live SKUs (`chaise-lounge-001`, `missing-geom-fallback-001`, …) plus proof/static items (Proof chair, sofas, desks, workstation variants).

**Add controls:** buttons with aria-label pattern  
`Add <name> to canvas` (+ separate `Add to favorites`).

| data-testid on Add / favorites | **none** (0 of 18 Add buttons) |
| Count Add buttons | 18 |

### Layout / visibility (facts)

- With **SYSTEMS CONFIGURATOR expanded**, catalog browser often had **height ≈ 0** (`overflow: hidden`) while cards still exist in the a11y tree / DOM below the fold. Only “18 items” visible near the bottom of the inventory column.
- Collapsing SYSTEMS CONFIGURATOR restored catalog height (~290px) and visible product cards (name, footprint `m × m`, heart control).

**Evidence:** `03-inventory-catalog.png`, `09`/`18-inventory-panel-final.png`, `11-opening-tool-catalog-visible.png`, `14-catalog-visible-config-collapsed.png`, `17-catalog-browser-final.png`

---

## 5. Pointer-intercept risk on catalog Add buttons

### Finding: **YES — real risk**

`document.elementFromPoint` on Add button centers (viewport ~929×917):

| Situation | Center hit |
|-----------|------------|
| First row Add after collapse (chaise-lounge) | Sometimes **self** (`BUTTON` + correct aria-label) |
| Sibling cards in same row | **`nav` Canvas tools** or **`CANVAS` floor plan** (cards bleed / hit-test outside panel) |
| Buttons near inventory bottom | **`FOOTER.pw-status-bar`** (`pointer-events: auto`) |
| Most of the 18 buttons | **Out of viewport** until scroll (15/18 out of view in one sample) |

**Status bar specifically:**

- Class: `workspace_status__B_LAY pw-status-bar`
- `pointer-events: **auto**` (not `none`)
- Sits over the bottom of the workspace; inventory Add targets that share the same vertical band are **intercepted** by the footer for pointer events.

**Caveat:** Chrome DevTools MCP **accessibility click** on `Add chaise-lounge-001 to canvas` **did fire** the control (tool switched to **Place (P)**, status: **Placing chaise-lounge-001** / “Choose a catalogue item, then click the canvas…”). That path bypasses hit-testing. **Mouse users** remain exposed to footer / canvas / tool-rail intercepts depending on card position.

**Risk summary:**

1. **Footer status bar** intercepts bottom-of-panel Add centers (`hitFooter` count > 0 when buttons near y≈footer).
2. **Tool rail / canvas** can steal hits for cards whose geometry extends past the ~260px inventory width.
3. Expanded systems configurator **hides** catalog visually (h≈0) so Add is not mouse-reachable until collapse/scroll is fixed.

---

## 6. data-testid presence

| Element | data-testid |
|---------|-------------|
| 2D canvas host | `planner-2d-canvas` (SECTION) — **present** |
| 3D (when active) | `planner-3d-canvas`, `three-viewer-container` — observed while 3D checked |
| Tool rail buttons | **absent** |
| Status bar / pills | **absent** |
| Catalog region | **absent** |
| Catalog “Add … to canvas” | **absent** (0/18) |
| Inventory / Properties chrome | **absent** |

**Automation impact:** almost everything relies on **aria-label** / role / text, not testids. Only reliable canvas testid is `planner-2d-canvas` (and 3D pair when in 3D).

---

## 7. What works (summary)

| Area | Status |
|------|--------|
| Guest planner loads with existing plan | Works |
| 2D/3D radio toggle | Works (3D hides 2D tool rail from a11y) |
| Tool rail Select / Wall / Opening | Works (click + status update) |
| Status bar tool/counts/zoom/catalog/save | Works |
| Inventory search / categories / systems configurator | Present; configurator collapse needed for catalog space |
| Catalog listing (18 items, Live catalog) | Works when panel space available |
| Add → Place mode | Works via a11y/programmatic click (`Placing <sku>`) |
| Save draft / Export JSON / Prefs | Buttons present; local save status updates |
| Properties panel “No Selection” | Present |

## 8. Issues (facts only — not redesigned)

1. **Pointer intercept** on catalog Add vs **status footer** (`pointer-events: auto`) and occasional tool-rail/canvas hits.
2. **Catalog height collapse** when systems configurator expanded (region h≈0).
3. **Sparse data-testid** surface (canvas only for 2D).
4. Console: occasional **404** resource failures; CSS preload warnings (Next layout.css). Not blocking UI shell.

---

## 9. Evidence paths (repo-root)

Directory: `D:\OandO07072026\results\planner\quality-wave-agents\chrome-devtools\`

| File | Contents |
|------|----------|
| `01-full-viewport.png` | Initial full UI |
| `01-a11y-snapshot.txt` | Early a11y dump |
| `02-tool-rail.png` | Tool rail element shot |
| `03-inventory-catalog.png` | Inventory (config expanded) |
| `05-status-bar.png` | Status footer |
| `06-full-after-probe.png` | Full after 3D probe |
| `07-tool-rail-2d.png` | Tool rail 2D |
| `08-status-bar-2d.png` | Status 2D |
| `10-select-tool-active.png` | After tool switch |
| `11-opening-tool-catalog-visible.png` | Opening + collapsed config |
| `14-catalog-visible-config-collapsed.png` | Catalog cards + Place after Add |
| `15-tool-rail-final.png` | Tool rail (Place pressed) |
| `16-status-bar-final.png` | Status final |
| `17-catalog-browser-final.png` | Catalog browser region |
| `18-inventory-panel-final.png` | Full inventory panel |
| `19-a11y-final.txt` | Final a11y snapshot |
| `LIVE-NOTES.md` | This file |

---

## 10. Verdict for quality-wave

- **Tool rail + status bar:** operational in 2D guest planner.  
- **Catalog:** data loads; Add can enter Place mode; **mouse hit-testing is fragile** near footer and when configurator eats vertical space.  
- **data-testid:** insufficient for rail/catalog/status automation — only canvas host IDs today.
