# P06 — Save honesty (W5–W6)

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Use **test-driven-development**, **verification-before-completion**, and **systematic-debugging** when executing. Do not implement until owner unlocks after workflow briefing (see [00-START.md](../00-START.md)).  
> **Approach:** Plan A product journey (default). Trust **data** — repo, tests, browser evidence — not character claims.  
> **Checkout:** `D:\OandO07072026` only · **no worktrees** · commit each landable slice · push only on owner ask.

**Goal:** A facilities buyer can edit a plan, leave (or hard-reload), and get **the same walls + furniture ids** back; every status string tells the truth about **local browser storage** vs **cloud account storage**.

**Architecture (Approach A):** Open3d document model → `useOpen3dWorkspaceAutosave` → IndexedDB via `createAutoSaver` / `saveProject` → restore on mount via `loadProject` + `parseOpen3dSessionSnapshot`. Status UI in `TopBar` (via `OOPlannerWorkspace` / `WorkspaceShell`) must label **local** vs **cloud** honestly. Cloud wire is **optional** for this phase: if not wired, UI and help copy must say local-only — never imply account/cloud sync.

**Tech stack:** Next.js site · IndexedDB (`planner-workspace-db`) · open3d session envelope `open3d-1` · Vitest · Playwright under `results/planner/world-standard-wave/06-save-honesty/`.

**Gates covered:** **W5** (save → hard reload → same walls + furniture ids) · **W6** (member path status text does not lie).

