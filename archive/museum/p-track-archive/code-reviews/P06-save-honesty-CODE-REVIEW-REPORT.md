# P06 Save Honesty — Code Review Report

| Field | Value |
|-------|--------|
| **Phase** | P06 Save Honesty (W5–W6) |
| **Date** | 2026-07-10 |
| **Reviewer** | Review agent (repo-first; no implement) |
| **Checkout** | `.` main only |
| **HEAD** | `7cad93d5e9334d99d4c982096db12dbfbca26c9a` (`main...origin/main`; dirty unrelated Plans/archive paths) |
| **Plan** | `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md` |
| **Brainstormer** | Live `Idiots2/P06-save-honesty/REPORT.md` **absent**; content exists only at `archive/Idiots2/P06-save-honesty/REPORT.md` |
| **Verdict** | **FAIL / NOT GREEN for CP-06** — local IDB flush spine + partial W6 labels landed; gates still red |

---

## Executive summary

Repo and plan largely **agree** on residual debt. Open3d already has real IndexedDB autosave (`createAutoSaver` + `pendingSnapshot` + `flush`), leave/pagehide/unmount flush, explicit Save → `flushPersist()`, and status-bar strings that say **“locally”**. That is more than the **stale** phase card (`Plans/phases/P06-save-honesty/P06-save-honesty.md` §0, 2026-07-09) still claims.

**CP-06 cannot pass on this checkout:**

1. **`results/` tree does not exist** — zero W5/W6 evidence under `results/planner/world-standard-wave/06-save-honesty/` (or anywhere).
2. **W5 E2E asserts furniture count, not entity UUIDs** — gate language is ids; count is false-green risk.
3. **W6 help/FAQ still claims account “named save slots”** while open3d autosave never hits cloud.
4. **Plan Tasks 00–07 are all unchecked** (`- [ ]` only; 0 completed checkboxes) — residual work is correctly listed, not executed.
5. **Stable selectors / single label table / projectRef / write-mock autosave units** planned in Tasks 01–04 are not in repo.

**Do not claim GATE PASS from maps, pending notes, or partial commits.** Re-prove on this machine after residual land.

---

## Repo truth table

