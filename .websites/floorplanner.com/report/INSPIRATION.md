# Floorplanner → O&O Inspiration Report

**Date:** 2026-07-09  
**Purpose:** Extract **interaction / product patterns only** for O&O Approach A (Feasibility interim + R3F orbit + select/delete).  
**Ethics:** INSPIRATION ONLY — no competitor code, UI chrome, assets, iconography, copy, layout trade dress, or model libraries.  
**Authority:** O&O product north star + `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` Approach A.

---

## 1. Sources (paths)

All under `D:\websites\floorplanner.com\raw\`.

| Path | Role | Use in this report |
|------|------|--------------------|
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-FloorplannerManualEN.pdf.md` | **Primary** — Editor Manual (EN, ~60 pages) | Main source for all editor patterns |
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-static-brochures-Floorplanner+editor+manual+version+180219.pdf.md` | Older editor manual (~53 pages, 2019-era structure) | Corroborates same IA; export level table; slightly different sidebar labels |
| `D:\websites\floorplanner.com\raw\floorplanner.com.md` | Marketing homepage | Library size claims, free-tier positioning, 2D/3D marketing claims |
| `D:\websites\floorplanner.com\raw\floorplanner.com-pricing.md` | Pricing / credits | Export quality tiers, free project limits (product boundary, not UI) |
| `D:\websites\floorplanner.com\raw\updates.floorplanner.com.md` | Product changelog | Recent multi-select/groups, 3D door/window edit, SVG export — pattern evolution |
| `D:\websites\floorplanner.com\raw\search-help.json` | Search index hits | Confirms manual PDF URLs only |
| `D:\websites\floorplanner.com\raw\cdn.floorplanner.com-assets-FloorplannerManualEN.pdf.md` | **Thin / AccessDenied** | **Ignored** |
| `D:\websites\floorplanner.com\raw\floorplanner.com-features.md` | **Login wall** | **Ignored** |
| `D:\websites\floorplanner.com\raw\support.floorplanner.com-en.md` | Duplicates homepage marketing | Low value; not used for editor detail |

**Not available in scrapes:** live editor DOM, CSS, JS, icons, FML schema, 3D engine internals, actual furniture mesh/asset libraries.

**O&O alignment refs (not Floorplanner sources):**
- `D:\oando07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` — Approach A, W1–W8
- `D:\oando07072026\Plans\Research\RESEARCH-2026-07-05-ui-plann-compare.md` — prior REJ for mega-tab sidebar / trade dress

---

## 2. Editor patterns (abstracted)

Patterns are **behaviors and product grammar**, not visual design.

### 2.1 Sidebar + canvas split

**Pattern:** Editor is a two-zone tool: a **tool/info sidebar** + a **dominant drawing canvas**.

- Sidebar is the **tool hub**: project/floor actions, build tools, information tools, furniture library, paint/materials, exports, shortcuts.
- Canvas is where geometry is authored: walls, rooms, lines; furniture is **drag-dropped** onto canvas.
- **Selection drives sidebar content**: selecting a wall, room, or furniture piece replaces/overlays tool lists with **object-specific properties** (thickness, height, dimensions, materials, similar items).
- Double-click selection often jumps straight into the object settings surface.
- Important transforms (move/rotate/duplicate/remove) appear both as **in-canvas handles/actions** and as **sidebar controls**.

**O&O-relevant takeaway:** Contextual properties on selection > permanent mega-panel of every tool. Canvas stays the focus.

### 2.2 2D view settings + multi-select

**2D view settings (display modes, not engines):**
- Multiple **appearance modes** for the same plan data (e.g. black/white outlines, colored surfaces, material/shadow-ish preview, blueprint-style).
- Independent toggles for **what to show** (grid, locks by layer class: structurals / information / furniture).
- Units / tape measure live near view controls (older manual: units + tape measure called out on overview chrome).

**Multi-select grammar:**
- **Shift + drag rectangle** marquee selection.
- **Priority rule:** if furniture is inside the marquee, **furniture wins**; walls/rooms select only when marquee contains no furniture.
- Alternate multi-furniture: **click successive items** to build a temporary multi-selection.
- Multi wall/room selection supports: remove, duplicate, rotate, mirror.
- Multi furniture selection supports: delete, duplicate, move, rotate, relative raise (vertical).
- Later product evolution (updates): multi-select → **named groups** that persist and re-drop from library (pattern: reusable assemblies — not required for Approach A).

**Snapping:**
- Snap-to-geometry while drawing/dragging is default; **hold S** temporarily disables snap.

**Pan / zoom / deselect:**
- Pan: left-drag empty space, or **spacebar** pan.
- Zoom: mouse wheel (+ chrome buttons).
- Deselect: click empty canvas or **Esc**.
- `?` opens shortcut list in sidebar.

### 2.3 3D: orbital vs walkthrough

**Pattern:** One document, two camera paradigms, explicit 2D↔3D switch.

| Mode | Intent | Navigation notes |
|------|--------|------------------|
| **Orbital** | Inspect from above / around the model (dollhouse-style overview) | Reset to top-view orbital control; double-click surface to move camera interest |
| **Walkthrough** | Eye-level navigation inside rooms | Button to place camera at room center eye-level; arrow keys shift camera front/back/left/right |

**3D view settings (product toggles, not UI):**
- Show/hide auto ceilings.
- Show/hide shadows (+ direction control).
- Show floors below current floor.
- Hide closest walls (X-ray into rooms).

**Edit in 3D (secondary to 2D authoring):**
- Select object in 3D → handlers for move/rotate; settings for dimensions/position.
- Deselect returns to camera mode (click empty / clear).
- Product later extended to doors/windows edit in 3D (dimensions, color, door open angle) — **advanced**; Approach A only needs select continuity + orbit, not full 3D authoring.

**Cameras / renders / VR (marketing-deep, out of Approach A):**
- Multiple saved cameras per floor; flythrough; scenery outside windows; SD/HD/4K/8K photoreal claims; VR tour links.

### 2.4 Build tools (walls / doors / windows)

**Room-first vs wall-by-wall:**
- **Draw room:** drag a rectangle; auto interior + exterior dimensions; click dimension + wall-side arrows to set exact size.
- **Draw wall:** segment-by-segment; closing a loop creates a room with auto floor/ceiling surfaces.
- Wall thickness + height set before or after draw.
- Guidelines assist horizontal/vertical and end-of-room alignment.
- Wall thickness affects length around corners (authoring caveat).

**Wall edit operations:**
- Split wall segments; drag corners for angle; curve walls; draw wall from a point on a segment; remove segment (room merge / floor disappear rules).
- Type numeric length while dragging + **Enter** (keyboard-first dimension commit).
- Invisible walls (thickness 0) for room area split without visual walls.

**Doors & windows:**
- Live on **wall hosts**; same placement flow for both.
- Library list with 2D top or 3D thumbnail preview.
- **Drag-drop onto wall**.
- Selection: wall side, hinge side, duplicate, remove.
- Properties: width, height, raise-from-floor, frame/door colors.

**Related build (lower priority for A):** surfaces (free polygons, elevation, cutouts), structures library (stairs/beams/etc.), background image trace (scale line + B hide/show).

### 2.5 Dimension lines

**Two layers:**
1. **Auto dimensions** around walls — editable to drive room size (click value, type size, choose which wall moves via arrows).
2. **Custom dimension lines** when auto is insufficient — draw tool (`d`), style in sidebar, type length while dragging + Enter.

**Lifecycle:**
- Convert auto dims → separate editable lines.
- Custom dims distinguished by editable endpoints + delete affordance.
- Bulk: regenerate, convert all, delete all manual dims.
- Display: size/appearance; horizontal vs aligned-to-edge.

**Pattern for O&O:** Dimensions are not decoration — they are **authoring controls** and **readability aids**. Approach A may keep live wall dims simpler; full custom-dim tool is later.

### 2.6 Furniture library

**Catalogue-first furnish:**
- Huge library (marketing: **260,000+** models) via search + category + subcategory + brand/color filters.
- **Drag-drop** from list into plan.
- Selection sidebar: properties, resize, custom label, height / vertical position, **favourites**, **similar items** swap.
- Multi-select group actions (see 2.2).
- Favourites/groups accelerate repeat layouts (account-scoped).

**O&O-relevant takeaway:** Search → category → place is the core loop. Favourites/magic-layout/styleboards are **pro workflow** extras, not W1–W8 blockers.

### 2.7 Keyboard shortcuts (manual table)

Essential grammar (from EN manual shortcut table; abstract keys, not branded UI):

| Function | Key(s) | Context |
|----------|--------|---------|
| Exit mode / deselect | Esc | Drawing or selection |
| Delete | Del / Backspace | Selection active |
| Disable snap | Hold S | Draw / move |
| Rectangle select | Shift + drag | 2D canvas |
| Pan | Spacebar | 2D |
| Center view | `.` | 2D |
| Rotate ±5° | r / l | Item selected |
| Rotate ±15° | R / L | Item selected |
| Save | Cmd/Ctrl+S | Editor |
| Undo / Redo | Cmd/Ctrl+Z / Y | Editor |
| Draw wall | w | 2D |
| Draw room | r | 2D (note: conflicts with rotate `r` depending on mode — tool modes matter) |
| Draw surface | f | 2D |
| Text | t | 2D |
| Dimension | d | 2D |
| Line | l | 2D |
| Tape measure | m | 2D |
| Minimap | `` ` `` | 2D |
| Floor switch | `<` `>` | Editor |
| Background hide | b | Trace mode |
| Arrow keys | move camera **or** nudge selection | Mode-dependent |
| `?` | shortcut help | Sidebar |

