# CRITIC — Perfect C4 (authority + multipath + place + BOQ)

**Date:** 2026-07-18  
**Role:** Extreme critic · no product code · no soft polish deferral  
**Verdict now: FAIL** (not shippable)

## Proven (do not re-litigate)

| Fact | Status |
|------|--------|
| `SVG_RELEASE_AUTHORITY=db` | Flipped locally (parent / Failures.md) |
| `svg-blocks` has `oando-linear-desk-1600` | **PASS** pointer shape |
| Preview URL is revision API (not disk) | **PASS** URL shape |
| Revision API returns `image/svg+xml` 200 | **PASS** transport |
| Revision **body** multipath (`desk-top` / `pedestal-l` / `pedestal-r`) | **FAIL** — UNION single-path slab |
| Guest place + BOQ browser @ 1280 + 390 | **OPEN / FAIL** — not closed |

**Hard truth:** Authority flip without multipath symbol bytes is costume cutover. Catalog that points at a slab is not C4. Unit green on disk URL is not C4 under `db`. Browser not closed = C4 FAIL.

---

## 1. Perfect acceptance checklist (binary PASS / FAIL only)

Mark each row **PASS** or **FAIL**. Any **FAIL** = C4 FAIL. No “partial,” no “close enough,” no “unit implies browser.”

### A. Authority

| # | Criterion | Result |
|---|-----------|--------|
| A1 | Runtime env for the process under test has `SVG_RELEASE_AUTHORITY=db` (dev server restarted after flip; not code-default disk while claiming db). | **FAIL until parent re-proves after next fix** — env claimed; every claim re-verified same session |
| A2 | Dual-write readiness `mode: enabled` (Products DB + R2 ListObjects + pointer column) for the publish path used. | Open: re-verify same session as place |
| A3 | Published product pointer is revision id, not “disk only pretending db.” | Open: re-verify |
| A4 | Guest/planner load path does **not** silently fall back to disk when revision exists and authority is `db`. | Open: re-verify |
| A5 | Failures.md / CHECKLIST do **not** claim full cutover while place+BOQ or multipath bytes are open. | **FAIL** if anyone ticks C4 PASS now |

### B. Catalog

| # | Criterion | Result |
|---|-----------|--------|
| B1 | `GET /api/planner/catalog/svg-blocks` includes `oando-linear-desk-1600` (or current published slug) for guest-visible brand filter. | Open (URL shape was proven; re-prove after re-publish) |
| B2 | Item SKU is commercial exact (e.g. `OANDO-LINEAR-DSK-1600`), not demo/sample/empty. | Open |
| B3 | `assets.previewImageUrl` is `/api/planner/catalog/svg/{revisionId}` (or equivalent revision URL), **not** `/svg-catalog/{slug}.svg`, under `SVG_RELEASE_AUTHORITY=db`. | Proven shape once; **re-prove after multipath re-publish** |
| B4 | Guest filter: every inventory slug `oando-*`; zero `sample*` / demo / OFL pollution. | Open |
| B5 | Lifecycle buyer/live so guest sees it without admin session hacks. | Open |
| B6 | Thumb and place resolve the **same** revision URL / same bytes (no thumb-disk / place-revision split). | Open — critical under db |

### C. Symbol quality (AutoCAD precision / Planner5D-readable plan)

| # | Criterion | Result |
|---|-----------|--------|
| C1 | Revision SVG body is **multipath**, not one boolean UNION slab. | **FAIL** (proven) |
| C2 | Stable part ids present: `desk-top`, and when `pedestalCount=2`: `pedestal-l`, `pedestal-r` (modesty id if modesty on). | **FAIL** (slab has no multipath parts) |
| C3 | Plan reads as worksurface + pedestals (distinct fills/roles), not a grey/monolith rectangle. | **FAIL** |
| C4 | Geometry in **mm** consistent with published width (1600) / depth fields; viewBox honest; no mystery scale. | Open — blocked by C1 |
| C5 | No `currentColor` / CSS `var(` fills in published symbol bytes. | Open — blocked by re-publish |
| C6 | Stroke / role paint readable at inventory thumb **and** canvas (same bytes). Not Block2D placeholder silhouette. | Open — blocked by C1 + place |
| C7 | Maker pen truth: published bytes match parametric Maker multipath for locked fields (not freehand, not AI path `d`, not Excalidraw residual union blob). | **FAIL** if body is pipeline UNION of multipath |

