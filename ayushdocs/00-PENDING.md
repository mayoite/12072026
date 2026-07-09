# Pending list (owner)

**Last updated:** 2026-07-09 (P0.1 completed)  
**Rule:** finish P0.n fully before starting P0.n+1. Resolve blockers; do not park them.

Legend: `P0` product spine · `P1` hard path · `P2` plan/platform · `OPS` infra

---

## P0 — Product spine

| # | Item | Status |
|---|------|--------|
| **P0.1** | Admin SVG publish browser E2E + **dev auth bypass** | **DONE** — `results/planner/p0-1-admin-svg-publish/` (2 Playwright tests, screenshots) |
| **P0.2** | G5 → storage → stamp → G8 browser load | **NEXT** |
| **P0.3** | Open3d a11y: nested `main` + hydration `data-viewport` only | Pending (after P0.2) |
| **P0.4** | “Good mesh” bar for cabinet-v0 + browser visual smoke | Pending |

### P0.1 done means
- `DEV_AUTH_BYPASS=1` works for local admin (proxy + layout + API + CSRF skip)
- `/admin/svg-editor` opens without `/access` redirect
- `POST /api/admin/svg-editor` publishes `side-table-001` → success
- Playwright images in `results/planner/p0-1-admin-svg-publish/`

### P0.1 residual (not a P0.1 fail)
- Full `next build` still fails on `/contact` (`createContext is not a function`) — E2E used **dev server**. Fix under **build gate** (not P0.2).

---

## P1 — After P0

| # | Item |
|---|------|
| P1.1 | Fabric flag ON browser smoke |
| P1.2 | Fabric full cutover |
| P1.3 | G8: refuse path-only stamp without bytes (or always upload) |
| P1.4 | S5 PNG thumbs on publish |
| P1.5 | Dual sanitizer cleanup (optional) |

---

## P2 — Plan / platform

| # | Item |
|---|------|
| P2.1 | Remaining 2A gates |
| P2.2 | Full 2B browser draw→save→reload |
| P2.3 | 2C Supabase descriptors/assets |
| P2.4 | Modular beyond cabinet-v0 |

---

## OPS

| # | Item | Call |
|---|------|------|
| OPS.1 | SSR cloud | Later · **2 CPU / 32 GB** |
| OPS.2 | Keys | `.env.local` + `site/.env.development.local` for bypass |
| OPS.3 | Figma library | Optional — **not needed for P0**; blocked until MCP auth |

---

## Decided (not pending)

- crypto IDs · no designer GLB · publish authority = pipelineCore+S1 · no worktrees  
- **Dev auth bypass** for development only (never public prod without explicit dual flags)

---

## Next action

**Start P0.2 only** — modular GLB upload to storage + stamp + Chrome load in open3d.
