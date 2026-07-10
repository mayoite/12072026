# P06 — Save honesty (W5–W6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).
>
> **Process:** `/using-superpowers` + test-driven-development + verification-before-completion + systematic-debugging when restore/flush flakes.
>
> **Checkout:** `.` only · **no worktrees** · commit each landable slice · push origin when green enough; mayoite ~45m / big land per AGENTS.md.

**Goal:** A facilities buyer can edit a plan, leave or hard-reload, get **the same walls + furniture entity ids** back, and every visible status/help/toast string tells the truth about **browser local storage** vs **account/cloud storage**.

**Architecture:** Open3d document model (UUID entities) → `useOpen3dWorkspaceAutosave` → IndexedDB (`planner-workspace-db` via `createAutoSaver` / `saveProject`) → restore on mount via `loadProject` + `parseOpen3dSessionSnapshot` (`open3d-1` envelope). Dual status chrome (TopBar pill + status-bar pill) share **one pure label helper**. Default `cloudEnabled=false` (local-only honesty). Explicit Save and leave paths call **immediate flush**, not hope-and-debounce alone. Cloud wire is optional Task 07 (default cancel).

**Tech Stack:** Next.js site · React client hooks · IndexedDB · Vitest · Playwright · evidence under `results/planner/world-standard-wave/06-save-honesty/` (+ `save-reload/` for W5).

**Inputs consumed:**
- Repo read: 2026-07-10 — dirty tree honesty (re-verify HEAD at execute); key paths in § Repo reality
- Brainstormer: `Idiots2/P06-save-honesty/REPORT.md` **only** (never `Idiots/`)
- Phase plan: `Plans/phases/P06-save-honesty/P06-save-honesty.md` + `P06-suggestions.md` + `01-react-open3d.md`
- Spec: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (W5, W6)
- Research maps: `Plans/Research/RESULTS-MAP.md`, `RESEARCH-MAP.md`

**Done when:**
1. **W5:** Seed → flush → hard reload → **same wall id(s) + furniture id(s)** with artifacts under `results/planner/world-standard-wave/06-save-honesty/save-reload/`
2. **W6:** TopBar + status bar + help + toasts never imply cloud/account when only IDB ran; **no bare “Saved”**; selectors `data-testid="open3d-save-status"` + `data-storage` + `data-status` stable
3. **CP-06** checkboxes all evidence-backed (paths, not vibes)
4. Task 07 cancelled with NOTES (local-only) **or** dual-status cloud wire green

**Evidence folder:** `results/planner/world-standard-wave/06-save-honesty/` (create on execute; **re-prove if missing** — this checkout had **no** `results/planner/world-standard-wave` at plan time)

**Canonical plan path:** `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md`

---

## 1. Repo reality (live 2026-07-10 — wins over stale plan prose)

### 1.1 What already landed (do not re-implement from zero)

| Area | Live path | Observation |
|------|-----------|-------------|
| AutoSaver `flush` + `pendingSnapshot` | `site/features/planner/persistence/persistence.ts` | Present; debounce 5000 ms |
| pagehide / visibility hidden flush | `useOpen3dWorkspaceAutosave.ts` | Registered on saver |
| Unmount flush-before-cancel | same hook cleanup | `flush()?.finally(() => cancel())` |
| `flushPersist` | same hook | Present; **builds envelope from render `project` closure**, not projectRef |
| Save button | `OOPlannerWorkspace.tsx` `handleSave` | Calls `flushPersist()`; toast “Saving draft/plan **locally**…” |
| Status labels (pure) | `workspaceStatusLabels.ts` `formatAutosaveStatus` | Guest/member local wording unit-tested (“Saved locally”, “Draft saved locally”, etc.) |
| TopBar text | `TopBar.tsx` | Shows “Saved locally” when `isSynced && !isModified` — **not** bare “Saved” for that branch |
| E2E smoke | `site/tests/e2e/open3d-save-honesty.spec.ts` | Guest place 4 seats → Save draft → hard reload → furniture **count** (not ids) |
| Continuity unit | `saveReloadContinuity.test.ts` | Envelope JSON round-trip with known wall/furniture ids |
| Guest helpers | `tests/e2e/guestProjectSetup.ts` | `clearPlannerStorageInPage` (one-shot; reload-safe) vs `clearPlannerStorage` (init-script wipe — **wrong** for W5 reload) |
| Shell JSDoc | `WorkspaceShell.tsx` | `isSynced` documented as “latest snapshot is persisted **(local IDB until cloud is wired)**” — improved vs older “server” lie |
| Fabric pattern | `PlannerSaveIndicator.tsx` | Dual local+sync labels — **not mounted** on open3d; ideas only |

### 1.2 Residual debt (this plan’s real work)

| Residual | Why CP-06 still red |
|----------|---------------------|
| **Help over-claims** | `helpSections.ts` summary + FAQ: “members keep named save slots in their account” while open3d autosave is IDB-only |
| **No stable save testids** | TopBar pill lacks `data-testid="open3d-save-status"`, `data-storage`, `data-status` |
| **`isSynced` naming / `data-synced`** | Still UI prop language; prefer `isLocalSaved` + `data-storage`/`data-status` |
| **No `projectRef` on hook** | `schedulePersist` / `flushPersist` close over render `project`; leave flush of **pending** snapshot is OK, but extreme thrash can flush stale envelope from explicit flushPersist |
| **Weak autosave unit asserts** | `planner-autosave.test.ts` checks shape/flush-idle; does **not** mock `saveProject` for write proof / cancel no-write / schedule-then-flush |
| **W5 asserts count not UUIDs** | Gate language is **ids**; count is interim smoke only |
| **No evidence pack on disk** | `results/planner/world-standard-wave/` **absent** — cannot claim green |
| **`cloudEnabled` / `storage` not exported** | Hook surface incomplete vs label contract |
| **Idle label inconsistency** | TopBar “Ready” vs status “Ready (local)” / “Guest session (local)” |
| **Success toast incomplete** | handleSave sets saving message; no guaranteed “Plan/Draft saved locally” after onSaved |
| **formatAutosaveStatus API** | Two-arg only; plan contract wanted storage/cloudEnabled single helper both surfaces call |
| **Double-gate remnant** | Timer path still has `now - lastSaved < DEBOUNCE` condition (partially neutered) — must unit-prove no silent drop |
| **Restore race** | `hydrated` forced true; restore async; E2E must wait restore-complete; optional schedule gate |
| **Task 07** | Cloud unwired — cancel with NOTES unless owner unlocks |

### 1.3 Contradictions: phase plan prose vs code

Older expert notes / suggestions (2026-07-09) claimed: no flush, bare TopBar “Saved”, Save=schedule only, Shell “synced to server”. **Repo wins (2026-07-10):** flush/pending, TopBar “Saved locally”, handleSave→flushPersist, Shell JSDoc already local-IDB. **Do not thrash redoing landed work.** Execute residual rows in §1.2.

### 1.4 Missing evidence honesty

- Historical unit continuity may exist under other names (`results/planner/save-reload-continuity/` cited in maps) — **not** sufficient for W5 alone.
- `Plans/Research/Others/00-PENDING.md` may say GATE PASS on another machine — **this workspace must re-prove** under `06-save-honesty/` + `save-reload/`.

### 1.5 Gates (spec authority)

| ID | Gate | Proof |
|----|------|--------|
| **W5** | Save → hard reload → same walls + furniture **ids** | Playwright (flush or autosave wait) + artifacts in `save-reload/` |
| **W6** | Status text does not lie — local vs cloud; cloud wire **or** honest local-only | Code + copy + unit/grep + dual surfaces |

North star: **save and return the next day** without developer rescue.

### 1.6 Project id facts (must not drift)

| Mode | ID |
|------|-----|
| Guest | `planner-guest-local` (`GUEST_PROJECT_ID`) |
| Member no planId | `planner-member-local` |
| Member with planId | `planner-member-local:{planId}` |

Restore after reload **must** use the same id. Guest→member migrate must not clobber non-empty member snapshot.

---

## 2. Brainstormer synthesis (`Idiots2/P06-save-honesty/REPORT.md`)

### 2.1 Buyer journey / JTBD

> Facilities buyer edits a plan, leaves or hard-reloads, gets **same walls and furniture entity ids**, and every status string names **browser local** vs **account/cloud** truthfully.

### 2.2 Competitive JTBD (ideas only — no copy)

