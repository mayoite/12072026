# RoomSketcher → O&O Inspiration Report

**Date:** 2026-07-09  
**Ethics:** INSPIRATION ONLY — patterns and product verbs. No competitor UI clone, brands, assets, copy, or code. MIT/open packages only if we name them later.  
**Target product:** O&O open3d planner (`/planner/open3d`) · gates **W1–W8** (`docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`)  
**Research root:** `D:\websites\roomsketcher.com\raw\`

---

## 1. Sources used

| Path | Kind | Used? |
|------|------|--------|
| `D:\websites\roomsketcher.com\raw\help.roomsketcher.com-hc-en-us-articles-115000020785-How-Does-the-Tape-Measure-Tool-Work.md` | Help article (tape measure) | **Yes — primary** |
| `D:\websites\roomsketcher.com\raw\help.roomsketcher.com-hc-en-us-articles-360000808925-How-Do-I-Add-Doors-to-My-Project.md` | Help article (doors place/edit) | **Yes — primary** |
| `D:\websites\roomsketcher.com\raw\roomsketcher.com-features-pro-features-measurements.md` | Marketing/feature page (measurements) | **Yes — primary** |
| `D:\websites\roomsketcher.com\raw\roomsketcher.com-features.md` | Marketing features index | **Yes — secondary** |
| `D:\websites\roomsketcher.com\raw\roomsketcher.com-floor-plans.md` | Marketing floor-plans hub | **Yes — secondary** |
| `D:\websites\roomsketcher.com\raw\roomsketcher.com.md` | Marketing homepage | **Yes — secondary** |
| `D:\websites\roomsketcher.com\raw\help.roomsketcher.com-hc-en-us.md` | Help center home (category map) | **Yes — thin structure** |
| `D:\websites\roomsketcher.com\raw\search-help.json` | Help search API dump | **Yes — thin index only** |
| `D:\websites\roomsketcher.com\raw\help.roomsketcher.com-en-articles-4140214-toolbar-buttons-and-options.md` | Intended toolbar article | **No — 404 + template garbage** |
| `D:\websites\roomsketcher.com\raw\help.roomsketcher.com-en-articles-4140227-measurements-overview.md` | Intended measurements overview | **No — 404 + template garbage** |
| `D:\websites\roomsketcher.com\raw\help.roomsketcher.com-en.md` | Wrong help path | **No — 404 + template garbage** |

**Honesty:** No app screenshots or live app session in this pack. Patterns below are from **public help prose + marketing claims**, not reverse-engineered UI chrome. Evidence is **strong for measure/place-on-wall/select-edit-delete**; **thin for full toolbar, snap grid internals, catalog UX chrome, and exact 2D↔3D controls**.

---

## 2. Pattern library

Abstract **interaction patterns** only (not RoomSketcher UI). Grouped for O&O W-gates.

### 2.1 Structure tools (draw / modes)

| Pattern | Evidence strength | Source notes |
|---------|-------------------|--------------|
| **Mode-based editing** — switch “what you place” (structure vs openings vs furniture) rather than one free-form tool forever | Medium | Doors article: red **Mode** → **Windows etc.** / walls & furniture called out as separate modes; tape article: tool usable “in any mode” (e.g. Furniture) |
| **Draw walls first, then openings** | Medium | FAQ flow on floor-plans page: measure → draw walls → add windows/doors/stairs → furnish → generate 2D/3D |
| **Place openings on walls by click** | **Strong** | Doors: select door from category → **click wall** to place |
| **Constraint: opening cannot exceed wall length** | **Strong** | Explicit: door wider than wall cannot be added |
| **Wall openings without a door leaf** (“walk-through”) | Medium | Catalog lists door+wall opening types |
| **Snap-fitting walls + live measurements while drawing** | Thin (marketing claim) | Homepage: “Snap-fitting walls”, “Live measurements”; no help steps for snap rules |
| **Exact wall lengths while drawing** | Thin | Only linked title in doors prev/next nav (“Draw Walls with Exact Lengths”) — article not scraped |
| **Curved walls** | Thin marketing | Features list only; no interaction detail |
| **Trace / AI convert / LiDAR capture as alternate start** | Marketing only | Out of W1–W8 scope; ignore for current gates |

### 2.2 Select / move / delete / edit

| Pattern | Evidence strength | Source notes |
|---------|-------------------|--------------|
| **Select → Properties panel** | **Strong** | Door selected → properties on the **right** |
| **Move by drag** | **Strong** | Doors: drag to move along/on wall |
| **Delete via explicit trash control** | **Strong** | Toolbar trash bin |
| **Copy → target surface → Paste** | Medium | Copy on toolbar, click wall, Paste — not free-space paste |
| **Flip / reverse orientation** (door swing) + **hotkey** | **Strong** | Flip Door; hotkey **Q** |
| **Lock object** to prevent accidental flip/edit | Medium | Advanced Properties → Lock; flip greyed when locked |
| **In-place resize handles** (blue arrows) **and** numeric fields | **Strong** | Drag arrows **or** Width/Height fields |
| **Domain-specific params** (opening angle 0° = closed) | **Strong** | Opening Angle degrees |
| **Hover catalog item for default size** | Medium | Hover door for default size tip |
| **Material / color replace on selected part** | Thin for W (later) | Part list (handle/door/sill/trim); search; hex/RGB — premium tier |

### 2.3 Measure / snap

| Pattern | Evidence strength | Source notes |
|---------|-------------------|--------------|
| **Ephemeral tape measure** for clearances (furniture↔wall, furniture↔furniture) | **Strong** | Dedicated tape help article |
| **Show/hide measure tool from menu** (not always on canvas) | **Strong** | Menu → Tape Measure |
| **Manipulate measure geometry:** drag body to move; drag end to rotate; drag end arrows to lengthen | **Strong** | Explicit gesture list |
| **Angle snap while rotating measure** (45° steps) + **global snapping toggle** | **Strong** | Snaps at 45°; Tools → Snapping on/off |
| **Live length readout** between endpoints | **Strong** | Length between cross-hairs while sizing |
| **Unit system switch** (m / ft) | **Strong** | Menu Tools → Meters or Feet |
| **Lock measure** so it isn’t bumped while placing | Medium | Lock/Unlock near top toolbar |
| **Workflow: measure then place** (set distance, switch mode, place furniture/wall) | **Strong** | Top usage tips |
| **Editor measure ≠ export measure** | Medium | Tape does **not** appear on generated floor plans; separate “display measurements on plan” path |
| **Room L×W labels**, **room area**, **inside/outside wall lengths**, **window/door/fixture dims** | Medium marketing | Measurements pro page; auto “wizard” one-click per room; labels draggable |
| **Total area standards** (GFA/GTA/GIA…) | Marketing / pro RE | Not O&O furniture quote core for W5–W6 |
| **Measurements update when layout changes** | Medium claim | “Updates automatically” if plan drawn to scale |
| **Zoom before precise measure** | Thin tip | Easier after zoom in |

### 2.4 Catalog place

| Pattern | Evidence strength | Source notes |
|---------|-------------------|--------------|
| **Categorized library** under a mode | **Strong** | Doors category under openings mode; alphabetical type list |
| **Click-to-select, click-to-place** (two-step) | **Strong** | Select door → click wall |
| **Wall-attached vs free-floor furniture** (implied split) | Medium | Openings require wall; furniture mode is separate for free items |
| **Large furniture + symbols library**; favorites for reuse | Thin marketing | Features: favorites, “thousands” of items |
| **Prefer catalog size near real size for better 3D** | Thin tip | “Choose a door close to the size you need” for rendering |
| **Barn door as composite** (opening + furniture piece) | Thin FAQ | Opening + furniture library item — special-case, not W core |

### 2.5 2D ↔ 3D

| Pattern | Evidence strength | Source notes |
|---------|-------------------|--------------|
| **Single project → both 2D plan and 3D views** | Medium marketing | “Changes update instantly in both 2D and 3D” |
| **Generate / show 2D and 3D after layout** | Medium | Step funnel: create → edit → generate polished visuals |
| **3D snapshots** from camera aim + double-click | Medium | Doors: drag camera at door, double-click snapshot |
| **Live 3D walkthrough / 360 / AI photoreal** | Marketing only | Out of W4 orbit-minimum scope |
| **Low-res 3D free tier vs high-res paid** | Product business model | Not O&O pattern to copy |

**Gap:** Scrapes do **not** document exact 2D/3D toggle, orbit controls, or pose-preservation behavior. W4 must be designed O&O-native, not inferred from RoomSketcher chrome.

### 2.6 Save / cloud / session claims

| Pattern | Evidence strength | Source notes |
|---------|-------------------|--------------|
| **Cloud-synced projects** across computer and tablet | Medium marketing | Homepage / floor-plans “work anywhere” |
| **Update anytime and re-generate visuals** | Thin claim | “Cloud-saved floor plans” |
| **Free account limits** (e.g. project count, low-res snapshots) | Marketing | Not technical save semantics |
| **Web portal for manage/order/export; app for draw/edit** | Medium FAQ | Split client — O&O is different (web open3d) |

**Gap:** No honest “local vs cloud” status copy, no autosave flush, no reload-roundtrip help article in this pack. W5–W6 must follow O&O design (IDB + truthful labels), not competitor marketing.

### 2.7 Product journey (abstract funnel)

Useful **journey shape** only:

1. Start (blank / import / capture — O&O: blank + structure for W1)  
2. Structure (walls + openings)  
3. Furnish (catalog place)  
4. Detail (measure, labels — partial for W)  
5. Review in 2D and 3D  
6. Persist and return  

---

## 3. O&O translation only (W1–W8)

**Rule:** Map patterns → **original O&O product actions** on FeasibilityCanvas / open3d document / Three viewer. No RoomSketcher labels, modes, colors, or layout.

| Gate | Competitor pattern (idea only) | O&O original action / acceptance |
|------|--------------------------------|----------------------------------|
| **W1** Draw structure (walls + door opening) | Mode split walls vs openings; place opening by clicking a wall; reject opening wider than wall | **Wall tool** draws segments on open3d/guest canvas. **Opening tool** attaches a door-void entity to a wall segment with length clamp. Keyboard/tool labels must match real handlers (**W8**). Playwright: wall + opening visible. |
| **W2** Place ≥2 catalog items incl. cabinet-v0; readable 2D | Categorized catalog; click item then click canvas (or wall for wall-mounted later); readable plan symbols | **Inventory place** (existing placementAction / modular path): place **cabinet-v0** + second SKU. **Block2D** symbols must read as product, not empty blob. Prefer size near real O&O scale. |
| **W3** Select + Delete/Backspace + undo | Select → properties; drag move; trash delete; lock optional | **Hit-test furniture** on canvas. Selection drives inspector (O&O fields only). **Delete/Backspace** removes selection; **undo** restores. Trash control optional if keyboard works and is labeled (**W8**). Do **not** require competitor Copy-Paste-to-wall for W3. |
| **W4** 2D↔3D preserves pose; orbit on | Same project drives 2D and 3D; camera snapshot is separate product | **Toggle 2D/3D** keeps entity poses. **Orbit** enabled in ThreeViewerInner with clean console. No Live3D/360/AI render required. |
| **W5** Save → hard reload → same walls + furniture ids | “Cloud save / update anytime” (claim only) | **Autosave flush or explicit save** → hard reload → same wall + furniture **UUIDs** and poses (Playwright). Implementation: open3d persistence / IDB as designed. |
| **W6** Honest save status | Competitor markets “cloud” without this scrape proving UI honesty | **Copy must not lie:** “local only” until cloud wire exists; never “saved to cloud” for IDB. Tests lock the string. |
| **W7** Mesh quality bar (cabinet-v0) | Prefer size near real; material parts on doors (later) | **Procedural modular mesh** with readable toe/door/carcass — not apology boxes. Visual smoke + NOTES. Materials/replace is **later**, not W7 minimum. |
| **W8** Tool/shortcut labels match handlers | Hotkey Q for flip door; mode names match behavior | O&O map: every visible tool name and shortcut (Delete, Backspace, structure/place/select) **matches** `useWorkspaceKeyboard` / toolbar wiring. Unit + keyboard test. |

### Recommended O&O pattern set for W (priority order)

1. **Structure → place → select/delete → 2D/3D orbit → save honesty** (W1–W6, W8) before polish measure UI.  
2. **Optional W-adjacent (not gate blockers):** ephemeral clearance measure with unit toggle + angle snap; numeric width on selected piece; wall-length clamp for openings.  
3. **Defer:** Measurement Wizard, GFA/total area product, branding letterheads, AI convert, LiDAR, photoreal, flip-whole-plan, favorites cloud, premium material browser.

### Original O&O verbs (use in UI copy)

Prefer: *Draw wall*, *Add opening*, *Place from catalog*, *Select*, *Delete*, *Undo*, *Orbit*, *Saved locally*, *Switch 2D/3D*, *Clearance measure* — never competitor product names, mode colors, or trademarked tool names.

---

## 4. Anti-copy fence

**We will NOT take:**

| Forbidden | Why |
|-----------|-----|
| RoomSketcher (or any competitor) **UI layout**, chrome, yellow/red mode button colors, mascot, logos, letterheads | Brand/trade dress |
| Help **wording**, webinar scripts, FAQ prose, marketing headlines | Copyright |
| Screenshot assets, furniture library models, materials, textures, templates | Assets |
| Exact **IA** clone (e.g. “Windows etc.”, “Tape Measure” under identical Menu tree) | UI clone risk |
| Pricing tiers, Free/Pro/Team structure, “order floor plans for you”, FloorCapture branding | Business clone |
| Real-estate GFA/GTA packaging as O&O identity | Different product (furniture manufacturer planner) |
| Any scraped **code**, CSS, Intercom/Solve widget, cookie banner patterns as product | Not ours |
| Photoreal AI render / 360 product positioning as W4 “done” | Scope creep + clone of presentation stack |
| Claiming “cloud sync across tablet/desktop” until we ship it | Honesty (W6) |

**We MAY take (ideas only):**

- Two-step catalog place (pick then put)  
- Wall-hosted openings with length constraints  
- Select → numeric size + drag handles  
- Ephemeral measure for clearances with snap + units  
- Single document driving 2D plan + 3D view  
- Explicit delete + undo as table stakes  
- Editor-only guides that don’t pollute export (when export exists)

**Packages:** If implementing measure/snap later, use **MIT/open** libs already allowed by O&O stack (or pure first-party math). Do not pull proprietary SDKs from competitors.

---

## 5. Quality note: good vs thin scrapes

### Good (actionable interaction detail)

| File | Why good |
|------|----------|
| `…115000020785-How-Does-the-Tape-Measure-Tool-Work.md` | Full gesture list: show/hide, move/rotate/size, 45° snap, snapping toggle, units, lock, usage recipes. Core of **measure/snap** pattern. |
| `…360000808925-How-Do-I-Add-Doors-to-My-Project.md` | Full place/edit/delete/copy path; properties; flip + hotkey; size handles + fields; wall constraint. Core of **structure openings + select/edit/delete**. |
| `roomsketcher.com-features-pro-features-measurements.md` | Clear **measurement product types** (room area, L×W, wall, inter-item, openings, totals) and unit FAQ — useful taxonomy even if marketing-heavy. |

### Usable but marketing-thin

| File | Why thin |
|------|----------|
| `roomsketcher.com.md` | Funnel + claims (snap walls, live measure, 2D/3D, cloud). No tool-level steps. |
| `roomsketcher.com-features.md` | Feature catalog labels only. |
| `roomsketcher.com-floor-plans.md` | Journey + library + pricing FAQ; little interaction depth. |
| `help.roomsketcher.com-hc-en-us.md` | Category map only (good for “what topics exist”, not how tools work). |
| `search-help.json` | URL titles/snippets; confirms help topics exist (tape, doors, bay windows, etc.) without bodies. |

### Bad / ignore

| File | Why bad |
|------|---------|
| `help.roomsketcher.com-en-articles-4140214-toolbar-buttons-and-options.md` | **404 “oops”** + Intercom template `<% %>` garbage — **zero toolbar evidence**. Biggest gap for select/tool chrome. |
| `help.roomsketcher.com-en-articles-4140227-measurements-overview.md` | Same 404/template failure. |
| `help.roomsketcher.com-en.md` | Wrong path 404/template. |

### Coverage honesty for W1–W8

| Gate | Evidence from this pack |
|------|-------------------------|
| W1 | Medium — doors-on-walls strong; wall-draw steps not scraped |
| W2 | Medium — catalog place strong for doors; free furniture place only implied |
| W3 | **Strong** for select/move/delete/copy pattern; undo not documented |
| W4 | **Weak** — marketing “2D and 3D” only; no orbit toggle details |
| W5 | **Weak** — cloud slogans only; no reload/autosave protocol |
| W6 | **None** competitor honesty pattern — O&O must invent truthful status |
| W7 | **Weak** — size/render tip only; mesh quality is O&O craft |
| W8 | **Partial** — one hotkey (Q) example; no full shortcut map |

### If a later scrape is needed (optional, not blocking this report)

Priority re-scrape targets (correct `/hc/en-us/articles/…` paths only):

1. Toolbar buttons and options (failed once)  
2. Draw walls with exact lengths  
3. Add furniture / move furniture  
4. Zoom / select tool  
5. Save / projects / devices  

Until then: **do not invent competitor behavior**; implement O&O gates from design spec + the strong patterns above.

---

## 6. Bottom line

RoomSketcher public content (in this pack) **validates** a world-standard furniture/floor planner loop:

> **draw structure → place catalog → select/edit/delete → measure clearances → review 2D and 3D → persist**

For O&O, that loop is already named as **W1–W8**. Use competitor material only as **confirmation that these verbs are table stakes**, then ship **original open3d actions**, **Block2D + modular mesh**, and **honest local save** — never a RoomSketcher lookalike.

**Evidence quality overall:** **partial**. Two help articles are excellent; marketing pages inflate scope; three “help” files are worthless 404 templates. Report remains **pattern-only** and **honest about thin spots**.