### D. Place

| # | Criterion | Result |
|---|-----------|--------|
| D1 | Browser `http://localhost:3000/planner/guest/` only (never 127.0.0.1). | Required on proof run |
| D2 | Inventory shows desk thumb that loads revision SVG (network 200, no broken image). | **FAIL** until multipath + browser closed |
| D3 | Place at **1280** width: Fabric paints **published multipath SVG**, not Block2D miss / grey slab stand-in. | **FAIL** (not closed; slab would still FAIL multipath) |
| D4 | Place at **390** width: same — multipath paint, usable hit target, no console / failed SVG requests. | **FAIL** (not closed) |
| D5 | Placed item stamps `sourceSlug` + `sourceSku` + `previewImageUrl` = revision URL under db authority. | Open — unit currently hard-codes disk; browser open |
| D6 | Console errors = 0; failed SVG/network requests = 0 on inventory + place journey. | Open |

### E. BOQ

| # | Criterion | Result |
|---|-----------|--------|
| E1 | After place, BOQ / review line shows **human name** derived from product (e.g. Linear Desk 1600 class), not empty/generic “Furniture.” | **FAIL** until browser proof |
| E2 | Same line shows **exact commercial SKU** (`OANDO-LINEAR-DSK-1600` or published SKU). | **FAIL** until browser proof |
| E3 | Name · SKU format is product language (`formatBoqLineDisplayName` / Review), not raw slug-only theater. | Open |
| E4 | Qty and identity stable after place; no demo SKU bleed. | Open |
| E5 | E1–E4 true at **1280** and **390**. | **FAIL** until dual viewport proof |

### F. Security

| # | Criterion | Result |
|---|-----------|--------|
| F1 | Admin publish remains admin-gated (existing auth + CSRF on write paths). Guest cannot publish. | Open re-check if publish path touched |
| F2 | Revision GET does not leak other tenants’ private drafts; only published/buyer-visible revision ids resolve for guest catalog. | Open — required if API surface changed |
| F3 | No client-side secrets (LLM keys, service role, R2 keys) in browser bundle for this journey. | Open |
| F4 | Tests never mutate canonical catalog / live DB production rows; isolation or read-only against known fixtures. | Open — C4 unit must not write canonical |
| F5 | No auth bypass left on for deploy claims (`DEV_AUTH_BYPASS` local only; not “C4 security PASS”). | Process FAIL if claimed otherwise |

### G. Tests

| # | Criterion | Result |
|---|-----------|--------|
| G1 | `c4GuestPlaceLoadRule` (or successor) is **authority-aware**: under `db`, expects revision URL pattern; under disk, disk URL — no hard-coded `/svg-catalog/` only. | **FAIL** (IMPLEMENTATION-PLAN + unit still disk-shaped) |
| G2 | Unit or contract test asserts revision **body multipath ids** (`desk-top`, pedestals) for published desk — not merely HTTP 200. | **FAIL** if missing; transport-only tests are hollow |
| G3 | Place → BOQ unit still stamps slug/SKU and BOQ line under live authority preview URL. | Open / likely FAIL with disk assert |
| G4 | Focused vitest for touched paths exit 0 same session as claim. | Open |
| G5 | No suppressed / skipped C4 tests. No hollow export-only stubs. | Open |
| G6 | Browser proof is parent-seen (Playwright or manual) at 1280 + 390; unit does **not** substitute for D/E. | **FAIL** (not closed) |
| G7 | `pnpm run check:layout` exit 0 before any “C4 done” claim. | Required at close |

### Scoreboard (now)

| Domain | Score |
|--------|-------|
| Authority | Not closed as product PASS (pointer only) |
| Catalog | Pointer shape once; bytes poison |
| Symbol quality | **HARD FAIL** (UNION slab) |
| Place | **FAIL** (open) |
| BOQ | **FAIL** (open) |
| Security | Not re-proved this gate |
| Tests | **FAIL** (disk-hardcode + no multipath body assert + no browser) |

