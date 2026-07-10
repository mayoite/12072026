# CR-A — Structural quality (admin-svg wave)

**Seat:** CR-A (strict structural quality)  
**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only  
**Mode:** READ-ONLY — no product code edits  
**Base..HEAD scope (requested):** `d34d2e85` → `HEAD` for admin SVG surfaces  
**Skills:** code-review (strict quality), verification-before-completion (evidence from source; no product claims)

## Surfaces reviewed

| Area | Path |
|------|------|
| Feature package | `site/features/planner/admin/svg-editor/**` |
| App routes | `site/app/admin/svg-editor/**` |
| API | `site/app/api/admin/svg-editor/route.ts` |
| Publish compile core | `site/scripts/generate-svg/pipelineCore.ts` (+ wire into asset-engine) |
| Unit tests | `site/tests/unit/admin/svg-editor/**` |

**Also walked (call graph only):** `compileSvgForPublish` / `runSvgCompileStages`, `generate-svg.mjs`, V1 `svgCompiler.server` + `svgArtifactCompiler.server`.

**Method:** Static structural review against code judo, file size, spaghetti branching, wrong layer / dual paths, thin wrappers, type/boundary mess. High-conviction findings only (max 5). Not a security seat (see `CR-PUBLISH-REVIEW.md`) and not a UI-theme seat (see `CR-UI-THEME-REVIEW.md`).

---

## Verdict

### **APPROVE-WITH-FIXES**

**Reasoning:** Live **1B publish authority is structurally coherent** — one orchestrator (`publishDescriptorWithPipeline`) does parse → `compileSvgForPublish` (S1–S3) → S4 disk write → persist, with injectable deps and solid unit locks on fail-closed order. RSC pages are thin. That is the right spine.

What blocks a clean **APPROVE** is residual **dual-path / wrong-layer / god-module debt** still sitting *inside* the admin package and publish runner: process-era S4 façade, V1 schema/compiler still co-owned and green-tested, Puck registry approaching 1k with field/data shape dual, edit view multi-concern + dual publish entry, stringly error boundary. None of these justify throwing out the wave; all five should be fixed before treating structure as “done.”

| Gate | Result |
|------|--------|
| Single live publish orchestrator | **PASS** |
| No dual compile authority in *live* wire | **PASS** (live wire) / **FAIL** (package still co-hosts V1) |
| Files ≤ ~1k with one responsibility | **WARN** (`puckBlockRegistry.tsx` ~850) |
| Dead options / process façade gone | **FAIL** |
| Typed error / clean client→API boundary | **FAIL** |
| Overall structural ship | **APPROVE-WITH-FIXES** |

---

## Size census (approx LOC, current tree)

| File | ~LOC | Note |
|------|------|------|
| `puckBlockRegistry.tsx` | **850** | Approaching 1k; multi-responsibility |
| `AdminSvgEditorEditView.tsx` | **551** | Multi-concern client god surface |
| `persistBlockDescriptor.ts` | **454** | Dense but single job (persist) |
| `pipelineCore.ts` | **~393** | Live S2/S3; acceptable size for core |
| `svgPipelineRunner.ts` | **297** | Dual mode + dead knobs |
| `AdminSvgEditorListView.tsx` | **~207** | Fine |
| RSC pages / `publishSvgEditorAction` / `compileSvgForPublish` | **thin** | Good |

No file currently **over** 1k; the size risk is concentration + dual shape, not raw bloat alone.

---

## Strengths (brief)

1. **`publishDescriptorWithPipeline`** — clear stage order, fail-closed before persist, documented S4-before-persist orphan risk, injectable deps. Right layer for publish.
2. **Thin RSC seams** — list `page.tsx` and `[id]/page.tsx` only load + bind `publishSvgEditorAction.bind(null, slug)`; no business logic in routes.
3. **`publishSvgEditorAction`** — single server-action module (stable Server Action identity); reconstructs descriptor then hands off to the same orchestrator as the API.
4. **`compileSvgForPublish` → `runSvgCompileStages` → `pipelineCore`** — intentional thin authority entry; V1 documented off the publish wire.
5. **Unit tests lock the fail-closed spine** — `publishDescriptorWithPipeline.test.ts` (including `skipCompile: true` + `precompiledSvg` contract).

---

## Top 5 actionable findings (high conviction only)

### 1. `svgPipelineRunner` is still a process-era dual-mode façade; live publish only needs S4 write

**Where:**  
- `site/features/planner/admin/svg-editor/svgPipelineRunner.ts` (full file; esp. L16–26, L50–68, L141–297)  
- `publishDescriptorWithPipeline.ts` L117–123 (`skipCompile: true` always)  
- Tests still mock `node:child_process` and assert dead timeout contracts: `svgPipelineRunner.test.ts` L20–27, L130–136

