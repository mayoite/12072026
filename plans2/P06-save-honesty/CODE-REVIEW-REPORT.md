# P06 Save Honesty (idiotplanners2) — Code Review Report

| Field | Value |
|-------|--------|
| **Phase** | P06 Save Honesty (W5–W6) — **idiotplanners2** |
| **Date** | 2026-07-10 |
| **Reviewer** | Review agent (repo-first; read-only; no product / plan edits) |
| **Checkout** | `D:\OandO07072026` main only · **no worktrees** |
| **HEAD** | `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` (`main...origin/main`; dirty unrelated Plans/archive/idiotplanners2 untracked) |
| **Plan** | `plans2/P06-save-honesty\IMPLEMENTATION-PLAN.md` |
| **Brainstormer (plan lock)** | `Idiots/P06-save-honesty/REPORT.md` — **live path absent**; content at `archive/Idiots/P06-save-honesty/REPORT.md` |
| **Verdict** | **FAIL / NOT GREEN for CP-06** — local IDB flush spine + partial W6 labels landed; residual Tasks 00–08 unexecuted; evidence tree missing |

---

## Executive summary

Plan and live code **agree** on Approach **A (residual close)**: do not rebuild autosave from zero; close honesty + id-level W5. Open3d already has IndexedDB autosave (`createAutoSaver` + `pendingSnapshot` + `flush`), pagehide/visibility/unmount leave flush, explicit Save → `flushPersist()`, and status-bar strings that say **“locally”**. That is stronger than any stale “no flush / bare Saved” narrative.

**This checkout cannot claim CP-06 / W5–W6 PASS:**

1. **`results/` does not exist** — zero artifacts under `results/planner/world-standard-wave/06-save-honesty/` (or `save-reload/`). **Missing results = unproven.**
2. **W5 E2E is furniture-count only** — gate language is wall + furniture **ids**; count is L2 false-green risk.
3. **W6 help/FAQ still claims account “named save slots”** while open3d autosave is IDB-only (`helpSections.ts`).
4. **All plan task steps are unchecked** (`0` × `[x]`, `58` × `[ ]`) — residual work listed, not executed.
5. **Residuals still open:** no `projectRef`; leave uses bare `saver.flush()`; no `open3dSaveStatusLabel` / testids; no write-mock autosave units; TopBar dual boolean table vs status-bar helper; error still bare “Save failed”; no success toast after Save.

**Do not claim GATE PASS** from scoreboards, prior wave folders, or unit continuity alone. Re-prove after residual land with paths under root `results/`.

---

## Repo truth table

