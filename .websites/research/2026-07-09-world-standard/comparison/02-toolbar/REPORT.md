# Toolbar / chrome / tools UX comparison

**Date:** 2026-07-09  
**Slice:** `02-toolbar`  
**Rule:** Patterns only — do not copy competitor UI, icons, assets, code, or brand chrome into O&O.  
**Score scale:** 1 = broken/missing · 3 = acceptable · 5 = class-leading (public product bar)

---

## Sources

| Source | Role |
|--------|------|
| `D:\websites\planner5d.com\report\TOOLBARS.md` | Planner 5D editor chrome zones, 2D/3D tool split, top-bar camera/render |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Funnel + editor UX signals (templates, catalog layers, collab share) |
| `D:\websites\planner5d.com\report\toolbar-mock\index.html` | Local original mock of zone layout (not a clone) |
| RoomSketcher public help / product pages | Mode menu, blue top toolbar, measurement wizards, Live 3D, tablet app |
| Floorplanner Editor Manual (public PDF) | Sidebar tool hub, units/measure/lock, keyboard shortcuts, 2D↔3D |
| Homestyler public tutorials / help | Interface sections, view modes 1–5, WASD 3D nav, shortcut help |
| Foyr Neo public courses / marketing | Ruler tool, 2D→3D materials switch, pro left short-list toolbars |
| IKEA planners public pages | Product-first options sidebar; kitchen planner **not mobile-compatible** |
| O&O live (repo evidence 2026-07-09) | `CanvasToolRail`, TopBar, inventory/properties shell; incomplete wiring |

---

## Chrome zone map (industry pattern, not any one product)

```
┌──────────────────────────────────────────────────────────────┐
│ TOP: project · save · 2D|3D (or views) · share/export · help │
├──────┬───────────────────────────────────────┬───────────────┤
│ LEFT │              CANVAS                   │ RIGHT         │
│ tools│   structure / furnish / present       │ catalog OR    │
│ /mode│                                       │ properties    │
├──────┴───────────────────────────────────────┴───────────────┤
│ BOTTOM / status: floors · units · tool hint · undo · zoom    │
└──────────────────────────────────────────────────────────────┘
```

Products differ mainly in **how tools are grouped** (mode tabs vs icon rail vs mega-sidebar) and **whether measure is first-class**.

---

## Product notes (toolbar focus)

### Planner 5D
- **Zones:** Top (project, 2D|3D, camera/render, share) · left construction tools · right catalog/props · bottom floors/status.  
- **Grouping:** Structure tools (wall/door/window/measure) vs catalog vs camera — classic consumer layout.  
- **2D/3D split:** Explicit product rule — **2D = structure + measure**, **3D = furniture, textures, camera, render**. Continuous toggle; FAQ workflow is structure-first then decorate.  
- **Measure:** Floor-plan dimensions in 2D; not RoomSketcher-grade GLA/TLA wizards.  
- **Shortcuts:** Walkthrough **WASD**; general editor hotkeys less foregrounded than Homestyler/Floorplanner.  
- **Mobile:** Multi-platform apps (web + mobile shells per marketing/help).  
- **Inspiration only:** Zone discipline + 2D/3D tool swap — not icons/copy.

### RoomSketcher
- **Zones:** **Blue top toolbar** (new/save/levels/copy-paste/undo-redo/delete + Live 3D / 360) · **mode menu** (Walls · Windows etc · Furniture · Materials) · hamburger for Project/Level/View/Tools.  
- **Grouping:** **Task modes** isolate construction vs openings vs furnish vs finish — high clarity for non-CAD users.  
- **2D/3D split:** Draw/edit primarily in 2D; **Live 3D** (flyover + camera) updates live; measurements show on **2D plans only** (not Live 3D).  
- **Measure:** Class-leading public set — tape measure, room area, room X/Y dimensions, inside/outside wall lengths, single-wall, item-to-item, door/window measures, **GLA/TLA total area** (Pro), dual units.  
- **Shortcuts:** Documented hotkeys tied to top-toolbar actions.  
- **Mobile:** Full **tablet app** (iPad/Android) with draw + Live 3D; phone more view/order oriented.  
- **Inspiration only:** Mode-based task IA + measurement completeness — not blue chrome or icon set.

### Floorplanner
- **Zones:** Top bar (2D/3D, view settings, display style, units/measure/lock, undo/save/export) · **sidebar as tool hub**.  
- **Grouping:** Sidebar sections — **Build** (rooms/walls/surfaces/doors/windows/structures/background), **Furniture**, **Paint**, **Materials**, **Information** (room types, text, symbols, dimension lines). Selection drives contextual options in the same sidebar.  
- **2D/3D split:** Always-visible 2D|3D; orbital + walkthrough in 3D; structure + furnish available with view toggle (not a hard “2D only draw” lock).  
- **Measure:** Tape measure (click-drag), dimension lines, units switch, lock; hold **S** to disable snap while measuring.  
- **Shortcuts:** Published extensive list (undo, delete, multi-select, snap off, arrows, scale modifiers, shortcut help key).  
- **Mobile:** Web-first; tablet/phone secondary vs RoomSketcher’s tablet product.  
- **Inspiration only:** Sidebar-as-hub + units/measure/lock cluster — **reject** mega-tab visual trade dress (O&O REJ-01).

