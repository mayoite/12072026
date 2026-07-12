# P06 — Save honesty (W5–W6)

**Status:** **PASS** (agent 2026-07-12 — unit + browser id continuity re-run this checkout)

**Gates:** **W5** save → hard reload → same wall + furniture **ids** · **W6** status copy never implies cloud when only IDB.

**Evidence:** `results/planner/world-standard-wave/06-save-honesty/`  
**W5 subfolder:** `…/06-save-honesty/save-reload/`  
**CP:** [CP-06](./CHECKPOINTS.md) · [BOARD](./BOARD.md)

**Goal:** Edit → leave or hard-reload → same entity ids; every status string tells **local browser** vs **cloud** truth.

---

## Gaps (closed on this tree — re-verify if regression)

| Issue | Where | State |
|-------|--------|-------|
| Debounce 5s; unmount `cancel()` drops pending | `createAutoSaver` / autosave hook cleanup | **Fixed** — flush before cancel |
| No flush on leave / Save may only `schedulePersist` | hook + `OOPlannerWorkspace` | **Fixed** — `flushPersist` on Save; pagehide / visibility / unmount |
| Bare **Saved** / “synced to server” lie | TopBar + `formatAutosaveStatus` + Shell JSDoc | **Fixed** — `plannerSaveStatusLabel`; local-only |
| Unit JSON ≠ browser IDB reload | `saveReloadContinuity` units alone ≠ W5 | **W5 browser** green under `save-reload/` |
| Prefer guest clean IDB | `/planner/guest/?plannerDevTools=1` + `clearPlannerStorage` | E2E path |

**Default:** `cloudEnabled=false` — local-only honesty. No half-wired cloud labels.

---

## Touch list

| Role | Path |
|------|------|
| Autosave hook | `site/features/planner/project/persistence/usePlannerWorkspaceAutosave.ts` |
| AutoSaver / IDB | `site/features/planner/persistence/persistence.ts` |
| Session envelope | `site/features/planner/project/persistence/plannerSession.ts` |
| Workspace / Save | `site/features/planner/editor/OOPlannerWorkspace.tsx` |
| TopBar / Shell | `site/features/planner/editor/TopBar.tsx` · `WorkspaceShell.tsx` |
| Status labels | `site/features/planner/editor/workspaceStatusLabels.ts` (one pure helper for both surfaces) |
| Help | `site/features/planner/help/helpSections.ts` |
| Units | `planner-autosave.test.ts` · `workspaceStatusLabels.test.ts` · `saveReloadContinuity.test.ts` |
| E2E | `site/tests/e2e/open3d-save-honesty.spec.ts` (+ guest helpers) |

**Host:** Fabric stage already live — flush/labels on that path.  
**Out of scope:** second plan host · full cloud multi-tenant · W7 mesh · W8 chrome · P07 full draw journey.

---

## Contracts (short)

**Labels (W6):** one pure helper for TopBar + status bar. Local → “Saved locally” / “Saving locally…” — **no bare “Saved”**. Cloud strings only if cloud API actually ran.

**Flush (W5):** `createAutoSaver.flush` keeps last pending snapshot; hook `projectRef` + `flushPersist`; call on Save, `pagehide` / `visibilitychange` (hidden), unmount — never `cancel` dirty without flush. Fix double-gate skip after timer.

**W5 proof:** wait restore-complete → edit/import → flush → hard reload → assert **same ids** — artifacts only under `save-reload/` (unit envelope alone = fail).

---

## Kill order (2026-07-12 this checkout)

- [x] Flush API + pending snapshot + unit log under `06-save-honesty/` (`unit-run.json` + `planner-autosave` / hook units green)
- [x] Leave / Save / unmount flush with latest `projectRef` (hook + `handleSave` → `flushPersist`)
- [x] One label helper; TopBar + status bar + toasts + help honest; grep clean on open3d path (`plannerSaveStatusLabel`; help local-only)
- [x] Playwright hard reload; PNGs + `06-browser-run.json` under `save-reload/` (wallsMatch + furnitureMatch true)
- [x] Cloud: cancel with local-only NOTES — `cloudEnabled: false` hard in hook; dual-status table ready only if enabled
- [x] `data-testid="open3d-save-status"` + `data-storage` / `data-status` stable (TopBar + status bar sibling)
- [ ] No new `any`; **commits on `.` only** — no commit this slice (owner must ask)

**W5 green** — browser id proof in `save-reload/` (timestamp in run.json).  
**W6 green** — no buyer-readable cloud lie on IDB-only path (unit table + live TopBar/status).  
**Residual (non-blocking):** legacy `PlannerSaveIndicator` fallback copy still has bare “Saved …” when envelope absent — **not mounted** on OOPlanner / guest Fabric path. Marketing landing “● Saved” is demo chrome, not workspace status.

**Next (sequence):** [P07](./P07-draw-place-journey.md).
