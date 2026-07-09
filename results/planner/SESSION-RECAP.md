# Session recap — hard path, asset engine, agents

**Repo:** `D:\OandO07072026`  
**Remote:** `https://github.com/pglcarpets/Codex07072026.git`  
**Branch:** `main` (work only here — **no git worktrees**)  
**Document date:** 2026-07-09  
**HEAD at time of writing:** `e9edc31` (`fix(planner): skill-wave harden — pipelineCore types, skipCompile, GLB policy`)  
**Audience:** you (product owner) after accidental cancel / session break  

This file is the **single handoff** for everything documented in this multi-session hard-path effort. Update HEAD when you pull.

---

## 1. One-line status

**Hard path is real and on `main`:** SVG compile authority ordered, modular mesh place→2D/3D, GLB policy + partial G8 load, crypto entity IDs, fail-closed Puck publish. **SSR cloud is not required yet.** Keys stay in `.env.local`. Next: browser smokes + optional 2c/32G SSR when you want a shared URL.

---

## 2. Locked product decisions (do not re-litigate without explicit ask)

| Decision | Choice |
|----------|--------|
| 2D engine | **Fabric.js v7 full stage** (no Canvas+Konva hybrid). Live still **FeasibilityCanvas** until cutover; Fabric furniture = **flag OFF** default |
| 3D engine | **Three + R3F** for planner; `@google/model-viewer` admin/single-asset only |
| Furniture | **System-generated only** (modular/parametric + SVG extrude). **Designer static GLB removed** |
| Entity IDs | **`crypto.randomUUID()` only** via `newEntityId()` — no `plc-` / Math.random fallbacks |
| Icons | Phosphor-only (site) |
| Visual regression | Playwright screenshots (Percy removed) |
| Monitoring | Sentry **stays removed** until intentional re-add |
| UI chrome | Freeze via MODULE-UI-CONTRACT / scheme freeze — hard path must not redesign chrome |
| Worktrees | **Never** — only `D:\OandO07072026` |
| Commits | User authorized baselines; work is **already on `main` / origin** |

---

## 3. Plan lanes (authority)

1. **Plan A (product):** `Plans/01-execution/core/`  
   - `00A-START.md` · `01A-PHASE-2A.md` · `02B-PHASE-2B-2C.md` · `03C-HANDOVER.md` · `INDEX.md` · `UI-SCHEME-FREEZE.md`
2. **Working checklist:** root `task.md` (hard-path vertical slice)
3. **Evidence:** `results/planner/**` (run.json + raw logs)
4. **Recovery track** (`Plans/02-recovery/`) is secondary — you chose Plan A / hard path over recovery 00

**Sequencing (master plan):** 2A gates → 2B → 2C. Vertical hard-path slices advanced 2B/2C **pieces** before all 2A gates; do not claim full 2C done.

---

## 4. What was built (product spine)

### 4.1 Asset engine (ordered skeletons)

**Home:** `site/features/planner/asset-engine/`  
**Registry:** `stages.ts` + honest `README.md`  
**Barrel:** `index.ts`

#### SVG stages (S0–S7)

| Stage | Status | Entry |
|-------|--------|--------|
| S0 Validate Zod | partial | parseAdminPayload / svgTypes |
| S1 Normalize | **implemented** | `svg/normalizeDescriptorForPipeline.ts` (depth→height, fixed→union/difference) |
| S2 Compile | **implemented (publish)** | `compileSvgForPublish` → pipelineCore; **V1 = reference-only** |
| S3 Sanitize/optimise | partial | dual stacks still exist; publish uses pipelineCore path |
| S4 Write public SVG | **implemented** | `generate-svg.mjs` / `runSvgPipeline` |
| S5 PNG thumbs | stub | URL only on publish |
| S6 Persist | **implemented** | disk `block-descriptors/`; Supabase is 2C |
| S7 Catalog consume | partial | preview URLs |

**Publish order (fail-closed):**  
parse → **`compileSvgForPublish` (S1–S3)** → **`runSvgPipeline` with `skipCompile` + precompiled SVG (S4 only)** → **persist (S6)**

**Dual compiler honesty:**  
- Live publish: `pipelineCore` + S1 normalize  
- V1 `svgCompiler.server.ts`: tests/artifacts only (`compileAuthority = "v1-reference-only"`)

#### Mesh / GLB stages (G0–G8)

| Stage | Status | Entry |
|-------|--------|--------|
| G0 Policy | policy-only | `lib/glbAssetPolicy.ts` |
| G1 Options | partial (cabinet-v0) | modular options + place stamp `geometryMode` |
| G2 2D footprint | implemented | `resolveFurniture2DFootprint` |
| G3 Runtime mesh | partial | modular group + ParametricBuilder box |
| G4 Part plan | implemented | `modularCabinetV0GlbExport.ts` |
| G5 Binary GLB | implemented (in-memory) | `mesh/exportModularGlbBinary.ts` |
| G6 Validate GLB | implemented | `validateGlbAsset` after G5 |
| G7 Extrude SVG | partial | pure `extrudeSvgPlan` + admin `GlbExtruderPreview` |
| G8 Viewer load GLB | **partial** | `loadGeneratedGlbObject` + async replace in `ThreeViewerInner` |

