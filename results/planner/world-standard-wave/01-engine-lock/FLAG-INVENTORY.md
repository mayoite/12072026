# FLAG-INVENTORY — P02 engine lock (live code)

**Seat:** P02 B (docs only — no product edits)  
**Date:** 2026-07-10  
**Scope:** `site/features/planner/open3d/` + related env readers  
**Authority:** source files below — not plan cards, not invent

---

## 1. Live env flag (planner 2D Fabric furniture stage)

### `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`

| Field | Live truth |
|-------|------------|
| Env key constant | `OPEN3D_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE"` |
| Reader | `isOpen3dFabricFurnitureEnabled()` |
| Enable rule | **exact** `env[key] === "1"` only |
| Default | **OFF** — missing, `"true"`, `"yes"`, `"0"`, `1` (number), wrong key → false |
| Enable string | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` |
| Source file | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Barrel re-export | `site/features/planner/open3d/canvas-fabric-stage/index.ts` (lines 16–19) |

**Live predicate** (`fabricFurnitureFlag.ts` L8–17):

```ts
export const OPEN3D_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE" as const;

export function isOpen3dFabricFurnitureEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  return env[OPEN3D_FABRIC_FURNITURE_ENV] === "1";
}
```

**Workspace wire** (`OOPlannerWorkspace.tsx`):

| Lines | Behavior |
|-------|----------|
| 22–26 | Imports `FurnitureFabricLayer`, `isOpen3dFabricFurnitureEnabled` from `../canvas-fabric-stage` |
| 234–236 | Comment + `fabricFurnitureEnabled = isOpen3dFabricFurnitureEnabled()` |
| 237–243 | When ON → `feasibilityLayerVisibility` forces `furniture: false` (walls stay on Feasibility) |
| 971–1002 | Flag ON: FeasibilityCanvas + `FurnitureFabricLayer` overlay |
| 1004–1025 | Flag OFF: sole `FeasibilityCanvas` for furniture + walls |

**Unit coverage (existing — do not invent):**

- `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts` — exact `"1"`, near-miss strings, wrong keys, barrel
- `site/tests/unit/features/planner/open3d/hostWiringP01.test.ts` — workspace source contains flag wire; default OFF

**Not this flag:** `site/features/planner/lib/featureFlags.ts` is a separate product-flag registry (`planner2D`, `planner3D`, etc.). It does **not** read `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`.

---

## 2. Other `OPEN3D_*` symbols under `site/features/planner/open3d`

**rg result:** There is **exactly one** env-backed `OPEN3D_*` / `NEXT_PUBLIC_OPEN3D_*` flag in this tree: Fabric furniture above.

All other `OPEN3D_*` hits are **in-code constants** (not `process.env`), listed for anti-thrash so agents do not invent second env readers:

| Symbol | Kind | File | Role |
|--------|------|------|------|
| `OPEN3D_ORBIT_DEFAULT_ENABLED` | const `true` | `3d/orbitDefaults.ts` L7 | Product orbit default ON |
| `getOpen3dViewerControlProps()` | helper → `{ enableControls: true }` | `3d/orbitDefaults.ts` L13–14 | Forces orbit props on product Lazy3DViewer mount |
| `OPEN3D_CATALOG_RESULT_CAP` | number `24` | `catalog/catalogSearch.ts` L11 | Catalog search result cap |
| `OPEN3D_CATALOG_QUERY_KEY` | query key tuple | `catalog/catalogQuery.ts` L7 | React Query key |
| `OPEN3D_DEMO_CATALOG_ITEMS` | demo data array | `editor/demoCatalogItems.ts` L45 | Fallback catalog |
| `OPEN3D_SESSION_VERSION` | `"open3d-1"` | `persistence/open3dSession.ts` L4 | Session blob version |
| `OPEN3D_FURNITURE_BOQ_KIND` | `"open3d-furniture-boq-v1"` | `shared/export/projectFurnitureBoq.ts` L19 | BOQ envelope kind |
| `OPEN3D_FURNITURE_BOQ_GST_RATE` | GST rate const | same L20 | BOQ GST |
| `OPEN3D_FURNITURE_BOQ_PRICING_NOTE` | string | same L26 | BOQ pricing note |

**Adjacent env (not `OPEN3D_*` prefix, still in open3d tree):**

| Env | File | Role |
|-----|------|------|
| `NEXT_PUBLIC_SITE_URL` / `SITE_URL` | `catalog/catalogClient.ts` ~789–790 | Site base URL for catalog client |
| `CLOUDFLARE_ACCOUNT_ID` | `catalog/svg/svgPreviewAssets.ts` ~42 | SVG preview asset path (server-side) |

These are **not** planner 2D/3D engine enable flags.

---

## 3. Inventory conclusion (lock)

| Question | Answer |
|----------|--------|
| How many `NEXT_PUBLIC_OPEN3D_*` engine flags? | **1** — Fabric furniture |
| Enable semantics | String **`"1"` only** |
| Product default path | Fabric furniture **OFF** → FeasibilityCanvas sole interactive 2D furniture |
| Orbit “flag”? | **No env** — code constant + typed helper only |
| Second Fabric env reader? | **None** found under open3d |
| Re-open engines based on this inventory? | **No** — freeze / document only |

---

## 4. Cite map (absolute)

- `site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts`
- `site\features\planner\open3d\canvas-fabric-stage\index.ts`
- `site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`
- `site\features\planner\open3d\3d\orbitDefaults.ts`
