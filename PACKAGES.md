# Packages

Locked packages for the **`open3d-next-staging`** Next 16 + React 19 workspace and the broader oando.co.in planner stack (2026-07-04). This is the read-only ground truth for what we install, what we defer, and why. Any change here is a `plannnerplan/` wide change.

> Read with: `AGENTS.md`, `Readme.md`, `plannnerplan/IMPLEMENTATION-DECISIONS.md`, `plannnerplan/phases/conversion/benchmark.md`.

## Tiering

| Tier | Meaning | Install gate |
| --- | --- | --- |
| **Tier-1 locked** | Installing now; locked reasons on the line | `pnpm add` allowed today |
| **Tier-1 deferred** | Lock-deferred; pinned version kept in `package.json` table but not installed until Step 2 owns it | `pnpm add` only with explicit ask |
| **Tier-2 candidate** | Recommendation + alternatives; no install yet | Decision gate is the next plan |
| **Tier-3 reserved** | Marketing / one-off surfaces only | Opt-in only |

Every locked line carries: package, version pin (or "float"), rationale, alternative considered, and the explicit reason that alternative was skipped. No claims without proof.

## Tier-1 locked

### Engine (canvas + 3D)

| Package | Pin | Role |
| --- | --- | --- |
| `three` | `^0.185.1` | WebGL/WebGPU renderer; already in `package.json` |
| `@types/three` | `^0.185.0` | TS types; already in `package.json` |
| `@react-three/fiber` | decimal place TBD in Step 2 | React renderer on top of three.js; r3f layer is open from prior research |

**Skip rationale:**
- Two graph `.svelte.ts` rune files in donor were tried but won't port — Svelte 5 runes are donor-specific. Fine-grained state lives in signal libraries instead, and only when Step 2 needs them.
- `@pmndrs/uikit` considered; skipped — assumption-driven UI controls without our token system. We keep raw primitives so tokens flow through CSS variables.

### SVG pipeline (Option A — locked)

The pipeline shape:

```
JSON spec → @flatten-js/core (measure) + polygon-clipping (booleans)
  → assemble d= → svgo → write public/
  → fabric.loadSVGFromString(canvas) → @resvg/resvg-js renders catalog PNG thumbs
```

| Package | Role | Why this one |
| --- | --- | --- |
| `@flatten-js/core` | segment / closest-point / area / perimeter helpers | Mature, small, geometry-first API; the maths we reach for repeatedly |
| `polygon-clipping` | boolean ops on multi-polygons (Martinez algorithm) | Battle-tested for union / difference / intersection / xor; the only sound public-domain option |
| `svgo` | per-output path optimization | Standard, well-maintained, Node-native |
| `@resvg/resvg-js` | catalog PNG thumbs | Pure Rust renderer, no Chromium, clean Node embedding |
| `fabric` (current: `7.4.0`) | canvas runtime + `loadSVGFromString` | Already the canvas engine |

**Skip rationale:**
- `svg-path-commander` — looked useful for editing `d=` strings, but we build `d=` ourselves and `svgo` already normalizes. One fewer dep.
- `@svgdotjs/svg.js` — browser-only and redundant with `fabric`.
- `paper.js` — overkill; we'd write a subset of what `@flatten-js/core` already gives.
- Playwright/Puppeteer in build scripts — **not blocked** by the AGENTS.md test rule (that rule is about test execution, not build scripts). `@resvg/resvg-js` is still preferred for thumbnail generation because it's faster and doesn't require a browser runtime, but Playwright/Puppeteer in `scripts/generate-svg.mjs` is allowed with explicit permission for the build script itself.

### Icons

| Package | Pin | Role |
| --- | --- | --- |
| `@phosphor-icons/react` | `^2.1.10` | Icon system; preferred over Lucide for tone / weight flexibility |

**Skip rationale:**
- `lucide-react` — fine, but Phosphor's weight variants (thin/light/regular/bold/duotone/fill) map cleanly to density tiers; Lucide is stroke-only.

### Framework / runtime

`next ^16.2.9`, `react ^19.0.0`, `react-dom ^19.0.0` — already locked.

## Tier-1 locked (SVG pipeline)

| Package | Pin | Role | Status |
| --- | --- | --- | --- |
| `@flatten-js/core` | latest | segment / closest-point / area / perimeter helpers | **INSTALLING NOW** |
| `polygon-clipping` | latest | boolean ops on multi-polygons (Martinez algorithm) | **INSTALLING NOW** |
| `svgo` | latest | per-output path optimization | **INSTALLING NOW** |
| `@resvg/resvg-js` | latest | catalog PNG thumbs | **INSTALLING NOW** |

Implementation: `scripts/generate-svg.mjs` will use these packages to generate SVGs from JSON specs and render PNG thumbnails.

## Tier-1 deferred (Step 2 / Phase ownership)

