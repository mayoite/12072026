# ENTRYPOINT-MAP — P02 engine lock (live routes / hosts)

**Seat:** P02 B (docs only — no product edits)  
**Date:** 2026-07-10  
**Authority:** live `page.tsx` + host components + `next.config.js` redirects  
**Note:** Wins over stale `open3d/README.md` host table (README omits WorkspaceRoute).

---

## 1. Live planner routes (app router)

| URL | App page | Host chain |
|-----|----------|------------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` → dynamic `Open3dPlannerHost` → `Open3dNativeHost` → **`OOPlannerWorkspace`** |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` | Same WorkspaceRoute chain; `guestMode` from `!user` |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | **Direct** `Open3dPlannerHost` → `Open3dNativeHost` → **`OOPlannerWorkspace`** (no WorkspaceRoute / no ProjectSetupGate) |

### Guest — lines

`site/app/planner/(workspace)/guest/page.tsx`:

- L1: imports `Open3dPlannerWorkspaceRoute`
- L5: comment documents open3d hybrid + archive fallback `/planner/fabric/guest`
- L14: `<Open3dPlannerWorkspaceRoute guestMode planId={planId} />`

### Canvas — lines

`site/app/planner/(workspace)/canvas/page.tsx`:

- L1–2: WorkspaceRoute + `getOptionalPlannerUser`
- L6: comment documents open3d hybrid + archive fallback `/planner/fabric/canvas`
- L19: `<Open3dPlannerWorkspaceRoute guestMode={isGuest} planId={planId} />`

### Open3d pilot — lines

`site/app/planner/open3d/page.tsx`:

- L2: imports `Open3dPlannerHost` (not WorkspaceRoute)
- L7–8: comment — same stack as guest/canvas (Feasibility 2D + Three 3D)
- L27: `<Open3dPlannerHost guestMode={isGuest} planId={planId} />`

---

## 2. Host component chain (absolute paths + roles)

```
/planner/guest | /planner/canvas
  → Open3dPlannerWorkspaceRoute
      site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx
      L9–15  dynamic(Open3dPlannerHost, ssr:false)
      L17    comment: live guest + canvas under open3d tree
      L25–30 Providers → ProjectSetupGate → Open3dPlannerHost

/planner/open3d (skips WorkspaceRoute)
  → Open3dPlannerHost
      site/features/planner/ui/Open3dPlannerHost.tsx
      L10    → Open3dNativeHost

  → Open3dNativeHost
      site/features/planner/open3d/ui/Open3dNativeHost.tsx
      L13–14  FeasibilityCanvas (canvas-feasibility) + Three/r3f
      L16–20  mounts OOPlannerWorkspace

  → OOPlannerWorkspace
      site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

**Import graph proof (secondary):** `site/features/planner/open3d/cleanup/importGraphProof.ts` — stacks `open3d-hybrid` for guest/canvas/WorkspaceRoute; open3d route native host chain.

---

## 3. FeasibilityCanvas path + OOPlannerWorkspace mounts

| Item | Live path / lines |
|------|-------------------|
| Component file | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| Export (forwardRef) | ~L152–153 `export const FeasibilityCanvas = forwardRef...` |
| Editor barrel re-export | `site/features/planner/open3d/editor/index.ts` L3 |
| Workspace import | `OOPlannerWorkspace.tsx` L17–21 from `../canvas-feasibility/FeasibilityCanvas` |
| Mount A (Fabric furniture ON) | `OOPlannerWorkspace.tsx` L976–996 — Feasibility + furniture layer hidden via visibility |
| Mount B (default OFF) | `OOPlannerWorkspace.tsx` L1005–1025 — sole FeasibilityCanvas |
| Implementation | Canvas 2D API (`getContext("2d")`) — not Fabric, not Konva |

**Interim role:** sole interactive 2D furniture + walls when Fabric flag OFF; walls always stay on Feasibility when Fabric furniture overlay ON.

---

## 4. Lazy3DViewer + `getOpen3dViewerControlProps`

| Item | Live path / lines |
|------|-------------------|
| Lazy viewer | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` — `export function Lazy3DViewer` ~L137; default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` L145 |
| Orbit defaults + helper | `site/features/planner/open3d/3d/orbitDefaults.ts` |
| `OPEN3D_ORBIT_DEFAULT_ENABLED` | L7 `true as const` |
| `getOpen3dViewerControlProps()` | L13–14 returns `{ enableControls: true }` (literal type forces ON) |
| 3d barrel | `site/features/planner/open3d/3d/index.ts` re-exports Lazy3DViewer + helper |
| Workspace import | `OOPlannerWorkspace.tsx` L13–16 from `../3d/ThreeLazyViewer` |
| Product mount | `OOPlannerWorkspace.tsx` L1057–1060: |

```tsx
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  {...getOpen3dViewerControlProps()}
/>
```

**Lock note:** Product path **spreads** the helper (typed force `enableControls: true`). Do not “fix” lock by reverting to omit-prop-only; that would weaken the contract.

---

## 5. `canvas-fabric-stage` location (destination spike)

| File | Role |
|------|------|
| `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Env gate exact `"1"` |
| `…/FurnitureFabricLayer.tsx` | Fabric.js furniture overlay |
| `…/furnitureFabricMapper.ts` | Document ↔ Fabric pose (mm; entityId) |
| `…/furnitureFabricLayer.module.css` | Overlay styles |
| `…/index.ts` | Barrel |

