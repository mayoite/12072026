# P06 — Save honesty (W5–W6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).
>
> **Process:** `/using-superpowers` + test-driven-development + verification-before-completion + systematic-debugging when restore/flush flakes.
>
> **Checkout:** `D:\OandO07072026` only · **no worktrees** · commit each landable slice · push origin when green enough; mayoite ~45m / big land per AGENTS.md.

**Goal:** A facilities buyer can edit a plan, leave or hard-reload, get **the same walls + furniture entity ids** back, and every visible status/help/toast string tells the truth about **browser local storage** vs **account/cloud storage**.

**Architecture:** Open3d document model (UUID entities) → `useOpen3dWorkspaceAutosave` → IndexedDB (`planner-workspace-db` via `createAutoSaver` / `saveProject`) → restore on mount via `loadProject` + `parseOpen3dSessionSnapshot` (`open3d-1` envelope). Dual status chrome (TopBar pill + status-bar pill) share **one pure label helper**. Default `cloudEnabled=false` (local-only honesty). Explicit Save and leave paths call **immediate flush** from **latest projectRef**, not bare saver flush of possibly-stale pending. Cloud wire is optional Task 07 (**default cancel**).

**Tech Stack:** Next.js site · React client hooks · IndexedDB · Vitest · Playwright · evidence under `results/planner/world-standard-wave/06-save-honesty/` (+ `save-reload/` for W5).

**Inputs consumed:**
- Repo read: 2026-07-10 — re-verify HEAD at execute; key paths in §1 Repo reality
- Brainstormer: **`Idiots/P06-save-honesty/REPORT.md` only** (owner lock: **NEVER** `Idiots2/` for this planner)
- Phase plan: `Plans/phases/P06-save-honesty/P06-save-honesty.md` + `P06-suggestions.md` + `01-react-open3d.md`
- Spec: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (W5, W6)
- Research maps: `Plans/Research/RESULTS-MAP.md`, `RESEARCH-MAP.md`
- Prior wave plan (reference only): `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md` — this file is the **idiotplanners2** residual execution authority

**Done when:**
1. **W5 (L3 bar):** Seed → flush → hard reload → **same wall id(s) + furniture id(s)** with artifacts under `results/planner/world-standard-wave/06-save-honesty/save-reload/`
2. **W6 (H4 bar):** TopBar + status bar + help + toasts never imply cloud/account when only IDB ran; **no bare “Saved”**; selectors `data-testid="open3d-save-status"` + `data-storage` + `data-status` stable; **single pure label helper** drives both surfaces
3. **CP-06** checkboxes all evidence-backed (paths, not vibes) on **this** machine
4. Task 07 cancelled with NOTES (local-only) **or** dual-status cloud wire green (owner unlock only)

**Evidence folder:** `results/planner/world-standard-wave/06-save-honesty/` (create on execute; **re-prove if missing** — this checkout had **no** `results/planner/world-standard-wave` at plan time)

**Canonical plan path:** `plans2/P06-save-honesty/IMPLEMENTATION-PLAN.md`

**Approach lock:** **A — Residual close** on local honesty + id W5 (brainstormer §15). Reject C (status theater). Cancel B (cloud) unless owner unlocks.

---

## 1. Repo reality (live 2026-07-10 — wins over stale plan prose)

### 1.1 What already landed (do **not** re-implement from zero)

| Area | Live path | Observation |
|------|-----------|-------------|
| AutoSaver `flush` + `pendingSnapshot` + `flushInFlight` | `site/features/planner/persistence/persistence.ts` | Present; debounce **5000 ms** (`AUTO_SAVE_DEBOUNCE_MS`) |
| pagehide / visibility hidden flush | `useOpen3dWorkspaceAutosave.ts` | Registered — but calls **`saver.flush()` only**, not full `flushPersist` |
| Unmount flush-before-cancel | same hook cleanup | `flush()?.finally(() => cancel())` |
| `flushPersist` | same hook | Present; builds envelope from **render `project` closure**, not `projectRef` |
| Save button | `OOPlannerWorkspace.tsx` `handleSave` | Calls `flushPersist()`; toast “Saving draft/plan **locally**…” |
| Status labels (pure) | `workspaceStatusLabels.ts` `formatAutosaveStatus(status, guestMode)` | Guest/member local wording unit-tested |
| TopBar text | `TopBar.tsx` | Shows **“Saved locally”** when `isSynced && !isModified` — **not** bare “Saved” for that branch |
| Shell JSDoc | `WorkspaceShell.tsx` | `isSynced` = “latest snapshot is persisted **(local IDB until cloud is wired)**” — improved vs older “server” lie |
| E2E smoke | `site/tests/e2e/open3d-save-honesty.spec.ts` | Guest place 4 seats → Save draft → hard reload → furniture **count** (not ids) |
| Continuity unit | `saveReloadContinuity.test.ts` | Envelope JSON round-trip with known wall/furniture ids (`wall-1`, `furn-1`) |
| Guest helpers | `tests/e2e/guestProjectSetup.ts` | `clearPlannerStorageInPage` (one-shot; reload-safe) vs `clearPlannerStorage` (init-script wipe — **wrong** for W5 reload) |
| Import path | `OOPlannerWorkspace` `handleImportFile` | `parseOpen3dSessionSnapshot` / `importOpen3dProjectJson` → `replaceProject` |
| Fabric pattern | `PlannerSaveIndicator.tsx` | Dual local+sync labels — **not mounted** on open3d; ideas only |
| Cloud client modules | `memberPlanRepository.ts`, `plannerCloudApi.ts`, `guestPromotion.ts` | Exist; **not** called by open3d autosave |

### 1.2 Residual debt (this plan’s **real** work — Approach A residual)

| Residual | Why CP-06 still red / incomplete | Brainstormer ref |
|----------|----------------------------------|------------------|
| **Help over-claims account** | `helpSections.ts` summary + FAQ: “members keep named save slots in their account” while open3d autosave is IDB-only | REPORT §0, §7.2, §16.4 |
| **No stable save testids** | TopBar pill lacks `data-testid="open3d-save-status"`, `data-storage`, `data-status`, `role="status"`, `aria-live` | REPORT §7.6 |
| **`isSynced` / `data-synced` naming** | Still UI prop language; prefer `isLocalSaved` + `data-storage`/`data-status` | REPORT §7.7 |
| **No `projectRef` on hook** | `schedulePersist` / `flushPersist` close over render `project` | REPORT §4.3 #2–3 |
| **Leave calls bare `saver.flush()`** | If React has not yet scheduled latest envelope, leave can flush **stale/missing** pending | REPORT §4.3 #1, §6.2–6.3 |
| **Weak autosave unit asserts** | `planner-autosave.test.ts` checks shape/flush-idle; does **not** mock `saveProject` | REPORT §0, §17.1 |
| **W5 asserts count not UUIDs** | Gate language is **ids**; count is L2 smoke only (need L3) | REPORT §8.2, §14.1 |
| **No evidence pack on disk** | `results/planner/world-standard-wave/` **absent** — cannot claim green | REPORT §0, §14.3 |
| **`cloudEnabled` / `storage` not exported** | Hook surface incomplete vs label contract | REPORT §4.4 |
| **Idle label inconsistency** | TopBar “Ready” vs status “Ready (local)” / “Guest session (local)” | REPORT §7.2 |
| **Dual label tables** | TopBar boolean switch vs `formatAutosaveStatus` — drift risk | REPORT §7.3 |
| **Success toast incomplete** | handleSave sets saving message; no guaranteed “Plan/Draft saved locally” after onSaved | REPORT residual |
| **Double-gate remnant** | Empty `if (now - lastSaved < DEBOUNCE)` body left in timer path | REPORT §5.5 |
| **Restore race** | `hydrated` forced true; restore async; E2E must wait; optional schedule gate | REPORT §10 |
| **Error string** | Labels say “Save failed”; raised bar prefers “Local save failed” | REPORT §7.4 |
| **Task 07** | Cloud unwired — cancel with NOTES unless owner unlocks | REPORT §9, §15 B |

### 1.3 Contradictions: phase plan / suggestions vs code

| Source claim (2026-07-09 expert/suggestions) | Live code (2026-07-10) | Winner |
|---------------------------------------------|------------------------|--------|
| No `flush`; no pending snapshot | `flush` + `pendingSnapshot` present | **Repo** |
| Unmount `cancel()` only | flush-then-cancel | **Repo** |
| TopBar bare “Saved” | “Saved locally” | **Repo** |
| Member `formatAutosaveStatus` bare “Saved” | “Saved locally” | **Repo** |
| Save = `schedulePersist` only | `flushPersist` | **Repo** |
| Shell “synced to server” | Local IDB JSDoc | **Repo** |
| Help account slots | **Still lies** | **Repo (debt)** |
| W5 id proof in evidence | Missing folder + count-only E2E | **Debt** |
| Scoreboard / external PASS claims | No artifacts in this checkout | **Re-prove** |

**Do not thrash redoing landed flush skeleton.** Execute residual rows in §1.2.

### 1.4 Missing evidence honesty

- Historical unit continuity may exist under other names (`results/planner/save-reload-continuity/` cited in maps) — **not** sufficient for W5 alone.
- Any scoreboard “W5–W6 PASS” without this checkout’s `06-save-honesty/` + `save-reload/` artifacts = **claim until re-evidenced**.
- Firecrawl / `D:\websites` research = **ideas only**; never product truth.

### 1.5 Gates (spec authority)

| ID | Gate | Proof |
|----|------|--------|
| **W5** | Save → hard reload → same walls + furniture **ids** | Playwright + artifacts in `save-reload/` |
| **W6** | Status text does not lie — local vs cloud; cloud wire **or** honest local-only | Code + copy + unit/grep + dual surfaces + help |

North star (buyer): **save Friday, return Monday, same desks and walls with same ids; UI never said “account” if only browser IDB ran.**

### 1.6 Project id facts (must not drift)

| Mode | ID |
|------|-----|
| Guest | `planner-guest-local` (`GUEST_PROJECT_ID`) |
| Member no planId | `planner-member-local` |
| Member with planId | `planner-member-local:{planId}` |

Restore after reload **must** use the same id via `getPlannerProjectId(guestMode, planId)`. Guest→member migrate must not clobber non-empty member snapshot. **Claim is local key migration, not cloud backup** (REPORT §9.4).

### 1.7 Session envelope facts

| Field | Value |
|-------|--------|
| `version` | `"open3d-1"` (`OPEN3D_SESSION_VERSION`) |
| `engine` | `"open3d"` |
| `project` | Full `Open3dProject` |
| `updatedAt` | ISO string |

Parse accepts envelope **or** legacy raw project JSON (`open3dSession.ts`).

### 1.8 Raised bar levels (brainstormer §14 — ship targets)

| Dimension | Ship bar | Meaning |
|-----------|----------|---------|
| Durability | **L3** | Explicit Save → hard reload → **wall + furniture ids** (count-only = L2 interim) |
| Honesty | **H4** | TopBar + status + toasts + help + single pure helper + testids + a11y |
| Evidence | **E4** | Playwright + PNGs + run.json under `save-reload/` + copy grep + NOTES HEAD |

