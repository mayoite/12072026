# Next quality slices — honesty scan (2026-07-09)

**Agent:** explore quality holes (read + write evidence only)  
**Checkout:** `D:\OandO07072026`  
**Scope:** (1) open3d/planner TS residual (2) stale FAIL claims under `results/planner/world-standard-wave` NOTES (3) top 3 **next** quality slices after **this** hygiene slice  
**Not in scope:** feature implementation, re-planning the wave, inventing PASS.

**Authority for spine status:** `TRUTH-LOCK.md`, gate NOTES + `run.json` / browser-run, `ayushdocs/00-PENDING.md`  
**This quality slice bar:** typecheck + pick-test quality (`OWNER-STATUS.md`, `VERIFY.md`)  
**6-month prototype bar:** `ayushdocs/18-PRODUCT-CONTEXT.md` + `19-GOALS-SLICES.md` (buyer-usable spine + **one** workstation family + scale place + **path to quote** — not photoreal, not multi-tenant factory)

---

## 1. TypeScript / open3d — other errors?

### Live evidence (trust this)

| Check | Result | Path |
|-------|--------|------|
| `pnpm exec tsc --noEmit -p tsconfig.json` (cwd `site`) | **exit 0 · errors 0** | `typecheck-raw.log`, `VERIFY.md` |
| Targeted vitest (canvasPicking + poseContinuityW4 + orbitControlsDefault) | **30/30** | `VERIFY.md` |

**Conclusion:** There is **no current open3d TS error** and **no residual single-error tsc state**. Full site typecheck is clean as of this quality slice verify.

### Historical / stale error surface (do not re-fix as open)

| Artifact | What it shows | Truth now |
|----------|---------------|-----------|
| `results/planner/_tsc-wave.txt` | ~12× `pipelineCore.ts` TS2322/TS2352 (Polygon/Ring/`[number,number]`) | **Stale.** Fixed — `results/planner/systematic-debug/run.json` status `"fixed"`, post-fix tsc exit 0 |
| User prompt “tsc may show only one” | Expectation of residual | **Overstated residual.** Live tsc shows **zero**, not one |

### open3d source scan (static)

- Grep under `site/features/planner/open3d` for `@ts-ignore` / `as any` / `@ts-expect-error` in **code**: **none** (only comments forbidding them).
- One intentional `@ts-expect-error` lives under **admin** `svg-editor/ModelViewerPreview.tsx` (custom element JSX) — **not** open3d product path, and annotated with removal condition.
- No evidence of open3d-specific tsc failures in any results log after the pipelineCore fix.

### Honesty note

Clean `tsc` ≠ product quality. God files, dual engines, unwired e2e, and demo catalog remain real product holes — they are **not** TypeScript errors.

---

## 2. Stale FAIL / residual claims in world-standard-wave NOTES

**Method:** Compare NOTES/PARTIALS/handoff text vs **newer** gate NOTES + `run.json` + TRUTH-LOCK + 00-PENDING.

### 2A. Clearly stale — treat as **wrong if believed as current product state**

