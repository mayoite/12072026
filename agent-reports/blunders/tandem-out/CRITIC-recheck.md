# CRITIC recheck — Perfect C4

**Date:** 2026-07-18 (same evening as fix list)  
**Role:** Extreme critic · no product code  
**Protocol:** `CRITIC-perfect-C4.md` § re-check only  
**Overall C4: FAIL** — browser place + BOQ not closed

---

## Parent claims vs critic-seen evidence

| Claim | Evidence this recheck | Result |
|-------|----------------------|--------|
| Re-publish multipath + dual-write | Script `site/scripts/critic-multipath-republish.ts`; disk SVG 18:26 multipath; live catalog points at new revision | **Accepted** |
| `c4GuestPlaceLoadRule` authority-aware | Source asserts revision API under `db`; place stamps revision URL; BOQ name·SKU. Critic re-ran: **3/3 pass** | **PASS** |
| `SVG_RELEASE_AUTHORITY=db` | `.env.local` has `db`; live `svg-blocks` all revision URLs (no `/svg-catalog/` desk) | **PASS** |

---

## Hard gate: multipath body (was FAIL)

**Lifted — critic-seen live GET, not parent report alone.**

| Check | Result |
|-------|--------|
| Catalog desk preview | `/api/planner/catalog/svg/oando-linear-desk-1600-r-e32912cb8d9f9516a1d2` |
| GET revision | **200** `image/svg+xml` len≈667 |
| `desk-top` / `pedestal-l` / `pedestal-r` | **all true** |
| Path count | **3** |
| UNION / boolean slab language | **absent** |
| Disk SVG same multipath | **true** (disk == live body) |
| Old Failures revision `…-r-c21c5863efda32467a4b` | **404** (superseded; do not cite as live) |

```text
# Critic fetch (this session)
GET http://localhost:3000/api/planner/catalog/svg-blocks/
  → oando-linear-desk-1600 | OANDO-LINEAR-DSK-1600
  → previewImageUrl = /api/planner/catalog/svg/oando-linear-desk-1600-r-e32912cb8d9f9516a1d2

GET http://localhost:3000/api/planner/catalog/svg/oando-linear-desk-1600-r-e32912cb8d9f9516a1d2/
  → multipath Maker plan: desk-top + pedestal-l + pedestal-r
```

**C1/C2 multipath body FAIL is lifted.** Parent may re-GET the same URL for dual confirmation; critic already saw multipath bytes. No further symbol-pipeline dig required for this slug unless a new publish re-slabs it.

---

## Domain scoreboard (A–G)

Binary domain roll-up. Sub-row notes only where needed.

### A. Authority — **PASS**

| # | Result | Note |
|---|--------|------|
| A1 | **PASS** | Env `db` + live catalog revision URLs (process under db) |
| A2 | **PASS** | Dual-write produced live revision `…-r-e32912cb8d9f9516a1d2` |
| A3 | **PASS** | Pointer is revision API, not disk-only costume |
| A4 | **PASS** | Guest catalog preview is revision family; no silent disk desk URL |
| A5 | **PASS** | Failures.md still OPEN on place+BOQ; no full cutover lie |

### B. Catalog — **PASS**

| # | Result | Note |
|---|--------|------|
| B1 | **PASS** | `svg-blocks` includes `oando-linear-desk-1600` |
| B2 | **PASS** | SKU `OANDO-LINEAR-DSK-1600` |
| B3 | **PASS** | revision preview URL under `db` |
| B4 | **PASS** | 23 items; all `oando-*`; zero sample/demo/OFL |
| B5 | **PASS** | Lifecycle live; guest catalog shows desk |
| B6 | **PASS** | Single revision preview URL family for desk (place stamp unit uses same family) |

### C. Symbol quality — **PASS** (multipath FAIL lifted)

| # | Result | Note |
|---|--------|------|
| C1 | **PASS** | Multipath, not UNION slab |
| C2 | **PASS** | `desk-top`, `pedestal-l`, `pedestal-r` present |
| C3 | **PASS** | Distinct fills for top vs pedestals in bytes |
| C4 | **PASS** | viewBox `0 0 1600 800`; widthMm 1600 |
| C5 | **PASS** | No `currentColor` in published body |
| C6 | **OPEN→bytes OK** | Thumb/canvas **paint** still needs place browser (domain D). Bytes are not Block2D. |
| C7 | **PASS** | Matches Maker multipath pen for locked fields |