Optional raised: L4 leave-without-Save (pagehide) if stable. L6 cloud only with owner unlock.

---

## 2. Brainstormer synthesis (`Idiots/P06-save-honesty/REPORT.md`)

**Source lock:** This planner consumes **only** `Idiots/P06-save-honesty/REPORT.md`. Do **not** open or cite `Idiots2/` for this deliverable.

### 2.1 Buyer journey / JTBD

> “I finished a layout late Friday. Monday I open the same browser and the **same desks and walls are still there with the same ids**. The UI never told me my plan was in ‘my account’ if it only lived in this browser.”

| Persona | Kill trust |
|---------|------------|
| Facilities buyer | Plan empty or different entity set after reload |
| Guest evaluator | Thinks work is in “account”; clears cookies → gone |
| Member (local-only) | Help “slots in account” → assumes multi-device backup |
| Member (future cloud) | Dual-status must not hide local success behind cloud fail |

**Trust equation:** `Trust = DurableLocalWrite × HonestLabel × IdentityPreservedOnReload` — any factor zero → fail.

### 2.2 What “same ids” means (identity contract)

| Entity | Must preserve |
|--------|---------------|
| Wall entity `id` | Exact string |
| Furniture entity `id` | Exact string |
| Floor / project structure | Same active floor, membership |
| Modular options / catalog keys | Same when present |

**Count-only E2E is a weak proxy** — can pass if restore invents new ids for N furniture.

### 2.3 Competitive JTBD (ideas only — no copy)

| Pattern | Source idea | O&O original response |
|---------|-------------|------------------------|
| Cloud as system of record | P5D / RoomSketcher / Floorplanner | **Later**; do not claim now |
| Explicit Save + autosave | Floorplanner | Keep Save as **immediate flush**; keep debounced local autosave |
| Manual-save-only primary | IKEA anti-pattern | **Reject** as primary durability model |
| Dual Local vs Synced chips | Industry honesty (05-realtime) | Dual chrome **when** cloud wired; until then always “locally” |
| Continuous durability latency | Figma ref only | Flush on leave/Save; do not rely on 5s alone |
| Multiplayer / presence | P5D / Figma | **Out of P06** — never fake |
| Wait a few seconds before close | P5D docs superstition | Flush removes need; keep status truth |

O&O live competitive posture (research scores): offline **4**, cloud **1**, multi-device **1** — brand **single-device durability**, not fake cloud row.

### 2.4 Approaches (decision)

| Approach | Verdict |
|----------|---------|
| **A — Residual close: local honesty + id W5** | **Chosen** — projectRef, leave flushPersist, pure labels, help, id E2E, evidence; `cloudEnabled=false` |
| **B — Local + cloud same phase** | Only if owner unlocks Task 07 |
| **C — Status theater only** | **Reject** — strings without flush/id proof |
| **D — Debounce to 0 only** | Not instead of flush; optional later optimization |

### 2.5 Failure modes → plan coverage

| Failure | Plan response |
|---------|---------------|
| Debounce drop on leave | Flush on pagehide/visibility/unmount via **flushPersist**; unit order |
| Leave flushes stale pending | projectRef + leave calls flushPersist (rebuild envelope) |
| Stale project on explicit flush | projectRef always latest |
| Restore races default room | Wait restore-complete; optional schedule gate until restore settled |
| Count-only W5 false green | Raise E2E to ids via export/import/IDB channel |
| Help claims account slots | Task 05 rewrite + grep artifact |
| Bare Saved / cloud lie | Label helper + forbidden list tests |
| Evidence missing | Task 00 create dirs; CP-06 path checks |
| Playwright wipes IDB on reload | one-shot `clearPlannerStorageInPage` only |
| Cloud half-wire | Task 07 cancel default |
| Dead double-gate reintroduced as return | Remove dead if; unit prove write always on timer |

### 2.6 Open questions resolved in this plan

| Question | Resolution |
|----------|------------|
| Cloud in P06? | **No** default; Task 07 cancelled with NOTES unless owner unlocks mid-execute |
| Count vs ids for W5? | **Ids required** for CP-06.3; count may remain as secondary smoke |
| Which surface owns labels? | One pure helper; TopBar + status bar both call it |
| Import vs place for seed? | Prefer **import JSON with known UUIDs** for id assert; configurator place OK for smoke only |
| Leave bare flush vs flushPersist? | **flushPersist** always (REPORT §6.2) |
| Brainstormer path? | **`Idiots/P06-save-honesty/REPORT.md` only** |
| Error label? | Prefer **“Local save failed”** over bare “Save failed” |

---

## 3. Ethics / non-copy

- Research under `D:\websites` and Firecrawl history = **ideas / JTBD only**.
- **Firecrawl is dead** for active work — do not re-scrape.
- **No** competitor chrome, icons, colors, brands, copy, JS, or project formats into `site/`.
- Fabric `PlannerSaveIndicator` = pattern inventory only; do not mount fabric TopBar into open3d.
- Licenses: MIT/open preferred; paid only from cleared table (`ayushdocs/17-LICENSES-CLEARED.md`) — no new paid seats without owner.
- No secrets in git; keys stay `.env.local`.
- Evidence only under repo-root `results/` — **never** `site/results/` or `site/test-results/`.

---

## 4. File map

### 4.1 Modify (expected)

| Path | Change |
|------|--------|
| `site/features/planner/persistence/persistence.ts` | Remove dead double-gate body; keep flush/pending; optionally export `AUTO_SAVE_DEBOUNCE_MS` for tests; prove timer always writes pending |
| `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | `projectRef`; leave uses `flushPersist`; export `storage`, `cloudEnabled`, `isLocalSaved`; optional restoreSettled gate; deprecate misleading UI meaning of `isSynced` |
| `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | Evolve to full contract (`open3dSaveStatusLabel` **or** extended `formatAutosaveStatus`); single table; “Local save failed” |
| `site/features/planner/open3d/editor/TopBar.tsx` | Shared label; testids; Ready (local) parity; aria-live; honest props |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | Pass-through honest props; keep local-IDB JSDoc; optional rename path |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Wire labels/props; success toast after save; status pill uses same helper; optional restore-settled gate + `data-restore` |
| `site/features/planner/help/helpSections.ts` | Honest local-only save copy + FAQ |
| `site/tests/unit/planner-autosave.test.ts` | Mock `saveProject`; flush/cancel/schedule proof |
| `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts` | Full table + forbidden bare Saved + Local save failed |
| `site/tests/e2e/open3d-save-honesty.spec.ts` | Id equality; wait testids; evidence paths; optional secondary count smoke |

### 4.2 Create (as needed)

| Path | Why |
|------|-----|
| `site/tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx` | Hook projectRef + flushPersist if no existing file |
| `site/tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx` | Render local wording + testids |
| `site/tests/unit/features/planner/help/helpSections.saveHonesty.test.ts` | Help/FAQ no account lie |
| `site/tests/fixtures/open3d/w5-seed-project.json` | Known wall + furniture UUIDs for import seed |
| Evidence dirs under `results/planner/world-standard-wave/06-save-honesty/` | CP-06 artifacts |

### 4.3 Do not treat as live open3d primary

- `site/features/planner/_archive/fabric/**`
- `PlannerSaveIndicator.tsx` (mount path for fabric only)
- Cloud repos as open3d autosave path until Task 07 unlocked
- `Idiots2/` brainstormer for this wave (owner lock)

### 4.4 Evidence layout (RESULTS-MAP canonical)

```
results/planner/world-standard-wave/06-save-honesty/
  NOTES.md
  00-baseline-run.json
  00-baseline-vitest.log
  01-autosave-flush-vitest.log
  01-autosave-flush-run.json
  02-labels-vitest.log
  03-hook-vitest.log
  04-topbar-status-vitest.log
  05-copy-grep.txt
  05-help-vitest.log
  run.json                    (optional rollup for CP floor)
  save-reload/
    01-before-save.png
    02-saved-local.png
    03-after-hard-reload.png
    06-playwright-raw.log
    06-browser-run.json
    NOTES.md                  (optional — HEAD, id channel, route)
```

---

## 5. Architecture & data flow

### 5.1 Persist path (target after residual)

```
User edit (project.updatedAt changes)
  → projectRef.current = project (every render)
  → if !restoreSettled: skip schedule
  → schedulePersist()
      → buildOpen3dSessionEnvelope(projectRef.current)
      → createAutoSaver.scheduleSave(JSON)
          → pendingSnapshot = snapshot
          → debounce 5000ms → saveProject + history (IDB)
  → status: unsaved → saving → saved | error
  → open3dSaveStatusLabel / formatAutosaveStatus → TopBar + status bar
```

### 5.2 Flush path (W5 enabler — normative leave algorithm)

```
Save click | pagehide | visibility hidden | unmount
  → flushPersist()
      1. if !enabled || !restoreSettled: return (or only if dirty after settle)
      2. project = projectRef.current
      3. envelope = buildOpen3dSessionEnvelope(project)
      4. snapshot = JSON.stringify(envelope)
      5. setStatus("saving")
      6. saver.scheduleSave(snapshot)  // updates pending
      7. await saver.flush()
  → unmount only: saver.cancel() after flush settles
  → status saved after onSaved ack only
```

**Never:** `cancel()` before flush when dirty.  
**Never:** leave path = bare `saver.flush()` without updating pending from latest project.

### 5.3 Restore path

```
Mount workspace
  → restore: pending
  → restoreSnapshot()
      → loadProject(projectId)
      → parseOpen3dSessionSnapshot(snapshot)
      → replaceProject(restored) | empty/bootstrap
  → restore: loaded | empty | failed
  → enable schedule
  → E2E waits restore-complete before seed
```

### 5.4 Label contract (local-only default — full matrix)

| status | guest | storage | cloudEnabled | Human label |
|--------|-------|---------|--------------|-------------|
| idle | true | local | false | Guest session (local) |
| idle | false | local | false | Ready (local) |
| unsaved | true | local | false | Unsaved draft |
| unsaved | false | local | false | Unsaved changes |
| saving | * | local | false | Saving locally… |
| saved | true | local | false | Draft saved locally |
| saved | false | local | false | Saved locally |
| error | * | local | false | Local save failed |

**Forbidden when `cloudEnabled === false`:** bare `Saved`, `Synced`, `Synced to server`, `Saved to cloud`, `Saved to account`, help “named save slots in their account”.

### 5.5 Toast contract

| Event | Guest | Member |
|-------|-------|--------|
| Save click | Saving draft locally… | Saving plan locally… |
| Success | Draft saved locally | Plan saved locally |
| Failure | Local save failed | Local save failed |

### 5.6 Future cloud composite (Task 07 only — do not implement by default)

| Local | Cloud | Composite |
|-------|-------|-----------|
| saved | off | Saved locally |
| saved | syncing | Saved locally · Saving to account… |
| saved | synced | Saved to account (or dual chip) |
| saved | failed | Saved locally · Account save failed |
| error local | * | Local save failed |

**Rule:** never hide local success behind cloud failure.

---

## 6. Task list

### Task 00 — Setup / baseline (no product claim)

**Files:**
- Create: `results/planner/world-standard-wave/06-save-honesty/` and `…/save-reload/`
- Create: `…/06-save-honesty/NOTES.md`, `00-baseline-run.json`

