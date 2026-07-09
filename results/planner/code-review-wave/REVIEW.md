# Code review — asset-engine wave (BASE `93bd27d` → HEAD `ba2e0aa`)

**Reviewer role:** read-only code review (requesting-code-review)  
**Scope:** `site/features/planner/asset-engine/**`, open3d 3D GLB path, SVG publish, `glbAssetPolicy`  
**Date:** 2026-07-09  
**Method:** source + unit tests + prior `results/planner/*` evidence; no production edits; no commit.

---

## Requirements checklist

| Requirement | Verdict | Evidence |
|-------------|---------|----------|
| SVG publish authority = `pipelineCore+normalize` via `compileSvgForPublish` | **Met** | `compileSvgForPublish` → `runSvgCompileStages` → S1 `normalizeDescriptorForPipeline` + S2/S3 `runPipelineCore`; `publishDescriptorWithPipeline` gates on it before S4 |
| Modular mesh path + G5 binary + G8 **partial** load of policy GLB URLs | **Met (honest partial)** | `exportModularCabinetV0GlbBinary` (G5/G6); `ThreeViewerInner` + `loadGeneratedGlbObject` (G8 partial); stages mark G8 `partial` |
| No designer static GLB | **Met (with policy hardening gap)** | `shouldLoadGlb` / `assertNoDesignerStaticGlb`; scene builder strips non-policy URLs; stamp/parser reject designer paths |
| No `any` | **Met** | No handwritten `any` in `asset-engine/**` (word “any” only in prose comment) |
| No skipped tests as silent pass | **Met** | Asset-engine + G8/publish suites report 0 skipped in wave results; verify-wave: 62/62 + smoke 4/4 |
| Honest stages (no full cutover claim) | **Met** | `stages.ts` documents partial G8, no auto-upload, procedural default; README G8 row is **stale** (see Minor) |

---

## Strengths

1. **Single publish compile entry is real, not ceremonial.**  
   `compileSvgForPublish` is a thin authority-facing API over `runSvgCompileStages`. Admin publish is fail-closed: parse → compile (S1–S3) → `runSvgPipeline` (S4) → persist (S6). Compile failure never reaches persist.

2. **S1 normalize closes a real IR gap.**  
   Admin `depth` / product `variant` → pipeline `height` / boolean ops is explicit and tested against admin `side-table-001` and CLI fixtures. CLI `generate-svg.mjs` uses the same normalizer before `pipelineCore`.

3. **V1 is honestly demoted.**  
   `svgCompiler.server.ts` exports `compileAuthority = "v1-reference-only"`. Not on publish wire; retained for V1 golden/unit paths. No false “unified compiler” claim.

4. **Mesh chain is ordered and modular-scoped.**  
   `runModularMeshStages` / `exportModularCabinetV0GlbBinary` document G1→G6; binary export asserts generated path policy, validates with `validateGlbAsset`, and does not claim disk/CDN write.

5. **Product default stays procedural.**  
   `placeCatalogItemInProject` leaves `generatedGlbUrl` unset. Stamping is opt-in (`stampFurnitureGeneratedGlb` / path-only / place-with-binary helpers). G8 load failure keeps procedural mesh.

6. **G8 is partial and labeled partial.**  
   `ThreeViewerInner`: procedural first → async policy-allowed replace → cancel-safe; `mesh-g8-viewer-load-glb` status is `partial` with explicit gaps (no cache, no scale-to-fit, no browser smoke, no auto-upload).

7. **Policy is applied at multiple layers.**  
   Stamp, project parse, scene-node build, and loader all consult `glbAssetPolicy` / `shouldLoadGlb`. Designer CDN / kenney-style paths do not reach the loader when set only on `meshUrl`/`glbUrl`.

8. **Test surface is intentional and non-silent.**  
   Authority, normalize, G5 binary, stamp, place-stamp, G8 mock loader, round-trip, publish fail-closed. Wave artifacts (`svg-authority-wire`, `g8-viewer-glb`, `g8-roundtrip`, `modular-place-stamp`, `verify-wave`) show pass + 0 skipped.

9. **Type hygiene.**  
   Result unions (`ok: true | false`), no `any`, injectable deps on publish for unit tests without production mocks.

---

## Critical issues

**None found** that violate the stated requirements or produce a silent wrong product path under documented assumptions.

No Critical fix steps required before proceeding. Important items below should be tracked but do not block sequential work if honesty about partial G8 remains.

---

## Important issues

