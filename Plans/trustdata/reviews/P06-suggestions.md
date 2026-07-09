# P06 suggestions — planning expert (2026-07-09)

> **Status:** Applied into `phases/P06-save-honesty.md` (Expert revision note 2026-07-09).  
> **Method:** Repo verification of autosave / persistence / TopBar paths — trust **data**, not prior plan prose.  
> **Scope:** Plan-only. No product code.

## Verification snapshot (measured)

| Claim in plan | Live check | Result |
|---------------|------------|--------|
| Autosave IDB-only via `useOpen3dWorkspaceAutosave` | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | **True** — `createAutoSaver` / `loadProject` / `migrateGuestProjectToMember` only |
| Debounce 5000 ms | `persistence.ts` `AUTO_SAVE_DEBOUNCE_MS` | **True** |
| AutoSaver = schedule + cancel only | `createAutoSaver` return | **True** — no `flush`; no stored pending snapshot outside timer closure |
| Double-gate skip after timer | `if (now - lastSaved < AUTO_SAVE_DEBOUNCE_MS) return` | **True** — still present |
| Unmount cancel without flush | hook cleanup `saverRef.current?.cancel()` | **True** |
| No pagehide/visibility flush | grep under `features/planner` | **True** for open3d path |
| TopBar bare “Saved” | `TopBar.tsx` `isSynced ? … Saved` | **True** — W6 red |
| Workspace wires schedule only | `handleSave` → `schedulePersist()` | **True** — Save is still debounced |
| Shell passthrough name | `WorkspaceShell.tsx` | **Named** — JSDoc says `isSynced` = “synced to **server**” (lie) |
| Help over-claim | `helpSections.ts` | **True** — “members keep named save slots in their account” |
| Continuity unit only | `saveReloadContinuity.test.ts` | **True** — JSON envelope, not IDB hard reload |
| Status surface is TopBar only | `OOPlannerWorkspace` + `workspaceStatusLabels.ts` | **False in plan** — second pill uses `formatAutosaveStatus`; member **saved** → bare `"Saved"` |

**Routes (for W5 E2E):** guest open3d stack = `/planner/guest/?plannerDevTools=1` (helpers in `tests/e2e/guestProjectSetup.ts`). Also `/planner/open3d`. Prefer guest helpers + `clearPlannerStorage` for clean IDB.

---

## Suggestions (priority order)

### S1 — Dual W6 surfaces (critical)

Plan Task 04 targets TopBar only. Live UI has **two** buyer-visible save strings:

1. TopBar pill (`Modified` / bare `Saved` / `Ready`) via `isModified` / `isSynced`
2. Status-bar pill via `formatAutosaveStatus(autosave.status, guestMode)` — guest “Draft saved locally” is honest; **member “Saved” is not**

**Apply:** W6 must update **both**. Prefer **one pure label source** used by TopBar + status bar (extend `formatAutosaveStatus` **or** new helper both call — forbid two divergent copy tables).

### S2 — Name `WorkspaceShell.tsx`; kill server JSDoc

Plan said “verify shell name at edit time.” Verified: `site/features/planner/open3d/editor/WorkspaceShell.tsx` forwards `isModified` / `isSynced` / `onSave` to TopBar. JSDoc: “Whether project is synced to server.”

**Apply:** Lock shell path in touch list. Rename UI props toward `isLocalSaved` / `saveStatusLabel` through Shell → TopBar. Delete or rewrite “synced to server” language.

### S3 — W5 evidence subfolder `save-reload/`

RESULTS-MAP + CHECKPOINTS require `06-save-honesty/save-reload/` (or dual NOTES). Plan only names flat `06-save-honesty/`.

**Apply:** Put hard-reload Playwright log, run.json, PNGs under `results/planner/world-standard-wave/06-save-honesty/save-reload/`. Keep W6 copy/label logs at parent `06-save-honesty/`.

### S4 — AutoSaver pending snapshot + projectRef (flush correctness)

`scheduleSave(snapshot)` only captures snapshot inside the timeout closure. There is **no** module-level last-pending string for `flush()` without arg. Hook `schedulePersist` builds envelope from render `project`, not a ref — leave handlers can flush stale state if not careful.

**Apply:** Document required internals: `lastPendingSnapshot` (or equivalent) on AutoSaver; `projectRef.current` always latest for `flushPersist`. Flush path **must not** use the post-timer double-gate skip.

### S5 — Restore race before W5 edit

`OOPlannerWorkspace` sets `hydrated = true` immediately; restore runs async and may `replaceProject` after first paint. Edits or flush before restore can write default room over restored IDB (or race).

**Apply:** E2E waits for restore-complete (workspace ready / status idle after load) **before** seed edit. Optionally gate autosave schedule until restore effect settles (implementation detail — test must not race). Prefer **import JSON / known ids** for wall+furniture id assert when draw tools flaky (P07 owns full draw journey).

### S6 — Prefer guest Playwright path + existing helpers

Plan invents route ambiguity. Live: `enterGuestPlannerWorkspace` + `clearPlannerStorage` already clear `planner-workspace-db`.

**Apply:** Default W5 scenario on `/planner/guest/?plannerDevTools=1`; note member path as secondary if cloudEnabled stays false.

### S7 — Extend weak `planner-autosave.test.ts`

Current tests only check API shape / cancel does not throw — they do **not** mock `saveProject` or assert writes.

**Apply:** Task 01 requires inject/mock of `saveProject` (or persistence seam) so flush / debounce / double-gate are real assertions.

### S8 — Toast / Save button copy in workspace

`handleSave` sets `"Saving plan…"` / `"Saving draft…"` without local qualifier; post-save messages must not imply account.

**Apply:** Task 03/05 include workspace message strings next to TopBar/help.

### S9 — Reuse `PlannerSaveIndicator` ideas only (confirmed archive)

Live open3d does **not** mount `PlannerSaveIndicator` (fabric archive TopBar only). Labels like “Saved locally…” are the honesty pattern.

**Apply:** Keep out-of-scope for wholesale port; copy contract remains in open3d pure helper.

### S10 — Cloud default remains local-only

No open3d autosave call into `memberPlanRepository` / cloud API observed.

**Apply:** Keep Task 07 optional/cancelled by default; never ship bare “Saved” or account help while `cloudEnabled=false`.

---

## Suggested top 5 for plan revision (applied)

1. Dual W6 surfaces + single label source  
2. Lock WorkspaceShell path + honest props  
3. `save-reload/` W5 evidence layout  
4. Pending snapshot + projectRef flush contract  
5. Restore-before-edit + guest route for hard reload  

---

## Out of suggestion scope

- Product implementation  
- Claiming W5/W6 green  
- Cloud wire without owner unlock  
- Fabric full-stage cutover  
