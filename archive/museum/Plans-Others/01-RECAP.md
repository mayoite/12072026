# Hard-path recap (owner)

**Repo:** `D:\OandO07072026` · **Branch:** `main` · **No worktrees**  
**Document date:** 2026-07-09  
**HEAD at pack time:** `258c8ee` (docs session recap) · hard-path code baseline `e9edc31`  
**Agent detail dump (not this doc):** `results/planner/SESSION-RECAP.md`

---

## 1. One-line status

**Not product-done.** Hard-path *spine* is on `main` (SVG authority ordered, modular place→2D/3D, GLB policy + partial viewer load, crypto entity IDs, fail-closed Puck publish) — but browser E2E, real GLB upload/load, Fabric cutover, and a11y are still open. Unit/CLI evidence exists; signed-off product quality does not.

---

## 2. Locked decisions

| Decision | Choice |
|----------|--------|
| 2D engine | **Fabric.js v7 full stage** (no Canvas+Konva hybrid). Live canvas still **FeasibilityCanvas**; Fabric furniture = **flag OFF** default |
| 3D engine | **Three + R3F** for planner; `@google/model-viewer` admin/single-asset only |
| Furniture | **System-generated only** (modular/parametric + SVG extrude). **Designer static GLB removed** |
| Entity IDs | **`crypto.randomUUID()` only** via `newEntityId()` — no `plc-` / Math.random |
| SVG publish compile | **`pipelineCore` + S1 normalize** via `compileSvgForPublish`. V1 = reference-only (not deleted, not on publish wire) |
| Icons | Phosphor-only (site) |
| Visual regression | Playwright screenshots (Percy removed) |
| Monitoring | Sentry **stays removed** until intentional re-add |
| UI chrome | Freeze — hard path must not redesign chrome |
| Worktrees | **Never** — only this checkout |
| SSR cloud | **Later** — 2 CPU / 32 GB when you need a shared URL; keys already in `.env.local` |
| Commits | Baselines already on `main` / origin; agents do not commit without your ask |

Do not re-litigate these without an explicit owner decision.

---

## 3. What works vs skeleton

### Works (real, tested unit/CLI)

| Piece | Reality |
|-------|---------|
| Entity IDs | Crypto-only everywhere for entities |
| Modular place → 3D | `cabinet-v0` → multi-part procedural mesh |
| Modular 2D footprint | `resolveFurniture2DFootprint` |
| Document → scene nodes | Pure adapter + tests |
| 3D viewer rebuild | Walls + furniture from project entity ids |
| SVG CLI pipeline | Fixtures → `public/svg-catalog/*.svg` |
| Publish authority (code path) | Fail-closed: compile → S4 with `skipCompile` → persist |
| S1 normalize | BlockDescriptor depth/fixed → pipeline IR |
| G4 / G5 / G6 | Plan + in-memory GLB binary + validate |
| GLB policy | Pathname-only; empty / `blob:` / `catalog-assets/generated/` |
| Save/reload continuity | Unit envelope + project JSON |
| Fabric furniture stage | Flag OFF; pan/zoom sync via transform snapshot |

### Skeleton / partial / not product

| Piece | Reality |
|-------|---------|
| Asset-engine stages | Ordered S0–S7 / G0–G8 registry — many partial or stub |
| S5 PNG thumbs | Stub (URL only) |
| G7 extrude SVG | Pure plan + admin island; not full product path |
| G8 viewer GLB | Async load landed; **no upload on publish**, **no browser smoke** |
| Place default | Still **procedural** — not auto-GLB |
| Admin publish | Code fail-closed; **no signed-off browser E2E** |
| Live 2D | Still FeasibilityCanvas — **not** Fabric full cutover |
| Fabric flag ON | No browser smoke |
| Supabase 2C | Disk `block-descriptors/` only |
| A11y open3d | Live report **not clean** (nested main, hydration) |
| SSR | Not required yet |

**Plan honesty:** Vertical hard-path advanced 2B/2C *pieces* before all 2A gates. Do not claim full 2B/2C done. Checklist: root `task.md`. Live plan: `Plans/trustdata/`.

---

## 4. Commit trail (last 15)

Newest first (`git log -15 --oneline`, hard-path era):

| SHA | Subject |
|-----|---------|
| `258c8ee` | docs(planner): full hard-path session recap for handoff |
| `e9edc31` | fix(planner): skill-wave harden — pipelineCore types, skipCompile, GLB policy |
| `ba2e0aa` | fix(planner): parametric box mesh via ParametricBuilder; SVG fixture batch |
| `320f0b1` | feat(asset-engine): modular place stamp helpers + G8 round-trip + SVG batch |
| `64d82b1` | feat(asset-engine): superpowers wave — SVG authority, G8 GLB load, stamp |
| `93bd27d` | feat(asset-engine): order SVG + mesh/GLB skeletons without shortcuts |
| `361d296` | test(planner): document view continuity; honest 02B plan progress |
| `240e88f` | test(planner): save/reload continuity and entity UUID asserts |
| `a9871e8` | feat(planner): modular GLB export plan + document dead canvas hook |
| `27d918b` | fix(admin): Puck SVG publish fail-closed before persist |
| `78ea2ba` | fix(planner): sync Fabric furniture overlay to canvas transform |
| `2b04379` | feat(planner): modular 2D footprint, Fabric flag stage, SVG CLI smoke |
| `06bf8ac` | feat(planner): modular place→3D, canvas geometry tests, crypto residual |
| `27c142f` | fix(planner): route all entity ids through newEntityId (crypto only) |
| `e367c2f` | fix(planner): entity ids use crypto.randomUUID only |

Earlier baseline landmarks (beyond this 15): `85f8f8c` remove designer static GLB · `5d8d0c4` UI scheme freeze · `707d2fa` hard-path mega spine.

---

## 5. File map (short)

```
site/features/planner/asset-engine/                 # SVG + mesh/GLB stage registry
site/features/planner/asset-engine/stages.ts
site/scripts/generate-svg.mjs
site/scripts/generate-svg/pipelineCore.ts
site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts
site/features/planner/open3d/catalog/modularCabinetV0.ts
site/features/planner/open3d/catalog/placementAction.ts
site/features/planner/open3d/3d/createSceneObjectFromNode.ts
site/features/planner/open3d/3d/ThreeViewerInner.tsx
site/features/planner/open3d/3d/loadGeneratedGlbObject.ts
site/features/planner/lib/glbAssetPolicy.ts
site/features/planner/lib/newEntityId.ts
task.md                                             # working checklist
Plans/trustdata/                                    # live plan authority
results/planner/                                    # evidence (not owner prose)
Failures.md                                         # honesty log
```

**Local feel check:** `cd site` → `pnpm dev` → `/planner/open3d` → place **cabinet-v0** → confirm 2D + 3D. SVG smokes: `pnpm run scripts:smoke:svg` / `scripts:smoke:svg:batch`.

---

## 6. What’s still open

→ **[00-PENDING.md](./00-PENDING.md)** — P0 kill-paths first (admin publish browser E2E, G5→storage→G8 Chrome load, a11y nested main/hydration, honest mesh quality bar). SSR only when you need a shared URL.

---

*Owner brief, not agent log. Update when the next kill-path lands; keep residual truth in `00-PENDING.md`.*