**Defaults:** place stays **procedural** (no auto GLB). Stamp URL only via helpers when you want G8 path.

### 4.2 Open3d / planner

| Piece | Path / note |
|-------|-------------|
| Document → scene nodes | `buildOpen3dSceneNodes.ts` |
| Mesh factory | `createSceneObjectFromNode.ts` (modular / parametric-box / wall box) |
| 3D viewer | `ThreeViewerInner.tsx` — procedural first; G8 async GLB if policy allows |
| Place | `placementAction.ts` — `newEntityId()`; modular stamps `geometryMode` |
| Demo modular SKU | `demoCatalogItems.ts` — `cabinet-v0` |
| 2D live | `FeasibilityCanvas.tsx` (not Fabric) |
| Fabric proof | `canvas-fabric-stage/` — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` |
| Entity IDs | `lib/newEntityId.ts` everywhere for entities |

### 4.3 Admin SVG

| Piece | Note |
|-------|------|
| Puck mount | Live in AdminSvgEditorEditView |
| Publish | `publishDescriptorWithPipeline` fail-closed + skipCompile S4 |
| CLI | `pnpm run scripts:generate-svg` / `scripts:smoke:svg` / `scripts:smoke:svg:batch` |
| Public output | `site/public/svg-catalog/{slug}.svg` |

### 4.4 Policies

- **No designer static GLB** — only empty / `blob:` / path under `catalog-assets/generated/`  
- Policy checks **pathname only** (query/hash spoof rejected) — `glbAssetPolicy.ts`  
- Crypto-only entity IDs; throw if `crypto.randomUUID` missing  

---

## 5. Key commits (baseline trail on `main`)

Newest first (hard-path era):

| SHA | Subject |
|-----|---------|
| `e9edc31` | skill-wave harden: pipelineCore types, skipCompile, GLB policy, a11y/review evidence |
| `ba2e0aa` | ParametricBuilder box mesh; SVG fixture batch script |
| `320f0b1` | modular place stamp helpers; G8 round-trip; SVG CLI batch 8/8 |
| `64d82b1` | superpowers wave: SVG authority, G8 load, stamp |
| `93bd27d` | order SVG + mesh/GLB skeletons |
| `361d296` | document view continuity; honest 02B checkmarks |
| `240e88f` | save/reload continuity + entity UUID asserts |
| `a9871e8` | modular GLB plan + dead canvas hook note |
| `27d918b` | Puck SVG publish fail-closed before persist |
| `78ea2ba` | Fabric furniture overlay transform sync |
| `2b04379` | modular 2D footprint, Fabric flag stage, SVG CLI smoke, docs truth |
| `06bf8ac` | modular place→3D, canvas geometry tests, crypto residual |
| `27c142f` | route all entity ids through newEntityId |
| `e367c2f` | entity ids crypto.randomUUID only (earlier slice) |
| `85f8f8c` | remove designer static GLB |
| `5d8d0c4` | UI scheme freeze |
| `707d2fa` | hard-path mega: SVG/3D spine, Phosphor, no Sentry, Fabric plan lock |

---

## 6. Evidence directories (`results/planner/`)

| Dir | What |
|-----|------|
| `asset-engine-skeleton/` | Stages + S1 + G5 first landing |
| `svg-authority/` · `svg-authority-wire/` | Publish authority + compile-before-S4 |
| `svg-cli-smoke/` · `svg-cli-batch/` | CLI fixtures / all seeds |
| `modular-place/` · `modular-place-smoke/` · `modular-place-stamp/` | Place → mesh / stamp |
| `modular-glb-plan/` | G4 plan-only |
| `g8-viewer-glb/` · `g8-roundtrip/` | G8 partial + continuity |
| `glb-stamp/` | stampFurnitureGeneratedGlb |
| `extrude-plan/` | G7 pure plan |
| `parametric-box-wire/` | ParametricBuilder in scene factory |
| `canvas-geometry/` | 02B.1 pick/snap/polygon |
| `crypto-ids/` · `crypto-ids-residual/` | UUID policy |
| `puck-publish-fail-closed/` | Publish fail-closed |
| `save-reload-continuity/` · `document-view-continuity/` | Document round-trips |
| `fabric-stage-slice/` | Fabric flag furniture stage |
| `wave-superpowers/` · `verify-wave/` · `harden-wave/` | Agent waves |
| `code-review-wave/REVIEW.md` | Formal review (Ready to proceed) |
| `systematic-debug/` | pipelineCore polygon types root cause |
| `a11y-open3d/REPORT.md` | Live Chrome a11y on `/planner/open3d` |
| `finishing-branch/STATUS.md` | Already-on-main options |
| `SESSION-RECAP.md` | **This file** |

---

## 7. How to run (local)

```powershell
cd D:\OandO07072026\site
pnpm install          # if needed
pnpm dev              # uses .env.local (keys already there)
```

**Smokes:**
```powershell
pnpm run scripts:smoke:svg          # single fixture
pnpm run scripts:smoke:svg:batch    # all generate-svg fixtures only
```

**Targeted tests:**
```powershell
npx vitest run tests/unit/features/planner/asset-engine
npx vitest run tests/unit/features/planner/open3d/g8RoundTrip.test.ts
npx vitest run tests/unit/features/planner/open3d/modularPlaceMesh.test.ts
```

**Fabric furniture proof (optional):**  
set `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` in `.env.local`, restart dev.

**Browser you should do:**  
`/planner/open3d` → place **cabinet-v0** → 2D + 3D. Flag Fabric only if testing that overlay.

---

## 8. SSR cloud (your question — documented call)

| Item | Call |
|------|------|
| When | **Later** — not blocking hard path |
| Size | **2 CPU / 32 GB** (not 4/64 yet) |
| Keys | Already in `.env.local` — copy same **names** to server env when you provision |
| Why later | Open3d is browser-heavy; SVG/GLB compile is fine local; multi-user Supabase persist not full authority yet |

**When you do SSR:** clone → install → paste env → `pnpm build` → `pnpm start` → reverse proxy HTTPS. Upsize to 4c/64G only with real load.

---

## 9. Code review summary (skill wave)

**Assessment:** Ready to proceed (no Critical).

**Important (tracked / partly fixed in `e9edc31`):**
- GLB marker spoof via query → **fixed** (path-only)
- Double compile on publish → **fixed** (skipCompile)
- Path-only stamp can 404 on G8 if file never uploaded → **still residual** (honest)
- README G8 status → **synced to partial**

Full write-up: `results/planner/code-review-wave/REVIEW.md`

---

## 10. A11y open3d (live Chrome)

**Not a clean pass.** Report: `results/planner/a11y-open3d/REPORT.md`

| Finding | Severity |
|---------|----------|
| Nested / multiple `main` landmarks | Important |
| Hydration mismatch `data-viewport` desktop SSR vs tablet client | Important |
| Search accessible name doubled | Minor |
| Console: form field without label | Important |
| Canvas named + keyshortcuts + live status | Good |

---

## 11. Open residuals (honest backlog)

1. **Admin UI publish browser smoke** (Puck end-to-end)  
2. **Upload modular G5 bytes** to storage on publish  
3. **G8 browser smoke** with real file + stamped `generatedGlbUrl`  
4. **Fabric full cutover** (walls/rooms/tools) — not just furniture flag  
5. **Fabric flag ON browser smoke**  
6. **A11y fixes** (nested main, hydration viewport, orphan label)  
7. **2C Supabase** descriptor/asset migration  
8. **SSR 2c/32G** when shared URL needed  
9. **PNG thumbs (S5)** on publish  
10. Optional: tag baseline e.g. `asset-engine-hardpath-e9edc31`  

**Not open as ambiguity:** publish compile authority (decided: pipelineCore+normalize). V1 not deleted but not live publish.

---

## 12. Finishing options (already on main)

There is **no feature branch** to merge. Choose:

1. **Continue iterating on main** (recommended)  
2. **Tag release baseline** (ask agent: “tag e9edc31”)  
3. **PR summary doc only** (no branch)  
4. **Pause / handoff** — use this file  

---

## 13. Agent / skill process you authorized

- Superpowers + **up to 6 agents** (later: no upper limit)  
- Skills used: using-superpowers, dispatching-parallel-agents, code-review, systematic-debugging, chrome-devtools, a11y-debugging, finishing-a-development-branch, verification  
- Full authority while away: take calls, commit, push  
- Rules: no worktrees; no `any`; no skipped silent passes; evidence in `results/`  

---

## 14. Critical file map (quick open)

```
site/features/planner/asset-engine/          # ordered SVG + mesh/GLB skeletons
site/features/planner/asset-engine/stages.ts
site/features/planner/asset-engine/README.md
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
task.md
Plans/01-execution/core/02B-PHASE-2B-2C.md
Failures.md                                 # honesty block 2026-07-09
results/planner/SESSION-RECAP.md            # this file
```

---

## 15. If you only read one paragraph

Pull `main` at `e9edc31`. Hard path skeletons for **SVG making** and **mesh/GLB making** are ordered under `asset-engine/`, tested, and documented with honest partials. Place cabinet-v0 locally for product feel. Put SSR off until you need a shared URL (2c/32G). Keys already in `.env.local`. Residuals: browser smokes, GLB upload, Fabric cutover, a11y nested main/hydration, Supabase 2C. Full evidence under `results/planner/`.

---

*Generated so a cancelled chat does not lose the trail. Prefer updating this file or `task.md` when the next wave lands.*
