# P06 Save Honesty — CODE-REVIEW-LIVE (agent #1)

| Field | Value |
|-------|--------|
| **Phase** | P06 Save Honesty (W5–W6) |
| **Date** | 2026-07-10 |
| **Reviewer** | code-review agent #1 (live re-proof; no product edits) |
| **Checkout** | `D:\OandO07072026` |
| **Inputs** | `plans1/P06-save-honesty/CODE-REVIEW-REPORT.md` · `IMPLEMENTATION-PLAN.md` · live open3d paths below |
| **Scope** | Read product code only; write this evidence file only |

---

## Verdict

**FAIL / NOT GREEN for CP-06 (W5–W6).**

Local IDB flush spine and partial W6 “locally” wording are **landed and real**. CP-06 still fails: no evidence pack (only empty `save-reload/`), W5 E2E is **furniture count not UUIDs**, help still claims account “named save slots”, dual chrome still two label tables, missing testids / `projectRef` / write-proof autosave units / success toast, and plan Tasks 00–07 remain unchecked.

Do **not** claim GATE PASS from wiring, unit continuity, or partial “Saved locally” strings.

**CP-06 readiness (this machine): ~3.5 / 10** — spine ~half; gates red.

---

## What is already landed (do not rebuild)

Re-proved on disk 2026-07-10. **Do not re-implement from zero.**

