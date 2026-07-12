# SVG pipeline — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** [`Plans/00-QUALITY-BAR.md`](../../Plans/00-QUALITY-BAR.md) · Admin A1/A2.  
**Honesty (owner lock):**
- `public/svg-catalog/` = **inventory publish only** — not live plan-draw.
- Live plan-draw = Fabric + Block2D on `open3d/` (P05).
- Admin A4 studio draws **inventory symbols** with a full toolset destination; publish path stays catalog bytes only.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/01-MODULE-LAYOUT.md`](../architecture/01-MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/03-MODULE-UI-CONTRACT.md`](../architecture/03-MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](./INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Package policy | `@svgdotjs/*` used by Admin A4 studio (`svgJsEngineAdapter`) | `admin/svg-editor/scene/` |
| Descriptor schema | `BlockDescriptor` (publish SoT) + `SvgBlockDefinitionV1` (studio/parts) | `svgTypes.ts`, `svgBlockSchemas.ts` |
| Compile (publish) | **`compileSvgForPublish` / `runSvgCompileStages`** (S1–S3); S4 disk via pipeline with `skipCompile` | `asset-engine/svg/`, `svgPipelineRunner.ts` |
| V1 compiler | `svgCompiler.server.ts` = **reference/tests**, not live publish authority | `open3d/catalog/svg/` |
| Sanitize | DOMPurify + SVGO | `open3d/catalog/svg/svgServerSanitizer.ts` |
| Raster | `svgArtifactCompiler.server.ts` — resvg + sharp | `admin/svg-editor/` |
| Planner browser | `plannerSvgAdapter.ts` — minimal projection | `admin/svg-editor/` |
| Admin UI | Canvas-first studio + form rail + live compile; no admin Puck mount | `AdminSvgEditorEditView.tsx`, `SvgStudioCanvas.tsx` |
| Persist | Atomic JSON to `site/block-descriptors/{slug}.json` | `persistBlockDescriptor.ts` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `@puckeditor/core` | `0.22.0` | Admin registry + portal `Render` |
| `@flatten-js/core` | `^1.6.12` | Geometry (compiler) |
| `polygon-clipping` | `^0.15.7` | Booleans |
| `svgo` | `^4.0.1` | Server optimization |
| `dompurify` | `^3.4.11` | Pre-SVGO sanitization |
| `@resvg/resvg-js` | `^2.6.2` | Canonical PNG |
| `sharp` | `^0.35.2` | Thumbnails |
| `zod` | `^4.4.3` | Descriptor schemas |
| `@svgdotjs/svg.js` + plugins | `^3.2.5` etc. | Admin A4 visual studio (SVG.js adapter) |
| `fabric` | `7.4.0` | Planner plan canvas (consumer, not admin compiler) |

**Boundary:** `plannerSvgAdapter.ts` must not import server-only packages — enforced by `svgPackageBoundaries.test.ts`.

---

## Summary

Publish authority is **`compileSvgForPublish`** (fail-closed) then S4 disk write. Admin A4 studio uses SVG.js + `SvgSceneDocument`; geometry maps to `BlockDescriptor.blocks` for parse. Dual descriptor models remain (BlockDescriptor vs V1 parts). Catalog SVG ≠ Fabric plan-draw.

## Strengths

Package boundary tests; fail-closed publish; atomic persist; A4 scene/adapter/history foundation; live compile preview.

## Weaknesses

Dual schemas still need the blocks bridge. A4 product green (disk browser proof, drafts, inspector, a11y) still open. Admin publish does not prove Fabric plan-draw.
