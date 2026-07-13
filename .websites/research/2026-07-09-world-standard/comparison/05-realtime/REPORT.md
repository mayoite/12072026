# 05 — Realtime / Save / Collab / Multi-device

**Date:** 2026-07-09  
**Slice:** Save · cloud sync · multi-device · multiplayer · offline · export reliability  
**Score scale:** 1 = broken/missing · 3 = acceptable · 5 = class-leading (public product bar)  
**Ethics:** Patterns only — no competitor code, assets, or brand clones.  
**Sources:** Vendor help centers, product pages, manuals, Figma engineering posts; O&O from live repo honesty (`WAVE.md`, `DATA_FLOW.md`).

---

## Matrix (scores)

| Product | Autosave | Cloud | Multi-device | Multiplayer | Offline | Export |
|---------|----------|-------|-------------|-------------|---------|--------|
| Planner5D | 4 | 5 | 5 | 4 | 2 | 4 |
| RoomSketcher | 3 | 5 | 5 | 2 | 2 | 5 |
| Floorplanner | 3 | 5 | 4 | 2 | 1 | 5 |
| Homestyler | 3 | 4 | 4 | 2 | 1 | 4 |
| Figma *(collab bar ref only)* | 5 | 5 | 5 | 5 | 4 | 5 |
| IKEA | 1 | 3 | 2 | 1 | 1 | 3 |
| **O&O live** | **3** | **1** | **1** | **1** | **4** | **2** |

CSV: [`SCORES.csv`](./SCORES.csv) — columns: `product,autosave,cloud,multidevice,multiplayer,offline,export`.

---

## Product notes

### Planner5D — cloud autosave + real multiplayer (category leader)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Autosave** | 4 | Logged-in projects autosave after every change on all platforms; internet required for durable save. Guests cannot restore. |
| **Cloud** | 5 | Account-backed cloud storage is the system of record; backup + sync are first-class. |
| **Multi-device** | 5 | Explicit cross-device sync docs: same account + online; wait for sync before switching devices. |
| **Multiplayer** | 4 | Marketed real-time multiplayer: simultaneous edit, live updates, cursors, view/comment/edit roles, invite by link/email. Available on free for shared edit (editors need account). Not Figma-grade infra, but **best-in-class among floor planners**. |
| **Offline** | 2 | Offline edits only push after reconnect; opening the project on another online device first can **overwrite** offline work. |
| **Export** | 4 | Images / PDF / project export paths; paywalls and platform variance, but user-visible export is expected. |

**Pattern to steal (ideas only):** Honest online requirement + “wait a few seconds before close”; multiplayer as optional layer on top of cloud project, not instead of single-user save.

---

### RoomSketcher — cloud archive, team share, strong export (not live co-edit)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Autosave** | 3 | App UX emphasizes Save / project properties; reliability is cloud archive after save, not continuous Figma-style flush. |
| **Cloud** | 5 | Personal **project archive in the cloud**; app + web portal access. |
| **Multi-device** | 5 | Archive syncs across signed-in devices (desktop app ↔ tablet ↔ web). |
| **Multiplayer** | 2 | Team plan = multi-user logins + shared project access; **not** simultaneous multiplayer cursors. Collab is share/Live 3D presentation, not co-edit. |
| **Offline** | 2 | Native app can hold work locally, but durable multi-device story is online cloud; downloads need connectivity. |
| **Export** | 5 | Strong 2D/3D download/print path; Pro/Team bulk “all levels”; professional output bar. |

**Pattern:** Cloud project list as identity of “my work”; team = seats on shared archive, not OT/CRDT multiplayer.

---

### Floorplanner — explicit Save + cloud projects + collaborate handoff

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Autosave** | 3 | Editor chrome shows **Save** (with undo/redo); version history after saves. Not “invisible always-on” messaging. |
| **Cloud** | 5 | Projects live in Floorplanner cloud; FML download as optional local backup (paid levels). |
| **Multi-device** | 4 | Browser/account access to cloud projects across machines; less “native multi-app suite” than Planner5D/RoomSketcher. |
| **Multiplayer** | 2 | **Collaborate** = grant another person edit for a limited window / share viewer / Spaceplanner copy — sequential collab, not live multiplayer. Team plan = seats + shared assets, not cursors. |
| **Offline** | 1 | Web editor online-first; no marketed offline editing mode. |
| **Export** | 5 | Mature 2D/3D export ladder, product list, FML, embeds — export reliability is a product pillar. |