| # | Landed capability | Exact path / proof |
|---|-------------------|--------------------|
| 1 | `createAutoSaver` **flush** + **`pendingSnapshot`** + 5s debounce | `site/features/planner/persistence/persistence.ts` — `AUTO_SAVE_DEBOUNCE_MS = 5000`; `pendingSnapshot`; `flush()` clears timer and persists pending |
| 2 | Leave protection: **pagehide**, **visibility hidden**, unmount **flush-before-cancel** | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` L58–75 |
| 3 | Explicit Save → **`flushPersist()`** | `OOPlannerWorkspace.tsx` `handleSave` → `autosave.flushPersist()` |
| 4 | Saving toast prefix honest | same: “Saving draft/plan **locally**…” |
| 5 | Status-bar pure helper local table (saved/saving/unsaved/idle) | `workspaceStatusLabels.ts` `formatAutosaveStatus` — “Saved locally”, “Draft saved locally”, “Ready (local)”, etc. |
| 6 | TopBar saved branch: **“Saved locally”** (not bare Saved on that branch) | `TopBar.tsx` L230–233 |
| 7 | Shell JSDoc: `isSynced` = local IDB until cloud wired | `WorkspaceShell.tsx` L27–28 |
| 8 | Unit continuity: wall/furniture **ids** through export envelope JSON | `saveReloadContinuity.test.ts` |
| 9 | E2E **skeleton**: guest place → Save draft → hard reload → furniture **count**; reload-safe clear | `open3d-save-honesty.spec.ts` + `clearPlannerStorageInPage` |
| 10 | Gate list wiring W5–W6 → that spec | `site/config/build/playwright-open3d-world-specs.json` |
| 11 | Project id scheme + guest→member migrate helpers (not open3d cloud autosave) | `persistence.ts` guest/member ids |
| 12 | Evidence **folder shell** exists (empty content) | `results/planner/world-standard-wave/06-save-honesty/save-reload/` only — no NOTES/logs/PNGs |

**Do not** thrash re-landing flush, pagehide, “Saved locally”, or mount fabric `PlannerSaveIndicator` into open3d.

---

## Residual list ordered for TDD (exact files)

Order is **test-first execute order** (plan Tasks 00–06; cancel 07). Prefer red tests before green product edits.

| Order | TDD slice | Red first (files) | Green / product (files) | Plan |
|------:|-----------|-------------------|-------------------------|------|
| **1** | Evidence scaffold + baseline | N/A (ops) | Create pack under `results/planner/world-standard-wave/06-save-honesty/`: `NOTES.md`, `00-baseline-vitest.log`, `00-baseline-run.json`; keep `save-reload/` | Task 00 |
| **2** | AutoSaver write proof + no silent drop | `site/tests/unit/planner-autosave.test.ts` — mock `saveProject` / `loadProject` / `saveHistoryEntry`; assert schedule→flush write, cancel no-write, idle flush no-write, debounce latest | `site/features/planner/persistence/persistence.ts` — **delete** dead double-gate empty `if` (L401–403); only change logic if mocks reveal real drop | Task 01 |
| **3** | Single label table + forbidden list | `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts` — full contract; forbid bare `Saved` / cloud strings when `cloudEnabled=false`; error → **“Local save failed”** | `site/features/planner/open3d/editor/workspaceStatusLabels.ts` — `open3dSaveStatusLabel` **or** extend `formatAutosaveStatus` with storage/cloud; one table only | Task 02 |
| **4** | Hook `projectRef` + honest surface | Create `site/tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx` — mock `createAutoSaver`; prove flush/schedule read **latest** project | `useOpen3dWorkspaceAutosave.ts` — `projectRef`; `flushPersist`/`schedulePersist` from ref; export `storage`, `cloudEnabled`, `isLocalSaved` (`isSynced` alias OK temporary); fix **visibilitychange** listener leak (anonymous handler never removed) | Task 03 |
| **5** | Dual surface + testids + toast | Create/extend `site/tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx` (or equivalent) — testids + Ready (local) + no dual table drift | `TopBar.tsx`, `WorkspaceShell.tsx`, `OOPlannerWorkspace.tsx` — both surfaces call **same** helper; `data-testid="open3d-save-status"` + `data-storage` + `data-status`; idle **Ready (local)**; success toast after flush ack | Task 04 |
| **6** | Help honesty | Unit on help strings (new or extend help tests) + grep artifact | `site/features/planner/help/helpSections.ts` — kill “named save slots in their account”; honest guest vs member; evidence `05-copy-grep.txt` | Task 05 |
| **7** | W5 UUID E2E + artifacts | Extend `site/tests/e2e/open3d-save-honesty.spec.ts`; optional `site/tests/fixtures/open3d/w5-seed-project.json` | Assert wall + furniture **UUIDs** (IDB parse or export channel); PNGs + `06-browser-run.json` under `save-reload/`; optional `data-restore="complete"` | Task 06 |
| **8** | Cloud wire | NOTES only | **Cancel** Task 07: `cloudEnabled=false`; do not half-wire account autosave | Task 07 |

### Structural quality notes (code-judo, not thrash)

1. **Two label tables today** — TopBar hardcodes Modified / Saved locally / Ready; status bar uses `formatAutosaveStatus`. Collapse to one pure helper props path (plan contract). Not a third wrapper.
2. **Double-gate remnant** — empty `if (now - lastSaved < DEBOUNCE && flushInFlight === null) { /* still writes */ }` is dead noise; delete for clarity after write-proof units.
3. **`flushPersist`** currently `scheduleSave` then `flush` from render `project` — works for happy path; **projectRef** is the correctness fix for thrash/stale closure, not a second flush API.
4. **visibilitychange leak** — `addEventListener` with anonymous arrow; cleanup only removes `pagehide`. On `projectId` remount this stacks handlers. Named function + remove on cleanup is the boring fix (same task as projectRef).
5. **Restore race** — `hydrated` forced `true`; first paint default room then async restore. E2E count-poll masks this; optional `restoreComplete` / `data-restore` (plan addendum) before relying on id asserts alone.

---

## Leave-flush / projectRef status

| Mechanism | Status | Evidence |
|-----------|--------|----------|
| `createAutoSaver.flush` + `pendingSnapshot` | **Landed** | `persistence.ts` L345–346, L415–427 |
| Unmount flush-before-cancel | **Landed** | hook cleanup `flush()?.finally(() => cancel())` |
| pagehide flush | **Landed** | hook L61 + remove on cleanup |
| visibility hidden flush | **Landed behavior, leaky registration** | Anonymous listener; **not** removed on cleanup |
| Explicit Save → flush | **Landed** | `handleSave` → `flushPersist` |
| **`projectRef`** | **Missing** | `schedulePersist` / `flushPersist` close over render `project` (L33–40, L104–111) |
| Leave flush of **pending** timer snapshot | **OK without projectRef** | Saver holds `pendingSnapshot` string |
| Explicit `flushPersist` under thrash | **Risk residual** | Envelope from stale render closure if project advanced without re-render-bound callback |
| Write-proof unit for flush | **Missing** | `planner-autosave.test.ts` shape/idle only — no `saveProject` mock |
| Double-gate silent drop | **Neutered, not cleaned** | Empty if then still persists — no early return; residual is clarity + unit proof |

**Summary:** Leave/pagehide/unmount flush spine is **present**. **projectRef is not.** Do not rebuild flush; harden ref + listener cleanup + write units.

---

## Help honesty / testids status

### Help / FAQ

| Claim | Live | Verdict |
|-------|------|---------|
| Section `saving-and-autosave` summary | “Sessions autosave to your browser; **members keep named save slots in their account**.” | **LIE** vs open3d IDB-only autosave — `helpSections.ts` L97 |
| FAQ “How are plans saved?” | Same sentence | **LIE** — L137 |
| Guest vs member | “members save, export, and publish” | **Ambiguous** (can read as cloud durability) — L101–104, FAQ L141 |
| Grep artifact `05-copy-grep.txt` | Absent under evidence pack | Residual |

### Testids / dual surface

| Contract item | Live | Verdict |
|---------------|------|---------|
| `data-testid="open3d-save-status"` | **Absent** under open3d | Residual |
| `data-storage` / `data-status` on save pill | **Absent** on open3d TopBar | Residual |
| TopBar still `data-synced` + `isSynced` | Present | Residual naming / buyer “sync” read |
| Status bar uses `formatAutosaveStatus` | Yes — local-honest table | Partial W6 |
| TopBar idle | bare **“Ready”** | Drift vs status **“Ready (local)”** |
| TopBar saved | **“Saved locally”** | OK for that branch only |
| Single helper both surfaces | **No** — dual tables | Residual Task 02+04 |
| Error label | **“Save failed”** not “Local save failed” | Residual (`workspaceStatusLabels.ts` L43–44) |
| Success toast after Save | Only “Saving … locally…”; no post-ack “Draft/Plan saved locally” | Residual |

---

## W5 UUID e2e gap

| Layer | What it proves | Gap |
|-------|----------------|-----|
| `saveReloadContinuity.test.ts` | Export/import envelope preserves wall/furniture **ids** (pure unit) | **Not** IndexedDB; **not** hard reload; **not** W5 browser |
| `open3d-save-honesty.spec.ts` | Place 4 seats → Save → reload → **furniture count** equal | Title + asserts are count-only; **no wall/furniture UUID equality** |
| Evidence `save-reload/` | Path constant points to root `results/.../save-reload/` | Dir **exists empty** — no `01-before-save.png`, `02-saved-local.png`, `03-after-hard-reload.png`, `06-browser-run.json`, NOTES |
| Seed fixture `w5-seed-project.json` | Planned known UUIDs | **Absent** |
| Gate wiring | Spec listed in world-standard open3d pack | Wiring ≠ pass |

**Gate language (W5):** same wall id(s) + furniture id(s) after hard reload.  
**Live E2E:** count smoke only → **false-green risk** if default room / re-place noise yields same count with different ids.

**Required residual:** assert ids via IDB snapshot parse and/or export JSON; prefer import seed with known UUIDs; land PNGs + `06-browser-run.json` on **this** machine.

---

## False-green traps

| Trap | Why it fools | Mitigation |
|------|--------------|------------|
| **Count-only W5** | Reload can restore “4 furniture” without same UUIDs | UUID equality on walls + furniture |
| **Unit continuity = W5** | JSON round-trip never opens IDB or reloads browser | Require `save-reload/` browser artifacts |
| **TopBar “Saved locally” alone = W6** | Help sells account slots; idle “Ready”; no testids; dual tables | Help rewrite + one helper + testids + grep |
| **Gate list includes save-honesty spec** | Wiring ≠ green run | Fail CP until NOTES + logs + PNGs here |
| **Shallow autosave unit PASS** | Shape/flush-idle pass without any write | Mock `saveProject` write asserts (Task 01) |
| **Empty `save-reload/` folder** | Path existence looks like evidence | Require PNGs + run JSON content |
| **Historical GATE PASS notes elsewhere** | Other machines / research maps | Re-prove under `06-save-honesty/` |
| **Stale phase §0 / P07 prose** | Claims no flush / bare Saved / server sync | Prefer `plans1` §1.1 + this live review over phase §0 |
| **Neutered double-gate** | Looks like gate still skips | Unit-prove write always happens; delete dead if |
| **Cloud branch strings in future labels** | Half-wire can re-lie | Keep `cloudEnabled=false`; cancel Task 07 unless owner unlocks |

---

## Stop rules (cloud cancel, Mode A)

1. **Approach A only (default):** Local-first honesty complete. Open3d autosave stays **IDB-only** via `createAutoSaver` / `saveProject`. Do **not** route autosave through `memberPlanRepository` / `guestPromotion` for this phase.
2. **Task 07 cloud wire: CANCEL by default.** Write cancel reason into `results/planner/world-standard-wave/06-save-honesty/NOTES.md` (`cloudEnabled=false`). Only implement dual local+cloud chrome if **owner explicitly unlocks**.
3. **No half-wire:** Do not ship “Saving to account…” / account slot copy while writes only hit IDB.
4. **Mode A stop:** If product ask shifts to “cloud as system of record in P06,” **stop and align** — that is Approach B / Task 07 unlock, not silent scope expand.
5. **Do not rebuild landed flush spine** to “make progress.” Residuals only.
6. **Do not mount** fabric `PlannerSaveIndicator` / archive fabric save flows into open3d chrome.
7. **No worktrees; no force-push.** Evidence only under repo-root `results/` (never `site/results/`).
8. **CP-06 claim rule:** Path-backed artifacts + id E2E + dual-surface honesty + help clean — or **FAIL**, no vibes.

---

## Score (live re-proof)

| Dimension | Score | Notes |
|-----------|------:|-------|
| Prior report accuracy vs live | **9 / 10** | Matches; only update: `results/.../06-save-honesty/save-reload/` now exists (empty) |
| Implementation vs Done when | **3.5 / 10** | Spine half; gates incomplete |
| W5 readiness | **2 / 10** | Count smoke; no ids; no PNGs |
| W6 readiness | **5 / 10** | Saved/saving local on bars; help/idle/testids/toast incomplete |
| Evidence honesty | **0.5 / 10** | Empty dir only |
| **Overall CP-06** | **3.5 / 10** | **FAIL** |

---

## Sources re-read (this pass)

| Path | Role |
|------|------|
| `plans1/P06-save-honesty/CODE-REVIEW-REPORT.md` | Prior review |
| `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md` | Execute residual / stop rules |
| `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | Hook / leave / flushPersist |
| `site/features/planner/persistence/persistence.ts` | AutoSaver flush/pending/double-gate |
| `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | Status label table |
| `site/features/planner/open3d/editor/TopBar.tsx` | TopBar dual table / no testids |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | isSynced JSDoc |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | hydrate/restore, handleSave, status pill |
| `site/features/planner/help/helpSections.ts` | Account slot lie |
| `site/tests/e2e/open3d-save-honesty.spec.ts` | Count-only W5 |
| `site/tests/unit/planner-autosave.test.ts` | Shallow autosave |
| `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts` | Partial labels |
| `site/tests/unit/features/planner/open3d/saveReloadContinuity.test.ts` | Unit id continuity |
| `site/config/build/playwright-open3d-world-specs.json` | Gate wiring |

**No product code changed.** This file only.

---

## Bottom line

**FAIL for CP-06.** Landed: local flush spine + mostly honest saved/saving chrome. Residual that blocks ship honesty: evidence content, UUID W5, help lies, single label contract + testids, projectRef + write units, success toast, cancel cloud with NOTES.