**Domain C = PASS** on published symbol bytes. Canvas render honesty is D.

### D. Place — **FAIL**

| # | Result |
|---|--------|
| D1–D6 | **FAIL / not closed** — no parent-seen browser place at 1280 + 390 this gate |

Unit place stamp under `db` is green. **Unit ≠ browser.** Domain stays FAIL.

### E. BOQ — **FAIL**

| # | Result |
|---|--------|
| E1–E5 | **FAIL / not closed** — no browser BOQ name + SKU at 1280 + 390 |

Unit formats `Linear Desk 1600 · OANDO-LINEAR-DSK-1600`. Domain stays FAIL until browser.

### F. Security — **OPEN**

| # | Result |
|---|--------|
| F1–F5 | **OPEN** — not re-proved same session as place |

Not inventing work: one spot-check when closing browser is enough (guest cannot publish; revision GET guest-safe; no secrets; C4 unit fixture-only).

### G. Tests — **FAIL** (browser still required)

| # | Result | Note |
|---|--------|------|
| G1 | **PASS** | Authority-aware; no disk-only oracle under `db` |
| G2 | **PASS residual** | Maker/isolated multipath asserts exist; live revision multipath critic-proven. No new optional live-fetch test required for this recheck. |
| G3 | **PASS** | Place stamps revision URL + BOQ name·SKU (unit) |
| G4 | **PASS** | Critic re-ran `c4GuestPlaceLoadRule` → 3/3 exit 0 |
| G5 | **PASS** | No skips in that file |
| G6 | **FAIL** | Browser 1280 + 390 not closed |
| G7 | **OPEN** | `check:layout` required at final “C4 done” claim only |

**Domain G = FAIL** solely because G6 (browser) is still open. Unit side of fix list item 4 is closed.

---

## Scoreboard (now)

| Domain | Score |
|--------|-------|
| A Authority | **PASS** |
| B Catalog | **PASS** |
| C Symbol quality | **PASS** (multipath body FAIL lifted) |
| D Place | **FAIL** |
| E BOQ | **FAIL** |
| F Security | **OPEN** |
| G Tests | **FAIL** (browser G6 only) |

**C4 overall: FAIL** until D + E closed with parent-seen browser at both widths. Honest. No soft PASS.

---

## Exact remaining required steps (only)

1. **Browser C4** at `http://localhost:3000/planner/guest/` (never 127.0.0.1):  
   - Inventory thumb loads revision multipath (network 200).  
   - Place desk → Fabric paints multipath (not Block2D miss).  
   - BOQ/review line: human name + `OANDO-LINEAR-DSK-1600`.  
   - **1280 then 390.** Console errors = 0; failed SVG requests = 0.  
   - Parent-seen only.

2. **Security spot-check same session:** guest cannot publish; no client secrets; tests isolation intact.

3. **`pnpm run check:layout`** exit 0 before any “C4 done” claim.

4. **Honest status write:** Failures.md §6 update revision id to `oando-linear-desk-1600-r-e32912cb8d9f9516a1d2` (old `c21c…` is dead 404); mark place+BOQ PASS only after step 1 evidence. Commit verified slice.

**Do not re-open:** multipath pipeline dig for this slug (unless a re-publish re-slabs bytes). Do not re-litigate authority env or G1 unit shape. Do not invent polish.

---

## Instant FAIL still in force

- Place Block2D / grey monolith  
- BOQ missing name or commercial SKU  
- Only one viewport  
- Unit green substituted for browser  
- 127.0.0.1 as proof origin  
- New publish that returns UNION slab  

---

## Bottom line

Authority + catalog + **live multipath revision body** are real. C4 unit under `db` is green.  

**Product C4 is still FAIL:** guest has not placed the multipath desk and shown BOQ name·SKU at 1280 and 390 on localhost:3000.

**Parent next:** browser place+BOQ only. Then call critic for final §1 pass marks.