### I1 — `isSystemGeneratedGlbUrl` uses substring `.includes()` (policy bypass risk)

**Where:** `site/features/planner/lib/glbAssetPolicy.ts:16–20`  
**What:** Any URL containing the literal `catalog-assets/generated/` is allowed, including spoofed hosts/query/hash, e.g.  
`https://evil.example/foo.glb?x=catalog-assets/generated/` or  
`https://attacker/not-generated#catalog-assets/generated/`.  
**Why it matters:** Parser stamps + viewer load both trust this gate. A document (or import) that sets `generatedGlbUrl` to a spoof URL can load non-system GLB while appearing “policy allowed.”  
**Fix guidance:**

1. Prefer path-segment checks: allow  
   - relative paths starting with `catalog-assets/generated/`  
   - absolute URLs whose **pathname** contains `/catalog-assets/generated/` (or ends with that prefix segment)  
   - `blob:` only  
2. Reject URLs where the marker appears only in query/hash.  
3. Add unit cases for spoof host + marker-in-query/hash → `shouldLoadGlb === false`.  
4. Keep existing allow for real CDN paths whose path includes the marker (tests already use storage-style URLs).

### I2 — Publish runs S1–S3 twice; gate SVG is discarded

**Where:**  
- `site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts:88–124`  
- `site/features/planner/admin/svg-editor/svgPipelineRunner.ts` → `generate-svg.mjs` `runPipeline`  

**What:** `compileSvgForPublish` fully normalizes + compiles + sanitizes, then `runSvgPipeline` does S1–S3 again and writes S4. Gate SVG bytes are not the bytes written.  
**Why it matters:** Fail-closed is still correct (both must succeed), but cost doubles and dual entrypoints could diverge later if one path drifts.  
**Fix guidance (when touching publish):**

1. Short term: document in `stages.ts` / README that S1–S3 run twice (gate + write).  
2. Medium term: either  
   - pass compile result SVG into S4 write helper, or  
   - make S4-only write accept precompiled SVG after gate, with a single normalize/compile implementation.

### I3 — Path-only stamp enables G8 404 thrash without bytes

**Where:** `site/features/planner/asset-engine/mesh/stampFurnitureGeneratedGlb.ts:57–85` (`stampFurnitureFromModularOptions`)  
**What:** Stamps a planned `catalog-assets/generated/…` path without G5 bytes or upload. If UI calls this and G8 is live, viewer attempts load → fails → keeps procedural (correct), but still does network work per furniture.  
**Why it matters:** Documented as intentional; still a footgun if path-only is wired into product UI before CDN write.  
**Fix guidance:** Prefer binary-export stamp only when loading; or add a document flag `generatedGlbReady` / only set URL after upload; or gate `shouldLoadGlb` on existence when path is relative (product decision).

### I4 — Stale honesty in README / some result notes

**Where:**  
- `site/features/planner/asset-engine/README.md:44` — G8 marked **planned**  
- `stages.ts:181–193` and tests correctly say **partial**  
- `results/planner/asset-engine-skeleton/run.json` / older `glb-stamp` notes still say viewer planned  

**Why it matters:** Registry is source of truth; README understates G8 (underclaim, not overclaim). Risk of agents “re-implementing” G8 or ignoring partial load path.  
**Fix guidance:** Align README G8 row + “What is still NOT true” with `stages.ts` partial wording.

### I5 — G8 load does not share procedural scale/dimension path for modular

**Where:**  
- `buildOpen3dSceneNodes.ts:98–102` bakes furniture `scale` into `widthMm`/`depthMm`/`heightMm`  
- Modular procedural mesh uses `modularOptions` sizes (`createSceneObjectFromNode.ts:56–63`)  
- GLB load poses position/rotation only (`loadGeneratedGlbObject.ts:35–40`)  

**Why it matters:** Pre-existing modular/scale inconsistency; G8 inherits it. Documented “no scale-to-fit” is honest. Product-visible mismatch only if non-1 scale is used with modular + GLB.  
**Fix guidance:** Track as G8 product gap; either apply node scale to loaded root or force modular size solely from `modularOptions` and ignore scale for modular furniture.

---

## Minor issues

### M1 — Stage failure attribution can over-claim S3

**Where:** `runSvgCompileStages.ts:66–68`  
Pushes `svg-s2-compile` and `svg-s3-sanitize-optimize` **before** `await runPipelineCore`. On throw, `failedAt` may be S3 even if compile failed inside core.  
**Fix:** Push S2, await compile; push S3 only if sanitize is separable; or use a single stage id for pipelineCore.

