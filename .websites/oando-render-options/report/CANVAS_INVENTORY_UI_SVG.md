# Canvas + inventory + UI — SVG coding process, packages, gaps

**Scope:** Canvas drawing, inventory (catalog), planner UI only.  
**Out of scope (per request):** competitor help content, GLBs, proprietary 3D assets/materials, copying their code or design system.  
**Date:** 2026-07-09  
**Evidence base:** Our `site/features/planner/**` + public UI screenshots only (no help URLs, no asset downloads from their CDN).

---

## 1. What we are allowed to take from competitors

| Allowed | Not allowed |
|---------|-------------|
| Layout *ideas*: left inventory, center canvas, top chrome | Their furniture GLBs / textures / SVG assets |
| Pattern: catalog tile ≈ on-canvas symbol | Help-center text, tutorials |
| Package *categories* (e.g. “uses Canvas + icons”) | Their minified app.js / catalog |
| Our own screenshots of *public* marketing/login UI for chrome notes | Pixel-clone UI |

---

## 2. Our packages (actual, from `site/package.json`)

| Package | Role in canvas / inventory / UI |
|---------|----------------------------------|
| **Browser Canvas 2D** | Live 2D: `FeasibilityCanvas` (`getContext("2d")`) |
| **`fabric` 7.4.0** | Installed; live 2D still FeasibilityCanvas (Fabric archived / flag path) |
| **`three` + `@react-three/fiber` + `@react-three/drei`** | 3D only — **out of this doc’s focus** |
| **`svgo`** | Server/CLI SVG optimize (asset-engine compile pipeline) |
| **`sharp`** | Image/SVG pipeline tooling (server) |
| **`jsdom`** (dev) | SVG pipeline tests |
| **Phosphor icons** (`@phosphor-icons/react`) | Catalog / UI icons |
| **Next `Image`** | Some catalog tiles |
| **No** Konva / Pixi / D3 as live canvas engine |

**Competitor (public only, no proprietary assets):** named jQuery UI vendors + webpack app (earlier research). We do **not** adopt their stack by copying; we use the table above.

---

## 3. Our coding process — how SVG is *supposed* to work

There are **three separate SVG-related paths**. Confusing them is the main bug class.

```
┌─────────────────────────────────────────────────────────────────┐
│ A. PROCEDURAL SYMBOL (inventory thumbnail)                        │
│    CatalogItem → resolveCatalogItemBlock2D → Block2D (prims mm) │
│    → blockToSvg() → SVG markup string                             │
│    → sanitizeInlineSvg → dangerouslySetInnerHTML in DOM           │
│    Files: catalogBlockBridge, blocks2d, CatalogBlockPreview       │
└─────────────────────────────────────────────────────────────────┘
                              ≠
┌─────────────────────────────────────────────────────────────────┐
│ B. CANVAS FURNITURE (live plan)                                   │
│    Furniture item → resolveFurniture2DFootprint()                 │
│    → SVG *path d= only* (box or modular cabinet)                  │
│    → new Path2D(path) → context.fill(path)                        │
│    Files: FeasibilityCanvas, parametricBuilder                    │
│    Does NOT call blockToSvg. Does NOT draw inventory SVG.         │
└─────────────────────────────────────────────────────────────────┘
                              ≠
┌─────────────────────────────────────────────────────────────────┐
│ C. ASSET-ENGINE COMPILE (publish pipeline)                        │
│    Descriptor → S1 normalize → S2 pipelineCore → S3 svgo-ish      │
│    → stored SVG for managed assets (disk/API)                     │
│    Not the live FeasibilityCanvas draw loop.                      │
└─────────────────────────────────────────────────────────────────┘
```

### A — Inventory preview (full SVG in DOM)

```text
CatalogBlockPreview
  block = resolveCatalogItemBlock2D(item)
  svg   = blockToSvg(block, pad)
  size  = force width/height × 2 (retina)
  render = <div dangerouslySetInnerHTML={sanitizeInlineSvg(svg)} />
```

- Primitives: rect, line, circle, arc, path, gradients (`blocks2d.ts`).
- Colors: CSS variables `var(--block-surface)` etc. — work **because** markup sits in page CSS tree.

### B — Canvas (Path2D footprint only)