| Claim area | Live path | Measured truth (2026-07-10) | Plan §1 match? |
|------------|-----------|-----------------------------|----------------|
| IDB AutoSaver + debounce 5s | `site/features/planner/persistence/persistence.ts` | `AUTO_SAVE_DEBOUNCE_MS = 5000`; `pendingSnapshot`; `flush()`; **no** `AutoSaverDeps` third arg | Yes — present; deps residual |
| Double-gate remnant | same ~L399–403 | Empty `if (now - lastSaved < DEBOUNCE && flushInFlight === null) { /* comment */ }` then **still writes** (no early return) | Yes — residual (delete noise) |
| pagehide / visibility flush | `useOpen3dWorkspaceAutosave.ts` | Registered; calls **`saver.flush()` only**, not `flushPersist` | Yes — residual |
| Unmount flush-before-cancel | same | `flush()?.finally(() => cancel())` | Yes |
| `flushPersist` | same | Builds envelope from **render `project` closure**, not `projectRef` | Yes — residual |
| Hook surface | same | Returns `isSynced` / `isModified` / `status` / `flushPersist`; **no** `isLocalSaved`, `storage`, `cloudEnabled`, `restoreSettled` | Yes — residual |
| Save button | `OOPlannerWorkspace.tsx` `handleSave` | `flushPersist()` + “Saving draft/plan **locally**…”; **no** success toast after onSaved | Yes |
| Status labels pure | `workspaceStatusLabels.ts` | `formatAutosaveStatus` only; error = **“Save failed”**; **no** `open3dSaveStatusLabel` | Partial |
| TopBar | `TopBar.tsx` | Saved: **“Saved locally”**; idle: bare **“Ready”**; **no** `data-testid="open3d-save-status"` / `data-storage` / `data-status`; `data-synced` + boolean table | Yes — residual |
| Shell JSDoc | `WorkspaceShell.tsx` | `isSynced` = “persisted **(local IDB until cloud is wired)**” | Yes — improved |
| Status bar pill | `OOPlannerWorkspace.tsx` ~L908–910 | `formatAutosaveStatus(autosave.status, guestMode)` — local-honest; idle “Ready (local)” **≠** TopBar “Ready” | Yes — dual-table drift |
| Help / FAQ | `helpSections.ts` L97, L137 | **Lie:** “members keep named save slots in their account” | Yes — red residual |
| Guest vs member help | same L101–104 | “members save, export, and publish” — easy cloud read | Yes — residual |
| Continuity unit | `saveReloadContinuity.test.ts` | Envelope JSON round-trip preserves wall/furniture **ids** (unit only) | Yes — not W5 browser |
| Autosave unit | `planner-autosave.test.ts` | Shape / cancel / idle flush only — **no** mocked `saveProject` write proof | Yes — residual |
| Label unit | `workspaceStatusLabels.test.ts` | Local branch coverage; **expects** “Save failed”; no forbidden-list / single helper | Partial |
| Hook unit | `useOpen3dWorkspaceAutosave.test.tsx` | **Absent** | Residual |
| TopBar save unit | `TopBar.saveStatus.test.tsx` | **Absent** | Residual |
| Help honesty unit | `helpSections.saveHonesty.test.ts` | **Absent** | Residual |
| W5 seed fixture | `tests/fixtures/open3d/w5-seed-project.json` | **Absent** | Residual |
| E2E W5 | `open3d-save-honesty.spec.ts` | Place 4 seats → Save draft → hard reload → **furniture count**; `clearPlannerStorageInPage`; screenshot paths under missing `results/` | Yes — L2 not L3 |
| Guest helpers | `guestProjectSetup.ts` | `clearPlannerStorageInPage` (reload-safe) vs `clearPlannerStorage` (init wipe) | Yes |
| Cloud modules | `memberPlanRepository` / `plannerCloudApi` / `guestPromotion` | Exist; **not** open3d autosave path | Yes — Task 07 cancel default correct |
| Fabric indicator | `PlannerSaveIndicator.tsx` | Dual labels; **not mounted** on open3d | Yes — ideas only |
| Evidence pack | `results/planner/world-standard-wave/06-save-honesty/` | **`results/` missing entirely** | Yes — unproven |
| Plan execution | Tasks 00–08 checkboxes | **0 completed / 58 open** | Plan ready, not executed |
| Brainstormer | plan: `Idiots/P06-save-honesty/REPORT.md` | Live **false**; `archive/Idiots/P06-save-honesty/REPORT.md` **true** | Path drift (archive only) |

---

## Findings B / H / M / L

### Blocking (B)

| ID | Finding | Evidence |
|----|---------|----------|
| **B1** | **No evidence pack** — CP-06 path checks impossible; any PASS claim is paper | `results/` absent; E2E targets `../results/planner/world-standard-wave/06-save-honesty/save-reload/` |
| **B2** | **W5 not id-level** — count after reload is not identity contract | `open3d-save-honesty.spec.ts` `furnitureCount` only; no wall/furniture UUID assert; no `w5-seed-project.json` |
| **B3** | **W6 help over-claims account storage** while open3d autosave never hits cloud | `helpSections.ts` L97 + L137: “named save slots in their account” |
| **B4** | **CP-06 done criteria package unmet** | Plan Done-when + CP-06.1–06.9: id proof, dual labels/testids, evidence, Task 07 NOTES — none closed as package |

### High (H)

