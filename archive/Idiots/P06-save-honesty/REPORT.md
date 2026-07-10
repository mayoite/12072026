# P06 — Save honesty (W5–W6) — Brainstormer REPORT

| Field | Value |
|-------|--------|
| **Agent** | BRAINSTORMER 06/10 |
| **Phase** | P06 · W5–W6 · `Plans/phases/P06-save-honesty/` |
| **Workspace** | `D:\OandO07072026` (main checkout only · no worktrees) |
| **Write scope** | **Only** `Idiots/P06-save-honesty/` |
| **Code in this deliverable** | **None** (design / critique / test matrix / raised bar only) |
| **Date of report** | 2026-07-10 |
| **Skills** | `/using-superpowers` · brainstorming (explore → approaches → design → self-review; implementers own TDD) |
| **Authority order** | Owner intent > live repo facts > phase execute card > expert pass > research maps > historical scoreboard notes |

---

## 0. Executive verdict (brutal)

### What P06 is for

A **facilities buyer** edits a plan, **leaves or hard-reloads**, and gets **the same walls + furniture entity ids** back. Every status string tells the truth about **local browser storage** vs **cloud account storage**. That is the whole phase. Photoreal mesh, Fabric cutover, multiplayer, and full draw journeys are **not** this phase.

### North-star sentence (buyer)

> “I finished a layout late Friday. Monday I open the same browser and the **same desks and walls are still there with the same ids**. The UI never told me my plan was in ‘my account’ if it only lived in this browser.”

If that sentence is false, **W5 fails**. If the UI over-claims cloud/account while only IndexedDB ran, **W6 fails**. Unit JSON round-trips alone do **not** buy either gate.

### Live status vs plan prose (re-verified 2026-07-10 against tree)

The 2026-07-09 expert pass described a pre-flush world. **Code has moved.** Scoreboard docs (`ayushdocs/19-GOALS-SLICES.md`) claim **W5–W6 PASS**. This workspace’s `results/planner/` tree is **not present** at report time — so **PASS cannot be re-proved from artifacts here**. Treat scoreboard PASS as **claim until re-evidenced**, not as absolution.

| Area | Plan baseline (2026-07-09) | Live tree now | Honesty call |
|------|----------------------------|---------------|--------------|
| `createAutoSaver.flush` | Absent | **Present** + `pendingSnapshot` | Progress landed |
| Leave listeners (`pagehide` / visibility) | Absent | **Present** on hook | Progress landed |
| Unmount | `cancel()` only | **flush then cancel** | Progress landed |
| Manual Save | `schedulePersist` only | **`flushPersist`** | Progress landed |
| TopBar bare “Saved” | Present | Shows **“Saved locally”** | Progress landed |
| Status-bar `formatAutosaveStatus` | Member bare `"Saved"` | **“Saved locally”** / guest draft wording | Progress landed |
| Shell “synced to server” JSDoc | Lie | Rewritten to **local IDB until cloud** | Progress landed |
| Help “named save slots in their account” | Lie | **Still present** (summary + FAQ) | **W6 residual red** |
| `data-testid="open3d-save-status"` + `data-storage` | Required | **Missing** on TopBar pill | **W6 residual / E2E hardness** |
| Single pure helper with `storage` × `cloudEnabled` | Required | Partial — `formatAutosaveStatus(status, guestMode)` only; TopBar still dual table via `isModified`/`isSynced` | **Drift risk** |
| Hook `projectRef` always latest | Required | **`schedulePersist` / `flushPersist` close over render `project`**; leave flush uses saver only (pending snapshot, not rebuild-from-ref) | **Correctness residual** |
| Double-gate skip after timer | Present as no-op risk | Timer always proceeds to `persistSnapshot` (empty if body; gate effectively dead) | Mostly fixed; dead code remains |
| Autosave unit write mocks | Weak shape tests | Still **shallow** (API shape + idle flush; no mocked `saveProject` write asserts) | **Test debt** |
| W5 hard reload | Browser ids | Spec exists; asserts **furniture count**, **not wall+furniture entity ids** | **W5 bar incomplete vs plan** |
| Evidence under `06-save-honesty/save-reload/` | Required for CP-06 | **Not in this checkout’s `results/`** | **Cannot re-prove** |
| Cloud wire | Optional / default off | Still **not** open3d autosave path | Correct default |

**Bottom line for implementers / head:** Do **not** declare P06 “done forever.” Land residual honesty (help, selectors, projectRef leave flush, id-level W5), re-run evidence into root `results/planner/world-standard-wave/06-save-honesty/`, and only then re-claim CP-06 with paths.

### Recommended posture

**Local-only honesty + flush correctness + hard-reload identity** remains the default Approach A slice. **Do not** half-wire cloud labels. Task 07 stays cancelled unless owner unlocks cloud in the same phase.

---

## 1. Sources read (exhaustion ledger)

### 1.1 Phase folder (all)

| File | Role |
|------|------|
| `Plans/phases/P06-save-honesty/P06-save-honesty.md` | Execute card — flush, dual labels, W5 E2E, CP-06 |
| `Plans/phases/P06-save-honesty/P06-suggestions.md` | Expert verification snapshot + S1–S10 |
| `Plans/phases/P06-save-honesty/01-react-open3d.md` | React/open3d expert essay (P03/P04/P06/P07) |
| `Plans/phases/P06-save-honesty/README.md` | Local index |

### 1.2 Consolidated expert + program

| File | Role |
|------|------|
| `Plans/phases/EXPERT-PASS.md` | Merged P0: save flush + dual surfaces; kill order spine |
| `Plans/INDEX.md` | P06 = CP-06 · W5–W6 · evidence `06-save-honesty/` |
| `Plans/Research/RESEARCH-MAP.md` | P06 maps to realtime/save + Floorplanner patterns |
| `Plans/Research/RESULTS-MAP.md` | Artifact layout; W5 under `save-reload/` |
| `Plans/Research/STRUCTURE-ADVICE.md` · `STRUCTURE-ADVICE-2.md` | Keep W5+W6 one phase; dual evidence subfolder |
| `Plans/Research/Others/00-PENDING.md` | W5–W6 local only; cloud later |
| `Plans/Research/Others/18-PRODUCT-CONTEXT.md` · `19-GOALS-SLICES.md` | Product why + scoreboard claim |

### 1.3 Competitive / websites (patterns only — ethics binding)

| Path | Use for P06 |
|------|-------------|
| `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\REPORT.md` | **Primary** realtime/save matrix + honesty rules |
| `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\SCORES.csv` | Scores |
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | “Save that returns” → IDB + flush-on-exit |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Save column winners |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | Self-score realtime_save = 2 (historical) |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | Manual save + cloud projects patterns |
| `D:\websites\floorplanner.com\raw\*Manual*.md` · pricing | Save shortcut, version restore, account projects |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Cloud project CRUD pattern |
| `D:\websites\planner5d.com\raw\editor\*faq*` | Multi-device sync marketing claims |
| `D:\websites\README.md` | Research home + no-clone ethics |

**Firecrawl is dead** for active work. No re-scrape. Patterns only — never competitor code, CSS, GLB, or brand into `site/`.

### 1.4 Live product code (ground truth re-check)

| Path | Why |
|------|-----|
| `site/features/planner/persistence/persistence.ts` | IDB, `createAutoSaver`, debounce, project ids |
| `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | Hook: schedule / flush / leave / restore |
| `site/features/planner/open3d/persistence/open3dSession.ts` | Envelope `open3d-1` |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Hydration, Save, shell wiring |
| `site/features/planner/open3d/editor/TopBar.tsx` | Buyer-visible save pill |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | Prop passthrough / JSDoc |
| `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | Status-bar labels |
| `site/features/planner/help/helpSections.ts` | Help / FAQ save lies |
| `site/features/planner/ui/PlannerSaveIndicator.tsx` | Archive honesty **pattern** (not live open3d) |
| `site/features/planner/open3d/persistence/memberPlanRepository.ts` | Cloud client exists; not open3d autosave |
| `site/tests/unit/planner-autosave.test.ts` | Weak flush coverage |
| `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts` | Label unit |
| `site/tests/unit/features/planner/open3d/saveReloadContinuity.test.ts` | Envelope unit only |
| `site/tests/e2e/open3d-save-honesty.spec.ts` | Browser W5 sketch |
| `site/tests/e2e/guestProjectSetup.ts` | IDB clear helpers (reload-safe vs init wipe) |

