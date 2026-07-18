# Admin — reality and stack

**Status:** policy locked with owner  
**Pair:** `CHECKLIST.md` Part C · `IMPLEMENTATION-PLAN.md` · `FEATURES.md` · `../../Agents.md`

**Business reality:** orders need **exact** configs; photos in `public/images` change per client and cannot close alone; cannot staff five designers per permutation. Build **fields → drawer → SVG** and grow drawers as jobs need them.

---

## Market reality

There is **no free** package that does: *fields in → pro Oando furniture plan SVG out*.

| Class | Examples | Creates SVG? | Many fields? | Use here |
|-------|----------|--------------|--------------|----------|
| **Pens** | **Maker.js (in repo)**, Paper.js, raw paths | Yes | Only if **you** write drawers | **Maker = only geometry pen** |
| **Static packs** | CAD symbol packs, commissioned vectors | Pre-drawn | No auto matrix | Quality reference / license check |
| **Full apps** | react-planner, Sweet Home 3D, Archilogic SDKs | Whole product | N/A | **Skip** — duplicates Planner |
| **Paid** | ~$80k + $30k/yr configurators | Yes | Yes | Out of budget |

**Implication:** Eng writes **type drawers** + Zod schemas. Client fills **forms only**. No free engine invents furniture topology.

```text
[Admin form: fields mm]
        |
        v
[Eng drawer: Zod → Maker.js recipe → multipath SVG]
        |
        v
[sanitise / pipeline → publish (disk + dual-write DB/R2 when ready)]
        |
        v
[Fabric places published SVG] → BOQ name/SKU

Live durable intent: Supabase + R2. Owner blockers none.
```

---

## Locked stack (do not reopen)

| Layer | Choice | Link |
|-------|--------|------|
| **Engine pen** | Maker.js **only** | https://github.com/microsoft/maker.js · npm `makerjs` `^0.19.2` |
| **Brain** | Eng type drawers (schema + draw) | this monorepo |
| **Client** | Forms only (no code) | Admin parametric route |
| **Canvas** | Fabric (place/zoom) | https://github.com/fabricjs/fabric.js · npm `fabric` `7.4.0` |
| **Chrome packages** | **Same as Planner:** `dockview-react`, `react-aria-components`, `@phosphor-icons/react` | Shared toolbars / dockable panels / icons — **not** Fabric place tools |
| **Draft studio** | Excalidraw (freehand draw only) | Own sketch tools inside freehand stage; freehand outer shell = Dockview; parametric shell = Planner WorkspaceShell + CanvasToolRail |
| **AI** | Field draft only after C2 (**C-AI**). Never geometry | CHECKLIST Part C |
| **Monorepo** | Product + planner import paths | https://github.com/mayoite/12072026 |

**One line:** Maker.js. Build drawers on it. Don't switch pens. AI may suggest fields after C2 — never paths.

---

## Engine matrix (roles)

| Role | Package / path | Authority for | Not authority for |
|------|----------------|---------------|-------------------|
| Interactive 2D place | Fabric · `features/planner/canvas/*` | Zoom, pan, place published SVG | Generating brand geometry |
| 3D | Three + R3F | 3D view from same document | Plan SVG craft |
| Admin freehand draft | Excalidraw · `ExcalidrawClient.tsx` | Sketch tools only | Publish truth for parametric |
| Admin freehand shell | **dockview-react** · `AdminSvgDockHost` | Freehand Preview \| Studio \| Details | Parametric layout (different mode) |
| Admin parametric shell | Planner **WorkspaceShell** + **CanvasToolRail** (same packages as Planner chrome) | Plan-left + form-right authoring chrome | Fabric place canvas; Dockview host |
| Admin / Planner chrome packages | **dockview-react · react-aria · phosphor** (same npm) | Shared shell language | Geometry pens; Fabric place tools |
| Geometry pen | Maker.js · `drawLinearDesk.ts` · `makerJsRecipes.ts` · `makerJsToPath.ts` | Multipath plan SVG (form/CLI/publish) | Client freehand; AI paths |
| Template residual | `drawLinearDeskFromTemplate.ts` | Deprecated comparison only | Form/CLI/publish pen |
| Publish compile | `compileSvgForPublish` · `normalizeDescriptorForPipeline` · `pipelineCore` | S1–S3 sanitise | Client engines as release |
| Disk write | `svgPipelineRunner` S4 · `persistBlockDescriptor` | Live SVG + descriptors | DB sole authority (until cutover) |
| Units | `features/planner/model/units.ts` | mm store; mm/cm display | Parallel cm+mm that drift |
| Isolation | `catalogWriteIsolation.ts` | Block test writes to canonical catalog | — |