### Homestyler
- **Zones:** Five-section interface (canvas, catalog, toolbars, property panel, view controls); top-middle common tools (ops, material brush, tools menu, hide/view, export/render).  
- **Grouping:** Prosumer density — tools + materials + views co-located; strong for designers, heavier for first-timers.  
- **2D/3D split:** Multiple display modes — **2D** (plane, RCP, elevation) and **3D** (3D, roam); number-key style view switching (public tutorial: 1–5).  
- **Measure:** Show-dimensions, unit type, scale-from-import workflows; not as measurement-product-deep as RoomSketcher.  
- **Shortcuts:** Strong public story — **WASD + Q/E** roam, view-mode keys, Help → Shortcut Keys category.  
- **Mobile:** Mature mobile/AR product surface alongside web.  
- **Inspiration only:** View-mode keyboard discipline + shortcut discoverability in Help — not Homestyler chrome.

### Foyr Neo
- **Zones:** Pro interior shell — left short-list / kitchen component toolbars, right component properties, texture toolbars, 3D navigation modes.  
- **Grouping:** Catalog + component property toolbars; powerful but tutorial-dependent.  
- **2D/3D split:** Typical flow **build/edit in 2D → switch to 3D for materials/finishes** (more mode thrash than Live-3D side-by-side).  
- **Measure:** Dedicated **ruler** tool in 2D design space (public course).  
- **Shortcuts:** Present for power users; less beginner-surfaced than Homestyler/Floorplanner manuals.  
- **Mobile:** Desktop-centric design/render product.  
- **Inspiration only:** Numeric property editing on selection — not Neo layout.

### IKEA (Kitchen / room planners)
- **Zones:** **Product-first** chrome — proposals, room shape, right **Options** sidebar for fronts/interiors/countertops; view height / 2D overview / 3D line vs front views.  
- **Grouping:** Not a general CAD tool rail; tools serve **SKU configuration** and kitchen-run assembly.  
- **2D/3D split:** 2D overview + multiple 3D presentation modes; not general wall-CAD ↔ furnish split.  
- **Measure:** Room dimension entry + in-planner measure (users report finickiness); offline measurement guides / service.  
- **Shortcuts:** Minimal public power-user shortcut culture.  
- **Mobile:** Official note — **kitchen planner not compatible with mobile devices**; other space planners vary.  
- **Inspiration only:** Guided product path + options-on-selection for **O&O catalog SKUs** — never IKEA UI chrome.

### O&O live (2026-07-09)
- **Zones present in code/shell:** TopBar · left `CanvasToolRail` · inventory panel · properties · status/snap feedback · 2D|3D toggle surface.  
- **Gaps (toolbar-relevant):** Tool lifecycle / command dispatch incomplete; shortcuts can mislead; furniture select/delete path broken on default 2D; 3D lacks orbit controls so mode switch is not a real tool surface; mobile drawer/bar deferred.  
- **Measure:** Snap + dimension commit + Alt bypass + status — real spine, not class-leading measure suite.  
- **Score posture:** Prototype chrome (≈2), not world bar.

---

## Score table (product × dimension)

| Product | Tool grouping | Discoverability | 2D/3D tool split | Measure tools | Shortcuts | Mobile tools |
|---------|---------------|-----------------|------------------|---------------|-----------|--------------|
| Planner5D | 4 | 4 | **5** | 3 | 3 | 4 |
| RoomSketcher | **5** | **5** | 4 | **5** | 4 | **5** |
| Floorplanner | 4 | 4 | **5** | 4 | **5** | 3 |
| Homestyler | 4 | 4 | **5** | 3 | **5** | **5** |
| Foyr Neo | 4 | 3 | 3 | 4 | 3 | 2 |
| IKEA | 3 | 3 | 3 | 3 | 2 | 1 |
| O&O live | 2 | 2 | 2 | 2 | 2 | 1 |

**CSV mirror:** `SCORES.csv` (columns: `product,grouping,discover,mode_split,measure,shortcuts,mobile`).

---

## Winner per column

| Column | Winner | Why (public bar) |
|--------|--------|------------------|
| **grouping** | **RoomSketcher** | Explicit task **modes** (Walls / Windows etc / Furniture / Materials) + compact blue top actions — lowest cognitive load for “what tool family am I in?” |
| **discover** | **RoomSketcher** | Mode menu + always-visible top actions + hamburger for secondary; measurement wizards under the right mode |
| **mode_split** | **Planner5D / Floorplanner / Homestyler** (tie → pick **Floorplanner** as reference) | Floorplanner: always-on 2D|3D with edit continuity + view settings; Homestyler: rich view matrix; Planner5D: clearest **role** split (structure vs decorate). Prefer Floorplanner for “edit doesn’t die when you change view.” |
| **measure** | **RoomSketcher** | Tape + wizards + inside/outside walls + item distances + GLA/TLA + dual units — measurement product, not a side tool |
| **shortcuts** | **Homestyler** (co-winner **Floorplanner**) | Homestyler: Help-center shortcut category + view keys + roam keys; Floorplanner: published editor-manual shortcut matrix including measure/snap modifiers |
| **mobile** | **RoomSketcher** (co-winner **Homestyler**) | RoomSketcher full tablet editor; Homestyler strong mobile/AR. IKEA kitchen is the anti-pattern (desktop-only). |

