# Open3D Planner — Next Steps

**Date:** 2026-07-04  
**Audience:** You (operator) + the next agent session  
**Status:** Native Open3D is now the live stack on `/planner/guest` and `/planner/canvas`.

---

## What just happened

### Routes (live)

| URL | Stack |
|-----|--------|
| `/planner/guest` | **Open3D** (`Open3dPlannerWorkspaceRoute`) |
| `/planner/canvas` | **Open3D** |
| `/planner/open3d` | Open3D pilot mirror (same host) |
| `/planner/fabric/guest` | Fabric fallback (archived stack) |
| `/planner/fabric/canvas` | Fabric fallback |

### Features wired this session

- Save draft / autosave (IndexedDB, guest + member)
- Export JSON + SVG (member menu); guest gets Export JSON
- Import JSON (member)
- Floor selector in top bar
- Live catalog from `/api/planner/catalog/configurator` with offline demo fallback
- Status bar pills (tool, zoom, selection, placement, catalog, save state)
- Loading skeleton while session restores

### Bug fixed: stuck on “Restoring your floor plan…”

**Cause:** The restore `useEffect` depended on `autosave`, which gets a new object every render. React re-ran cleanup (`cancelled = true`) before `setHydrated(true)` ran, and a guard ref blocked any retry — so the UI stayed on the loading screen forever.

**Fix:** Restore runs once per `guestMode` / `planId` entry, uses refs for stable callbacks, always calls `setHydrated(true)` in `finally`, and has a 4s safety timeout.

If you still see the spinner after pulling latest code: hard refresh (`Ctrl+Shift+R`) or clear site data for localhost.

---

## Quick smoke test (5 minutes)

1. `pnpm run dev` → http://localhost:3000/planner/guest/
2. Complete project setup wizard if shown (first visit only).
3. Confirm workspace loads past “Restoring your floor plan…” within a few seconds.
4. Library panel shows workstation SKUs (live catalog) or demo items (offline).
5. Press `W`, click canvas → draw a wall.
6. Pick a catalog item → click canvas → furniture places.
7. **Save draft** → status shows saving/saved.
8. **Export JSON** → file downloads.
9. Reload page → draft restores (if you saved).

---

## Known gaps (honest)

| Area | State | Notes |
|------|--------|------|
| Phase 05 acceptance | Not MET | Browser/visual/a11y evidence still open (`phases/05/evidence.md`) |
| Coverage | ~58% | Below 90% floor; not a runtime blocker |
| PDF / PNG export | Stub message | SVG + JSON work; PDF/PNG need export runner hook-up |
| 3D view | Basic | `Lazy3DViewer` mounts; not parity-tested vs Fabric |
| Fabric stack | Archived | `/planner/fabric/*` only; not maintained as primary |
| AI / sketch-to-plan | Stubs | `sketchToPlan.ts` is placeholder |
| Member plan by `?id=` | Partial | Autosave key includes plan id; UI for multi-plan list TBD |
| Old Fabric IDB snapshots | May ignore | Open3D parser skips invalid legacy JSON gracefully |

---

## Priority next steps (recommended order)

### P0 — Unblock daily use

1. **Verify restore fix** on your machine after restart (see smoke test above).
2. **Clear bad local state** if needed:
   - DevTools → Application → IndexedDB → delete `planner-workspace-db`
   - Or run in console: `indexedDB.deleteDatabase('planner-workspace-db')`
3. **Log blockers** in `Failures.md` with route + browser + console error.

### P1 — Core workflow completeness

4. **Canvas selection polish** — click furniture/walls → properties panel updates reliably.
5. **Door/window tools** — confirm placement on walls end-to-end in browser.
6. **SVG export with geometry** — draw walls first; export blocked until floor has walls/furniture.
7. **PNG export** — wire `downloadPNG` from `exportUtils.ts` (same preflight path as SVG).

### P2 — Phase 05 exit gates

8. **Browser evidence** — Playwright or manual checklist for guest flow (draw → place → save → export).
9. **Accessibility pass** — keyboard tool rail, skip link, focus traps in panels.
10. **Coverage** — target `WorkspaceShell`, `OOPlannerWorkspace`, `useOpen3dWorkspaceCatalog` tests.

### P3 — Product polish

11. **Onboarding** — align `ProjectSetupGate` copy with Open3D (still Fabric-era wording in places).
12. **Catalog images** — ensure configurator `previewImageUrl` renders in inventory cards.
13. **3D preview** — furniture + walls visible in `Lazy3DViewer`.
14. **Member dashboard** — link saved plans to `/planner/canvas?id=…`.

---

## Troubleshooting

### Stuck on “Restoring your floor plan…”

- Pull latest code (restore effect fix).
- Hard refresh.
- Clear IndexedDB (see P0).
- Check console for IndexedDB / parse errors.

### Empty library / “Offline catalog”

- Dev server must reach `/api/planner/catalog/configurator`.
- Check Network tab for 200 on that route.
- Demo items still work offline for placement testing.

### Fabric planner needed

- Use http://localhost:3000/planner/fabric/guest/

### Dev server port conflict

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
pnpm run dev
```

---

## Key files (edit here)

| Concern | Path |
|---------|------|
| Workspace shell | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| Canvas | `site/features/planner/open3d/canvas-fabric/FeasibilityCanvas.tsx` |
| Catalog hook | `site/features/planner/open3d/catalog/useOpen3dWorkspaceCatalog.ts` |
| Autosave | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` |
| Routes | `site/app/planner/(workspace)/guest/page.tsx` |
| Export | `site/features/planner/open3d/shared/export/exportUtils.ts` |
| CSS | `site/app/css/ooplanner/open3d-route-host.css` |

---

## Commands

```powershell
pnpm run dev
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d
pnpm --filter oando-site run typecheck
```

Evidence paths: `results/planner/phase-05/` per `testing-handbook.md`.

---

## One-line summary

Open3D is live on guest/canvas; restore hang is fixed; catalog + save/export work; next win is browser proof + PNG export + selection polish for Phase 05 sign-off.
