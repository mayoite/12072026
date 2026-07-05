# Architecture docs — index

**Status:** Live index (update with each architecture revision)  
**Authority:** `plann/REVISION-2026-07-05.md` → [`docs/Lockedfiles/INDEX.md`](../Lockedfiles/INDEX.md) → files in this folder  
**Placement:** [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md) — start here for new code  
**Locked baseline:** [`docs/Lockedfiles/architecture/current.md`](../Lockedfiles/architecture/current.md) · [`proposed.md`](../Lockedfiles/architecture/proposed.md)

---

## Open this when…

| Task | Doc |
|------|-----|
| **Where new code goes** | [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md) |
| **New UI module (any surface)** | [`MODULE-UI-CONTRACT.md`](MODULE-UI-CONTRACT.md) → [`ui/MODULE-UI-CONTRACT-Locked.md`](../Lockedfiles/ui/MODULE-UI-CONTRACT-Locked.md) |
| **CSS folder / tokens / Tailwind role** | [`CSS-SOLUTION.md`](CSS-SOLUTION.md) |
| **Admin page or svg-editor** | [`ADMIN-UI-CONTRACT.md`](ADMIN-UI-CONTRACT.md) (UI-2) + MODULE-UI-CONTRACT |
| **Marketing / homepage** | [`SITE-MARKETING-UI-CONTRACT.md`](SITE-MARKETING-UI-CONTRACT.md) — **UI-3 deferred** |
| **Where code lives (C4, modules)** | [`COMPONENT_ARCHITECTURE.md`](COMPONENT_ARCHITECTURE.md) |
| **Request / save / publish flows** | [`DATA_FLOW.md`](DATA_FLOW.md) |
| **Deploy / infra** | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| **Phased UI execution** | `plann/UI-PLAN-REVISED-2026-07-05.md` |
| **Phased test gates** | `plann/TEST-PLAN-REVISED-2026-07-05.md` |

Redirects (do not extend): [`STRUCTURE_GUIDELINES.md`](STRUCTURE_GUIDELINES.md), [`SYSTEM_OVERVIEW.md`](SYSTEM_OVERVIEW.md).

---

## Authority stack

```text
plann/REVISION-2026-07-05.md          (1A open3d pilot, 1B SVG Option A, no SVG.js Phase 1)
  → plann/UI-PLAN-REVISED-2026-07-05.md
  → plann/TEST-PLAN-REVISED-2026-07-05.md
  → docs/Lockedfiles/ui/MODULE-UI-CONTRACT-Locked.md
  → docs/architecture/MODULE-LAYOUT.md      (where code goes)
  → docs/architecture/MODULE-UI-CONTRACT.md (surface + lint contract)
  → surface contracts (ADMIN-*, SITE-MARKETING-*)
  → CSS-SOLUTION.md (folder ownership)
```

When `plann/` and `PACKAGES.md` conflict on SVG tooling, **PACKAGES.md wins**.

---

## Phase 1 honesty (on disk today)

| Claim | Truth (2026-07-05) |
|-------|-------------------|
| `/planner/open3d` | **Real route** — sole Phase 1 promotion target |
| `PlannerCommand` | Exists in `lib/commands/`; **`useWorkspaceCanvas` still calls `dispatchOpen3dAction` directly** — 1A P0 is to wire the seam |
| Admin Puck | **`[id]` uses `<Render>` preview + JSON editor** — full `<Puck onPublish=…>` mount is **1B** |
| SVG compile | **Dual path open:** API → `svgPipelineRunner` (exec `generate-svg.mjs`) **and** in-process `svgCompiler.server.ts` — unify in 1B |
| SVG.js | **Not in Phase 1** production path (Option A) |

---

## Current vs proposed in this folder

| Doc | Current truth | Proposed target |
|-----|---------------|-----------------|
| Module placement | Dual planner trees on disk | [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md) — `open3d/` only for new pilot code |
| Component map | [`COMPONENT_ARCHITECTURE.md`](COMPONENT_ARCHITECTURE.md) § Current | Same file § Proposed |
| Data flows | [`DATA_FLOW.md`](DATA_FLOW.md) §1–4 legacy/guest | §5 open3d save; §6 SVG publish |
| Admin UI | JSON editor + `<Render>` preview | [`ADMIN-UI-CONTRACT.md`](ADMIN-UI-CONTRACT.md) — full Puck in 1B |
| Marketing UI | Reference dialect on `/` | Deferred until UI-3 — banner in SITE-MARKETING contract |
| Enforcement | `lint:ui` warn | `lint:ui:strict` in `release:gate:fast` after UI-1 shell |

Full snapshot: locked pair above.

---

## Expert review — when to use a subagent

| Doc / area | Expert needed? | Why |
|------------|----------------|-----|
| **MODULE-LAYOUT** | No | Coordinator + disk audit; optional for large folder moves |
| **MODULE-UI-CONTRACT** | No (locked) | Coordinator + `lint:ui` already defined |
| **CSS-SOLUTION** | No | Folder policy is stable |
| **COMPONENT_ARCHITECTURE** | **Optional** | C4 polish or security boundary review after 1A code refresh |
| **DATA_FLOW — §5 open3d save** | No | Verify from `persistence/` + `plannerCommandWiring.test.ts` |
| **DATA_FLOW — §6 SVG publish** | **Yes (1B)** | Security sequence (sanitize → compile → persist) before publish sign-off |
| **ADMIN-UI-CONTRACT** | **Optional (UI-2)** | When mounting full `<Puck>` — field chrome + publish UX |
| **SITE-MARKETING-UI-CONTRACT** | **Optional (UI-3)** | Dialect migration — not 1A/1B |
| **DEPLOYMENT** | **Yes (ops)** | Only when changing Vercel/Supabase/DO topology |

**Default:** parent agent updates architecture from disk; launch expert only for SVG security flow (TEST-2) and optional marketing migration (UI-3).

---

## Maintenance

- After **1A** acceptance: mark COMPONENT § Proposed items done; wire `lint:ui:strict`; confirm `PlannerCommand` wired in `useWorkspaceCanvas`.
- After **1B** acceptance: expand DATA_FLOW §6; unify SVG compile; expert-review SVG sequence.
- Update locked `architecture/current.md` / `proposed.md` when freezing a new baseline.
