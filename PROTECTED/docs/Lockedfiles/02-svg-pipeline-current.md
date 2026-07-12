# SVG pipeline — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** [`Plans/00-QUALITY-BAR.md`](../../Plans/00-QUALITY-BAR.md) · Admin A1/A2.  
**Honesty:** `public/svg-catalog/` = **publish** only — not live plan-draw (plan symbols = Fabric + Block2D / P05).

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
| Package policy | `@svgdotjs/*` in `package.json` but **unused** in production paths | `site/package.json` |
| Descriptor schema | `BlockDescriptor` (`svgTypes.ts`) + `SvgBlockDefinitionV1` (dual) | `svgBlockSchemas.ts`, open3d `svgTypes.ts` |
| Compile | **Two paths:** in-process `svgCompiler.server.ts` + exec `scripts/generate-svg.mjs` | `open3d/catalog/svg/`, `svgPipelineRunner.ts` |
| Sanitize | DOMPurify + SVGO | `open3d/catalog/svg/svgServerSanitizer.ts` |
| Raster | `svgArtifactCompiler.server.ts` — resvg + sharp | `admin/svg-editor/` |
| Planner browser | `plannerSvgAdapter.ts` — minimal projection | `admin/svg-editor/` |
| Admin UI | Schema-driven no-code form + debounced compiled preview; no admin Puck mount | `AdminSvgEditorEditView.tsx` |
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

SVG has a real no-code authoring foundation. Option A machinery exists — compiler under `open3d/catalog/svg/`, sanitizer, resvg/sharp artifacts, Puck portal registry, persist API, boundary tests, typed form controls, and live compile preview. Two descriptor models remain. Planner consumes `BlockDescriptor` while newer work speaks `SvgBlockDefinitionV1`.

## Strengths

Package boundary tests enforce server-only compiler in planner chunks. Deterministic compiler module with checksum story. Phase 1 completion tests prove reference variants compile. Atomic persist and pipeline runner with defined failure taxonomy. Portal `Render` path works for preview. Aligns with locked `03-dependencies-engines-current.md` Option A when code path is unified.

## Weaknesses

CLI `generate-svg.mjs` and the in-process path can still diverge outside publish. Publish itself now compiles fail-closed before disk persist. Dual schemas still require a publish adapter until single-model migration. Admin A4 remains open for templates, history, drafts, validation focus, accessibility, responsive proof, and performance. Admin publish still does not prove Fabric plan-draw — those are separate paths.
