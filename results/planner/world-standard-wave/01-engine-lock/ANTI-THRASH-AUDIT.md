# ANTI-THRASH-AUDIT — P02 engine lock

**Seat:** P02 B (docs only — no product edits)  
**Date:** 2026-07-10  
**Verdict:** **Do not re-open engines.** Stack is locked by live code + Approach A; residual “hybrid” labels are inventory, not permission to thrash.

---

## 1. Locked stack (one sentence)

| Layer | Role | Live |
|-------|------|------|
| **2D interim** | FeasibilityCanvas (Canvas 2D API) | sole interactive 2D when Fabric flag OFF |
| **2D destination** | Fabric.js v7 full stage (`canvas-fabric-stage` spike) | flag default OFF; furniture-only overlay when ON |
| **3D planner** | Three + R3F + orbit ON | `Lazy3DViewer` + `getOpen3dViewerControlProps()` |
| **Banned** | Dual interactive 2D hybrid; Konva+Fabric parallel | konva absent; product must not add second interactive 2D lib |

---

## 2. Konva / second 2D lib greps

| Check | Result |
|-------|--------|
| `konva` / `react-konva` in `site/package.json` | **Absent** |
| `konva` / `react-konva` / `pixi` / `paper.js` under `site/features/planner/**/*.{ts,tsx,js,jsx,json}` | **No matches** |
| Live 2D engine deps | `fabric` **exact `7.4.0`**; Canvas 2D (Feasibility, no package) |

**Package pins (snapshot — product engines only):**

| Package | Live string |
|---------|-------------|
| `fabric` | `7.4.0` (exact) |
| `three` | `^0.185.1` |
| `@react-three/fiber` | `^9.6.1` |
| `@react-three/drei` | `^10.7.7` |
| `@google/model-viewer` | `^4.3.1` (admin boundary — not workspace engine) |

---

## 3. Fabric destination vs Feasibility interim

| Claim | Live truth | Do not |
|-------|------------|--------|
| Destination 2D | Fabric.js v7 full stage (Approach A / Plan 2B) | Claim full walls cutover shipped |
| Interim 2D | `canvas-feasibility/FeasibilityCanvas.tsx` | Delete Feasibility “because Fabric exists” |
| Furniture spike | `canvas-fabric-stage/` gated by exact env `"1"` | Ship dual interactive furniture (Fabric + Feasibility both hit-test furniture) |
| Flag default | OFF | Flip ON as silent product default without cutover phase |
| Archive Fabric workspace | `_archive/fabric/` + redirects to `/planner/open3d/` | Treat archive as live guest/canvas |

**Dual interactive hybrid banned:** When Fabric furniture flag is ON, workspace **hides** Feasibility furniture layer (`furniture: false`) and mounts `FurnitureFabricLayer` only for furniture; walls remain Feasibility. Product must **not** run two independent interactive furniture hit targets at once.

---

## 4. Do not re-open engines

Agents **must not** open PRs / phases that:

- “evaluate Konva”, “try Babylon for workspace”, “add Pixi for 2D”
- “disable orbit permanently” on product Lazy3DViewer path
- “Fabric is only insurance — delete stage”
- re-platform guest/canvas off open3d without owner override
- invent a second `NEXT_PUBLIC_OPEN3D_*` fabric flag reader

**Fail-forward (owner-approved path only):** Konva **full** only after a **failed Fabric spike** with evidence under `results/` — not a parallel experiment alongside live Fabric destination.

---

## 5. Residual language (later docs pass — not engine re-vote)

Expected grep hits; **do not** treat as license to thrash:

| Path | Residue |
|------|---------|
| `site/features/planner/open3d/README.md` | Title “production hybrid”; stack prose |
| `site/features/planner/open3d/cleanup/importGraphProof.ts` | stack enum `open3d-hybrid` for guest/canvas |
| `site/app/planner/(workspace)/guest/page.tsx` L5 | comment “open3d hybrid” + fabric archive fallback URL |
| `site/app/planner/(workspace)/canvas/page.tsx` L6 | same |
| `Open3dPlannerWorkspaceRoute.tsx` L17 | “Production hybrid workspace” comment |
| Archive README | documents `/planner/fabric/*` rollback (routes now redirect) |

After CP-02 green + owner sign-off, `ENGINE-LOCK-RECORD.md` + this audit **supersede** residual “hybrid / under evaluation” wording for **agent engine choice**. Mass README rewrite is out of P02 B scope unless owner asks.

---

## 6. Schema residue (not a viewer)

- Generated DB types may mention `babylon_config` JSON columns — **not** a planner Babylon engine. Do not invent a Babylon viewer from column names.

---

## 7. Honest status

| Item | Status |
|------|--------|
| Anti-thrash greps complete | **Yes** (this file) |
| Product package upgrades this seat | **None** |
| Second interactive 2D lib introduced | **No** |
| CP-02 fully green | **No** — owner sign-off still OPEN (see `OWNER-SIGNOFF-STATUS.md`) |
