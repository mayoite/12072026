# ANTI-THRASH-AUDIT — P02 engine lock (Fabric-sole upgrade protection)

**Phase:** P02 / CP-02  
**Date:** 2026-07-11  
**Verdict:** **Do not re-open engines. Do not restore Feasibility as product 2D.** Raise missing behavior **on Fabric**.

---

## 1. Locked stack (one sentence each)

| Layer | Role | Live |
|-------|------|------|
| **2D host** | Fabric.js v7 sole interactive plan canvas | `PlannerCanvasStage` → `Open3dFabricStage` (`data-testid="open3d-fabric-stage"`) |
| **Walls + furniture** | Drawn **in** Fabric stage | Layer visibility — not Feasibility; not flag overlay |
| **Flag leftover** | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` | Module + tests only — **not** host switch |
| **FurnitureFabricLayer** | Spike leftover | Not mounted by workspace |
| **FeasibilityCanvas** | Retired from product | Not mounted; source tree absent; restore = owner only |
| **3D planner** | Three + orbit ON | `Lazy3DViewer` + `getOpen3dViewerControlProps()` |
| **Banned** | Dual interactive 2D; Konva+Fabric parallel; prove gates on archive | konva absent |

---

## 2. Konva / second 2D lib greps

| Check | Result |
|-------|--------|
| `konva` / `react-konva` in `site/package.json` | **Absent** |
| Live 2D engine dep | `fabric` **exact `7.4.0`** |

**Package pins (snapshot):**

| Package | Live string |
|---------|-------------|
| `fabric` | `7.4.0` (exact) |
| `three` | `^0.185.1` |
| `@react-three/fiber` | `^9.6.1` |
| `@react-three/drei` | `^10.7.7` |
| `@google/model-viewer` | `^4.3.1` (admin boundary) |

---

## 3. Upgrade protection (reject downgrade)

| Claim | Live truth | Do not |
|-------|------------|--------|
| Product 2D | Fabric sole | Freeze “Feasibility interim” again |
| Missing select / Block2D / draw | Raise **on Fabric** | Un-archive Feasibility to “prove W3/W5/W8” |
| Flag OFF | Still Fabric host | Treat flag-OFF as Feasibility proof path |
| Archive Fabric shell | `_archive/fabric/` + redirects | Treat archive as live guest/canvas |
| Dual interactive hybrid | Banned | Mount Feasibility + Fabric hit-test both |

**Stale pack warning:** Pre-2026-07-11 `ENGINE-LOCK-RECORD` / maps that name Feasibility as interim are **invalid** on this tree.

---

## 4. Do not re-open engines

Agents **must not** open PRs / phases that:

- restore `FeasibilityCanvas` / `canvas-feasibility` as product 2D
- “evaluate Konva”, “try Babylon for workspace”, “add Pixi for 2D”
- “disable orbit permanently” on product Lazy3DViewer path
- invent a second product interactive 2D host
- re-platform guest/canvas off open3d without owner override
- invent a second `NEXT_PUBLIC_OPEN3D_*` fabric flag as host authority

**Fail-forward (owner-approved path only):** Konva **full** only after a **failed Fabric spike** with evidence under `results/` — not a parallel experiment alongside live Fabric.

---

## 5. Residual language (inventory only — not engine re-vote)

Expected grep hits; **do not** treat as license to thrash:

| Path | Residue |
|------|---------|
| `importGraphProof.ts` | stack enum `open3d-hybrid` for guest/canvas |
| `Open3dPlannerWorkspaceRoute.tsx` | “Production hybrid workspace” comment (means open3d tree, not dual 2D) |
| Test comment in `furnitureFabricMapper.test.ts` | still mentions “default product path remains FeasibilityCanvas” — **stale wording**; live host is Fabric (asserted by hostWiringP01) |
| Root `Readme.md` (if unupdated) | may still say Feasibility hybrid — **not** authority over this freeze pack |
| Plan cards | correctly name Fabric-sole; archive path `_archive/canvas-feasibility/` may be missing on disk |

After CP-02 green + owner sign-off, `ENGINE-LOCK-RECORD.md` + this audit **supersede** residual hybrid / Feasibility-interim wording for **agent engine choice**.

---

## 6. Schema residue (not a viewer)

- Generated DB types may mention `babylon_config` JSON columns — **not** a planner Babylon engine.

---

## 7. Honest status

| Item | Status |
|------|--------|
| Anti-thrash greps / live host check | **Yes** (this file) |
| Product package upgrades this seat | **None** |
| Second interactive 2D lib introduced | **No** |
| Feasibility product mount | **No** |
| CP-02 fully green | **No** — owner sign-off still OPEN (see `OWNER-SIGNOFF-STATUS.md`) |