---

## 2. Buyer story — “return next day”

### 2.1 Personas

| Persona | Job | Failure mode that kills trust |
|---------|-----|-------------------------------|
| **Facilities buyer / workplace designer** | Lay out a floor, leave, return Monday, present layout | Plan empty or different entity set after reload |
| **Guest evaluator** | Try product without account | Thinks work is in “account”; clears cookies → gone; blames product |
| **Member (local-only today)** | Logs in; still IDB | Sees bare “Saved” / help “slots in account” → assumes multi-device backup |
| **Member (future cloud)** | Needs multi-device | Dual-status must not collapse local success into cloud failure silence |

### 2.2 Journey frames that define W5–W6

1. **Friday 17:40** — place walls + furniture; status becomes honest local saved.  
2. **Friday 17:41** — close tab / navigate away / laptop sleep (visibility hidden).  
3. **Monday 09:05** — same browser profile, same origin, hard open `/planner/guest` or member path.  
4. **Assert** — same wall ids, same furniture ids, same geometry essentials.  
5. **Copy audit** — no string that a non-engineer would read as “this is in my O&O account cloud.”

### 2.3 What “same ids” means (identity contract)

Not “looks similar.” Not “furniture count ≥ N.”

| Entity | Must preserve | Why |
|--------|---------------|-----|
| Wall entity `id` | Exact string | Undo, selection, openings attachment, BOQ lines later |
| Furniture entity `id` | Exact string | Selection, quote cart, mesh bind, multi-session edit |
| Floor / project structure | Same active floor, entity membership | Restore to wrong room = silent corruption |
| Modular options / catalog keys | Same when present | Cabinet-v0 options through envelope |

**Count-only E2E is a weak proxy.** It can pass if restore invents new ids for N furniture. Plan W5 and research acceptance test #1 both require **ids**.

### 2.4 What “return next day” is **not**

| Not required for P06 | Why |
|----------------------|-----|
| Multi-device on phone | Cloud score 1; multi-device later |
| Multiplayer cursors | Explicitly out of scope |
| Survive clearing site data | Buyer education: local dies with site data |
| Survive different browser profile | Different origin storage |
| Photoreal after reload | Mesh is P08 |
| Full draw tool journey | P07 owns journey; P06 may seed via import/place helpers |

### 2.5 Trust equation

```
Trust = DurableLocalWrite × HonestLabel × IdentityPreservedOnReload
```

Any factor zero → buyer does not trust save.  
Historical industry score: O&O offline **4**, cloud **1**, multi-device **1** — strength is **single-device durability**. Product messaging must match that strength, not fake the cloud row.

---

## 3. Architecture map (Approach A save path)

```
Open3d document (Open3dProject, entity UUIDs)
        │
        ▼
useOpen3dWorkspaceAutosave
  schedulePersist → buildOpen3dSessionEnvelope → JSON string
  flushPersist    → schedule + flush
  restoreSnapshot → loadProject → parseOpen3dSessionSnapshot
        │
        ▼
createAutoSaver(projectId)
  scheduleSave(snapshot)  // debounce 5000ms, retain pendingSnapshot
  flush()                 // immediate persist pending
  cancel()                // deactivate + drop pending
        │
        ▼
IndexedDB "planner-workspace-db"
  store "projects"  { id, name, createdAt, updatedAt, snapshot }
  store "history"   capped auto-save history entries
        │
        ▼
On mount: restore async → replaceProject(restored)
UI: TopBar pill + status-bar formatAutosaveStatus + toasts + help
```

**Cloud path (exists in tree, not open3d autosave):**

```
createMemberPlanRepository / plannerCloudApi / guestPromotion
  → REST plan CRUD (staging document types)
  → NOT called by useOpen3dWorkspaceAutosave today
```

Claiming cloud from open3d UI while this edge is unwired is a **product lie**.

### 3.1 Project identity keys

| Mode | IDB project id | Notes |
|------|----------------|-------|
| Guest | `planner-guest-local` | Constant |
| Member no planId | `planner-member-local` | Constant |
| Member with planId | `planner-member-local:{planId}` | Scoped |

Restore after reload **must** use the same id derivation (`getPlannerProjectId(guestMode, planId)`). Wrong id = empty plan = W5 false red (looks like save broken when key mismatch).

### 3.2 Session envelope

| Field | Value |
|-------|--------|
| `version` | `"open3d-1"` |
| `engine` | `"open3d"` |
| `project` | Full `Open3dProject` |
| `updatedAt` | ISO string |

Parse accepts envelope **or** legacy raw project JSON. Unit continuity covers JSON path; browser IDB must store the envelope string the hook writes.

---

## 4. Flush API — exhaustive design

### 4.1 Why flush exists

Debounce (5s) is a **batching optimization**, not a durability guarantee. Humans leave inside the window. Without flush:

- Unmount `cancel()` drops timer → **data loss**  
- Hard reload mid-debounce → **data loss**  
- Explicit Save that only reschedules → buyer clicks Save, waits 0s, reloads → **data loss**  
- Buyer trust dies faster than any other spine bug

### 4.2 Contract (normative for implementers)

| Method | Inputs | Behavior | Side effects |
|--------|--------|----------|--------------|
| `scheduleSave(snapshot)` | Latest JSON string | Store as `pendingSnapshot`; reset debounce timer | Does not await IDB |
| `flush(snapshot?)` | Optional override | Clear timer; if arg provided, set pending to arg; await in-flight write if any; if pending null → clean no-op; else `persistSnapshot(pending)` and await | `onSaved` / `onError`; clear pending only when matching written snapshot |
| `cancel()` | — | Deactivate; clear timer; drop pending **without write** | Tests / dispose **after** successful flush |
| `dispose()` (optional name) | — | Prefer: `await flush()` then `cancel()` | Documented order |

**Invariants:**

1. **Pending retention:** every `scheduleSave` updates module-held `pendingSnapshot` (not only timer closure).  
2. **Flush without arg** uses last pending.  
3. **Flush path never applies “skip because lastSaved < debounce”** as a no-write.  
4. **Concurrent flush:** second flush awaits `flushInFlight` then checks remaining pending (covers edit-during-write).  
5. **Active flag:** after `cancel()`, further schedule/flush no-op.  
6. **History:** successful persist still writes history entry (current behavior) — acceptable for P06; do not thrash history design.

### 4.3 Live implementation critique (as of re-check)

**Good:**

- `pendingSnapshot` field exists  
- `flush()` clears timer, awaits in-flight, writes pending  
- Idle flush is safe no-op  
- `flushInFlight` serialization started  

**Gaps / bugs to raise bar against:**

1. **Hook leave path** registers:

   ```
   pagehide → saver.flush()
   visibility hidden → saver.flush()
   unmount → flush().finally(cancel)
   ```

   These call **saver.flush()** without first pushing **latest project envelope** into pending. If React has not yet run the `project.updatedAt` effect that calls `schedulePersist`, **latest edits are not in `pendingSnapshot`**. Correct leave path is **`flushPersist()`** (rebuild from `projectRef.current` → schedule → flush), not bare saver flush.

2. **`flushPersist` still closes over render `project`**, not `projectRef`. Rapid edits + immediate Save can flush **stale** envelope if callback identity lags (classic React stale closure). Plan requires `projectRef.current` always latest.

3. **`schedulePersist` builds envelope from render `project`** same issue for debounce path.

4. **`cancel()` sets `active = false` and nulls pending** — correct for dispose, lethal if unmount races: flush starts async, cancel runs in finally of same flush — order is flush-then-cancel in cleanup which is correct **if** flush had latest pending.

