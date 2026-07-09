# Pending list (owner)

**Last updated:** 2026-07-09  
**Priority order = kill-paths that raise the real quality bar** (not more skeleton docs).

Legend: `P0` must for “good enough product spine” · `P1` next · `P2` later · `OPS` infrastructure

---

## P0 — Product spine (do next)

| # | Item | Why pending | Done when |
|---|------|-------------|-----------|
| P0.1 | **Admin SVG publish browser E2E** | Unit/CLI only; no signed-off UI publish | You publish one block in admin UI → `public/svg-catalog/{slug}.svg` updates; fail shows error |
| P0.2 | **G5 → storage → stamp → G8 browser load** | Binary exists in memory; upload + real Chrome load open | Place modular (or stamp) → file under `catalog-assets/generated/` → 3D loads mesh (not only boxes) |
| P0.3 | **Open3d a11y: nested `main` + hydration `data-viewport`** | Live report not clean | Single main landmark; no hydration mismatch on `/planner/open3d` |
| P0.4 | **Honest “good mesh” bar for cabinet-v0** | Still stacked boxes | Document quality bar + one visual browser smoke recorded |

---

## P1 — Hard path residuals

| # | Item | Notes |
|---|------|--------|
| P1.1 | Fabric flag ON browser smoke | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` |
| P1.2 | Fabric full cutover (walls/rooms/tools) | Still FeasibilityCanvas for walls |
| P1.3 | Path-only stamp without upload | Can 404 G8 — either block G8 until file exists, or always upload |
| P1.4 | S5 PNG thumbs on publish | Still stub / URL only |
| P1.5 | Dual sanitizer stacks | Publish uses pipelineCore path; V1 DOMPurify path remains reference |

---

## P2 — Plan phase / platform

| # | Item | Notes |
|---|------|--------|
| P2.1 | Close remaining **2A** UI gates if still open | Master plan sequencing |
| P2.2 | Full **2B** draw→save→reload browser acceptance | Unit continuity exists |
| P2.3 | **2C** Supabase descriptors + assets | Still disk `block-descriptors/` |
| P2.4 | Expand modular beyond cabinet-v0 | L/U, doors library quality |

---

## OPS — Infrastructure

| # | Item | Call already made |
|---|------|-------------------|
| OPS.1 | **SSR cloud** | **Later** — when shared URL needed |
| OPS.2 | Size | **2 CPU / 32 GB** (not 4/64 yet) |
| OPS.3 | Keys | Already in `.env.local` — copy names to server when ready |
| OPS.4 | Figma Code Connect / library | **Blocked** — Figma MCP auth required |

---

## Explicitly NOT pending (decided)

| Item | Status |
|------|--------|
| Entity IDs | crypto.randomUUID / `newEntityId` only |
| Designer static GLB | Removed; policy enforces generated path |
| Publish compile authority | `pipelineCore` + S1 normalize via `compileSvgForPublish` |
| V1 compiler | Reference-only (not live publish) |
| Worktrees | Forbidden — main checkout only |

---

## Suggested next single action

**Pick one kill-path:**

1. **P0.1** Admin publish browser E2E, or  
2. **P0.2** GLB upload + Chrome load, or  
3. **P0.3** A11y nested main + hydration  

Do not start SSR until you need a shared URL.
