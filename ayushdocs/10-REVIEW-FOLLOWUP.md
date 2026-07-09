# Code review follow-up — asset-engine publish path

**Style:** requesting-code-review re-check (read-only)  
**Date:** 2026-07-09  
**Baseline:** [`results/planner/code-review-wave/REVIEW.md`](../results/planner/code-review-wave/REVIEW.md)  
**Scope (files read):**

| File | Path |
|------|------|
| Publish wire | `site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts` |
| S4 runner | `site/features/planner/admin/svg-editor/svgPipelineRunner.ts` |
| Publish compile entry | `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` |
| Compile stages | `site/features/planner/asset-engine/svg/runSvgCompileStages.ts` |
| GLB policy | `site/features/planner/lib/glbAssetPolicy.ts` |
| Path-only stamp | `site/features/planner/asset-engine/mesh/stampFurnitureGeneratedGlb.ts` |

**Method:** source + unit test contracts; no production edits; no commit.

---

## Verdict (delta vs last REVIEW.md)

| Prior item | Status now | Notes |
|------------|------------|--------|
| **Critical** | Still **none** | No Critical security/product bug found on re-check |
| **I1** substring policy bypass | **Fixed** | Pathname-only check + query/hash spoof tests |
| **I2** double S1–S3 / discarded gate SVG | **Fixed** | `skipCompile` + `precompiledSvg` on publish → S4 |
| **I3** path-only stamp G8 404 thrash | **Still open** | Intentional API still present |
| **I4** README G8 honesty | **Still open** (docs) | Not re-verified line-by-line; was underclaim |
| **I5** G8 scale / modular size | **Still open** | Product gap outside this publish re-check |
| **M1** `failedAt` over-claims S3 | **Still open** | `runSvgCompileStages` still pushes S2+S3 before await |

### New Critical since last REVIEW.md

**None.**

No silent wrong-product path, no designer-static GLB load on the reviewed gates, no publish persist-before-compile regression.

### New Important since last REVIEW.md

**None that raise severity above residual tracked items.**

The two highest-priority Important findings from the baseline (I1, I2) are **resolved in code**. Residuals below are either the same Important class as before (I3–I5) or Minor (M1, orphan S4, test placement).

Residual Important (unchanged class, still worth tracking):

| ID | Topic | Why still Important |
|----|--------|---------------------|
| **I3** | Path-only stamp without bytes | `stampFurnitureFromModularOptions` still stamps `catalog-assets/generated/…` without G5/upload; G8 may 404 then fall back to procedural |
| **I5** | Modular + GLB scale path | Pre-existing product gap (not introduced by publish skipCompile work) |

Optional residual (document, not new defect):

| Topic | Note |
|-------|------|
| **S4-then-persist orphan** | Still documented in `publishDescriptorWithPipeline`: if S4 writes SVG and persist fails, disk artifact may remain while publish returns failure. Fail-closed for success claim is correct; no auto-rollback. |
| **Absolute host + path marker** | Policy still allows any host whose **pathname** contains `/catalog-assets/generated/` (by design for CDN/storage URLs). Query/hash spoof is closed; evil host + real path segment is still “allowed” if the document can set that URL. Acceptable under current multi-CDN assumption; escalate only if untrusted import becomes a product path. |

---

## Confirm: `skipCompile` still present

**Yes — present and wired on the live publish path.**

### Publish entry (`publishDescriptorWithPipeline.ts`)

Order is still fail-closed:

1. `parsePayload` → fail → no compile/pipeline/persist  
2. `compileSvg` = default `compileSvgForPublish` (S1–S3, no I/O) → fail → no S4/persist  
3. `runPipeline` with **`skipCompile: true`** and **`precompiledSvg: compile.svg`** → fail → no persist  
4. `persist` only after S4 ok  

```117:123:site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts
  // S4: disk write only — reuse validated SVG from compileSvgForPublish (no S1–S3 recompile)
  let pipeline: PipelineResult;
  try {
    pipeline = await runPipeline(descriptor, {
      skipCompile: true,
      precompiledSvg: compile.svg,
    });
```

### S4 runner (`svgPipelineRunner.ts`)