| Pattern | Source idea | O&O original response |
|---------|-------------|------------------------|
| Cloud as system of record | P5D / RoomSketcher / Floorplanner | **Later**; do not claim now |
| Explicit Save + autosave | Floorplanner | Keep Save as **immediate flush**; keep debounced local autosave |
| Manual-save-only primary | IKEA anti-pattern | **Reject** as primary durability model |
| Dual Local vs Synced chips | Industry honesty | Ship dual chrome **when** cloud wired; until then always qualify “locally” |
| Local backup download | Floorplanner FML idea | Guest/member JSON export as escape hatch |
| Multiplayer / presence | P5D / Figma | **Out of P06** — never fake |
| Continuous durability latency | Figma ref only | Flush on leave/Save; do not rely on 5s alone |

### 2.3 Approaches (decision)

| Approach | Verdict |
|----------|---------|
| **A — Local-first honesty complete** | **Chosen** — finish flush correctness, dual labels, help rewrite, id-level W5, evidence; `cloudEnabled=false` |
| **B — Local + cloud same phase** | Only if owner unlocks Task 07 |
| **C — Status theater only** | **Reject** — strings without flush/id proof |

### 2.4 Raised bar beyond process PASS

1. W5 = **UUID equality**, not furniture count alone  
2. Help + FAQ rewrite (currently red)  
3. Evidence on **this** machine under canonical folders  
4. One pure label table for both surfaces + testids  
5. Unit-proven flush/write semantics with mocked `saveProject`

### 2.5 Failure modes → plan coverage

| Failure | Plan response |
|---------|---------------|
| Debounce drop on leave | Flush on pagehide/visibility/unmount; unit order |
| Stale project on flush | projectRef always latest |
| Restore races default room | Wait restore-complete; optional schedule gate |
| Count-only W5 false green | Raise E2E to ids via export/IDB channel |
| Help claims account slots | Task help rewrite + grep |
| Bare Saved / cloud lie | Label helper + forbidden list tests |
| Evidence missing | Task 00 create dirs; CP-06 path checks |
| Playwright wipes IDB on reload | one-shot `clearPlannerStorageInPage` only |
| Cloud half-wire | Task 07 cancel default |

### 2.6 Open questions resolved in this plan

| Question | Resolution |
|----------|------------|
| Cloud in P06? | **No** default; Task 07 cancelled with NOTES unless owner unlocks mid-execute |
| Count vs ids for W5? | **Ids required** for CP-06.3; count may remain as secondary smoke |
| Which surface owns labels? | One pure helper; TopBar + status bar both call it |
| Import vs place for seed? | Prefer **import JSON with known UUIDs** for id assert; configurator place OK for smoke |
| Idiots/ report? | **Never** — Idiots2 only per owner |

---

## 3. Ethics / non-copy

- Research under `D:\websites` and Firecrawl history = **ideas / JTBD only**.
- **No** competitor chrome, icons, colors, brands, copy, JS, or project formats.
- Fabric `PlannerSaveIndicator` = pattern inventory only; do not mount fabric TopBar into open3d.
- Licenses: MIT/open preferred; paid only from cleared table (`ayushdocs/17-LICENSES-CLEARED.md`) — no new paid seats without owner.
- No secrets in git; keys stay `.env.local`.

---

## 4. File map

### 4.1 Modify (expected)

| Path | Change |
|------|--------|
| `site/features/planner/persistence/persistence.ts` | Harden double-gate; keep flush/pending; optional `dispose`; export debounce ms for tests if needed |
| `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | `projectRef`; `flushPersist`/`schedulePersist` from ref; export `storage`, `cloudEnabled`, `isLocalSaved`; deprecate `isSynced` alias |
| `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | Evolve to full contract (`open3dSaveStatusLabel` **or** extend `formatAutosaveStatus` with storage/cloud/guest); single table |
| `site/features/planner/open3d/editor/TopBar.tsx` | Shared label; testids; `isLocalSaved` or `saveStatusLabel`; Ready (local) parity; aria-live |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | Pass-through honest props; no server-sync language |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Wire labels/props; success toast after save; status pill uses same helper; optional restore-settled gate |
| `site/features/planner/help/helpSections.ts` | Honest local-only save copy + FAQ |
| `site/tests/unit/planner-autosave.test.ts` | Mock `saveProject`; flush/cancel/schedule proof |
| `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts` | Full table + forbidden bare Saved |
| `site/tests/e2e/open3d-save-honesty.spec.ts` | Id equality; wait testids; evidence paths |

### 4.2 Create (as needed)

| Path | Why |
|------|-----|
| `site/tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx` | Hook projectRef + flushPersist if no existing file |
| `site/tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx` | Render both surfaces local wording (or extend existing TopBar tests) |
| `site/tests/fixtures/open3d/w5-seed-project.json` | Known wall + furniture UUIDs for import seed |
| Evidence dirs under `results/planner/world-standard-wave/06-save-honesty/` | CP-06 artifacts |

### 4.3 Do not treat as live open3d primary

- `site/features/planner/_archive/fabric/**`
- `PlannerSaveIndicator.tsx` (mount path for fabric only)
- Cloud repos as open3d autosave path until Task 07 unlocked

### 4.4 Evidence layout (RESULTS-MAP)

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
  save-reload/
    01-before-save.png
    02-saved-local.png
    03-after-hard-reload.png
    06-playwright-raw.log
    06-browser-run.json
    NOTES.md   (optional)
```

---

## 5. Architecture & data flow

### 5.1 Persist path

```
User edit (project.updatedAt changes)
  → useOpen3dWorkspaceAutosave schedulePersist
      → buildOpen3dSessionEnvelope(projectRef.current)
      → createAutoSaver.scheduleSave(JSON)
          → pendingSnapshot = snapshot
          → debounce 5000ms → saveProject + history (IDB)
  → status: unsaved → saving → saved | error
  → formatAutosaveStatus / open3dSaveStatusLabel → TopBar + status bar
```

### 5.2 Flush path (W5 enabler)

```
Save click | pagehide | visibility hidden | unmount
  → flushPersist()
      → envelope from projectRef.current (or saver pending)
      → createAutoSaver.flush()
          → clear timer; persist pending immediately
  → status saved after onSaved ack only
```

### 5.3 Restore path

```
Mount workspace
  → restoreSnapshot()
      → loadProject(projectId)
      → parseOpen3dSessionSnapshot(snapshot)
      → replaceProject(restored)
  → E2E waits restore-complete before seed
```

### 5.4 Label contract (local-only default)

| status | guest | member (local) |
|--------|-------|----------------|
| idle | Guest session (local) | Ready (local) |
| unsaved | Unsaved draft | Unsaved changes |
| saving | Saving locally… | Saving locally… |
| saved | Draft saved locally | Saved locally |
| error | Local save failed | Local save failed |

**Forbidden (cloudEnabled=false):** bare `Saved`, `Synced`, `Synced to server`, `Saved to cloud`, `Saved to account`, `Cloud OK`, help “named save slots in their account”.

### 5.5 Toast contract

| Event | Guest | Member |
|-------|-------|--------|
| Save click | Saving draft locally… | Saving plan locally… |
| Success | Draft saved locally | Plan saved locally |
| Failure | Local save failed | Local save failed |

---

## 6. Task list

### Task 00 — Setup / baseline (no product claim)

**Files:**
- Create: `results/planner/world-standard-wave/06-save-honesty/` and `…/save-reload/`
- Create: `…/06-save-honesty/NOTES.md`, `00-baseline-run.json`

- [ ] **Step 1: Create evidence directories**

```powershell
cd .
New-Item -ItemType Directory -Force -Path results\planner\world-standard-wave\06-save-honesty\save-reload | Out-Null
```

Expected: directories exist.

- [ ] **Step 2: Record HEAD honesty in NOTES.md**

```powershell
cd .
git rev-parse HEAD
git status -sb
```

Write `results/planner/world-standard-wave/06-save-honesty/NOTES.md`:

```markdown
# P06 evidence notes