5. **Double-gate residual:** empty `if (now - lastSaved < DEBOUNCE && !flushInFlight)` block is dead; remove or make intentional “coalesce” with tests. Leaving dead gates confuses the next agent into reintroducing a return skip.

### 4.4 Hook surface (target)

| Export | Meaning |
|--------|---------|
| `status` | `idle \| unsaved \| saving \| saved \| error` |
| `lastSavedAt` | ISO of last successful local write |
| `isModified` | unsaved or saving |
| `isLocalSaved` (preferred) / deprecated `isSynced` | **local** write complete — never “server” |
| `schedulePersist()` | Debounced; from `projectRef` |
| `flushPersist(): Promise<void>` | Immediate; from `projectRef` |
| `restoreSnapshot()` | Load + parse |
| `storage: "local" \| "cloud"` | For labels; default `"local"` |
| `cloudEnabled: boolean` | Explicit `false` until Task 07 |

### 4.5 When to flush (product events)

| Event | Required | Notes |
|-------|----------|-------|
| Explicit Save / Save draft button | Yes | Immediate; toast local-honest |
| `pagehide` | Yes | Mobile Safari / tab close |
| `visibilitychange` → hidden | Yes | Laptop sleep, app switch |
| Workspace unmount (route leave) | Yes | SPA navigation |
| `beforeunload` | Optional secondary | Unreliable for async; do not rely alone; may show browser leave dialog if dirty — product choice |
| Autosave timer fire | Yes (debounce path) | Not a leave path |
| Successful restore | No flush of default room over restored | See hydration race |
| Cloud wire success | After local flush (local-first) | Task 07 only |

### 4.6 Failure semantics

| Failure | UI | Data |
|---------|-----|------|
| IDB quota / put error | “Local save failed” / error status | Keep in-memory project; allow retry Save |
| Parse error on restore | Stay on default or empty; do not crash shell | Log; do not claim Saved |
| Flush while disabled / not hydrated | No-op | Avoid writing default pre-restore |
| Cloud fail (future) | Local success retained + “Account save failed” | Never roll back local |

---

## 5. Debounce — exhaustive design

### 5.1 Constants

| Name | Live value | Role |
|------|------------|------|
| `AUTO_SAVE_DEBOUNCE_MS` | **5000** | Coalesce rapid document updates |

### 5.2 Why 5s is acceptable **with** flush

| Concern | Mitigation |
|---------|------------|
| User leaves at t=1s after edit | Flush on leave / Save |
| User hard reloads at t=2s | Flush on pagehide **and** prefer Save before reload in E2E |
| User keeps editing for 30s | Single write after quiet 5s |
| Write storms / IDB thrash | Debounce protects |

Without flush, 5s is a **product defect**. With flush, 5s is a reasonable default.

### 5.3 Raised-bar debounce options (do not thrash in P06 unless residual)

| Option | Pros | Cons | P06 call |
|--------|------|------|----------|
| Keep 5s + flush | Matches live; simple | Still needs perfect leave | **Default** |
| 1–2s debounce | Less leave risk | More IDB writes | Optional later |
| Immediate write on structural ops (place/delete wall) + debounce move | Stronger | More API surface | Out of P06 scope |
| Figma-class ~600ms server | World cloud bar | Needs cloud | Not local-only |

### 5.4 Debounce correctness rules

1. **Latest wins:** two scheduleSave calls within window → only last snapshot persists.  
2. **Timer reset:** each schedule clears previous timer.  
3. **No silent drop after timer:** when timer fires, write pending (or reschedule intentionally with tests — never empty return that forgets pending forever).  
4. **Flush preempts timer:** clear timer, write now.  
5. **Cancel after schedule:** no write (test).  
6. **Fake timers in unit tests** prove flush < 5s and schedule at 5s.

### 5.5 Double-gate history lesson

Original bug:

```
timer fires → if (now - lastSaved < DEBOUNCE) return; // drops write
```

This made “scheduled” saves **no-ops** under rapid successions. Live code emptied the body of that if but left the condition — **delete the dead gate** in residual work so the next “optimization” does not resurrect it.

---

## 6. Leave path — exhaustive design

### 6.1 Failure taxonomy

| Leave mode | Without fix | With correct flush |
|------------|-------------|--------------------|
| Click another app route (SPA unmount) | cancel drops debounce | unmount `await flushPersist` then cancel |
| Close tab | pagehide missed / cancel only | pagehide → flushPersist |
| Browser refresh | race | pagehide + user Save in tests |
| Laptop lid | visibility hidden | visibility → flushPersist |
| Crash / kill -9 | Cannot flush | Accept residual risk; shorter debounce optional |
| `clearPlannerStorage` init script on every reload | **Deletes IDB on reload** — false red W5 | Use **one-shot** `clearPlannerStorageInPage` only |

### 6.2 Correct leave algorithm (normative)

```
onLeaveEvent:
  1. if !enabled || !restoreSettled: return (or only flush if dirty after settle)
  2. project = projectRef.current
  3. envelope = buildOpen3dSessionEnvelope(project)
  4. snapshot = JSON.stringify(envelope)
  5. setStatus("saving")  // if UI still mounted
  6. saver.scheduleSave(snapshot)  // updates pending
  7. await saver.flush()
  8. // unmount only: saver.cancel() after flush settles
```

**Never:** `cancel()` before flush when dirty.  
**Never:** flush saver without updating pending from latest project.

### 6.3 Live leave wiring critique

Hook **does** attach pagehide + visibility + unmount flush-before-cancel. That is real progress vs expert pass.

Residual: leave handlers call **`saver.flush()` only**, not full `flushPersist` with latest envelope. That is the primary residual leave bug.

Workspace `handleSave` correctly calls `flushPersist()` and uses local-honest toasts (“Saving draft locally…” / “Saving plan locally…”). Keep that; extend same strings to any other message surfaces.

### 6.4 Playwright leave vs hard reload

| Scenario | What it proves |
|----------|----------------|
| Save click → reload | Explicit flush path |
| Edit → wait 6s → reload | Debounce path (slow, flaky) |
| Edit → pagehide simulation → reload | Leave path (harder in Playwright) |
| Edit → immediate reload without Save | pagehide flush correctness |

P06 **minimum** for CP-06.3: Save flush + hard reload + **ids**.  
**Raised bar:** separate test for leave-without-button using visibility/pagehide if stable.

### 6.5 Anti-pattern: init-script storage wipe

Documented in `guestProjectSetup.ts`:

- `clearPlannerStorage` = **init script** → runs on **every** navigation/reload → **destroys W5**.  
- `clearPlannerStorageInPage` = **one-shot evaluate** → correct for hard-reload survival.  
- Spec correctly uses one-shot + `preservePlannerState: true`. Keep this contract sacred.

---

## 7. Dual UI labels & the bare “Saved” lie

### 7.1 Why bare “Saved” is a lie in this product

In consumer mental models:

| UI string | Buyer inference |
|-----------|-----------------|
| “Saved” | “It’s safe / in my account / I can switch devices” |
| “Synced” | “Server has it” |
| “Saved locally” | “This browser; clearing data kills it” |
| “Saved to account” | “Cloud; multi-device expected” |

O&O open3d path today: **IDB only**. Bare “Saved” / “Synced” / “server” is **fraud by implication**.

### 7.2 Dual surfaces (both buyer-visible)

| Surface | Live file | Live copy (re-check) | Residual risk |
|---------|-----------|----------------------|---------------|
| **TopBar pill** | `TopBar.tsx` | Modified / **Saved locally** / Ready | No `data-storage`; idle “Ready” lacks “local”; driven by `isSynced` boolean not shared pure helper |
| **Status bar** | `formatAutosaveStatus` in workspace | Saving locally… / Saved locally / Draft saved locally / Ready (local) | More complete table; can drift from TopBar |
| **Save toasts** | `OOPlannerWorkspace` handleSave | Saving draft/plan **locally** | OK if kept |
| **Help / FAQ** | `helpSections.ts` | “members keep named save slots in their account” | **Active lie** |
| **Shell JSDoc** | `WorkspaceShell` | Now local-honest | OK |
| **Archive fabric indicator** | `PlannerSaveIndicator` | Dual local/cloud envelope pattern | Pattern only — not mounted on open3d |

