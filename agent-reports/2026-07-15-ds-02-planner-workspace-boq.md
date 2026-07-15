# DS-02 — Planner workspace, catalog consume & BOQ handoff

**Status:** Options design only. Not implemented.  
**UI verified this session:** **No.** Evidence is code + `plan/Planner/*` + FEATURES gaps. Live `/planner/guest` / canvas not opened here.  
**Problem cluster:** Parallel catalog/store trees; multiple BOQ calculators; disk SVG; deferred tools; thin validation; no Send-to-Oando; conversion events mostly unwired; quote cart workstation-skewed.

---

## Goal

One external customer can place released inventory, get one branded BOQ, and send the exact package to Oando—with stable product identity from discovery through handoff.

---

## Option A — Consolidate then complete the customer loop

**What:** Pick **one** document host (`features/planner/project/`), **one** BOQ authority (`projectFurnitureBoq` or successor), **one** catalog read API; delete or hard-gate legacy trees; then implement validation → priced BOQ → Send to Oando.

| Pros | Cons |
|---|---|
| Stops architecture rot before more features | Upfront merge cost; breaks dormant importers |
| Single place for identity, mm, undo, export | Temporary feature freeze on secondary hosts |
| Makes UI work mean something | Needs owner ruthlessness on dead code |

**Best when:** You will keep building Planner for months.  
**Effort:** High · **Risk:** Medium (regression) · **Unblocks:** Honest performance and BOQ work

### Solution shape

1. Declare live host: `OOPlannerWorkspace` + `project/` model only.  
2. BOQ: retire `workstationBoqV0` / `buildBoq` behind adapters that call one engine; one CSV/PDF path.  
3. Catalog: server `svg-blocks` + managed products only; fixture-only in tests.  
4. Validation: rotate-aware overlap + hard gates for handoff.  
5. Handoff: draft vs customer-ready; CSRF, idempotency, hash, `HANDOFF_*` events.  
6. Kill or implement deferred rail tools; no fake geometry.

---

## Option B — Vertical slice on live host only (leave legacy cold)

**What:** Do not merge trees. Complete customer loop **only** on the paths `OOPlannerWorkspace` already uses. Leave `catalog-api/` / legacy `cloud-store` APIs cold for portal until later.

| Pros | Cons |
|---|---|
| Faster path to “design → BOQ → send” demo | Dual trees remain; next agent will re-expand them |
| Lower immediate regression surface | Portal/admin plan views may stay on dead path |
| Fits parallel Admin cutover | Still need one BOQ on the live path |

**Best when:** Owner needs a sellable guest journey soon.  
**Effort:** Medium · **Risk:** Medium (drift) · **Unblocks:** Phase 1/4 customer story

### Solution shape

1. Map every live import from workspace; freeze unused trees with `// cold path` + lint ban on new imports.  
2. One BOQ on live export menu; hide workstation-only cart or expand it.  
3. Wire conversion events on live host only.  
4. SVG: honest Block2D only on load/miss; disk until Admin Option A.  
5. Send to Oando MVP: explicit button, server endpoint, status, safe retry.  
6. Schedule Option A consolidation as separate DS.

---

## Option C — Fixture-backed Planner product (decouple Admin)

**What:** Ship Planner against **isolated released fixtures** (identity, SVG, price book pin) so customer loop is proven without live Admin DB cutover. Swap fixture source for DB later.

| Pros | Cons |
|---|---|
| Unblocks Planner browser proof now | Not real inventory; sales risk if fixtures look live |
| Forces clean catalog contract | Duplicate fixture maintenance |
| Aligns with plan “dependency = fixture OK” | Easy to ship fixture path to production by mistake |

**Best when:** Admin DB-SVG is blocked but Planner acceptance must advance.  
**Effort:** Medium · **Risk:** Low–Medium (env gates) · **Unblocks:** UI benchmarks, BOQ math tests

### Solution shape

1. One `ReleasedCatalogFixtureV1` with product, family, SVG bytes, price book version.  
2. `NODE_ENV`/flag: production **forbids** fixture unless explicit staging.  
3. Implement full loop on fixture: place → validate → BOQ → handoff dry-run.  
4. Browser suites use fixture only; never touch canonical descriptors.  
5. Cutover = change server loader to DB; same contracts.

---

## Recommendation

**Prefer Option B + C together for the next sprint:** fixture boundary (C) + complete live-host loop (B). Schedule **Option A consolidation** as a hard follow-on so trees do not grow. Do not build Send-to-Oando on three BOQ engines.

---

## UI debt tied to this DS (unverified live)

| Surface | Claimed gap (docs/code) | Needs live proof |
|---|---|---|
| Setup gate | Optional fields block; dead `StartingPointStep` | Keyboard complete skip path |
| Tool rail | Room/dimension/text deferred | No fake geometry clicks |
| Catalog panel | UI-CAT browser open | Search, lifecycle hide retired |
| BOQ / export | Multi-engine; no draft vs ready | One export, clear labels |
| Mobile shell | UI-MOB open | 390 layout without force-click |

---

## Key decisions (when owner picks)

1. Consolidate now (A) vs freeze cold trees (B).  
2. Production may never load fixtures (C) — confirm env gate.  
3. Minimum handoff: dry-run hash only vs live Oando endpoint.

## Open questions

1. Is there an Oando receive endpoint contract today?  
2. Guest vs member: who can handoff?  
3. Price book pin required before any customer-ready export?

## PR plan (after option pick)

| PR | Depends | Content |
|---|---|---|
| P0 | — | BOQ single authority on live export path |
| P1 | — | Fixture catalog loader + production forbid |
| P2 | P0 | Validation hard gates for export |
| P3 | P0–P2 | Customer-ready BOQ + Send to Oando MVP |
| P4 | owner | Conversion events + review links |
| P5 | later | Tree consolidation (Option A) |

---

*Agent report. Not checklist PASS. Not UI verification.*
