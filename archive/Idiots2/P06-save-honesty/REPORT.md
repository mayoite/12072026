# P06 — Save honesty (W5–W6) — Exhaustive brainstorm report

**Role:** BRAINSTORMER 06/10  
**Date:** 2026-07-10  
**Mode:** Research + design synthesis only · **NO product code in this deliverable**  
**Output path:** `D:\OandO07072026\Idiots2\P06-save-honesty\REPORT.md`  
**Gates covered:** **W5** (save → hard reload → same walls + furniture ids) · **W6** (status / help / toasts never lie about local vs cloud)  
**Approach:** Plan A product journey (locked) · Open3d document model · IndexedDB first · cloud optional / default off  
**Ethics:** Patterns and JTBD only from `D:\websites`. No competitor UI, assets, code, brands, or trade dress in product.

---

## 0. How to read this report

### 0.1 Source order (as briefed)

| Order | Source tree | What was mined |
|------:|-------------|----------------|
| **1** | `D:\websites` — save/realtime packs, SYNTHESIS, Floorplanner, Planner5D, RoomSketcher, Homestyler, IKEA public planners, O&O self-score | Industry save/collab patterns; honesty bars; anti-patterns |
| **2** | `Plans\Research` — RESEARCH-MAP, RESULTS-MAP, STRUCTURE-*, Others (00-PENDING, 03-SSR-CLOUD, honesty notes) | Phase routing, evidence layout, residual cloud deferral |
| **3** | `Plans\phases\P06-save-honesty\` — README, P06-save-honesty.md, P06-suggestions.md, 01-react-open3d.md | Normative task list, flush/label contracts, expert P0s |
| **Also** | Spec `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` · live open3d persistence paths (facts only) | Gate definitions + measured code truth for honesty baseline |

### 0.2 What this report is / is not

| Is | Is not |
|----|--------|
| Exhaustive design + pattern + risk + proof pack for **W5–W6 save honesty** | Implementation PR or code patches |
| Translation of competitor **behaviors** into O&O original contracts | License to copy Planner5D / Floorplanner chrome or save UX pixels |
| Honest inventory of **repo debt vs landed code** as of read | Claim that product is “done” because a GATE folder once said PASS |
| Decision record for local-only default vs later cloud wire | Multiplayer / CRDT / Figma-class collab design |

### 0.3 One-sentence product job (W5–W6)

> A facilities buyer edits a plan, leaves or hard-reloads, gets **the same walls and furniture entity ids** back, and every visible status string tells the truth about **browser local storage** vs **account/cloud storage**.

---

## 1. Gates (normative)

### 1.1 World-standard design (authority)

From `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`:

| ID | Gate | Proof |
|----|------|--------|
| **W5** | Save → hard reload → same walls + furniture **ids** | Playwright (wait autosave **or** explicit flush) |
| **W6** | Member path: status text does not lie — “local” vs “cloud” truthful; cloud wire **or** honest local-only label | Code + UI copy + test |

North star fragment that makes W5 non-optional:

> …**save and return the next day**…

Without W5, the planner is a demo session. Without W6, the buyer believes they have account backup when they only have IndexedDB on one browser profile.

### 1.2 Phase ownership (P06)

| Item | Location |
|------|----------|
| Execute card | `Plans/phases/P06-save-honesty/P06-save-honesty.md` |
| Suggestions (applied into plan) | `Plans/phases/P06-save-honesty/P06-suggestions.md` |
| React/open3d expert notes | `Plans/phases/P06-save-honesty/01-react-open3d.md` |
| Evidence root | `results/planner/world-standard-wave/06-save-honesty/` |
| W5 subfolder (required) | `…/06-save-honesty/save-reload/` |
| Checkpoint | **CP-06** hard stop before claiming W5–W6 green |
| Historical unit-only continuity | `results/planner/save-reload-continuity/` (cite only; **not** W5 green alone) |

### 1.3 Spine position

Serial product spine (research + STRUCTURE-ADVICE):

```
CP-00 unlock → product truth → engine lock
  → W3 select/delete → W1–W2 journey → W4 orbit
  → **W5–W6 save honesty (this phase)**
  → W7 mesh · W8 shortcuts · CP-10 pack
