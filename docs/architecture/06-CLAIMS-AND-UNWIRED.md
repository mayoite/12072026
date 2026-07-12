# False claims and unwired paths

**Audited:** 2026-07-12 against live code at `HEAD` plus the current dirty Admin/plan slice.

This register separates three things: a false statement, code that exists but is not wired into the live product, and a deliberate boundary. “A file exists” is not proof that a buyer can use it.

## False or stale claims corrected

| Claim | Repo truth | Correction |
|-------|------------|------------|
| Admin SVG still uses a JSON editor or needs a full Puck mount | `/admin/svg-editor/[id]` mounts `SvgEditorForm` with `LiveCompiledSvgPreview`; no admin Puck mount | Architecture, Admin plans, metadata, and nav now say no-code form. Puck remains portal/legacy only. |
| Planner P03–P07 are PASS “on tip” | Their proof packs are from earlier commits. The current checkout was not re-run as a Planner gate | Cards and checkpoints now say **REPROVE** with landed candidates. |
| Live Fabric still paints furniture as one plain rectangle | `PlannerFabricStage` uses `createFabricFurnitureBlock`; cabinet multiprim code and visual candidate evidence exist | P01/P05 now describe the landed raise and require final visual re-proof. |
| Cabinet-v0 has no toe | `modularCabinetV0.ts` creates `toe → carcass → door(s)` and GLB export mirrors shared constants | P08 now says implementation landed; visual/evidence gate remains open. |
| Every Site card is open | P02 is a bounded PASS slice; P01 and site residuals remain open | `plan/Site/CHECKLIST.md` distinguishes slice PASS from site completion. |
| Production admin may honor `DEV_AUTH_BYPASS=1` | Production proof recorded `flagSet:true`, `bypassEnabled:false`; anonymous page/API access was rejected | Admin A3 is DONE. Security SEC3 stays open for broader surfaces. |
| Publish still compiles through `svgCompiler.server.ts` or a child-process CLI | Publish uses `compileSvgForPublish`/`runSvgCompileStages`, then S4-only `runSvgPipeline`, then descriptor persist | Data-flow and SVG current-state docs now name the actual path. |

## Unwired or partial product paths

| Path | Truth | User impact | Owner |
|------|-------|-------------|-------|
| `features/planner/project/ai/sketchToPlan.ts` | Explicit placeholder. It creates a default rectangle and reports API not connected. `isSketchToPlanAvailable()` returns false. It is not the live `/api/planner/sketch-to-plan` implementation. | Any claim that this module performs AI conversion is false. | Planner P01 inventory |
| `features/planner/store/plannerStore.ts#saveAsCopy` | Returns `Not implemented`; no live caller was found outside tests/types. | “Save as copy” is not a product capability through this facade. | Planner P01 inventory |
| `features/planner/lib/documentBridge.ts#loadPlannerDocumentIntoEditor` | Deprecated and always returns false. | This bridge cannot restore a document into Fabric. Live restore must use the actual workspace persistence path. | Planner P01/P06 |
| `features/planner/project/ai/advisorClient.ts#resolveAdvisorProviderChain` | Returns a hard-coded placeholder order. It does not resolve runtime provider configuration. | Provider failover/config claims must come from the server route, not this helper. | Planner P01 inventory |
| `features/planner/project/catalog/svg/svgPlanSymbolCache.ts` | No live import was found. Its comment says published SVG is loaded for plan draw, but live plan paint is Block2D → Fabric. | Do not cite this file as live SVG plan rendering. | Planner P05 |
| `features/planner/asset-engine/stages.ts` S7 text | Names `svgPlanSymbolCache + plan-canvas SVG draw`, but that cache is unwired. | S7 wording overstates live plan consumption. Catalog preview URL and Fabric paint are separate. | Admin A2 / Planner P05 |
| Asset-engine PNG thumbs | `asset-engine/README.md` labels S5 stub; publish returns a URL but does not generate a PNG thumb. | A file/URL claim is not thumbnail generation. | Admin A4 |
| Automatic generated-GLB publish | Asset-engine docs say Supabase/CDN auto-publish is unwired. Admin has an environment-dependent browser upload helper, not a fail-closed server publish pipeline. | Generated GLB durability is not guaranteed by SVG publish. | Admin A4 / Planner P08 |
| Open3d 3D external GLB use | Asset-engine docs say open3d does not load descriptor `glbUrl`/`meshUrl`; it rebuilds procedural mesh. | Do not claim admin-uploaded GLB is what the Planner 3D view displays. | Planner P08 |
| Puck editor roundtrip adapters | `getPuckEditorData` and `puckEditorDataToDescriptorInput` remain, but admin routes do not call them. | They are compatibility/dead-weight candidates, not current authoring behavior. | Admin A4 |
| No-code SVG quality features | Undo/redo with named operations landed in A4.0 (commit `a48a8400`). No template-first novice flow, draft recovery, unsaved-exit guard, dedicated a11y E2E, responsive E2E, or preview-latency gate was found. | The A4.0 foundation is landed and green, but the full visual editor is unproven. | Admin A4 |
| W4 exact browser pose continuity | Browser evidence checks count/orbit state; exact IDs/pose are unit-only. | W4 cannot claim end-to-end pose identity yet. | Planner P04 |
| Planner final handover | CP-10 remains open. Current Planner proof packs do not share this checkout state. | Product ship remains open. | Planner P10 |

## Intentional boundaries, not bugs

- Admin `/svg-catalog/{slug}.svg` is publish/preview authority. It is not the live Fabric plan-draw path.
- Live plan symbols are Block2D/multiprim objects painted by Fabric.
- Puck is still valid for portal rendering. It is not the current admin editor.
- Local browser save is valid when labeled local. It is not cloud persistence.

## Closure rule

Remove a row only after the live route is wired, a buyer-visible browser test passes, and the owning plan links fresh evidence. Otherwise update the row; do not delete the uncomfortable fact.