| ID | Finding | Evidence |
|----|---------|----------|
| **H1** | No `projectRef` — schedule/flush close over render `project` | `useOpen3dWorkspaceAutosave.ts` L33–40, L104–111 |
| **H2** | Leave/pagehide/visibility call bare `saver.flush()` — can flush **stale/missing** pending if React has not scheduled latest envelope | same L58–60 vs plan normative leave = `flushPersist` |
| **H3** | Autosave units do not prove writes / last-pending / debounce / cancel-no-write | `planner-autosave.test.ts` — no `saveProject` inject/mock |
| **H4** | Missing stable selectors `open3d-save-status` / `data-storage` / `data-status` / `role="status"` | Grep under `site/features/planner/open3d`: no matches |
| **H5** | Dual label tables: TopBar boolean switch vs `formatAutosaveStatus` — idle “Ready” vs “Ready (local)” | `TopBar.tsx` L226–238 vs `workspaceStatusLabels.ts` L45–47 |
| **H6** | Success toast incomplete; error not “Local save failed” | `handleSave` only “Saving …”; labels error = “Save failed” |
| **H7** | Restore race: `hydrated` always true; no `restoreSettled` / `data-restore`; E2E polls count only | Hook options lack restore gate; no restore testid |
| **H8** | Planned residual test/fixture files absent | Hook unit, TopBar.saveStatus, help honesty unit, w5 fixture |

### Medium (M)

| ID | Finding | Evidence |
|----|---------|----------|
| **M1** | `isSynced` / `data-synced` naming retained (sounds like server) | Hook return + TopBar |
| **M2** | Double-gate empty `if` remnant — dead noise; risk of future `return` reintroduction | `persistence.ts` scheduleSave timer body |
| **M3** | Guest-vs-member help can be read as cloud durability | `helpSections.ts` guest-vs-member summary |
| **M4** | Brainstormer live path missing (plan says `Idiots/…`) | Only `archive/Idiots/P06-save-honesty/REPORT.md` |
| **M5** | Session unit continuity uses export envelope type `open3d-floorplan-project` while IDB session is `open3d-1` | Do not confuse channels in NOTES |
| **M6** | Cloud half-wire still forbidden; Task 07 cancel-default is correct — do not ship “Saved to account” without owner unlock | Plan Approach A |

### Low (L)

| ID | Finding | Evidence |
|----|---------|----------|
| **L1** | Fabric `PlannerSaveIndicator` not on open3d — correct YAGNI | Archive/ideas only |
| **L2** | Cloud client modules unused by open3d autosave — correct until Task 07 | No editor import into autosave path |
| **L3** | `formatAutosaveStatus` two-arg thin table is acceptable interim once TopBar shares same helper | Partial honesty already |
| **L4** | Untracked `plans2/` on dirty tree — plan docs local only until committed | `git status` shows `?? plans2/` |

---

## Already exists (do **not** re-implement from zero)

1. **`createAutoSaver.flush` + `pendingSnapshot` + `flushInFlight`** — immediate write path exists; debounce 5s.
2. **Hook leave protection skeleton** — pagehide, visibility hidden, unmount flush-before-cancel (needs upgrade to `flushPersist` + projectRef).
3. **`handleSave` → `flushPersist()`** with local-qualified *saving* toast prefix.
4. **`formatAutosaveStatus`** local-only table for status bar (saved/saving/unsaved/idle guest/member).
5. **TopBar “Saved locally”** on synced branch (not bare “Saved” for that branch).
6. **Shell JSDoc** local-IDB honesty (not “synced to server”).
7. **Unit continuity** — wall/furniture id preservation through JSON envelope (`saveReloadContinuity.test.ts`).
8. **E2E skeleton** — guest place → Save → hard reload → count; **reload-safe** `clearPlannerStorageInPage`.
9. **Guest/member project id helpers** — `planner-guest-local` / `planner-member-local` / planId suffix.
10. **Session envelope** — `open3d-1` parse/build path present (`open3dSession.ts`).

---

## Residual (this plan’s real work — Approach A)

| Residual | Why still red | Plan task |
|----------|---------------|-----------|
| Evidence dirs + NOTES + logs | No `results/` | Task 00, 08 |
| AutoSaver deps inject + write-mock tests; delete dead double-gate | Weak units; remnant if | Task 01 |
| `open3dSaveStatusLabel` single table + “Local save failed” | Dual tables; error wording | Task 02 |
| `projectRef` + leave `flushPersist` + export `storage`/`cloudEnabled`/`isLocalSaved` + restoreSettled | Stale leave flush risk | Task 03 |
| TopBar/status shared label + testids + Ready (local) | W6 selectors + drift | Task 04 |
| Help/FAQ rewrite + honesty unit + copy grep | Account slots lie | Task 05 |
| W5 id E2E + fixture + PNGs/run.json | Count-only L2 | Task 06 |
| Task 07 cloud | Default **cancel** with NOTES | Task 07 |
| CP-06 path checklist | All unchecked | Task 08 |

