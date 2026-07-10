# Expert pass — React / Next open3d workspace (P03 · P04 · P06 · P07)

**Date:** 2026-07-09 · **Mode:** plan-only · **No product code**  
**Role:** React/Next open3d workspace expert  
**Inputs:** `INDEX` kill order; phases P03/P04/P06/P07 (+ appendices glance); live `OOPlannerWorkspace`, hosts, autosave, `FeasibilityCanvas` select, keyboard. Research: DONE (no re-scrape).

---

## Verdict: **FIX**

Kill order and file maps match live architecture (Approach A: Feasibility + document model → Lazy3D). Plans correctly name the real W3/W4/W5–W6 gaps. **Not SHIP:** a few plan “truths” disagree with live units/paths and would thrash execute. **Not BLOCK:** no engine re-open; hosts/shell stack is coherent.

---

## Must-fix (P0)

1. **W3 select→delete→undo (spine #3):** Live select path works (`FeasibilityCanvas` → `pickFurnitureAtPoint` → `setSelection`). Gaps match P03: no `applySelectionDelete`; `deleteSelection` loops N× `updateProject` (multi-history); Del/Bksp **no** `preventDefault`; Esc cancel **does not** clear selection; no pickFurniture / Del-Bksp unit suites; no browser under `03-select-delete/`. Execute pure helper → single `updateProject` → keyboard preventDefault → Esc clears selection → unit then browser.
2. **W4 orbit wiring:** Defaults ON in `ThreeLazyViewer` / `ThreeViewerInner`; workspace still `<Lazy3DViewer projectData={…} />` with **no** explicit `enableControls={true}`; **no** `data-orbit-enabled`. Do not claim orbit from defaults alone (P04 three-layer rule is right).
3. **W5–W6 save honesty:** Hook is IDB-only; `createAutoSaver` = schedule + cancel (**no flush**); unmount `cancel()` drops debounce; Save = `schedulePersist` only; TopBar bare **Saved** + member `formatAutosaveStatus` bare **Saved**; Shell JSDoc still “synced to **server**”. Flush + projectRef + dual-surface labels required as P06 states.
4. **Rotation unit lock (plan fix before execute):** Live **furniture document rotation = degrees** (`normalizeDegrees`, pureActions `% 360`); `pickFurnitureAtPoint` converts degrees→rad for hit math; wall **scene** rotation = `atan2` (radians); mesh factory treats node.rotation as Three radians. **P04 “document + scene nodes = radians” is false for furniture.** Document↔node equality is the W4 bar — **do not** convert furniture to radians mid-spine.
5. **P07 metrics helpers are valid on open3d:** `WorkspaceShell` footer has `pw-status-bar` + `N walls` / `N objects` / `N furniture`. Reuse `getWallCount`/`getObjectCount`; add `getFurnitureCount`. Require **deltas** (guest seed walls ≥4). Spec missing — create only after unlock.

---

## Should-fix (P1)

- Host chain truth: `app/planner/open3d` → `features/planner/ui/Open3dPlannerHost` → `open3d/ui/Open3dNativeHost` → `OOPlannerWorkspace`; guest/canvas → `Open3dPlannerWorkspaceRoute` (+ gate) → same Host. Prefer guest `?plannerDevTools=1` for clean IDB (P06/P07).
- Prove W3/W7 with Fabric furniture flag **OFF** (default); flag-ON selects via Fabric overlay — dual selection store thrash.
- Inventory selectors OK (`Search catalog elements`, `Add … to canvas`); cabinet-v0 + sample-desk-1 live in `demoCatalogItems.ts`.
- `INITIAL_TRANSFORM` origin `-4000,-2500` scale `0.1` matches P03 Task 05 — avoid `fitToView` in pointer units.
- P06 restore race: `hydrated` forced true; restore async — E2E must wait restore-complete before seed/flush.
- Parallel fill (orbit/symbols) only after CP-02; do not steal slots from W3 browser / journey / save spine.

---

## False-reverse risks (rewrite after execute)

| Trap | Why fatal |
|------|-----------|
| Convert furniture rotation document → radians for P04 wording | Rewrites pick, furniture actions, pureActions, fabric mapper, fixtures |
| Treat mesh `-rotation.y` as pose drift | Document↔node is authority; sign flip intentional for mesh |
| Multi-history delete “good enough” | Undo cannot restore multi-id selection in one Z |
| Fabric full-stage cutover for select/delete | Violates Approach A; dual engines mid-W3 |
| Claim W4 orbit from default prop only | Silent workspace omit still “works”; no Playwright truth |
| Leave-path still `cancel()` without flush | W5 hard-reload flaky forever |
| Bare “Saved” / `isSynced` as cloud | W6 lie; buyer trusts account backup that is IDB |
| Absolute wall count ≥1 for W1 | Guest seed false-green |
| J4 e2e grammar (button 3D, middle-drag, canvas testid as canvas) | open3d: radio 2D\|3D; `planner-3d-canvas` is **div** |
| Port open3d 3D to R3F mid-gate | Live = imperative Three + OrbitControls |

---

## Path truth (wrong / clarify in plan)

| Plan claim | Live fact |
|------------|-----------|
| P04 document+nodes radians | Furniture doc/nodes **degrees**; walls scene **radians**; mesh assumes radians |
| Hosts under open3d only | **Host/route:** `site/features/planner/ui/Open3dPlannerHost.tsx`, `Open3dPlannerWorkspaceRoute.tsx`; **native:** `open3d/ui/Open3dNativeHost.tsx` |
| `applySelectionDelete` exists | **Missing** — only `deleteEntityFromProject` + looped workspace delete |
| `enableControls` workspace wired | **Gap** ~L756 `OOPlannerWorkspace.tsx` |
| AutoSaver flush | **Absent** — `site/features/planner/persistence/persistence.ts` schedule/cancel only |
| `deleteSelection.test.ts` / `orbitControlsDefault.test.ts` / journey e2e | **Not present** (create on execute) |
| Evidence `03-` / `02-` / `04-` / `06-save-honesty/` | Gate folders **not landed** yet |

**Handover:** After unlock: spine P03 (unit+browser) → P07 journey deltas → P06 flush+labels; parallel P04 only with explicit orbit + degrees-honest pose units. Superpowers; no worktrees; MIT/open only (`ayushdocs/17-LICENSES-CLEARED.md`).