- [ ] **Step 1: Create evidence directories**

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path results\planner\world-standard-wave\06-save-honesty\save-reload | Out-Null
```

Expected: directories exist.

- [ ] **Step 2: Record HEAD honesty in NOTES.md**

```powershell
cd D:\OandO07072026
git rev-parse HEAD
git status -sb
```

Write `results/planner/world-standard-wave/06-save-honesty/NOTES.md`:

```markdown
# P06 evidence notes

- Date: <ISO>
- HEAD: <sha or dirty>
- cloudEnabled: false (default)
- Approach: A residual local-first honesty + id W5
- Brainstormer: Idiots/P06-save-honesty/REPORT.md
- Plan: plans2/P06-save-honesty/IMPLEMENTATION-PLAN.md
- Id channel (W5): TBD until Task 06 (prefer export JSON after import seed)
```

- [ ] **Step 3: Run baseline vitest suite (continuity + autosave + labels)**

```powershell
cd D:\OandO07072026\site
npx vitest run `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  tests/unit/features/planner/open3d/open3dSession.test.ts `
  tests/unit/planner-autosave.test.ts `
  tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\00-baseline-vitest.log
```

Expected: PASS on existing suites (or document any pre-existing fail honestly in NOTES — do not hide).

- [ ] **Step 4: Write `00-baseline-run.json`**

```json
{
  "schemaVersion": 1,
  "phase": "P06-save-honesty",
  "gate": "baseline",
  "command": "vitest run saveReloadContinuity open3dSession planner-autosave workspaceStatusLabels",
  "exitCode": 0,
  "passed": true,
  "timestamp": "<ISO>",
  "notes": "Baseline only — W5 browser ids not proven; help still lies; no projectRef yet"
}
```

- [ ] **Step 5: Commit evidence scaffold only if NOTES/dirs are tracked policy allows; prefer not committing empty results if gitignored — check `.gitignore`. If results ignored, keep local only.**

**Done when:** baseline log exists; agent knows unit continuity is green and browser W5 is unproven; residual list known.

---

### Task 01 — TDD: AutoSaver flush write proofs + dead gate cleanup

**Files:**
- Modify: `site/tests/unit/planner-autosave.test.ts`
- Modify: `site/features/planner/persistence/persistence.ts` (minimal — only if dead gate / export needed)

- [ ] **Step 1: Write the failing tests (mock `saveProject`)**

Replace / extend `site/tests/unit/planner-autosave.test.ts` with full write-proof suite. Full source:

```typescript
/**
 * planner-autosave.test.ts
 * P06 — createAutoSaver: debounce, flush, cancel, pending retention (mocked saveProject).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const saveProjectMock = vi.fn();
const loadProjectMock = vi.fn();
const saveHistoryEntryMock = vi.fn();

vi.mock("@/features/planner/persistence/persistence", async (importOriginal) => {
  // Prefer vi.spyOn on real module if mock circular — see Step 1b alternative.
  const actual = await importOriginal<typeof import("@/features/planner/persistence/persistence")>();
  return {
    ...actual,
    saveProject: (...args: unknown[]) => saveProjectMock(...args),
    loadProject: (...args: unknown[]) => loadProjectMock(...args),
    saveHistoryEntry: (...args: unknown[]) => saveHistoryEntryMock(...args),
  };
});

// If full-module mock is circular (createAutoSaver imports saveProject from same file),
// use Step 1b: extract persist seam OR spy via dependency injection.
// Preferred residual path when same-file: refactor createAutoSaver to accept optional
// deps: { saveProject, loadProject, saveHistoryEntry } — default to module exports.
```

**Preferred implementation (avoid same-file mock pain):** inject optional deps into `createAutoSaver`:

```typescript
// In persistence.ts — extend createAutoSaver signature (no `any`)
export type AutoSaverDeps = {
  saveProject?: typeof saveProject;
  loadProject?: typeof loadProject;
  saveHistoryEntry?: typeof saveHistoryEntry;
  now?: () => number;
};

export function createAutoSaver(
  projectId: string,
  callbacks: AutoSaverCallbacks = {},
  deps: AutoSaverDeps = {},
) {
  const save = deps.saveProject ?? saveProject;
  const load = deps.loadProject ?? loadProject;
  const saveHistory = deps.saveHistoryEntry ?? saveHistoryEntry;
  // ... use save/load/saveHistory inside persistSnapshot
}
```

Full unit test source (deps injection path — **use this**):

```typescript
/**
 * planner-autosave.test.ts
 * P06 — createAutoSaver debounce + flush + cancel with injected saveProject.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAutoSaver,
  shouldMigrateGuestPlan,
  GUEST_PROJECT_ID,
  MEMBER_PROJECT_ID,
  type PlannerProject,
} from "@/features/planner/persistence/persistence";

function makeProject(id: string, snapshot = ""): PlannerProject {
  return { id, name: id, createdAt: 1, updatedAt: 2, snapshot };
}

describe("createAutoSaver write semantics (P06)", () => {
  const snapA = JSON.stringify({ version: 1, n: "a" });
  const snapB = JSON.stringify({ version: 1, n: "b" });

  let saveProject: ReturnType<typeof vi.fn>;
  let loadProject: ReturnType<typeof vi.fn>;
  let saveHistoryEntry: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    saveProject = vi.fn(async (p: PlannerProject) => p);
    loadProject = vi.fn(async () => undefined);
    saveHistoryEntry = vi.fn(async () => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function makeSaver(id = "p06-test") {
    return createAutoSaver(
      id,
      {},
      {
        saveProject: saveProject as never,
        loadProject: loadProject as never,
        saveHistoryEntry: saveHistoryEntry as never,
      },
    );
  }

  it("flush writes immediately without waiting 5s", async () => {
    const saver = makeSaver();
    saver.scheduleSave(snapA);
    expect(saveProject).not.toHaveBeenCalled();
    await saver.flush();
    expect(saveProject).toHaveBeenCalledTimes(1);
    expect(saveProject.mock.calls[0]?.[0]?.snapshot).toBe(snapA);
    saver.cancel();
  });

  it("schedule A then B then flush persists last pending (B)", async () => {
    const saver = makeSaver();
    saver.scheduleSave(snapA);
    saver.scheduleSave(snapB);
    await saver.flush();
    expect(saveProject).toHaveBeenCalledTimes(1);
    expect(saveProject.mock.calls[0]?.[0]?.snapshot).toBe(snapB);
    saver.cancel();
  });

  it("cancel after schedule does not write", async () => {
    const saver = makeSaver();
    saver.scheduleSave(snapA);
    saver.cancel();
    await vi.advanceTimersByTimeAsync(6000);
    expect(saveProject).not.toHaveBeenCalled();
  });

  it("debounced timer fires write after AUTO_SAVE_DEBOUNCE_MS", async () => {
    const saver = makeSaver();
    saver.scheduleSave(snapA);
    await vi.advanceTimersByTimeAsync(4999);
    expect(saveProject).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2);
    expect(saveProject).toHaveBeenCalledTimes(1);
    expect(saveProject.mock.calls[0]?.[0]?.snapshot).toBe(snapA);
    saver.cancel();
  });

  it("rapid schedule after successful save still writes new pending", async () => {
    const saver = makeSaver();
    saver.scheduleSave(snapA);
    await saver.flush();
    expect(saveProject).toHaveBeenCalledTimes(1);
    saver.scheduleSave(snapB);
    await saver.flush();
    expect(saveProject).toHaveBeenCalledTimes(2);
    expect(saveProject.mock.calls[1]?.[0]?.snapshot).toBe(snapB);
    saver.cancel();
  });

  it("flush() is safe when idle (no write)", async () => {
    const saver = makeSaver("idle-flush");
    await expect(saver.flush()).resolves.toBeUndefined();
    expect(saveProject).not.toHaveBeenCalled();
    saver.cancel();
  });

  it("after cancel, schedule and flush no-op", async () => {
    const saver = makeSaver();
    saver.cancel();
    saver.scheduleSave(snapA);
    await saver.flush();
    expect(saveProject).not.toHaveBeenCalled();
  });

  it("returns scheduleSave, flush, and cancel", () => {
    const saver = makeSaver("any-id");
    expect(typeof saver.scheduleSave).toBe("function");
    expect(typeof saver.flush).toBe("function");
    expect(typeof saver.cancel).toBe("function");
    saver.cancel();
  });
});

describe("shouldMigrateGuestPlan quick regression", () => {
  const snap = JSON.stringify({ v: 1 });

  it("migrates guest→member when member is empty and not claimed", () => {
    expect(shouldMigrateGuestPlan(makeProject(GUEST_PROJECT_ID, snap), undefined, false)).toBe(true);
  });

  it("does not migrate if member already has data", () => {
    expect(
      shouldMigrateGuestPlan(
        makeProject(GUEST_PROJECT_ID, snap),
        makeProject(MEMBER_PROJECT_ID, snap),
        false,
      ),
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL** (deps param not yet on `createAutoSaver`, or write mocks not wired)

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/planner-autosave.test.ts --reporter=verbose
```

Expected: FAIL — e.g. third argument ignored / saveProject never called / type errors.

- [ ] **Step 3: Minimal implementation**

In `persistence.ts`:

1. Add optional `AutoSaverDeps` third argument.
2. Use injected `save` / `load` / `saveHistory` in `persistSnapshot`.
3. **Delete** the dead double-gate empty `if` block entirely:

```typescript
// REMOVE this dead remnant:
// if (now - lastSaved < AUTO_SAVE_DEBOUNCE_MS && flushInFlight === null) {
//   // Still honor latest pending on next schedule; do not drop it forever.
// }

// Timer body becomes simply:
timeoutId = setTimeout(() => {
  timeoutId = null;
  if (!active || pendingSnapshot === null) return;
  const toSave = pendingSnapshot;
  flushInFlight = persistSnapshot(toSave).finally(() => {
    flushInFlight = null;
  });
}, AUTO_SAVE_DEBOUNCE_MS);
```

4. Keep `flush()` as immediate write of pending (no lastSaved skip).
5. Optionally export debounce for tests:

```typescript
export const PLANNER_AUTO_SAVE_DEBOUNCE_MS = AUTO_SAVE_DEBOUNCE_MS;
```

Full `createAutoSaver` target body (integrate into existing function — no `any`):

