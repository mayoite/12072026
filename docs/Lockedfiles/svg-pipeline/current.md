# SVG pipeline — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** **Option A locked** in [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) — **1B not accepted**; dual compile paths and dual descriptor models remain on disk.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Package policy | `@svgdotjs/*` in `package.json` but **unused** in production paths | `site/package.json` |
| Descriptor schema | `BlockDescriptor` (`svgTypes.ts`) + `SvgBlockDefinitionV1` (dual) | `svgBlockSchemas.ts`, open3d `svgTypes.ts` |
| Compile | **Two paths:** in-process `svgCompiler.server.ts` + exec `scripts/generate-svg.mjs` | `open3d/catalog/svg/`, `svgPipelineRunner.ts` |
| Sanitize | DOMPurify + SVGO | `open3d/catalog/svg/svgServerSanitizer.ts` |
| Raster | `svgArtifactCompiler.server.ts` — resvg + sharp | `admin/svg-editor/` |
| Planner browser | `plannerSvgAdapter.ts` — minimal projection | `admin/svg-editor/` |
| Admin UI | JSON editor + `Render` preview; no visual Puck compose | `AdminSvgEditorEditView.tsx` |
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
| `@svgdotjs/svg.js` + plugins | `^3.2.5` etc. | **Installed, unused** |
| `fabric` | `7.4.0` | `loadSVGFromString` on canvas (consumer, not compiler) |

**Boundary:** `plannerSvgAdapter.ts` must not import server-only packages — enforced by `svgPackageBoundaries.test.ts`.

---

## Summary

SVG is the strongest “backend contracts, weakest admin product” area. Option A machinery exists — compiler under `open3d/catalog/svg/`, sanitizer, resvg/sharp artifacts, Puck registry, persist API, boundary tests — but two compile paths and two descriptor models remain. Admin still edits JSON; planner consumes `BlockDescriptor` while newer work speaks `SvgBlockDefinitionV1`.

## Strengths

Package boundary tests enforce server-only compiler in planner chunks. Deterministic compiler module with checksum story. Phase 1 completion tests prove reference variants compile. Atomic persist and pipeline runner with defined failure taxonomy. Portal `Render` path works for preview. Aligns with locked `PACKAGES.md` Option A when code path is unified.

## Weaknesses

`@svgdotjs/*` still in `package.json` unused. Exec `generate-svg.mjs` vs in-process compiler can diverge. Publish API does not yet fail closed on compile errors. No visual Puck compose. Dual schemas require publish adapter until single-model migration. End-to-end “admin publishes → open3d places block” not demonstrated in production UI — **1B not accepted**.