**What’s wrong:**  
Live publish **never** uses the full in-process `generate-svg.mjs` path. It always passes `skipCompile` + `precompiledSvg`, which is ~`mkdirSync` + `writeFileSync` wrapped in a `PipelineResult` shaped like a child process (`exitCode`, `stderr`, `spawnError` legacy reason). Meanwhile:

- `timeoutMs` / `maxStderrBytes` are assigned then **voided** (L162–165) — dead API surface still contract-tested.  
- Non-skip path still dynamic-imports `generate-svg.mjs` (second S1–S3 authority surface + fixture write) even though publish already ran asset-engine compile.  
- Failure reason for missing precompiled SVG is `"nonZeroExit"` (L177) — process-era label for a pure validation miss.

**Why it matters:** Dual modes invite regressions (“someone calls full pipeline from admin again”), obscure the real S4 job, and keep tests green on **dead** knobs. Code judo opportunity is large.

**Fix (actionable):**  
1. Extract `writePublishedSvgArtifact(slug, svg, projectRoot?)` (S4 only).  
2. Have `publishDescriptorWithPipeline` call that directly (or a 20-line wrapper).  
3. Keep full CLI / dynamic-import path only in `generate-svg.mjs` (or rename runner to `runSvgPipelineCli`).  
4. Delete voided timeout/stderr options from the publish-facing type; stop testing them as live contracts.

---

### 2. V1 dual schema/compiler still co-owned by the admin package (wrong layer / dual path residual)

**Where (live vs residual):**

| Live 1B wire | Residual V1 still under admin |
|--------------|-------------------------------|
| `BlockDescriptor` + `compileSvgForPublish` + `pipelineCore` | `svgBlockSchemas.ts` (`SvgBlockDefinitionV1`) |
| `publishDescriptorWithPipeline` | `svgFieldMetadata.ts` (`physicalDimensionsMm.*` paths — **not** BlockDescriptor) |
| | `svgArtifactCompiler.server.ts` → `compileSvgBlockV1` |
| | `plannerSvgAdapter.ts`, `svgReferenceDefinitions.ts`, `svgRevisionRepository.server.ts` |
| | Tests: `svgPhase1Completion.test.ts`, `svgFoundation.test.ts` still green on V1 |

**What’s wrong:** Package boundary tests (`svgPackageBoundaries.test.ts`) still treat V1 compiler + artifact compiler as first-class admin modules. Foundation tests keep V1 schemas “passing,” which papers over the plan lock that **dual compile paths / dual schemas were the current weakness** and 1B proposed **one** compiler.

**Why it matters:** Next engineer will extend the wrong IR. `svgFieldMetadata` / `SVG_PUCK_FIELDS` is a second field cartography that does not match `puckBlockRegistry` (geometry vs physicalDimensionsMm). That is dual path by construction, not archival.

**Fix (actionable):**  
1. Move V1 (`svgBlockSchemas`, V1 compiler consumers, foundation fixtures) to a clearly named **reference** package/path (or `archive/` under admin with no production imports).  
2. Drop or quarantine V1 unit tests from the admin-svg “ship green” suite; keep one explicit “V1 reference only” describe if needed.  
3. Delete or rewrite `svgFieldMetadata` so there is **one** field cartography (`puckBlockRegistry` / BlockDescriptor).  
4. Ensure `svgArtifactCompiler` is not importable from any publish or admin edit path (lint/boundary test).

---

### 3. `puckBlockRegistry.tsx` (~850 LOC) — god module + field key / data shape dual + cast forest

**Where:**  
- `puckBlockRegistry.tsx` L118–256 (flat dotted fields: `"geometry.widthMm"`, `"viewBox.x"`, …)  
- L474–476 / L527–531 / L581 — `defaultProps` only shallow identity (`slug` / sku / counts)  
- L764–798 `getPuckEditorData` — **nested** `geometry`, `viewBox`, `themeTokens`, variant blobs  
- L806–848 `puckEditorDataToDescriptorInput` — expects nested props  
- L592–605, L686 — `as unknown as` cast ladder for registry/config typing  
- Also: three placeholder SVG renderers + `getPuckData` (portal minimal) + `getPuckEditorData` (admin full) dual adapters

**What’s wrong:**  
One file owns fields, schemas, placeholder geometry, Puck config, exhaustiveness, and two data adapters. Field **keys** are dotted flat strings; editor **data** is nested objects. Registry `defaultProps` do not match either the field map or the editor data shape. Casts paper over the type boundary with Puck instead of a single typed bridge.

**Why it matters:** This is the highest structural risk for “edit looks fine, publish ignores fields” or Puck mount thrash. Approaching 1k LOC with dual shapes is the classic place spaghetti grows next wave.