**Pattern:** Tool activation shortcuts + **always-on** Esc/Delete/Undo/Snap-off/Pan. Mode conflicts resolved by “drawing mode vs selection mode.”

### 2.8 Export claims (marketing + manual)

| Claim | Source type |
|-------|-------------|
| 2D export JPG / PNG / PDF | Manual |
| 3D overview / photoreal renders | Manual + homepage |
| Resolutions SD 960×540, HD 1920×1080, 4K 3840×2160; marketing up to **8K** | Manual + homepage |
| Free tier: limited projects, SD + watermark | Pricing |
| Credits unlock higher res, floors, VR tour, no watermark | Pricing |
| Exports delivered / linked (email) historically | Manual |
| SVG vector 2D for HD+ projects | Updates (2025) |
| AI image enhance on exports (token micro-currency) | Updates (2025) |

**O&O Approach A:** treat export as **later**. Honesty bar today is local save + truthful save status, not competitor render tiers.

---

## 3. O&O translation for Approach A

**Approach A definition (O&O):** Ship W1–W8 on **current FeasibilityCanvas + document model**, enable **furniture select/delete**, **2D↔3D with R3F orbit**, honest save, cabinet mesh bar — **before** full Fabric stage cutover.

Map **patterns → O&O slices** (adopt semantics, invent O&O chrome):