**Pattern:** Manual save + version history reduces “ghost overwrite” anxiety; collab as **time-boxed edit grant** is simpler than realtime.

---

### Homestyler — cloud account + team seats (no simultaneous edit)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Autosave** | 3 | Account projects persist in cloud; workflow assumes online session save (not marketed as offline-safe continuous autosave). |
| **Cloud** | 4 | Cloud designs + cross-platform apps; ecosystem is account-centric. |
| **Multi-device** | 4 | Cross-platform sync claimed (phone → tablet → desktop). |
| **Multiplayer** | 2 | Team license: members can work on the **same project**, but **not at the same time** (official forum). Share often duplicates design into recipient account. |
| **Offline** | 1 | Online design tool; no serious offline editor story. |
| **Export** | 4 | 2D image/PDF common; richer CAD/render exports gated. |

**Pattern:** Team “same project, lock/serialize editors” is the floor-plan industry default — cheaper than multiplayer, still multi-seat.

---

### Figma — collab bar reference only (not a floor planner competitor)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Autosave** | 5 | Continuous server durability; engineering goal ~95% of edits durable within ~600ms (WAL/journal era). |
| **Cloud** | 5 | File is cloud-native; no “forgot to save” primary path. |
| **Multi-device** | 5 | Same file, any signed-in browser/desktop client. |
| **Multiplayer** | 5 | **Class-leading** realtime multiplayer (presence, cursors, conflict handling). This is the **aspirational bar**, not the day-one O&O requirement. |
| **Offline** | 4 | Disconnect → local autosave; reconnect redownloads + reapplies offline edits. Help: autosave is a safeguard, not full offline product mode; multiplayer features offline-limited. |
| **Export** | 5 | Extremely reliable export/publish surface (different domain, still the UX bar for “I got my file out”). |

**Use for O&O:** Status copy honesty, latency of “Saved”, offline reapply model, **never** claim multiplayer until real presence exists.

---

### IKEA (Kreativ / planners) — manual save, shopping path, weak collab

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Autosave** | 1 | Official help: designs are **not automatically saved**; user must click Save / Save As. |
| **Cloud** | 3 | Saved designs under account “My designs” when logged in. |
| **Multi-device** | 2 | Intended via IKEA account; user reports of scan/design sync friction app ↔ browser. |
| **Multiplayer** | 1 | No co-edit; single shopper flow. |
| **Offline** | 1 | Planner sessions expect connectivity; not offline-first. |
| **Export** | 3 | Design codes, shopping lists, planner-specific outputs — reliable for **buy path**, weak as open project interchange. |

**Pattern:** Retail planners optimize **cart/list export**, not multiplayer. Manual save is a UX anti-pattern O&O should not copy.

---

### O&O live — honest IDB-only (do not claim cloud)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **Autosave** | 3 | Real local autosave: IndexedDB (`planner-workspace-db`), ~5s debounce, history cap; guest + member **local** IDs. Works without network. |
| **Cloud** | 1 | Cloud client/API paths exist in architecture notes, but **live product truth:** member “Saved” is **local IDB only**; cloud save unwired / dead code (WAVE 2026-07-09). Showing cloud “Saved” would be a lie. |
| **Multi-device** | 1 | No working account sync of open3d/planner session across devices. |
| **Multiplayer** | 1 | Explicitly out of scope for world-standard design wave; no presence. |
| **Offline** | 4 | **Best offline durability among scored products for the open tab/device** — IDB + optional localStorage draft TTL. Strength is single-device resilience, not sync. |
| **Export** | 2 | JSON/document export paths in architecture; browser journey proof for save→reload still incomplete; BOQ/export reliability not world-bar yet. |

**Honesty rules already in repo:**

1. Failed persistence never shows `Saved`.
2. Guest claim must not overwrite non-empty member snapshot.
3. Do not market multi-device until cloud round-trip is live.

---

## Cross-product patterns (ideas only)