### 7.3 Single pure label source (raised contract)

Plan’s `open3dSaveStatusLabel` shape is correct. Evolve either:

- **A:** Expand `formatAutosaveStatus` to accept `{ status, storage, lastSavedAt, cloudEnabled, guestMode }` and force TopBar to call it, **or**  
- **B:** New `open3dSaveStatusLabel` + both call sites import it.

**Forbidden:** two independent switch tables (TopBar Modified/Saved/Ready vs status-bar function) that can drift again.

### 7.4 Label matrix (local-only default — full)

| status | guest | storage | cloudEnabled | Human label |
|--------|-------|---------|--------------|-------------|
| idle | true | local | false | Guest session (local) |
| idle | false | local | false | Ready (local) |
| unsaved | true | local | false | Unsaved draft |
| unsaved | false | local | false | Unsaved changes |
| saving | * | local | false | Saving locally… |
| saved | true | local | false | Draft saved locally |
| saved | false | local | false | Saved locally |
| error | * | local | false | Local save failed (prefer over generic “Save failed”) |

**Forbidden outputs when `cloudEnabled === false`:**

- bare `Saved`  
- `Synced`  
- `Saved to account`  
- `Synced to server`  
- Help claiming account slots  

### 7.5 Label matrix (future cloud — Task 07 only)

| Local state | Cloud state | Composite label |
|-------------|-------------|-----------------|
| saved | off | Saved locally |
| saved | syncing | Saved locally · Saving to account… |
| saved | synced | Saved to account (or “Saved locally · Synced to account”) |
| saved | failed | Saved locally · Account save failed |
| error local | * | Local save failed (cloud not attempted or paused) |

**Rule:** never hide local success behind cloud failure. Fabric `PlannerSaveIndicator` already sketches dual envelope states — **reuse ideas**, not port fabric chrome wholesale.

### 7.6 Selectors for E2E / a11y (required residual)

Primary pill (TopBar):

| Attribute | Values |
|-----------|--------|
| `data-testid` | `open3d-save-status` |
| `data-storage` | `local` \| `cloud` |
| `data-status` | `idle` \| `unsaved` \| `saving` \| `saved` \| `error` |
| `role` | `status` |
| `aria-live` | `polite` |

Waiting on body text “Saved locally” works as a weak poll; **stable testids** are required for P07 journey chaining and non-English future.

### 7.7 Prop naming honesty

| Bad (implies server) | Good |
|----------------------|------|
| `isSynced` as “synced to server” | `isLocalSaved` or pass `saveStatusLabel` string |
| `data-synced` alone | `data-storage` + `data-status` |

Deprecation path: keep `isSynced` as alias of local saved **only if** compile needs it; UI copy must never say Synced for IDB.

---

## 8. Hard reload identity (W5)

### 8.1 Definition of green

```
seed wall id W + furniture id F
→ flush local
→ page.reload hard
→ wait restore-complete
→ document contains wall id W and furniture id F
```

Artifacts under:

`results/planner/world-standard-wave/06-save-honesty/save-reload/`

Minimum files:

| Artifact | Purpose |
|----------|---------|
| `06-playwright-raw.log` | Raw runner output (unfiltered) |
| `06-browser-run.json` | exitCode, ids, route, browser, cloudEnabled |
| `01-before-save.png` | Visual |
| `02-saved-local.png` | Visual status |
| `03-after-hard-reload.png` | Visual restore |
| `NOTES.md` | HEAD, commands, id channel |

### 8.2 Live E2E critique (`open3d-save-honesty.spec.ts`)

| Aspect | Live | Verdict |
|--------|------|---------|
| Route | guest + `plannerDevTools=1` | Correct |
| Storage clear | one-shot in-page | Correct for reload |
| Place path | `placeSeatsFromConfigurator` ×4 | OK for smoke; **ids not captured** |
| Save | button Save draft | Correct flush path |
| Wait | body text Saved locally | Weak but works |
| Assert | **furniture count** equality | **Insufficient for W5 identity** |
| Wall ids | Not asserted | **Gap** |
| Furniture ids | Not asserted | **Gap** |
| Export/import channel | Not used | Plan preferred import JSON for stable ids |
| Evidence dir | written by screenshots if runner run | **results tree missing in this checkout** |

### 8.3 Preferred seeding for id stability

| Method | Pros | Cons | P06 preference |
|--------|------|------|----------------|
| Import JSON with known ids | Deterministic | Needs import UI/hook | **Preferred** |
| Devtools bootstrap / test hook | Stable | Harness work | Good |
| Place configurator seats | Real UX | Opaque generated ids; only count easy | OK for secondary smoke |
| Draw walls with mouse | Real UX | Flaky; P07 journey | Avoid as sole W5 |

**Id channel options** (document chosen one in NOTES):

1. Export JSON after seed → parse ids → reload → export again → compare.  
2. `window` test hook exposing project snapshot (devTools only).  
3. DOM data attributes on entities (if present).  

Without an id channel, W5 is theater.

### 8.4 Restore-complete wait

Live: first paint uses **default project**; restore async `replaceProject`. E2E that seeds immediately can:

- Write default room over intended seed  
- Flush empty/default over good IDB  
- Assert counts from seed then “restore” wrong state  

**Rules:**

1. Wait workspace ready (topbar + canvas).  
2. Wait restore settled — either status idle after load, or explicit `data-restore="complete"`, or poll until project signature stable (no further replace).  
3. Then seed.  
4. Then flush.  
5. Reload.  
6. Wait restore again.  
7. Assert ids.

Optional product improvement: gate `schedulePersist` until restore attempt finishes so autosave never races default room into IDB. E2E must still wait regardless.

---

## 9. Local vs cloud — policy lock

### 9.1 Storage tiers (machine + human)

| Machine | Human | Truth condition |
|---------|-------|-----------------|
| `storage: "local"` | Saved / Saving / Failed **locally** | IDB `saveProject` path acked |
| `storage: "cloud"` | Saved / Saving / Failed **to account** | Authenticated API acked for plan id + revision |
| Dirty | Unsaved changes | Document newer than last local ack |
| Idle | Ready (local) | No edits since load |

### 9.2 Cloud decision matrix (locked)

| Option | When | W6 requirement |
|--------|------|----------------|
| **Local-only honesty (default)** | Cloud not product-ready | All UI local; help local; Task 07 cancelled with NOTES reason |
| **Cloud wire slice** | Owner unlocks same phase | Local-first flush then cloud; dual status; failure modes unit-tested; no secrets in evidence |

### 9.3 What exists but is not the open3d autosave path

| Module | Role |
|--------|------|
| `memberPlanRepository.ts` | Fetch REST plan CRUD; discriminated results |
| `plannerCloudApi.ts` | Cloud API surface |
| `guestPromotion.ts` | Guest → member promotion semantics |
| `PlannerSaveIndicator` + fabric session handlers | Historical dual local/cloud labels |

Open3d `useOpen3dWorkspaceAutosave` imports **only** IDB helpers from `persistence`. That is the live product truth.

### 9.4 Guest claim migration

`migrateGuestProjectToMember` copies guest snapshot to member slot when member empty and not already claimed. Honesty:

- Guest work is still **local IDB**, not cloud.  
- “Claim” is **local key migration**, not account backup.  
- Help must not describe claim as multi-device cloud.

### 9.5 Multi-device / multiplayer (explicit out of P06)

Research scores:

| Product | Autosave | Cloud | Multi-device | Multiplayer | Offline |
|---------|----------|-------|-------------|-------------|---------|
| Planner5D | 4 | 5 | 5 | 4 | 2 |
| RoomSketcher | 3 | 5 | 5 | 2 | 2 |
| Floorplanner | 3 | 5 | 4 | 2 | 1 |
| Homestyler | 3 | 4 | 4 | 2 | 1 |
| Figma (ref) | 5 | 5 | 5 | 5 | 4 |
| IKEA | 1 | 3 | 2 | 1 | 1 |
| **O&O live** | **3** | **1** | **1** | **1** | **4** |