| Floorplanner pattern | O&O Approach A action | Gate |
|----------------------|----------------------|------|
| Canvas-dominant + sidebar tools | Keep FeasibilityCanvas as interactive 2D; Inventory/tool chrome stays O&O (Phosphor, tokens) | W1–W2 |
| Click select → contextual props | Furniture hit-test on canvas; selection state drives props/delete affordance | W3 |
| Del / Backspace deletes selection | Wire `useWorkspaceKeyboard` + workspace deleteSelection; undo restores | W3, W8 |
| Esc clears selection / exits tool | Match shortcut truth labels to handlers | W8 |
| 2D↔3D same document | Toggle preserves entity poses; no re-author | W4 |
| Orbital 3D inspect | **R3F orbit ON** in `ThreeViewerInner` (default product 3D) | W4 |
| Walkthrough / eye-level | **Defer** (optional later); not blocking W4 | — |
| Room + wall draw + door opening | Feasibility structure tools; door as opening host | W1 |
| Drag-drop / place furniture from catalogue | Inventory place → placementAction / modular pipeline; Block2D readable symbols | W2 |
| Auto dimensions as authoring aid | Keep/improve live wall dims if present; custom dim tool later | Partial W1 |
| Multi-select marquee + furniture priority | **Optional stretch** after single-select works; single select/delete is P0 | Post-W3 |
| Library search/categories | O&O inventory search only; **never** competitor catalog content | W2 |
| Photoreal export / 8K / VR | **Out of scope** for Approach A | — |
| Magic layout / styleboard / scenery | **Out of scope** | — |
| Groups / favourites | Later productivity | — |
| Save honesty | Autosave IDB + truthful local vs cloud copy | W5–W6 |
| Mesh quality | cabinet-v0 modular (toe/door/carcass), not apology boxes | W7 |

**Explicit non-goals in A (even if Floorplanner has them):**
- Fabric full-stage replacement (Approach B later)
- Walkthrough camera product mode
- Multi-floor design variants UX
- Watermarked marketing exports / credit economy
- Paint/material photoreal pipeline
- Background PDF trace