**Fix (actionable):**  
1. Split into e.g. `puckFields.ts` / `puckBlockRenders.tsx` / `puckDescriptorAdapters.ts` / `puckConfig.ts` (one responsibility each).  
2. Pick **one** prop shape for admin editor (prefer nested objects with Puck `object` + `objectFields`, or fully flat keys everywhere — not both).  
3. Align `defaultProps`, `getPuckEditorData`, field maps, and `puckEditorDataToDescriptorInput` on that shape; add a round-trip unit test (descriptor → editor data → input → key geometry fields).  
4. Replace `as unknown as` registry casts with a thin typed mapper or Puck’s real `Config` generics.

---

### 4. `AdminSvgEditorEditView` multi-concern surface + dual publish entry + type boundary mess

**Where:**  
- `AdminSvgEditorEditView.tsx` L48–50 `POST_URL` + L246–309 `handlePublish`  
- Preferred: `onPublishAction` (server action)  
- Fallback: raw `fetch(POST_URL)` **without CSRF** (structural dual path; security called out in CR-PUBLISH — here: dual wire)  
- L259–264 success/error via `(result as unknown as { error?: string })` instead of `PublishDescriptorResult`  
- L85–90 / L233–236 legacy `payloadText` form state still carried  
- L457–530 fixed-variant GLB extrude + upload island in the same component as Puck publish  
- L118–163 field cartography table duplicates registry concerns

**What’s wrong:** One client component owns identity chrome, cartography, 3D extrude/upload, dual publish transports, and alert UX. Publish success does not check `success === false` as a discriminant; it string-sniffs `error` after casts. Fallback fetch is a second product path, not a test seam.

**Why it matters:** Spaghetti branching + wrong boundary types mean “publish UX” can lie or diverge from API auth/CSRF. Structural fix is smaller than it looks once dual path is deleted.

**Fix (actionable):**  
1. **Require** `onPublishAction`; delete client `fetch` fallback (tests inject a fake action).  
2. Type `onPublishAction` as `Promise<PublishDescriptorResult>` and branch on `result.success`.  
3. Extract `SvgGlbExtrudePanel` (fixed-variant only) out of the edit view.  
4. Drop dead `payloadText` / legacy FormState fields.

---

### 5. Stringly-typed publish errors → API string-prefix taxonomy (type/boundary mess)

**Where:**  
- `publishDescriptorWithPipeline.ts` L31–34 — `{ success: false; error: string }` only  
- `site/app/api/admin/svg-editor/route.ts` L56–89 — classifies via  
  `err.startsWith("invalid:")` / `includes("Zod")` / `startsWith("compiler_failed:")` / etc.  
- On parse-ish failures, **re-runs** `parseAdminPayload(payload)` (L70–75) after the orchestrator already failed

**What’s wrong:** The orchestrator already knows *why* it failed (parse vs compile vs pipeline vs persist) but flattens to a free-form string. The HTTP layer re-derives semantics with fragile string matching and may double-parse. Persist errors surface as `"500.io: …"` mixed with compiler prefixes — easy to mis-map to 422 vs 500.

**Why it matters:** Spaghetti branching at the boundary; every new failure mode requires another `startsWith` arm. Client edit view suffers the same stringly contract.

**Fix (actionable):**  
1. Change failure type to a tagged union, e.g.  
   `{ success: false; stage: "parse" | "compile" | "pipeline" | "persist"; code: string; message: string }`.  
2. Map `stage` → HTTP status once in the route (no re-parse).  
3. Server action returns the same union; edit view switches on `stage`/`success`.

---

## Explicit non-findings (out of scope or already covered elsewhere)

| Topic | Disposition |
|-------|-------------|
| Auth/CSRF on API vs server action | Security seat — `CR-PUBLISH-REVIEW.md` |
| Orphan SVG if persist fails after S4 | Correctness seat — same; structural note only under finding 1 (S4 isolation) |
| Admin theme / Phosphor / hex in 3D islands | UI seat — `CR-UI-THEME-REVIEW.md` |
| `compileSvgForPublish` one-liner | **Acceptable** thin authority wrapper (not empty wrapper debt) |
| `persistBlockDescriptor` size/complexity | Single responsibility; not in top 5 |

---

## Recommended fix order (structural only)

1. **Typed publish result + kill API string taxonomy** (finding 5) — small, high leverage.  
2. **S4-only writer; demote full `runSvgPipeline`** (finding 1).  
3. **Collapse edit publish to server action only + typed result** (finding 4).  
4. **Unify Puck prop shape + split registry** (finding 3).  
5. **Quarantine V1 dual IR from admin live package** (finding 2).

---

## Assessment summary

| Question | Answer |
|----------|--------|
| Ready to merge structurally? | **With fixes** — spine is sound; dual-path residuals are not paper-PASS clean |
| Reject entire wave? | **No** — live orchestrator is the right design |
| Approve clean? | **No** — five high-conviction structural debts remain |

**Verdict: APPROVE-WITH-FIXES**
)
