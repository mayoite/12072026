# P06 — Save honesty (W5–W6)

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Use **test-driven-development**, **verification-before-completion**, and **systematic-debugging** when executing. **W0 UNLOCKED** (see [00-START.md](../00-START.md)) — do not re-ask owner unlock.  
> **Approach:** Plan A product journey (default). Trust **data** — repo, tests, browser evidence — not character claims.  
> **Checkout:** `D:\OandO07072026` only · **no worktrees** · commit each landable slice · push only on owner ask.

### Expert pass P0 (2026-07-09)

- **`createAutoSaver.flush`** + retain pending snapshot / **projectRef** so leave/unmount does not drop debounce. Today: schedule+cancel only; cleanup `cancel()` loses in-flight work; Save still `schedulePersist` only.
- **Dual-surface labels (W6):** TopBar bare **Saved** / `isSynced` and member `formatAutosaveStatus` bare **Saved** must say **local** vs cloud truth; Shell JSDoc “synced to **server**” is a lie (IDB-only path).
- **Hydration race:** wait restore-complete before seed/flush in E2E; prefer guest `?plannerDevTools=1` + `clearPlannerStorage`.
- **Evidence:** `06-save-honesty/` + `save-reload/` hard-reload same wall/furniture **ids**. Spine #5 after W3 + journey priority.
- Authority: [EXPERT-PASS.md](../reviews/EXPERT-PASS.md) · `01-react-open3d.md`.

**Goal:** A facilities buyer can edit a plan, leave (or hard-reload), and get **the same walls + furniture ids** back; every status string tells the truth about **local browser storage** vs **cloud account storage**.

**Architecture (Approach A):** Open3d document model → `useOpen3dWorkspaceAutosave` → IndexedDB via `createAutoSaver` / `saveProject` → restore on mount via `loadProject` + `parseOpen3dSessionSnapshot`. Status UI in `TopBar` (via `OOPlannerWorkspace` / `WorkspaceShell`) must label **local** vs **cloud** honestly. Cloud wire is **optional** for this phase: if not wired, UI and help copy must say local-only — never imply account/cloud sync.

**Tech stack:** Next.js site · IndexedDB (`planner-workspace-db`) · open3d session envelope `open3d-1` · Vitest · Playwright under `results/planner/world-standard-wave/06-save-honesty/`.

**Gates covered:** **W5** (save → hard reload → same walls + furniture ids) · **W6** (member path status text does not lie).

