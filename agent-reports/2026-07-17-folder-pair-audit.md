# Folder-pair audit rollup (2026-07-17)

**Model:** 10 product folders × **2 workers** (non-overlapping exclusive paths).  
**Bar:** inventory → issues → name-mirror tests → fix in exclusive paths only.  
**Not claimed:** full `release:gate`, browser product-loop end-to-end, DB-SVG cutover.

## Fresh gates (owner session)

| Check | Result |
|-------|--------|
| `pnpm run check:layout` | **OK** |
| `pnpm --filter oando-site run test:audit:hollow` | **ok** |
| `pnpm --filter oando-site run test:audit:api-routes` | **ok** (56 routes / 37 mutators) |
| `pnpm run typecheck` | **PASS** (CSRF default-arg fix; RestrictedActionButton props fix) |

Status vocabulary: **PASS** = fresh evidence in that worker scope. **OPEN** = not proven. Unit ≠ browser.

---

## Pair map

| Folder | A | B |
|--------|---|---|
| `site/app/(site)/` | F1a marketing half | F1b products/portal/quote |
| `site/app/admin/` | F2a analytics/crm… | F2b svg-editor/inventory… |
| `site/app/planner/` | F3a marketing | F3b workspace |
| `site/app/api/` | F4a admin/planner/plans | F4b public APIs |
| `site/components/` | F5a home/site/shared | F5b rest |
| `site/features/planner/` | F6a model/canvas/editor | F6b catalog/save/BOQ |
| `site/features/admin/` | F7a svg-editor | F7b rest |
| `site/features/site/` | F8a alpha first half | F8b second half |
| `site/lib/` | F9a auth/security | F9b catalog/rest |
| `site/tests/` | F10a unit | F10b e2e/integration |

---

## Critical product fixes (real)

1. **Auth fail-open (F9a)** — `requirePlannerUser` swallowed `NEXT_REDIRECT` and could return anonymous on protected paths. Fixed: rethrow control-flow; fail closed on protected paths. Tests expanded.
2. **API IDOR (F4b)** — `/api/ai-advisor` and `/api/recommendations` trusted body `userId`. Fixed: session / tracking cookie only.
3. **CSRF gaps (F4b)** — member mutators `filter`, `generate-alt`, `configurator/smart-wizard` now `requireCsrf: true`; UnifiedAssistant uses `browserApiFetch`.
4. **Length unit bugs (F6a)** — `parseLengthInput` 10× when suffix + display unit disagreed; cad-suite normalize re-scaled every pass; shell defaults `cm` → `mm`.
5. **Guest UUID case instability (F3b)** — shared `planIdGate` lowercases UUID for stable IndexedDB keys.
6. **Marketing claim drift (F8a)** — glass proof “400+” → honest “120+” (TS + i18n).
7. **Portal SVG slug robots (F1b)** — protected portal slug metadata noindex.

---

## Per-folder outcomes (short)

### F1 `app/(site)` — PASS (unit) / browser OPEN
- F1a: OG `letterSpacing` typo; loading/error/login a11y; LoginForm safe errors. Tests green.
- F1b: portal slug noindex; PDP “chair” copy; 46 files / 137 tests PASS.

### F2 `app/admin` — PASS (unit) / browser OPEN
- F2a: RSC thin wrappers; auth layout 4/4. Catalog/features hollow hang tests left as test debt outside exclusive product paths (F2b fixed B half tests).
- F2b: hollow admin page tests rewritten; 11 files / 23 tests PASS.

### F3 `app/planner` — PASS (unit)
- F3a: SEO metadata single-source; 14 tests PASS.
- F3b: BOM/mojibake fixed; `planIdGate`; 26+16 tests PASS.

### F4 `app/api` — PASS (static + unit)
- F4a: exclusive admin/planner/plans/audit contract OK; no code change required.
- F4b: IDOR + CSRF fixes; 119 route tests PASS; api-route audit ok.

