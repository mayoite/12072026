# UI scheme freeze (agent decisions)

**Date:** 2026-07-09  
**Authority:** User — keep current scheme; no visual redesign. Basics already locked.

## Call (do not re-open without user)

| Topic | Decision |
|-------|----------|
| Look & feel | **Freeze current scheme** — tokens + surfaces as-is |
| Tokens | `app/css/core/theme.css`, locked `site` / `admin` / `planner` CSS |
| Contract | `docs/architecture/MODULE-UI-CONTRACT.md` |
| Gate | `pnpm --filter oando-site run lint:ui:strict` (release:gate:fast) |
| Icons | **Phosphor only** |
| Planner chrome | React Aria + CSS modules / semantic utilities — not a new kit |
| Layout chrome | `react-resizable-panels` + `vaul` |
| Hard product path | SVG / modular mesh / 2D–3D — **must not** invent new marketing dialects |
| Fabric | Engine for **tools** later; does not rewrite shell chrome look |

## Surfaces (no cross-copy)

| Surface | Style rule |
|---------|------------|
| open3d | CSS modules + `--planner-*` / `--surface-*` — **no** Tailwind utilities in TSX |
| admin | Semantic utilities (`text-strong`, `bg-panel`, `border-soft`) — **no** slate/blue/zinc palette |
| site marketing | Existing typ/scheme classes — no new palette experiments in planner work |

## Forbidden drift

- New raw Tailwind palettes (`slate-*`, `blue-*`, `zinc-*`, `gray-*`, `emerald-*`)
- Hex in open3d `*.module.css`
- Lucide icons
- Second UI kit (Radix/Ark/MUI)
- Redesign of topbar/tool rail/panels “while we’re here”

## Allowed (not drift)

- Runtime canvas/WebGL colors (geometry, three materials)
- Fixing existing violations toward tokens
- Hard-path logic under open3d / svg-editor without changing shell CSS tokens

## Verify

```powershell
pnpm --filter oando-site run lint:ui:strict
```
