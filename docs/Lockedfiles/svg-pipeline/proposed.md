# SVG pipeline — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) · **Phase 1B** — **acceptance pending evidence**

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Admin contract | [`docs/architecture/ADMIN-UI-CONTRACT.md`](../../architecture/ADMIN-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Package policy | **Option A locked** — no SVG.js Phase 1 | `PACKAGES.md` | `00-REVISION.md` |
| Icons | Phosphor in planner; admin CMS may use Lucide if documented | `PACKAGES.md` | Decision 3 |
| Descriptor schema | `BlockDescriptor` for catalog consumer; `SvgBlockDefinitionV1` for reference blocks; bridge adapter in 1B | `svgBlockSchemas.ts`, `svgTypes.ts` | `implementation-decisions.md` |
| Compile | **One** compiler module; `generate-svg.mjs` is thin CLI over same logic | `open3d/catalog/svg/svgCompiler.server.ts` | `PACKAGES.md` Option A |
| Sanitize | DOMPurify before SVGO; SVGO is optimization not sanitization | `svgServerSanitizer.ts` | `Plans/P-track/START.md` §10 |
| Raster | resvg canonical PNG + Sharp thumbnails; server-only | `svgArtifactCompiler.server.ts` | `Plans/P-track/START.md` §8 |
| Boundaries | No server-only packages in planner or browser adapter chunks | boundary tests | `svgPackageBoundaries.test.ts` |
| Publish | Draft → validate → preview → publish; compile failure blocks publish | revision repo + API | `Plans/P-track/START.md` §9 |

## Packages (proposed per plan)

| Package | Phase | Policy |
|---------|-------|--------|
| `@puckeditor/core` | 1B | Full admin compose + portal render |
| `@flatten-js/core`, `polygon-clipping`, `svgo` | 1B | Server Option A geometry + optimize |
| `dompurify` | 1B | Sanitize before SVGO |
| `@resvg/resvg-js`, `sharp` | 1B | Server raster only |
| `zod` | 1B | `SvgBlockDefinitionV1` + publish payloads |
| `@svgdotjs/*` | — | **Remove** — excluded |
| `fabric` | consumer | Load compiled SVG on canvas — not in compile path |

**1B deliverable:** single compiler authority; publish fails closed on compile error; bundle boundary gate green; three reference blocks end-to-end.