**World category bar** = cloud autosave + multi-device (P5D/RoomSketcher), **not** Figma multiplayer.  
**P06 bar** = offline strength + honesty + local identity reload. Cloud is next program, not a fake label.

---

## 10. Hydration race — exhaustive

### 10.1 Live mechanism

```
hydrated = useState(true) immediately
autosave enabled with hydrated true
first paint = default / bootstrap project
useEffect: restoreSnapshot → maybe replaceProject(restored)
```

Comment in workspace admits: *Immediate hydrated avoids blocking render/restore waterfall*.

### 10.2 Race classes

| Race | Symptom | Mitigation |
|------|---------|------------|
| Seed/edit before restore | User edits default room; restore clobbers edits | Wait restore-complete before seed |
| Autosave before restore | Default room written to IDB; corrupts good snapshot | Gate schedule until restore settled **or** never schedule on first mount generation |
| Flush before restore | Same as above with higher force | `flushPersist` no-op until restore settled |
| Double replace | Bootstrap layout + restore fight | Single owner for initial project |
| E2E clear IDB then race | Empty restore then seed OK if order correct | one-shot clear **before** enter; wait ready; seed |

### 10.3 Recommended restore state machine (raised bar)

```
restore: "pending" | "empty" | "loaded" | "failed"
```

- pending: do not schedule autosave; UI may show “Loading plan…” (honest)  
- empty: allow seed; idle  
- loaded: replaceProject once; then enable schedule  
- failed: error status; do not preted Saved  

Even if product keeps `hydrated=true` for paint, **autosave enable** should track restore settlement.

### 10.4 E2E recipe (copy into implementer NOTES)

1. `goto` guest with devtools  
2. `clearPlannerStorageInPage`  
3. `enterGuestPlannerWorkspace({ preservePlannerState: true })`  
4. wait topbar + canvas  
5. **wait restore settled** (poll: no further furniture/wall thrash; or test hook)  
6. import/seed known wall+furniture ids  
7. click Save; wait `data-status=saved` + `data-storage=local`  
8. capture ids  
9. `page.reload`  
10. wait restore settled  
11. assert same ids  
12. screenshots + run.json  

---

## 11. Guest IDB — exhaustive

### 11.1 Database

| Item | Value |
|------|-------|
| DB name | `planner-workspace-db` |
| Legacy | `buddy-planner-db` (one-time migrate flag in localStorage) |
| Stores | `projects`, `history` |
| History cap | `MAX_HISTORY = 10` |
| Guest project id | `planner-guest-local` |

### 11.2 Guest durability properties

| Property | Reality |
|----------|---------|
| Works offline | Yes — strength |
| Survives hard reload same origin/profile | Yes if flushed |
| Survives tab close | Yes if leave flush works |
| Survives “Clear site data” | **No** — must teach in help |
| Survives private mode eviction | Browser-dependent; treat as fragile |
| Multi-device | **No** |
| Account backup | **No** |

### 11.3 Guest UX honesty copy

| Surface | Copy |
|---------|------|
| Status saved | Draft saved locally |
| Status unsaved | Unsaved draft |
| Idle | Guest session (local) |
| Help | Plans autosave in **this browser**. Clearing site data removes them. Sign-in does not currently mean cloud backup for open3d. |
| Save button | Save draft |

### 11.4 Test hygiene for guest IDB

| Helper | Use when |
|--------|----------|
| `clearPlannerStorage` (init) | Fresh start tests that **do not** reload-preserve |
| `clearPlannerStorageInPage` | W5 hard reload (clear once) |
| Never mix init wipe + reload assert | Guaranteed false red |

### 11.5 Member local is still guest-like physically

Member without cloud is **another IDB key**, not a safer medium. Labels for members must still say **locally** until cloudEnabled true. The psychological trap is stronger for members (“I’m logged in so I’m safe”). W6 exists for them.

---

## 12. Competitive save patterns (ideas only)

Ethics: **patterns / JTBD only**. No clone of UI chrome, assets, or code from `D:\websites` into product.

### 12.1 Planner5D

| Pattern | Detail | O&O takeaway |
|---------|--------|--------------|
| Cloud as system of record | Logged-in projects autosave; multi-device | Future cloud bar — not P06 fake |
| Online requirement honesty | Internet for durable save | If cloud unwired, do not claim |
| Wait before close | Docs tell users to wait a few seconds | Flush removes need for superstitious wait; still keep status truth |
| Guests weaker restore | Guests cannot restore like accounts | Our guest IDB is stronger offline; **do not** over-claim account |
| Multiplayer optional layer | On top of cloud project | Out of scope |

### 12.2 Floorplanner

| Pattern | Detail | O&O takeaway |
|---------|--------|--------------|
| Explicit Save control | Chrome Save + Cmd/Ctrl+S | Keep explicit Save as flush |
| Version history after saves | Restore prior version | We have IDB history store — product UI later |
| Cloud projects always | Account project list is identity of work | World bar later |
| Collaborate = time-boxed grant | Sequential edit, not CRDT | Later sharing model |
| Manual save culture | Less “invisible always-on” messaging | Prefer autosave + explicit Save now |

### 12.3 RoomSketcher

| Pattern | Detail | O&O takeaway |
|---------|--------|--------------|
| Cloud project archive | App + web portal | Multi-device identity |
| Strong export | Save means nothing if export fails | Pair W5 with export smoke later |
| Team ≠ multiplayer | Seats/share | Cheaper collab MVP later |

### 12.4 Homestyler

| Pattern | Detail | O&O takeaway |
|---------|--------|--------------|
| Account-centric cloud | Cross-platform claim | Do not claim until true |
| Team lock/serialize editors | Same project not simultaneous | Industry default collab |

### 12.5 Figma (reference only — not competitor)

| Pattern | Detail | O&O takeaway |
|---------|--------|--------------|
| Continuous durability ~600ms | Engineering bar | Aspirational cloud latency |
| Offline reapply | Disconnect local; reconnect merge | Model for future offline queue |
| Status honesty | Saved means server-durable | Never fake |

### 12.6 IKEA planners

| Pattern | Detail | O&O takeaway |
|---------|--------|--------------|
| **Not** automatically saved | Official help | **Anti-pattern** — do not copy |
| Account “My designs” when saved | Manual | We already autosave locally — keep |
| Cart/list export focus | Retail | Our BOQ wedge is separate phase |

### 12.7 Pattern steal list (P06-relevant)

1. **Honest dual status chips** (Local vs Cloud) — research 05-realtime non-negotiable table.  
2. **Flush on hide/leave** — durability without Figma infra.  
3. **Explicit Save now** secondary to autosave — Floorplanner/IKEA hybrid done right.  
4. **Never green Saved on React state alone** — only IDB ack.  
5. **Export reliability as trust twin** — later, but do not claim save if export path lies.  
6. **Local-first offline** — O&O’s real differentiator today; brand it honestly.

### 12.8 Pattern reject list

1. Fake multiplayer avatars.  
2. Bare Saved while IDB-only.  
3. Manual-only primary save (IKEA).  
4. Cloud marketing copy without wire.  
5. Competitor toolbar/save icon cloning.

---

## 13. Plan critique (P06 execute card)

### 13.1 What the plan gets right

| Item | Why strong |
|------|------------|
| W5 = hard reload **ids**, not unit JSON | Correct gate |
| W6 = dual surfaces + help + toasts | Matches buyer eyes |
| Default local-only cloud decision | Prevents half-wire lies |
| Flush + pending snapshot + projectRef | Real durability design |
| Guest route + one-shot IDB clear | Prevents false red |
| Evidence under `save-reload/` | RESULTS-MAP aligned |
| CP-06 hard stop | Stops vibe green |
| Out of scope multiparty / Fabric cutover | Scope discipline |
| TDD tasks 01–04 | Fits Elon standard |
| Expert revision dual-surface + Shell lock | Fixed early plan blind spot |