```

P06 is the **“return next day”** spine step. P07 may place entities for journey; P06 owns flush, restore identity, and non-lying status. Do not start P07 save assertions until CP-06.3 (hard reload ids) is green — phase plan says so explicitly.

### 1.4 Owner pending honesty (read carefully)

`Plans/Research/Others/00-PENDING.md` (2026-07-10) marks **W5–W6 GATE PASS — local only; no cloud**. That is a **gate-folder claim**, not “product finished.” Same file still lists:

| Residual | Note |
|----------|------|
| **Cloud / member save** | W6 is local-only honesty; cloud wire is a later gate if owner wants |

**Brain rule for this report:** treat PASS as “spine evidence may exist somewhere / code may have landed slices” — always re-prove against **live files + evidence paths**. This checkout did **not** contain a populated `results/planner/` tree at write time; do not invent green.

---

## 2. Industry research synthesis (order 1 — `D:\websites`)

### 2.1 Realtime / save slice scores

Source: `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\REPORT.md` + `SCORES.csv`

| Product | Autosave | Cloud | Multi-device | Multiplayer | Offline | Export |
|---------|----------|-------|-------------|-------------|---------|--------|
| Planner5D | 4 | 5 | 5 | 4 | 2 | 4 |
| RoomSketcher | 3 | 5 | 5 | 2 | 2 | 5 |
| Floorplanner | 3 | 5 | 4 | 2 | 1 | 5 |
| Homestyler | 3 | 4 | 4 | 2 | 1 | 4 |
| Figma *(collab bar ref only)* | 5 | 5 | 5 | 5 | 4 | 5 |
| IKEA | 1 | 3 | 2 | 1 | 1 | 3 |
| **O&O live (research snapshot)** | **3** | **1** | **1** | **1** | **4** | **2** |

**Category truth:** world bar for floor planners is **cloud autosave + multi-device open**, **not** Figma multiplayer. Multiplayer is rare; share / seats / time-boxed edit grants dominate.

**O&O research snapshot truth:** strongest relative score is **offline single-device durability (IDB)**; weakest is **cloud / multi-device / multiplayer**. Export and browser reload proof lag.

MASTER-CHART: Realtime/cloud save winner = **P5D / Floorplanner**; O&O live score ~2 for Save column overall.

### 2.2 Pattern library → O&O (SYNTHESIS)

`D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`:

| Industry pattern | O&O translation |
|------------------|-----------------|
| Save that returns | IDB proven unit; wire member cloud + **flush-on-exit** |
| Instant 2D↔3D | Same document UUIDs (feeds W5 id continuity) |
| Catalog is the product | Real O&O SKUs (save must preserve **entity ids**, not rebuild new ones) |

RESEARCH-MAP binds P06 specifically:

| Phase | Research fuel | O&O response | Evidence folder |
|-------|---------------|--------------|-----------------|
| **P06 / W5–W6** | Realtime/save slice + Floorplanner save patterns | **IDB flush + honest labels** | `06-save-honesty/` |

### 2.3 Planner5D — cloud = system of record (ideas only)

Sources: `planner5d.com/report/*`, collab page raw, 05-realtime notes.

| Dimension | Pattern (abstract) | O&O takeaway |
|-----------|-------------------|--------------|
| Autosave | Logged-in projects autosave after changes; internet required for durable save; guests cannot restore | If we claim cloud, require online ack; guest local is fine **if labeled** |
| Cloud | Account-backed storage is system of record | Future member bar; not today’s default |
| Multi-device | Explicit “wait for sync before switching devices” docs | Status must show pending vs synced |
| Multiplayer | Live cursors, roles, invite link/email — best-in-class among floor planners | **Out of P06 / out of W1–W8** |
| Offline risk | Offline edits push later; opening project elsewhere can **overwrite** offline work | Conflict / fencing when cloud lands — document last-write policy |
| Honesty pattern | “Wait a few seconds before close” + online requirement | O&O: **flush on leave** beats “wait 5s hope” |

**Steal (ideas):** dual status mental model (`Local` vs `Synced`); never imply multi-device until cloud round-trip works.

**Do not steal:** multiplayer chrome, project list UI, brand, free unlimited project marketing, editor layout.

### 2.4 Floorplanner — explicit Save + version history + local backup option

Sources: `floorplanner.com/report/INSPIRATION.md`, EN manuals, pricing, older 2019 manual.

| Pattern | Detail | O&O takeaway |
|---------|--------|--------------|
| **Save chrome** | Editor shows **Save** with undo/redo (Cmd/Ctrl+S) | Keep explicit Save as **immediate flush**, not only invisible debounce |
| **Cloud projects** | Projects live in Floorplanner cloud; free keeps projects “always there” marketing | Category expectation of return-tomorrow |
| **Version history** | “Retrieve older versions” after saves | Nice later; not W5 minimum (id continuity first) |
| **FML download** | Paid levels: FML as **local backup** of plan | Honesty pattern: **export JSON** as escape hatch when cloud absent |
| **Collaborate** | Time-boxed edit grant (14 days); sequential, not live cursors | Defer; seats/share later |
| **Spaceplanner share** | Viewer can’t save; Spaceplanner save → **copy** by email, original unchanged | Handoff models ≠ multiplayer |
| **W5–W6 mapping in Floorplanner report** | “Autosave IDB + truthful local vs cloud copy” | Direct alignment with P06 |

Floorplanner free tier economics (projects, watermark, credits) are **business patterns only** — not save UX to clone.

Manual checklist item that matches O&O gates:

> 5. Save → reload persists entities; status copy is honest.

### 2.5 RoomSketcher — cloud archive, weak technical save semantics in scrape

Source: `roomsketcher.com/report/INSPIRATION.md` §2.6–3.

| Claim in market | Scrape strength | O&O action |
|-----------------|-----------------|------------|
| Cloud-synced projects across computer/tablet | Medium marketing | Do not claim until wire + test |
| “Update anytime” / “cloud-saved” | Thin | Forbidden strings while IDB-only |
| Web portal for manage/export | Medium FAQ | Export reliability is adjacent (export slice); W5 is id restore |

Gate translation:

| Gate | Competitor idea | O&O original |
|------|-----------------|--------------|
| **W5** | Cloud save slogans | Autosave flush or explicit save → hard reload → same wall + furniture **UUIDs** |
| **W6** | Markets cloud without proven UI honesty | Copy must not lie: local only until cloud wire |

Gap called out by RoomSketcher pack itself: **no** honest local-vs-cloud status, **no** autosave flush protocol, **no** reload-roundtrip help article. O&O designs these; competitors do not hand them to us.

### 2.6 Homestyler — account cloud + team serialization (not simultaneous edit)

Sources: 05-realtime + `homestyler.com/report/INSPIRATION.md`.

| Pattern | Detail |
|---------|--------|
| Cloud designs | Account-centric cross-platform claims |
| Team | Same project **not at the same time** (forum) — serialize editors |
| Save views | Named cameras feed render queue (later presentation, not W5) |
| Scrape honesty | No live editor DOM; heavy login noise — weak for save semantics |

**O&O takeaway:** team lock/serialize is cheaper than multiplayer; still **out of P06**. Do not fake presence.

### 2.7 IKEA public planners — manual save anti-pattern + “save design for later”

Sources: `ikea.com/planner-public/report/INSPIRATION.md`, 05-realtime IKEA row.

| Pattern | Score / note |
|---------|----------------|
| Autosave | **1** — official help: designs **not** automatically saved; user must Save / Save As |
| Cloud | Account “My designs” when logged in (partial) |
| Product-first | “Save design for later” as configuration continuity (SKU composition) |
| Export path | Design codes, shopping lists — buy path, not open project interchange |

**O&O must not copy manual-only primary save.** Research is explicit: IKEA-style “remember to click Save or lose work” is the anti-pattern. O&O path:

1. Debounced **local autosave** as primary durability on device.  
2. Explicit **Save now** as secondary immediate flush.  
3. Honest labels always.

Manufacturer pattern still useful: **configuration → document identity → return later** (for BOQ/quote wedge), which is exactly W5 job.

### 2.8 Figma — collab bar reference (status latency / offline reapply)

Not a floor-plan competitor. Use only for:

| Idea | Use in O&O |
|------|------------|
| Continuous durability latency (~edits durable fast) | Target: flush on critical ops; don’t rely on 5s alone for leave |
| Offline → reapply on reconnect | Future cloud queue model |
| Status copy honesty | Never green “Saved” for React state only |
| Multiplayer | Aspirational **later** — never fake |

### 2.9 Cross-product patterns (binding for P06)

From 05-realtime “Cross-product patterns” + O&O minimum bar:

| Pattern | Who | O&O takeaway for P06 |
|---------|-----|----------------------|
| Cloud = system of record after login | P5D, RS, FP, Homestyler | Future bar; **not** current default claim |
| Autosave only while online | P5D | OK **if** UI says Local vs Synced |
| Overwrite risk multi-device before sync | P5D | Fence / last-write when cloud lands |
| Team seats without simultaneous edit | Homestyler, RS Team, FP Team | Collab MVP later |
| Time-boxed collaborate grant | Floorplanner | Share model later |
| Manual save primary | IKEA, partial FP | **Avoid as primary** |
| Local-first offline | O&O today; Figma partial | **Keep IDB**; pair with honest status |
| Export as trust signal | RS, FP | Save means little if export fails — adjacent gate |

### 2.10 Non-negotiable honesty table (research → O&O law)

| UI claim | Allowed only when |
|----------|-------------------|
| **Saved** / **Local saved** / **Saved locally** | IndexedDB (or equivalent) write **acked** on this device |
| **Synced** / **Cloud saved** / **Saved to account** | Server PUT/POST **acked** for that plan id + revision |
| **Offline** | Network down; local queue still durable |
| **Sync failed** | Server error; local copy retained; retry visible |
| **Multiplayer** / presence | Real shared session; never fake avatars |

**Never:** green “Saved” that only means React state updated.  
**Never:** imply multi-device recovery while only `planner-member-local` IDB exists.  
**Never:** bare **“Saved”** for local-only path (buyer reads as cloud).

### 2.11 Minimum acceptance tests (save/collab slice — research)

From 05-realtime; **P06 owns #1 and #6; cloud tests are later**:

1. Draw/place → wait autosave **or flush** → hard reload → same wall/furniture ids (**local**). ← **W5**  
2. Login → wait **Cloud · Synced** → other browser → same plan. ← **not P06 default**  
3. Airplane mode → edit → **Local saved** → online → Cloud Synced. ← later  
4. Kill network mid-save → never show cloud success; local retained. ← later  
5. Export after reload matches geometry counts. ← export/BOQ slice + W5 adjacency  
6. UI copy audit: zero cloud/sync lies while only IDB wired. ← **W6**

### 2.12 O&O self-score (brutal research-time)

`comparison/07-oando-self/REPORT.md` (2026-07-09):

| Dimension | Score | Note |
|-----------|------:|------|
| **realtime_save** | **2** | IDB autosave + unit envelope; cloud unwired; W5 browser open at research time; status can imply “saved” when only local |

Top deficit #4: **Save honesty + continuity** — “leave and return tomorrow” table stakes.

---

## 3. Plans Research synthesis (order 2)

### 3.1 RESEARCH-MAP routing for P06

| Need | Answer |
|------|--------|
| Research packs | 05-realtime + Floorplanner save patterns + P5D collab/cloud claims (ideas) |
| Product response | IDB flush + honest labels |
| Evidence | `06-save-honesty/` (+ `save-reload/` for W5) |
| Binding pattern | “Save that returns” |

Slice score snapshot (research, not live truth): Realtime/save O&O **2**, response = W5–W6 honesty.

### 3.2 RESULTS-MAP evidence contract

| Phase | CP | Gates | Folder | Minimum artifacts |
|-------|----|-------|--------|-------------------|
| P06 | CP-06 | W5–W6 | `06-save-honesty/` | run.json; vitest/Playwright logs; label NOTES |
| P06 W5 | CP-06 | W5 | `06-save-honesty/save-reload/` | Hard reload same wall + furniture ids; Playwright; id notes |

Claim rules:

| Claim | Requires |
|-------|----------|
| “Save works” | `06-save-honesty/` with **reload** proof |
| Not enough | IDB unit without hard reload / honest label |

W5 maps: `save-reload/` preferred; historical `save-reload-continuity/` unit-only.  
W6 maps: parent `06-save-honesty/`.

### 3.3 STRUCTURE-ADVICE — keep W5 and W6 **one phase**

| Proposal | Verdict | Why |
|----------|---------|-----|
| Split W5 vs W6 into two phase files | **KEEP one phase** | Same autosave surface; dual evidence already (`save-reload/`) |

Task density ~515 lines; dual gate intentional.

### 3.4 Cloud / SSR deferral

`Plans/Research/Others/03-SSR-CLOUD.md`: SSR only when shared public URL needed. Solo local product stays on laptop. Cloud wire for member plans is a **product** decision separate from SSR host size.

`00-PENDING.md` residual: cloud / member save later if owner wants.

**P06 default locked:** **Local-only honesty** + flush + hard reload. Do not ship half-wired cloud labels.

### 3.5 From-repo older UI research (status bar)

`from-repo-Plans-Research/RESEARCH-2026-07-05-ui-benchmark.md` / `ui-plann-compare.md`:

- Persistent **visible save state** is industry CAD-lite (SketchUp Web status bar called as pattern).  
- Announce tool/selection/**save** via live regions (a11y).  
- Top bar = project / **save** / mode.

Supports: TopBar + status bar dual surfaces; `role="status"` / `aria-live="polite"`.

---

## 4. Phase plan deep dive (order 3 — P06 folder ALL)

### 4.1 Files in phase folder

| File | Role |
|------|------|
| `P06-save-honesty.md` | Normative execute card (tasks 00–08, CP-06, label/flush contracts) |
| `P06-suggestions.md` | Planning expert measured snapshot + S1–S10 (applied into plan) |
| `01-react-open3d.md` | Cross-phase React expert: W5–W6 P0 + false-reverse traps |
| `README.md` | Pointers only |

### 4.2 Architecture (Approach A)

```
Open3d document model (UUID entities)
    → useOpen3dWorkspaceAutosave
        → createAutoSaver / saveProject  (IndexedDB planner-workspace-db)
        → loadProject + parseOpen3dSessionSnapshot on restore
    → Status UI: TopBar + formatAutosaveStatus status pill
    → Optional: member cloud repository (NOT default open3d autosave path)
```

**Session envelope:** `open3d-1` via `buildOpen3dSessionEnvelope` / `parseOpen3dSessionSnapshot`.  
**Tech:** Next.js site · Vitest · Playwright under `results/planner/world-standard-wave/06-save-honesty/`.

### 4.3 Ground-truth debt table (plan baseline — planning expert 2026-07-09)

These were **measured** at plan time. Execution agents re-verify; some items may already be partially fixed in tree (see §5 live re-read).

| Fact | Path | Honesty note |
|------|------|--------------|
| Autosave hook IDB-only | `useOpen3dWorkspaceAutosave.ts` | createAutoSaver / loadProject / migrateGuest — no cloud call |
| Debounce 5000 ms | `AUTO_SAVE_DEBOUNCE_MS` | Leave inside window can drop latest edits without flush |
| AutoSaver was schedule+cancel only | `createAutoSaver` | No flush → unmount cancel loses debounce |
| Double-gate skip after timer | `lastSaved < DEBOUNCE` inside timeout | Could no-op scheduled write |
| No pagehide / visibility flush | open3d path | Leave unprotected |
| Dual status surfaces | TopBar + `formatAutosaveStatus` | Both could show bare **Saved** |
| Shell JSDoc “synced to server” | `WorkspaceShell.tsx` | Lie if IDB-only |
| Manual Save = schedule only | `handleSave` | Debounced, not immediate |
| Hydration race | `hydrated` true early; restore async | Seed/flush before restore races default room |
| Continuity unit only | `saveReloadContinuity.test.ts` | JSON round-trip ≠ browser IDB hard reload |
| Shallow autosave unit | `planner-autosave.test.ts` | Shape/cancel only historically |
| Help over-claim | `helpSections.ts` | “members keep named save slots in their account” |
| Fabric honest indicator not mounted | `PlannerSaveIndicator.tsx` | Pattern only for open3d |

### 4.4 Expert P0 (from plan header + 01-react-open3d)

1. **`createAutoSaver.flush`** + retain pending snapshot / **projectRef** so leave does not drop debounce.  
2. **Dual-surface labels (W6):** TopBar + member `formatAutosaveStatus` — no bare Saved; Shell “server” language is a lie.  
3. **Hydration race:** wait restore-complete before seed/flush in E2E.  
4. **Evidence:** `06-save-honesty/save-reload/` hard-reload same wall/furniture **ids**.  

False-reverse traps (01-react-open3d):

| Trap | Why fatal |
|------|-----------|
| Leave-path still `cancel()` without flush | W5 hard-reload flaky forever |
| Bare “Saved” / `isSynced` as cloud | W6 lie; buyer trusts account backup that is IDB |

### 4.5 Scope in / out

**In scope**

1. Flush on leave — AutoSaver flush API + hook; unmount, pagehide/visibility hidden, explicit Save.  
2. W5 hard-reload proof — Playwright preferred; artifacts under `save-reload/`.  
3. W6 honest labels — TopBar + status pill + toasts + help; **one pure label source**.  
4. Unit tests — flush semantics, labels table-driven, envelope non-regression.  
5. Evidence pack under `06-save-honesty/`.

**Out of scope**

- Full Supabase multi-tenant catalog migration  
- Fabric full-stage cutover  
- Multiplayer / CRDT  
- Photoreal mesh (W7) / shortcut chrome (W8) except shared status pill  
- Rewriting archived fabric session handlers as live open3d path  
- Claiming “cloud save works” without live wire + test in same phase  

### 4.6 Cloud decision matrix (locked default)

| Option | When | W6 requirement |
|--------|------|----------------|
| **Local-only honesty (default)** | Cloud not product-ready | “Saved locally”, “Saving locally…”, “Local save failed”; help: browser storage; **no** account sync claims |
| **Cloud wire slice** | Owner orders account save same unlock | Wire member plan repository after local-first; local + cloud states **separate**; proof both paths |

Default execution: **local-only + flush + hard reload**.

### 4.7 Label contract (copy law)

#### Storage tiers

| Machine key | Human label (EN) | When true |
|-------------|------------------|-----------|
| `storage: "local"` | “Saved locally” / “Saving locally…” / “Local save failed” | IDB `saveProject` success / in flight / error |
| `storage: "cloud"` | “Saved to account” / “Saving to account…” / “Account save failed” | Authenticated cloud API success path **actually called** and ok |
| Dirty | “Unsaved changes” | Local document newer than last successful local write |
| Idle ready | “Ready” / “Ready (local)” | No edits since load; nothing pending |

#### Forbidden while cloud unwired

- Bare **“Saved”** without “locally”  
- **“Synced”** / server language as user-facing success  
- Help: “members keep named save slots in their account” unless cloud proven  
- Toast: “Saving plan…” implying server when only IDB  

#### Pure helper shape (plan contract)

```ts
export type Open3dPersistStorage = "local" | "cloud";
export type Open3dSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export function open3dSaveStatusLabel(input: {
  status: Open3dSaveStatus;
  storage: Open3dPersistStorage;
  lastSavedAt: string | null;
  cloudEnabled: boolean;
  guestMode?: boolean;
}): string
```

Rules:

- If `cloudEnabled === false`, treat storage as local for labels after local write.  
- Never “Saved to account” when cloud disabled.  
- Never bare `"Saved"` for local (prefer “Saved locally” / guest “Draft saved locally”).  
- **One table only** — TopBar + status bar both consume it.  

Guest nuance table (plan + suggestions):

| Status | Guest | Member (local-only) |
|--------|-------|---------------------|
| saving | Saving locally… | Saving locally… |
| saved | Draft saved locally | Saved locally |
| unsaved | Unsaved draft | Unsaved changes |
| error | Save failed / Local save failed | same |
| idle | Guest session (local) | Ready (local) |

### 4.8 Flush contract (W5 enabler)

#### createAutoSaver

| Method | Behavior |
|--------|----------|
| `scheduleSave(snapshot)` | Store **last pending snapshot**; debounced write |
| `flush(snapshot?)` | Immediate write of arg or last pending; clear timer; await IDB; onSaved/onError; no-op if nothing |
| `cancel()` | Abort pending debounce **without** write |
| `dispose()` (prefer) | flush then deactivate — or document flush-before-cancel |

Internals: `pendingSnapshot` updated every schedule; clear after successful write or cancel.  
**Flush path must not** apply double-gate skip that can drop writes.

#### Hook surface

| Export | Behavior |
|--------|----------|
| status, lastSavedAt, isModified | Keep |
| isSynced | **Deprecate for UI** — rename `isLocalSaved` or stop meaning “server” |
| schedulePersist | Debounced; latest project via **ref** |
| flushPersist(): Promise\<void\> | Envelope from projectRef; saver.flush |
| storage / cloudEnabled | Explicit; default cloudEnabled=false |

Leave wiring (`OOPlannerWorkspace` / hook):

1. `pagehide` → flush  
2. `visibilitychange` hidden → flush  
3. Unmount: flush **before** cancel  
4. Save button: flushPersist immediate  
5. Toasts: “Saving draft locally…” / “Plan saved locally” — never bare “Saving plan…” as account  

E2E waits status pill / testid, not blind 5s sleep.

### 4.9 Task sequence (execute order — do not reorder casually)

| Task | Purpose |
|------|---------|
| **00** | Evidence dirs + baseline vitest logs (continuity + autosave) |
| **01** | TDD AutoSaver flush + debounce gate fix |
| **02** | TDD single label helper (W6 pure) |
| **03** | Hook flushPersist + leave listeners + isLocalSaved |
| **04** | TopBar **and** status-bar UI + testids + Shell honesty |
| **05** | Help / FAQ copy audit + grep artifact |
| **06** | W5 hard reload Playwright under `save-reload/` |
| **07** | Optional cloud wire (default **cancel** with reason) |
| **08** | Evidence pack + CP-06 checkboxes |

### 4.10 W5 browser scenario (canonical)

**Default route:** `/planner/guest/?plannerDevTools=1`  
**Helpers:** `enterGuestPlannerWorkspace` / `clearPlannerStorage` (deletes `planner-workspace-db`) — note: hard-reload E2E must **not** re-wipe IDB on every navigation (one-shot clear).

Steps:

1. Clean storage once.  
2. **Wait restore-complete** before seed.  
3. Seed one wall + one furniture with **stable known ids** (import JSON preferred; draw journey is P07). Capture ids via export JSON or test hook.  
4. Click **Save** (flush); wait `data-status="saved"` + `data-storage="local"` (or body text contract if testids lag).  
5. Hard reload.  
6. Wait restore-complete again.  
7. Assert **same wall id(s)** and **furniture id(s)**.  
8. PNGs → `save-reload/`: `01-before-save.png`, `02-saved-local.png`, `03-after-hard-reload.png`.  
9. `06-browser-run.json` (exitCode, wallId, furnitureId, route, browser, cloudEnabled).

**Fallback:** chrome-devtools scripted session; W5 stays yellow until Playwright CI-able form.

### 4.11 Project id facts (must not drift)

| Mode | Project id pattern |
|------|--------------------|
| Guest | `planner-guest-local` (via `getPlannerProjectId`) |
| Member | `planner-member-local` or `planner-member-local:{planId}` |

Restore after reload **must** use same id. Guest claim → member migrate must not wipe non-empty member snapshot (existing honesty rule).

### 4.12 Risk register (phase)

| Risk | Mitigation |
|------|------------|
| 5s debounce loses work on leave | Flush on hide/unmount/Save; pending snapshot |
| Stale project on leave flush | projectRef.current always latest |
| Restore races default room | Wait restore-complete; optional schedule gate |
| Playwright flaky draw | Import JSON / proven place path for id proof |
| Dual status surfaces drift | One pure helper |
| Cloud half-wire lies | Default local-only; Task 07 gated |
| cancel races flush | Always flush then dispose |
| Help/toast still claims account | Task 05 + message strings |
| Evidence misplaced | W5 only under `save-reload/` |

### 4.13 CP-06 hard stop checklist

- [ ] **CP-06.1** Flush exists + unit log  
- [ ] **CP-06.2** Leave path flushes Save / pagehide / visibility / unmount  
- [ ] **CP-06.3** W5 browser: same wall id + furniture id; PNGs + run.json under `save-reload/`  
- [ ] **CP-06.4** W6 copy: TopBar + status bar + help + toasts; no bare Saved; grep clean  
- [ ] **CP-06.5** Selectors: `data-testid="open3d-save-status"` + `data-storage` + `data-status`  
- [ ] **CP-06.6** Types: no new `any`  
- [ ] **CP-06.7** Commits on main checkout (no worktrees)  
- [ ] **CP-06.8** Cloud Task 07 cancelled with NOTES **or** dual-status tests green  
- [ ] **CP-06.9** Dual surfaces share pure helper; Shell not “server sync”  

**Unlock next:** P07 may rely on flush + status pill; no P07 save assertions until CP-06.3 green.

### 4.14 Definition of done

| Gate | Definition |
|------|------------|
| **W5** | Seed → flush → hard reload → walls + furniture **ids** match; proof in `save-reload/` |
| **W6** | TopBar + status bar + help + toasts state local vs cloud truthfully; default local-only; **no bare “Saved”** |
| **Evidence** | Shared pack + W5 subfolder |
| **Honesty** | No string a facilities buyer misreads as cloud backup if only IDB ran |

---

## 5. Live tree re-read (facts for brainstorm honesty — 2026-07-10)

This section is **measured from code at report time**, not from stale plan prose. Use it to know what is already landed vs residual debt. Re-verify before claiming CP-06.

### 5.1 What appears landed

| Area | Observation |
|------|-------------|
| AutoSaver `flush` + `pendingSnapshot` | Present in `persistence.ts` |
| pagehide / visibility hidden flush | Registered in `useOpen3dWorkspaceAutosave` |
| Unmount flush-before-cancel | `flush()?.finally(() => cancel())` pattern present |
| `flushPersist` on hook | Present; Save path calls it from workspace |
| Status labels local wording | `formatAutosaveStatus`: “Saved locally”, “Saving locally…”, guest draft wording |
| TopBar | Shows “Saved locally” when isSynced && !isModified |
| E2E file | `site/tests/e2e/open3d-save-honesty.spec.ts` exists — guest place 4 seats → Save draft → hard reload → furniture **count** restore |
| PlannerSaveIndicator | Still dual-state model (local + sync) for fabric path — pattern inventory for future cloud |

### 5.2 Residual risks / incomplete vs plan contract

| Residual | Why it still matters |
|----------|----------------------|
| **Help still over-claims** | `helpSections.ts` summary/FAQ still: “members keep named save slots in their account” — **W6 red** until fixed or cloud true |
| **`isSynced` naming** | Still exported and passed TopBar/Shell; TopBar `data-synced` attribute; Shell may still carry server JSDoc — rename debt |
| **No `data-testid="open3d-save-status"` / `data-storage` / `data-status`** on TopBar pill (as of read) | E2E falls back to body text regex; CP-06.5 incomplete |
| **flushPersist builds from render `project` closure**, not a dedicated projectRef | Leave listeners flush **pendingSnapshot on saver** (good), but explicit flushPersist may still be one render behind extreme thrash — plan wanted projectRef always |
| **schedulePersist same closure** | Debounce uses project at schedule time; projectRef would harden leave flush of latest envelope |
| **Double-gate remnant** | Timer path still has `now - lastSaved < DEBOUNCE` condition (partially neutered by still saving pending) — unit tests must prove no silent drop |
| **W5 asserts furniture count, not entity ids** | Plan / W5 gate language says **ids**. Count restore is strong smoke but **weaker than UUID equality**. Raise to id assert via export JSON channel when possible |
| **Hydration / restore race** | Still a design risk; E2E polls furniture count after reload (pragmatic) |
| **Evidence folder** | `results/planner/` **absent** in this checkout at write time — cannot treat W5 green without artifacts on disk |
| **cloudEnabled not exported** | Hook does not yet surface storage/cloudEnabled for dual-tier labels |
| **00-PENDING “GATE PASS”** | May refer to another machine’s evidence pack; **this workspace must re-prove** |

### 5.3 Live honesty scorecard (brainstorm judgment)

| Concern | Research (07-09) | Live (07-10 code read) | Verdict for agents |
|---------|------------------|------------------------|--------------------|
| IDB autosave exists | Yes | Yes | Keep |
| Flush API | Missing | Present | Verify with unit logs |
| Leave flush | Missing | Present | Verify unmount order tests |
| Local labels (TopBar + status) | Bare Saved risk | “Saved locally” / guest draft | **Help still lies** |
| W5 hard reload ids | Open | E2E count-based | **Raise to ids + evidence on disk** |
| Cloud | Unwired | Still unwired | Local-only default |
| Multiplayer | Out | Out | Stay out |

---

## 6. Design synthesis — what “good” looks like for O&O

### 6.1 Mental model for the buyer

```
┌─────────────────────────────────────────────────────────┐
│  Document (UUIDs for walls, openings, furniture)        │
│       │                                                 │
│       ▼                                                 │
│  Local durable store (IndexedDB planner-workspace-db)   │  ← always first
│       │                                                 │
│       ▼ (optional later, authenticated)                 │
│  Account cloud (member plan repository)                 │  ← only if wired + acked
└─────────────────────────────────────────────────────────┘

Status chrome must name which layer(s) succeeded.
```

### 6.2 Three approaches for remaining work

| Approach | Description | Pros | Cons | Recommendation |
|----------|-------------|------|------|----------------|
| **A — Local-first honesty complete** | Finish flush correctness, dual labels, help rewrite, id-level W5, evidence pack; cloudEnabled=false | Matches owner residual; ship trust; no half-cloud | Multi-device still absent | **Recommended for P06** |
| **B — Local + cloud wire same phase** | A + Task 07 member repository after local flush; dual chips | Meets category cloud bar faster | Scope thrash; secrets; conflict policy; stalls W5 | Only if owner unlocks |
| **C — Status theater only** | Change strings without flush/id proof | Looks honest in screenshots | W5 still red; “return tomorrow” fails | **Reject** |

**Recommendation:** Approach **A**. Research says world bar is cloud+multi-device, but **honesty before aspiration**. Lying “Synced” is worse than honest “Saved locally”. Cloud is a **follow-on** program (post-CP-06), not a half-merge into labels.

### 6.3 Dual-status chrome (target UX — original O&O)

When cloud still off (default):

```
[ ● Modified ]     or  [ ✓ Saved locally ]
[ Saving locally… ]
[ Save draft / Save ]   ← flush now
```

Status bar (secondary):

```
Draft saved locally · 14:02
```

When cloud lands later (not P06 default):

```
Local · Saved 14:02   |   Account · Pending
Local · Saved 14:02   |   Account · Synced
Local · Saved 14:02   |   Account · Failed (retry)
```

Dual failure rule (from plan Task 07): **local success + cloud fail** → never hide local success.

### 6.4 Fabric PlannerSaveIndicator as pattern inventory (not live open3d)

Archive/fabric indicator already encodes:

- `saving_local` → “Saving locally…”  
- `local_save_failed` → “Local save failed”  
- `syncing` → “Syncing to cloud…”  
- `sync_failed` / `conflict` / `queued`  
- Relative time on local saved  

**Use:** copy-table ideas for future dual envelope. **Do not** wholesale mount fabric TopBar into open3d.

### 6.5 Guest vs member product story

| Mode | Storage identity | Label tone | Claim later |
|------|------------------|------------|-------------|
| Guest | Browser IDB, guest project id | “Draft… locally” | Claim → migrate to member without clobber |
| Member local-only | Browser IDB, member project id | “Plan/Saved locally” | No account slots until cloud |
| Member + cloud | IDB + server | Separate chips | Multi-device open |

Guest zero-friction is industry pattern (P5D free start). O&O already uses guest route for W proof — keep it.

### 6.6 Relation to export / BOQ

Research: “Save/collab means nothing if export fails.” P06 does not own BOQ world bar, but:

- W5 document after reload must be the **same** document export would use.  
- Guest TopBar export JSON is a **recovery hatch** when cloud absent (Floorplanner FML-as-local-backup pattern, original JSON implementation).

### 6.7 Relation to multiplayer (explicit non-goal)

| Competitor | Collab model |
|------------|--------------|
| Planner5D | Live multiplayer cursors |
| Floorplanner | 14-day edit grant |
| Homestyler / RoomSketcher Team | Seats / serialized edit |
| Figma | Class-leading OT/CRDT |

P06: **none of these**. Status must never show fake presence. Share link view-only is interim multiplayer≥2 later, not this phase.

---

## 7. Implementation design (for execute agents — still no code here)

### 7.1 Target file map

| Role | Absolute path |
|------|----------------|
| Autosave hook | `D:\OandO07072026\site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts` |
| IDB + AutoSaver | `D:\OandO07072026\site\features\planner\persistence\persistence.ts` |
| Session envelope | `…\open3d\persistence\open3dSession.ts` |
| Project JSON | `…\open3d\persistence\projectJson.ts` |
| Workspace | `…\open3d\editor\OOPlannerWorkspace.tsx` |
| TopBar | `…\open3d\editor\TopBar.tsx` |
| Status labels | `…\open3d\editor\workspaceStatusLabels.ts` |
| Shell | `…\open3d\editor\WorkspaceShell.tsx` |
| Help | `D:\OandO07072026\site\features\planner\help\helpSections.ts` |
| Optional cloud | `memberPlanRepository.ts`, `guestPromotion.ts`, `plannerCloudApi.ts` |
| Unit autosave | `site/tests/unit/planner-autosave.test.ts` |
| Unit labels | `site/tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts` |
| Unit continuity | `site/tests/unit/features/planner/open3d/saveReloadContinuity.test.ts` |
| E2E W5 | `site/tests/e2e/open3d-save-honesty.spec.ts` |
| E2E helpers | `guestProjectSetup.ts`, `plannerCanvasHelpers.ts` |

### 7.2 Recommended residual fix order (if executing from this report)

1. **Help + toast + grep (W6 pure copy)** — cheapest, currently still red on help.  
2. **Selectors + single helper export surface** — TopBar testids; kill bare/ambiguous Ready vs local wording consistency.  
3. **projectRef hardening** on hook for schedule/flush.  
4. **Unit pack** flush / double-gate / labels table — evidence logs.  
5. **W5 raise:** assert wall + furniture **ids** (export channel), not only counts; write `save-reload/` artifacts.  
6. **Shell rename** isSynced → isLocalSaved + JSDoc rewrite.  
7. **Task 07 cancel** with NOTES unless owner unlocks cloud.  
8. **CP-06 pack** — no green claim without paths.

### 7.3 Test matrix

| Layer | What | Pass criterion |
|-------|------|----------------|
| Unit | AutoSaver flush / cancel / debounce + pending | Immediate flush writes; cancel drops; no silent skip |
| Unit | Shared label helper | Every status × storage; bare Saved forbidden for local |
| Unit | Envelope continuity | saveReloadContinuity green |
| Component | TopBar + status + Shell | data-storage=local; no server sync wording |
| E2E | Hard reload `save-reload/` | Same wall + furniture **ids** (count is interim smoke only) |
| Copy | Grep | No account/cloud lie while cloudEnabled=false |

Commands (from plan — preserve full logs under evidence):

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/planner-autosave.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\01-autosave-flush-vitest.log

npx playwright test tests/e2e/open3d-save-honesty.spec.ts --reporter=line 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\06-save-honesty\save-reload\06-playwright-raw.log
```

### 7.4 Evidence pack minimum

| Artifact | Purpose |
|----------|---------|
| `00-baseline-run.json` + log | Baseline |
| `01-autosave-flush-vitest.log` | Flush |
| Label unit log | W6 pure |
| Hook/TopBar unit logs | Wiring |
| `05-copy-grep.txt` | No-lie audit |
| `save-reload/06-playwright-raw.log` | W5 |
| `save-reload/01-before-save.png` … `03-after-hard-reload.png` | Visual W5 |
| `save-reload/06-browser-run.json` | Ids, route, cloudEnabled |
| `NOTES.md` | HEAD, commands, id channel |

### 7.5 Skills / process

- `/using-superpowers`  
- TDD for flush + labels  
- verification-before-completion before CP-06 claim  
- systematic-debugging if restore flaky  
- chrome-devtools only if Playwright blocked  
- **No worktrees** · checkout `D:\OandO07072026` only  
- Commit landable slices · push per owner/git rules  

---

## 8. Anti-copy fence (binding)

### Allowed (patterns)

- Explicit Save + autosave combination  
- Version history idea (later)  
- Local backup download (JSON)  
- Local vs cloud dual status chips  
- “Wait for sync before switching devices” **policy** when cloud exists  
- Guest start then claim  
- Status bar live region for save state  
- Time-boxed share / seats as **future** collab (not now)

### Forbidden

- Competitor chrome, icons, colors, mascots, copy  
- Fake multiplayer / presence  
- Claiming cloud/multi-device without ack  
- Porting competitor JS or project formats (FML reverse-engineer)  
- Manual-save-only primary UX (IKEA anti-pattern)  
- Photoreal export as substitute for durable plan identity  

Ethics files: `planner5d.com/report/ETHICS_AND_INSPIRATION.md`, Floorplanner anti-copy section, RoomSketcher original verbs list.

---

## 9. Approaches detail for W5 proof quality

### 9.1 What to seed

| Method | Pros | Cons | Use |
|--------|------|------|-----|
| Import JSON with known UUIDs | Deterministic id assert | Needs import UI/harness | **Best for W5 ids** |
| Configurator place N seats | Proven path (current e2e) | Count ≠ ids; new ids each run | Smoke OK; raise later |
| Draw wall tools | Full product journey | Flaky; P07 owns journey | Secondary |

### 9.2 Id capture channels

1. Export project JSON after seed → parse wall/furniture ids → save to run.json.  
2. After reload, export again → deep equality on id sets.  
3. Optional test hooks: `data-entity-id` on canvas (heavier).  

**Minimum W5 plan language:** same wall + furniture **ids**, not “something still there.”

### 9.3 Restore race handling

| Strategy | Notes |
|----------|-------|
| Poll entity counts/ids after reload | Current e2e style |
| `data-restore="complete"` test hook | Stronger; implement if flaky |
| Gate autosave until restore settled | Prevents default room overwrite |

### 9.4 Storage clear discipline

| Wrong | Right |
|-------|-------|
| Init-script wipe on every load | One-shot clear before seed only |
| clearPlannerStorage that re-runs after reload | Preserve IDB across hard reload |

Current e2e comment already encodes this lesson — keep it.

---

## 10. W6 copy inventory (audit checklist)

Agents must grep and fix; evidence `05-copy-grep.txt`.

### 10.1 Surfaces

| Surface | File / area | Forbidden if local-only |
|---------|-------------|-------------------------|
| TopBar pill | `TopBar.tsx` | Bare Saved; Synced-as-server |
| Status bar pill | `formatAutosaveStatus` | Bare Saved for member |
| Shell props/docs | `WorkspaceShell.tsx` | “synced to server” |
| Save toasts / messages | `OOPlannerWorkspace` handleSave | Bare “Saving plan…” as account |
| Help saving section | `helpSections.ts` | Account named slots claim |
| FAQ how plans saved | same | Same lie |
| Guest CTA | TopBar / help | Must not promise cloud |
| data attributes | `data-synced` alone | Prefer data-storage + data-status |

### 10.2 Suggested honest help copy (original — not competitor)

> Plans autosave in **this browser** (local storage). Clearing site data removes them. Account cloud save is not enabled for the open3d planner yet — your plan is stored locally on this device.

FAQ mirror same truth. Only add account sentence after Task 07 proven.

### 10.3 Toast table

| Event | Guest | Member local-only |
|-------|-------|-------------------|
| Save click | Saving draft locally… | Saving plan locally… |
| Success | Draft saved locally | Plan saved locally |
| Failure | Local save failed | Local save failed |

---

## 11. Cloud later design sketch (not P06 default)

Only if owner unlocks Task 07:

### 11.1 Order of operations

1. Always flush local first.  
2. Then authenticated cloud save.  
3. Status transitions: local saved → account saving → account saved / failed.  
4. Never flip cloud success on local-only write.

### 11.2 Conflict policy (document before ship)

| Case | Policy proposal |
|------|-----------------|
| Device A offline edits; Device B online saves; A reconnects | Prompt: local newer vs server newer; no silent overwrite |
| Cloud fail | Keep local; show Account failed + retry |
| Guest promote | migrateGuestProjectToMember without clobber non-empty member |

P5D public warning about overwrite is the **lesson**, not their UX.

### 11.3 Multi-device acceptance (post-P06)

Login device B → latest cloud revision; optional “local newer than cloud” merge prompt.

### 11.4 SSR

Unrelated to client IDB honesty. SSR for shared URL later per `03-SSR-CLOUD.md`. Do not conflate host provision with W6.

---

## 12. Cross-phase dependencies

| Phase | Dependency on P06 | P06 dependency on them |
|-------|-------------------|------------------------|
| P01 product truth | Honesty language | Status claims re-proven |
| P02 engine lock | Document model UUID rule | Persist same document |
| P03 select/delete | Entities must survive reload | — |
| P04 orbit | Same document after restore | Pose continuity after W5 optional assert |
| P05 symbols | Symbols rehydrate from same entities | — |
| **P07 journey** | Must not assert save until CP-06.3 | Prefer P07 place for journey; P06 can use configurator/import |
| P08 mesh | Mesh rebuilds from document | Save preserves SKU ids |
| P09 shortcuts | Ctrl+S → flush if wired | Optional |
| P10 handover | Cite `06-save-honesty/` | — |

---

## 13. Decision log (brainstormer recommendations)

| # | Decision | Choice | Why |
|---|----------|--------|-----|
| D1 | Storage primary for W5–W6 | IndexedDB local | Works offline; proven path; category cloud is next bar not first honesty |
| D2 | Cloud in same phase | **No** unless owner unlocks | Avoid half-wire lies |
| D3 | Primary leave protection | flush + pending snapshot | 5s debounce alone fails W5 |
| D4 | Explicit Save | Immediate flush | Floorplanner-style control without IKEA manual-only trap |
| D5 | Label policy | Always qualify “locally” until cloudEnabled | Buyer trust |
| D6 | Dual UI surfaces | One pure helper | Prevent TopBar/status drift |
| D7 | W5 proof quality | Prefer UUID equality | Count is smoke; gate language is ids |
| D8 | Default E2E route | Guest + plannerDevTools | Clean IDB helpers |
| D9 | Multiplayer | Out of scope | Research: rare; Figma is reference only |
| D10 | Competitor research use | Patterns only | Ethics binding |

---

## 14. Suggested agent brief (handover lines)

```
P06 save honesty — Tasks 00→08; default cloudEnabled=false.
Honest local labels on TopBar AND status bar AND help AND toasts.
One pure label helper; no bare “Saved”; Shell not “server synced”.
Flush before cancel; projectRef + pending snapshot; W5 = hard reload not unit JSON.
W5 evidence: results/planner/world-standard-wave/06-save-honesty/save-reload/
Prefer id equality over furniture count alone.
Guest: /planner/guest/?plannerDevTools=1; wait restore before seed.
Help: rewrite account slot claims until cloud wire.
CP-06 hard stop before W5–W6 green claim.
Superpowers + TDD; no worktrees; commit slices.
```

---

## 15. Appendix A — Source index (absolute paths)

### A.1 Websites research

| Path | Use |
|------|-----|
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Pattern library |
| `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\REPORT.md` | Save/collab matrix |
| `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\SCORES.csv` | Scores |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Who wins save |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | Brutal self score |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | Save/version/FML patterns |
| `D:\websites\floorplanner.com\raw\…FloorplannerManualEN.pdf.md` | Manual save/version |
| `D:\websites\floorplanner.com\raw\…version+180219.pdf.md` | Collaborate grant; FML backup |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Cloud projects; collab |
| `D:\websites\planner5d.com\report\TOOLBARS.md` | Top bar save region |
| `D:\websites\planner5d.com\raw\planner5d.com-collaboration-tool.md` | Multiplayer marketing |
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | Cloud slogans; W5–W6 translation |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | Account/team patterns (thin) |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | Save design later; manual save anti-pattern |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-*.md` | Status bar / top save |

### A.2 Plans Research

| Path | Use |
|------|-----|
| `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` | P06 routing |
| `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` | Evidence contract |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE.md` | Keep dual gate one phase |
| `D:\OandO07072026\Plans\Research\Others\00-PENDING.md` | Residuals; gate PASS ≠ finished |
| `D:\OandO07072026\Plans\Research\Others\03-SSR-CLOUD.md` | Cloud host deferral |

### A.3 Phase + spec

| Path | Use |
|------|-----|
| `D:\OandO07072026\Plans\phases\P06-save-honesty\P06-save-honesty.md` | Normative execute |
| `D:\OandO07072026\Plans\phases\P06-save-honesty\P06-suggestions.md` | Measured debt S1–S10 |
| `D:\OandO07072026\Plans\phases\P06-save-honesty\01-react-open3d.md` | P0 false-reverse |
| `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` | W5 W6 gates |

### A.4 Live code anchors (re-read at execute)

| Path | Use |
|------|-----|
| `site/features/planner/persistence/persistence.ts` | AutoSaver |
| `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | Hook |
| `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | Labels |
| `site/features/planner/open3d/editor/TopBar.tsx` | Top save UI |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Wiring |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | Passthrough |
| `site/features/planner/help/helpSections.ts` | Help honesty |
| `site/features/planner/ui/PlannerSaveIndicator.tsx` | Dual-state pattern |
| `site/tests/e2e/open3d-save-honesty.spec.ts` | W5 browser |

---

## 16. Appendix B — Score translation into O&O target trajectory

| Dimension | Research O&O | P06 target | Later (post-P06) |
|-----------|-------------:|------------|------------------|
| Autosave | 3 | ≥4 (flush + leave safe) | 5 continuous + cloud |
| Cloud | 1 | Stay 1 but **honest** | ≥4 wired |
| Multi-device | 1 | Stay 1; do not claim | ≥4 |
| Multiplayer | 1 | Stay 1; do not claim | seats → then live |
| Offline | 4 | Keep ≥4 | + cloud queue |
| Export | 2 | Unchanged (adjacent) | ≥4 with reload stability |

**Honesty is free points in trust and zero points if faked.** Raising cloud score without labels is how products burn buyers.

---

## 17. Appendix C — Full label decision table (local-only default)

| status | guestMode | cloudEnabled | storage | Output string |
|--------|-----------|--------------|---------|---------------|
| idle | true | false | local | Guest session (local) |
| idle | false | false | local | Ready (local) |
| unsaved | true | false | local | Unsaved draft |
| unsaved | false | false | local | Unsaved changes |
| saving | * | false | local | Saving locally… |
| saved | true | false | local | Draft saved locally |
| saved | false | false | local | Saved locally |
| error | * | false | local | Local save failed *(or Save failed if less verbose)* |
| saved | false | true | cloud | Saved to account *(only after server ack)* |
| saving | false | true | cloud | Saving to account… |
| error | false | true | cloud | Account save failed *(with local retained messaging if dual)* |

**Forbidden outputs for local-only:** `Saved`, `Synced`, `Synced to server`, `Saved to cloud`, `Saved to account`, `Cloud OK`.

---

## 18. Appendix D — Failure modes catalog

| Failure | User-visible truth | Engineering response |
|---------|-------------------|----------------------|
| IDB quota exceeded | Local save failed | onError; keep editing; no green Saved |
| Debounce interrupted by tab close | Should still flush on pagehide | flush pendingSnapshot |
| Unmount without flush | Data loss | flush before cancel |
| Restore after reload empty | Lost plan | Debug projectId mismatch; hydration race |
| Restore overwrites new edits | Ghost default room | Gate schedule until restore settled |
| Help says account; IDB only | Trust break | Rewrite help |
| Status Saved; write not acked | Trust break | status only after onSaved |
| Cloud fail after local ok | Must show local ok + account fail | Dual status |
| Guest claim overwrites member | Data loss | migrate guards |
| Playwright wipes IDB on reload | False W5 red | one-shot clear only |

---

## 19. Appendix E — CP-06 narrative proof sketch

When claiming green, NOTES.md should answer:

1. **What was flushed?** (envelope version open3d-1)  
2. **Where?** (IDB project id)  
3. **What ids survived?** (wall id list + furniture id list before/after)  
4. **What did the UI say?** (screenshot + string “Saved locally”)  
5. **Was cloud enabled?** (false)  
6. **Did help claim account slots?** (must be no)  
7. **HEAD commit** and test commands  
8. Paths under `06-save-honesty/` and `save-reload/`

If any answer is missing, **do not claim CP-06**.

---

## 20. Closing verdict

### 20.1 What industry teaches

Floor planners that feel “real” make **return tomorrow** a non-event: cloud archive (P5D, RoomSketcher, Floorplanner) or at least durable project identity. They differ on multiplayer (rare) and manual vs auto save (IKEA is the cautionary tale). Figma is the durability latency / status honesty reference, not a day-one collab requirement.

### 20.2 What O&O must ship for W5–W6

1. **Durable local autosave that flushes on leave and Save** — not hope-and-debounce.  
2. **Hard reload proof of entity identity** — walls + furniture ids, evidence under `save-reload/`.  
3. **Non-lying language everywhere** — TopBar, status bar, toasts, help, Shell docs.  
4. **Explicit local-only default** — cloud is a later, honest dual-status program.

### 20.3 What not to do

- Do not claim cloud/multi-device.  
- Do not stop at unit JSON continuity.  
- Do not leave help saying “named save slots in their account” while open3d is IDB-only.  
- Do not treat GATE PASS notes as substitute for evidence on this machine.  
- Do not open multiplayer.

### 20.4 Execute posture

The phase plan is already high quality (tasks, contracts, CP-06). Live code shows **partial land** of flush + local labels + e2e smoke. The brainstormer residual focus for any execute agent:

| Priority | Item |
|---------:|------|
| P0 | Help/FAQ honesty + copy grep artifact |
| P0 | Evidence pack on disk (`save-reload/` + run.json + PNGs) |
| P0 | W5 id equality (upgrade from count-only if still count-only) |
| P1 | testids data-storage/data-status; isSynced rename |
| P1 | projectRef on hook; unit flush proof logs |
| P2 | Task 07 cancel NOTES; dual-status design freeze for later |

**This report is complete for Idiots2 brainstormer 06/10. No product code was written. Next step for implementers: execute `Plans/phases/P06-save-honesty/P06-save-honesty.md` against live tree with TDD and CP-06 evidence — not against this document alone.**

---

*End of REPORT.md — P06 Save honesty (W5–W6). Patterns only from research; original O&O contracts for product.*