- `PipelineOptions.skipCompile` + `precompiledSvg` remain on the public options type.  
- When `skipCompile === true`: requires non-empty `precompiledSvg`; writes fixture + `public/svg-catalog/{slug}.svg` from those bytes; **does not** import `generate-svg.mjs` / re-run S1–S3.  
- Empty `precompiledSvg` → fail-closed (`nonZeroExit` + clear error).  
- Default path (no skip) still runs full in-process CLI pipeline for non-publish callers.

### Authority entry (`compileSvgForPublish.ts`)

- Still the no-I/O publish compile API.  
- Thin wrap of `runSvgCompileStages` (S1 normalize → S2/S3 `pipelineCore`).  
- V1 remains out of this wire (documented; not re-opened).

### Tests (contract)

- `publishDescriptorWithPipeline.test.ts` asserts `runPipeline` called with `{ skipCompile: true, precompiledSvg: <gate svg> }`.  
- `svgPipelineRunner.test.ts` has dedicated `skipCompile` suite (S4-only + fail without precompiled).

**I2 from baseline is closed:** gate SVG bytes are the bytes written on publish.

---

## Confirm: path-only GLB policy still present

**Yes — pathname-only policy is in force (I1 closed).**

### Implementation (`glbAssetPolicy.ts`)

- Marker: `GENERATED_GLB_PATH_MARKER = "catalog-assets/generated/"`.  
- `urlPathnameOnly(url)` strips `#…` then `?…` before matching.  
- `isSystemGeneratedGlbUrl`:
  - `blob:` allowed  
  - path must `startsWith(marker)` **or** `includes("/" + marker)`  
  - query/hash-only embeds of the marker → **rejected**  
- `shouldLoadGlb` / `assertNoDesignerStaticGlb` / stamp path all flow through this gate.

### Tests

- `shouldLoadGlb.test.ts` explicitly rejects:
  - `https://evil.example/models/x.glb?p=catalog-assets/generated/`
  - `https://evil.example/models/x.glb#catalog-assets/generated/`
- Relative + CDN path allows remain covered.

### Path-only **stamp** (product API, not policy hole)

- `stampFurnitureFromModularOptions` remains the **path-only stamp** (no G5 bytes, no upload).  
- Still policy-gated via `stampFurnitureGeneratedGlb` → `assertNoDesignerStaticGlb` + `isSystemGeneratedGlbUrl`.  
- Binary-export stamp remains a separate, clearly named path (`placeModularWithGeneratedGlbPlan` / export + stamp).  
- This is **I3 residual**, not a regression of the pathname policy.

---

## Recommend next harden item

**Primary (this surface):** **I3 / P1.3 — path-only stamp vs G8 load**

When G8 is live and UI stamps modular furniture with path-only URLs before CDN/disk write, the viewer will attempt load → fail soft → procedural mesh, but still thrash network per item.

**Suggested harden (pick one product decision, then implement):**

1. Prefer **binary-export stamp** (or stamp only after upload) on any product path that sets `generatedGlbUrl` for live G8; keep path-only for plan/admin tools only, **or**  
2. Add a document flag (e.g. `generatedGlbReady`) and gate `shouldLoadGlb` / viewer load until ready, **or**  
3. For relative `catalog-assets/generated/*` only, existence check before load (heavier; product call).

**Secondary (publish hygiene, not security Critical):**

- Document or add compensating cleanup for **S4 success + persist failure** (orphan SVG under `public/svg-catalog/`). Optional transactional story later; do not claim atomic publish until then.

**Do not re-open as P0 on this re-check:** I1/I2 policy + skipCompile work is landed. Broader product spine (admin publish browser E2E P0.1, G5→storage→G8 browser P0.2) remains in `ayushdocs/00-PENDING.md` and is orthogonal to this delta.

---

## Production edits

**None.** No Critical security bug found; no code changes made.

---

## Checklist (this follow-up)

| Check | Result |
|-------|--------|
| New Critical vs last REVIEW | **None** |
| New Important vs last REVIEW | **None** (I1/I2 fixed; I3/I5 residual only) |
| `skipCompile` + precompiled gate SVG | **Present** on publish wire + tests |
| Path-only GLB policy (pathname, no query/hash spoof) | **Present** + spoof tests |
| Path-only stamp API | **Still present** (I3 open) |
| Next harden | **I3 path-only vs G8** (or orphan S4 as secondary) |

*End of follow-up. Digest only — no production files modified. No commit.*