| Pattern | Who | O&O takeaway |
|---------|-----|----------------|
| Cloud = system of record after login | P5D, RS, FP, Homestyler | Minimum consumer bar for “my projects” |
| Autosave only while online | P5D | Acceptable if UI says **Local** vs **Synced** |
| Overwrite risk if multi-device before sync | P5D | Need device/session fencing or last-write rules |
| Realtime multiplayer rare in AEC lite | Only P5D approaches; Figma is reference | **Phase later** — seats/share first |
| Team seats without simultaneous edit | Homestyler, RoomSketcher Team, Floorplanner Team | Cheaper collab MVP |
| Time-boxed collaborate grant | Floorplanner | Simple sharing model |
| Manual save | IKEA, parts of Floorplanner | Avoid as primary; keep explicit **Save now** as secondary |
| Local-first offline | O&O today; Figma partial | Keep IDB; pair with honest status |
| Export as trust signal | RS, FP | Save/collab means nothing if export fails |

---

## O&O minimum bar (honest local vs cloud)

### Non-negotiable honesty

| UI claim | Allowed only when |
|----------|-------------------|
| **Saved** / **Local saved** | IndexedDB (or equivalent) write **acked** on this device |
| **Synced** / **Cloud saved** | Server PUT/POST **acked** for that plan id + revision |
| **Offline** | Network down; local queue still durable |
| **Sync failed** | Server error; local copy retained; retry visible |
| **Multiplayer** / presence | Real shared session; never fake avatars |

**Never:** green “Saved” that only means React state updated.  
**Never:** imply multi-device recovery while only `planner-member-local` IDB exists.

### Minimum product bar (consumer floor-planner parity)

Priority order for O&O — match **Planner5D/RoomSketcher cloud baseline**, not Figma multiplayer:

| # | Bar | Target score | Notes |
|---|-----|--------------|-------|
| 1 | **Durable local autosave** | ≥ 4 | Keep IDB; shorter debounce for critical ops; flush on `visibilitychange` / beforeunload |
| 2 | **Honest dual status** | — | Chip: `Local · 12:04` and `Cloud · Synced` / `Cloud · Pending` / `Cloud · Off` |
| 3 | **Cloud autosave after auth** | Cloud ≥ 4 | Wire member plan API; same document as IDB; conflict policy documented |
| 4 | **Multi-device open** | Multi-device ≥ 4 | Login on device B → latest cloud revision; optional “local newer than cloud” merge prompt |
| 5 | **Export reliability** | Export ≥ 4 | Save → reload → export bytes stable (W5 + export smoke) |
| 6 | **Offline continue** | Offline ≥ 3 | Edit offline; queue cloud ops; no silent drop |
| 7 | **Share link (view)** | Multiplayer ≥ 2 interim | Read-only share before realtime |
| 8 | **Realtime multiplayer** | Multiplayer 4–5 later | Figma-class; **not** minimum for world-standard furniture planner wedge |

### Stretch vs reject

| Do next | Defer |
|---------|--------|
| Cloud plan CRUD + status chrome | Figma-grade OT/CRDT multiplayer |
| Guest local → claim → cloud promote | Fake “team presence” |
| Explicit conflict: local vs server | Simultaneous edit locks theater without server |
| Export/BOQ from **same** persisted document | Manual-only save like IKEA |

### Minimum acceptance tests (save/collab slice)

1. Draw/place → wait autosave → hard reload → same wall/furniture ids (**local**).  
2. Login → wait **Cloud · Synced** → other browser/profile → same plan.  
3. Airplane mode → edit → still **Local saved** → online → **Cloud · Synced**.  
4. Kill network mid-save → never show cloud success; local retained.  
5. Export after reload matches pre-reload geometry counts.  
6. UI copy audit: zero strings that say cloud/sync while only IDB is wired.

---

## Verdict for O&O

- **Today’s real strength:** single-device offline durability (IDB). Score offline **4**, cloud/multi-device/multiplayer **1**.  
- **World bar for this category:** **cloud autosave + multi-device** (Planner5D / RoomSketcher), not multiplayer.  
- **Collab ceiling:** Figma is the multiplayer **reference only**; floor-plan peers mostly share, seat-share, or hand off edit.  
- **Next landable slice:** honest dual status + wired cloud save for members; keep local-first as the offline story, not a substitute for sync.

---

## File outputs

| File | Path |
|------|------|
| Report | `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\REPORT.md` |
| Scores | `D:\websites\research\2026-07-09-world-standard\comparison\05-realtime\SCORES.csv` |
