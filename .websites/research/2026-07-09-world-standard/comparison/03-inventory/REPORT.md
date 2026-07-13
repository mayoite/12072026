# 03 — Inventory / Catalog UX

**Date:** 2026-07-09  
**Slice:** Catalog place UX — search, categories, drag-drop, variants, real SKU/mm, B2B depth  
**Rule:** Ideas/patterns only — no competitor code, assets, or brand clones.  
**Scale:** 1 = broken/missing · 3 = acceptable · 5 = class-leading (public product bar)

**O&O must-win (this slice):** manufacturer **real SKUs** (orderable identity + true dimensions), not generic “sofa-looking” props.

---

## Score matrix (1–5)

| Product | search | categories | drag_place | variants | sku_mm | b2b |
|---------|--------|------------|------------|----------|--------|-----|
| Planner5D | 4 | 4 | **5** | 3 | 2 | 4 |
| RoomSketcher | 4 | 4 | 4 | 3 | 2 | 3 |
| Floorplanner | 4 | **5** | **5** | 3 | 3 | **5** |
| Homestyler | 4 | 4 | 4 | 3 | 3 | 4 |
| IKEA | 3 | 4 | 4 | **5** | **5** | 2 |
| Foyr Neo | 4 | 4 | **5** | 3 | 2 | 3 |
| **O&O** | 3 | 3 | 3 | 2 | **5** | 4 |

**Column winners (public bar):**

| Dimension | Winner | Why |
|-----------|--------|-----|
| search | Planner5D / Foyr Neo (tie) | Descriptive / AI product search beyond keyword-only |
| categories | **Floorplanner** | Category → subcategory + brand + colour filters at library scale |
| drag_place | Planner5D / Floorplanner / Foyr (tie) | Mature click-or-drag place into 2D/3D plan |
| variants | **IKEA** | Fronts, handles, interiors, worktops; bulk apply finishes |
| sku_mm | **IKEA** (pattern bar) · **O&O must-win** | Real article numbers + fixed sellable sizes + item list |
| b2b | **Floorplanner** | Enterprise custom product libraries, shared groups, branded env |

Full numeric export: [`SCORES.csv`](./SCORES.csv).

---

## Dimension definitions

| Key | Meaning |
|-----|---------|
| **search** | Speed/accuracy finding an item (text, filters, AI, brand, favorites) |
| **categories** | Browse taxonomy depth and clarity (room, type, brand, material) |
| **drag_place** | Friction to get a catalog item onto the plan (drag, click-place, snap) |
| **variants** | Finish/size/config options without leaving the product concept |
| **sku_mm** | Real manufacturer identity + real-world dimensions (not free-scale props) |
| **b2b** | Multi-user libraries, private catalogs, brand/retailer depth, commerce handoff |

---

## Product notes (public UX patterns)

### Planner5D
- **Search:** Left catalogue menu; text search; **AI-assisted** find by room type / descriptive attributes (“wood door”, style language).  
- **Categories:** Large consumer catalogue (~8.4k+ paid items marketed); room-by-room decorate flow.  
- **Drag/place:** First-class **click or drag** from catalogue into plan; 2D/3D keep editing.  
- **Variants:** Material/texture swaps; free W/D/H resize on many items (consumer). Business SKU/variant tooling exists on white-label side — not the free consumer SKU bar.  
- **SKU/mm:** Consumer catalog is mostly **generic / design-scale** props. Exact dimensions can be typed after place; not manufacturer article fidelity by default.  
- **B2B:** White-label planner, 3D product catalogue service, admin for SKUs/pricing/variants (enterprise path).  
- **O&O take:** Steal **search UX + place friction**, not generic prop catalog.

### RoomSketcher
- **Search:** Dedicated Search page + type-ahead style term search.  
- **Categories:** Furniture mode with category rail; thousands of furniture/fixtures/materials (Pro/Team unlock full library).  
- **Drag/place:** Furniture mode place; favorites heart for re-use.  
- **Variants:** Material replace / styles; less “configurator product tree” than kitchen retail.  
- **SKU/mm:** Pro viz library, not orderable multi-manufacturer SKU commerce.  
- **B2B:** Pro + Team (multi-user, branding for floor-plan deliverables) — real-estate/pro docs, not deep manufacturer PIM.  
- **O&O take:** **Favorites** + category browse discipline for repeat B2B users.

### Floorplanner
- **Search:** Free text + **brand filter** + colour filter; enlargeable library panel.  
- **Categories:** Category → **subcategory** refine; favorites; brand tab. Marketed **260k+** models.  
- **Drag/place:** Canonical drag-and-drop furniture library; related items after place.  
- **Variants:** Many generic items **resizable**; **most branded items fixed size** (correct pattern when SKU-true).  
- **SKU/mm:** Mid: branded fixed sizes improve honesty; not full retail article + price pipeline for every brand.  
- **B2B:** **Enterprise** custom product libraries, shared/admin groups, branded environment, retail integrations — class-leading multi-tenant catalog ops.  
- **O&O take:** **Brand filter + fixed-size branded SKUs + private manufacturer library** (Enterprise pattern).