---

## False-green catalog (active on this checkout)

| Trap | Why it looks green | Status now |
|------|--------------------|------------|
| Unit JSON round-trip = W5 | Continuity unit preserves ids | **Active** — unit ≠ browser hard reload |
| Furniture **count** E2E = W5 | Place 4 → still 4 | **Active** — live E2E is count-only |
| Body text “Saved locally” | UI string without write proof | **Active** — no mocked write unit; status after onSaved is code-path only |
| Scoreboard / prior wave PASS | Docs or other folders claim green | **Active** — this checkout has **no** `results/` |
| TopBar “Saved locally” = full W6 | Help still lies; TopBar idle bare Ready; no testids | **Active** |
| Leave listeners exist = durable leave | Bare `saver.flush()` without rebuild | **Active** |
| `isSynced` true = cloud | Prop name | **Active** naming trap |
| Member login = account slots | Help text | **Active** |
| Paper CP checkboxes | Plan tasks still all `[ ]` | Safe (not falsely checked) |
| Init-script IDB wipe on reload | Would false-red or wipe restore | E2E correctly uses one-shot clear — **good** |

---

## Score (honest, not aspirational)

| Dimension | Ship bar (plan) | Current | Note |
|-----------|-----------------|---------|------|
| Durability | **L3** ids hard reload | **~L2** | Count E2E skeleton + unit ids; no browser id proof / no evidence |
| Honesty | **H4** dual surface + help + toasts + helper + testids | **~H2** | Status bar mostly local; TopBar partial; help **fails** |
| Evidence | **E4** Playwright + PNGs + logs + NOTES | **E0** | `results/` missing |
| CP-06 package | All 06.1–06.9 path-backed | **0/9** proven | Spine code helps 06.1 partial in source only — **no logs** |

**Overall: NOT GREEN.** Residual execute required before any PASS language.

---

## Kill-order (execute)

1. **Task 00** — Create `results/planner/world-standard-wave/06-save-honesty/save-reload/`; NOTES with HEAD; baseline vitest logs. Without this every claim is unproven.
2. **Task 01** — AutoSaver write-mock units + remove dead double-gate (+ optional deps inject).
3. **Task 03** — `projectRef` + leave/`pagehide`/`visibility`/`unmount` → `flushPersist`; export honesty fields; restoreSettled gate.
4. **Task 02 + 04** — Single `open3dSaveStatusLabel`; TopBar + status bar same string; testids; Ready (local); Local save failed; success toast.
5. **Task 05** — Kill account “named save slots” help/FAQ; unit + grep artifact.
6. **Task 06** — W5 **id** hard reload (fixture/export channel); PNGs + run.json under `save-reload/`.
7. **Task 07** — **Cancel** with NOTES (`cloudEnabled=false`) unless owner unlocks.
8. **Task 08** — CP-06.1–06.9 path checklist; tsc; unit pack; no paper ticks.

**Do not:** re-implement flush from zero; mount fabric `PlannerSaveIndicator`; half-wire cloud; claim PASS from unit continuity alone.

---

## Bottom line

| Item | Value |
|------|--------|
| **Report path** | `D:\OandO07072026\plans2/P06-save-honesty\CODE-REVIEW-REPORT.md` |
| **Verdict** | **FAIL / NOT GREEN (CP-06)** |
| **Top 3** | **(1)** `results/` missing → unproven · **(2)** W5 E2E count-only (ids required) · **(3)** Help still claims account “named save slots” + leave bare `flush` / no `projectRef` / no testids residual package |
| **Already good** | IDB flush spine, local-ish labels on status bar + TopBar saved branch, unit id continuity, reload-safe E2E skeleton |
| **Next** | Execute Approach A residual kill-order; re-prove with evidence paths only |

**Buyer north star (unmet):** save Friday → Monday same desk/wall **ids** · UI never said “account” if only browser IDB ran.