---

## O&O chrome pattern (original — do not clone)

Build an **O&O-native** shell. Steal **behaviors**, not layout trade dress.

### Target zones (original composition)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOP: O&O project · honest save label · 2D | 3D · export/BOQ · ? │
├──────┬──────────────────────────────────────────┬───────────────┤
│ RAIL │                 CANVAS                    │ CONTEXT      │
│ ~48px│  Feasibility / plan stage                 │ Inventory    │
│ tools│  + optional split 3D preview              │  OR          │
│      │                                           │ Properties   │
│      │                                           │  (selection) │
├──────┴──────────────────────────────────────────┴───────────────┤
│ COMMAND STRIP: active tool · shortcut · numeric commit · errors │
│ STATUS: floor · units (mm) · snap · zoom · undo/redo            │
└─────────────────────────────────────────────────────────────────┘
```

### Principles (mapped from winners, not cloned)

| Adopt (behavior) | From | O&O original form |
|------------------|------|-------------------|
| Compact primary tool rail | SketchUp-class density (existing O&O research) | Left **icon rail**: Select · Wall · Room · Door · Window · Measure · Delete — Phosphor icons, tool name + shortcut in `aria-label` |
| Task grouping without mega-tabs | RoomSketcher modes | **Rail sections** with separator + optional “Structure / Furnish” filter chips — **not** RoomSketcher blue bar or mode chrome |
| 2D structure ↔ 3D present continuity | Planner5D role split + Floorplanner toggle | Single document; **2D|3D segmented control in TopBar**; same selection IDs; 3D always orbitable (W4) |
| Measure as first-class tool | RoomSketcher depth | **Measure tool + live dimension on draw + clearance labels + room area**; mm default; dual unit later — no clone of wizards UI |
| Keyboard-first numeric commit | SketchUp / AutoCAD grammar | **Bottom command strip** (tool name, typed length, Esc cancel) — **not** AutoCAD blue ribbon |
| Shortcut discoverability | Homestyler Help pattern | `?` or Help opens **O&O shortcut sheet** (W, D, R, M, Del, Ctrl+Z…) — content original |
| Catalog vs props | Floorplanner/P5D catalog-left + Figma selection props | Inventory left **or** right dock per preference; **Properties open on selection**; canvas maximize |
| Mobile tools | RoomSketcher tablet lesson | Phase-gated: **bottom tool sheet** (Vaul) for primary tools; no claim of full desktop parity until proven |

### Explicit rejects (anti-copy)

- Figma **bottom primary toolbar** pill trade dress  
- Floorplanner **mega-tab sidebar** colors/labels  
- Planner 5D **Smart Wizard / AI competition** chrome  
- RoomSketcher **blue toolbar** visual identity  
- IKEA / brand **product shells**  
- Competitor icons, screenshots, or GLB catalogs  

### Minimum chrome acceptance (toolbar slice)

1. Every rail tool: visible active state, status-bar guidance, working shortcut.  
2. Measure tool produces on-canvas dimension + status readout (mm).  
3. 2D|3D toggle preserves camera pose; 3D orbit enabled.  
4. Delete/Backspace deletes **current selection** (including furniture).  
5. Mobile: primary tools reachable without hover-only UI.  
6. Save label honest (local vs cloud).  

---

## Implications for O&O roadmap

| Priority | Action | Closes gap vs |
|----------|--------|----------------|
| P0 | Wire tool rail → command dispatch; fix select/delete; honest shortcuts | All products ≥3 |
| P0 | Bottom command strip + measure commit | Floorplanner / SketchUp bar |
| P1 | Mode-aware tool enablement (structure tools dimmed or guided in 3D present mode) | Planner5D role split |
| P1 | Measurement suite beyond single tape (room area, clearances) | RoomSketcher |
| P2 | Shortcut sheet + instructor strip for first tool use | Homestyler / SketchUp |
| P2 | Touch tool sheet | RoomSketcher mobile |

---

## Evidence index

| Artifact | Path / URL class |
|----------|------------------|
| Planner 5D toolbars | `D:\websites\planner5d.com\report\TOOLBARS.md` |
| Planner 5D inspiration | `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` |
| Original toolbar mock | `D:\websites\planner5d.com\report\toolbar-mock\index.html` |
| RoomSketcher measurements | help.roomsketcher.com measurement overview |
| RoomSketcher toolbar buttons | help.roomsketcher.com toolbar buttons/options |
| Floorplanner manual | cdn.floorplanner.com FloorplannerManualEN.pdf |
| O&O UI research | `D:\OandO07072026\Plans\Research\RESEARCH-2026-07-05-ui-plann-compare.md` |
| Scores | `./SCORES.csv` |

---

**End of slice 02-toolbar.** Orchestrator may fold winners into `MASTER-CHART.md` after all slices land.