### 13.2 Plan weaknesses / updates needed against live tree

| Issue | Critique | Raised fix |
|-------|----------|------------|
| Plan freezes expert pass as “no flush” | Code already has flush | Rebaseline ground truth table before Task 00 |
| Scoreboard PASS vs missing results/ | Risk of paper green | Re-run evidence in this checkout |
| E2E in repo asserts counts | Below plan’s own id bar | Upgrade assert to ids |
| Label helper cloud matrix | Live helper lacks storage/cloudEnabled | Finish pure helper contract |
| Help task may be marked done early | helpSections still lies | Task 05 not actually green |
| Double-gate description | Live gate gutted but still present | Task 01 residual cleanup |
| projectRef | Still incomplete in hook | Must fix for leave correctness |
| `dispose` API naming | Optional confusion | Document flush-then-cancel only |
| Parallel with P07 | Journey depends on save pill | Hold P07 save asserts until CP-06.3 |

### 13.3 Suggestions file (S1–S10) — still valid?

| S# | Status after live re-check |
|----|----------------------------|
| S1 dual surfaces | Partially fixed copy; not single source yet |
| S2 Shell JSDoc | Largely fixed |
| S3 save-reload folder | Spec points there; artifacts missing here |
| S4 pending + projectRef | pending yes; projectRef **no** |
| S5 restore race | Still real; E2E only partially waits |
| S6 guest path | Adopted in e2e |
| S7 autosave write mocks | Still weak |
| S8 toast honesty | Largely fixed |
| S9 PlannerSaveIndicator pattern only | Correct |
| S10 cloud default off | Correct |

### 13.4 Expert pass alignment

EXPERT-PASS P0 #6 remains the spine requirement. False-reverse risks still fatal:

- Leave path cancel without flush  
- Bare Saved as cloud  
- Unit-only W5  

Do not reverse Approach A stack for save work.

### 13.5 Kill order placement

```
CP-00 → CP-01 → CP-02 → CP-03 W3 → CP-07 journey → CP-06 save
then parallel orbit · symbols · mesh · shortcuts
```

P06 is **after** journey in kill order but **save honesty is table stakes** for buyer “return next day.” If journey is green and save is paper-green, product still fails Friday→Monday. Head must not let mesh/chrome steal slots from residual CP-06 evidence.

---

## 14. Raised bar (above minimum plan)

Minimum plan = CP-06 checkboxes. Raised bar = what a brutal partner demands before “buyer ready.”

### 14.1 Durability bar

| Level | Criterion |
|-------|-----------|
| L0 | Unit envelope JSON round-trip |
| L1 | IDB write unit with mocked put |
| L2 | Explicit Save → hard reload → **counts** |
| L3 | Explicit Save → hard reload → **wall + furniture ids** |
| L4 | Leave without Save (pagehide) → reload → ids |
| L5 | Airplane mode edit → local saved → still restore |
| L6 | Local + cloud dual with failure split |

**P06 ship bar = L3 + honest L5-local labels.** L4 raised. L6 only with owner cloud unlock.

### 14.2 Honesty bar

| Level | Criterion |
|-------|-----------|
| H0 | Some “Saved” somewhere |
| H1 | TopBar says locally |
| H2 | TopBar + status bar + toasts local |
| H3 | H2 + help/FAQ + no account lie |
| H4 | H3 + single pure helper + testids + a11y live region |
| H5 | Dual local/cloud chips when cloud live |

**P06 ship bar = H4 with cloudEnabled false.**

### 14.3 Evidence bar

| Level | Criterion |
|-------|-----------|
| E0 | “Works on my machine” |
| E1 | Vitest logs only |
| E2 | Playwright log without PNGs |
| E3 | Playwright + PNGs + run.json under `save-reload/` |
| E4 | E3 + copy grep artifact + NOTES HEAD |
| E5 | E4 + CI-able pack path documented |

**CP-06 = E4 minimum.**

### 14.4 What would make O&O class-leading **later** (not P06 scope creep)

1. Cloud autosave after auth with multi-device open.  
2. Conflict UI when local newer than server.  
3. Version history UI on top of existing history store.  
4. Offline queue of cloud ops.  
5. Share link view-only before multiplayer.  

Do **not** implement these inside residual P06 unless owner changes goal.

---

## 15. Approaches (brainstorm) — 2–3 with recommendation

### Approach A — **Residual close on local honesty + id W5** (RECOMMENDED)

**Intent:** Accept that flush skeleton landed; finish correctness and proof.

| Work | Detail |
|------|--------|
| 1 | `projectRef` + leave uses `flushPersist` |
| 2 | Remove dead double-gate; mock `saveProject` unit tests |
| 3 | Single pure label helper; TopBar consumes it; testids |
| 4 | Fix help/FAQ account lie |
| 5 | Upgrade E2E to wall+furniture **ids** |
| 6 | Re-generate full evidence pack under root `results/` |

| Pros | Cons |
|------|------|
| Matches default plan cloud decision | Does not buy multi-device |
| Smallest path to real CP-06 | Requires honest re-open of “PASS” claims |
| Protects Friday→Monday buyer | |

**Recommendation:** **Do this.** Default for Approach A product journey.

### Approach B — **Cloud wire + dual status in same phase**

**Intent:** Task 07 unlock; member Save becomes account-durable.

| Work | All of A, plus |
|------|----------------|
| Wire repository after local flush | |
| Dual labels + failure split | |
| Second browser/profile proof | |

| Pros | Cons |
|------|------|
| Hits category cloud bar | Scope explosion; auth secrets; conflict policy |
| Matches P5D/Floorplanner marketing expectations | Can slip honesty if rushed |

**Pick only if owner explicitly unlocks cloud this phase.** Otherwise **cancel with NOTES**.

### Approach C — **Status-copy-only cosmetic**

**Intent:** Change strings to “locally” without flush/id proof.

| Pros | Cons |
|------|------|
| Fast | **Paper honesty**; still lose data on leave |
| | Violates W5; expert false-reverse |

**Reject.** Labels without durability are PR, not product.

### Approach D — **Debounce to 0 / write every mutation** (not recommended as sole strategy)

| Pros | Cons |
|------|------|
| Less leave risk | IDB thrash; still needs leave listeners for mid-write |
| | Does not replace flush semantics |

May combine later with A as optimization, not instead of flush.

---

## 16. Recommended design (Approach A residual) — sections

### 16.1 AutoSaver

Keep debounce 5000ms. Ensure:

- `pendingSnapshot` always last scheduled  
- `flush` immediate, no skip gate  
- `cancel` only after flush on unmount  
- unit tests mock/spy `saveProject` for write counts  

### 16.2 Hook

- `projectRef` updated every render  
- `schedulePersist` / `flushPersist` read ref  
- leave listeners call `flushPersist`  
- `restoreSettled` gate for schedule  
- export `storage: "local"`, `cloudEnabled: false`  
- deprecate UI meaning of `isSynced`  

### 16.3 UI

- One pure helper  
- TopBar + status bar + toasts  
- testids on primary pill  
- Shell props honest  

### 16.4 Help

Replace:

> “members keep named save slots in their account”

With truthful local default:

> “Plans autosave in **this browser** (local storage). Clearing site data removes them. Account cloud save for open3d is not enabled yet.”

Grep open3d editor + help for cloud/sync/account over-claims; store clean result in evidence `05-copy-grep.txt`.

### 16.5 W5 E2E

- Guest route + one-shot clear  
- restore wait  
- known ids  
- Save flush  
- hard reload  
- same ids  
- artifacts in `save-reload/`  

### 16.6 Cloud

Cancelled by default with NOTES: `owner chose local-only honesty` (or equivalent).

---

## 17. Test matrix (exhaustive)

### 17.1 Unit — AutoSaver

