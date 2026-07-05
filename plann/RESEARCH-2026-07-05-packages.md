# Saved from research agent (1708de68-1e76-4091-a09c-98c9312634d1)

Date: 2026-07-05

## Executive Summary

Your `site/package.json` stack is **mostly at or within one patch of npm latest** (Jul 2026). Core planner choices—**fabric 7.4**, **three/r3f**, **Puck**, **SVGO 4**, **zustand**, **Zod 4**, **Ark UI + RAC**—remain sound for a Next.js 16 + React 19 planner in 2026. The main concerns are **stale geometry deps** (`polygon-clipping`, `zundo`), **vaul’s slow release cadence**, **server-only native wiring** (resvg/sharp/DOMPurify), and **policy drift** (Lucide still used in admin; `@svgdotjs/*` installed but unused).

*Note: Bright Data MCP returned 401; versions and maintenance dates come from `npm view` (Jul 5, 2026) plus cited public docs/releases.*

---

## Package Status Table

| Package | Repo pin | npm latest | Last publish | Maintenance | Breaking / security notes | Browser vs server | 2026 planner fit |
|---|---|---|---|---|---|---|---|
| **fabric 7.4.x** | `7.4.0` | **7.4.0** | May 2026 | Active (7.x cadence) | 7.0: TS rewrite, Node ≥20, promise APIs; **7.4 fixes CVE-2026-44311** (unsafe CSS in SVG export) | **Browser** (canvas); Node needs jsdom/node-canvas | **Keep** — pinned canvas engine |
| **three + r3f + drei** | `0.185.1` / `9.6.1` / `10.7.7` | same | Jul/Apr/Feb 2026 | Very active | r3f v9: React 19 compat, `CanvasProps`, StrictMode inheritance changes | **Browser only** — `'use client'` + `dynamic(..., { ssr: false })` | **Keep** — standard 3D stack |
| **@puckeditor/core** | `0.22.0` | **0.22.0** | Jun 2026 | Active (~100 releases) | 0.22: theming, dynamic CSS, `iframe.syncHostStyles`; editor must stay client | Editor: **client**; `<Render>`: **RSC-capable** | **Keep** — right fit for admin SVG/Puck |
| **@svgdotjs/svg.js + plugins** | `3.2.5` / `4.0.3` / `2.0.5` | same | Sep 2025 | Low churn | No major breaks; plugins track svg.js 3.x | **Browser** | **Defer/remove** — not imported anywhere; redundant with fabric per `PACKAGES.md` |
| **@flatten-js/core** | `^1.6.12` | **1.6.12** | Apr 2026 | Active | Stable geometry API | **Either** (pure JS) | **Keep** — measure/segment helpers |
| **polygon-clipping** | `^0.15.7` | **0.15.7** | **Dec 2023** | **Stale** | API stable; no recent security advisories found | **Either** (pure JS) | **Revisit** — consider `martinez-polygon-clipping@0.8.1` (Dec 2025) |
| **dompurify** | `^3.4.11` | **3.4.11** | Jun 2026 | Active | Browser-native; server needs DOM shim | **Browser** native; **server** via `isomorphic-dompurify` + jsdom | **Keep** — use isomorphic wrapper in pipeline |
| **svgo** | `^4.0.1` | **4.0.1** | Mar 2026 | Active | v4: named exports only, `removeScripts`, `removeViewBox`/`removeTitle` off by default, Node ≥16 | **`svgo`** server; **`svgo/browser`** client | **Keep** — server pipeline |
| **@resvg/resvg-js** | `^2.6.2` | **2.6.2** | Jan 2026 | Active | Native `.node` binary — must be external in Next | **Server only** (WASM exists, slower) | **Keep** — PNG thumbs without Chromium |
| **sharp** | `^0.35.2` | **0.35.3** | Jul 2026 | Very active | Node ≥20.9; libvips native | **Server only** | **Keep** — post-resvg raster ops |
| **zustand** | `^5.0.14` | **5.0.14** | May 2026 | Very active | v5 React 19–friendly | **Either** | **Keep** — planner store |
| **zundo** | `^2.3.0` | **2.3.0** | **Nov 2024** | Slow releases; open issues | Undo merge/undefined edge cases reported | **Client** (with zustand) | **Keep with caution** — watch undo bugs |
| **react-resizable-panels** | `^4.11.2` | **4.12.1** | Jul 2026 | Active | v4: `PanelGroup`→`Group`, sizes as `"50%"`, `onLayoutChange` | **Client** (improved SSR helpers in v4) | **Keep** — workspace splits |
| **vaul** | `^1.1.2` | **1.1.2** | **Dec 2024** | **Release lag**; active 2026 issues | iOS Safari/focus bugs; merged fixes awaiting release | **Client** | **Keep short-term** — evaluate Radix Drawer if releases stall |
| **@ark-ui/react** | `5.37.2` | **5.37.2** | Jun 2026 | Active (Chakra team) | v5 machine-based primitives | **Client** | **Keep** — toolbar primitives |
| **react-aria-components** | `1.19.0` | **1.19.0** | Jun 2026 | Active (Adobe) | Steady minor releases | **Client** | **Keep** — combobox/listbox gaps |
| **@phosphor-icons/react** | `^2.1.10` | **2.1.10** | May 2025 | Slower but stable | 6 weights; tree-shakeable | **Client** | **Keep** for open3d chrome |
| **framer-motion** | `^12.41.0` | **12.42.2** | Jun 2026 | Active (Motion) | v12 React 19; use `LazyMotion` in Next | **Client** | **Keep** — UI transitions (Tier-3 until needed) |
| **@tanstack/react-query** | `^5.101.0` | **5.101.2** | Jun 2026 | Very active | v5 stable; no v6 pressure | **Client** (+ server prefetch) | **Keep** |
| **fuse.js** | `^7.4.1` | **7.4.2** | Jun 2026 | Active | v7 API stable | **Either** | **Keep** — catalog search |
| **sonner** | `^2.0.7` | **2.0.7** | Aug 2025 | Stable | v2 toast API | **Client** | **Keep** |
| **zod** | `^4.4.3` | **4.4.3** | May 2026 | Active | v4: unified `error`, top-level format fns, dropped `errorMap`/`nativeEnum` | **Either** | **Keep** — already on v4 |

