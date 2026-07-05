# Research synthesis (2026-07-05)

Cross-agent conclusions from four research runs. Full reports in sibling `RESEARCH-*.md` files.

## Authority

- **Product execution:** `plann/REVISION-2026-07-05.md` (sequencing), then `START.md`, `PHASE-1.md`, `PHASE-2.md`, `HANDOVER.md`
- **Governance pins:** `PACKAGES.md`, `plans/2026-07-05_phase1-execution/implementation-decisions.md`
- **When they conflict:** `PACKAGES.md` / I-D win on pins; revision wins on Phase 1A vs 1B order

## Unified verdict

`plann/` direction is validated by 2024–26 UI research. The blockers are **governance alignment** and **execution gaps in code**, not the benchmark model.

## P0 decisions

1. **SVG architecture** — **Locked Option A** per [`REVISION-2026-07-05.md`](REVISION-2026-07-05.md); `plann/START.md` amended.
2. **Wire `PlannerCommand`** — 1A blocker; shell polish secondary.
3. **Bundle boundaries** — no server-only or banned packages in `/planner/open3d` chunks.

## P0 UI (from plann compare)

- Bottom command / status surface (REC-03)
- Catalog search cap ≤24 (REC-02)
- Command palette (`Ctrl/Cmd+K`)
- Remove emoji / Lucide from planner chrome; Phosphor only
- Clarify layers IA (left dock vs bottom panel)
- Defer Phase 1 §8–10 SVG pipeline until 2D shell accepts

## P0 packages

- Review `polygon-clipping` (stale) vs `martinez-polygon-clipping`
- `isomorphic-dompurify` on server; externalize `resvg` + `sharp` in Next config
- Add zustand, zundo, react-query, fuse, sonner to `PACKAGES.md` tier table
- Resolve drei + framer-motion tier drift
- SVG.js: unused in code today — remove or justify via Package Review

## Reports

| File | Source |
|------|--------|
| `RESEARCH-2026-07-05-ui-benchmark.md` | UI patterns research |
| `RESEARCH-2026-07-05-ui-plann-compare.md` | UI vs plann + code audit |
| `RESEARCH-2026-07-05-packages.md` | Package versions + risks |
| `RESEARCH-2026-07-05-packages-plann-compare.md` | Packages vs plann + PACKAGES.md |

## Next doc edit

After revision: refresh `docs/Lockedfiles/<module>/proposed.md` from `plann/` + I-D. ~~update START §8~~ **done 2026-07-05**.