| Package | Status | Owner step | Reason deferred |
| --- | --- | --- | --- |
| `@mantine/core` + `@mantine/hooks` + `@mantine/notifications` + `@mantine/modals` + `@mantine/spotlight` + `@mantine/dropzone` + `@mantine/form` + `@mantine/charts` + `@mantine/tiptap` | Optional Tier-1 | Step 2 chrome | Mantine's PostCSS namespace layered Tailwind v4 + `@tailwindcss/postcss` only after Step-2 wires the multi-CSS split (`site/app/css/core/planner/bundles/*` mirror). To avoid namespace collision risk in Phase 01A, only `@mantine/hooks` is allowed if user signals yes |
| `fabric-editor-kit` | Reserved Tier-2 | Phase 03A / Phase 05 | Single-maintainer (`tskonda-dev`), bus-factor risk; useful layer once Step 2 needs editor chrome we don't want to hand-roll |
| `drei` (React-Three fiber ecosystem helpers) | Reserved Tier-2 | Phase 06 3D | Helpers are nice but Step 2 doesn't need them; revisit when 3D proof-of-view lands |

## Tier-1 locked (Planner toolbars + admin panel)

| Package | Pin | Role | Status |
| --- | --- | --- | --- |
| `@ark-ui/react` | latest | headless primitives — state-machine powered, 45+ components | **INSTALLING NOW** |
| `react-aria-components` | latest | combobox / date picker / virtualized listbox gaps | **INSTALLING NOW** |
| `@puckeditor/core` | latest | admin visual editor → JSON → React tree | **INSTALLING NOW** |
| `@vercel-labs/json-render` | latest | AI-agent-returned UI trees | **INSTALLING NOW** |
| `zod` | latest | schema for the block descriptors | **INSTALLING NOW** |

### Architecture

```
admin operator writes JSON → app/uploads/*.json
       ↓
<Puck> editor mounts an editor in /admin/<surface>/edit
       ↓
publish → save JSON (puck.data) + components.name list (puck.config)
       ↓
public render: <Puck.Render config={registry} data={json} />
       ↓
registry entries = Ark UI primitives wrapped as Puck blocks
```

The toolbar atoms are Ark UI primitives. Admins compose them through Puck JSON in the panel. That's the split that buys "more modular and admin-driven".

### Skipped

- `@radix-ui/react-*` — kept as fallback baseline. Ark UI is more modular (state-machine per primitive) and has broader component coverage at the same granularity.
- `Builder.io` — commercial SaaS, lock-in, recurring cost. Rejected.
- `grapesjs` — HTML-first, not React-friendly. Rejected.
- `react-jsonschema-form` — forms only, not full layouts. Puck handles layout; rjsf may be added later for form-specific needs.

## Tier-3 reserved

| Package | Reserved for | Why deferred |
| --- | --- | --- |
| `figma-exporter` (Chrtyaka) | Marketing landing pages only | Output is Figma-styled components; planner chrome is out of scope; we will not gate Step 2 on this |
| `motion` / `framer-motion` | Animations | Add when a tool rail needs entrance/exit animation; current Step 2 chrome is graceful-degrade only |
| `@tiptap/*` | Rich text | Step 5+ notes annotations |

## Open questions

1. **Mantine?** Proposed in earlier research at +`@mantine/hooks` only to dodge the Tailwind v4 PostCSS namespace collision. Still waiting on user signal before pinning to Tier-1 host packages. AGENTS.md scope says `site/` ships the token layer for planner; if you say yes, `@mantine/hooks` is the only Tier-1 hook we'd allow in Phase 01A.
2. **Kit tier (fabric-editor-kit, Pascal Editor, drei)** — none in Phase 01A. Step 2 plan should pick from these if (and only if) the chosen toolkit earns its place. Recommendation so far: build a thin homegrown block tree on Puck + Ark UI, only adopt a fuller kit if its leverage shows up in a real screen.
3. **Fabric JS v7 backwards-compat plan** — when v8 lands, what is the lift? Watch release notes; defer until then.

## Evidence

Reasoning sources for this doc (research notes kept under `plannnerplan/` and conversations referenced from the campaign log):
- `@ark-ui/react` v5.36.2 — Chakra Systems Inc., MIT, 824.4K weekly DLs, 609 versions, state-machine powered via Zag.js. Source: `https://ark-ui.com/`, npm registry.
- `@puckeditor/core` — Measured Co., MIT, ~12.8K stars. Source: `https://github.com/puckeditor/puck`.
- `react-aria-components` — Adobe, Apache 2.0, WAI-ARIA reference.
- `@radix-ui/react-*` primitives — WorkOS, MIT, ~18K stars, individual packages per component.
- `@headlessui/react` — Tailwind Labs, MIT, ~28K stars, smaller component set (~16).

If a claim in this doc can't be traced back to the registry or a screenshot you can show, treat it as suspect.