---

## Excluded Packages — Still Valid?

| Excluded | In `package.json`? | Verdict 2026 |
|---|---|---|
| **XYFlow / @xyflow/react** | Yes (`^12.11.0`) | **Valid to exclude from planner** — node-graph editor, not floorplan canvas. Library itself is healthy ([xyflow/xyflow](https://github.com/xyflow/xyflow)); keep only if you need workflow graphs elsewhere. |
| **GSAP** | Yes (`^3.15.0`) | **Valid to exclude from planner UI** — scroll/timeline cinema; Framer Motion fits tool rails/modals better ([comparison](https://buildwithumar.com/blogs/gsap-vs-framer-motion-nextjs-2026)). Fine for marketing. |
| **Lucide** | Yes (`^1.21.0`; latest **1.23.0**) | **Policy-valid for planner chrome**, but **admin still imports Lucide heavily** while open3d uses Phosphor. Either migrate admin icons or document dual-icon exception. |
| **Swiper** | Yes (`12.2.0`; latest **14.0.1**) | **Valid to exclude from planner** — carousel/marketing. v14 is TS rewrite, no runtime API change from v12 ([Swiper v14](https://github.com/nolimits4web/swiper/releases/tag/v14.0.0)); site is 2 majors behind if marketing uses it. **Embla** (already installed) is the lighter alternative for new carousels. |

---

## Top 5 Risks

1. **`polygon-clipping` maintenance gap** — Last npm publish Dec 2023; `martinez-polygon-clipping@0.8.1` (Dec 2025) is actively maintained with the same Martinez API ([martinez-polygon-clipping](https://www.npmjs.com/package/martinez-polygon-clipping)).
2. **`vaul` release stagnation + mobile bugs** — npm frozen since Dec 2024; open 2026 issues on iOS Safari and release requests ([#630](https://github.com/emilkowalski/vaul/issues/630), [#648](https://github.com/emilkowalski/vaul/issues/648)).
3. **Server SVG security path** — Raw `dompurify` is browser-first; server sanitize needs `isomorphic-dompurify` and possible jsdom pin for Vercel CJS ([isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify), [issue #394](https://github.com/kkomelin/isomorphic-dompurify/issues/394)).
4. **Native modules in Next 16** — `@resvg/resvg-js` and `sharp` must stay in `serverExternalPackages` or bundling breaks ([resvg Next.js issue](https://github.com/thx/resvg-js/issues/315), [Next.js docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)).
5. **Dependency / policy drift** — `@svgdotjs/*` is in lockfile but **unused in code**; Lucide dominates admin while `PACKAGES.md` locks Phosphor for planner icons.

---

## Top 5 Recommendations for `plann/01-START.md` Package Section

1. **Document the server pipeline boundary explicitly:** `@flatten-js/core` + boolean ops → `svgo` → `dompurify`/`isomorphic-dompurify` → `@resvg/resvg-js` → `sharp`; mark each as `server-only` vs `client-only` with `serverExternalPackages: ['@resvg/resvg-js', 'sharp']`.
2. **Schedule `polygon-clipping` review** — benchmark swap to `martinez-polygon-clipping@0.8.1` (drop-in GeoJSON arrays) before Phase 1 closeout; keep `polygon-clipping` only if parity tests pass.
3. **Remove or defer `@svgdotjs/svg.js` + plugins** from Tier-1 until admin SVG editor actually imports them; fabric + server pipeline covers current open3d path per `PACKAGES.md`.
4. **Icon policy:** Phosphor for `open3d/` chrome (already started in `TopBar.tsx`); treat Lucide as **admin/marketing legacy** — no new Lucide in planner workspace routes.
5. **Pin minimums with rationale:** `fabric@7.4.0` (CVE-2026-44311), `svgo@^4`, `zod@^4`, `r3f@^9` (React 19); note r3f requires `dynamic(..., { ssr: false })` and Puck editor stays `'use client'`.

---

## Sources

- [fabric v7.4.0 release](https://github.com/fabricjs/fabric.js/releases/tag/v740) (May 2026)
- [Fabric 7.0 upgrade guide](https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/)
- [r3f v9 migration](https://github.com/pmndrs/react-three-fiber/blob/7dfaeaaa/docs/tutorials/v9-migration-guide.mdx)
- [Puck v0.22.0](https://github.com/puckeditor/puck/releases/tag/v0.22.0) · [Puck Next.js discussion](https://github.com/puckeditor/puck/discussions/1568)
- [SVGO v4 migration](https://svgo.dev/docs/migrations/migration-from-v3-to-v4/)
- [Zod v4 changelog](https://zod.dev/v4/changelog)
- [@resvg/resvg-js npm](https://www.npmjs.com/package/@resvg/resvg-js) · [Next.js external packages](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)
- [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify)
- [react-resizable-panels v4.0.0](https://github.com/bvaughn/react-resizable-panels/releases/tag/4.0.0)
- [martinez-polygon-clipping](https://www.npmjs.com/package/martinez-polygon-clipping)
- [Swiper v14.0.0](https://github.com/nolimits4web/swiper/releases/tag/v14.0.0)
- [xyflow/xyflow](https://github.com/xyflow/xyflow)
- [GSAP vs Framer Motion 2026](https://buildwithumar.com/blogs/gsap-vs-framer-motion-nextjs-2026)
- [Phosphor vs Lucide](https://allsvgicons.com/compare/phosphor-vs-lucide/)
- Internal: `PACKAGES.md`, `site/package.json` (Jul 5, 2026)

[REDACTED]