| # | Case | Pass |
|---|------|------|
| U1 | `flush` writes immediately under fake timers (no 5s wait) | `saveProject` called before 5000ms |
| U2 | `scheduleSave` A then B → flush persists **B** | last pending wins |
| U3 | `scheduleSave` then `cancel` → no write | spy call count 0 |
| U4 | Timer fires after 5s → write pending | call count 1 |
| U5 | Rapid schedule after successful save still writes new pending | no permanent drop |
| U6 | Idle `flush` no-op | no throw, no write |
| U7 | Flush during in-flight awaits then writes newer pending if any | serialization correct |
| U8 | After `cancel`, schedule/flush no-op | active false |

### 17.2 Unit — labels

| # | Case | Pass |
|---|------|------|
| L1 | All status × guest × local | Exact strings per matrix §7.4 |
| L2 | `cloudEnabled false` never returns account/synced bare Saved | Table assert |
| L3 | Cloud branches only when enabled | Separate table |
| L4 | Forbidden string list grep in pure outputs | Zero hits |

### 17.3 Unit — envelope continuity

| # | Case | Pass |
|---|------|------|
| E1 | Existing `saveReloadContinuity` wall+furniture+modular options | Still green |
| E2 | `open3dSession` parse envelope + legacy | Still green |

### 17.4 Unit / component — hook & surfaces

| # | Case | Pass |
|---|------|------|
| H1 | project change → schedule with latest snapshot | mock saver |
| H2 | flushPersist → saver.flush with latest | projectRef |
| H3 | status transitions saving→saved | onSaved |
| H4 | TopBar render local wording both guest/member | no bare Saved |
| H5 | Status bar same helper output | no drift |
| H6 | testids present | data-status/storage |

### 17.5 E2E — W5

| # | Case | Pass |
|---|------|------|
| B1 | Clean guest IDB | empty start |
| B2 | Restore wait then seed known wall+furniture ids | ids recorded |
| B3 | Save → saved local status | testid or honest text |
| B4 | Hard reload | networkidle/domcontentloaded stable |
| B5 | Restore → **same ids** | not mere counts |
| B6 | Screenshots 01–03 | files exist |
| B7 | run.json schemaVersion 1 | exitCode 0 fields filled |

### 17.6 E2E — W6 / copy (lightweight)

| # | Case | Pass |
|---|------|------|
| C1 | After save, UI shows locally wording | visible |
| C2 | Help/FAQ unit or content test for account lie removed | assert strings |
| C3 | Repo grep artifact clean | evidence file |

### 17.7 Raised optional

| # | Case | Pass |
|---|------|------|
| R1 | Edit without button; trigger visibility hidden; reload; ids | leave path |
| R2 | Member local path same as guest for labels | cloudEnabled false |
| R3 | Quota error path shows Local save failed | mock |

### 17.8 Non-regression commands (implementer)

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/planner-autosave.test.ts tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts tests/unit/features/planner/open3d/saveReloadContinuity.test.ts tests/unit/features/planner/open3d/open3dSession.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\unit-pack.log

