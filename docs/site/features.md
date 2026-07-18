# Site package — feature maps

Routes stay in `app/`. Behavior lives under `features/`. Package map: `ARCHITECTURE.md`.

---

## Planner (`features/planner/`)

Routes: `app/planner/`. Live canvas host is **`project/`**.

### Live host

| Path | Role |
|------|------|
| **`project/`** | Live plan document — model, placement catalog, store, persistence, export |
| `editor/`, `canvas/`, `3d/` | Workspace UI tied to `project/` |
| `ui/` | Shared planner chrome widgets |

**`project/` detail**

| Area | Role |
|------|------|
| `model/` | Live project document types / scene |
| `catalog/` | Placement catalog for the live host (SVG loader/sanitizer) |
| `store/` | Live project store slice |
| `persistence/` | Session / draft / autosave |
| `shared/` | Export, document bridge, mesh contracts |
| `cleanup/` | Import graph + asset classification |

**Live 2-D canvas:** Fabric from `features/planner/canvas/` (`PlannerFabricStage`).  
Live routes: `/planner/guest`, `/planner/canvas` (not fabric/open3d — those 301 to canvas).

### Placement catalog + SVG (live host)

| Concern | Location |
|---------|----------|
| Descriptor load | `catalog/svg/svgBlockDescriptorLoader.ts` → `inventory/descriptors/` |
| Sanitize (validate) | `catalog/svg/svgSanitizer.ts` |
| Server sanitize/optimize | `catalog/svg/svgServerSanitizer.ts` |
| Compile | `catalog/svg/` + `asset-engine/` |

Do not load from `block-descriptors/` (removed).

### Parallel / API surfaces (not the guest/canvas plan host)

| Path | Role |
|------|------|
| **`catalog-api/`** | Catalog panel, bridges, ingest, resolvers |
| **`cloud-store/`** | Cloud saves, review persistence, domain stores |
| `model/` | Shared document types + canvas project document |
| `onboarding/` | Project setup |
| `shared/`, `lib/`, `hooks/`, `ai/`, `asset-engine/` | Export, geometry, AI, compile pipeline |

`catalog-api/` consumes released inventory; does not own marketing Supabase catalog authority.  
SVG previews that inject markup must sanitize (`renderBlockPrims` → `sanitizeInlineSvg`).  
AI apply must not silent-succeed (`ai/applySuggestedLayout.ts` throws until host apply is wired).

### Asset engine

SVG → mesh / GLB compile stages. Authority: compile from `inventory/descriptors/`.  
Admin publish orchestrates pipeline via `features/admin/svg-editor/`.

### Document bridges

| File | Purpose |
|------|---------|
| `shared/document/plannerDocumentBridge.ts` | PlannerDocument ↔ project model |
| `shared/document/workspacePlannerDocument.ts` | Build PlannerDocument from live store |
| `lib/fabricDocumentBridge.ts` | Fabric canvas ↔ PlannerDocument |

### Export

JSON, SVG, PNG, PDF, DXF from the document model (`shared/export/`).

### Retired

| Path | Status |
|------|--------|
| `features/planner/_archive/` | Deleted — never restore as live host |
| `app/planner/open3d` | Deleted — next.config 301 → `/planner/canvas` |
| `/planner/fabric/**`, `/planner/open3d/**` | 301 → `/planner/canvas` |

### Tests

Name-mirror under `tests/unit/features/planner/` (including `project/`, `catalog-api/`, `asset-engine/`).

---

## Site marketing (`features/site/`)

Public marketing product behavior. Routes in `app/(site)/`; presentation in `components/`.

| Path | Role |
|------|------|
| **`data/`** | Marketing copy, navigation, SEO, route classification, local catalog index |
| **`assistant/`** | Chat widget (`UnifiedAssistant`, `AdvancedBot`) |
| **`advisor/`** | Catalog advisor types/helpers for site bot + `/api/ai-advisor` |

### `data/`

| Area | Role |
|------|------|
| `homepage.ts`, `marketing.ts`, `routeCopy.ts` | Page copy (synced to `i18n/messages/` where applicable) |
| `navigation.ts`, `routeMetadata.ts`, `routeClassification.ts` | Nav trees, SEO, indexable routes |
| `seo.ts`, `brand.ts`, `contact.ts` | Metadata builders, brand constants |
| `localCatalogIndex.json` | Offline catalog index for SSG fallbacks |

### Outside this tree

| Path | Role |
|------|------|
| `i18n/` | Locale config + message JSON |
| `components/home/`, `components/site/` | Presentational sections and chrome |
| `lib/catalog/site/` | Product listing facade |

Sync marketing copy: `pnpm --filter oando-site run i18n:sync:marketing`.  
Not planner workspace AI (`features/planner/ai/`).

### Imports

```ts
import { HOMEPAGE_HERO_CONTENT } from "@/features/site/data/homepage";
import { UnifiedAssistant } from "@/features/site/assistant/UnifiedAssistant";
import type { AdvisorResult } from "@/features/site/advisor/aiAdvisor";
```

### Tests

Name-mirror under `tests/unit/features/site/`. Locales: `tests/unit/i18n/`.

---

## Admin (`features/admin/`)

Full Admin code map + Part C spine: `plan/Admin/FEATURES.md` · `plan/Admin/CHECKLIST.md`.  
Supporting (Admin only): `IMPLEMENTATION-PLAN.md` · `REALITY-AND-STACK.md` (exactly four files under `plan/Admin/`).

### Parametric linear desk (Part C — re-verify)

| Surface | Path | Truth |
|---------|------|--------|
| Form UI | `svg-editor/parametric/LinearDeskParametricForm.tsx` | Preview via Maker `renderLinearDeskSvg` → `drawLinearDesk` |
| Compile / publish | `compileLinearDeskSvg.ts` · `publishLinearDeskAction.ts` | Same Maker path; disk authority |
| Maker pen (**live**) | `…/parametric/drawLinearDesk.ts` + `makerJsRecipes.ts` · `makerJsToPath.ts` | K1 unit-green |
| Template residual | `…/parametric/drawLinearDeskFromTemplate.ts` | Deprecated; not form pen |
| Route | `app/admin/svg-editor/parametric/page.tsx` → `/admin/svg-editor/parametric` | PARTIAL |
| CLI | `scripts/render-linear-desk.mts` | Maker via barrel |

**Locked:** Maker.js only. Forms client. Fabric place. Dockview + React Aria chrome. AI fields only after C2 (**C-AI**), never geometry.  
**Open:** C3 Admin browser · C4 guest place 1280 + 390 (K1–K3 unit-green only).

### Admin local runtime data

Mutable files for dev and E2E. **Not** catalog or SVG descriptor authority.

| Path | Role |
|------|------|
| `price-books/*.json` | File-backed price book state |
| `price-books/_price-book-audit.jsonl` | Append-only audit log |

Seeds: `features/admin/pricing/fixtures/`.  
SVG descriptors: `inventory/descriptors/` only.  
Lifecycle/audit for SVG: repo-root `results/admin/catalog-ops/`.  
Production target for price books: `platform/drizzle` `price_books` tables.