**Not** the live default 2D path. Mounted only when `isOpen3dFabricFurnitureEnabled()` is true (`OOPlannerWorkspace.tsx` L997–1002).

---

## 6. Archive Fabric routes — redirected (not live app pages)

### No live `app/planner/fabric/**` pages

`site/app/planner/` tree has only: marketing, `(workspace)/guest`, `(workspace)/canvas`, `open3d` — **no** fabric route segment.

### Permanent redirects (live)

`site/config/build/next.config.js` L206–207:

```js
{ source: "/planner/fabric", destination: "/planner/open3d/", permanent: true },
{ source: "/planner/fabric/:path*", destination: "/planner/open3d/", permanent: true },
```

So documented “fallback” URLs **`/planner/fabric/guest`** and **`/planner/fabric/canvas`** (comments on guest/canvas pages L5–6; archive README) **do not serve archived Fabric UI** — they **308/301-style permanent-redirect to `/planner/open3d/`**.

### Archive source (not mounted by live routes)

`site/features/planner/_archive/fabric/`

- `editor/` — legacy PlannerWorkspace shell  
- `canvas-fabric/` — legacy Fabric floorplan canvas  
- `README.md` — deprecated 2026-07-03; replaced by open3d  

**Vitest path aliases** still map `@/features/planner/canvas-fabric` → archive for tests (`vitest.config.ts` / `vitest.site.config.ts`) — **not** a live route host.

### next.config archive aliases (build)

`site/config/build/next.config.js` ~L66–67 resolves planner editor/canvas-fabric package paths to `_archive/fabric/*` for residual imports — product guest/canvas/open3d pages do **not** mount that workspace.

---

## 7. Secondary surfaces (not product engine re-vote)

| Surface | Path | Note |
|---------|------|------|
| `Planner3DViewer` | `site/features/planner/3d/Planner3DViewer.tsx` | Still Three family |
| model-viewer preview | admin svg-editor | Not open3d workspace engine |
| Marketing planner pages | `app/planner/(marketing)/*` | Not workspace |

---

## 8. Absolute cite roots

- `D:\OandO07072026\site\app\planner\(workspace)\guest\page.tsx`
- `D:\OandO07072026\site\app\planner\(workspace)\canvas\page.tsx`
- `D:\OandO07072026\site\app\planner\open3d\page.tsx`
- `D:\OandO07072026\site\features\planner\ui\Open3dPlannerWorkspaceRoute.tsx`
- `D:\OandO07072026\site\features\planner\ui\Open3dPlannerHost.tsx`
- `D:\OandO07072026\site\features\planner\open3d\ui\Open3dNativeHost.tsx`
- `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`
- `D:\OandO07072026\site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx`
- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx`
- `D:\OandO07072026\site\features\planner\open3d\3d\orbitDefaults.ts`
- `D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\`
- `D:\OandO07072026\site\config\build\next.config.js`
- `D:\OandO07072026\site\features\planner\_archive\fabric\`