### Homestyler
- **Search:** Massive model library marketing (100k–1M+ claims over time); brand-first section.  
- **Categories:** Brands + generic furniture; room packages; trends library. 200+ real furniture brands historically marketed.  
- **Drag/place:** Standard 3D room builder drag/place; AR “see brand item 1:1” messaging.  
- **Variants:** Materials; parametric custom furniture/cabinets path for power users.  
- **SKU/mm:** Stronger than pure generic tools (real brand models, 1:1 scale claims); still uneven retail-article fidelity vs IKEA’s order list.  
- **B2B:** Brands & retailers / virtual showroom positioning.  
- **O&O take:** **Brand shelf + scale honesty**; do not chase million-item generic bulk.

### IKEA (Kitchen Planner family)
- **Search:** Category-driven kitchen product browser more than open-world free-text catalog; weaker “search the world,” stronger “build a sellable kitchen.”  
- **Categories:** Cabinet systems (base/wall/high), appliances, fronts, accessories — domain taxonomy.  
- **Drag/place:** Place + modify workflow (cabinet modules, then customize); snap-to-run discipline.  
- **Variants:** **Class-leading:** door fronts, handles/positions, interiors, worktops, bulk “change all” style ops.  
- **SKU/mm:** **Public gold standard for this slice:** sellable **article identity**, fixed module sizes (cm-class real product system), **item list / quote / PDF** handoff.  
- **B2B:** Consumer retail kitchen planner primary; IKEA Business exists but this tool is not multi-manufacturer B2B PIM.  
- **O&O take:** Map IKEA’s **article + fixed module + item list** pattern onto **office manufacturer SKUs** (must-win). Ignore single-brand lock-in.

### Foyr Neo
- **Search:** Marketed **AI product search**; room typology browse.  
- **Categories:** Room-type → furniture subcategories; 60k+ models marketed.  
- **Drag/place:** Explicit drag-drop library UX for designers.  
- **Variants:** Materials/customize; **Infinite Catalogue** (image → 3D) expands coverage without retail SKU.  
- **SKU/mm:** Viz-first assets; client-pick photo models ≠ manufacturer order codes.  
- **B2B:** Pro designer tool + personal/upload library; not multi-vendor commerce catalog depth.  
- **O&O take:** AI search optional later; **do not** substitute generative props for SKUs.

### O&O (live product + strategy bar)
- **Must-win:** **Manufacturer real SKUs** + true mm — orderable identity tied to plan geometry and BOQ.  
- **Search / categories / drag_place:** Acceptable baseline / partial inventory place (2D structure first, inventory second — Plan A pattern). Not yet class-leading vs Floorplanner/Planner5D place polish.  
- **Variants:** Below bar today; need finish/config matrices **bound to real SKUs**, not free texture paint.  
- **sku_mm:** Strategic **5** — this is the differentiator vs prop catalogs (SYNTHESIS: “Catalog is the product”).  
- **B2B:** Office/trade DNA should score high once private manufacturer packs, roles, and quote handoff match Floorplanner Enterprise depth without becoming a generic consumer toy.  
- **O&O translation (ideas only):**  
  1. Catalog rows = **SKU + brand + mm envelope + Block2D + mesh**  
  2. Branded/fixed-size by default; free-scale only for non-sellable placeholders  
  3. Drag **or** double-click place with snap  
  4. Variants = real option codes (finish/size family), not freeform rescale that breaks BOM  
  5. BOQ/export consumes same SKU IDs as inventory place

---

## Pattern library → O&O (no copy)

| Industry pattern | O&O original translation |
|------------------|---------------------------|
| AI / rich search | SKU, name, brand, category, attribute filters first; AI optional on top of PIM |
| Category + brand rail | Manufacturer → family → SKU tree; favorites for repeat dealers |
| Drag or click place | Inventory drag-or-double-click to canvas point + snap (SYNTHESIS) |
| Fixed-size branded items | Default: **locked manufacturer mm**; no silent stretch of sellable SKUs |
| Configurator variants (IKEA-class) | Option matrices that change **SKU line items**, not only materials |
| Enterprise private library | Per-tenant manufacturer packs; admin publish/hide SKUs |
| Item list / quote | BOQ from placed SKUs — keep as differentiator |

---

## Anti-patterns to avoid

1. **Million generic props, zero order codes** — looks full, fails B2B.  
2. **Free W/D/H on sellable items** without new SKU or “custom” flag — corrupts mm truth.  
3. **Image-to-3D as catalog strategy** — fine for mood, fatal as SKU source of truth.  
4. **Search-only without brand/SKU filters** — dealers cannot work.  
5. **Variants as pure material paint** — no link to manufacturer finish codes.

---

## Evidence basis (marketing / help / public docs level)

- Planner5D catalogue menus, AI furniture search, drag place, business SKU admin claims.  
- RoomSketcher furniture mode: categories, search, favorites, Pro/Team library.  
- Floorplanner editor manual: search, cat/subcat, brand/colour filters, drag-drop, fixed branded sizes, Enterprise custom products.  
- Homestyler brand library / scale / retailer solutions.  
- IKEA kitchen planner: module sizes, front/handle/worktop variants, item list / PDF order path.  
- Foyr Neo: 60k+ library, AI search, drag-drop, Infinite Catalogue.  
- O&O: repo Plan A + SYNTHESIS win condition (real SKUs + Block2D + BOQ).

No competitor code, GLB, or UI chrome was copied. Scores are comparative public-bar judgments for orchestration into `MASTER-CHART.md`.

---

## Next step for orchestrator

- Fold this CSV into master chart column “Inventory”.  
- Gate O&O roadmap: **SKU/mm + place** before photoreal catalog inflation.  
- Pair with `06-export-boq` so placed SKUs = export lines.
