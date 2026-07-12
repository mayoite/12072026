# P06 � Save honesty (W5�W6)

**Status:** REPROVE � flush/label implementation and 2026-07-11 UUID reload evidence exist, but PASS has not been re-run on this checkout.

**Gates:** **W5** save ? hard reload ? same wall + furniture **ids** � **W6** status copy never implies cloud when only IDB.

**Evidence:** `results/planner/world-standard-wave/06-save-honesty/`  
**W5 subfolder:** `�/06-save-honesty/save-reload/`  
**CP:** [CP-06](./CHECKPOINTS.md) � [BOARD](./BOARD.md)

**Goal:** Edit ? leave or hard-reload ? same entity ids; every status string tells **local browser** vs **cloud** truth.

---

## Gaps (re-verify on this tree)

| Issue | Where |
|-------|--------|
| Debounce 5s; unmount `cancel()` drops pending | `createAutoSaver` / autosave hook cleanup |
| No flush on leave / Save may only `schedulePersist` | hook + `OOPlannerWorkspace` |
| Bare **Saved** / �synced to server� lie | TopBar + `formatAutosaveStatus` + Shell JSDoc |
| Unit JSON ? browser IDB reload | `saveReloadContinuity` units alone ? W5 |
| Prefer guest clean IDB | `/planner/guest/?plannerDevTools=1` + `clearPlannerStorage` |

**Default:** `cloudEnabled=false` � local-only honesty. No half-wired cloud labels.

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
| Units | `planner-autosave.test.ts` � `workspaceStatusLabels.test.ts` � `saveReloadContinuity.test.ts` |
| E2E | `site/tests/e2e/open3d-save-honesty.spec.ts` (+ guest helpers) |

**Host:** Fabric stage already live — flush/labels on that path.  
**Out of scope:** second plan host · full cloud multi-tenant · W7 mesh · W8 chrome · P07 full draw journey.

---

## Contracts (short)

**Labels (W6):** one pure helper for TopBar + status bar. Local ? �Saved locally� / �Saving locally�� � **no bare �Saved�**. Cloud strings only if cloud API actually ran.

**Flush (W5):** `createAutoSaver.flush` keeps last pending snapshot; hook `projectRef` + `flushPersist`; call on Save, `pagehide` / `visibilitychange` (hidden), unmount � never `cancel` dirty without flush. Fix double-gate skip after timer.

**W5 proof:** wait restore-complete ? edit/import ? flush ? hard reload ? assert **same ids** � artifacts only under `save-reload/` (unit envelope alone = fail).

---

## Kill order (unchecked)

- [ ] Flush API + pending snapshot + unit log under `06-save-honesty/`
- [ ] Leave / Save / unmount flush with latest `projectRef`
- [ ] One label helper; TopBar + status bar + toasts + help honest; grep clean
- [ ] Playwright (or chrome-devtools) hard reload; PNGs + run.json under `save-reload/`
- [ ] Cloud: cancel with local-only NOTES **or** owner-unlocked wire + dual-status tests
- [ ] `data-testid="open3d-save-status"` + `data-storage` / `data-status` stable
- [ ] No new `any`; commits on `.` only

**W5 red until** browser id proof in `save-reload/`.  
**W6 red until** no buyer-readable cloud lie on IDB-only path.  
**Next (sequence):** [P07](./P07-draw-place-journey.md).