npx playwright test tests/e2e/open3d-save-honesty.spec.ts --reporter=line 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\save-reload\06-playwright-raw.log
```

**Rules:** zero suppression; no filtered “PASS only” logs; artifacts only under root `results/` (never `site/results/`).

---

## 18. Task-ordered residual checklist (for execute agents)

Map to plan Tasks 00–08 with residual focus:

| Task | Residual priority now |
|------|------------------------|
| 00 Setup evidence dirs | **Do** — recreate `06-save-honesty/` + `save-reload/` in this checkout |
| 01 AutoSaver tests + dead gate cleanup | **Do** — write mocks still missing |
| 02 Pure helper storage/cloudEnabled | **Do** — finish single source |
| 03 projectRef + leave flushPersist | **Do** — correctness residual |
| 04 TopBar testids + shared helper wire | **Do** |
| 05 Help/FAQ + grep | **Do** — still red |
| 06 W5 id-level hard reload | **Do** — upgrade from count |
| 07 Cloud | **Cancel** unless owner unlocks |
| 08 Evidence pack + CP-06 | **Do** — re-prove; do not inherit missing results |

Commit slices as plan names; push only per owner/git rules.

---

## 19. Risk register (expanded)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Leave flush without latest project | High | projectRef + flushPersist |
| Count-only W5 false green | High | Assert entity ids |
| Help still claims account slots | High | Task 05 |
| Init-script IDB wipe on reload | High | one-shot clear only |
| Restore race default room | High | restore gate + E2E wait |
| Dual label tables drift | Medium | one pure helper |
| Paper PASS without results/ | High | re-evidence this checkout |
| Cloud half-wire | High | default cancel Task 07 |
| cancel races flush | Medium | flush.finally(cancel) order tests |
| Playwright flaky place | Medium | import JSON seed |
| Debounce 5s buyer anxiety | Low | honest “Saving locally…” + Save button |
| Private browsing eviction | Medium | help education |
| Guest→member migration overwrite | Medium | shouldMigrateGuestPlan guards already |
| History growth | Low | MAX_HISTORY 10 |
| Secrets in cloud tests | High | mocks only if Task 07 |

---

## 20. CP-06 re-statement (hard stop)

Do **not** claim W5–W6 until:

| ID | Gate | Evidence |
|----|------|----------|
| CP-06.1 | Flush + pending retention; no silent debounce skip | vitest log under `06-save-honesty/` |
| CP-06.2 | Leave path flushes latest via projectRef; Save flushes | unit/hook + code review notes |
| CP-06.3 | Hard reload same **wall id + furniture id** | `save-reload/` PNGs + run.json + log |
| CP-06.4 | TopBar + status + help + toasts no cloud lie; no bare Saved | grep artifact + label units |
| CP-06.5 | `data-testid=open3d-save-status` + data-storage + data-status | DOM / component test |
| CP-06.6 | No new `any`; typecheck touched packages | typecheck log if required by gate |
| CP-06.7 | Landable commits on main checkout | git log |
| CP-06.8 | Task 07 cancelled local-only **or** cloud dual tests green | NOTES |
| CP-06.9 | Shared pure helper both surfaces; Shell not server-sync | code + tests |

**Unlock next:** P07 may rely on flush + status pill; do not start P07 **save assertions** until CP-06.3 green with **ids**.

---

## 21. Definition of done (phase)

| Gate | Definition |
|------|------------|
| **W5** | Seed → flush → hard reload → **same wall + furniture ids**; proof in `save-reload/` |
| **W6** | All open3d status surfaces + help + toasts state **local browser** truthfully; default local-only; **no bare Saved** |
| **Evidence** | Parent `06-save-honesty/` + W5 subfolder; unfiltered logs |
| **Honesty** | No facilities buyer misreads IDB as cloud backup |
| **Buyer Monday test** | Same browser profile returns same plan entities |

---

## 22. Handover lines (next agent)

```
P06 residual — do not trust scoreboard PASS without results/ in this checkout.
Default cloudEnabled=false; fix help account lie; single pure label helper; testids.
projectRef + leave flushPersist (not bare saver.flush); mock saveProject units.
W5 = hard reload SAME ENTITY IDS (not furniture count alone).
Evidence: results/planner/world-standard-wave/06-save-honesty/save-reload/
Guest: /planner/guest/?plannerDevTools=1; clearPlannerStorageInPage once; wait restore.
CP-06 hard stop. Superpowers + TDD. No worktrees. No competitor paste.
```

---

## Appendix A — File touch list (absolute)

| Role | Path |
|------|------|
| Autosave hook | `D:\OandO07072026\site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts` |
| IDB + AutoSaver | `D:\OandO07072026\site\features\planner\persistence\persistence.ts` |
| Session envelope | `D:\OandO07072026\site\features\planner\open3d\persistence\open3dSession.ts` |
| Project JSON | `D:\OandO07072026\site\features\planner\open3d\persistence\projectJson.ts` |
| Workspace | `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| TopBar | `D:\OandO07072026\site\features\planner\open3d\editor\TopBar.tsx` |
| Status labels | `D:\OandO07072026\site\features\planner\open3d\editor\workspaceStatusLabels.ts` |
| Shell | `D:\OandO07072026\site\features\planner\open3d\editor\WorkspaceShell.tsx` |
| Help | `D:\OandO07072026\site\features\planner\help\helpSections.ts` |
| Optional cloud | `D:\OandO07072026\site\features\planner\open3d\persistence\memberPlanRepository.ts` |
| Unit autosave | `D:\OandO07072026\site\tests\unit\planner-autosave.test.ts` |
| Unit labels | `D:\OandO07072026\site\tests\unit\features\planner\open3d\workspaceStatusLabels.test.ts` |
| Unit continuity | `D:\OandO07072026\site\tests\unit\features\planner\open3d\saveReloadContinuity.test.ts` |
| E2E | `D:\OandO07072026\site\tests\e2e\open3d-save-honesty.spec.ts` |
| E2E helpers | `D:\OandO07072026\site\tests\e2e\guestProjectSetup.ts` |
| Evidence root | `D:\OandO07072026\results\planner\world-standard-wave\06-save-honesty\` |
| W5 evidence | `D:\OandO07072026\results\planner\world-standard-wave\06-save-honesty\save-reload\` |

---

## Appendix B — Forbidden product strings (local-only mode)

While `cloudEnabled === false` on open3d:

- bare `Saved` (prefer `Saved locally` / `Draft saved locally`)  
- `Synced` / `synced to server` / `Synced to account`  
- `Saved to account` / `Saving to account`  
- `members keep named save slots in their account`  
- `cloud backup` / `multi-device sync` as current capability  
- Toast `Saving plan…` without **locally** qualifier  

Allowed educational future tense only if clearly **not enabled yet**.

---

## Appendix C — Competitive score snapshot (realtime slice)

From `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\SCORES.csv`:

```
product,autosave,cloud,multidevice,multiplayer,offline,export
Planner5D,4,5,5,4,2,4
RoomSketcher,3,5,5,2,2,5
Floorplanner,3,5,4,2,1,5
Homestyler,3,4,4,2,1,4
Figma,5,5,5,5,4,5
IKEA,1,3,2,1,1,3
O&O live,3,1,1,1,4,2
```

**Interpretation for P06:** raise autosave reliability (flush) and honesty; keep offline strength; do not fake cloud/multi-device scores with labels.

---

## Appendix D — Research honesty rules (normative quotes as policy)

From competitive 05-realtime report (paraphrased into O&O policy):

1. Failed persistence never shows Saved.  
2. Guest claim must not overwrite non-empty member snapshot.  
3. Do not market multi-device until cloud round-trip is live.  
4. Never green Saved that only means React state updated.  
5. Never imply multi-device recovery while only `planner-member-local` IDB exists.  

Acceptance tests from research (local subset for P06):

1. Draw/place → wait autosave/flush → hard reload → same wall/furniture **ids** (local).  
2. UI copy audit: zero cloud/sync claims while only IDB wired.  
3. (Later) Login cloud sync second profile.  
4. (Later) Airplane mode local then cloud.  

---

## Appendix E — Envelope / identity worked example

**Seed:**

- wall id `wall-w5-001`, ends (0,0)–(4000,0)  
- furniture id `furn-w5-001`, catalog `cabinet-v0`, position (1200,800)  

**After flush:** IDB `planner-guest-local.snapshot` contains envelope version `open3d-1` with those ids.

**After hard reload + restore:** `project.floors[*].walls` includes `wall-w5-001`; furniture includes `furn-w5-001`.

**Fail examples:**

- Count of furniture = 1 but id is `generated-…` → **FAIL W5**  
- Geometry similar, new ids → **FAIL W5**  
- Status “Saved” without locally → **FAIL W6**  
- Help account slots → **FAIL W6**  

---

## Appendix F — `PlannerSaveIndicator` pattern extract (ideas only)

Archive/fabric indicator distinguishes:

- local: saving_local / saved_local / local_save_failed / dirty  
- sync: syncing / queued / sync_failed / conflict  

Open3d should eventually speak the same **state machine language** when cloud lands. For P06, collapse to local-only subset with honest strings. **Do not** mount fabric TopBar into open3d.

---

## Appendix G — Spec self-review (brainstorming skill)

| Check | Result |
|-------|--------|
| Placeholder TBD/TODO | **None** in this report |
| Internal consistency | Local-only default throughout; cloud optional gated |
| Scope | P06 only; no mesh/orbit/draw thrash |
| Ambiguity | Approaches A/B/C ranked; A recommended |
| Live vs plan drift | Explicitly tabled in §0 |
| Ethics | Patterns only from websites |
| Evidence honesty | Missing `results/` called out; no paper green |

---

## Appendix H — What this brainstormer deliberately did **not** do

- No product code edits outside `Idiots/P06-save-honesty/`  
- No re-scrape Firecrawl  
- No claim CP-06 green without artifacts in this checkout  
- No cloud purchase / multiplayer design deep dive beyond gates  
- No second monorepo / worktree  

---

## Appendix I — One-page implementer card

**Goal:** Friday edit → Monday same ids; UI never claims cloud for IDB.

**Fix residual:**

1. projectRef + leave `flushPersist`  
2. pure label helper + testids  
3. help/FAQ rewrite  
4. unit write mocks  
5. E2E id asserts + evidence pack  

**Default:** `cloudEnabled=false`.  

**Proof:** `results/planner/world-standard-wave/06-save-honesty/save-reload/`.  

**Stop:** No W5–W6 green without CP-06 paths.

---

## Appendix J — Mapping buyer questions → gates

| Buyer question | Gate |
|----------------|------|
| “Is my plan still here after refresh?” | W5 |
| “Are these the same desks or did the app recreate them?” | W5 ids |
| “Is this in the cloud / my account?” | W6 |
| “Can I open this on my phone?” | **No** today — W6 must not imply yes |
| “I clicked Save — is it durable now?” | Flush API |
| “I closed the lid without clicking Save” | Leave path |
| “I cleared browser data” | Help honesty (expected loss) |

---

## Appendix K — Status string dictionary (canonical English)

Use exactly (or document intentional synonym in tests):

| Key | String |
|-----|--------|
| local.saving | Saving locally… |
| local.saved.member | Saved locally |
| local.saved.guest | Draft saved locally |
| local.unsaved.member | Unsaved changes |
| local.unsaved.guest | Unsaved draft |
| local.error | Local save failed |
| local.idle.member | Ready (local) |
| local.idle.guest | Guest session (local) |
| cloud.saving | Saving to account… |
| cloud.saved | Saved to account |
| cloud.error | Account save failed |
| dual.localOkCloudFail | Saved locally · Account save failed |

TopBar short form may use glyphs ● / ✓ / ○ **with** the same words.

---

## Appendix L — Interaction with adjacent phases

| Phase | Interaction |
|-------|-------------|
| P03 select/delete | Deleted entities must stay deleted after reload (identity + absence) |
| P04 orbit | Camera need not persist for W5; document pose must |
| P05 symbols | Symbol asset identity ≠ furniture entity id; do not confuse |
| P07 journey | Uses save pill; needs testids; full draw after CP-06 |
| P08 mesh | Mesh quality after restore is separate; ids still bind mesh |
| P09 shortcuts | Ctrl+S should map to flushPersist when wired |
| P10 handover | Must not ship scoreboard PASS without residual evidence |

---

## Appendix M — Epistemic note on scoreboard vs repo

`Plans/Research/Others/19-GOALS-SLICES.md` marks W5–W6 **PASS**.  
Live tree shows **substantial code progress** (flush, local labels, e2e file).  
This workspace lacks `results/planner/**` at report time.  

**Rule for head/partner:** re-prove claims against **artifacts + browser**, not scoreboard ticks. This report treats P06 as **mostly implemented, not fully proven, with known residual honesty/correctness gaps**.

---

*End of REPORT.md — Brainstormer 06/10 · P06 save honesty · no product code · write scope Idiots/P06-save-honesty only.*