- Date: <ISO>
- HEAD: <sha or dirty>
- cloudEnabled: false (default)
- Approach: A local-first honesty
- Brainstormer: Idiots2/P06-save-honesty/REPORT.md
- Plan: plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md
```

- [ ] **Step 3: Run baseline vitest suite (continuity + autosave + labels)**

```powershell
cd site
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
  "timestamp": "<ISO>",
  "notes": "Unit continuity is not W5 browser green"
}
```

- [ ] **Step 5: Commit evidence scaffold only if policy allows docs/results commits; otherwise keep local until first code slice**

```bash
git add results/planner/world-standard-wave/06-save-honesty
git commit -m "chore(p06): evidence scaffold + baseline notes for W5–W6"
```

**Done when:** dirs + baseline log + NOTES exist; agent knows unit ≠ browser W5.

---

### Task 01 — TDD: AutoSaver flush + write proof + no silent drop

**Files:**
- Modify: `site/tests/unit/planner-autosave.test.ts`
- Modify: `site/features/planner/persistence/persistence.ts` (only if tests fail for real bugs)
- Evidence: `01-autosave-flush-vitest.log`

- [ ] **Step 1: Write failing tests that mock `saveProject` / `loadProject` / `saveHistoryEntry`**

Replace shallow shape-only coverage with real write asserts. Full test source:

```typescript
/**
 * planner-autosave.test.ts
 * P06 — createAutoSaver flush, cancel, debounce, no silent drop
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const saveProjectMock = vi.fn();
const loadProjectMock = vi.fn();
const saveHistoryEntryMock = vi.fn();

vi.mock("@/features/planner/persistence/persistence", async (importOriginal) => {
  // Prefer vi.spyOn after import if mock circular; alternative: inject via
  // testing seam. If module self-references, use:
  const actual = await importOriginal<typeof import("@/features/planner/persistence/persistence")>();
  return {
    ...actual,
    saveProject: (...args: unknown[]) => saveProjectMock(...args),
    loadProject: (...args: unknown[]) => loadProjectMock(...args),
    saveHistoryEntry: (...args: unknown[]) => saveHistoryEntryMock(...args),
  };
});

// NOTE: If vi.mock of self-module fails, implement Task 01b: extract
// createAutoSaver into autosaveCore.ts with injected deps. Prefer minimal
// change: spy after dynamic import pattern used elsewhere in repo.

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

describe("createAutoSaver flush + write semantics (P06)", () => {
  const snapA = JSON.stringify({ version: 1, tag: "A" });
  const snapB = JSON.stringify({ version: 1, tag: "B" });

  beforeEach(() => {
    vi.useFakeTimers();
    saveProjectMock.mockReset();
    loadProjectMock.mockReset();
    saveHistoryEntryMock.mockReset();
    loadProjectMock.mockResolvedValue(undefined);
    saveProjectMock.mockResolvedValue(undefined);
    saveHistoryEntryMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns scheduleSave, flush, and cancel", () => {
    const saver = createAutoSaver("any-id");
    expect(typeof saver.scheduleSave).toBe("function");
    expect(typeof saver.flush).toBe("function");
    expect(typeof saver.cancel).toBe("function");
    saver.cancel();
  });

  it("flush() is safe when idle (no write)", async () => {
    const saver = createAutoSaver("idle-flush");
    await expect(saver.flush()).resolves.toBeUndefined();
    expect(saveProjectMock).not.toHaveBeenCalled();
    saver.cancel();
  });

  it("flush after scheduleSave persists last pending without waiting 5s", async () => {
    const onSaved = vi.fn();
    const saver = createAutoSaver("flush-now", { onSaved });
    saver.scheduleSave(snapA);
    await saver.flush();
    expect(saveProjectMock).toHaveBeenCalledTimes(1);
    expect(saveProjectMock.mock.calls[0]?.[0]?.snapshot).toBe(snapA);
    expect(onSaved).toHaveBeenCalled();
    saver.cancel();
  });

  it("scheduleSave then scheduleSave keeps latest snapshot for flush", async () => {
    const saver = createAutoSaver("latest-pending");
    saver.scheduleSave(snapA);
    saver.scheduleSave(snapB);
    await saver.flush();
    expect(saveProjectMock).toHaveBeenCalledTimes(1);
    expect(saveProjectMock.mock.calls[0]?.[0]?.snapshot).toBe(snapB);
    saver.cancel();
  });

  it("cancel after schedule does not write", async () => {
    const saver = createAutoSaver("cancel-drop");
    saver.scheduleSave(snapA);
    saver.cancel();
    await vi.advanceTimersByTimeAsync(6000);
    expect(saveProjectMock).not.toHaveBeenCalled();
  });

  it("debounced schedule eventually writes pending snapshot", async () => {
    const saver = createAutoSaver("debounce-write");
    saver.scheduleSave(snapA);
    await vi.advanceTimersByTimeAsync(5000);
    // allow microtasks
    await Promise.resolve();
    await Promise.resolve();
    expect(saveProjectMock).toHaveBeenCalled();
    expect(saveProjectMock.mock.calls[0]?.[0]?.snapshot).toBe(snapA);
    saver.cancel();
  });

  it("second schedule shortly after save still persists latest (no silent forever drop)", async () => {
    const saver = createAutoSaver("no-double-gate-drop");
    saver.scheduleSave(snapA);
    await saver.flush();
    saveProjectMock.mockClear();
    saver.scheduleSave(snapB);
    await vi.advanceTimersByTimeAsync(5000);
    await Promise.resolve();
    await Promise.resolve();
    expect(saveProjectMock).toHaveBeenCalled();
    expect(saveProjectMock.mock.calls[0]?.[0]?.snapshot).toBe(snapB);
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

**Implementation note for agent:** If self-mock of `persistence.ts` fails, extract:

```typescript
// site/features/planner/persistence/createAutoSaver.ts
export type AutoSaverDeps = {
  loadProject: typeof loadProject;
  saveProject: typeof saveProject;
  saveHistoryEntry: typeof saveHistoryEntry;
  debounceMs?: number;
};

export function createAutoSaver(
  projectId: string,
  callbacks: AutoSaverCallbacks = {},
  deps: AutoSaverDeps = defaultDeps,
) { /* move body here */ }
```

…and re-export from `persistence.ts`. Prefer inject deps over flaky full-module mock.

- [ ] **Step 2: Run tests — expect FAIL until write mocks hook correctly**

```powershell
cd site
npx vitest run tests/unit/planner-autosave.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\01-autosave-flush-vitest.log
```

Expected (red first time if mock not wired): FAIL on `saveProjectMock` not called / mock not applied.

- [ ] **Step 3: Minimal implementation to make write asserts pass**

Ensure `createAutoSaver` in `persistence.ts` retains:

```typescript
// Key invariants (full function already largely present — harden if tests fail)

let pendingSnapshot: string | null = null;
let flushInFlight: Promise<void> | null = null;