### F5 `components` — PASS (unit)
- F5a: removed unused home/shared orphans; a11y on live home/chrome; 102 tests PASS.
- F5b: removed dead SafeImage/Modal/support-ivr; a11y on compare/reviews; 91 tests PASS.

### F6 `features/planner` — PARTIAL
- F6a: dual `PlannerSceneEnvelope` documented + aliases (not merged); unit bugs fixed; model 188 + editor 121 + related PASS.
- F6b: managed-products consolidation already re-export; BOQ bridge; save delete honesty; silent catch improvements. Browser BOQ/handoff still OPEN.
- Late single F6 also: managed-products price honesty; full `test:planner` ~4079 pass.
- **Still FAIL (fresh re-check):** `threeLazy.test.tsx` (`onReady` never fires); `workspaceShell.test.tsx` static hardcoding audit (1 violation). `furnitureFabricMapper` barrel timeout **PASS** in isolation.

### F7 `features/admin` — PASS (unit) / cutover OPEN
- F7a: dual-write honesty in code (real artifacts, fail-closed when enabled); 60 focus tests PASS. **Cutover still OPEN** (Failures.md).
- F7b: 40 modules / 293 tests PASS; CSRF matrix expanded.

### F8 `features/site` — PASS (unit)
- F8a: 120+ claim honesty; 60 tests PASS.
- F8b: news CTA `/portfolio`; PIN align; localCatalogIndex structural tests; data quality OPEN (dup images).

### F9 `lib` — PASS (unit) for security fix
- F9a: auth fail-open fix + server-only guards; 104 tests PASS.
- F9b: orphan inventory; z-index wiring; puckBlockRegistry mirror.

### F10 `tests` — PASS (gates) / journey gaps OPEN
- F10a: hollow ok; export-surface shells strengthened; name-mirror sample gaps reduced.
- F10b: e2e flake helpers; hollow J5 fixed; **BOQ → Send to Oando e2e still missing**.

---

## Product loop honesty

| Step | Unit / static | Browser e2e |
|------|---------------|-------------|
| Admin publish inventory | Strong (publish/dual-write units) | Partial smoke only |
| Site visitors | Strong unit | Partial nav/a11y |
| Planner design | Strong unit | Guest/catalog gate strong |
| Branded BOQ | Partial (demo pricing) | **Gap** |
| Send to Oando | API unit exists | **Gap** |
| DB-SVG cutover | Dual-write real; flip OPEN | **OPEN** |

---

## Wave 2 — remaining folders (2026-07-17 continue)

| Folder | Result | Key fixes |
|--------|--------|-----------|
| `features/crm` | 70 unit PASS | Fake multi-user demo removed; deleteClient clears quotes; plan-index safe parse; embedded chrome |
| `features/ops` + `shared` | 236 unit+integration PASS | Nested button hydration fix on `RestrictedActionButton` |
| `platform` | 63 unit PASS | Clients/schema coherent; comment path fix only |
| `i18n` | parity ok + 25 unit PASS | No exclusive defects |

## Owner continue fixes (same session)

| Item | Result |
|------|--------|
| `workspaceShell` hardcoding audit | **PASS** — InventoryPanel compare styles moved to CSS module |
| `threeLazy` / `ThreeLazyViewer` | **PASS** — fuller three + OrbitControls mocks (was suite flake under incomplete mock) |

## Still OPEN (do not claim done)

1. DB-SVG authority cutover (`Failures.md`).
2. Dual planner document envelopes not merged.
3. BOQ + Send to Oando browser journey.
4. Full browser a11y / visual regression re-run.
5. Catalog fallback index image quality (~32 dup paths).
6. Orphan lib UI modules wire-or-delete owner call.
7. CRM is localStorage demo — not production CRM.
8. `inventory/` descriptors not folder-audited as product code (canonical data).
9. No commit/push (owner not asked).

---

## Brutal truth

First thematic audit waves were noise. This pass is **folder-owned with pair workers** and produced real security fixes (auth fail-open, IDOR, CSRF), real unit bugs (mm/cm), and real dead-code cleanup.  
It is **not** whole-product PASS. Commercial loop end and SVG cutover remain OPEN.