| Doc | Stale claim | Contradicted by |
|-----|-------------|-----------------|
| **`PARTIALS.md`** | W4 browser e2e **failed** (furniture count stayed 0); **stop line** “do not start new phase until W4 browser closed” | `04-orbit-continuity/NOTES.md` **PASS**; `browser-run.json` `status: "browser-green"` (Place 4 seats → orbit → count 4); TRUTH-LOCK CP-04 **PASS**; `00-PENDING` W4 residual **Closed** |
| **`SESSION-HANDOFF.md`** | P04 “browser e2e residual **open**”; recommended next = finish W4 browser | Same as above — residual closed; handoff HEAD tip (`37f4f63`) predates later PASS rewrite of 04 NOTES |
| **`00-product-truth/INVENTORY.md`** | W4 “**OPEN residual** e2e” | CP-04 PASS pack |
| **`00-product-truth/EVIDENCE-COVERAGE.md`** | W4 “browser residual” | CP-04 PASS pack |
| **`00-product-truth/CAPABILITY-MATRIX.md`** | W4 browser = `browser-missing residual` | Should read **browser-green** (configurator Place 4 path is the proven path, not catalog-click) |
| **`07-systems-v0/NOTES.md` → Next** | Still lists “W4 browser residual” + “priced BOQ” as optional next | W4 closed; **priced pure BOQ landed** (`results/planner/workstation-boq-priced/`) |
| **`TRUTH-LOCK.md` residuals §5** | “**Priced BOQ — later**” | Unit path exists: INR list + GST 18% + export/cart names (`workstation-boq-priced/NOTES.md`). Residual is **panel UX / multi-tenant ERP**, not “no prices in code” |
| **`quality-2026-07-09/OWNER-STATUS.md` HALF** | “**No priced BOQ** — … later” | Same — **stale half-list** relative to priced pure land |
| **`results/planner/_tsc-wave.txt`** | pipelineCore type errors as if live | Fixed (systematic-debug) |
| **`code-audit-2026-07-09/MASTER-FINDINGS.md`** (if read as live) | Rotation deg/rad bug; BOQ no money; wall delete no cascade; export PDF/PNG over-promise; openings not pickable | **Post-audit lands:** rotation `2ce6f90`, BOQ priced `5f097d5`, cascade `d8e646e`, export honesty `62a14e3`, opening select `a400701`. Audit is useful history — **not** current defect register |

### 2B. Not stale — still true residuals

| Claim | Still honest? | Evidence |
|-------|---------------|----------|
| Openings select: **unit only**, no dedicated browser e2e | **Yes** | `opening-select/NOTES.md`; `00-PENDING` |
| Wall delete cascade: **unit only**, no UI e2e | **Yes** | `wall-delete-cascade/NOTES.md`; `00-PENDING` |
| Mesh still **boxy** (legs = named boxes, not photoreal) | **Yes** | `08-mesh-quality/`, `07` mesh residual |
| Cloud / member save not default open3d path | **Yes** | W6 local honesty; product-truth non-claim |
| Fabric full stage later; flag OFF expected | **Yes** | engine lock Approach A |
| **CP-10** `10-handover/` missing | **Yes** | TRUTH-LOCK OPEN |
| Open3d product e2e **not on default gate scripts** | **Yes** (process hole) | `code-audit-2026-07-09/agent-c-tests-gates.md` — 8× `open3d-*.spec.ts` unwired from `playwright-gate-specs.json` / release:gate |
| mesh-legs-red 7/7 failed | **Historical RED phase** (intentional) | Green pack supersedes; keep as TDD history only |

### 2C. Doc hygiene risk (process, not product code)

Highest confusion risk: **`PARTIALS.md` + `SESSION-HANDOFF.md` still send agents back to W4** after TRUTH-LOCK and 04 NOTES already claim PASS. Next agent that trusts PARTIALS will re-thrash a closed residual.

**Recommended doc fix (out of this agent’s implement scope):** rewrite PARTIALS W4 row + residual rank + stop line; rewrite SESSION-HANDOFF next slice; patch CAPABILITY-MATRIX W4 browser column; drop “priced BOQ later” / “no priced BOQ” wording where pure path is green.

---

## 3. Top 3 next quality slices (after this one)

**This slice** = typecheck clean + pick-test quality (hygiene).  
**Not counting as “next product polish”:** CP-10 handover pack (process closeout — do it when owner wants program pack, not as quality engineering).

Ranked for **6-month serious prototype** (quote path + plan accuracy + evidence honesty), not for photoreal or Fabric cutover thrash.

### #1 — Wire open3d browser proofs into a **real gate** (quality honesty)

| Field | Content |
|-------|---------|
| **Why** | Spine folders claim browser-green, but agent-C audit: open3d e2e specs are **unwired** from package/release gates. Prototype demos can rot without anyone’s `pnpm gate` noticing. |
| **Done when** | A named script (e.g. `test:open3d:e2e` or subset in `playwright-gate-specs`) runs the **proven** open3d specs (journey / W3 / W4 / save / systems place) against a documented base URL; evidence log under `results/planner/…`; default `gate` either includes it **or** docs stop implying CI equals browser-green. |
| **Not** | Re-writing all 8 specs; fabric step-bar chrome; coverage % chase. |
| **Evidence debt** | `agent-c-tests-gates.md` gap #1–3, #4 (fabric gate vs open3d guest). |