### M2 — JSON glTF fallback in G5 export

**Where:** `exportModularGlbBinary.ts:63–69`  
If exporter returns JSON (unexpected with `binary: true`), buffer is UTF-8 JSON; `validateGlbAsset` uses `readBinary` and should fail closed. Dead/confusing branch.  
**Fix:** Reject non-`ArrayBuffer` with explicit error (no JSON encode).

### M3 — Stale comments vs registry

- `runMeshStages.ts:40` still says “G8 planned” while registry is partial.  
- `compileAuthority.ts:47` `adminWire` omits `publishDescriptorWithPipeline` → `compileSvgForPublish`.  
**Fix:** Comment/map string refresh only.

### M4 — `themeTokens` cast without value-type validation

**Where:** `normalizeDescriptorForPipeline.ts:162–164`  
Cast to `Record<string, string | undefined>` without checking values are strings. Non-string values could reach pipelineCore.  
**Fix:** Filter/map string-only entries.

### M5 — Silent catch on GLB load failure

**Where:** `loadGeneratedGlbObject.ts:99–101`  
Empty `catch` returns null (by design). Fine for product fallback; harder to debug in browser.  
**Fix:** Optional `console.warn` / metrics behind debug flag (do not break fail-soft).

### M6 — Double export of authority constant

`compileSvgForPublish.ts` re-exports `PUBLISH_COMPILE_AUTHORITY` while `index.ts` also exports from `compileAuthority`. Harmless; slightly redundant.

---

## Architecture notes (not defects)

| Topic | Note |
|-------|------|
| Dual SVG stack | Publish = pipelineCore+normalize; V1 = reference-only. Intentional dual, not cutover. |
| G5 vs G7 | Modular binary = G5 implemented; SVG extrude binary still admin `GlbExtruderPreview` (plan-only in asset-engine). |
| G8 product gap list | No shared cache, no scale-to-fit, no browser smoke, no auto-upload — correctly listed on stage G8. |
| S5 PNG | Still stub on publish (URL only). |
| S0 schema | Admin Zod vs CLI fixtures still different shapes; S1 bridges compile only. |

---

## Test / evidence snapshot (read-only)

| Artifact | Status |
|----------|--------|
| `results/planner/verify-wave/run.json` | 62 tests pass, 0 skip; SVG smoke batch 4/4 |
| `results/planner/svg-authority-wire/run.json` | publish + compile stages wire pass |
| `results/planner/g8-viewer-glb/run.json` | 32 pass; notes G8 partial |
| `results/planner/g8-roundtrip/run.json` | 8 pass; parse/export + cancel-safe |
| `results/planner/modular-place-stamp/run.json` | 14 pass path-only + binary stamp |
| Asset-engine unit suite | Authority, normalize, G5, stamp, extrude plan, mesh stages |

No evidence of `.skip` / silent empty suites in the reviewed asset-engine / G8 / publish targets.

---

## Assessment

### **Ready to proceed**

Rationale:

- Publish authority requirement is implemented and fail-closed on the live admin wire.  
- Modular G5 binary + validate path exists and is tested.  
- G8 is **partial** and **documented as partial** in `stages.ts` (no full cutover claim).  
- Designer static GLB is blocked on the intended product paths; residual risk is substring policy (I1), not open designer-hero loading.  
- No `any`, no silent skipped tests in this surface.  
- **No Critical defects** requiring production surgery before the next sequential phase.

### Recommended follow-ups (order)

1. **I1** tighten `isSystemGeneratedGlbUrl` (policy correctness).  
2. **I4** sync README G8 status with `stages.ts`.  
3. **I2** document or collapse double S1–S3 on publish.  
4. **I3/I5** product decisions when G8 moves beyond skeleton.

---

## Critical fix steps

_N/A — no Critical issues._

If I1 is later escalated to Critical for untrusted document import:

1. Change `isSystemGeneratedGlbUrl` to pathname/relative-prefix rules (see I1).  
2. Extend `glbAssetPolicy.test.ts` + `shouldLoadGlb.test.ts` with spoof cases.  
3. Re-run:  
   `npx vitest run tests/unit/features/planner/lib/glbAssetPolicy.test.ts tests/unit/features/planner/lib/shouldLoadGlb.test.ts tests/unit/features/planner/open3d/loadGeneratedGlbObject.test.ts`  
4. Write results under `results/planner/` (do not claim full G8 cutover).

---

*End of review. No production files modified. No commit.*