**C4 overall: FAIL.**

---

## 2. Ordered fix list (parent must do — max 8)

1. **Stop claiming C4 / cutover complete.** Failures.md + CHECKLIST stay OPEN on place+BOQ **and** on multipath bytes. Pointer ≠ product.

2. **Find who flattens Maker multipath into UNION slab** on dual-write / publish / pipeline (descriptor normalize, SVG pipeline, R2 `symbol.svg` write). Fix so **stored revision SVG keeps part ids** `desk-top` / `pedestal-l` / `pedestal-r` (Maker pen truth). Do not “accept slab” as professional plan symbol.

3. **Re-publish** `oando-linear-desk-1600` (or isolated proof slug if policy forbids canonical thrash — but live C4 slug must end multipath). Verify R2/DB artifact bytes + `GET /api/planner/catalog/svg/{revisionId}` body with multipath ids **before** any browser PASS.

4. **Fix C4 unit for authority:** preview URL assert = revision API under `SVG_RELEASE_AUTHORITY=db`; multipath body or bridge contract; place stamp uses same URL family. Delete disk-only PASS fantasy.

5. **Restart `pnpm run dev`** with `SVG_RELEASE_AUTHORITY=db`. Prove `svg-blocks` item: slug, SKU, revision preview URL, guest filter clean.

6. **Browser C4 at `http://localhost:3000/planner/guest/`:** inventory thumb multipath → place → Fabric multipath (not Block2D) → BOQ name + SKU. **1280 then 390.** Console 0 / failed SVG 0. Parent-seen only.

7. **Security spot-check same session:** guest cannot write publish; revision id enumeration does not expose draft junk; no secrets in client; tests isolation intact.

8. **Commit only after 1–7 evidence.** Push verified slice. Update CHECKLIST / Failures with honest PASS rows — never unit alone.

---

## 3. What this critic will re-check after

Parent returns with **fresh same-session evidence** (commands + browser). Critic re-marks §1 only. No theater.

### Re-check protocol

1. **Authority**  
   - Env / process truth: `db`.  
   - `svg-blocks` row for desk: revision URL, not disk.  
   - No silent disk fallback when revision present.

2. **Symbol bytes (hard gate)**  
   - Fetch revision URL.  
   - Body must contain multipath part structure / ids (`desk-top`, pedestals when dual).  
   - **One UNION path slab = instant FAIL** regardless of catalog pointer, BOQ string, or unit green.

3. **Catalog**  
   - SKU exact. Guest `oando-*` only. Thumb URL = place URL family.

4. **Place browser**  
   - localhost:3000 guest, 1280 + 390.  
   - Fabric multipath paint. Console 0. Failed SVG 0.

5. **BOQ browser**  
   - Name + commercial SKU on the placed line at both widths.

6. **Tests**  
   - Authority-aware C4 unit green.  
   - Multipath body assertion exists and green.  
   - No skips. `check:layout` green.

7. **Security**  
   - Write path gated. No secret leak. Isolation.

### Instant FAIL on re-check (any one)

- Revision still slab / missing part ids  
- Place uses Block2D miss or grey monolith  
- BOQ missing name or SKU  
- Only 1280 or only unit, no dual viewport  
- Tests still hard-code `/svg-catalog/` under `db`  
- Claims PASS from `agent-reports/` or old `results/` alone  
- 127.0.0.1 used as “proof” origin  

### Pass bar (all required)

Every row in §1 marked **PASS** with parent-seen evidence. Then critic may write **C4 PASS**. Not before.

---

## Bottom line

You flipped authority and wired a revision URL. The **product** is the multipath desk clients place and line-item. Right now the durable symbol is a **UNION slab**. That is not AutoCAD-class plan geometry. That is not Planner5D-readable furniture. That is not C4.

**Fix bytes. Fix tests for db. Close browser place+BOQ at both widths. Then call critic.**

No product code in this note. Parent decides PASS/FAIL/ship.