async function persistSnapshot(snapshot: string): Promise<void> {
  // load existing → saveProject → saveHistoryEntry → lastSaved → clear pending if match → onSaved
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
      // MUST still write toSave — never return early in a way that drops forever
      flushInFlight = persistSnapshot(toSave).finally(() => {
        flushInFlight = null;
      });
    }, AUTO_SAVE_DEBOUNCE_MS);
  },

  async flush(): Promise<void> {
    if (!active) return;
    clearPendingTimer();
    if (flushInFlight) await flushInFlight;
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
```

Remove any path that does `if (now - lastSaved < DEBOUNCE) return` **without** still persisting `pendingSnapshot`. If remnant condition exists, delete the early return entirely (timer already is the debounce).

- [ ] **Step 4: Re-run — expect PASS**

```powershell
cd site
npx vitest run tests/unit/planner-autosave.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\01-autosave-flush-vitest.log
```

Expected: all createAutoSaver tests PASS.

- [ ] **Step 5: Write `01-autosave-flush-run.json` + commit**

```bash
git add site/features/planner/persistence/persistence.ts site/tests/unit/planner-autosave.test.ts results/planner/world-standard-wave/06-save-honesty
git commit -m "test(p06): AutoSaver flush write proof + no silent drop"
```

**Done when:** flush writes immediately; cancel drops; debounce writes; no silent forever drop; log on disk.

---

### Task 02 — TDD: single pure label helper (W6)

**Files:**
- Modify: `site/features/planner/open3d/editor/workspaceStatusLabels.ts`
- Modify: `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts`

- [ ] **Step 1: Expand failing tests for full contract + forbidden bare Saved**

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
  });
});

describe("open3dSaveStatusLabel — local-only default (W6)", () => {
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
      const label = open3dSaveStatusLabel({
        status,
        storage: local,
        lastSavedAt: status === "saved" ? "2026-07-10T12:00:00.000Z" : null,
        cloudEnabled: false,
        guestMode,
      });
      expect(label).toBe(expected);
      expect(label).not.toMatch(/^Saved$/);
      expect(label.toLowerCase()).not.toContain("account");
      expect(label.toLowerCase()).not.toContain("cloud");
      expect(label.toLowerCase()).not.toMatch(/\bsynced\b/);
    },
  );

  it("never returns cloud account labels when cloudEnabled is false even if storage claims cloud", () => {
    const label = open3dSaveStatusLabel({
      status: "saved",
      storage: "cloud",
      lastSavedAt: "2026-07-10T12:00:00.000Z",
      cloudEnabled: false,
      guestMode: false,
    });
    expect(label).toBe("Saved locally");
  });

  it("cloud branches only when cloudEnabled true", () => {
    expect(
      open3dSaveStatusLabel({
        status: "saving",
        storage: "cloud",
        lastSavedAt: null,
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Saving to account…");
    expect(
      open3dSaveStatusLabel({
        status: "saved",
        storage: "cloud",
        lastSavedAt: "2026-07-10T12:00:00.000Z",
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Saved to account");
    expect(
      open3dSaveStatusLabel({
        status: "error",
        storage: "cloud",
        lastSavedAt: null,
        cloudEnabled: true,
        guestMode: false,
      }),
    ).toBe("Account save failed");
  });
});

describe("formatAutosaveStatus delegates to same table (no dual drift)", () => {
  it("matches open3dSaveStatusLabel for guest/member local", () => {
    expect(formatAutosaveStatus("saved", true)).toBe(
      open3dSaveStatusLabel({
        status: "saved",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: true,
      }),
    );
    expect(formatAutosaveStatus("saved", false)).toBe(
      open3dSaveStatusLabel({
        status: "saved",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: false,
      }),
    );
    expect(formatAutosaveStatus("error", false)).toBe("Local save failed");
  });
});
```

- [ ] **Step 2: Run — expect FAIL if `open3dSaveStatusLabel` missing or error still “Save failed”**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\02-labels-vitest.log
```

- [ ] **Step 3: Implement single table**

Full `workspaceStatusLabels.ts` save section:

```typescript
import type { PlannerTool } from "./canvasTool";
import { CANVAS_TOOL_LABELS } from "./canvasTool";
import type { SnapKind } from "../lib/geometry/snapping";
import type { CanvasSelection } from "./useWorkspaceCanvas";
import type { Open3dSaveStatus } from "../persistence/useOpen3dWorkspaceAutosave";

// ... SELECTION_LABELS, formatToolStatus, formatSnapStatus, formatSelectionStatus unchanged ...

export type Open3dPersistStorage = "local" | "cloud";

export type Open3dSaveStatusLabelInput = {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
};

/**
 * Single source of truth for TopBar + status-bar save copy (W6).
 * When cloudEnabled is false, storage is forced to local for labeling.
 */
export function open3dSaveStatusLabel(input: Open3dSaveStatusLabelInput): string {
  const guestMode = input.guestMode ?? false;
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

/** Back-compat wrapper — always local-only path used by open3d today. */
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

- [ ] **Step 4: Re-run — expect PASS**

Same command as Step 2. Expected: all cases green.

- [ ] **Step 5: Commit**

```bash
git add site/features/planner/open3d/editor/workspaceStatusLabels.ts site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts results/planner/world-standard-wave/06-save-honesty/02-labels-vitest.log
git commit -m "feat(p06): single open3dSaveStatusLabel table for W6 honesty"
```

**Done when:** one table; bare Saved impossible for local; formatAutosaveStatus delegates.

---

### Task 03 — Hook: projectRef + flushPersist + isLocalSaved + cloudEnabled

**Files:**
- Modify: `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts`
- Create/Modify: `site/tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx`

- [ ] **Step 1: Write hook tests (mock createAutoSaver)**

```tsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const scheduleSave = vi.fn();
const flush = vi.fn(async () => undefined);
const cancel = vi.fn();

vi.mock("@/features/planner/persistence/persistence", () => ({
  createAutoSaver: vi.fn(() => ({ scheduleSave, flush, cancel })),
  getPlannerProjectId: (guest: boolean) =>
    guest ? "planner-guest-local" : "planner-member-local",
  loadProject: vi.fn(async () => undefined),
  migrateGuestProjectToMember: vi.fn(async () => "no-guest-data"),
}));

import { useOpen3dWorkspaceAutosave } from "@/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave";
import type { Open3dProject } from "@/features/planner/open3d/model/types";

function minimalProject(overrides: Partial<Open3dProject> = {}): Open3dProject {
  return {
    id: "p1",
    name: "Test",
    units: "mm",
    floors: [
      {
        id: "f1",
        name: "Floor 1",
        elevation: 0,
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        furniture: [],
      },
    ],
    activeFloorId: "f1",
    createdAt: "2026-07-10T00:00:00.000Z",
    updatedAt: "2026-07-10T00:00:00.000Z",
    ...overrides,
  } as Open3dProject;
}

describe("useOpen3dWorkspaceAutosave (P06)", () => {
  beforeEach(() => {
    scheduleSave.mockClear();
    flush.mockClear();
    cancel.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("exports cloudEnabled false and storage local by default", () => {
    const { result } = renderHook(() =>
      useOpen3dWorkspaceAutosave(minimalProject(), true, undefined, {
        enabled: true,
        hydrated: true,
      }),
    );
    expect(result.current.cloudEnabled).toBe(false);
    expect(result.current.storage).toBe("local");
    expect(result.current.isLocalSaved).toBe(result.current.status === "saved");
  });

  it("flushPersist schedules latest project then flush", async () => {
    const { result, rerender } = renderHook(
      ({ project }) =>
        useOpen3dWorkspaceAutosave(project, true, undefined, {
          enabled: true,
          hydrated: true,
        }),
      { initialProps: { project: minimalProject() } },
    );

    const next = minimalProject({
      updatedAt: "2026-07-10T01:00:00.000Z",
      name: "Edited",
    });
    rerender({ project: next });

    await act(async () => {
      await result.current.flushPersist();
    });

    expect(scheduleSave).toHaveBeenCalled();
    const snapshot = String(scheduleSave.mock.calls.at(-1)?.[0] ?? "");
    expect(snapshot).toContain("Edited");
    expect(flush).toHaveBeenCalled();
  });
});
```

Adjust `minimalProject` fields to match live `Open3dProject` type if compile fails — **read types before editing**.

- [ ] **Step 2: Run — expect FAIL on missing exports**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\03-hook-vitest.log
```

- [ ] **Step 3: Implement hook hardening**

Target shape (full file intent — merge with live leave listeners):

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
  options?: { enabled?: boolean; hydrated?: boolean; cloudEnabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const hydrated = options?.hydrated ?? true;
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
    if (!enabled || !hydrated) return;
    if (!mountedRef.current) return;
    const envelope = buildOpen3dSessionEnvelope(projectRef.current);
    const snapshot = JSON.stringify(envelope);
    setStatus("saving");
    saverRef.current?.scheduleSave(snapshot);
  }, [enabled, hydrated]);

  const flushPersist = useCallback(async () => {
    if (!enabled || !hydrated) return;
    const envelope = buildOpen3dSessionEnvelope(projectRef.current);
    const snapshot = JSON.stringify(envelope);
    setStatus("saving");
    saverRef.current?.scheduleSave(snapshot);
    await saverRef.current?.flush?.();
  }, [enabled, hydrated]);

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
      // Prefer latest project envelope on leave
      void flushPersist();
    };
    window.addEventListener("pagehide", flushPending);
    const onVis = () => {
      if (document.visibilityState === "hidden") flushPending();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mountedRef.current = false;
      autosaveGenerationRef.current += 1;
      window.removeEventListener("pagehide", flushPending);
      document.removeEventListener("visibilitychange", onVis);
      const saver = saverRef.current;
      void (async () => {
        try {
          const envelope = buildOpen3dSessionEnvelope(projectRef.current);
          saver?.scheduleSave(JSON.stringify(envelope));
          await saver?.flush?.();
        } finally {
          saver?.cancel();
        }
      })();
      saverRef.current = null;
    };
  }, [enabled, projectId, flushPersist]);

  useEffect(() => {
    if (!enabled || !hydrated) return;
    if (!didScheduleAfterHydrationRef.current) {
      didScheduleAfterHydrationRef.current = true;
      return;
    }
    setStatus("unsaved");
    schedulePersist();
  }, [enabled, hydrated, project.updatedAt, schedulePersist]);

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
    /** @deprecated Use isLocalSaved — not cloud sync */
    isSynced: isLocalSaved,
    isModified: status === "unsaved" || status === "saving",
  };
}
```

- [ ] **Step 4: Re-run hook tests — PASS**

- [ ] **Step 5: Commit**

```bash
git add site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts site/tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx results/planner/world-standard-wave/06-save-honesty/03-hook-vitest.log
git commit -m "feat(p06): projectRef flush hardening + isLocalSaved surface"
```

**Done when:** latest project always in ref; flushPersist uses it; cloudEnabled/storage exported; leave still flush-before-cancel.

---

### Task 04 — TopBar + status bar + Shell props (W6 surfaces + selectors)

**Files:**
- Modify: `TopBar.tsx`, `WorkspaceShell.tsx`, `OOPlannerWorkspace.tsx`
- Test: unit/render for TopBar save pill

- [ ] **Step 1: Failing render test for testids + local wording**

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopBar } from "@/features/planner/open3d/editor/TopBar";

describe("TopBar save status (W6)", () => {
  it("exposes open3d-save-status with local storage when saved", () => {
    render(
      <TopBar
        projectName="Office"
        viewMode="2d"
        isModified={false}
        isLocalSaved={true}
        saveStatus="saved"
        saveStatusLabel="Saved locally"
        storage="local"
        cloudEnabled={false}
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
        projectName="Office"
        viewMode="2d"
        isModified={false}
        isLocalSaved={false}
        saveStatus="idle"
        saveStatusLabel="Ready (local)"
        storage="local"
        cloudEnabled={false}
      />,
    );
    expect(screen.getByTestId("open3d-save-status")).toHaveTextContent("Ready (local)");
  });
});
```

- [ ] **Step 2: Run — FAIL until props/testids exist**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\04-topbar-status-vitest.log
```

- [ ] **Step 3: TopBar — use label props + testids**

Key block (replace Modified/Saved/Ready hardcode):

```tsx
export interface TopBarProps {
  // ...existing...
  /** Prefer over isSynced */
  isLocalSaved?: boolean;
  /** @deprecated alias of isLocalSaved */
  isSynced?: boolean;
  saveStatus?: "idle" | "unsaved" | "saving" | "saved" | "error";
  saveStatusLabel?: string;
  storage?: "local" | "cloud";
  cloudEnabled?: boolean;
}

// In component:
const localSaved = isLocalSaved ?? isSynced;
const status = saveStatus ?? (isModified ? "unsaved" : localSaved ? "saved" : "idle");
const label =
  saveStatusLabel ??
  (isModified
    ? "Unsaved changes"
    : localSaved
      ? "Saved locally"
      : "Ready (local)");
const storageAttr = storage ?? "local";

// ...
<div
  className={styles.saveStatus}
  role="status"
  aria-live="polite"
  data-testid="open3d-save-status"
  data-status={status}
  data-storage={storageAttr}
  data-cloud-enabled={cloudEnabled ? "true" : "false"}
  data-modified={isModified}
  data-local-saved={localSaved && !isModified}
>
  {isModified || status === "unsaved" ? (
    <>
      <span aria-hidden="true">●</span> {label}
    </>
  ) : status === "saving" ? (
    <>
      <span aria-hidden="true">…</span> {label}
    </>
  ) : status === "saved" || localSaved ? (
    <>
      <span aria-hidden="true">✓</span> {label}
    </>
  ) : status === "error" ? (
    <>
      <span aria-hidden="true">!</span> {label}
    </>
  ) : (
    <>
      <span aria-hidden="true">○</span> {label}
    </>
  )}
</div>
```

Also update brand sub if present: use same unsaved label (“Unsaved changes” / guest “Unsaved draft” via prop).

- [ ] **Step 4: WorkspaceShell — pass through honest props**

```tsx
export interface WorkspaceShellProps {
  // ...
  isModified?: boolean;
  /** Whether latest snapshot is persisted to local IDB (not cloud unless cloudEnabled). */
  isLocalSaved?: boolean;
  /** @deprecated use isLocalSaved */
  isSynced?: boolean;
  saveStatus?: "idle" | "unsaved" | "saving" | "saved" | "error";
  saveStatusLabel?: string;
  storage?: "local" | "cloud";
  cloudEnabled?: boolean;
}

// Forward to TopBar:
isLocalSaved={isLocalSaved ?? isSynced}
isSynced={isLocalSaved ?? isSynced}
saveStatus={saveStatus}
saveStatusLabel={saveStatusLabel}
storage={storage}
cloudEnabled={cloudEnabled}
```

- [ ] **Step 5: OOPlannerWorkspace — wire labels both surfaces + success toast**

```tsx
import {
  formatAutosaveStatus,
  open3dSaveStatusLabel,
  // ...
} from "./workspaceStatusLabels";

// derived once per render:
const saveStatusLabel = open3dSaveStatusLabel({
  status: autosave.status,
  storage: autosave.storage,
  lastSavedAt: autosave.lastSavedAt,
  cloudEnabled: autosave.cloudEnabled,
  guestMode,
});

const handleSave = useCallback(() => {
  void (async () => {
    setWorkspaceMessage(
      guestMode ? "Saving draft locally…" : "Saving plan locally…",
    );
    try {
      await autosave.flushPersist();
      setWorkspaceMessage(
        guestMode ? "Draft saved locally" : "Plan saved locally",
      );
    } catch {
      setWorkspaceMessage("Local save failed");
    }
  })();
}, [autosave, guestMode]);

// WorkspaceShell props:
isModified={autosave.isModified}
isLocalSaved={autosave.isLocalSaved}
isSynced={autosave.isLocalSaved}
saveStatus={autosave.status}
saveStatusLabel={saveStatusLabel}
storage={autosave.storage}
cloudEnabled={autosave.cloudEnabled}

// status bar pill — same string, optional secondary testid:
<span
  className="open3d-status-pill open3d-status-pill--muted"
  data-testid="open3d-save-status-bar"
  data-status={autosave.status}
  data-storage={autosave.storage}
>
  {saveStatusLabel}
</span>
```

- [ ] **Step 6: Run TopBar + labels units — PASS**

- [ ] **Step 7: Commit**

```bash
git add site/features/planner/open3d/editor/TopBar.tsx site/features/planner/open3d/editor/WorkspaceShell.tsx site/features/planner/open3d/editor/OOPlannerWorkspace.tsx site/tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx results/planner/world-standard-wave/06-save-honesty/04-topbar-status-vitest.log
git commit -m "feat(p06): dual-surface save labels + open3d-save-status testids"
```

**Done when:** both surfaces same helper; testids present; no bare Saved; Ready (local) parity.

---

### Task 05 — Help / FAQ copy audit (W6 red residual)

**Files:**
- Modify: `site/features/planner/help/helpSections.ts`
- Evidence: `05-copy-grep.txt`

- [ ] **Step 1: Write unit assertions for honest help strings**

If help is pure data, add:

```typescript
// site/tests/unit/features/planner/help/helpSections.saveHonesty.test.ts
import { describe, expect, it } from "vitest";
import {
  PLANNER_HELP_SECTIONS,
  PLANNER_HELP_FAQ_ITEMS,
} from "@/features/planner/help/helpSections";

describe("help save honesty (W6)", () => {
  it("saving section does not claim account named slots while open3d is local-only", () => {
    const section = PLANNER_HELP_SECTIONS.find((s) => s.id === "saving-and-autosave");
    expect(section).toBeDefined();
    const text = `${section!.title} ${section!.summary}`.toLowerCase();
    expect(text).toMatch(/browser|local/);
    expect(text).not.toMatch(/named save slots in their account/);
  });

  it("FAQ how plans saved is local-honest", () => {
    const faq = PLANNER_HELP_FAQ_ITEMS.find((f) =>
      /how are plans saved/i.test(f.question),
    );
    expect(faq).toBeDefined();
    expect(faq!.answer.toLowerCase()).toMatch(/browser|local/);
    expect(faq!.answer.toLowerCase()).not.toMatch(/named save slots in their account/);
  });
});
```

- [ ] **Step 2: Run — FAIL on current strings**

- [ ] **Step 3: Rewrite help copy (original O&O wording)**

```typescript
{
  id: "saving-and-autosave",
  title: "Saving and autosave",
  summary:
    "Plans autosave in this browser (local storage). Clearing site data removes them. Account cloud save is not enabled for the open3d planner yet.",
  keywords: ["autosave", "save", "restore", "reload", "local"],
},
// FAQ:
{
  question: "How are plans saved?",
  answer:
    "Sessions autosave to this browser’s local storage. Use Save draft / Save for an immediate local flush. Account cloud save is not enabled for open3d yet — export JSON if you need a portable backup.",
},
```

Also audit guest-vs-member summary if it over-promises member cloud:

```typescript
{
  id: "guest-vs-member",
  title: "Guest vs member",
  summary:
    "Guest explores the canvas with local drafts; members unlock more export/workspace tools. Open3d plan durability is still local browser storage until cloud save ships.",
  keywords: ["guest", "login", "save", "member"],
},
```

- [ ] **Step 4: Grep audit → evidence**

```powershell
cd site
rg -n "Saved|cloud|sync|account|autosave|named save slots" `
  features/planner/open3d/editor `
  features/planner/open3d/persistence `
  features/planner/help/helpSections.ts `
  --glob "*.{ts,tsx}" |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\05-copy-grep.txt
```

Manually confirm no forbidden buyer-facing claims. Allowed: comments that say “until cloud is wired”, `cloudEnabled` identifiers, “Saved locally”.

- [ ] **Step 5: Unit PASS + commit**

```bash
git add site/features/planner/help/helpSections.ts site/tests/unit/features/planner/help/helpSections.saveHonesty.test.ts results/planner/world-standard-wave/06-save-honesty/05-copy-grep.txt
git commit -m "fix(p06): honest local-only save help and FAQ copy"
```

**Done when:** help/FAQ cannot be misread as account backup; grep artifact stored.

---

### Task 06 — W5 hard reload: **entity ids** + evidence under `save-reload/`

**Files:**
- Modify: `site/tests/e2e/open3d-save-honesty.spec.ts`
- Optional create: `site/tests/fixtures/open3d/w5-seed-project.json`
- Optional helper: id capture via download / `page.evaluate` IDB / export

#### 06.A Unit non-regression

- [ ] **Step 1: Re-run continuity units**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/saveReloadContinuity.test.ts tests/unit/features/planner/open3d/open3dSession.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\06-unit-continuity.log
```

Expected: PASS.

#### 06.B Fixture with known ids

- [ ] **Step 2: Create seed fixture (known UUIDs)**

`site/tests/fixtures/open3d/w5-seed-project.json` — shape must match live `Open3dProject` / import path. Use continuity test as template:

```json
{
  "id": "w5-project-1",
  "name": "W5 save-reload",
  "units": "mm",
  "activeFloorId": "w5-floor-1",
  "createdAt": "2026-07-10T12:00:00.000Z",
  "updatedAt": "2026-07-10T12:00:00.000Z",
  "floors": [
    {
      "id": "w5-floor-1",
      "name": "Floor 1",
      "elevation": 0,
      "walls": [
        {
          "id": "w5-wall-1",
          "start": { "x": 0, "y": 0 },
          "end": { "x": 4000, "y": 0 },
          "thickness": 100,
          "height": 2700
        }
      ],
      "doors": [],
      "windows": [],
      "rooms": [],
      "furniture": [
        {
          "id": "w5-furn-1",
          "catalogId": "cabinet-v0",
          "position": { "x": 1200, "y": 800 },
          "rotation": 0,
          "width": 800,
          "depth": 580,
          "height": 720
        }
      ]
    }
  ]
}
```

**Agent must align field names with `Open3dProject` / `importOpen3dProjectJson`** — read `model/types.ts` and fix fixture before E2E. If import rejects, use export from a unit-built project as golden file.

#### 06.C Playwright id channel strategies (pick one; document in NOTES)

| Strategy | How |
|----------|-----|
| **A — Import fixture file** | `setInputFiles` on import input; assert after restore via export download |
| **B — placeSeats + IDB snapshot parse** | After place, `page.evaluate` read IDB `planner-workspace-db` project snapshot; parse wall/furniture ids; after reload re-read and compare |
| **C — Export JSON download** | Click Export JSON; intercept download; parse ids; reload; export again; compare |

**Recommended:** B or C if import UI flaky for guests; A if import works on guest route.

#### 06.D Full E2E (id equality)

- [ ] **Step 3: Rewrite / extend e2e**

```typescript
/**
 * W5 browser proof — flush save → hard reload → same wall + furniture ids.
 * Evidence: results/planner/world-standard-wave/06-save-honesty/save-reload/
 */
import { expect, test } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

import {
  clearPlannerStorageInPage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import {
  placeSeatsFromConfigurator,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

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

const PROJECT_NAME = "W5 save-reload";
const GUEST_PROJECT_ID = "planner-guest-local";

type EntityIds = { wallIds: string[]; furnitureIds: string[] };

async function waitForSavedLocally(page: import("@playwright/test").Page): Promise<void> {
  const pill = page.getByTestId("open3d-save-status");
  await expect(pill).toBeVisible({ timeout: 25_000 });
  await expect(pill).toHaveAttribute("data-status", "saved", { timeout: 25_000 });
  await expect(pill).toHaveAttribute("data-storage", "local");
  await expect(pill).toContainText(/Saved locally|Draft saved locally/i);
}

/** Read open3d-1 envelope entity ids from IndexedDB. */
async function readEntityIdsFromIdb(
  page: import("@playwright/test").Page,
): Promise<EntityIds> {
  return page.evaluate(async (projectId) => {
    const openDb = () =>
      new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open("planner-workspace-db");
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    const db = await openDb();
    const snapshot = await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction("projects", "readonly");
      const getReq = tx.objectStore("projects").get(projectId);
      getReq.onsuccess = () => {
        const row = getReq.result as { snapshot?: string } | undefined;
        resolve(row?.snapshot ?? null);
      };
      getReq.onerror = () => reject(getReq.error);
    });
    db.close();
    if (!snapshot) return { wallIds: [], furnitureIds: [] };
    const parsed = JSON.parse(snapshot) as {
      project?: {
        floors?: Array<{ walls?: Array<{ id: string }>; furniture?: Array<{ id: string }> }>;
      };
      floors?: Array<{ walls?: Array<{ id: string }>; furniture?: Array<{ id: string }> }>;
    };
    const project = parsed.project ?? parsed;
    const floors = project.floors ?? [];
    const wallIds = floors.flatMap((f) => (f.walls ?? []).map((w) => w.id));
    const furnitureIds = floors.flatMap((f) => (f.furniture ?? []).map((u) => u.id));
    return { wallIds, furnitureIds };
  }, GUEST_PROJECT_ID);
}

async function furnitureCount(page: import("@playwright/test").Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar, [class*='status']")
    .filter({ hasText: /\d+\s+furniture/i })
    .first()
    .textContent()
    .catch(() => null);
  const body = text ?? (await page.locator("body").innerText());
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

test.describe("W5 save honesty / hard reload (browser)", () => {
  test("place furniture, save, hard reload preserves furniture ids", async ({ page }) => {
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

    // Wait restore settle (no replace thrash): canvas + idle/local ready
    await page.waitForTimeout(500); // only as settle; prefer polling status pill
    await expect(page.getByTestId("open3d-save-status")).toBeVisible({ timeout: 25_000 });

    const furnitureBefore = await furnitureCount(page);
    expect(furnitureBefore).toBeGreaterThanOrEqual(0);

    await placeSeatsFromConfigurator(page, 4);
    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(furnitureBefore + 4);

    await page.screenshot({ path: path.join(EVIDENCE, "01-before-save.png") });

    await page.getByRole("button", { name: /Save draft|Save/i }).first().click();
    await waitForSavedLocally(page);
    await page.screenshot({ path: path.join(EVIDENCE, "02-saved-local.png") });

    const beforeReload = await readEntityIdsFromIdb(page);
    expect(beforeReload.furnitureIds.length).toBeGreaterThan(0);
    // Walls may be seed walls; assert non-empty when present
    const beforeFurnitureSorted = [...beforeReload.furnitureIds].sort();
    const beforeWallsSorted = [...beforeReload.wallIds].sort();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".pw-topbar")).toBeVisible({ timeout: 25_000 });
    await waitForPlannerCanvas(page);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(furnitureBefore + 4);

    // Poll IDB until ids match (restore async)
    await expect
      .poll(async () => {
        const after = await readEntityIdsFromIdb(page);
        return JSON.stringify({
          f: [...after.furnitureIds].sort(),
          w: [...after.wallIds].sort(),
        });
      }, { timeout: 25_000 })
      .toBe(
        JSON.stringify({
          f: beforeFurnitureSorted,
          w: beforeWallsSorted,
        }),
      );

    const afterReload = await readEntityIdsFromIdb(page);
    expect([...afterReload.furnitureIds].sort()).toEqual(beforeFurnitureSorted);
    expect([...afterReload.wallIds].sort()).toEqual(beforeWallsSorted);

    await page.screenshot({ path: path.join(EVIDENCE, "03-after-hard-reload.png") });

    const run = {
      schemaVersion: 1,
      gate: "W5",
      exitCode: 0,
      route: "/planner/guest/?plannerDevTools=1",
      cloudEnabled: false,
      projectId: GUEST_PROJECT_ID,
      wallIdsBefore: beforeWallsSorted,
      wallIdsAfter: [...afterReload.wallIds].sort(),
      furnitureIdsBefore: beforeFurnitureSorted,
      furnitureIdsAfter: [...afterReload.furnitureIds].sort(),
      idChannel: "indexeddb-projects-snapshot",
      browser: "playwright",
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(
      path.join(EVIDENCE, "06-browser-run.json"),
      JSON.stringify(run, null, 2),
      "utf8",
    );
  });
});
```

**Critical:** Do **not** call `clearPlannerStorage` (init-script) for this test — only `clearPlannerStorageInPage` once before seed.

- [ ] **Step 4: Run Playwright**

```powershell
cd site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\06-save-honesty\save-reload | Out-Null
npx playwright test tests/e2e/open3d-save-honesty.spec.ts --reporter=line 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\save-reload\06-playwright-raw.log
```

Expected: PASS; PNGs + `06-browser-run.json` with matching id arrays.

- [ ] **Step 5: Fallback if Playwright blocked**

Use chrome-devtools MCP same steps; still require screenshots + run.json. W5 stays **yellow** until Playwright log lands — **never** green on unit-only.

- [ ] **Step 6: Commit**

```bash
git add site/tests/e2e/open3d-save-honesty.spec.ts site/tests/fixtures/open3d results/planner/world-standard-wave/06-save-honesty/save-reload
git commit -m "test(p06): W5 hard reload entity id equality e2e"
```

**Done when:** same wall + furniture **ids** after hard reload; artifacts under `save-reload/`.

---

### Task 07 — Cloud wire (default CANCEL)

**Default decision (brainstormer D2 + phase plan):** cancel Task 07.

- [ ] **Step 1: Write cancel reason into evidence NOTES**

Append to `results/planner/world-standard-wave/06-save-honesty/NOTES.md`:

```markdown
## Task 07 cloud wire

Status: **CANCELLED**
Reason: Owner/default Approach A — local-only honesty. open3d autosave remains IDB-only.
cloudEnabled=false. No half-wire labels.
Unlock later: wire member plan repository AFTER local flush; dual chips Local | Account.
```

- [ ] **Step 2: If owner unlocks mid-phase (only then)**

1. After successful local flush, call authenticated member save  
2. Labels: local saved → Saving to account… → Saved to account | Account save failed  
3. Dual failure: local ok + cloud fail → never hide local success  
4. Unit mock fetch; no secrets in evidence  
5. Commit: `feat(p06): optional open3d cloud save wire`

Otherwise **skip all cloud code**.

**Done when:** cancelled with NOTES **or** dual-status tests green.

---

### Task 08 — Evidence pack + CP-06 hard stop

- [ ] **Step 1: Verify artifact table**

| Artifact | Required |
|----------|----------|
| `00-baseline-run.json` + log | Yes |
| `01-autosave-flush-vitest.log` | Yes |
| `02-labels-vitest.log` | Yes |
| `03-hook-vitest.log` | Yes |
| `04-topbar-status-vitest.log` | Yes |
| `05-copy-grep.txt` | Yes |
| `save-reload/06-playwright-raw.log` | Yes (or yellow NOTES) |
| `save-reload/01-before-save.png` … `03-after-hard-reload.png` | Yes |
| `save-reload/06-browser-run.json` with **ids** | Yes |
| `NOTES.md` HEAD + cloudEnabled + id channel | Yes |

- [ ] **Step 2: Complete CP-06 checkboxes with paths**

See §9. Do not mark green without paths.

- [ ] **Step 3: Typecheck touched packages**

```powershell
cd site
pnpm exec tsc --noEmit -p tsconfig.json 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\08-tsc.log
```

Expected: no new errors in touched files; no new `any`.

- [ ] **Step 4: Final commit**

```bash
git add results/planner/world-standard-wave/06-save-honesty
git commit -m "chore(p06): W5–W6 evidence pack CP-06"
```

- [ ] **Step 5: Push policy**

Push `origin` when slice green enough not to strand remote; mayoite on ~45m / big land. Never force-push.

**Done when:** CP-06 all evidence-backed; P07 may rely on flush + status pill.

---

### Task 09 — Optional restore-settled gate (if E2E flakes)

Only if Task 06 fails due to restore race:

- [ ] Add `restoreComplete` state in `OOPlannerWorkspace`  
- [ ] Set true after restoreSnapshot settles (null or replace)  
- [ ] Gate `schedulePersist` until restoreComplete  
- [ ] Expose `data-restore="complete"` on shell or canvas host for E2E  
- [ ] Unit/e2e wait on attribute  

```tsx
// sketch
const [restoreComplete, setRestoreComplete] = useState(false);
useEffect(() => {
  let cancelled = false;
  (async () => {
    const restored = await restoreSnapshotRef.current();
    if (cancelled) return;
    if (restored) replaceProjectRef.current(restored);
    setRestoreComplete(true);
  })();
  return () => {
    cancelled = true;
  };
}, []);
// pass hydrated: restoreComplete into autosave options if needed
```

Do not implement unless flake proven.

---

## 7. Test matrix

| Layer | File / command | Pass criterion |
|-------|----------------|----------------|
| Unit AutoSaver | `planner-autosave.test.ts` | flush writes; cancel drops; debounce writes; no silent drop |
| Unit labels | `workspaceStatusLabels.test.ts` | full table; bare Saved forbidden; cloud only if enabled |
| Unit hook | `useOpen3dWorkspaceAutosave.test.tsx` | projectRef flush; cloudEnabled false; storage local |
| Unit TopBar | `TopBar.saveStatus.test.tsx` | testids + local wording |
| Unit help | `helpSections.saveHonesty.test.ts` | no account slots claim |
| Unit continuity | `saveReloadContinuity.test.ts` | envelope ids still round-trip |
| E2E W5 | `open3d-save-honesty.spec.ts` | wall+furniture **ids** match after hard reload |
| Copy grep | `05-copy-grep.txt` | no buyer-facing cloud lie |
| Typecheck | `tsc --noEmit` | clean for touched |

Non-regression optional:

```powershell
cd site
pnpm p0:unit
```

Never delete or filter failing output; park full logs under evidence.

---

## 8. False-green catalog

| Trap | Why fatal | Plan block |
|------|-----------|------------|
| Unit JSON continuity as W5 | No browser IDB | CP-06.3 requires `save-reload/` browser |
| Furniture **count** only | IDs may regenerate | Task 06 id equality |
| TopBar fixed, status bar bare | Dual surface drift | One helper Task 02–04 |
| Help still claims account | Buyer trust break | Task 05 |
| `data-synced` green without IDB ack | Status theater | status only after onSaved |
| Init-script storage clear on reload | False W5 red | `clearPlannerStorageInPage` only |
| GATE PASS note from another machine | No artifacts here | Re-prove Task 00–08 |
| Cloud label without wire | Lie | Task 07 cancel |
| cancel() without flush on unmount | Data loss | Task 03 order |
| Sleep 5s instead of status wait | Flake / false pass | wait testid attributes |
| Claim CP-06 without PNGs | Unverifiable | Task 08 table |
| Approach C status theater | W5 still red | Rejected §2.3 |

---

## 9. Stop-if-fail / CP-06 criteria

**Stop and do not claim W5–W6 until every box is evidence-backed.**

- [ ] **CP-06.1 Flush exists:** `createAutoSaver().flush` + pending-snapshot; unit log `01-…`
- [ ] **CP-06.2 Leave path:** Save / pagehide / visibility / unmount flush; projectRef latest
- [ ] **CP-06.3 W5 browser:** same wall id + furniture id; PNGs + `06-browser-run.json` under `save-reload/`
- [ ] **CP-06.4 W6 copy:** TopBar + status bar + help + toasts; no bare Saved; `05-copy-grep.txt` clean
- [ ] **CP-06.5 Selectors:** `data-testid="open3d-save-status"` + `data-storage` + `data-status`
- [ ] **CP-06.6 Types:** no new `any`; tsc clean for touch set
- [ ] **CP-06.7 Commits:** landable slices on main checkout (no worktrees)
- [ ] **CP-06.8 Cloud:** Task 07 cancelled with NOTES **or** dual-status green
- [ ] **CP-06.9 Dual surfaces:** shared pure helper; Shell not “server sync”

**Unlock next:** P07 draw/place journey may use flush + status pill; **no** P07 save assertions until CP-06.3 green.

---

## 10. Commit sequence

| Order | Message |
|------:|---------|
| 0 | `chore(p06): evidence scaffold + baseline notes for W5–W6` |
| 1 | `test(p06): AutoSaver flush write proof + no silent drop` |
| 2 | `feat(p06): single open3dSaveStatusLabel table for W6 honesty` |
| 3 | `feat(p06): projectRef flush hardening + isLocalSaved surface` |
| 4 | `feat(p06): dual-surface save labels + open3d-save-status testids` |
| 5 | `fix(p06): honest local-only save help and FAQ copy` |
| 6 | `test(p06): W5 hard reload entity id equality e2e` |
| 7 | (optional) `feat(p06): optional open3d cloud save wire` |
| 8 | `chore(p06): W5–W6 evidence pack CP-06` |

---

## 11. Risks & owner decisions

| Risk | Mitigation | Owner decision needed? |
|------|------------|------------------------|
| Self-mock of persistence hard | Extract createAutoSaver with deps | No — agent chooses |
| Import fixture field drift | Align with types; golden export | No |
| Playwright env blocked | chrome-devtools fallback; W5 yellow | No |
| Cloud wanted same sprint | Task 07 unlock | **Yes** — owner unlock only |
| Evidence gitignored | Still write disk; note in NOTES | No |
| Restore race flakes | Task 09 restoreComplete | No |
| Parallel agents touch same package | One writer on planner open3d | No |

**Locked decisions (no re-ask unless goal changes):**
- Approach A local-first  
- Guest E2E default route  
- W5 = ids  
- Idiots2 only for brainstormer  
- No worktrees  

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Residual (§1.2) | Task |
|-----------------|------|
| Help over-claim | 05 |
| testids | 04 |
| isSynced rename | 03–04 |
| projectRef | 03 |
| Weak autosave unit | 01 |
| W5 ids | 06 |
| Evidence missing | 00, 08 |
| cloudEnabled export | 03 |
| Idle Ready (local) | 02, 04 |
| Success toast | 04 |
| Single helper | 02 |
| Double-gate proof | 01 |
| Restore race | 06 wait + optional 09 |
| Task 07 | 07 cancel |

### 12.2 Brainstormer coverage

| Report item | Plan |
|-------------|------|
| D1 IDB primary | Architecture |
| D2 no cloud default | Task 07 cancel |
| D3 flush leave | Tasks 01, 03 |
| D4 explicit Save flush | Task 04 handleSave |
| D5 qualify locally | Tasks 02–05 |
| D6 one pure helper | Task 02 |
| D7 UUID equality | Task 06 |
| D8 guest route | Task 06 |
| D9 no multiplayer | Out of scope |
| D10 ethics | §3 |
| Failure catalog §18 | §8 |
| Evidence pack §7.4 | Task 08 |
| Raised bar help rewrite | Task 05 |

### 12.3 Placeholder scan

No TBD steps. Full test sources and implementation sketches included. Where types may drift (`Open3dProject` fixture fields), agent is ordered to **read live types** and adjust fields without inventing `any`.

### 12.4 Length honesty

Plan is extensive because dual gates (W5+W6), partial prior landings, and residual help/id/evidence gaps require bite-sized TDD without skipping CP-06. Not padded for tokens — residual work is real.

---

## 13. Appendices

### Appendix A — Type / signature catalog

```typescript
export type Open3dSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";
export type Open3dPersistStorage = "local" | "cloud";

export function open3dSaveStatusLabel(input: {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
}): string;

export function formatAutosaveStatus(
  status: Open3dSaveStatus,
  guestMode: boolean,
): string; // delegates to open3dSaveStatusLabel local-only

// createAutoSaver
scheduleSave(snapshot: string): void;
flush(): Promise<void>;
cancel(): void;

// useOpen3dWorkspaceAutosave return
{
  status: Open3dSaveStatus;
  lastSavedAt: string | null;
  restoreSnapshot: () => Promise<Open3dProject | null>;
  schedulePersist: () => void;
  flushPersist: () => Promise<void>;
  exportSnapshot: () => string;
  storage: Open3dPersistStorage;
  cloudEnabled: boolean;
  isLocalSaved: boolean;
  isSynced: boolean; // deprecated alias
  isModified: boolean;
}
```

### Appendix B — Selector table (E2E)

| Selector | Purpose |
|----------|---------|
| `[data-testid="open3d-save-status"]` | Primary TopBar save pill |
| `[data-status="saved\|…"]` | Machine status |
| `[data-storage="local\|cloud"]` | Storage tier |
| `[data-testid="open3d-save-status-bar"]` | Status bar secondary (optional) |
| `.pw-topbar` | Workspace chrome ready |
| `[data-testid="planner-2d-canvas"] canvas` | Canvas ready |
| `role=button` name `/Save draft\|Save/i` | Explicit flush |
| Import `input[accept*="json"]` | Fixture seed if used |

### Appendix C — Research → O&O translation

| Research idea | O&O task |
|---------------|----------|
| Save that returns | Task 06 W5 |
| Flush on leave > wait 5s | Tasks 01, 03 |
| Honest Local vs Synced | Tasks 02–04; cloud later |
| Avoid IKEA manual-only | Keep autosave + Save flush |
| Export as backup | Existing export; help mentions JSON |
| No multiplayer fake | Out of scope |
| Evidence `06-save-honesty/` | Tasks 00, 08 |

### Appendix D — Forbidden string list (grep)

```
^Saved$
Synced to server
Synced
Saved to cloud
Saved to account   # unless cloudEnabled proven
named save slots in their account
Cloud OK
```

Allowed examples: `Saved locally`, `Draft saved locally`, `Saving locally…`, `Local save failed`, `cloudEnabled` code identifiers, comments “until cloud is wired”.

### Appendix E — Guest vs member label matrix

See §5.4 and brainstormer Appendix C — implemented in Task 02 table.

### Appendix F — Commands cheat sheet

```powershell
# Baseline
cd site
npx vitest run tests/unit/planner-autosave.test.ts tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts --reporter=verbose

# Hook + TopBar
npx vitest run tests/unit/features/planner/open3d/useOpen3dWorkspaceAutosave.test.tsx tests/unit/features/planner/open3d/TopBar.saveStatus.test.tsx --reporter=verbose

# Help
npx vitest run tests/unit/features/planner/help/helpSections.saveHonesty.test.ts --reporter=verbose

# W5
npx playwright test tests/e2e/open3d-save-honesty.spec.ts --reporter=line

# Layout gate (repo rule)
cd .
pnpm run check:layout
```

### Appendix G — Handover lines (execute agent)

```
P06 save honesty — implement Tasks 00→08 in order (09 only if flake).
Default cloudEnabled=false; Task 07 CANCELLED with NOTES.
Repo already has flush + many local labels — do NOT rewrite from zero; finish residuals.
Help still lies (account slots) — Task 05 required.
W5 = entity ids under save-reload/, not count-only smoke.
One pure open3dSaveStatusLabel; TopBar + status bar; testids open3d-save-status.
projectRef + flush before cancel; guest /planner/guest/?plannerDevTools=1.
Evidence: results/planner/world-standard-wave/06-save-honesty/
Brainstormer: Idiots2 only. Superpowers + TDD. No worktrees.
CP-06 hard stop before W5–W6 green claim.
```

### Appendix H — Absolute path index

| Role | Path |
|------|------|
| This plan | `plans1/P06-save-honesty\IMPLEMENTATION-PLAN.md` |
| Brainstormer | `Idiots2\P06-save-honesty\REPORT.md` |
| Execute card | `Plans\phases\P06-save-honesty\P06-save-honesty.md` |
| AutoSaver | `site\features\planner\persistence\persistence.ts` |
| Hook | `site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts` |
| Labels | `site\features\planner\open3d\editor\workspaceStatusLabels.ts` |
| TopBar | `site\features\planner\open3d\editor\TopBar.tsx` |
| Shell | `site\features\planner\open3d\editor\WorkspaceShell.tsx` |
| Workspace | `site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| Help | `site\features\planner\help\helpSections.ts` |
| E2E | `site\tests\e2e\open3d-save-honesty.spec.ts` |
| Evidence | `results\planner\world-standard-wave\06-save-honesty\` |

---

## Execution handoff

Plan complete and saved to `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**
