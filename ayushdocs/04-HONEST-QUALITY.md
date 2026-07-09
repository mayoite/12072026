# Honest quality bar

**Verdict:** Hard path is a **real spine**, not a finished product. Agree with “not up to the mark” for ship-quality asset engine.

---

## Expectation of this work

| Expectation | Meaning |
|-------------|---------|
| **Skeletons ordered** | SVG S0–S7 and mesh G0–G8 named, with honest status |
| **No lying** | Dual compilers, G8 partial, box mesh called out |
| **Unit + CLI evidence** | Compiles, place modular, fail-closed publish order |
| **P0.1 now** | Real browser E2E for admin SVG publish under **dev auth bypass** |
| **Not expected yet** | Supabase multi-tenant, Fabric full cutover, “good” cabinetry mesh, public SSR |

---

## Up to the mark vs not

| Area | Up to mark? | Note |
|------|-------------|------|
| Entity IDs crypto-only | Yes | |
| No designer static GLB policy | Yes | |
| SVG S1 normalize + publish authority | Yes | |
| P0.1 admin publish E2E (dev bypass) | **Yes (just completed)** | Screenshots + API 200 |
| Modular place → 2D/3D boxes | Partial | Stacked boxes, not product mesh |
| G8 load real GLB in Chrome | **No** | P0.2 |
| Fabric full 2D | **No** | Flag proof only |
| Production `next build` clean | **No** | `/contact` createContext — separate blocker |
| A11y open3d | **No** | P0.3 only nested main + hydration |

---

## Integration left (packages · routes · skeleton only)

### Packages (already in tree — no new stack required for P0)

| Package / area | Status for hard path |
|----------------|----------------------|
| `next` | Used; **build gate broken** on `/contact` |
| `fabric` | Installed; live 2D still FeasibilityCanvas |
| `three` / R3F | Live open3d |
| `svgo` / polygon-clipping | Live SVG pipeline |
| `@gltf-transform/core` | Validate only |
| `playwright` | E2E + screenshots |
| Supabase clients | Auth/real data; bypass for local admin |

**No new packages required** for P0.2 if upload uses existing `uploadAsset` / Supabase storage helpers.

### Routes (integration remaining)

| Route | Integrated? | Gap |
|-------|-------------|-----|
| `/admin/svg-editor/*` | Yes with **DEV_AUTH_BYPASS** | Real admin login still for prod |
| `POST /api/admin/svg-editor` | Yes | CSRF skipped only under bypass |
| `/planner/open3d` | Yes | G8 product load pending |
| `/portal/svg-catalog` | Partial | Catalog consume |
| Cloud SSR host | **Not set up** | OPS later |

### Skeleton vs full integration

| Stage | Skeleton done? | Full product integration? |
|-------|----------------|---------------------------|
| SVG S0–S6 | Mostly | Browser E2E **yes (P0.1)**; PNG thumbs no |
| Mesh G0–G6 | Yes (cabinet-v0) | Storage upload + G8 browser **no (P0.2)** |
| G7 extrude | Plan + admin widget | Not planner place path |
| G8 | Unit + async loader | Real file + Chrome **no** |
| Fabric 2B | Flag furniture | Full cutover **no** |
| 2C Supabase | Disk only | Migrate **no** |

**Rough estimate:** ~**40–50%** of “asset engine integration” if counting skeletons + unit + P0.1; ~**20–30%** if counting “user can publish and place good mesh/GLB in production without bypass.”

---

## Kill-path order (strict)

1. ~~P0.1 Admin publish E2E + dev bypass~~ **DONE**  
2. **P0.2** GLB upload → stamp → open3d load  
3. **P0.3** A11y P0 only (nested main + hydration)  
4. P0.4 mesh quality bar + visual smoke  
