# Outstanding items (full list)

**Date:** 2026-07-18  
**Purpose:** Single owner list of what is **done**, what is **in progress / on disk uncommitted**, and what is still **OPEN** across Admin, Planner, Site, TechStack.  
**Product truth:** Until branded plan SVGs own the guest inventory, this is still a **generic planner** with good plumbing. SVG brand is the main product work.

Related:

- `Failures.md` — active blockers only  
- `docs/superpowers/specs/2026-07-18-four-module-svg-brand-design.md`  
- `docs/superpowers/plans/2026-07-18-four-module-svg-brand-plan.md`  
- `docs/superpowers/plans/2026-07-18-product-85-roi-plan.md`  

**Status vocabulary:** `DONE` · `PARTIAL` · `OPEN` · `BLOCKED`

---

## 0. Product intent (why these items exist)

| Intent | Status |
|--------|--------|
| Customer designs with **Oando inventory** (not OFL toys) | **PARTIAL** — brand hero slugs seeded on disk; not all dual-written / not all browser-proven |
| Customer generates **branded BOQ** | **PARTIAL** — demo pricing honesty OK; brand SKU lines depend on catalog identity |
| Customer **sends BOQ to Oando** | **PARTIAL** — members only; guests download only |
| Admin publishes trusted plan symbols | **PARTIAL** — pipeline works; dual-write one legacy SKU proved; brand batch OPEN |
| Site sends visitors into that same inventory | **PARTIAL** — guest CTA + siteProduct banner; product→symbol join incomplete |

---

## 1. Brand plan SVG inventory (primary weak link)

### 1.1 Target set (owner request)

| Group | Count | Target | Status |
|-------|------:|--------|--------|
| Desks | 5 | Fluid 1400/1600, Flex 1200, Omnia 1800, Phoenix L 1600 | **PARTIAL** — descriptors + SVGs on disk (`oando-*`); dual-write batch not finished |
| Workstations | 5 | Fluid WS linear 1200/1400, L-shape 1600, Sway bench 2400, Mozio cluster 1800 | **PARTIAL** — same |
| Meeting tables | 3 | Classy 1800, Eclipse 2400, Halo 3000 | **PARTIAL** — same |
| Storage | 4 | Spino low/tall, Omnia credenza, Xmesh locker | **PARTIAL** — same |
| Pedestal | 1 | Fluid mobile pedestal 400 | **PARTIAL** — same |
| Others | 4 | Breeze task chair, Casca guest chair, Mellow sofa, Cafe discussion table | **PARTIAL** — same |
| **Buyer total** | **22** | Hero set | **PARTIAL** |
| Internal | 1 | `missing-geom-fallback-001` | **DONE** (hidden from buyers) |

**Slugs (buyer):**

1. `oando-fluid-desk-1400`  
2. `oando-fluid-desk-1600`  
3. `oando-flex-desk-1200`  
4. `oando-omnia-desk-1800`  
5. `oando-phoenix-l-desk-1600`  
6. `oando-fluid-ws-linear-1200`  
7. `oando-fluid-ws-linear-1400`  
8. `oando-fluid-ws-lshape-1600`  
9. `oando-sway-ws-bench-2400`  
10. `oando-mozio-ws-cluster-1800`  
11. `oando-classy-meeting-1800`  
12. `oando-eclipse-meeting-2400`  
13. `oando-halo-meeting-3000`  
14. `oando-spino-low-cabinet-800`  
15. `oando-spino-tall-cabinet-900`  
16. `oando-omnia-storage-1200`  
17. `oando-xmesh-locker-900`  
18. `oando-fluid-pedestal-400`  
19. `oando-breeze-task-chair`  
20. `oando-casca-guest-chair`  
21. `oando-mellow-sofa-2200`  
22. `oando-cafe-discussion-table-900`  

### 1.2 Per-hero checklist (repeat for each of 22)

| # | Item | Status |
|---|------|--------|
| B1 | Descriptor on disk `inventory/descriptors/{slug}.json` | **PARTIAL** — seeded locally; **may be uncommitted** |
| B2 | Plan SVG `public/svg-catalog/{slug}.svg` compiled | **PARTIAL** — sync ran; **may be uncommitted** |
| B3 | Commercial **SKU** on descriptor (`OANDO-…`) | **PARTIAL** — in seed |
| B4 | Display name readable (humanize / brand series) | **PARTIAL** — label helper updated; not all UI proven |
| B5 | True mm footprint (W×D×H) | **PARTIAL** — set in seed; not validated against marketing truth |
| B6 | Symbol quality (readable multiprim / maker Y-down) | **PARTIAL** — maker desks fixed path; multiprim still abstract |
| B7 | Dual-write publish → `svg_revisions` + R2 artifacts | **OPEN** for brand set (only legacy `desk-linear-1200-001` proved) |
| B8 | `planner_managed_products.published_svg_revision_id` pointer | **OPEN** for brand set |
| B9 | `svg-blocks` serves `/api/planner/catalog/svg/{revisionId}` for that SKU | **OPEN** for brand set |
| B10 | Guest place paints SVG (not Block2D blank) | **OPEN** browser |
| B11 | BOQ line shows brand name + SKU | **OPEN** browser |
| B12 | PDP / marketing slug join to same plan slug | **OPEN** |
| B13 | Retire generic OFL heroes from buyer inventory | **PARTIAL** — seed removes old files locally; commit/push pending |