### #2 — Quote-path UX: **BOQ panel (demo schedule)** visible on open3d

| Field | Content |
|-------|---------|
| **Why** | Success metric is plan + systems + place + **path to quote**. Pure priced BOQ (INR + GST) **exists**; buyer still lacks an obvious on-plan BOQ panel. “No money” is stale; “no visible quote surface” is still true. |
| **Done when** | Open workspace with ≥1 workstation → panel/list shows line items + subtotal/GST/total (demo schedule); one real unit or browser assert on totals; export/cart still consistent. |
| **Honest limit** | Demo list schedule only — not multi-tenant ERP / live SKU prices. |
| **Evidence debt** | `workstation-boq-priced/NOTES.md`; 07 NOTES “optional BOQ panel”; OWNER-STATUS half-list (after doc fix). |

### #3 — Structure plan accuracy: **openings select + wall cascade browser proof** (one combined slice)

| Field | Content |
|-------|---------|
| **Why** | Recon projects need doors/windows as first-class plan objects. Unit pick + cascade landed; **buyer path unproven in Playwright**. This is plan accuracy, not chrome. |
| **Done when** | One (or two tightly related) browser specs: wall + door → Select hits opening → status/properties show door → Delete removes opening only; wall with door → delete wall → 0 doors/windows for that `wallId`. Screenshots under `results/planner/…`. |
| **Not** | 3D raycast select (view-only 3D is a later, larger hole); photoreal openings. |
| **Evidence debt** | `opening-select/`, `wall-delete-cascade/`, `00-PENDING` residuals. |

### Explicitly **not** top-3 next (deferred / lower value now)

| Slice | Why not next |
|-------|----------------|
| Photoreal / handles / AO mesh | Bar already PASS for readable multiparts; metric is BOQ > beauty |
| Fabric full stage cutover | Destination later (Approach A); flag ON is a trap until symbols real |
| Cloud/member save | W6 honesty is local-first; separate owner gate |
| Free height control alone | Valuable systems depth — prefer after quote surface + structure browser |
| Coverage % expansion | Purpose over percentage; gate allowlist is a separate honesty track (pair with #1) |

---

## 4. One-line summary

| Question | Honest answer |
|----------|----------------|
| Other open3d TS errors? | **No.** Site `tsc` **0 errors**. `_tsc-wave.txt` is historical pipelineCore only (fixed). |
| Stale FAIL in wave NOTES? | **Yes — mainly W4 browser residual** still FAIL in PARTIALS/SESSION-HANDOFF/capability matrix after CP-04 PASS; also “no priced BOQ” wording in TRUTH-LOCK residual / OWNER-STATUS. |
| Top 3 next quality slices? | **(1)** wire open3d e2e to a real gate · **(2)** BOQ panel UX on demo prices · **(3)** openings + wall-cascade browser proof. |

**Stop line for agents:** Do **not** re-open W4 orbit browser work based on `PARTIALS.md` / `SESSION-HANDOFF.md`. Prefer TRUTH-LOCK + `04-orbit-continuity/NOTES.md` + `browser-run.json`.

---

## Sources read (this scan)

- `results/planner/quality-2026-07-09/{OWNER-STATUS,VERIFY,typecheck-raw}.md|log`
- `results/planner/_tsc-wave.txt`, `results/planner/systematic-debug/run.json`
- `results/planner/world-standard-wave/{TRUTH-LOCK,PARTIALS,SESSION-HANDOFF,WAVE}.md`
- `…/04-orbit-continuity/{NOTES.md,browser-run.json}`
- `…/00-product-truth/{CAPABILITY-MATRIX,INVENTORY,EVIDENCE-COVERAGE,CONTRADICTIONS}.md`
- `…/07-systems-v0/NOTES.md` (Next + mesh residual)
- `results/planner/{workstation-boq-priced,opening-select,wall-delete-cascade,export-honesty}/NOTES.md`
- `results/planner/code-audit-2026-07-09/{MASTER-FINDINGS,agent-c-tests-gates}.md`
- `ayushdocs/{00-PENDING,18-PRODUCT-CONTEXT,19-GOALS-SLICES}.md`