| Claim area | Live path | Measured truth (2026-07-10) | Plan §1 match? |
|------------|-----------|-----------------------------|----------------|
| IDB AutoSaver + debounce 5s | `site/features/planner/persistence/persistence.ts` | `AUTO_SAVE_DEBOUNCE_MS = 5000`; `pendingSnapshot`; `flush()` clears timer and persists pending | Yes — present |
| Double-gate silent drop | same | Remnant `if (now - lastSaved < DEBOUNCE && flushInFlight === null) { /* empty */ }` then still writes — **no early return** (neutered, not fully deleted) | Yes — residual |
| pagehide / visibility flush | `useOpen3dWorkspaceAutosave.ts` | Registered; unmount `flush()?.finally(() => cancel())` | Yes |
| `flushPersist` | same | Builds envelope from **render `project`**, not `projectRef` | Yes — residual |
| Hook surface | same | Returns `isSynced` / `isModified`; **no** `isLocalSaved`, `storage`, `cloudEnabled` | Yes — residual |
| Save button | `OOPlannerWorkspace.tsx` `handleSave` | `flushPersist()` + toast “Saving draft/plan **locally**…”; **no** success toast after onSaved | Yes |
| Status labels pure | `workspaceStatusLabels.ts` | `formatAutosaveStatus` guest/member local strings; error = **“Save failed”** (not “Local save failed”); **no** `open3dSaveStatusLabel` | Partial — core local strings yes; full contract no |
| TopBar | `TopBar.tsx` | Saved branch: **“Saved locally”**; idle: bare **“Ready”** (not “Ready (local)”); **no** `data-testid="open3d-save-status"` / `data-storage` / `data-status`; still `data-synced` + `isSynced` | Yes — residual |
| Shell JSDoc | `WorkspaceShell.tsx` | `isSynced` = “persisted (local IDB until cloud is wired)” — honest vs old “server” lie | Yes |
| Status bar pill | `OOPlannerWorkspace.tsx` | Uses `formatAutosaveStatus(autosave.status, guestMode)` — local-honest | Yes |
| Restore | `OOPlannerWorkspace.tsx` | `hydrated` forced `true`; async `restoreSnapshot` → `replaceProject` — race window real | Yes |
| Project ids | `persistence.ts` | Guest `planner-guest-local`; member `planner-member-local` / `planner-member-local:{planId}` | Yes |
| Cloud autosave path | open3d editor/hook | **Not** wired; `memberPlanRepository` / `guestPromotion` exist as separate API clients only | Yes — Task 07 cancel default correct |
| Help / FAQ | `helpSections.ts` | **Lies:** “members keep named save slots in their account” (section + FAQ) | Yes — red residual |
| Continuity unit | `saveReloadContinuity.test.ts` | Envelope JSON round-trip preserves wall/furniture **ids** (unit only) | Yes |
| Autosave unit | `planner-autosave.test.ts` | Shape / cancel / idle flush only — **no** mocked `saveProject` write proof | Yes — residual |
| Label unit | `workspaceStatusLabels.test.ts` | Branch coverage for local strings; no forbidden-list / `open3dSaveStatusLabel` | Partial |
| E2E W5 | `open3d-save-honesty.spec.ts` | Place 4 seats → Save draft → hard reload → **furniture count**; uses `clearPlannerStorageInPage` (reload-safe); screenshots path under missing `results/` | Yes — count not ids |
| Guest helpers | `guestProjectSetup.ts` | `clearPlannerStorageInPage` vs `clearPlannerStorage` (init wipe) — correctly distinguished | Yes |
| Evidence pack | `results/planner/world-standard-wave/06-save-honesty/` | **Directory tree absent** (`results/` missing entirely) | Yes — plan warned |
| Gate wiring | `playwright-open3d-world-specs.json` | W5–W6 → `open3d-save-honesty.spec.ts`; `gate:open3d` script exists | Code path wired; proof not green |
| Plan tasks | IMPLEMENTATION-PLAN Task 00–07 | All steps `- [ ]` (0× `[x]`) | Plan ready, not executed |
| Brainstormer input | plan cites `Idiots2/.../REPORT.md` | Live path missing; **archive** has REPORT | Path drift |

---

## Findings

### Blocking (B)

| ID | Finding | Evidence |
|----|---------|----------|
| **B1** | **No evidence pack on disk** — CP-06 path checks impossible | `results/` does not exist; E2E writes to `../results/planner/world-standard-wave/06-save-honesty/save-reload/` relative to `site/` |
| **B2** | **W5 not id-level** — Playwright proves count after reload, not wall/furniture UUIDs | `open3d-save-honesty.spec.ts` title + assertions: `furnitureCount` only |
| **B3** | **W6 help over-claims account storage** while open3d autosave is IDB-only | `helpSections.ts` L97 + L137: “members keep named save slots in their account” |
| **B4** | **CP-06 done criteria unmet** | Plan Done when §: id proof + dual labels/testids + evidence + Task 07 NOTES — none complete as package |

### High (H)

| ID | Finding | Evidence |
|----|---------|----------|
| **H1** | No `projectRef` — `schedulePersist` / `flushPersist` close over render `project` | `useOpen3dWorkspaceAutosave.ts` L33–40, L104–111 |
| **H2** | Autosave unit tests do not prove writes / flush / no silent drop | `planner-autosave.test.ts` — no `saveProject` mock |
| **H3** | TopBar idle bare **“Ready”**; dual-surface label not unified via one helper props | `TopBar.tsx` L234–237; status bar uses `formatAutosaveStatus` idle “Ready (local)” |
| **H4** | Missing stable E2E selectors `open3d-save-status` / `data-storage` / `data-status` | Grep: no matches under `site/` |
| **H5** | Success toast incomplete after Save | `handleSave` only sets “Saving … locally…”; never “Draft/Plan saved locally” after flush ack |
| **H6** | Restore race: `hydrated` always true; first paint default room then async restore | `OOPlannerWorkspace.tsx` L131–180; E2E polls count but not restore-complete signal |
| **H7** | Planned test/fixture files absent | No `useOpen3dWorkspaceAutosave.test.tsx`, `TopBar.saveStatus.test.tsx`, `w5-seed-project.json`, help honesty unit |