**Implementation spine (from O&O design, for pattern targeting only):**
- 2D: `FeasibilityCanvas.tsx` hit-test + Block2D
- Keys: `OOPlannerWorkspace.tsx` + `useWorkspaceKeyboard.ts`
- 3D: `ThreeViewerInner.tsx` orbit
- Place: inventory + modular G5–G8
- Evidence: `results/planner/world-standard-wave/`

---

## 4. Anti-copy fence

**Allowed (patterns / industry grammar):**
- Sidebar tools + canvas authoring split
- Selection → properties + Delete/Backspace + Esc
- 2D plan vs 3D orbit inspection of **same document**
- Wall/room/opening tool set as **capabilities**
- Catalogue search → place furniture
- Snap, pan (space), zoom wheel, undo/redo, save shortcut as **standard CAD-lite norms**
- Dimension-as-control idea (values drive geometry)

**Forbidden (copy / clone risk):**
- Floorplanner layout chrome, tab labels, icon sets, mascot, color scheme, typography
- Screenshot-matching arrangement of tool groups (Build/Decorate/Furnish mega-tabs as trade dress — also REJ’d in O&O research)
- Any asset from Floorplanner library (meshes, textures, thumbnails, scenery)
- Export watermark style, credit UX, Floxi/Ask-Floxi branding
- Manual PDF prose reused as product copy
- FML or other proprietary file formats reverse-engineered into O&O
- “Looks like Floorplanner” acceptance — fail visual review if side-by-side resemblance is high

**Prior O&O research already rejects:** Build/Decorate/Furnish mega-tab clone; Floorplanner colour/layout trade dress (`RESEARCH-2026-07-05-ui-plann-compare.md`).

**Attestation for implementers:** If a UI decision only makes sense because Floorplanner looks that way, reject it. Prefer Figma-minimize / O&O manufacturer planner grammar and existing open3d workspace tokens.

---

## 5. Honest quality of scrapes

| Source | Quality | Notes |
|--------|---------|-------|
| `FloorplannerManualEN.pdf.md` (static brochures) | **High (text)** | Best corpus; OCR/PDF-extract noise (typos, broken tables, duplicate headers, “floorplanner.col” cutoffs). Patterns still recoverable. **No screenshots preserved as usable images in the md.** |
| `Floorplanner+editor+manual+version+180219.pdf.md` | **Medium–high** | Older IA (Home/Build/Info/Decorate); confirms same core grammar; export level matrix clearer in places. Image placeholders only (`[Image: ImN]`). |
| `floorplanner.com.md` | **Medium (marketing)** | Positioning, library size, free tier, 8K claim. No editor interaction detail. |
| `floorplanner.com-pricing.md` | **Medium** | Credits, SD watermark, project limits — product economics only. |
| `updates.floorplanner.com.md` | **Medium–good** | Recent capability deltas (groups, 3D door edit, SVG, AI enhance). Not a full UX manual. |
| `search-help.json` | **Low** | Link index; truncated. |
| `cdn...assets...FloorplannerManualEN.pdf.md` | **None** | AccessDenied S3 error page. |
| `floorplanner.com-features.md` | **None** | Login wall only. |
| `support.floorplanner.com-en.md` | **Low** | Same as homepage marketing. |

**Overall scrape grade: B− for pattern mining; F for visual design reference.**

What we **can** trust for Approach A:
- Editor IA and interaction grammar from manuals
- Shortcut table
- Multi-select priority rule (furniture vs walls)
- Orbital vs walkthrough product split
- Build/door/window/dim/furniture library workflows at description level

What we **cannot** trust / do not have:
- Pixel layout, spacing, component hierarchy
- Live behavior edge cases (hit testing, z-order, snap thresholds)
- Engine performance or true 3D quality
- Current free-tier feature flags beyond pricing page claims
- Anything behind login (features page empty)

**Recommendation:** Treat this report as **pattern fuel for W1–W8 only**. Do not open Floorplanner UI in browser to “match” chrome. Validate O&O against O&O gates (Playwright journey + evidence folders), not competitor screenshots.

---

## Appendix — One-page Approach A checklist (patterns → ship)

1. Draw walls + door opening (structure).  
2. Place ≥2 catalog items with readable 2D symbols.  
3. Select furniture; Delete/Backspace removes; undo restores.  
4. Toggle 2D↔3D; **orbit** in R3F 3D.  
5. Save → reload persists entities; status copy is honest.  
6. Shortcuts labels = real handlers.  
7. No Floorplanner chrome/assets/copy.  
8. Evidence under `results/planner/world-standard-wave/`.

---

*End of report. Patterns only. No competitor implementation reused.*