### Chrome honesty (Admin SVG today vs target)

**Two live layout modes** (same package family; not two geometry pens):

| Mode | Route | Live shell | Live stage content |
|------|-------|------------|--------------------|
| Freehand | `/admin/svg-editor/[id]` | **Dockview** `AdminSvgDockHost` — Preview \| Studio \| Details | Excalidraw draw tools **inside** stage only |
| Parametric | `/admin/svg-editor/parametric` | Planner **WorkspaceShell** + **CanvasToolRail** — plan left, form right (`data-stage-layout="planner-workspace-shell"`) | Maker plan SVG + form fields; **not** Dockview host |

| Surface | Target | Live today |
|---------|--------|------------|
| Icons | Phosphor | **In use** on freehand + parametric chrome (prefer Phosphor only for shell icons) |
| Accessible controls | React Aria | **Partial** — freehand TopBar (`Toolbar` / `ToggleButton`); parametric publish confirm still custom dialog (promote to Aria) |
| Freehand dock panels | **dockview-react** (same as Planner dock) | **In use** — `AdminSvgDockHost` only on freehand shell |
| Parametric layout | Planner workspace chrome package | **In use** — `WorkspaceShell` + `CanvasToolRail` (pinned); CSS under `locked/chrome` + admin parametric styles — **not** `AdminSvgDockHost` |
| Sketch tools | Excalidraw internal toolbar | Freehand stage only (expected) |
| Fabric place canvas | Planner only | **Never** imported under `features/admin` |

**Meaning:** reuse the **same chrome packages** as Planner (dockview / Aria / Phosphor / WorkspaceShell / CanvasToolRail). Do **not** mount Fabric place/zoom canvas into Admin. Do **not** invent a third dock library. Freehand and parametric may use **different layout modes** as long as packages stay singular.

---

## Code reality (parametric — re-verify)

| Surface | Truth today |
|---------|-------------|
| Form preview | `LinearDeskParametricForm` → Maker `renderLinearDeskSvg` → `drawLinearDesk` |
| Publish compile | `compileLinearDeskSvg` → same Maker path |
| CLI | `scripts/render-linear-desk.mts` → same Maker path |
| Maker recipes | Form pen + pipeline IR (`normalizeDescriptorForPipeline` optional `maker`) |
| Schema | `LinearDeskFieldsSchema` live with exact mm fields + fit refine |
| Form model | Uses planner `units.ts` for mm/cm; maps full schema |
| Form UI | pedestalTopGap + pedestalBackInset controls bound (**K3 unit-green**) |
| Parametric chrome | `WorkspaceShell` + `CanvasToolRail`; plan SVG via Maker; confirm dialog custom (Aria gap) |

**K1–K3 unit-green:** one Maker drawer; form + CLI + publish call it; form knobs 1:1 schema. Template residual deprecated only. **Next: C3 browser.** Not browser PASS.

---

## Import / reuse (locked)

| Source | Reuse | Do not |
|--------|-------|--------|
| This monorepo planner | `units.ts`, `asset-engine/svg/*`, catalog types | Second convert/draw stack under Admin-only |
| npm | **`makerjs` only** (already in `site/package.json`) | New geometry pen (Paper host, Konva host) |
| GitHub apps | — | Full planner apps |

---

## What not to import / rebuild

| Forbidden | Why |
|-----------|-----|
| https://github.com/cvdlab/react-planner | Whole planner UI + catalog — duplicates ours |
| Free “furniture plan engines” as product core | Greys / wrong product / not field-driven brand library |
| Sweet Home 3D, Blueprint3d, Archilogic SDKs | Full product or commercial floor display |
| Second interactive 2D canvas as host | Split brain with Fabric |
| Paper.js / SVG.js as new pen | Owner locked Maker.js only |
| `SVG_RELEASE_AUTHORITY=db` in this plan | Disk authority until Failures.md cutover proved |
| AI path `d` / multipath / SVG as publish truth | Wrong mm confidence; C-AI is field draft only |
| $80k paid configurator | Out of budget |
| Rebuild Fabric toolbar / Dockview shell | Toolbars ready; don't rebuild |

---

## Publish authority (policy)

- **Disk** (`site/inventory/descriptors/`, `site/public/svg-catalog/`) is live SVG authority.
- Dual-write is optional fail-soft when Products DB + R2 ready — not cutover.
- No DB authority flip in this plan. See `Failures.md` and `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.

---

## Agents

- **1 implementer max** on this track + parent evidence.
- No 6-worker circus on one pipeline.
- Commit verified slices so work is not lost; push only if owner asks.
