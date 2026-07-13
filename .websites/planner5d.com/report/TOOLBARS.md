# Planner 5D — Editor toolbars (inspiration)

**Date:** 2026-07-09  
**Sources:** Firecrawl scrape of `/editor`, FAQ, beginner tips, prior product scrapes.  
**Live app (runnable):** https://planner5d.com/editor  
**Local mock (runnable):** `D:\websites\planner5d.com\report\toolbar-mock\index.html`  
**Rule:** Inspiration only — do not copy their code, icons, or assets.

---

## How to see the real editor

1. Open **https://planner5d.com/editor** in Chrome or Firefox (their UI says 3D needs a modern browser).  
2. Welcome options (scraped strings):  
   - **Start from scratch**  
   - **Smart Wizard**  
   - **Import a plan**  
   - **Templates**  
   - Hire a designer (external)  
3. Accept license/ToS if shown; optional newsletter checkbox.  
4. Use **2D** for structure, **3D** for furnish/textures; camera/render in **top bar**.

**Note:** Headless Firecrawl `interact` could not keep a live session into the canvas (session init failed; action click selectors flaky). Toolbar map below is from **public UI strings + FAQ/blog** + editor shell scrape.

---

## Chrome zones (product pattern)

```
┌─────────────────────────────────────────────────────────────┐
│ TOP BAR: project · share · 2D|3D · camera/render · account  │
├──────┬──────────────────────────────────────────┬───────────┤
│ LEFT │              CANVAS                      │ RIGHT     │
│ tools│   2D plan  /  3D view                    │ catalog / │
│      │                                          │ props     │
├──────┴──────────────────────────────────────────┴───────────┤
│ BOTTOM / status: floors · mode hints · undo hints            │
└─────────────────────────────────────────────────────────────┘
```

---

## Welcome / project chrome (from `/editor` scrape)

| Control | Role |
|---------|------|
| Start from scratch | Blank canvas |
| Smart Wizard | AI guided layout |
| Import a plan | Plan recognition upload |
| Templates | Template gallery |
| My Projects | Project list / folders |
| New Folder / Rename / Move to Archive | Project org |
| Import | Project import |
| Make cover | Project thumbnail |
| Copy project | Duplicate when view-only |
| View mode only | Sign-in / copy to edit |

### Plan recognition (Import a plan)
- Formats: png, jpg, pdf, bmp, tiff, **dxf, dwg**, + others listed in UI  
- Drag & drop or browse  
- Failure → support article “Why wasn’t my plan recognised”  

### Catalog layer tags (scraped)
`floor | ceil | indoor | outdoor`

---

## 2D mode tools (structure) — from FAQ + beginner tips

| Tool / action | Notes |
|---------------|--------|
| Walls / rooms | Baseline rooms; resize by edges; wall height in specs |
| Angles / reshape | Complex room shapes via control panel |
| Doors | Types: front/back, sliders, arches, French; opening direction |
| Windows | Colors, shapes, styles; dimensions |
| Measurements | Floor plan dimensions in 2D |
| Floors | Add new floor; multi-story |
| Stairs | Catalog + dimensions |
| Foundation | Exterior house shell (cottage/house) |
| Balconies | As separate space attached to plan |
| Delete walls | Tutorial: delete / edit construction |

**Workflow (FAQ):**  
1) Account → 2) scratch or templates → 3) **2D: walls, doors, windows, measurements** → 4) **3D: furniture, textures** → 5) colors/materials → 6) 3D view or 4K render.

---

## 3D mode tools (decorate / present)

| Tool / action | Notes |
|---------------|--------|
| Furniture placement | Drag-and-drop; 6k–10k+ items (plan-gated) |
| Textures / materials | Wallpaper, tile, fabric, leather, etc. |
| Colors / styles | Paint/simulator style edits |
| Camera / render | **Top bar camera icon** (web); quality HD→4K by plan |
| 360° walkthrough | Generate preview; WASD to navigate angles then Generate |
| Renders gallery | Async: “Render will appear after a while in Renders” |
| All renders | Dashboard `#snapshots` |
| AR / VR / Vision Pro | Platform features (tiered) |

### Keyboard (walkthrough UI string)
- **W A S D** — rotate/navigate angles  
- Then **Generate** for preview  

---

## Top bar actions (documented)

| Control | Source |
|---------|--------|
| **Camera icon** → render | FAQ: aspect ratio + quality (HD, Full HD, Quad HD, 4K) |
| Share project | Collab tool page: link/email, view/comment/edit |
| 2D / 3D toggle | Core product pattern |
| Help / support | Help Center form (platform: Web/iOS/Android/Windows/MacOS) |

---

## Right panel / catalog (inspiration taxonomy)

Not a full scrape of tree, but product pages imply:

- Rooms / construction (walls, doors, windows, stairs)  
- Furniture by room  
- Decor / accessories  
- Materials / finishes  
- Outdoor / landscape (separate use cases)  
- Layer filters: floor / ceiling / indoor / outdoor  

---

## Dialogs that sit above toolbars

| Dialog | Purpose |
|--------|---------|
| License agreement | ToS + privacy + cookies |
| Free plan project limit | 1 active project free (scrape text; pricing pages also claim unlimited projects — treat as product-variable) |
| Unsaved project | Create new without saving / Register and save |
| 3D mode not supported | Upgrade Chrome/Firefox |
| Name prompt | Guest naming |
| 360 walkthrough launched | Back to Editor / stay in walkthrough |

---

## Inspiration checklist for *our* toolbars

### Must-have zones
1. **Top:** project name, save state, 2D|3D, render, share  
2. **Left:** select, wall, door, window, room, measure, delete  
3. **Right:** catalog search + categories + item grid  
4. **Inspector:** selection props (size, material, rotation)  
5. **Bottom:** floor switcher, zoom, undo/redo  

### 2D vs 3D tool swap
- 2D: construction + measure  
- 3D: catalog + materials + camera orbit + render  

### Power UX
- Async render job → gallery  
- Import plan formats (image + CAD)  
- Multi-floor + stairs  
- Share permissions  

---

## Local runnable mock

Open in browser:

```
D:\websites\planner5d.com\report\toolbar-mock\index.html
```

Or:

```powershell
start D:\websites\planner5d.com\report\toolbar-mock\index.html
```

**Original mock** — labels inspired by public patterns, not a clone of Planner 5D UI/code.

---

## Evidence files

| Path | Content |
|------|---------|
| `raw/editor/editor-full.json` | Editor shell strings |
| `raw/editor/editor-markdown.md` | Same as markdown |
| `raw/editor/planner5d.com-blog-planner5d-frequently-asked-questions.md` | Camera top bar, 2D/3D flow |
| `raw/editor/planner5d.com-blog-caJa-beginner-tips-to-use-planner-5d.md` | Walls, doors, floors, stairs, textures |
| `raw/planner5d.com-collaboration-tool.md` | Share toolbar flow |