### 1.3 How to finish brand inventory (commands)

```powershell
# From repo root
pnpm --filter oando-site run seed:block-descriptors
pnpm --filter oando-site run sync:descriptor-svgs
pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_batch.ts
# Or one SKU:
pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_proof.ts --slug=oando-fluid-desk-1600
```

### 1.4 Brand quality gaps (beyond “exists”)

| # | Item | Status |
|---|------|--------|
| BQ1 | Plan symbols match **real** Oando series geometry (not generic rects) | **OPEN** |
| BQ2 | Distinct symbol per series (Fluid vs Flex vs Omnia look different) | **OPEN** — many share maker linear-desk |
| BQ3 | Inventory thumb = same SVG as canvas | **PARTIAL** |
| BQ4 | No demo-sofa / residential pollution in guest list | **PARTIAL** — demo fallback still in code if API empty |
| BQ5 | Map `public/images/products/imported/*` heroes → plan slugs table (owner-approved) | **OPEN** |
| BQ6 | Expand beyond 22 toward ~30 if sales needs more families | **OPEN** |

---

## 2. Admin module

| # | Item | Status | Notes |
|---|------|--------|-------|
| A1 | SVG editor Excalidraw authoring path | **PARTIAL** | Code exists; browser proof OPEN |
| A2 | Publish pipeline disk (compile → svg-catalog → descriptor) | **DONE** | |
| A3 | Dual-write inject when DB+R2+pointer column ready | **DONE** | Mode `enabled` on owner env |
| A4 | Dual-write **schema** `published_svg_revision_id` | **DONE** | Applied 2026-07-18 |
| A5 | Dual-write readiness script | **DONE** | `db_dual_write_readiness.ts` |
| A6 | Dual-write publish proof script (one SKU) | **DONE** | Legacy desk; brand batch OPEN |
| A7 | Dual-write **batch** all buyer heroes | **OPEN** | `db_dual_write_publish_batch.ts` exists; run not completed |
| A8 | Admin list shows dual-write mode honestly | **DONE** | Disk authority until cutover |
| A9 | Admin UI browser (unauth / publish smoke) | **OPEN** | Unit strong; browser OPEN |
| A10 | Production admin auth without bypass | **OPEN** | AF-04 / AF-10 |
| A11 | Bulk import not dominating list (AF-05) | **PARTIAL** | |
| A12 | Price books → planner BOQ pin | **OPEN** | No commercial price authority on BOQ |
| A13 | Lifecycle durable store (not only `results/admin/catalog-ops`) | **OPEN** | |
| A14 | Brand hero authoring UX (names, SKU, series fields) | **OPEN** | Seed has SKU; UI identity polish OPEN |
| A15 | Commit + push brand seed/SVG assets | **OPEN** | Working tree dirty with oando-* |

---

## 3. Planner module

| # | Item | Status | Notes |
|---|------|--------|-------|
| P1 | Guest Help panel (not AI) | **DONE** | |
| P2 | SVG/JPG underlay upload | **DONE** | |
| P3 | Guest chrome diet (unit hide, short workflow, quote status) | **DONE** | |
| P4 | Inventory More filters collapse | **DONE** | |
| P5 | Review BOQ lines wired from builder | **DONE** | Demo pricing honesty |
| P6 | Guest setup auto-defaults / one-tap | **DONE** | |
| P7 | siteProduct continuity banner | **DONE** | Toast only; no place |
| P8 | Maker SVG Y-down export | **DONE** | |
| P9 | Disk + DB revision pointer **merge** (no catalog shrink) | **DONE** | |
| P10 | Guest inventory = **brand heroes only** | **PARTIAL** | Local seed; not shipped |
| P11 | siteProduct **selects/focuses** matching catalog item | **OPEN** | |
| P12 | Guest e2e smoke (optional, soft-skip) | **PARTIAL** | File exists; not release-gate |
| P13 | Browser: place brand SVG, no Block2D miss | **OPEN** | |
| P14 | Client-grade PDF (logo, totals, disclaimer) | **PARTIAL** | Disclaimer; logo/cover weak |
| P15 | Guest Send to Oando | **OPEN** | By design blocked; product loop incomplete for guests |
| P16 | Member cloud save | **OPEN** | Local-first honesty |
| P17 | 3D parity with plan symbols | **OPEN** | |
| P18 | Demo catalog fallback pollution when API empty | **OPEN** | |
| P19 | Underlay calibrate polish (P5 residual) | **OPEN** | |
| P20 | Workstation systems v0 vs brand WS symbols consolidation | **OPEN** | Dual catalog stories |

---

## 4. Site module