```typescript
type AutoSaverCallbacks = {
  onSaved?: (event: {
    projectId: string;
    updatedAt: number;
    snapshot: string;
  }) => void;
  onError?: (error: unknown) => void;
};

export type AutoSaverDeps = {
  saveProject?: (project: PlannerProject) => Promise<void | PlannerProject>;
  loadProject?: (id: string) => Promise<PlannerProject | undefined>;
  saveHistoryEntry?: (entry: HistoryEntry) => Promise<void | HistoryEntry>;
};

export function createAutoSaver(
  projectId: string,
  callbacks: AutoSaverCallbacks = {},
  deps: AutoSaverDeps = {},
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastSaved = 0;
  let active = true;
  let pendingSnapshot: string | null = null;
  let flushInFlight: Promise<void> | null = null;

  const save = deps.saveProject ?? saveProject;
  const load = deps.loadProject ?? loadProject;
  const saveHistory = deps.saveHistoryEntry ?? saveHistoryEntry;

  function clearPendingTimer() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  async function persistSnapshot(snapshot: string): Promise<void> {
    if (!active) return;
    const now = Date.now();
    try {
      const existing = await load(projectId).catch(() => undefined);
      if (!active) return;

      await save({
        id: projectId,
        name: existing?.name || projectId,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        snapshot,
      });
      if (!active) return;

      await saveHistory({
        id: `${projectId}-${now}`,
        projectId,
        timestamp: now,
        snapshot,
        label: `Auto-save`,
      });
      if (!active) return;

      lastSaved = now;
      if (pendingSnapshot === snapshot) {
        pendingSnapshot = null;
      }
      callbacks.onSaved?.({ projectId, updatedAt: now, snapshot });
    } catch (error) {
      if (!active) return;
      callbacks.onError?.(error);
    }
  }

  return {
    scheduleSave(snapshot: string) {
      if (!active) return;
      pendingSnapshot = snapshot;
      clearPendingTimer();
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (!active || pendingSnapshot === null) return;
        const toSave = pendingSnapshot;
        flushInFlight = persistSnapshot(toSave).finally(() => {
          flushInFlight = null;
        });
      }, AUTO_SAVE_DEBOUNCE_MS);
    },

    async flush(): Promise<void> {
      if (!active) return;
      clearPendingTimer();
      if (flushInFlight) {
        await flushInFlight;
      }
      if (pendingSnapshot === null) return;
      const toSave = pendingSnapshot;
      flushInFlight = persistSnapshot(toSave).finally(() => {
        flushInFlight = null;
      });
      await flushInFlight;
    },

    cancel() {
      active = false;
      clearPendingTimer();
      pendingSnapshot = null;
    },
  };
}
```

Note: match existing `PlannerProject` / `HistoryEntry` types already in file. Adjust `save` return type to match real `saveProject` signature when implementing.

- [ ] **Step 4: Run tests — expect PASS**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/planner-autosave.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\01-autosave-flush-vitest.log
```

Expected: all createAutoSaver write semantics PASS; migration regression PASS.

Write `01-autosave-flush-run.json` (schemaVersion 1, exitCode 0).

- [ ] **Step 5: Commit**

```bash
git add site/features/planner/persistence/persistence.ts site/tests/unit/planner-autosave.test.ts
git commit -m "test(p06): AutoSaver flush write proofs + remove dead debounce gate"
```

**Done when:** flush tests pass with real write mocks; no silent skip of debounced write; dead gate gone.

---

### Task 02 — TDD: status label pure helper (W6) — single source

**Files:**
- Modify: `site/features/planner/open3d/editor/workspaceStatusLabels.ts`
- Modify: `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts`

- [ ] **Step 1: Write failing table tests**

Extend `workspaceStatusLabels.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import {
  formatAutosaveStatus,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
  open3dSaveStatusLabel,
  type Open3dPersistStorage,
} from "@/features/planner/open3d/editor/workspaceStatusLabels";
import type { Open3dSaveStatus } from "@/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave";

describe("workspaceStatusLabels", () => {
  it("formats tool and view mode", () => {
    expect(formatToolStatus("wall", "2d")).toBe("Wall · 2D");
  });

  it("formats snap status only when active", () => {
    expect(formatSnapStatus("none")).toBeNull();
    expect(formatSnapStatus("grid")).toBe("Snap: grid");
  });

  it("formats selection counts", () => {
    expect(formatSelectionStatus({ type: "wall", ids: ["w1"] })).toBe("Wall selected");
    expect(formatSelectionStatus({ type: "furniture", ids: ["a", "b"] })).toBe(
      "2 furnitures selected",
    );
    expect(formatSelectionStatus({ type: "none", ids: [] })).toBeNull();
  });
});

describe("open3dSaveStatusLabel local-only matrix (W6)", () => {
  const local: Open3dPersistStorage = "local";

  const cases: Array<{
    status: Open3dSaveStatus;
    guestMode: boolean;
    expected: string;
  }> = [
    { status: "idle", guestMode: true, expected: "Guest session (local)" },
    { status: "idle", guestMode: false, expected: "Ready (local)" },
    { status: "unsaved", guestMode: true, expected: "Unsaved draft" },
    { status: "unsaved", guestMode: false, expected: "Unsaved changes" },
    { status: "saving", guestMode: true, expected: "Saving locally…" },
    { status: "saving", guestMode: false, expected: "Saving locally…" },
    { status: "saved", guestMode: true, expected: "Draft saved locally" },
    { status: "saved", guestMode: false, expected: "Saved locally" },
    { status: "error", guestMode: true, expected: "Local save failed" },
    { status: "error", guestMode: false, expected: "Local save failed" },
  ];

  it.each(cases)(
    "$status guest=$guestMode → $expected",
    ({ status, guestMode, expected }) => {
      expect(
        open3dSaveStatusLabel({
          status,
          storage: local,
          lastSavedAt: status === "saved" ? "2026-07-10T12:00:00.000Z" : null,
          cloudEnabled: false,
          guestMode,
        }),
      ).toBe(expected);
    },
  );

  it("never returns bare Saved or account language when cloudEnabled false", () => {
    const statuses: Open3dSaveStatus[] = ["idle", "unsaved", "saving", "saved", "error"];
    for (const status of statuses) {
      for (const guestMode of [true, false]) {
        const label = open3dSaveStatusLabel({
          status,
          storage: "local",
          lastSavedAt: null,
          cloudEnabled: false,
          guestMode,
        });
        expect(label).not.toBe("Saved");
        expect(label).not.toMatch(/^Synced/i);
        expect(label.toLowerCase()).not.toContain("account");
        expect(label.toLowerCase()).not.toContain("cloud");
      }
    }
  });

  it("formatAutosaveStatus remains a thin adapter to open3dSaveStatusLabel", () => {
    expect(formatAutosaveStatus("saved", true)).toBe("Draft saved locally");
    expect(formatAutosaveStatus("saved", false)).toBe("Saved locally");
    expect(formatAutosaveStatus("error", false)).toBe("Local save failed");
    expect(formatAutosaveStatus("idle", false)).toBe("Ready (local)");
  });
});

