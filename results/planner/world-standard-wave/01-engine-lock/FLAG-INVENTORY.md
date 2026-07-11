# FLAG-INVENTORY — P02 engine lock (Fabric-sole leftover truth)

**Phase:** P02 / CP-02  
**Date:** 2026-07-11  
**Scope:** planner open3d + canvas-fabric-stage env readers  
**Authority:** live source — flag is **not** product host authority.

---

## 1. Leftover env flag (not host switch)

### `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`

| Field | Live truth |
|-------|------------|
| Env key constant | `OPEN3D_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE"` |
| Reader | `isOpen3dFabricFurnitureEnabled()` |
| Enable rule | **exact** `env[key] === "1"` only |
| Default | **OFF** — missing, `"true"`, `"yes"`, `"0"`, other → false |
| Source file | `site/features/planner/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Barrel re-export | `site/features/planner/canvas-fabric-stage/index.ts` |

**Live predicate:**

```ts
export const OPEN3D_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE" as const;

export function isOpen3dFabricFurnitureEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  return env[OPEN3D_FABRIC_FURNITURE_ENV] === "1";
}
```

### Workspace wire — **NONE**

| Check | Result |
|-------|--------|
| `OOPlannerWorkspace` imports flag | **No** |
| `OOPlannerWorkspace` calls `isOpen3dFabricFurnitureEnabled` | **No** |
| Flag selects Feasibility vs Fabric | **N/A — Fabric is sole host** |
| Product host when flag OFF | **Still Fabric** `PlannerCanvasStage` |

**Unit coverage:**

- `site/tests/unit/features/planner/canvas-fabric-stage/furnitureFabricMapper.test.ts` — exact `"1"`, near-miss strings, wrong keys, barrel
- `site/tests/unit/features/planner/open3d/hostWiringP01.test.ts` — workspace source **must not** contain flag wire; default path = Fabric stage

**Not this flag:** `site/features/planner/lib/featureFlags.ts` is a separate product-flag registry. It does **not** read `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`.

---

## 2. Other `OPEN3D_*` symbols under open3d (not env host flags)

**Exactly one** env-backed `NEXT_PUBLIC_OPEN3D_*` leftover exists (above). Other `OPEN3D_*` hits are **in-code constants**:

| Symbol | Kind | File | Role |
|--------|------|------|------|
| `OPEN3D_ORBIT_DEFAULT_ENABLED` | const `true` | `3d/orbitDefaults.ts` | Product orbit default ON |
| `getOpen3dViewerControlProps()` | helper → `{ enableControls: true }` | same | Forces orbit on product Lazy3DViewer |
| `OPEN3D_CATALOG_RESULT_CAP` | number | `catalog/catalogSearch.ts` | Catalog search cap |
| `OPEN3D_CATALOG_QUERY_KEY` | query key | `catalog/catalogQuery.ts` | React Query key |
| `OPEN3D_DEMO_CATALOG_ITEMS` | demo data | `editor/demoCatalogItems.ts` | Fallback catalog |
| `OPEN3D_SESSION_VERSION` | session version | `persistence/open3dSession.ts` | Session blob version |
| BOQ `OPEN3D_FURNITURE_BOQ_*` | export consts | `shared/export/projectFurnitureBoq.ts` | BOQ envelope |

**Adjacent env (not engine host flags):** `NEXT_PUBLIC_SITE_URL` / `SITE_URL`, `CLOUDFLARE_ACCOUNT_ID` in catalog helpers.

---

## 3. Inventory conclusion (lock)

| Question | Answer |
|----------|--------|
| How many `NEXT_PUBLIC_OPEN3D_*` engine flags? | **1 leftover** — Fabric furniture env (historical spike) |
| Does it switch product 2D host? | **No** |
| Product 2D host | Fabric `PlannerCanvasStage` always |
| Orbit “flag”? | **No env** — code constant + typed helper only |
| Re-open engines based on this inventory? | **No** |

---

## 4. Cite map

- `site\features\planner\canvas-fabric-stage\fabricFurnitureFlag.ts`
- `site\features\planner\canvas-fabric-stage\index.ts`
- `site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`
- `site\features\planner\open3d\3d\orbitDefaults.ts`
- `site\tests\unit\features\planner\open3d\hostWiringP01.test.ts`