**Checkpoint:** [CP-06](#cp-06--hard-stop-gate) (hard stop before claiming W5–W6 green).

**Evidence root:** `results/planner/world-standard-wave/06-save-honesty/`  
**W5 subfolder (required):** `results/planner/world-standard-wave/06-save-honesty/save-reload/`  
**Suggestions applied:** [reviews/P06-suggestions.md](../reviews/P06-suggestions.md) · see [Expert revision note 2026-07-09](#expert-revision-note-2026-07-09)

**Spec authority:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (W5, W6). Parent index: [INDEX.md](../INDEX.md).

---

## 0. Ground truth (repo facts — baseline before code)

These are **measured** from the tree (re-verified 2026-07-09 planning expert pass). Execution agents re-verify; do not invent softer truth.

| Fact | Path / evidence | Honesty note |
|------|-----------------|--------------|
| Autosave hook is IDB-only | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | Uses `createAutoSaver`, `loadProject`, `migrateGuestProjectToMember` from `@/features/planner/persistence/persistence` |
| Debounced save = **5000 ms** | `site/features/planner/persistence/persistence.ts` → `AUTO_SAVE_DEBOUNCE_MS` | Leave or hard-reload inside window can drop latest edits |
| AutoSaver API = `scheduleSave` + `cancel` only | `createAutoSaver` | **`cancel()` clears pending timeout and does not flush** — unmount currently loses in-flight debounced work |
| No pending-snapshot field for flush | `createAutoSaver` body | Snapshot lives only in timer closure — `flush()` without arg **requires** retaining last pending string |
| Double-gate skip after timer | `if (now - lastSaved < AUTO_SAVE_DEBOUNCE_MS) return` inside timeout | Confirmed still present — scheduled write can no-op |
| Unmount cancels without flush | hook cleanup: `saverRef.current?.cancel()` | Gap for W5 leave path |
| Hook has no projectRef for leave flush | `schedulePersist` closes over render `project` | Leave/flush can write stale envelope unless latest project is ref-held |
| No `beforeunload` / `pagehide` / `visibilitychange` flush in open3d | Grep under `site/features/planner` | Leave/tab-close not protected |
| **Dual** status surfaces (both can lie) | (1) `TopBar.tsx` bare **Saved** via `isSynced` (2) status bar `formatAutosaveStatus` in `workspaceStatusLabels.ts` — guest “Draft saved locally” OK; **member `"Saved"` bare** | W6 must fix **both**; single pure label source |
| Shell passthrough named | `WorkspaceShell.tsx` → TopBar `isModified` / `isSynced` / `onSave` | JSDoc today: `isSynced` = “synced to **server**” — **lie** (local IDB only) |
| Workspace wires flags only | `OOPlannerWorkspace.tsx` → props above; `handleSave` → `schedulePersist()` + toast “Saving plan…” / “Saving draft…” | Manual Save still debounced, not immediate flush; toast lacks “locally” for member |
| Hydration race | `hydrated` state forced `true` immediately; restore async via `restoreSnapshot` → `replaceProject` | Edit/flush before restore can race default room vs IDB — W5 must wait restore-complete |
| Session envelope round-trip unit exists | `site/tests/unit/features/planner/open3d/saveReloadContinuity.test.ts` + `open3dSession.test.ts` | **Unit JSON only** — not browser IDB hard reload. Evidence: `results/planner/save-reload-continuity/` |
| Autosave unit tests are shallow | `site/tests/unit/planner-autosave.test.ts` | Shape/cancel only — **no** mocked `saveProject` write asserts yet |
| Preferred W5 guest route + helpers | `/planner/guest/?plannerDevTools=1` · `tests/e2e/guestProjectSetup.ts` (`clearPlannerStorage` deletes `planner-workspace-db`) | Also `/planner/open3d`; prefer guest helpers for clean IDB |
| Member cloud repo exists but is not the open3d autosave path | `memberPlanRepository.ts`, `guestPromotion.ts` | Staging cloud client; open3d workspace does **not** call it for autosave |
| Help copy can over-claim | `site/features/planner/help/helpSections.ts` — “members keep named save slots in their account” | Must be made true **or** rewritten to local-only honesty for open3d |
| Fabric/archive path has more honest labels | `PlannerSaveIndicator.tsx` (“Saved locally…”) — **not** mounted on open3d | Pattern to **reuse ideas**, not copy dead fabric UI wholesale into open3d |

**W5 is red until:** browser (or Playwright) hard reload after flush proves same wall + furniture **entity ids** under `06-save-honesty/save-reload/`.  
**W6 is red until:** open3d **TopBar + status-bar labels + help + save toasts** never say “cloud” / “account” / bare “Saved” in a way a buyer reads as server-backed when only IDB ran.

---

## 1. Scope (do / do not)

### In scope

1. **Flush on leave** — explicit flush API on auto-saver + hook (pending snapshot + projectRef); call on unmount, `pagehide`/`visibilitychange` (hidden), and explicit Save button.
2. **W5 hard-reload proof** — Playwright (preferred) or documented chrome-devtools run: **wait restore** → edit/import → flush → hard reload → assert wall + furniture ids. Artifacts under **`save-reload/`**.
3. **W6 honest labels on all open3d surfaces** — TopBar **and** `formatAutosaveStatus` status pill **and** save toasts **and** help; single pure label source; local-only default.
4. Unit tests for flush semantics, label pure helpers (table-driven), and non-regression of envelope parse; strengthen `planner-autosave.test.ts` with real write mocks.
5. Evidence under `results/planner/world-standard-wave/06-save-honesty/` (+ `save-reload/` for W5).

### Out of scope (explicit)

- Full Supabase multi-tenant catalog migration.
- Fabric full-stage cutover.
- Multiplayer / CRDT sync.
- Photoreal mesh (W7) or shortcut chrome (W8) except if a save label shares the same status pill.
- Rewriting archived fabric session handlers as the live open3d path.
- Claiming “cloud save works” without a live wire + test in this same phase.

### Cloud decision for W6 (locked for this plan)

| Option | When to pick | W6 requirement |
|--------|--------------|----------------|
| **Local-only honesty (default for Approach A slice)** | Cloud not product-ready this sprint | UI: “Saved locally”, “Saving locally…”, “Local save failed”; help: browser storage; **no** “synced to account” |
| **Cloud wire slice** | Owner orders account save in same unlock | Wire `createMemberPlanRepository` (or existing `plannerCloudApi`) on authenticated open3d Save; status shows local + cloud states separately; proof both paths |

**Default execution path:** Local-only honesty + flush + hard reload. Do **not** ship half-wired cloud labels.

---

## 2. Target files (touch list)

| Role | Absolute path |
|------|----------------|
| Autosave hook | `D:\OandO07072026\site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts` |
| IDB + AutoSaver | `D:\OandO07072026\site\features\planner\persistence\persistence.ts` |
| Session envelope | `D:\OandO07072026\site\features\planner\open3d\persistence\open3dSession.ts` |
| Project JSON | `D:\OandO07072026\site\features\planner\open3d\persistence\projectJson.ts` |
| Workspace wiring | `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| Status UI (TopBar) | `D:\OandO07072026\site\features\planner\open3d\editor\TopBar.tsx` |
| Status UI (status-bar labels) | `D:\OandO07072026\site\features\planner\open3d\editor\workspaceStatusLabels.ts` — **extend or wrap**; do not leave bare member `"Saved"` |
| Shell passthrough | `D:\OandO07072026\site\features\planner\open3d\editor\WorkspaceShell.tsx` — forwards TopBar props; rewrite “synced to server” JSDoc/prop names |
| Label pure helper | Prefer extend `formatAutosaveStatus` **or** one new pure module both TopBar + status bar call — **one copy table only** |
| Help / FAQ honesty | `D:\OandO07072026\site\features\planner\help\helpSections.ts` |
| Optional cloud (only if owner picks cloud wire) | `memberPlanRepository.ts`, `guestPromotion.ts`, `plannerCloudApi.ts` |
| Unit — autosave | `site/tests/unit/planner-autosave.test.ts` (mock `saveProject`; flush + double-gate) |
| Unit — labels | `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts` (+ TopBar/render if needed) |
| Unit — continuity non-regression | `site/tests/unit/features/planner/open3d/saveReloadContinuity.test.ts` |
| E2E helpers (reuse) | `site/tests/e2e/guestProjectSetup.ts`, `plannerCanvasHelpers.ts` |
| E2E — hard reload | `site/tests/e2e/open3d-save-honesty.spec.ts` (create) |
| Evidence (W6 + shared) | `D:\OandO07072026\results\planner\world-standard-wave\06-save-honesty\` |
| Evidence (W5 hard reload) | `D:\OandO07072026\results\planner\world-standard-wave\06-save-honesty\save-reload\` |

**Do not** treat `PlannerSaveIndicator.tsx` as the live open3d control; reuse its **label honesty pattern** only.

---

## 3. Label contract (copy that does not lie)

### 3.1 Storage tiers (machine + human)

| Machine key | Human label (EN) | When true |
|-------------|------------------|-----------|
| `storage: "local"` | “Saved locally” / “Saving locally…” / “Local save failed” | IDB `saveProject` success / in flight / error |
| `storage: "cloud"` | “Saved to account” / “Saving to account…” / “Account save failed” | Only after authenticated cloud API success path is **actually called** and returns ok |
| Dirty | “Unsaved changes” | Local document newer than last successful local write |
| Idle ready | “Ready” | No edits since load; nothing pending |

### 3.2 Forbidden strings in open3d path (while cloud unwired)

- Bare **“Saved”** without “locally” (TopBar today).
- **“Synced”** / `isSynced` exposed as user-facing sync-to-server language.
- Help: “members keep named save slots in their account” **unless** cloud wire is proven in this phase.
- Any toast: “Saving plan…” that implies server without local qualifier when only IDB runs.

### 3.3 Pure helper (required) — single source for **both** surfaces

**Live debt:** `formatAutosaveStatus` already exists and is unit-tested; member branch returns bare `"Saved"`. TopBar still hardcodes Modified/Saved/Ready.

**Contract:** One pure function (either evolve `formatAutosaveStatus` in `workspaceStatusLabels.ts` **or** add `open3dSaveStatusLabel` and make TopBar + status bar both call it). **Forbidden:** two independent switch tables that can drift.

```ts
// Shape — implement exactly; no `any`
export type Open3dPersistStorage = "local" | "cloud";
export type Open3dSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export function open3dSaveStatusLabel(input: {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean; // optional nuance for “Draft saved locally” vs “Plan saved locally”
}): string
```

Rules:

- If `cloudEnabled === false`, `storage` is always `"local"` for label purposes after a successful write.
- Never return “Saved to account” when `cloudEnabled` is false.
- Never return bare `"Saved"` for local storage (prefer `"Saved locally"` / guest `"Draft saved locally"`).
- Unit-test every branch (table-driven) in `workspaceStatusLabels.test.ts` or sibling — update existing expectations that currently allow bare `"Saved"`.

TopBar + status bar consume the label string (or discrete props: `saveLabel`, `data-storage="local"|"cloud"`) so copy stays centralized.

---

## 4. Flush contract (W5 enabler)

### 4.1 `createAutoSaver` API extension

In `persistence.ts`, extend return value **and** retain pending work:

| Method / field | Behavior |
|----------------|----------|
| `scheduleSave(snapshot)` | Store as **last pending snapshot**; debounced write (keep debounce; document ms in test) |
| `flush(snapshot?)` | **Immediate** write of provided snapshot, or **last pending** if omitted; clears debounce timer; awaits IDB put + history entry; invokes `onSaved` / `onError`; no-op cleanly if nothing pending and no arg |
| `cancel()` | Abort pending debounce **without** write (keep for tests / dispose when flush already completed) |
| `dispose()` | Prefer: `flush` last pending if dirty, then deactivate — **or** document that callers must `await flush()` before `cancel()` |

**Critical bug to fix while here:** after timeout fires, code still does `if (now - lastSaved < AUTO_SAVE_DEBOUNCE_MS) return;` which can **skip** a scheduled save. Flush path must **not** use that skip. Debounced path should either remove the double-gate or only debounce via timer (one gate, not two).

**Internals (required for correct flush):** keep `pendingSnapshot: string | null` (name free) updated on every `scheduleSave`; clear after successful write or cancel.

### 4.2 Hook surface

`useOpen3dWorkspaceAutosave` must expose:

| Export | Behavior |
|--------|----------|
| `status`, `lastSavedAt`, `isModified` | Keep; map labels via helper |
| `isSynced` | **Deprecate for UI** — do not pass as “cloud synced”. Either remove from TopBar/Shell or redefine as “local write complete” with honest naming (`isLocalSaved`) |
| `schedulePersist()` | Debounced (unchanged intent); uses **latest** project via ref |
| `flushPersist(): Promise<void>` | Build envelope from **projectRef.current**; call saver `flush`; set status |
| `restoreSnapshot` | Unchanged semantics |
| `storage: "local"` (or dynamic if cloud wire lands) | For UI |
| `cloudEnabled: boolean` | Explicit false until cloud wired |

**Required:** `projectRef` always tracks latest `project` so leave handlers / Save never flush a stale closure. Optional: do not schedule autosave until initial restore attempt has settled (if implementers gate it — E2E must still wait restore-complete regardless).

### 4.3 Leave / reload wiring (`OOPlannerWorkspace` + `WorkspaceShell`)

1. `useEffect` register:
   - `pagehide` → void `flushPersist()`
   - `visibilitychange` when `document.visibilityState === "hidden"` → void `flushPersist()`
2. Cleanup on unmount: `await`-pattern via void `flushPersist()` **before** dispose/cancel (never cancel a pending dirty save without flush).
3. `handleSave`: call `flushPersist()` (immediate), not only `schedulePersist()`.
4. Toast/workspace message: guest → “Saving draft locally…” / “Draft saved locally”; member (local-only) → “Saving plan locally…” / “Plan saved locally” — **never** bare “Saving plan…” as account implication.
5. Pass honest label props through **`WorkspaceShell` → `TopBar`** (and status bar continues to use the same pure helper).

Playwright must wait for status pill `data-storage="local"` + saved state **or** an explicit test hook (`data-testid="open3d-save-status"`) after Save / after flush — not a blind 5s sleep only.

---

## 5. Tasks (bite-sized, sequential)

### Task 00 — Setup / verify baseline (no product claim)

- [ ] **00.1** Create evidence dirs: `results/planner/world-standard-wave/06-save-honesty/` **and** `…/06-save-honesty/save-reload/`
- [ ] **00.2** Re-read this file + W5/W6 rows in world-standard design spec + [P06-suggestions.md](../reviews/P06-suggestions.md)
- [ ] **00.3** Run existing continuity units and capture logs:

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/saveReloadContinuity.test.ts tests/unit/features/planner/open3d/open3dSession.test.ts tests/unit/planner-autosave.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\00-baseline-vitest.log
```

- [ ] **00.4** Write `00-baseline-run.json` (schemaVersion 1: command, exitCode, passed/failed, timestamp)
- [ ] **00.5** Note HEAD commit in `NOTES.md` (one short file in evidence dir is allowed as run notes)

**Done when:** baseline log exists; agents know unit continuity is green and browser W5 is still unproven.

---

### Task 01 — TDD: AutoSaver flush + debounce gate fix

- [ ] **01.1** Red: extend `site/tests/unit/planner-autosave.test.ts` (today: API-shape only — **must** mock/spy `saveProject` for real asserts) with:
  1. `flush` writes immediately without waiting 5s (fake timers)
  2. `scheduleSave` then unmount-style `flush` persists **last pending** snapshot (no arg)
  3. `cancel` after schedule does **not** write
  4. Double-gate regression: scheduled save after debounce **does** call `saveProject` (mock IDB or inject persistence)
  5. `flush` path never applies the post-timer `lastSaved` skip
- [ ] **01.2** Green: implement `flush` + **pending snapshot retention** on `createAutoSaver` in `persistence.ts`; fix skip-after-timer logic
- [ ] **01.3** Capture:

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/planner-autosave.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\01-autosave-flush-vitest.log
```

- [ ] **01.4** Commit slice: `planner(p06): AutoSaver flush + debounce fix`

**Done when:** flush tests pass; no silent skip of debounced write.

---

### Task 02 — TDD: status label pure helper (W6) — **single source**

- [ ] **02.1** Red: table tests covering idle / unsaved / saving / saved / error × local; cloud branches only when `cloudEnabled: true`. **Update** existing `workspaceStatusLabels.test.ts` expectations that currently allow member bare `"Saved"`.
- [ ] **02.2** Green: one helper only — evolve `formatAutosaveStatus` **or** add `open3dSaveStatusLabel` and route both TopBar + status bar through it (no dual tables).
- [ ] **02.3** Assert **forbidden** bare `"Saved"` is never returned when storage is local (prefer `"Saved locally"` / guest draft wording).
- [ ] **02.4** Evidence log + commit: `planner(p06): honest local/cloud save labels helper`

**Done when:** all label branches unit-green; no ambiguous “Saved” from the pure helper.

---

### Task 03 — Hook: flushPersist + leave listeners + isLocalSaved

- [ ] **03.1** Red: integration/unit test for `useOpen3dWorkspaceAutosave` with mocked `createAutoSaver`:
  - project change → schedule
  - `flushPersist` → saver.flush called with **latest** snapshot (projectRef)
  - status transitions saving → saved
  - `storage` / `cloudEnabled` defaults
- [ ] **03.2** Green: implement in `useOpen3dWorkspaceAutosave.ts`:
  - **projectRef** for latest envelope
  - `flushPersist`
  - rename or stop exporting misleading `isSynced` for UI (keep alias deprecated only if needed for compile; TopBar/Shell must not show “Synced” / “server”)
- [ ] **03.3** Wire `OOPlannerWorkspace.tsx` + prop path through **`WorkspaceShell.tsx`**:
  - Save button → `flushPersist`
  - `pagehide` + `visibilitychange` flush
  - unmount flush-before-cancel
  - workspace messages use local-honest strings (no bare “Saving plan…”)
- [ ] **03.4** Evidence + commit: `planner(p06): open3d flush on leave and save`

**Done when:** hook tests green; workspace never cancels dirty debounce without flush.

---

### Task 04 — TopBar **and** status-bar UI (W6 surfaces)

- [ ] **04.1** Replace TopBar Modified/Saved/Ready block with labels from **shared** helper (props: `saveStatusLabel` **or** `status` + `storage` + `lastSavedAt` + `cloudEnabled`)
- [ ] **04.2** Wire status-bar pill (`formatAutosaveStatus` call site in `OOPlannerWorkspace`) to the **same** helper output — member must not stay on bare `"Saved"`
- [ ] **04.3** Add `role="status"` `aria-live="polite"` on TopBar pill (if missing); keep parity with status-bar a11y where present
- [ ] **04.4** Add stable selectors for E2E: `data-testid="open3d-save-status"` and `data-storage="local"|"cloud"` and `data-status="idle|unsaved|saving|saved|error"` on the primary pill (TopBar)
- [ ] **04.5** Unit/render test: member + guest both show **local** wording when `cloudEnabled={false}` on **both** surfaces
- [ ] **04.6** Fix `WorkspaceShell` / TopBar JSDoc and prop names so nothing claims “synced to server” for local IDB
- [ ] **04.7** Evidence + commit: `planner(p06): TopBar + status-bar local-honest save status`

**Done when:** neither surface shows bare “Saved” for IDB-only path; testids present; Shell docs honest.

---

### Task 05 — Help / FAQ copy audit (no lies)

- [ ] **05.1** Edit `helpSections.ts` saving + FAQ answers:
  - Truthful default: “Plans autosave in **this browser** (local storage). Clearing site data removes them.”
  - Member cloud sentence **only** if Task 07 cloud wire ships; otherwise remove or rephrase: “Account cloud save is not enabled for open3d yet — your plan is stored locally in this browser.”
- [ ] **05.2** Grep open3d workspace strings for “cloud”, “sync”, “account” save claims:

```powershell
cd D:\OandO07072026\site
rg -n "Saved|cloud|sync|account|autosave" features/planner/open3d/editor features/planner/open3d/persistence features/planner/help/helpSections.ts
```

- [ ] **05.3** Fix every hit that over-claims; paste grep clean result into evidence `05-copy-grep.txt`
- [ ] **05.4** Commit: `planner(p06): honest save help copy`

**Done when:** grep shows no over-claim; evidence file stored.

---

### Task 06 — W5 hard reload test plan (browser proof)

#### 06.A Unit non-regression (fast)

- [ ] Re-run `saveReloadContinuity.test.ts` + session tests after envelope/hook changes
- [ ] Log → `results/planner/world-standard-wave/06-save-honesty/06-unit-continuity.log` (parent folder OK for unit)

#### 06.B Playwright hard reload (required for W5 green)

Create `site/tests/e2e/open3d-save-honesty.spec.ts`.

**Default route:** `/planner/guest/?plannerDevTools=1` via `enterGuestPlannerWorkspace` / `clearPlannerStorage` (deletes `planner-workspace-db`). Secondary: `/planner/open3d` if guest gate blocks.

**Scenario:**

1. Navigate with **clean** planner storage (helpers above).
2. **Wait restore-complete** (workspace ready / no pending restore replace) **before** seeding entities — avoid racing default room vs IDB.
3. Seed **one wall** + **one furniture** with stable known ids: prefer **import JSON** / existing bootstrap over flaky draw (full draw journey is **P07**). Capture ids via export JSON channel or stable test hook; document channel in NOTES.
4. Click **Save** (flush) — wait for `data-testid="open3d-save-status"` with `data-status="saved"` and `data-storage="local"` (not 5s sleep alone).
5. Hard reload: `page.reload({ waitUntil: "networkidle" })` (or equivalent hard navigation).
6. Wait restore-complete again.
7. Assert **same wall id(s)** and **furniture id(s)**.
8. Screenshots → **`save-reload/`** PNGs.

**Fallback if Playwright env blocked:** chrome-devtools MCP scripted session with the same steps; still require screenshots + `save-reload/06-browser-run.json`. W5 stays **yellow** until Playwright lands in CI-able form — do not mark CP-06 green on unit-only.

**Commands:**

```powershell
cd D:\OandO07072026\site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\06-save-honesty\save-reload | Out-Null
npx playwright test tests/e2e/open3d-save-honesty.spec.ts --reporter=line 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\save-reload\06-playwright-raw.log
```

- [ ] Write `save-reload/06-browser-run.json` (exitCode, wallId, furnitureId, route, browser, cloudEnabled)
- [ ] Store PNGs under `save-reload/`: `01-before-save.png`, `02-saved-local.png`, `03-after-hard-reload.png`
- [ ] Commit test + any minimal harness: `planner(p06): W5 hard reload e2e`

**Done when:** hard reload preserves wall + furniture ids with artifact proof in **`save-reload/`**.

---

### Task 07 — Cloud wire (optional; only if owner unlocks cloud in same phase)

If owner chooses **local-only**, mark this task **cancelled** in the checklist with reason “owner chose local-only honesty” and skip.

If owner chooses cloud:

- [ ] **07.1** Authenticated Save calls `createMemberPlanRepository(...).save(...)` **after** successful local flush (local-first)
- [ ] **07.2** Status labels: local saved → then “Saving to account…” → “Saved to account” or keep “Saved locally” + separate cloud substatus if dual-state
- [ ] **07.3** Failure: local success + cloud fail → “Saved locally · Account save failed” (never hide local success)
- [ ] **07.4** Tests: mock fetch token paths; no real secrets in evidence
- [ ] **07.5** Evidence + commit: `planner(p06): optional open3d cloud save wire`

**Done when:** cloud claims match wire; dual failure modes unit-tested.

---

### Task 08 — Evidence pack + CP-06

- [ ] **08.1** Ensure folders contain at minimum:

| Artifact | Purpose |
|----------|---------|
| `06-save-honesty/00-baseline-run.json` + log | Baseline |
| `06-save-honesty/01-autosave-flush-vitest.log` (+ run.json) | Flush |
| Label unit log under `06-save-honesty/` | W6 pure |
| Hook/TopBar/status-label unit logs | Wiring both surfaces |
| `06-save-honesty/05-copy-grep.txt` | No-lie audit (TopBar + status labels + help + toasts) |
| `06-save-honesty/save-reload/06-playwright-raw.log` or browser NOTES | **W5** |
| `save-reload/01-before-save.png` … `03-after-hard-reload.png` | Visual W5 |
| `06-save-honesty/NOTES.md` (+ optional `save-reload/NOTES.md`) | Commands, HEAD, route, cloudEnabled, id channel |

- [ ] **08.2** Complete [CP-06](#cp-06--hard-stop-gate) checkboxes with **paths**, not vibes
- [ ] **08.3** Final commit if needed: `planner(p06): W5–W6 evidence pack`
- [ ] **08.4** Do **not** push unless owner asks

---

## 6. Test matrix

| Layer | What | Pass criterion |
|-------|------|----------------|
| Unit | AutoSaver flush / cancel / debounce + pending snapshot | Immediate flush writes; cancel drops; no double-gate skip |
| Unit | Shared label helper (TopBar + status bar) | Every status × storage; bare “Saved” forbidden for local |
| Unit | Envelope continuity | Existing saveReloadContinuity still green |
| Component | TopBar + status pill / hook / Shell props | `data-storage="local"`; Save triggers flush; no “server sync” wording |
| E2E | Hard reload (`save-reload/`) | Same wall + furniture ids after reload |
| Copy | Grep | No account/cloud lie while `cloudEnabled=false` |

Non-regression (run after landable slices when time allows):

```powershell
cd D:\OandO07072026\site
pnpm p0:unit
```

Do not delete or filter failing output; park full logs under the evidence dir.

---

## 7. Implementation notes (execute without guessing)

1. **Guest vs member project ids:** `getPlannerProjectId(guestMode, planId)` — guest `planner-guest-local`; member `planner-member-local` or `planner-member-local:{planId}`. Restore must use the same id after reload.
2. **Hydration race:** Workspace sets `hydrated` true immediately and restores async. Do not race restore replacing a flushed default — E2E waits restore-complete before seed/edit/flush. Consider restore-settled gate for schedule if needed.
3. **Envelope:** Writes go through `buildOpen3dSessionEnvelope` → JSON string in IDB `snapshot`. Restore: `parseOpen3dSessionSnapshot`.
4. **Flush internals:** AutoSaver keeps last pending snapshot; hook keeps `projectRef`; leave uses `flushPersist` not `cancel`-first.
5. **Dual UI:** TopBar **and** status-bar labels share one pure helper; Shell must not document `isSynced` as server sync.
6. **No `any`:** Strict types on helper and saver callbacks.
7. **Phosphor only** if icons change; prefer existing TopBar glyphs (● / ✓ / ○) if sufficient with new text.
8. **Inspiration only:** Competitor “autosave + cloud badge” patterns from research notes — no copied CSS/JS/assets. Fabric `PlannerSaveIndicator` = pattern only.
9. **Skills:** `/using-superpowers`; TDD for Tasks 01–04; chrome-devtools or Playwright for Task 06; verification-before-completion before CP-06 claim.
10. **Checkout:** `D:\OandO07072026` only · **no worktrees** · commit landable slices · push only on owner ask.

---

## 8. Risk register

| Risk | Mitigation |
|------|------------|
| 5s debounce loses work on leave | Flush on hide/unmount/Save; pending snapshot retained |
| Stale project on leave flush | `projectRef.current` always latest |
| Restore races default room | Wait restore-complete before W5 seed; optional schedule gate |
| Playwright flaky draw tools | Import JSON / bootstrap for W5 id proof; full draw journey remains P07 |
| Dual status surfaces drift | **One** pure helper for TopBar + status bar |
| Cloud half-wire lies | Default local-only; Task 07 gated |
| `cancel()` on unmount races flush | Always flush then dispose; tests for order |
| Member help / toast still claims account | Task 05 + Task 03 message strings |
| Evidence misplaced | W5 artifacts only accepted under `save-reload/` |

---

## CP-06 — Hard stop gate

**Stop and do not claim W5–W6 until every box is evidence-backed.**

- [ ] **CP-06.1 Flush exists:** `createAutoSaver().flush` + pending-snapshot retention; unit log: `results/planner/world-standard-wave/06-save-honesty/01-…`
- [ ] **CP-06.2 Leave path:** open3d workspace flushes on Save, `pagehide`/`visibilitychange`, and unmount without dropping dirty debounce (`projectRef` latest)
- [ ] **CP-06.3 W5 browser:** hard reload preserves **same wall id + furniture id**; PNGs + run.json under `06-save-honesty/save-reload/`
- [ ] **CP-06.4 W6 copy:** **TopBar + status-bar labels + help + save toasts** never imply cloud/account when only local IDB saved; grep artifact clean; **no bare “Saved”**
- [ ] **CP-06.5 Selectors:** `data-testid="open3d-save-status"` + `data-storage` + `data-status` stable for later P07 journey
- [ ] **CP-06.6 Types:** no new `any`; typecheck clean for touched packages
- [ ] **CP-06.7 Commits:** landable slices committed on main checkout (no worktree)
- [ ] **CP-06.8 Cloud:** either Task 07 cancelled with local-only NOTES, or cloud wire + dual-status tests green
- [ ] **CP-06.9 Dual surfaces:** shared pure helper drives both TopBar and `formatAutosaveStatus` path; Shell does not claim server sync

**Unlock next:** P07 draw/place browser journey may rely on this flush + status pill; do not start P07 save assertions until CP-06.3 is green.

---

## 9. Definition of done (phase)

| Gate | Definition |
|------|------------|
| **W5** | User (or Playwright) seeds plan → flush → hard reload → walls + furniture **ids** match; proof in **`save-reload/`** |
| **W6** | Open3d TopBar + status bar + help + toasts state **local browser** vs **account/cloud** truthfully; default = local-only; **no bare “Saved”** |
| **Evidence** | Shared pack under `06-save-honesty/` + W5 under `06-save-honesty/save-reload/` |
| **Honesty** | No status string a facilities buyer would misread as cloud backup if only IDB ran |

---

## 10. Handover lines (for next agent)

```
P06 save honesty — implement Tasks 00→08 in order.
Default cloudEnabled=false; honest local labels on TopBar AND status bar.
One pure label helper; no bare “Saved”; Shell not “server synced”.
Flush before cancel; projectRef + pending snapshot; W5 = hard reload not unit JSON.
W5 evidence: results/planner/world-standard-wave/06-save-honesty/save-reload/
Guest route default: /planner/guest/?plannerDevTools=1; wait restore before seed.
CP-06 hard stop before W5–W6 green claim.
Superpowers + TDD; no worktrees; commit slices; push only on ask.
```

---

## Expert revision note 2026-07-09

**Role:** Planning expert (plan-only; no product code).  
**Inputs:** Live tree verify of autosave / persistence / TopBar / Shell / status labels; [reviews/P06-suggestions.md](../reviews/P06-suggestions.md).  
**Constraints held:** W5 hard reload + W6 honest labels; no lying bare “Saved”; `/using-superpowers`; no worktrees; Approach A.

### Top 5 applied (this revision)

1. **Dual W6 surfaces** — TopBar **and** `formatAutosaveStatus` status pill both ship bare/ambiguous “Saved” for members; require one pure label source and Task 04 covers both.
2. **`WorkspaceShell.tsx` locked** — named passthrough; kill “synced to server” JSDoc/prop semantics; honest `isLocalSaved` / label props path.
3. **W5 evidence under `save-reload/`** — aligns RESULTS-MAP / CP-06; Playwright log, run.json, PNGs not only flat parent folder.
4. **Flush correctness** — AutoSaver **pending snapshot** + hook **projectRef**; flush must not use double-gate skip; cancel-after-flush order documented.
5. **Restore-before-edit + guest route** — wait restore-complete; default `/planner/guest/?plannerDevTools=1` + existing storage helpers; import JSON preferred for stable ids (P07 owns full draw).

### Secondary notes (in plan, lower priority)

- Strengthen `planner-autosave.test.ts` with mocked writes (S7).  
- Local-honest Save toasts (S8).  
- Task 07 cloud remains optional/default cancelled (S10).  

### Not done (execution still required)

- No implementation; W5/W6 remain **red** until CP-06 evidence exists.  
- **W0 unlocked** — product code allowed per `00-START.md` (do not re-ask unlock).