### Medium (M)

| ID | Finding | Evidence |
|----|---------|----------|
| **M1** | `isSynced` naming retained (buyer/dev may read “sync”) | Hook return + TopBar `data-synced` |
| **M2** | Error label still “Save failed” vs contract “Local save failed” | `workspaceStatusLabels.ts` L43–44 |
| **M3** | Double-gate remnant empty `if` — dead noise; should delete for clarity | `persistence.ts` scheduleSave timeout body |
| **M4** | Phase plan §0 still documents **pre-flush** world as “measured” | `Plans/phases/P06-save-honesty/P06-save-honesty.md` L37–56 contradicts live code; **idiotplanners plan correctly overrides** |
| **M5** | Brainstormer path: plan says `Idiots2/…`; only `archive/Idiots2/P06-save-honesty/REPORT.md` present | Live Idiots2 missing |
| **M6** | Guest-vs-member help: “members save, export, and publish” can be read as cloud durability | `helpSections.ts` L101–104 |
| **M7** | Cloud branches in Task 02/04 (`Saving to account…`) are fine **only if** cloudEnabled stays false by default; half-wire still forbidden | Plan Task 07 default cancel is correct |

### Low (L)

| ID | Finding | Evidence |
|----|---------|----------|
| **L1** | `formatAutosaveStatus` remains two-arg; no storage/cloud params | Acceptable until `open3dSaveStatusLabel` lands |
| **L2** | `memberPlanRepository` / `guestPromotion` unused by open3d autosave — correct YAGNI for Approach A | Grep: no editor import of promote for autosave |
| **L3** | Fabric `PlannerSaveIndicator` dual-local pattern not on open3d — plan says ideas only | Correct do-not-mount stance |
| **L4** | Continuity unit uses export envelope `open3d-floorplan-project` while session uses `open3d-1` — both valid paths; don’t confuse in NOTES | `saveReloadContinuity.test.ts` vs `open3dSession.ts` |

---

## Already exists (do not re-implement from zero)

Landed spine (commits include `8d61a1f` save flush + honest local labels; `d551d1f` W5 hard-reload e2e):

1. **`createAutoSaver.flush` + `pendingSnapshot`** — leave/Save can write without waiting 5s.
2. **Hook leave protection** — pagehide, visibility hidden, unmount flush-before-cancel.
3. **`handleSave` → `flushPersist()`** with local-qualified saving toast prefix.
4. **`formatAutosaveStatus`** local-only table for status bar (saved/saving/unsaved/idle guest/member).
5. **TopBar “Saved locally”** when synced branch (not bare “Saved” for that branch).
6. **Shell JSDoc** local-IDB honesty.
7. **Unit continuity** wall/furniture id preservation through JSON envelope.
8. **E2E skeleton** guest place → Save → hard reload → count, with **reload-safe** storage clear.
9. **Gate list wiring** for `open3d-save-honesty.spec.ts` under world-standard open3d pack.
10. **Project id scheme** + guest→member migrate pure helpers (member empty only).

---

## Residual (execute plan Tasks 00–06; cancel 07)

| Order | Work | Plan task |
|------:|------|-----------|
| 1 | Create `results/planner/world-standard-wave/06-save-honesty/` (+ `save-reload/`), NOTES, baseline vitest log | Task 00 |
| 2 | Mock `saveProject` / flush / cancel / no silent drop units; delete dead double-gate if | Task 01 |
| 3 | `open3dSaveStatusLabel` single table + forbidden bare Saved/cloud when `cloudEnabled=false`; error → “Local save failed” | Task 02 |
| 4 | `projectRef` + export `storage` / `cloudEnabled` / `isLocalSaved` (+ deprecate alias) | Task 03 |
| 5 | TopBar + Shell + workspace dual surface + testids + Ready (local) + success toast | Task 04 |
| 6 | Rewrite help/FAQ + guest-vs-member honesty; unit + grep artifact | Task 05 |
| 7 | E2E **UUID equality** (IDB parse or export); screenshots + `06-browser-run.json` under `save-reload/` | Task 06 |
| 8 | Task 07 cloud wire: **cancel with NOTES** unless owner unlocks | Task 07 |

