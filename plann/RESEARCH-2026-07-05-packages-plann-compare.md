# Saved from research agent (332a5d7f-42c2-4e95-b5bb-deb61c67591e)

Date: 2026-07-05

# Planner Stack Package Research (2025–2026)

**Executive summary:** The on-disk stack is largely current on npm as of July 2026. `fabric@7.4.0`, `three@0.185.1`, Puck `0.22.0`, Ark UI `5.37.2`, React Aria `1.19.0`, SVGO `4.0.1`, and Zod `4.4.3` are all at or near latest. The biggest governance gap is not versions but **pipeline architecture**: `plann/START.md` mandates Puck → compiler → DOMPurify → SVGO → resvg → Sharp with **admin-only SVG.js**, while locked **PACKAGES.md Option A** explicitly **skips SVG.js** and omits DOMPurify/Sharp from the SVG path. `site/package.json` already installs both models plus excluded packages (`@xyflow/react`, GSAP, Lucide, Swiper).

*Sources: npm registry queries run 2026-07-05; web citations below. Bright Data MCP returned 401 (unauthenticated); registry + public npm/GitHub docs used instead.*

---

## 1. Latest versions, maintenance, server/client fit

| Package | Latest (npm) | Last publish | Maintenance | Client / Server |
|---|---|---|---|---|
| **fabric** | 7.4.0 | May 2026 | Healthy — quarterly 7.x releases, CVE fix in 7.4.0 ([fabric npm](https://www.npmjs.com/package/fabric), [v7.4.0 release](https://github.com/fabricjs/fabric.js/releases/tag/v740)) | **Client** — 2D canvas + `loadSVGFromString` |
| **three** | 0.185.1 | Jul 2026 | Very active ([three npm](https://www.npmjs.com/package/three)) | **Client** — lazy WebGL |
| **@react-three/fiber** | 9.6.1 | Apr 2026 | Active, React 19 compatible ([r3f npm](https://www.npmjs.com/package/@react-three/fiber)) | **Client** |
| **@react-three/drei** | 10.7.7 | Feb 2026 | Active helpers ([drei npm](https://www.npmjs.com/package/@react-three/drei)) | **Client** — lazy 3D only |
| **@puckeditor/core** | 0.22.0 | Jun 2026 | Active — 12.8k★, theming in 0.22 ([Puck npm](https://www.npmjs.com/package/@puckeditor/core), [Puck 0.22 blog](https://puckeditor.com/blog/puck-022)) | **Admin client** only |
| **@svgdotjs/svg.js** | 3.2.5 | Sep 2025 | Low cadence but maintained ([SVG.js GitHub](https://github.com/svgdotjs/svg.js)) | **Admin client** only (plann rule) |
| **@flatten-js/core** | 1.6.12 | Apr 2026 | Active ([flatten-js npm](https://www.npmjs.com/package/@flatten-js/core)) | **Both** — pure JS geometry |
| **polygon-clipping** | 0.15.7 | **Dec 2023** | **Stale** — no release in 2.5y ([polygon-clipping npm](https://www.npmjs.com/package/polygon-clipping)); active fork `martinez-polygon-clipping@0.8.1` Dec 2025 ([martinez npm](https://www.npmjs.com/package/martinez-polygon-clipping)) | **Both** — pure JS |
| **dompurify** | 3.4.11 | Jun 2026 | Very active ([DOMPurify GitHub](https://github.com/cure53/DOMPurify)) | **Browser native**; **server needs jsdom** or `isomorphic-dompurify` ([isomorphic-dompurify](https://www.npmjs.com/package/isomorphic-dompurify)) |
| **svgo** | 4.0.1 | Mar 2026 | Healthy — 22k★, Node ≥16, `svgo` vs `svgo/browser` split ([SVGO npm](https://www.npmjs.com/package/svgo), [v4 migration](https://svgo.dev/docs/migrations/migration-from-v3-to-v4/)) | **Server** (plann: never client chunks) |
| **@resvg/resvg-js** | 2.6.2 stable; 2.7.0-alpha.2 | Jan 2026 alpha | Stable line quiet since Mar 2024; repo pushed Jun 2026 ([resvg-js GitHub](https://github.com/thx/resvg-js)) | **Server** — native Node addon |
| **sharp** | 0.35.3 | Jul 2026 | Very active — requires Node ≥20.9 ([sharp npm](https://www.npmjs.com/package/sharp), [v0.35.0 changelog](https://sharp.pixelplumbing.com/changelog/v0.35.0/)) | **Server only** |
| **zustand** | 5.0.14 | May 2026 | Active | **Client** |
| **zundo** | 2.3.0 | Nov 2024 | Slow releases; Zustand v5 support in 2.3.0 ([zundo release](https://github.com/charkour/zundo/releases/tag/v2.3.0)) | **Client** |
| **react-resizable-panels** | 4.12.1 | Jul 2026 | Active | **Client** |
| **vaul** | 1.1.2 | Dec 2024 | Slow but stable drawer primitive | **Client** |
| **@ark-ui/react** | 5.37.2 | Jun 2026 | Very active — Chakra/Zag.js backed ([Ark UI GitHub](https://github.com/chakra-ui/ark/)) | **Client** (admin + planner chrome) |
| **react-aria-components** | 1.19.0 | Jun 2026 | Very active — Adobe ([RAC npm](https://www.npmjs.com/package/react-aria-components), [v1.19.0 notes](https://react-aria.adobe.com/releases/v1-19-0)) | **Client** |
| **@phosphor-icons/react** | 2.1.10 | May 2025 | Icon font cadence slower than UI libs | **Client** |
| **framer-motion** | 12.42.2 | Jun 2026 | Active (Motion monorepo) | **Client** — shell only per plann |
| **@tanstack/react-query** | 5.101.2 | Jun 2026 | Active | **Client** |
| **fuse.js** | 7.4.2 | Jun 2026 | Active | **Client** |
| **sonner** | 2.0.7 | Aug 2025 | Stable toast lib | **Client** |
| **zod** | 4.4.3 | May 2026 | **Zod 4 is current `latest`** ([Zod v4 release](https://zod.dev/v4), [v4.0.0 PR](https://github.com/colinhacks/zod/pull/4844)) | **Both** |

**Exclusions (brief/plann — should not enter planner bundles):**

| Package | Latest | In package.json? | Risk |
|---|---|---|---|
| **@xyflow/react** | 12.11.1 (Jun 2026) | Yes `^12.11.0` | Bundle leak if imported from planner |
| **gsap** | 3.15.0 | Yes | Duplicate animation stack vs framer-motion |
| **lucide-react** | 1.23.0 | Yes | Conflicts with Phosphor-only rule |
| **swiper** | 14.0.1 | Yes | Marketing carousel — not planner |

---

## 2. Comparison table

| Package | plann (`START.md`) | PACKAGES.md | package.json | Latest | Match? | Action |
|---|---|---|---|---|---|---|
| **fabric** | 7.4, 2D engine | Tier-1 `7.4.0` | `7.4.0` | 7.4.0 | ✅ | Keep exact pin; document v8 watch (PACKAGES open Q3) |
| **three** | 3D engine | Tier-1 `^0.185.1` | `^0.185.1` | 0.185.1 | ✅ | Pin in PACKAGES (currently float) |
| **@react-three/fiber** | 3D stack | Tier-1, pin TBD | `^9.6.1` | 9.6.1 | ⚠️ | Update PACKAGES pin to `^9.6.1` |
| **@react-three/drei** | Locked 3D helpers | **Tier-2 deferred** Phase 06 | `^10.7.7` | 10.7.7 | ❌ | Resolve tier: either promote in PACKAGES + I-D or remove from planner until Phase 2 |
| **@puckeditor/core** | Admin composition | Tier-1 installing | `0.22.0` | 0.22.0 | ✅ | Keep admin-only; enforce route boundary |
| **@svgdotjs/svg.js** (+ select/resize) | **Admin-only** SVG authoring | **Explicitly skipped** (“redundant with fabric”) | Installed `^3.2.5` etc. | 3.2.5 | ❌ | **Governance decision required** — see §3 |
| **@flatten-js/core** | Geometry validation | Option A locked | `^1.6.12` | 1.6.12 | ✅ | Pin `1.6.12` in PACKAGES |
| **polygon-clipping** | Martinez booleans | Option A locked | `^0.15.7` | 0.15.7 | ⚠️ | Package current but **unmaintained**; benchmark `martinez-polygon-clipping@0.8.1` before Phase 1 gate |
| **dompurify** | Sanitize **before** SVGO | **Not in Option A** | `^3.4.11` | 3.4.11 | ⚠️ | Add to PACKAGES Option A or amend plann; use `isomorphic-dompurify` on server |
| **svgo** | Server-only optimize | Option A locked | `^4.0.1` | 4.0.1 | ✅ | Lock plugin config; prove absent from client bundles |
| **@resvg/resvg-js** | Canonical PNG | Option A locked | `^2.6.2` | 2.6.2 | ✅ | Stay on stable; track 2.7 alpha separately |
| **sharp** | Thumbnail derivatives | **Not in Option A** (resvg only) | `^0.35.2` | 0.35.3 | ⚠️ | Bump to `0.35.3`; reconcile plann dual-output vs PACKAGES resvg-only |
| **zustand** | Workspace state | Not listed | `^5.0.14` | 5.0.14 | ✅ | Add to PACKAGES Tier-1 planner runtime |
| **zundo** | Document undo only | Not listed | `^2.3.0` | 2.3.0 | ✅ | Add to PACKAGES; document `pause`/`setOnSave` for panel exclusion |
| **react-resizable-panels** | Desktop panels | Not listed | `^4.11.2` | 4.12.1 | ⚠️ | Bump minor; add to PACKAGES |
| **vaul** | Mobile drawers | Not listed | `^1.1.2` | 1.1.2 | ✅ | Phase 2 mobile; add to PACKAGES |
| **@ark-ui/react** | Menus, popovers, etc. | Tier-1 | `5.37.2` | 5.37.2 | ✅ | Keep pinned |
| **react-aria-components** | Catalogue a11y | Tier-1 | `1.19.0` | 1.19.0 | ✅ | Keep pinned |
| **@phosphor-icons/react** | Exclusive planner icons | Tier-1 `^2.1.10` | `^2.1.10` | 2.1.10 | ✅ | Audit Lucide usage; remove from planner paths |
| **framer-motion** | Shell motion only | **Tier-3 deferred** | `^12.41.0` | 12.42.2 | ❌ | Align tier with plann (promote) or defer shell animation |
| **@tanstack/react-query** | Catalogue lifecycle | Not listed | `^5.101.0` | 5.101.2 | ⚠️ | Bump patch; add to PACKAGES |
| **fuse.js** | Local ranking | Not listed | `^7.4.1` | 7.4.2 | ⚠️ | Bump patch; add to PACKAGES |
| **sonner** | Toasts | Not listed | `^2.0.7` | 2.0.7 | ✅ | Add to PACKAGES |
| **zod** | Descriptor validation | Tier-1 latest | `^4.4.3` | 4.4.3 | ✅ | Zod 4 locked; run codemod if v3 schemas remain |
| **@xyflow/react** | **Excluded** | Not listed | **Installed** | 12.11.1 | ❌ | Remove from planner import graph; keep only if non-planner feature needs it |
| **gsap** | **Excluded** | Not listed | **Installed** | 3.15.0 | ❌ | Block planner imports |
| **lucide-react** | **Excluded** | Skipped (Phosphor preferred) | **Installed** | 1.23.0 | ❌ | Planner migration to Phosphor per PHASE-1 §3 |
| **swiper** | **Excluded** | Not listed | **Installed** | 14.0.1 | ❌ | Marketing-only; bundle audit |

---

## 3. Conflicts: plann SVG pipeline vs PACKAGES Option A

### plann canonical pipeline (`START.md` §8)

```text
Puck admin → Zod → geometry validation → deterministic SVG compile
  → DOMPurify → locked SVGO → structural/visual compare
  → resvg PNG → Sharp thumbnails → Supabase revision
  → Fabric + Three adapters
```

Admin browser: Puck + **SVG.js** adapter. Server: compiler, **DOMPurify**, SVGO, resvg, **Sharp**. SVG.js must never enter planner chunks.

### PACKAGES Option A (`PACKAGES.md` §36–58, `implementation-decisions.md` §49–63)

```text
JSON spec → @flatten-js/core + polygon-clipping → assemble d=
  → svgo → public/ → fabric.loadSVGFromString
  → @resvg/resvg-js catalog PNG thumbs
```

Explicit skip: **`@svgdotjs/svg.js`** — “browser-only and redundant with fabric.” No DOMPurify, no Sharp, no Puck-in-pipeline, no Supabase revision model in PACKAGES table.

| Conflict | plann | PACKAGES Option A | package.json today |
|---|---|---|---|
| **SVG authoring** | SVG.js admin adapter | Skipped; JSON→`d=` only | SVG.js installed |
| **Sanitization** | DOMPurify before SVGO | Not specified | DOMPurify installed |
| **Thumbnails** | resvg canonical + **Sharp** derivatives | resvg only | Both installed |
| **Admin UX** | Puck composition + Zod fields | Puck for toolbar JSON (separate architecture diagram) | Puck installed |
| **Publication** | Immutable `PublishedRevision`, checksums, rollback | `scripts/generate-svg.mjs` → public/ + R2 | Both patterns emerging in code |
| **Security posture** | Allowlists + DOMPurify + “SVGO is not sanitization” | SVGO normalize only | Needs unified doc |

**Net:** `implementation-decisions.md` and `PACKAGES.md` are aligned with each other on Option A, but **`plann/START.md` is a superset** that adds SVG.js, DOMPurify, Sharp, and a richer publish contract. `site/package.json` follows the **plann superset** (SVG.js + DOMPurify + Sharp already present), which **violates PACKAGES skip rationale** unless a Global Standard Package Review re-opens SVG.js with benchmark cite per I-D §149–155.

---

## 4. Top 5 risks

1. **Dual SVG architecture without a merge decision** — Engineers can implement either JSON→`d=` (Option A) or Puck→SVG.js→compiler (plann). That splits tests, security fixtures, and determinism proofs ([PACKAGES.md skip of SVG.js](https://github.com/...) vs [plann §8 pipeline](file://plann/START.md)).

2. **`polygon-clipping@0.15.7` maintenance gap** — Last publish Dec 2023 ([npm](https://www.npmjs.com/package/polygon-clipping)); active Martinez fork at 0.8.1 Dec 2025 ([martinez-polygon-clipping](https://www.npmjs.com/package/martinez-polygon-clipping)). Boolean ops are safety-critical for openings/walls.

3. **Client bundle leakage of server-only stack** — SVGO 4 explicitly separates `svgo` vs `svgo/browser` ([migration guide](https://svgo.dev/docs/migrations/migration-from-v3-to-v4/)); resvg and sharp are native. PHASE-1 §9 requires proof Node-only packages are absent from planner chunks — high regression risk without CI import boundaries.

4. **Excluded packages already in dependency tree** — `@xyflow/react`, GSAP, Lucide, Swiper in `package.json` conflict with [UI Expert Brief exclusions](file://archive/docs/acceptance/UI%20Expert%20Planner%20ayushOverhaul%20Brief.md) and plann §5. Easy accidental import into `/planner/open3d`.

5. **Tier drift: drei + framer-motion** — plann locks both; PACKAGES defers drei (Tier-2) and framer-motion (Tier-3). Installed today anyway — undermines Global Standard Package Review gate ([implementation-decisions.md](file://plans/2026-07-05_phase1-execution/implementation-decisions.md) §149).

---

## 5. Top 5 edits for `plann/`

1. **`START.md` §5 — Add explicit authority line:**  
   *“When `PACKAGES.md` Option A and this document conflict, `implementation-decisions.md` + PACKAGES govern install pins; this document governs UX boundaries. SVG.js requires an approved Package Review (benchmark + anti-copy) before Phase 1 §8 checklist completion.”*

2. **`START.md` §8 — Reconcile pipeline with Option A:**  
   Either (A) adopt JSON→`d=` as compile input and demote SVG.js to optional visual aid only, or (B) formally supersede Option A skip with a dated decision log entry and updated PACKAGES table. Do not leave both as “approved baseline.”

3. **`PHASE-1.md` §8–9 — Split checklist by boundary:**  
   Add explicit rows: “DOMPurify server path uses `isomorphic-dompurify`”, “SVGO config hash locked”, “bundle audit fails if `svgo`, `@resvg/resvg-js`, `sharp`, `isomorphic-dompurify` appear in planner client graph”, “SVG.js absent from `/planner/open3d` chunk.”

4. **`PHASE-1.md` §3 — Icon exclusion enforcement:**  
   Tie “Remove emoji controls and use Phosphor” to “no `lucide-react` imports under `site/features/planner/`” (brief exclusion). Add static import audit gate.

5. **`START.md` §5 — Align tier table with PACKAGES:**  
   Mark `@react-three/drei` and `framer-motion` with the same Tier as PACKAGES *or* file a Package Review to promote them. Note `polygon-clipping` stale status and require boolean-op benchmark before reference blocks (§10).

---

## Sources

- [fabric (npm)](https://www.npmjs.com/package/fabric) (May 2026)
- [fabric.js v7.4.0 release](https://github.com/fabricjs/fabric.js/releases/tag/v740)
- [SVGO (npm)](https://www.npmjs.com/package/svgo) / [v4 migration](https://svgo.dev/docs/migrations/migration-from-v3-to-v4/)
- [sharp (npm)](https://www.npmjs.com/package/sharp) / [v0.35.0 changelog](https://sharp.pixelplumbing.com/changelog/v0.35.0/)
- [DOMPurify (GitHub)](https://github.com/cure53/DOMPurify) / [isomorphic-dompurify](https://www.npmjs.com/package/isomorphic-dompurify)
- [resvg-js (GitHub)](https://github.com/thx/resvg-js)
- [@puckeditor/core (npm)](https://www.npmjs.com/package/@puckeditor/core) / [Puck 0.22](https://puckeditor.com/blog/puck-022)
- [@flatten-js/core (npm)](https://www.npmjs.com/package/@flatten-js/core)
- [polygon-clipping (npm)](https://www.npmjs.com/package/polygon-clipping) / [martinez-polygon-clipping (npm)](https://www.npmjs.com/package/martinez-polygon-clipping)
- [SVG.js (GitHub)](https://github.com/svgdotjs/svg.js)
- [@ark-ui/react (npmx)](https://npmx.dev/package/@ark-ui/react/v/5.37.2) / [Ark UI GitHub](https://github.com/chakra-ui/ark/)
- [react-aria-components (npm)](https://www.npmjs.com/package/react-aria-components) / [v1.19.0](https://react-aria.adobe.com/releases/v1-19-0)
- [Zod v4](https://zod.dev/v4) / [v4.0.0 release PR](https://github.com/colinhacks/zod/pull/4844)
- [zundo v2.3.0](https://github.com/charkour/zundo/releases/tag/v2.3.0)
- On-disk: `plann/START.md`, `plann/PHASE-1.md`, `PACKAGES.md`, `site/package.json`, `plans/2026-07-05_phase1-execution/implementation-decisions.md`, UI Expert Brief
- npm registry queries executed 2026-07-05 (authoritative latest versions in tables above)

[REDACTED]