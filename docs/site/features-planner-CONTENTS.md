# Planner feature — folder map

Routes stay in `app/planner/`. This tree owns workspace behavior.

## Live canvas host

| Path | Role |
|------|------|
| **`project/`** | Live plan document — model, placement catalog, store, persistence, export |
| `editor/`, `canvas/`, `3d/` | Workspace UI tied to `project/` |
| `ui/` | Shared planner chrome widgets |

Detail: `project/README.md`.

## Parallel / API surfaces

| Path | Role |
|------|------|
| **`catalog-api/`** | Catalog panel, bridges, ingest, resolvers |
| **`cloud-store/`** | Cloud saves, review persistence, domain stores |
| `model/` | Shared document types |
| `onboarding/` | Project setup |
| `shared/`, `lib/`, `hooks/`, `ai/`, `asset-engine/` | Export, geometry, AI, compile pipeline |

## Legacy redirects (not live hosts)

| URL | Behavior |
|-----|----------|
| `/planner/fabric/**` | 301 → `/planner/canvas` |
| `/planner/open3d/**` | 301 → `/planner/canvas` |

## Document bridges

| File | Purpose |
|------|---------|
| `project/shared/document/plannerDocumentBridge.ts` | PlannerDocument ↔ project model |
| `project/shared/document/workspacePlannerDocument.ts` | Build PlannerDocument from live store |
| `lib/fabricDocumentBridge.ts` | Fabric canvas ↔ PlannerDocument |

## Tests

Name-mirror under `tests/unit/features/planner/` for every handwritten module.

SVG preview inject must sanitize (`catalog-api/renderBlockPrims.tsx` → `sanitizeInlineSvg`).
AI apply must not silent-succeed (`ai/applySuggestedLayout.ts` throws until host apply is wired).