```text
FeasibilityCanvas draw loop
  for furniture:
    pathString = resolveFurniture2DFootprint(item)
    // default: box "M -w/2 -d/2 L ... Z" in mm, centered
    path = new Path2D(pathString)
    translate(screen)
    rotate(...)
    scale(transform.scale)   // zoom
    fill(path)               // flat primary color, alpha 0.22
```

- **No** multi-prim desk/chair symbols.
- **No** `drawImage` of rasterized SVG.
- Walls/rooms/doors/windows: pure Canvas path geometry (not SVG).

### C — Publish pipeline

- `runSvgCompileStages` / `compileSvgForPublish` / `svgo` / `sharp`.
- Authority: `compileAuthority.ts` (S1–S3 in process; S4 disk CLI).

---

## 4. Inventory management (our UI process)

`CatalogPanel` is a **3-layer browser** (comment in source):

1. **Purpose tabs** (horizontal)  
2. **Sub-category chips**  
3. **2-column item cards** + preview + add/drag  

State: `catalogStore` (query, items, source static/managed, hydration, recents).  
Drag: `writeCatalogDragPayload` / `catalogDrop` → canvas placement (`pendingCatalogPlacement`).  
Preview component: `CatalogBlockPreview` (SVG) or fallback colored box if no prims.

**What “inventory” is *not*:** loading competitor catalog meshes. Ours is product rows + procedural 2D blocks + optional managed SVG compile.

---

## 5. UI shell (ours vs public competitor chrome — pattern only)

### Our planner UI zones (code)

| Zone | Typical modules |
|------|-----------------|
| Workspace host | `Open3dPlannerHost`, `PlannerWorkspaceRoute` |
| Catalog | `CatalogPanel`, `CatalogSidebar` |
| Canvas stage | FeasibilityCanvas / fabric stage (flag) |
| Chrome | Top bar, tool rail, sheets (`BottomSheet`, mobile) |

### Public competitor screenshots (UI chrome only — no editor inventory, no GLBs)

| File | What it shows |
|------|----------------|
| `raw/ui-only/p5d-home.png` | Marketing: top nav, hero CTA, **use-case cards** (floor plan, room, furnish…) — product IA, not canvas |
| `raw/ui-only/p5d-editor.png` | **Sign-up wall** only (Google/Apple/email) — no canvas, no inventory visible without auth |

**Screenshot detail (home):**  
- Top: logo · Products · Use cases · Resources · Enterprise · Pricing · Sign in · green “Start a project”  
- Hero + green CTA  
- Horizontal **inventory of entry modes** as cards (together / floor plan / room / home / furnish / AI…) — inspiration for *how* to present entry paths, not for assets  

**Screenshot detail (editor URL):**  
- Empty white + auth modal → automated scrape **cannot** document their live canvas/inventory without login.  
- We **do not** bypass auth or scrape private app UI.

---

## 6. What we are doing wrong (SVG + canvas + inventory)

### Wrong #1 — Preview ≠ canvas (the big one)

| Inventory tile | On canvas |
|----------------|-----------|
| Rich `blockToSvg` multi-prim symbol | Flat **box** Path2D (or cabinet outline) |
| CSS token fills/strokes | Single `--color-primary` fill @ 0.22 alpha |

**Symptom:** “SVG doesn’t render on canvas” — correct: **SVG never goes to canvas**. Only a path `d` string does.

**Fix direction (ours):** one of:

1. Rasterize `blockToSvg` → `Image` / `ImageBitmap` → `drawImage` at place (cache by catalogId+size).  
2. Or walk `prims` with Canvas 2D API (shared prim renderer).  
3. Or Fabric objects from same prim list (when Fabric lane on).  

**Not:** copy their furniture art.

### Wrong #2 — Units / naming debt

`catalogBlockBridge` documents:

- Canvas coords often **cm**  
- Props named `widthMm` / `heightMm` sometimes **cm**  
- Heuristic repair if values ≥ 1000  

Footprint Path2D uses **mm** then `scale(transform.scale)`. If `item.width` is actually cm, boxes are **10× too small/large**.

**Symptom:** symbols wrong size / invisible at zoom.

**Fix:** one unit system end-to-end (mm internal, convert only at edges).

### Wrong #3 — CSS variables on wrong surface

`BLOCK_STYLE` uses `var(--block-*)`.  