| # | Item | Status | Notes |
|---|------|--------|-------|
| S1 | Hero primary → guest chooser | **DONE** | |
| S2 | Mobile sticky CTA = hero CTA | **DONE** | |
| S3 | InteractiveTools launch → guest chooser | **DONE** | |
| S4 | Trust: no universal BIFMA / selected orgs | **DONE** | |
| S5 | PDP Design in Planner → guest + params | **DONE** | |
| S6 | siteProduct banner in planner | **DONE** | |
| S7 | siteProduct → **same brand plan symbol** on canvas | **OPEN** | Core continuity |
| S8 | PDP shows plan SVG thumb when published | **OPEN** | |
| S9 | Collections/cards use live catalog / real alts | **OPEN** | |
| S10 | Hero dump filenames / craft pass | **OPEN** | |
| S11 | i18n parity (sticky was TS-sourced; other locales) | **PARTIAL** | |
| S12 | “Real inventory in planner” claim only if brand placeable | **OPEN** | Honesty |

---

## 5. TechStack module

| # | Item | Status | Notes |
|---|------|--------|-------|
| T1 | Products DB connection + migrations apply path | **DONE** | |
| T2 | SVG revisions tables | **DONE** | |
| T3 | Pointer column migration applied | **DONE** | |
| T4 | Dual-write mode `skipped_schema_missing` | **DONE** | |
| T5 | Dual-write readiness `enabled` on owner env | **DONE** | |
| T6 | One dual-write publish + R2 artifacts | **DONE** | Legacy slug only |
| T7 | Revision API GET returns SVG bytes | **DONE** | For that revision |
| T8 | Dual-write **all brand heroes** | **OPEN** | |
| T9 | Browser place of revision URL symbol | **OPEN** | |
| T10 | `SVG_RELEASE_AUTHORITY=db` preview smoke | **OPEN** | Do not flip until T8+T9 |
| T11 | Prod cutover flip | **OPEN** | |
| T12 | Failures.md kept honest | **PARTIAL** | Update after brand ship |
| T13 | CI / env secrets for dual-write in non-owner envs | **OPEN** | |
| T14 | Lifecycle audit off gitignored FS | **OPEN** | |

---

## 6. Security / release (cross-cutting)

| # | Item | Status |
|---|------|--------|
| X1 | Admin unauth unit gates | **DONE** (browser OPEN) |
| X2 | CSRF / rate matrix unit | **DONE** (browser OPEN) |
| X3 | Production-auth smoke | **OPEN** |
| X4 | Release gate full green on brand inventory | **OPEN** |
| X5 | No `SVG_RELEASE_AUTHORITY=db` without proof | **DONE** (policy) |

---

## 7. Repo hygiene (current working tree)

| # | Item | Status |
|---|------|--------|
| H1 | Commit brand `oando-*` descriptors + SVGs | **OPEN** |
| H2 | Commit seed / label / batch script changes | **OPEN** |
| H3 | Remove leftover OFL svg-catalog orphans if unused | **OPEN** |
| H4 | Clean `*.svg.backup-*` if any | **OPEN** |
| H5 | Push after H1–H2 | **OPEN** |

---

## 8. Priority order (what to do next)

Do in this order — **SVG brand is not optional.**

| Priority | Item IDs | Action |
|----------|----------|--------|
| **P0** | H1–H5, B1–B2 | Commit/push brand seed + SVGs so main is not generic OFL |
| **P0** | B7–B8, A7, T8 | Dual-write batch all 22 buyer heroes |
| **P0** | B9–B11, T9, P13 | Browser: inventory shows brand names; place; BOQ line |
| **P1** | BQ1–BQ3, A14 | Improve symbol craft + Admin identity |
| **P1** | P11, S7–S8 | Product → plan symbol join |
| **P1** | A12, P14 | Price book pin + PDF craft |
| **P2** | T10–T11 | Cutover flip after multi-SKU dual-write + browser |
| **P2** | P15–P17, S9–S10 | Cloud, 3D, marketing craft |

---

## 9. Explicit non-goals (do not confuse with outstanding)

- Claiming cutover because one desk dual-wrote  
- Claiming 8.5 while plan symbols are abstract geometry with series names only  
- More AI features before brand inventory  
- Photoreal 3D for every SKU before plan SVG brand set works  

---

## 10. One-line summary

**Outstanding product work = finish and ship the 22 brand plan SVGs (dual-write + browser place + Site join).** Everything else is secondary until that is real inventory, not a generic planner kit.

---

## 11. Why bare plan SVGs looked black (diagnosed + fixed)

| Cause | Detail |
|-------|--------|
| **`fill="currentColor"`** | Pipeline default. In Fabric / `<img src="…svg">`, `currentColor` resolves to **black** (no CSS color inheritance). |
| **CSS `var(--…)` fills** | Also unsafe as image paint → effectively black/missing. |
| **Difference booleans** | Without `fill-rule="evenodd"`, cutouts render as solid mass. |

**Fix (pipeline):** `resolvePlanSvgPaint` → image-safe greys `#8a8680` fill + `#2c2a28` stroke; evenodd on difference; multipath shade variation. Re-run `sync:descriptor-svgs` after seed.

**Not fixed by this alone:** symbols still abstract geometry; dual-write batch of all brand heroes; browser place proof.
