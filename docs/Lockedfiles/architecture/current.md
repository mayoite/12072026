# Architecture docs — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Live `docs/architecture/` refreshed 2026-07-05; **DATA_FLOW §5–6** and **COMPONENT_ARCHITECTURE Proposed** still lag **1A/1B** (not accepted).

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Doc | On disk today | Gap vs code |
|-----|---------------|-------------|
| **README.md** | Index + authority stack (2026-07-05) | Keep synced with revision |
| **MODULE-LAYOUT.md** | Target map; `open3d/` canonical for new pilot code | Dual legacy planner trees still on disk |
| **MODULE-UI-CONTRACT.md** | Anti-drift rules; locked copy in Lockedfiles | `lint:ui` warn only; strict not in fast gate |
| **ADMIN-UI-CONTRACT.md** | Proposed admin/svg-editor rules (2026-07-05) | Ahead of 1B Puck mount |
| **SITE-MARKETING-UI-CONTRACT.md** | Detailed Phase 1–10 migration | UI-3 deferred per revision |
| **CSS-SOLUTION.md** | Strong folder ownership | Linked to MODULE-UI-CONTRACT |
| **COMPONENT_ARCHITECTURE.md** | Current § Fabric-centric; Proposed § open3d | Current § stale vs pilot |
| **DATA_FLOW.md** | §1–4 legacy/guest Fabric | §5 open3d save + §6 SVG publish **missing** |
| **DEPLOYMENT.md** | Vercel + Supabase + DO | Reasonably current |

## Packages (on disk)

Architecture docs do not pin npm packages — see [`dependencies-engines/current.md`](../dependencies-engines/current.md).

---

## Summary

`docs/architecture/` is strong on **CSS/marketing** and improved on **module placement** (`README.md`, `MODULE-LAYOUT.md`, `ADMIN-UI-CONTRACT.md` added 2026-07-05). **Component map** and **data flows** still lag the open3d pilot and SVG publish path.

## Strengths

CSS ownership model clear. Marketing contract actionable. Deployment topology documented. Live index routes agents to MODULE-LAYOUT and UI contract first. Locked pairs mirror live docs.

## Weaknesses

COMPONENT_ARCHITECTURE Current § still Fabric-centric. DATA_FLOW missing open3d save and SVG publish sequences. Enforcement (`lint:ui:strict`) not yet in fast gate. Expert review for DATA_FLOW §6 deferred to **1B** sign-off. **1A not accepted.**