describe("open3dSaveStatusLabel cloud branches (only when enabled)", () => {
  it("saved + cloud storage + cloudEnabled → Saved to account", () => {
    expect(
      open3dSaveStatusLabel({
        status: "saved",
        storage: "cloud",
        lastSavedAt: "2026-07-10T12:00:00.000Z",
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Saved to account");
  });

  it("saving + cloud + cloudEnabled → Saving to account…", () => {
    expect(
      open3dSaveStatusLabel({
        status: "saving",
        storage: "cloud",
        lastSavedAt: null,
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Saving to account…");
  });

  it("cloud storage ignored when cloudEnabled false (force local wording)", () => {
    expect(
      open3dSaveStatusLabel({
        status: "saved",
        storage: "cloud",
        lastSavedAt: "2026-07-10T12:00:00.000Z",
        cloudEnabled: false,
        guestMode: false,
      }),
    ).toBe("Saved locally");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts --reporter=verbose
```

Expected: FAIL — `open3dSaveStatusLabel` missing; error still “Save failed”.

- [ ] **Step 3: Minimal implementation**

Full update for `workspaceStatusLabels.ts` autosave section:

```typescript
import type { PlannerTool } from "./canvasTool";
import { CANVAS_TOOL_LABELS } from "./canvasTool";
import type { SnapKind } from "../lib/geometry/snapping";
import type { CanvasSelection } from "./useWorkspaceCanvas";
import type { Open3dSaveStatus } from "../persistence/useOpen3dWorkspaceAutosave";

// ... existing SELECTION_LABELS, formatToolStatus, formatSnapStatus, formatSelectionStatus ...

export type Open3dPersistStorage = "local" | "cloud";

export function open3dSaveStatusLabel(input: {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
}): string {
  const guestMode = input.guestMode ?? false;
  // Force local tier when cloud not product-enabled.
  const storage: Open3dPersistStorage =
    input.cloudEnabled && input.storage === "cloud" ? "cloud" : "local";

  if (storage === "cloud") {
    switch (input.status) {
      case "saving":
        return "Saving to account…";
      case "saved":
        return "Saved to account";
      case "error":
        return "Account save failed";
      case "unsaved":
        return guestMode ? "Unsaved draft" : "Unsaved changes";
      case "idle":
      default:
        return guestMode ? "Guest session (local)" : "Ready (local)";
    }
  }

  switch (input.status) {
    case "saving":
      return "Saving locally…";
    case "saved":
      return guestMode ? "Draft saved locally" : "Saved locally";
    case "unsaved":
      return guestMode ? "Unsaved draft" : "Unsaved changes";
    case "error":
      return "Local save failed";
    case "idle":
    default:
      return guestMode ? "Guest session (local)" : "Ready (local)";
  }
}

/** Thin adapter — both TopBar and status bar should prefer open3dSaveStatusLabel. */
export function formatAutosaveStatus(
  status: Open3dSaveStatus,
  guestMode: boolean,
): string {
  return open3dSaveStatusLabel({
    status,
    storage: "local",
    lastSavedAt: null,
    cloudEnabled: false,
    guestMode,
  });
}
```

- [ ] **Step 4: Run — expect PASS**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\02-labels-vitest.log
```

- [ ] **Step 5: Commit**

```bash
git add site/features/planner/open3d/editor/workspaceStatusLabels.ts site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts
git commit -m "feat(p06): open3dSaveStatusLabel single source for local/cloud honesty"
```

**Done when:** all label branches unit-green; bare “Saved” never returned for local; error = “Local save failed”.

---

### Task 03 — Hook: projectRef + leave flushPersist + storage exports

**Files:**
- Modify: `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts`
- Create: `site/tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx`

- [ ] **Step 1: Write failing hook tests**

```tsx
/**
 * useOpen3dWorkspaceAutosave — projectRef + flushPersist latest envelope (P06).
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const scheduleSave = vi.fn();
const flush = vi.fn(async () => undefined);
const cancel = vi.fn();

vi.mock("@/features/planner/persistence/persistence", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/planner/persistence/persistence")>();
  return {
    ...actual,
    createAutoSaver: vi.fn(() => ({
      scheduleSave,
      flush,
      cancel,
    })),
    loadProject: vi.fn(async () => undefined),
    migrateGuestProjectToMember: vi.fn(async () => "skipped" as const),
  };
});

import { useOpen3dWorkspaceAutosave } from "@/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { addFurniture } from "@/features/planner/open3d/model/operations/pureActions";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("useOpen3dWorkspaceAutosave P06", () => {
  beforeEach(() => {
    scheduleSave.mockClear();
    flush.mockClear();
    cancel.mockClear();
  });

  it("exports storage local and cloudEnabled false by default", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Hook test",
      now: "2026-07-10T12:00:00.000Z",
    });
    const { result } = renderHook(() =>
      useOpen3dWorkspaceAutosave(project, true, undefined, {
        enabled: true,
        hydrated: true,
      }),
    );
    expect(result.current.storage).toBe("local");
    expect(result.current.cloudEnabled).toBe(false);
    expect(result.current.isLocalSaved).toBe(result.current.isSynced);
  });

  it("flushPersist schedules latest project envelope then flushes", async () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "Hook test",
      now: "2026-07-10T12:00:00.000Z",
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 200 }, {
      idFactory: ids("furn-1"),
    }));

    const { result, rerender } = renderHook(
      ({ p }) =>
        useOpen3dWorkspaceAutosave(p, true, undefined, {
          enabled: true,
          hydrated: true,
        }),
      { initialProps: { p: project } },
    );

    // Simulate later project update via rerender with new updatedAt identity
    const later = { ...project, updatedAt: "2026-07-10T12:01:00.000Z", name: "Later" };
    rerender({ p: later });

    await act(async () => {
      await result.current.flushPersist();
    });

    expect(scheduleSave).toHaveBeenCalled();
    const lastSnap = scheduleSave.mock.calls.at(-1)?.[0] as string;
    expect(lastSnap).toContain("Later");
    expect(flush).toHaveBeenCalled();
  });
});
```

Adjust pureActions import if `addFurniture` signature differs — read live `pureActions` at execute time and match.

- [ ] **Step 2: Run — expect FAIL**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx --reporter=verbose
```

Expected: FAIL — missing `storage` / `cloudEnabled` / `isLocalSaved` or stale flush snapshot.

- [ ] **Step 3: Minimal implementation — full hook target**

Replace body of `useOpen3dWorkspaceAutosave.ts` with residual-correct version:

```typescript
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createAutoSaver,
  getPlannerProjectId,
  loadProject,
  migrateGuestProjectToMember,
} from "@/features/planner/persistence/persistence";
import type { Open3dProject } from "../model/types";
import { exportOpen3dProjectJson } from "./projectJson";
import { buildOpen3dSessionEnvelope, parseOpen3dSessionSnapshot } from "./open3dSession";

export type Open3dSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";
export type Open3dPersistStorage = "local" | "cloud";

export function useOpen3dWorkspaceAutosave(
  project: Open3dProject,
  guestMode: boolean,
  planId?: string,
  options?: {
    enabled?: boolean;
    hydrated?: boolean;
    /** When false, skip schedule/flush that could race default room over IDB. */
    restoreSettled?: boolean;
    cloudEnabled?: boolean;
  },
) {
  const enabled = options?.enabled ?? true;
  const hydrated = options?.hydrated ?? true;
  const restoreSettled = options?.restoreSettled ?? true;
  const cloudEnabled = options?.cloudEnabled ?? false;
  const projectId = getPlannerProjectId(guestMode, planId);
  const [status, setStatus] = useState<Open3dSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saverRef = useRef<ReturnType<typeof createAutoSaver> | null>(null);
  const mountedRef = useRef(false);
  const autosaveGenerationRef = useRef(0);
  const didScheduleAfterHydrationRef = useRef(false);
  const projectRef = useRef(project);
  projectRef.current = project;

  const schedulePersist = useCallback(() => {
    if (!enabled || !hydrated || !restoreSettled) return;
    if (!mountedRef.current) return;
    const envelope = buildOpen3dSessionEnvelope(projectRef.current);
    const snapshot = JSON.stringify(envelope);
    setStatus("saving");
    saverRef.current?.scheduleSave(snapshot);
  }, [enabled, hydrated, restoreSettled]);

  const flushPersist = useCallback(async () => {
    if (!enabled || !hydrated || !restoreSettled) return;
    const envelope = buildOpen3dSessionEnvelope(projectRef.current);
    const snapshot = JSON.stringify(envelope);
    setStatus("saving");
    saverRef.current?.scheduleSave(snapshot);
    await saverRef.current?.flush?.();
  }, [enabled, hydrated, restoreSettled]);

  useEffect(() => {
    if (!enabled) return;
    mountedRef.current = true;
    const generation = ++autosaveGenerationRef.current;
    saverRef.current = createAutoSaver(projectId, {
      onSaved: () => {
        if (!mountedRef.current || autosaveGenerationRef.current !== generation) return;
        setStatus("saved");
        setLastSavedAt(new Date().toISOString());
      },
      onError: () => {
        if (!mountedRef.current || autosaveGenerationRef.current !== generation) return;
        setStatus("error");
      },
    });

    const flushPending = () => {
      // Rebuild from latest project — never bare saver.flush alone.
      void flushPersist();
    };
    window.addEventListener("pagehide", flushPending);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushPending();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountedRef.current = false;
      autosaveGenerationRef.current += 1;
      window.removeEventListener("pagehide", flushPending);
      document.removeEventListener("visibilitychange", onVisibility);
      void flushPersist().finally(() => {
        saverRef.current?.cancel();
        saverRef.current = null;
      });
    };
  }, [enabled, projectId, flushPersist]);

  useEffect(() => {
    if (!enabled || !hydrated || !restoreSettled) return;
    if (!didScheduleAfterHydrationRef.current) {
      didScheduleAfterHydrationRef.current = true;
      return;
    }
    setStatus("unsaved");
    schedulePersist();
  }, [enabled, hydrated, restoreSettled, project.updatedAt, schedulePersist]);

  const restoreSnapshot = useCallback(async (): Promise<Open3dProject | null> => {
    try {
      if (!guestMode) {
        await migrateGuestProjectToMember();
      }
      const existing = await loadProject(projectId);
      if (!existing?.snapshot?.trim()) return null;
      return parseOpen3dSessionSnapshot(existing.snapshot);
    } catch {
      return null;
    }
  }, [guestMode, projectId]);

  const exportSnapshot = useCallback(
    () => exportOpen3dProjectJson(projectRef.current),
    [],
  );

  const isLocalSaved = status === "saved";

  return {
    status,
    lastSavedAt,
    restoreSnapshot,
    schedulePersist,
    flushPersist,
    exportSnapshot,
    storage: "local" as Open3dPersistStorage,
    cloudEnabled,
    isLocalSaved,
    /** @deprecated Use isLocalSaved — never means server sync while cloudEnabled false */
    isSynced: isLocalSaved,
    isModified: status === "unsaved" || status === "saving",
  };
}
```

**Caution:** cleanup effect depending on `flushPersist` can re-bind listeners often — if that causes thrash, store `flushPersist` in a ref (`flushPersistRef.current = flushPersist`) and register leave listeners once per `projectId` (same pattern as restoreSnapshotRef in workspace). Prefer ref stabilization if tests show remount loops:

```typescript
const flushPersistRef = useRef(flushPersist);
flushPersistRef.current = flushPersist;

useEffect(() => {
  // ...
  const flushPending = () => {
    void flushPersistRef.current();
  };
  // cleanup:
  void flushPersistRef.current().finally(() => { ... });
}, [enabled, projectId]);
```

- [ ] **Step 4: Run hook tests — PASS**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\03-hook-vitest.log
```

- [ ] **Step 5: Wire restoreSettled in `OOPlannerWorkspace` (minimal)**

```typescript
const [restoreSettled, setRestoreSettled] = useState(false);

// in restore effect finally:
setRestoreSettled(true);

const autosave = useOpen3dWorkspaceAutosave(
  workspaceCanvas.project,
  guestMode,
  planId,
  { hydrated, restoreSettled },
);
```

Optional DOM for E2E:

```tsx
<div data-testid="open3d-restore" data-restore={restoreSettled ? "complete" : "pending"} className="sr-only" />
```

- [ ] **Step 6: Success toast when status becomes saved after Save**

```typescript
const handleSave = useCallback(() => {
  void autosave.flushPersist();
  setWorkspaceMessage(guestMode ? "Saving draft locally…" : "Saving plan locally…");
}, [autosave, guestMode]);

useEffect(() => {
  if (autosave.status === "saved" && autosave.lastSavedAt) {
    // Only if message is in saving state — avoid overwriting unrelated messages.
    setWorkspaceMessage((msg) =>
      msg && /Saving (draft|plan) locally/i.test(msg)
        ? guestMode
          ? "Draft saved locally"
          : "Plan saved locally"
        : msg,
    );
  }
  if (autosave.status === "error") {
    setWorkspaceMessage("Local save failed");
  }
}, [autosave.status, autosave.lastSavedAt, guestMode]);
```

- [ ] **Step 7: Commit**

```bash
git add site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts `
  site/features/planner/open3d/editor/OOPlannerWorkspace.tsx `
  site/tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx
git commit -m "feat(p06): projectRef flushPersist on leave + restoreSettled gate"
```

**Done when:** hook tests green; leave never bare-flushs without latest envelope; restoreSettled prevents default-room write races.

---

### Task 04 — TopBar + status-bar UI (W6 surfaces) + testids

**Files:**
- Modify: `TopBar.tsx`, `WorkspaceShell.tsx`, `OOPlannerWorkspace.tsx`
- Create/modify: TopBar save status unit test

- [ ] **Step 1: Failing render test**

```tsx
/**
 * TopBar.saveStatus.test.tsx
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopBar } from "@/features/planner/open3d/editor/TopBar";

describe("TopBar save honesty (P06 W6)", () => {
  it("shows shared local label and testids when saved", () => {
    render(
      <TopBar
        projectName="W6"
        saveStatusLabel="Saved locally"
        saveStatus="saved"
        storage="local"
        isModified={false}
        isLocalSaved={true}
      />,
    );
    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveAttribute("data-status", "saved");
    expect(pill).toHaveAttribute("data-storage", "local");
    expect(pill).toHaveTextContent("Saved locally");
    expect(pill.textContent).not.toMatch(/^Saved$/);
  });

  it("shows Ready (local) when idle", () => {
    render(
      <TopBar
        projectName="W6"
        saveStatusLabel="Ready (local)"
        saveStatus="idle"
        storage="local"
        isModified={false}
        isLocalSaved={false}
      />,
    );
    expect(screen.getByTestId("open3d-save-status")).toHaveTextContent("Ready (local)");
  });

  it("shows Unsaved draft label for guest unsaved", () => {
    render(
      <TopBar
        projectName="W6"
        saveStatusLabel="Unsaved draft"
        saveStatus="unsaved"
        storage="local"
        isModified={true}
        isLocalSaved={false}
        accessContext="guest"
      />,
    );
    expect(screen.getByTestId("open3d-save-status")).toHaveTextContent("Unsaved draft");
  });
});
```

- [ ] **Step 2: Run — FAIL** (props missing)

- [ ] **Step 3: TopBar props + pill**

Update `TopBarProps` and pill block:

```typescript
import type { Open3dSaveStatus } from "../persistence/useOpen3dWorkspaceAutosave";
import type { Open3dPersistStorage } from "./workspaceStatusLabels";

export interface TopBarProps {
  // ...existing...
  /** @deprecated prefer isLocalSaved */
  isSynced?: boolean;
  isLocalSaved?: boolean;
  saveStatusLabel?: string;
  saveStatus?: Open3dSaveStatus;
  storage?: Open3dPersistStorage;
}

// In component defaults:
// isLocalSaved = isLocalSaved ?? isSynced ?? false

// Replace save status div:
<div
  className={styles.saveStatus}
  data-testid="open3d-save-status"
  data-status={saveStatus ?? (isModified ? "unsaved" : isLocalSaved ? "saved" : "idle")}
  data-storage={storage ?? "local"}
  data-modified={isModified}
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {saveStatusLabel ? (
    <>
      <span aria-hidden="true">
        {isModified ? "●" : isLocalSaved || saveStatus === "saved" ? "✓" : "○"}
      </span>{" "}
      {saveStatusLabel}
    </>
  ) : isModified ? (
    <>
      <span aria-hidden="true">●</span> Unsaved changes
    </>
  ) : isLocalSaved || isSynced ? (
    <>
      <span aria-hidden="true">✓</span> Saved locally
    </>
  ) : (
    <>
      <span aria-hidden="true">○</span> Ready (local)
    </>
  )}
</div>
```

- [ ] **Step 4: WorkspaceShell passthrough**

Add props to `WorkspaceShellProps` and forward to TopBar:

```typescript
  /** Whether latest snapshot is persisted locally (IDB until cloud is wired) */
  isLocalSaved?: boolean;
  /** @deprecated alias of isLocalSaved — never "server synced" */
  isSynced?: boolean;
  saveStatusLabel?: string;
  saveStatus?: Open3dSaveStatus;
  storage?: Open3dPersistStorage;
```

Forward to TopBar. Keep JSDoc honest (already improved).

- [ ] **Step 5: OOPlannerWorkspace wires single helper**

```typescript
import {
  formatToolStatus,
  formatAutosaveStatus,
  open3dSaveStatusLabel,
} from "./workspaceStatusLabels";

const saveStatusLabel = open3dSaveStatusLabel({
  status: autosave.status,
  storage: autosave.storage,
  lastSavedAt: autosave.lastSavedAt,
  cloudEnabled: autosave.cloudEnabled,
  guestMode,
});

// Shell:
isModified={autosave.isModified}
isLocalSaved={autosave.isLocalSaved}
isSynced={autosave.isLocalSaved}
saveStatusLabel={saveStatusLabel}
saveStatus={autosave.status}
storage={autosave.storage}

// Status bar — SAME helper output:
<span className="open3d-status-pill open3d-status-pill--muted">
  {saveStatusLabel}
</span>
```

**Forbidden:** calling `formatAutosaveStatus` with a different branch table than TopBar. Thin adapter OK if both call `open3dSaveStatusLabel` with same inputs.

- [ ] **Step 6: Run TopBar + labels tests PASS**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\04-topbar-status-vitest.log
```

- [ ] **Step 7: Commit**

```bash
git add site/features/planner/open3d/editor/TopBar.tsx `
  site/features/planner/open3d/editor/WorkspaceShell.tsx `
  site/features/planner/open3d/editor/OOPlannerWorkspace.tsx `
  site/tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx
git commit -m "feat(p06): TopBar + status-bar single label + open3d-save-status testids"
```

**Done when:** both surfaces share helper; testids present; Ready (local); no bare Saved.

---

### Task 05 — Help / FAQ copy audit (no lies)

**Files:**
- Modify: `site/features/planner/help/helpSections.ts`
- Create: `site/tests/unit/features/planner/help/helpSections.saveHonesty.test.ts`

- [ ] **Step 1: Failing content test**

```typescript
import { describe, expect, it } from "vitest";
import {
  PLANNER_HELP_FAQ_ITEMS,
  PLANNER_HELP_SECTIONS,
} from "@/features/planner/help/helpSections";

describe("helpSections save honesty (P06 W6)", () => {
  it("does not claim account named save slots while open3d is local-only", () => {
    const blob = [
      ...PLANNER_HELP_SECTIONS.map((s) => `${s.title} ${s.summary}`),
      ...PLANNER_HELP_FAQ_ITEMS.map((f) => `${f.question} ${f.answer}`),
    ].join("\n");

    expect(blob.toLowerCase()).not.toContain("named save slots in their account");
    expect(blob.toLowerCase()).not.toMatch(/saved to (your )?account/i);
  });

  it("states browser / local storage for save behaviour", () => {
    const saveFaq = PLANNER_HELP_FAQ_ITEMS.find((f) =>
      /how are plans saved/i.test(f.question),
    );
    expect(saveFaq).toBeDefined();
    expect(saveFaq!.answer.toLowerCase()).toMatch(/browser|local/);
  });
});
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Rewrite help copy**

```typescript
// PLANNER_HELP_SECTIONS saving-and-autosave:
{
  id: "saving-and-autosave",
  title: "Saving and autosave",
  summary:
    "Plans autosave in this browser (local storage). Clearing site data removes them. Account cloud save for the open3d planner is not enabled yet.",
  keywords: ["autosave", "save", "restore", "local", "reload", "browser"],
},

// FAQ:
{
  question: "How are plans saved?",
  answer:
    "Plans autosave in this browser (local storage). Use Save draft / Save for an immediate local write. Clearing site data removes them. Account cloud save for open3d is not enabled yet — sign-in does not currently mean multi-device backup.",
},
```

Also re-check guest-vs-member summary if it over-claims “members save” as cloud — rephrase to local/export honesty if needed:

```typescript
{
  id: "guest-vs-member",
  title: "Guest vs member",
  summary:
    "Guest explores the canvas with local drafts; members unlock more export and workspace tools. Open3d durability today is still browser-local until cloud save ships.",
  keywords: ["guest", "login", "save", "member", "local"],
},
```

- [ ] **Step 4: Grep audit**

```powershell
cd D:\OandO07072026\site
rg -n "Saved|cloud|sync|account|autosave|named save slots" `
  features/planner/open3d/editor `
  features/planner/open3d/persistence `
  features/planner/help/helpSections.ts `
  2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\05-copy-grep.txt
```

Manually fix every over-claim. Acceptable: “local”, “Saved locally”, “cloudEnabled” code identifiers, historical comments that say cloud not wired. Forbidden user-facing: account slots, bare Saved in UI strings, synced to server.

- [ ] **Step 5: Run help unit + pass**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/help/helpSections.saveHonesty.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\05-help-vitest.log
```

- [ ] **Step 6: Commit**

```bash
git add site/features/planner/help/helpSections.ts site/tests/unit/features/planner/help/helpSections.saveHonesty.test.ts
git commit -m "docs(p06): honest browser-local save help and FAQ"
```

**Done when:** grep artifact clean of user-facing lies; unit green.

---

### Task 06 — W5 hard reload: **ids** (not count alone)

**Files:**
- Create: `site/tests/fixtures/open3d/w5-seed-project.json` (or session envelope)
- Modify: `site/tests/e2e/open3d-save-honesty.spec.ts`
- Optional: small devtools export hook if import UI hard for guests

#### 06.A Unit non-regression

- [ ] **Step 1: Re-run continuity**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/saveReloadContinuity.test.ts tests/unit/features/planner/open3d/open3dSession.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\06-unit-continuity.log
```

Expected: PASS.

#### 06.B Seed fixture with known ids

- [ ] **Step 2: Create fixture**

Generate from unit pattern (ids stable):

```json
{
  "version": "open3d-1",
  "engine": "open3d",
  "updatedAt": "2026-07-10T12:00:00.000Z",
  "project": {
    "id": "w5-project-1",
    "name": "W5 save-reload ids",
    "activeFloorId": "w5-floor-1",
    "floors": [
      {
        "id": "w5-floor-1",
        "name": "Floor 1",
        "walls": [
          {
            "id": "w5-wall-1",
            "start": { "x": 0, "y": 0 },
            "end": { "x": 4000, "y": 0 }
          }
        ],
        "furniture": [
          {
            "id": "w5-furn-1",
            "catalogId": "cabinet-v0",
            "position": { "x": 1200, "y": 800 },
            "width": 800,
            "depth": 580,
            "height": 720
          }
        ]
      }
    ]
  }
}
```

**Execute-time:** validate against real `Open3dProject` / wall / furniture types — fill required fields (`thickness`, `rotation`, etc.) by exporting a live project once and editing ids. Do not invent incomplete JSON. Preferred workflow:

1. Temporarily run unit that builds project via `createOpen3dProject` + `addWall` + `addFurniture` with idFactory.
2. `JSON.stringify(buildOpen3dSessionEnvelope(project), null, 2)` → write fixture.

#### 06.C Id channel for E2E

Pick **one** and document in `save-reload/NOTES.md`:

| Option | How |
|--------|-----|
| **A (preferred)** | Import fixture via hidden file input / Playwright `setInputFiles` on import input |
| **B** | After place, Export JSON, parse wall/furniture ids from download |
| **C** | `?plannerDevTools=1` window hook exposing snapshot (only if needed) |

**Preferred implementer path (A):** guest TopBar may hide Import when `accessContext === "guest"` — check live TopBar. Live code: `showPersistenceActions = accessContext !== "guest"` and guest gets Export only. **Import may be member-only.**

If guest cannot import:

1. Use place path + **export JSON** to capture generated ids (Option B), **or**
2. Add devtools-only import/seed hook gated by `plannerDevTools=1` (minimal, tested), **or**
3. Run E2E on member-local path without cloud (still `cloudEnabled=false`) if guest import blocked.

**Do not** use init-script `clearPlannerStorage` for this test.

#### 06.D Playwright spec (full target)

```typescript
/**
 * W5 browser proof — seed known entities → flush save → hard reload → same wall+furniture ids.
 * Evidence: results/planner/world-standard-wave/06-save-honesty/save-reload/
 *
 * Uses one-shot in-page storage clear (not init-script wipe) so page.reload keeps IDB.
 */
import { expect, test } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

import {
  clearPlannerStorageInPage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import { waitForPlannerCanvas } from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "06-save-honesty",
  "save-reload",
);

const FIXTURE = path.join(
  process.cwd(),
  "tests",
  "fixtures",
  "open3d",
  "w5-seed-project.json",
);

const PROJECT_NAME = "W5 save-reload ids";
const WALL_ID = "w5-wall-1";
const FURN_ID = "w5-furn-1";

async function waitRestoreComplete(page: import("@playwright/test").Page): Promise<void> {
  const restore = page.getByTestId("open3d-restore");
  if ((await restore.count()) > 0) {
    await expect(restore).toHaveAttribute("data-restore", "complete", { timeout: 25_000 });
    return;
  }
  // Fallback: topbar visible + short settle
  await expect(page.locator(".pw-topbar")).toBeVisible({ timeout: 25_000 });
  await page.waitForTimeout(500);
}

async function waitForSavedLocally(page: import("@playwright/test").Page): Promise<void> {
  const pill = page.getByTestId("open3d-save-status");
  if ((await pill.count()) > 0) {
    await expect(pill).toHaveAttribute("data-status", "saved", { timeout: 25_000 });
    await expect(pill).toHaveAttribute("data-storage", "local");
    return;
  }
  await expect
    .poll(
      async () => {
        const body = await page.locator("body").innerText();
        if (/Saved locally|Draft saved locally/i.test(body)) return "saved";
        return "pending";
      },
      { timeout: 25_000 },
    )
    .toBe("saved");
}

/** Parse wall + furniture ids from exported open3d project / session JSON text. */
function extractIds(raw: string): { wallIds: string[]; furnitureIds: string[] } {
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const project =
    parsed.version === "open3d-1" && parsed.project
      ? (parsed.project as Record<string, unknown>)
      : parsed;
  const floors = (project.floors as Array<Record<string, unknown>>) ?? [];
  const wallIds: string[] = [];
  const furnitureIds: string[] = [];
  for (const floor of floors) {
    for (const w of (floor.walls as Array<{ id: string }>) ?? []) wallIds.push(w.id);
    for (const f of (floor.furniture as Array<{ id: string }>) ?? []) furnitureIds.push(f.id);
  }
  return { wallIds, furnitureIds };
}

test.describe("W5 save honesty / hard reload ids (browser)", () => {
  test("import/seed, save, hard reload preserves wall + furniture ids", async ({ page }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    await page.goto("/planner/guest/?plannerDevTools=1", {
      waitUntil: "domcontentloaded",
    });
    await clearPlannerStorageInPage(page);

    await enterGuestPlannerWorkspace(page, {
      projectName: PROJECT_NAME,
      preservePlannerState: true,
    });
    await waitForPlannerCanvas(page);
    await waitRestoreComplete(page);

    // --- Seed known ids (implementer: import fixture OR export channel — document in NOTES) ---
    // Example import via hidden file input if available:
    const importInput = page.locator('input[type="file"][accept*="json"]');
    if ((await importInput.count()) > 0 && fs.existsSync(FIXTURE)) {
      await importInput.setInputFiles(FIXTURE);
      await expect
        .poll(async () => page.locator("body").innerText(), { timeout: 15_000 })
        .toMatch(/Imported|furniture|Wall/i);
    } else {
      // Fallback: place path + capture ids via export — implementer must not leave this as count-only.
      throw new Error(
        "P06 W5 requires id seed channel: enable guest import, use export parse, or plannerDevTools seed hook",
      );
    }

    await page.screenshot({ path: path.join(EVIDENCE, "01-before-save.png") });

    await page.getByRole("button", { name: /Save draft|Save/i }).first().click();
    await waitForSavedLocally(page);
    await page.screenshot({ path: path.join(EVIDENCE, "02-saved-local.png") });

    // Capture ids before reload (export preferred).
    // If export menu: open Export → JSON and intercept download.
    // For fixture import path, known constants:
    const beforeWall = WALL_ID;
    const beforeFurn = FURN_ID;

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".pw-topbar")).toBeVisible({ timeout: 25_000 });
    await waitForPlannerCanvas(page);
    await waitRestoreComplete(page);

    // Assert ids — re-export or evaluate IDB / test hook.
    // Minimal evaluate if export hard: read from window hook when provided.
    // Preferred: export again and parse.
    // Example with re-import not needed if export available:
    // For implementer completing Option B/C — replace with real extraction.
    const body = await page.locator("body").innerText();
    // Soft: UI may not show ids; use export channel:
    // const idsAfter = await exportAndExtract(page);
    // expect(idsAfter.wallIds).toContain(beforeWall);
    // expect(idsAfter.furnitureIds).toContain(beforeFurn);

    // HARD REQUIREMENT — implementer must replace placeholder with real extraction.
    // Placeholder that forces failure until channel wired:
    const idsAfter = await page.evaluate(async () => {
      // Prefer official export path. Optional devtools hook:
      // return (window as unknown as { __open3dExportSnapshot?: () => string }).__open3dExportSnapshot?.();
      return null as string | null;
    });

    if (!idsAfter) {
      // If fixture seed + status bar shows furniture count, still insufficient alone.
      // Wire export: click Export → JSON with download listener.
      const downloadPromise = page.waitForEvent("download", { timeout: 15_000 }).catch(() => null);
      await page.getByRole("button", { name: /Export/i }).first().click();
      await page.getByRole("menuitem", { name: /JSON/i }).first().click();
      const download = await downloadPromise;
      expect(download, "export JSON download for id assert").not.toBeNull();
      const dlPath = path.join(EVIDENCE, "after-reload-export.json");
      await download!.saveAs(dlPath);
      const raw = fs.readFileSync(dlPath, "utf8");
      const { wallIds, furnitureIds } = extractIds(raw);
      expect(wallIds).toContain(beforeWall);
      expect(furnitureIds).toContain(beforeFurn);
    } else {
      const { wallIds, furnitureIds } = extractIds(idsAfter);
      expect(wallIds).toContain(beforeWall);
      expect(furnitureIds).toContain(beforeFurn);
    }

    // body unused except future copy checks
    void body;

    await page.screenshot({ path: path.join(EVIDENCE, "03-after-hard-reload.png") });
  });
});
```

**Execute agent:** flesh download/export selectors to match live TopBar guest menu (`Export as JSON`). Ensure fixture schema matches `importOpen3dProjectJson` requirements by generating from code.

- [ ] **Step 3: Keep secondary smoke (optional)** — furniture count test can remain as second test in file; primary green for CP-06.3 is **ids**.

- [ ] **Step 4: Run Playwright**

```powershell
cd D:\OandO07072026\site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\06-save-honesty\save-reload | Out-Null
npx playwright test tests/e2e/open3d-save-honesty.spec.ts --reporter=line 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\save-reload\06-playwright-raw.log
```

Expected: PASS; PNGs exist; ids asserted.

- [ ] **Step 5: Write `save-reload/06-browser-run.json`**

```json
{
  "schemaVersion": 1,
  "phase": "P06-save-honesty",
  "gate": "W5",
  "route": "/planner/guest/?plannerDevTools=1",
  "browser": "chromium",
  "cloudEnabled": false,
  "wallId": "w5-wall-1",
  "furnitureId": "w5-furn-1",
  "idChannel": "import-fixture + export-after-reload",
  "exitCode": 0,
  "timestamp": "<ISO>"
}
```

- [ ] **Step 6: Commit**

```bash
git add site/tests/e2e/open3d-save-honesty.spec.ts site/tests/fixtures/open3d/w5-seed-project.json
git commit -m "test(p06): W5 hard reload asserts wall and furniture entity ids"
```

**Done when:** hard reload preserves wall + furniture **ids** with artifact proof in **`save-reload/`**. Count-only alone is **not** enough for CP-06.3.

**Fallback if Playwright env blocked:** chrome-devtools MCP scripted session with same steps; still require screenshots + `06-browser-run.json`. W5 stays **yellow** until Playwright lands — do not mark CP-06 green on unit-only.

---

### Task 07 — Cloud wire (optional; default CANCEL)

**Default decision:** **Cancelled** — owner chose local-only honesty (Approach A residual).

- [ ] **Step 1: Write cancel note**

Append to `results/planner/world-standard-wave/06-save-honesty/NOTES.md`:

```markdown
## Task 07 cloud wire

- Status: **CANCELLED**
- Reason: owner / plan default local-only honesty for Approach A residual close
- cloudEnabled remains false
- open3d autosave does not call memberPlanRepository
```

- [ ] **Step 2: If owner unlocks mid-phase** (only then)

1. After successful local `flushPersist`, call `createMemberPlanRepository(...).save(...)`.
2. Labels: local saved → “Saving to account…” → “Saved to account” **or** dual “Saved locally · Account save failed”.
3. Never roll back local success on cloud fail.
4. Unit tests with mocked fetch; no secrets in evidence.
5. Commit: `feat(p06): optional open3d cloud save wire`

**Done when:** either cancel NOTES written **or** dual-status cloud tests green.

---

### Task 08 — Evidence pack + CP-06 hard stop

- [ ] **Step 1: Ensure artifacts exist**

| Artifact | Purpose |
|----------|---------|
| `06-save-honesty/00-baseline-run.json` + log | Baseline |
| `06-save-honesty/01-autosave-flush-vitest.log` (+ run.json) | Flush |
| `06-save-honesty/02-labels-vitest.log` | W6 pure |
| `06-save-honesty/03-hook-vitest.log` | projectRef / leave |
| `06-save-honesty/04-topbar-status-vitest.log` | Dual surfaces |
| `06-save-honesty/05-copy-grep.txt` + help log | No-lie audit |
| `06-save-honesty/save-reload/06-playwright-raw.log` | **W5** |
| `save-reload/01-before-save.png` … `03-after-hard-reload.png` | Visual W5 |
| `save-reload/06-browser-run.json` | ids + exitCode |
| `06-save-honesty/NOTES.md` | HEAD, cloudEnabled, id channel |

- [ ] **Step 2: Typecheck touched packages**

```powershell
cd D:\OandO07072026\site
pnpm exec tsc --noEmit -p tsconfig.json 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\08-tsc.log
```

Expected: clean for touched files; no new `any`.

- [ ] **Step 3: Complete CP-06 checkboxes with paths** (below) in NOTES or phase evidence.

- [ ] **Step 4: Final unit pack**

```powershell
cd D:\OandO07072026\site
npx vitest run `
  tests/unit/planner-autosave.test.ts `
  tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts `
  tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  tests/unit/features/planner/open3d/open3dSession.test.ts `
  tests/unit/features/planner/help/helpSections.saveHonesty.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\08-unit-pack.log
```

- [ ] **Step 5: Commit evidence pointers if allowed; product code already committed per task**

```bash
git commit -m "chore(p06): W5–W6 evidence pack notes" --allow-empty
```

Only if needed; prefer real NOTES files if not gitignored.

- [ ] **Step 6: Push when right** — origin when landable green; mayoite if ~45m / big land (AGENTS). Log fail if cannot access.

**Done when:** CP-06 all boxes evidence-backed; no vibe green.

---

## 7. Test matrix

| Layer | What | Pass criterion | Command |
|-------|------|----------------|---------|
| Unit | AutoSaver flush / cancel / debounce + pending | Immediate flush writes; cancel drops; timer writes; last pending wins | `vitest run tests/unit/planner-autosave.test.ts` |
| Unit | Shared label helper | Every status × guest; bare Saved forbidden; Local save failed | `…/workspaceStatusLabels.test.ts` |
| Unit | Hook projectRef / flushPersist | Latest envelope scheduled; storage/cloudEnabled defaults | `…/useOpen3dWorkspaceAutosave.test.tsx` |
| Unit | Envelope continuity | Existing saveReloadContinuity still green | `…/saveReloadContinuity.test.ts` |
| Unit | Help | No account slots claim | `…/helpSections.saveHonesty.test.ts` |
| Component | TopBar testids + local wording | `data-storage=local`; Ready (local) | `…/TopBar.saveStatus.test.tsx` |
| E2E | Hard reload ids | Same wall + furniture ids after reload | `playwright test open3d-save-honesty.spec.ts` |
| Copy | Grep | No account/cloud lie while cloudEnabled=false | `05-copy-grep.txt` |

Non-regression (optional after landable slices):

```powershell
cd D:\OandO07072026\site
pnpm p0:unit
```

**Rules:** zero suppression; no filtered “PASS only” logs; artifacts only under root `results/`.

---

## 8. False-green catalog

| Trap | Why it looks green | How this plan blocks it |
|------|--------------------|-------------------------|
| Unit JSON round-trip only | Continuity unit passes | CP-06.3 requires browser hard reload |
| Furniture **count** only | Place 4 → still 4 after reload | Assert **entity ids** |
| Body text “Saved locally” without IDB | React state optimistic | Status only after `onSaved` from saver; flush tests mock writes |
| Init-script storage clear | Clean start but reload wipes IDB | Use `clearPlannerStorageInPage` only |
| Scoreboard PASS, no `results/` | Docs claim green | Re-prove artifacts this checkout |
| TopBar fixed, help still lies | Partial W6 | Task 05 + grep |
| Status bar fixed, TopBar dual table drifts | Two copy tables | Single `open3dSaveStatusLabel` |
| Leave bare `saver.flush()` | Listeners exist | Must call `flushPersist` rebuild |
| Debounce 5s wait as “save” | Timer eventually fires | Explicit Save flush + leave flush |
| Member logged-in = cloud | Psychological trap | Labels + help local-only |
| `isSynced` prop name | Sounds like server | JSDoc + isLocalSaved + data-storage |
| Cloud half-wire | “Saved to account” without API | Task 07 cancelled |
| Restore race seed | Counts match wrong room | restoreSettled + E2E wait |
| Dead double-gate reintroduced | Empty if becomes `return` | Removed + unit proves timer write |
| Paper CP checkboxes | Checked without paths | Task 08 requires file paths |

---

## 9. Stop-if-fail / CP-06 criteria

**Stop and do not claim W5–W6 until every box is evidence-backed.**

- [ ] **CP-06.1 Flush exists:** `createAutoSaver().flush` + pending-snapshot retention + **write-mock unit log** at `results/planner/world-standard-wave/06-save-honesty/01-…`
- [ ] **CP-06.2 Leave path:** open3d workspace flushes via **`flushPersist`** (latest projectRef) on Save, `pagehide`/`visibilitychange`, and unmount without dropping dirty debounce
- [ ] **CP-06.3 W5 browser:** hard reload preserves **same wall id + furniture id**; PNGs + run.json under `06-save-honesty/save-reload/`
- [ ] **CP-06.4 W6 copy:** **TopBar + status-bar labels + help + save toasts** never imply cloud/account when only local IDB saved; grep artifact clean; **no bare “Saved”**
- [ ] **CP-06.5 Selectors:** `data-testid="open3d-save-status"` + `data-storage` + `data-status` stable for later P07 journey
- [ ] **CP-06.6 Types:** no new `any`; typecheck clean for touched packages
- [ ] **CP-06.7 Commits:** landable slices committed on main checkout (no worktree)
- [ ] **CP-06.8 Cloud:** Task 07 cancelled with local-only NOTES, or cloud wire + dual-status tests green
- [ ] **CP-06.9 Dual surfaces:** shared pure helper drives both TopBar and status bar; Shell does not claim server sync

**Unlock next:** P07 draw/place browser journey may rely on this flush + status pill; do not start P07 save assertions until CP-06.3 is green.

---

## 10. Commit sequence

| Order | Message | Scope |
|-------|---------|--------|
| 1 | `test(p06): AutoSaver flush write proofs + remove dead debounce gate` | Task 01 |
| 2 | `feat(p06): open3dSaveStatusLabel single source for local/cloud honesty` | Task 02 |
| 3 | `feat(p06): projectRef flushPersist on leave + restoreSettled gate` | Task 03 |
| 4 | `feat(p06): TopBar + status-bar single label + open3d-save-status testids` | Task 04 |
| 5 | `docs(p06): honest browser-local save help and FAQ` | Task 05 |
| 6 | `test(p06): W5 hard reload asserts wall and furniture entity ids` | Task 06 |
| 7 | (optional) `feat(p06): optional open3d cloud save wire` | Task 07 if unlocked |
| 8 | `chore(p06): W5–W6 evidence pack notes` | Task 08 if needed |

Push origin when slice green enough not to strand remote; mayoite ~45m / big land.

---

## 11. Risks & owner decisions

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Guest cannot import JSON | Medium | Blocks id seed | Export channel, member path, or plannerDevTools seed hook |
| Playwright flaky place tools | Medium | False red | Prefer import fixture; P07 owns full draw |
| Effect remount loops from flushPersist deps | Medium | Listener thrash / double flush | flushPersistRef stabilization |
| Restore gate delays first autosave | Low | OK | Explicit Save still works after settle |
| Fixture schema drift | Medium | Import fails | Generate fixture from code |
| Fake timers + IDB race in units | Low | Flaky unit | Inject deps; no real IDB in unit |
| Owner expects cloud this phase | Low | Scope explosion | Require explicit unlock; else cancel Task 07 |
| Results gitignored | Low | Evidence not in remote | Keep local; document paths; P10 pack |
| Competing agents touch same package | Medium | Merge conflict | One writer on planner persistence/editor |

**Owner decisions locked by this plan:**

1. Cloud default **off** (Task 07 cancel).
2. W5 = **ids**, not count.
3. Brainstormer path = **Idiots only**.
4. Approach = **A residual**.

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Residual / path from §1 | Task |
|-------------------------|------|
| Weak autosave write tests | 01 |
| Dead double-gate | 01 |
| Label single source + Local save failed | 02 |
| projectRef + leave flushPersist | 03 |
| restoreSettled | 03 |
| Success toast | 03 |
| TopBar testids + Ready (local) | 04 |
| Dual surface same helper | 04 |
| Help account lie | 05 |
| Grep copy audit | 05 |
| W5 id E2E + evidence | 06 |
| Cloud cancel | 07 |
| CP-06 pack | 08 |
| Missing results/ | 00 + 08 |

### 12.2 Brainstormer coverage (`Idiots/…/REPORT.md`)

| Report section | Plan coverage |
|----------------|---------------|
| §0 executive residual table | §1.1–1.2 |
| §2 buyer journey / same ids | Goal + §2.1–2.2 + Task 06 |
| §4 flush API / leave bare flush bug | Task 01 + 03 |
| §5 debounce / dead gate | Task 01 |
| §6 leave algorithm | Task 03 |
| §7 dual labels / testids / bare Saved | Task 02 + 04 |
| §8 hard reload identity | Task 06 |
| §9 local vs cloud policy | Task 07 cancel + labels |
| §10 hydration race | restoreSettled + E2E wait |
| §11 guest IDB / clear helpers | Task 06 storage hygiene |
| §12 competitive patterns | §2.3 ethics |
| §14 raised L3/H4/E4 | Done when + ship bars |
| §15 Approach A | Architecture + tasks |
| §17 test matrix | §7 |
| §18 residual checklist | Task list 00–08 |

### 12.3 Placeholder scan

No TBD left without a concrete resolution path. Fixture field completeness is **generate-from-code** (not invent). Export selectors verified at execute against live TopBar.

### 12.4 Length honesty

Plan is long because residual correctness (leave flush, id channel, dual labels, help, evidence) is multi-file and false-green traps are numerous. Short plan would re-ship incomplete L2 count smoke and miss help lie.

---

## 13. Appendices

### Appendix A — Forbidden user-facing strings (cloudEnabled=false)

```
Saved
Synced
Synced to server
Saved to account
Saved to cloud
Cloud OK
members keep named save slots in their account
```

Allowed:

```
Saved locally
Draft saved locally
Saving locally…
Local save failed
Ready (local)
Guest session (local)
Unsaved changes
Unsaved draft
Plan saved locally
Draft saved locally
Saving plan locally…
Saving draft locally…
```

### Appendix B — Selector table

| Selector | Where | Values |
|----------|-------|--------|
| `data-testid="open3d-save-status"` | TopBar primary pill | present |
| `data-status` | same | `idle\|unsaved\|saving\|saved\|error` |
| `data-storage` | same | `local\|cloud` |
| `role="status"` | same | a11y |
| `aria-live="polite"` | same | a11y |
| `data-testid="open3d-restore"` | workspace (optional) | |
| `data-restore` | same | `pending\|complete` |
| `.pw-topbar` | shell | ready signal |
| `data-testid="planner-2d-canvas"` | FeasibilityCanvas | canvas ready |

### Appendix C — IDB facts

| Item | Value |
|------|-------|
| DB | `planner-workspace-db` |
| Legacy | `buddy-planner-db` |
| Stores | `projects`, `history` |
| History cap | 10 |
| Debounce | 5000 ms |
| Guest project id | `planner-guest-local` |

### Appendix D — Research translation (ideas → O&O)

| Idea | O&O action |
|------|------------|
| Dual Local/Cloud chips | Local-only labels now; dual when Task 07 |
| Flush on hide | pagehide + visibility → flushPersist |
| Explicit Save | Flush not schedule-only |
| Never green on React alone | onSaved from IDB |
| IKEA manual-only | Reject as primary |
| P5D multi-device | Out of scope; do not claim |
| Figma continuous save | Aspiration only |

### Appendix E — Handover lines (next agent)

```
P06 save honesty residual — implement Tasks 00→08 in order (idiotplanners2 plan).
Approach A: local-first; cloudEnabled=false; Task 07 CANCELLED unless owner unlocks.
Do NOT redo flush skeleton; fix projectRef + leave flushPersist + help + id W5 + evidence.
Brainstormer was Idiots/P06-save-honesty/REPORT.md only (not Idiots2).
One pure label helper; no bare “Saved”; Shell not server-synced.
W5 = hard reload wall+furniture IDS under results/.../06-save-honesty/save-reload/
Guest: /planner/guest/?plannerDevTools=1; one-shot clearPlannerStorageInPage; wait restore.
CP-06 hard stop before W5–W6 green claim.
Superpowers + TDD; no worktrees; commit slices; push when right; mayoite ~45m.
```

### Appendix F — Kill order context

```
CP-00 → CP-01 → CP-02 → CP-03 W3 → CP-07 journey → CP-06 save
then parallel orbit · symbols · mesh · shortcuts
```

Save honesty is table stakes for Friday→Monday. Do not let mesh/chrome steal slots from residual CP-06 evidence.

### Appendix G — Types catalog used in plan

```typescript
export type Open3dSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";
export type Open3dPersistStorage = "local" | "cloud";

export type AutoSaverDeps = {
  saveProject?: (project: PlannerProject) => Promise<void | PlannerProject>;
  loadProject?: (id: string) => Promise<PlannerProject | undefined>;
  saveHistoryEntry?: (entry: HistoryEntry) => Promise<void | HistoryEntry>;
};

export function open3dSaveStatusLabel(input: {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
}): string;

// Hook return (residual)
{
  status: Open3dSaveStatus;
  lastSavedAt: string | null;
  restoreSnapshot: () => Promise<Open3dProject | null>;
  schedulePersist: () => void;
  flushPersist: () => Promise<void>;
  exportSnapshot: () => string;
  storage: Open3dPersistStorage; // "local"
  cloudEnabled: boolean; // false
  isLocalSaved: boolean;
  isSynced: boolean; // deprecated alias of isLocalSaved
  isModified: boolean;
}
```

### Appendix H — Definition of done (phase)

| Gate | Definition |
|------|------------|
| **W5** | User/Playwright seeds plan → flush → hard reload → walls + furniture **ids** match; proof in **`save-reload/`** |
| **W6** | Open3d TopBar + status bar + help + toasts state **local browser** truthfully; default local-only; **no bare “Saved”**; H4 selectors |
| **Evidence** | Shared pack under `06-save-honesty/` + W5 under `save-reload/` on **this** machine |
| **Honesty** | No status string a facilities buyer would misread as cloud backup if only IDB ran |

---

## Execution handoff

**Plan complete and saved to `plans2/P06-save-honesty/IMPLEMENTATION-PLAN.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**