---

## False-green risks

| Risk | Why it fools | Mitigation |
|------|--------------|------------|
| **Count-only W5** | Reload can restore “4 furniture” after re-seed / default room noise without same UUIDs | Assert wall + furniture ids via IDB snapshot or export |
| **Unit continuity = W5** | JSON round-trip never opens IndexedDB or hard-reloads | Require `save-reload/` browser artifacts |
| **“Saved locally” in TopBar alone = W6** | Help still sells account slots; TopBar idle “Ready”; no testids | Help rewrite + dual-surface same helper + grep |
| **Gate script includes save-honesty spec** | Wiring ≠ pass; evidence folder missing | Fail CP until NOTES + logs + PNGs on **this** machine |
| **Historical GATE PASS notes** | Research/pending may claim W5–W6 pass elsewhere | Plan §1.4 correct: re-prove here |
| **Shallow autosave PASS** | Shape tests pass without any write | Task 01 mock write asserts |
| **Stale phase §0** | Agents re-adding flush that already exists | Prefer `plans1` §1.1 over phase §0 baseline |

---

## Score

| Dimension | Score | Notes |
|-----------|------:|-------|
| Plan accuracy vs live residual | **9 / 10** | idiotplanners §1.1–1.2 matches code; path to Idiots2 slightly stale (archive) |
| Implementation completeness vs Done when | **3.5 / 10** | Spine ~half; gates/evidence/help/ids/testids incomplete |
| W5 readiness | **2 / 10** | E2E smoke only; no evidence; no ids |
| W6 readiness | **5 / 10** | Status bar + TopBar saved branch honest; help/idle/testids/toasts incomplete |
| Evidence honesty | **0 / 10** | No `results/` tree |
| **Overall CP-06 readiness** | **3 / 10** | **FAIL / NOT GREEN** |

---

## Kill-order (if executing next)

1. **Evidence scaffold + baseline log** (Task 00) — stop claiming without paths.
2. **Help/FAQ rewrite** (Task 05) — fastest honesty win; currently buyer-visible lie.
3. **Label helper + TopBar testids + Ready (local) + success toast** (Tasks 02 + 04).
4. **AutoSaver write-proof units + delete dead double-gate** (Task 01).
5. **projectRef flush hardening** (Task 03).
6. **W5 id E2E + PNGs + NOTES** (Task 06) — last product gate.
7. **Cancel Task 07** in NOTES (`cloudEnabled=false`).

Do **not** thrash re-landing flush/pagehide/“Saved locally” already present. Do **not** mount fabric save indicator into open3d.

---

## Bottom line

**Verdict: FAIL for CP-06 / W5–W6 green.**  

The monorepo already has a **local-first flush spine** and **mostly honest open3d status strings** for the saved/saving path. The **implementation plan is high-quality and residual-correct**. What blocks ship honesty is unfinished residual: **missing evidence tree**, **count-only hard-reload E2E**, **help that still promises account save slots**, **no stable save testids / single label contract**, **shallow autosave write tests**, and **no projectRef**.  

Treat partial commits (`flush`, “Saved locally”, e2e smoke) as **progress**, not **gate pass**. Execute Tasks 00–06; cancel 07 with NOTES.

---

## Sources reviewed

| Source | Role |
|--------|------|
| Live open3d persistence / editor / help / tests (paths above) | Repo truth |
| `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md` | Execute plan under review |
| `Plans/phases/P06-save-honesty/P06-save-honesty.md` | Phase authority (stale §0) |
| `archive/Idiots2/P06-save-honesty/REPORT.md` | Brainstormer (live Idiots2 path missing) |
| `site/config/build/playwright-open3d-world-specs.json` | Gate wiring |
| Git log sample: `d551d1f`, `8d61a1f` | Landed slice names |

**No product code changed. No plan edits.** This report only.