- Works in **DOM** SVG (preview).  
- **Path2D** fill does not interpret CSS variables in path data.  
- Canvas must use `getComputedStyle` resolved colors (walls already do for tokens).

### Wrong #4 — Dual engines, Fabric idle

- Live path: hand-rolled FeasibilityCanvas (~1000+ lines).  
- `fabric` installed, stage exists, default off.  
- Cost: two mental models; SVG→object path unfinished for Fabric.

### Wrong #5 — `renderBlockPrims` vs preview security

- `CatalogBlockPreview`: `sanitizeInlineSvg`  
- `renderBlockPrims`: raw `dangerouslySetInnerHTML` without sanitize  

Inconsistent; prefer one helper.

### Wrong #6 — Inventory hydration complexity

Multiple bridges: buddy catalog, managed products, generated parts, shapeTypeRegistry.  

**Symptom:** missing preview (`!block?.prims`) → empty gray tile; place still works as box → UI/canvas mismatch.

### Wrong #7 — Expecting competitor editor screenshots for inventory

Without auth, `/editor` is login-only. Deeper inventory UI learning must come from **our** product + public marketing IA, not their private canvas.

---

## 7. Correct coding process (recommended)

### Target architecture (still our code)

```
CatalogItem
   → Block2D (prims in mm)     // single truth for 2D symbol
   → Thumbnail: blockToSvg → DOM (or cached PNG)
   → Canvas: renderPrimsToCanvas2D(ctx, prims, transform)
   → (optional later) Fabric object from same prims
```

### Steps when placing from inventory

1. Resolve catalog id → `Block2D` (or fail with explicit “no 2D symbol”).  
2. Store on furniture entity: `catalogId`, size mm, rotation, **prim snapshot or generator key**.  
3. Draw: same prims as thumbnail, transformed to screen.  
4. Hit-test: path bounds or prim bounds (not only box).  

### Packages to lean on (ours)

| Need | Use |
|------|-----|
| Live 2D | Canvas 2D (keep) or Fabric when ready |
| Build SVG string | existing `blockToSvg` |
| Optimize publish SVG | `svgo` (pipeline only) |
| Icons | Phosphor |
| Avoid for plan symbols | Three/GLB (different mode) |

Optional open libs (if we add): `svg-path-bounds`, path parser — **not** required if we stick to prim list.

---

## 8. Screenshot inventory (this folder)

| Path | Description |
|------|-------------|
| `../raw/ui-only/p5d-home.png` | Public marketing UI chrome + use-case cards |
| `../raw/ui-only/p5d-editor.png` | Public auth gate only |
| `../raw/ui-only/p5d-home.json` | Scrape metadata + screenshot URL |
| `../raw/ui-only/p5d-editor.json` | Scrape metadata + screenshot URL |

No help.planner5d.com. No GLB/CDN asset harvest.

---

## 9. Checklist: “are we rendering SVG right?”

| Check | Expected |
|-------|----------|
| Thumbnail shows desk/chair detail | Path A works |
| Same item on canvas shows same detail | **Currently fails** (box only) |
| Size matches catalog mm/cm | Verify units at place + draw |
| Zoom keeps stroke readable | Use screen-space stroke or min stroke after scale |
| CSS tokens on canvas | Resolve via `getComputedStyle` |
| Empty prims | Don’t place silent box; show error in inventory |

---

## 10. Bottom line

1. **Inventory SVG pipeline is real** (`blockToSvg` → DOM).  
2. **Canvas does not use that SVG** — only simple Path2D footprints. That is the core process error, not “Canvas 2D is broken.”  
3. **Packages we need** are mostly already installed; we need a **shared prim→canvas renderer**, not competitor assets.  
4. **UI** should keep catalog left + canvas center; deepen **our** CatalogPanel + placement sync, not their help or GLBs.  
5. Competitor **editor screenshot** is auth-walled; use home chrome only for shallow IA inspiration.

---

## 11. Suggested next implementation (when you ask to code)

Priority order:

1. **Shared `renderBlock2DToCanvas(ctx, block, transform)`** used by FeasibilityCanvas furniture layer.  
2. **Unit audit** on place/draw path (mm only inside).  
3. **Cache** of path/ImageBitmap per catalogId.  
4. Align Fabric stage later to same Block2D.  

No competitor materials required.