**Checkpoint:** [CP-06](#cp-06--hard-stop-gate) (hard stop before claiming W5–W6 green).

**Evidence root:** `results/planner/world-standard-wave/06-save-honesty/`

**Spec authority:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (W5, W6). Parent index: [INDEX.md](../INDEX.md).

---

## 0. Ground truth (repo facts — baseline before code)

These are **measured** from the tree as of plan write. Execution agents re-verify; do not invent softer truth.

| Fact | Path / evidence | Honesty note |
|------|-----------------|--------------|
| Autosave hook is IDB-only | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | Uses `createAutoSaver`, `loadProject`, `migrateGuestProjectToMember` from `@/features/planner/persistence/persistence` |
| Debounced save = **5000 ms** | `site/features/planner/persistence/persistence.ts` → `AUTO_SAVE_DEBOUNCE_MS` | Leave or hard-reload inside window can drop latest edits |
| AutoSaver API = `scheduleSave` + `cancel` only | `createAutoSaver` | **`cancel()` clears pending timeout and does not flush** — unmount currently loses in-flight debounced work |
| Unmount cancels without flush | `useOpen3dWorkspaceAutosave` cleanup: `saverRef.current?.cancel()` | Gap for W5 leave path |
| No `beforeunload` / `pagehide` / `visibilitychange` flush in open3d | Grep under `site/features/planner` | Leave/tab-close not protected |
| Status UI says **Saved** / **Modified** / **Ready** | `site/features/planner/open3d/editor/TopBar.tsx` (`saveStatus`) | **Saved** does not say *where*; maps from `isSynced` = `status === "saved"` after **local** IDB write |
| Workspace wires flags only | `OOPlannerWorkspace.tsx` → `isModified={autosave.isModified}` `isSynced={autosave.isSynced}` `onSave={handleSave}` → `schedulePersist()` | Manual Save still debounced, not immediate flush |
| Session envelope round-trip unit exists | `site/tests/unit/features/planner/open3d/saveReloadContinuity.test.ts` + `open3dSession.test.ts` | **Unit JSON only** — not browser IDB hard reload. Evidence: `results/planner/save-reload-continuity/` |
| Member cloud repo exists but is not the open3d autosave path | `memberPlanRepository.ts`, `guestPromotion.ts` | Staging cloud client; open3d workspace does **not** call it for autosave |
| Help copy can over-claim | `site/features/planner/help/helpSections.ts` — “members keep named save slots in their account” | Must be made true **or** rewritten to local-only honesty for open3d |
| Fabric/archive path has more honest labels | `PlannerSaveIndicator.tsx` (“Saved locally…”) | Pattern to **reuse ideas**, not copy dead fabric UI wholesale into open3d |

**W5 is red until:** browser (or Playwright) hard reload after flush proves same wall + furniture **entity ids**.  
**W6 is red until:** open3d status + help never say “cloud” / “account” / bare “Saved” in a way a buyer reads as server-backed when only IDB ran.

---

## 1. Scope (do / do not)

### In scope

1. **Flush on leave** — explicit flush API on auto-saver + hook; call on unmount, `pagehide`/`visibilitychange` (hidden), and explicit Save button.
2. **W5 hard-reload proof** — Playwright (preferred) or documented chrome-devtools run: edit → flush → `location.reload()` → assert wall + furniture ids.
3. **W6 honest labels** — TopBar (and any workspace toast/help touched by save) distinguish **local browser** vs **cloud**; if cloud not wired this phase, ship **local-only** copy everywhere open3d saves.
4. Unit tests for flush semantics, label pure helpers, and non-regression of envelope parse.
5. Evidence under `results/planner/world-standard-wave/06-save-honesty/`.

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
| Status UI | `D:\OandO07072026\site\features\planner\open3d\editor\TopBar.tsx` |
| Shell passthrough (if props bubble) | Workspace shell that forwards TopBar props under `site/features/planner/open3d/editor/` (verify name at edit time; do not invent a second status pill) |
| Help / FAQ honesty | `D:\OandO07072026\site\features\planner\help\helpSections.ts` |
| Optional cloud (only if owner picks cloud wire) | `memberPlanRepository.ts`, `guestPromotion.ts`, `plannerCloudApi.ts` |
| Unit — autosave | Extend or add under `site/tests/unit/planner-autosave.test.ts` and/or `site/tests/unit/features/planner/open3d/` |
| Unit — continuity non-regression | `site/tests/unit/features/planner/open3d/saveReloadContinuity.test.ts` |
| E2E — hard reload | `site/tests/e2e/open3d-save-honesty.spec.ts` (create) |
| Evidence | `D:\OandO07072026\results\planner\world-standard-wave\06-save-honesty\` |

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

### 3.3 Pure helper (required)

Add a small pure function (prefer next to autosave or a tiny `saveStatusCopy.ts` under open3d persistence):

```ts
// Shape — implement exactly; no `any`
export type Open3dPersistStorage = "local" | "cloud";
export type Open3dSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export function open3dSaveStatusLabel(input: {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
}): string
```

Rules:

- If `cloudEnabled === false`, `storage` is always `"local"` for label purposes after a successful write.
- Never return “Saved to account” when `cloudEnabled` is false.
- Unit-test every branch (table-driven).

TopBar consumes the label string (or discrete props: `saveLabel`, `data-storage="local"|"cloud"`) so copy stays centralized.

---

## 4. Flush contract (W5 enabler)

### 4.1 `createAutoSaver` API extension

In `persistence.ts`, extend return value:

| Method | Behavior |
|--------|----------|
| `scheduleSave(snapshot)` | Debounced write (keep debounce; document ms in test) |
| `flush(snapshot?)` | **Immediate** write of provided snapshot, or last scheduled snapshot if omitted; clears debounce timer; awaits IDB put + history entry; invokes `onSaved` / `onError` |
| `cancel()` | Abort pending debounce **without** write (keep for tests / dispose when flush already completed) |
| `dispose()` | Prefer: `flush` last pending if dirty, then deactivate — **or** document that callers must `await flush()` before `cancel()` |

**Critical bug to fix while here:** after timeout fires, code still does `if (now - lastSaved < AUTO_SAVE_DEBOUNCE_MS) return;` which can **skip** a scheduled save. Flush path must **not** use that skip. Debounced path should either remove the double-gate or only debounce via timer (one gate, not two).

### 4.2 Hook surface

`useOpen3dWorkspaceAutosave` must expose:

| Export | Behavior |
|--------|----------|
| `status`, `lastSavedAt`, `isModified` | Keep; map labels via helper |
| `isSynced` | **Deprecate for UI** — do not pass as “cloud synced”. Either remove from TopBar or redefine as “local write complete” with honest naming (`isLocalSaved`) |
| `schedulePersist()` | Debounced (unchanged intent) |
| `flushPersist(): Promise<void>` | Build envelope from latest project ref; call saver `flush`; set status |
| `restoreSnapshot` | Unchanged semantics |
| `storage: "local"` (or dynamic if cloud wire lands) | For UI |
| `cloudEnabled: boolean` | Explicit false until cloud wired |

Keep a **ref** to latest project so leave handlers flush current state without stale closures.

### 4.3 Leave / reload wiring (`OOPlannerWorkspace`)

1. `useEffect` register:
   - `pagehide` → void `flushPersist()`
   - `visibilitychange` when `document.visibilityState === "hidden"` → void `flushPersist()`
2. Cleanup on unmount: `await`-pattern via void `flushPersist()` **before** dispose/cancel (never cancel a pending dirty save without flush).
3. `handleSave`: call `flushPersist()` (immediate), not only `schedulePersist()`.
4. Toast/workspace message after flush success: guest → “Draft saved locally”; member → “Plan saved locally” (or account wording only if cloud enabled and succeeded).

Playwright must wait for status pill `data-storage="local"` + saved state **or** an explicit test hook (`data-testid="open3d-save-status"`) after Save / after flush — not a blind 5s sleep only.

---

## 5. Tasks (bite-sized, sequential)

### Task 00 — Setup / verify baseline (no product claim)

- [ ] **00.1** Create evidence dir: `results/planner/world-standard-wave/06-save-honesty/`
- [ ] **00.2** Re-read this file + W5/W6 rows in world-standard design spec
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

- [ ] **01.1** Red: extend `site/tests/unit/planner-autosave.test.ts` (or sibling) with:
  1. `flush` writes immediately without waiting 5s (fake timers)
  2. `scheduleSave` then unmount-style `flush` persists last snapshot
  3. `cancel` after schedule does **not** write (existing)
  4. Double-gate regression: scheduled save after debounce **does** call `saveProject` (mock IDB or inject persistence)
- [ ] **01.2** Green: implement `flush` on `createAutoSaver` in `persistence.ts`; fix skip-after-timer logic
- [ ] **01.3** Capture:

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/planner-autosave.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\01-autosave-flush-vitest.log
```

- [ ] **01.4** Commit slice: `planner(p06): AutoSaver flush + debounce fix`

**Done when:** flush tests pass; no silent skip of debounced write.

---

### Task 02 — TDD: status label pure helper (W6)

- [ ] **02.1** Red: table tests for `open3dSaveStatusLabel` covering idle / unsaved / saving / saved / error × local; and cloud branches only when `cloudEnabled: true`
- [ ] **02.2** Green: implement helper (new small module under open3d persistence **or** colocated export from autosave file — prefer separate pure module for unit purity)
- [ ] **02.3** Assert **forbidden** bare `"Saved"` is never returned when storage is local (prefer `"Saved locally"`)
- [ ] **02.4** Evidence log + commit: `planner(p06): honest local/cloud save labels helper`

**Done when:** all label branches unit-green; no ambiguous “Saved”.

---

### Task 03 — Hook: flushPersist + leave listeners + isLocalSaved

- [ ] **03.1** Red: integration/unit test for `useOpen3dWorkspaceAutosave` with mocked `createAutoSaver`:
  - project change → schedule
  - `flushPersist` → saver.flush called
  - status transitions saving → saved
  - `storage` / `cloudEnabled` defaults
- [ ] **03.2** Green: implement in `useOpen3dWorkspaceAutosave.ts`:
  - project ref for latest envelope
  - `flushPersist`
  - rename or stop exporting misleading `isSynced` for UI (keep alias deprecated only if needed for compile; TopBar must not show “Synced”)
- [ ] **03.3** Wire `OOPlannerWorkspace.tsx`:
  - Save button → `flushPersist`
  - `pagehide` + `visibilitychange` flush
  - unmount flush-before-cancel
  - messages use local-honest strings
- [ ] **03.4** Evidence + commit: `planner(p06): open3d flush on leave and save`

**Done when:** hook tests green; workspace never cancels dirty debounce without flush.

---

### Task 04 — TopBar status UI (W6 surface)

- [ ] **04.1** Replace Modified/Saved/Ready block with labels from helper (props: `saveStatusLabel` **or** `status` + `storage` + `lastSavedAt` + `cloudEnabled`)
- [ ] **04.2** Add `role="status"` `aria-live="polite"` on the pill (if missing)
- [ ] **04.3** Add stable selectors for E2E: `data-testid="open3d-save-status"` and `data-storage="local"|"cloud"` and `data-status="idle|unsaved|saving|saved|error"`
- [ ] **04.4** Unit/render test: member + guest both show **local** wording when `cloudEnabled={false}`
- [ ] **04.5** Evidence + commit: `planner(p06): TopBar local-honest save status`

**Done when:** UI never shows bare “Saved” for IDB-only path; testids present.

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
- [ ] Log → `06-unit-continuity.log`

#### 06.B Playwright hard reload (required for W5 green)

Create `site/tests/e2e/open3d-save-honesty.spec.ts`:

**Scenario (guest or open3d route that works without auth — prefer `/planner/open3d` or `/planner/guest` as actually served):**

1. Navigate to planner open3d workspace.
2. Draw or inject **one wall** and **one furniture** entity with stable known ids if test harness allows; otherwise capture ids from DOM/`window` debug only if already exposed — prefer document model via existing test hooks. If UI draw is flaky until P07, use a **documented test-only bootstrap** already in app (pending bootstrap layout / import JSON) **without** weakening production honesty.
3. Click **Save** (flush) or wait for status `data-status="saved"` and `data-storage="local"`.
4. `page.reload({ waitUntil: "networkidle" })` (hard reload).
5. Wait for restore (“Restoring your floor plan…” gone / workspace ready).
6. Assert same **wall id(s)** and **furniture id(s)** still present (via testids on entities, JSON export download, or existing debug export — pick one stable channel and stick to it in NOTES).
7. Screenshot before save, after save, after reload → evidence PNGs.

**Fallback if Playwright env blocked:** chrome-devtools MCP scripted session with the same steps; still require screenshots + `06-browser-run.json` describing tools used. W5 stays **yellow** until Playwright lands in CI-able form — do not mark CP-06 green on unit-only.

**Commands (adjust to repo Playwright config when executing):**

```powershell
cd D:\OandO07072026\site
npx playwright test tests/e2e/open3d-save-honesty.spec.ts --reporter=line 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\06-playwright-raw.log
```

- [ ] Write `06-browser-run.json` (exitCode, wallId, furnitureId, route, browser)
- [ ] Store PNGs: `01-before-save.png`, `02-saved-local.png`, `03-after-hard-reload.png`
- [ ] Commit test + any minimal harness: `planner(p06): W5 hard reload e2e`

**Done when:** hard reload preserves wall + furniture ids with artifact proof.

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

- [ ] **08.1** Ensure folder contains at minimum:

| Artifact | Purpose |
|----------|---------|
| `00-baseline-run.json` + log | Baseline |
| `01-autosave-flush-vitest.log` (+ run.json) | Flush |
| Label unit log | W6 pure |
| Hook/TopBar unit logs | Wiring |
| `05-copy-grep.txt` | No-lie audit |
| `06-playwright-raw.log` or browser NOTES | W5 |
| `01-before-save.png` … `03-after-hard-reload.png` | Visual |
| `NOTES.md` | Commands, HEAD, route, cloudEnabled value |

- [ ] **08.2** Complete [CP-06](#cp-06--hard-stop-gate) checkboxes with **paths**, not vibes
- [ ] **08.3** Final commit if needed: `planner(p06): W5–W6 evidence pack`
- [ ] **08.4** Do **not** push unless owner asks

---

## 6. Test matrix

| Layer | What | Pass criterion |
|-------|------|----------------|
| Unit | AutoSaver flush / cancel / debounce | Immediate flush writes; cancel drops; no double-gate skip |
| Unit | `open3dSaveStatusLabel` | Every status × storage; bare “Saved” forbidden for local |
| Unit | Envelope continuity | Existing saveReloadContinuity still green |
| Component | TopBar / hook | `data-storage="local"`; Save triggers flush |
| E2E | Hard reload | Same wall + furniture ids after reload |
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
2. **Hydration:** Workspace currently sets `hydrated` true immediately and restores async. Flush tests must not race restore replacing a flushed empty default — after restore, edits then flush. E2E waits for restore complete before drawing.
3. **Envelope:** Writes go through `buildOpen3dSessionEnvelope` → JSON string in IDB `snapshot`. Restore: `parseOpen3dSessionSnapshot`.
4. **No `any`:** Strict types on helper and saver callbacks.
5. **Phosphor only** if icons change; prefer existing TopBar glyphs (● / ✓ / ○) if sufficient with new text.
6. **Inspiration only:** Competitor “autosave + cloud badge” patterns from research notes — no copied CSS/JS/assets.
7. **Skills:** TDD for Tasks 01–04; chrome-devtools or Playwright for Task 06; verification-before-completion before CP-06 claim.

---

## 8. Risk register

| Risk | Mitigation |
|------|------------|
| 5s debounce loses work on leave | Flush on hide/unmount/Save |
| Playwright flaky draw tools | Import JSON / bootstrap layout for W5 id proof; full draw journey remains P07 |
| Dual status language confuses | One pure helper; single pill |
| Cloud half-wire lies | Default local-only; Task 07 gated |
| `cancel()` on unmount races flush | Always flush then dispose; tests for order |
| Member help still claims account slots | Task 05 rewrite |

---

## CP-06 — Hard stop gate

**Stop and do not claim W5–W6 until every box is evidence-backed.**

- [ ] **CP-06.1 Flush exists:** `createAutoSaver().flush` implemented; unit log path: `results/planner/world-standard-wave/06-save-honesty/01-…`
- [ ] **CP-06.2 Leave path:** open3d workspace flushes on Save, `pagehide`/`visibilitychange`, and unmount without dropping dirty debounce
- [ ] **CP-06.3 W5 browser:** hard reload preserves **same wall id + furniture id**; PNGs + run.json under `06-save-honesty/`
- [ ] **CP-06.4 W6 copy:** status + help never imply cloud/account when only local IDB saved; grep artifact clean
- [ ] **CP-06.5 Selectors:** `data-testid="open3d-save-status"` + `data-storage` + `data-status` stable for later P07 journey
- [ ] **CP-06.6 Types:** no new `any`; typecheck clean for touched packages
- [ ] **CP-06.7 Commits:** landable slices committed on main checkout (no worktree)
- [ ] **CP-06.8 Cloud:** either Task 07 cancelled with local-only NOTES, or cloud wire + dual-status tests green

**Unlock next:** P07 draw/place browser journey may rely on this flush + status pill; do not start P07 save assertions until CP-06.3 is green.

---

## 9. Definition of done (phase)

| Gate | Definition |
|------|------------|
| **W5** | User (or Playwright) edits plan → flush → hard reload → walls + furniture **ids** match pre-reload document |
| **W6** | Open3d status + help text state **local browser** vs **account/cloud** truthfully; default path = local-only labels |
| **Evidence** | All required artifacts under `results/planner/world-standard-wave/06-save-honesty/` |
| **Honesty** | No status string a facilities buyer would misread as cloud backup if only IDB ran |

---

## 10. Handover lines (for next agent)

```
P06 save honesty — implement Tasks 00→08 in order.
Default cloudEnabled=false; honest local labels.
Flush before cancel; W5 needs hard reload proof not unit JSON alone.
Evidence: results/planner/world-standard-wave/06-save-honesty/
CP-06 hard stop before W5–W6 green claim.
Superpowers + TDD; no worktrees; commit slices; push only on ask.
```
