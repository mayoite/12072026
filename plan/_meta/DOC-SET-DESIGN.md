# Doc-set design — Admin · Site · TechStack

**Author:** Docs Agent 1 (brainstormer)  
**Date:** 2026-07-17  
**Template:** `plan/Planner/` trio (COMPLETION-CONTRACT · FEATURES · FINISH-PLAN)  
**Scope:** Design only. Domain agents write track files. Do not invent product features beyond live FEATURES / docs.

---

## 0. Purpose

Mirror Planner’s three-file system on Admin, Site, and TechStack so every product track has:

| File | Role | Authority |
|------|------|-----------|
| `COMPLETION-CONTRACT.md` | How to prove done | Wins on **evidence** and PASS recipe |
| `FEATURES.md` | Live code map (feature → path → gap) | Wins on **what exists in code** |
| `FINISH-PLAN.md` | Detailed phase checklist + failure registry | Wins on **execution order and checkbox detail** |

Planner is the template. Do not rewrite Planner in this workstream unless the owner asks.

**Product loop (repo truth):** Admin publishes inventory → Site acquires visitors → Planner designs → branded BOQ → customer sends to Oando.  
**TechStack** is not a product surface. It owns toolchain, engines, monorepo hygiene, and gates.

---

## 1. Target file matrix

### 1.1 Per track

| Track | COMPLETION-CONTRACT | FEATURES | FINISH-PLAN | Notes |
|-------|---------------------|----------|-------------|-------|
| **Planner** | Exists (template) | Exists (template) | Exists (template) | Reference only. Leave alone. |
| **Admin** | **CREATE** | **REFRESH** | **CREATE** | FEATURES exists; points at missing PHASES/CHECKLIST. Replace that role with trio. |
| **Site** | **REFRESH** (light) | **REFRESH** (light) | **CREATE** | Contract already strong (S0–S7, SF registry). Add FINISH-PLAN checklist detail. |
| **TechStack** | **REFRESH** (light) | **CREATE** | **CREATE** | Contract already strong (T0–T8, TS registry). Add FEATURES + FINISH-PLAN. Align failure prefix to **TF-**. |
| **Security** | Out of this matrix | — | — | Folder empty. Separate track (`docs/architecture/10-SECURITY-BENCHMARK.md`). Do not invent a Security trio here. |

### 1.2 Create / refresh / retire

| Action | Paths |
|--------|--------|
| **CREATE** | `plan/Admin/COMPLETION-CONTRACT.md`, `plan/Admin/FINISH-PLAN.md`, `plan/Site/FINISH-PLAN.md`, `plan/TechStack/FEATURES.md`, `plan/TechStack/FINISH-PLAN.md` |
| **REFRESH** | `plan/Admin/FEATURES.md` (drop dead PHASES/CHECKLIST as authority; add doc-role table + execution status line; keep honest gaps), `plan/Site/COMPLETION-CONTRACT.md` (cross-link FINISH-PLAN; no scope invent), `plan/Site/FEATURES.md` (same doc-role table as Planner), `plan/TechStack/COMPLETION-CONTRACT.md` (TS→TF id note; link FEATURES/FINISH-PLAN; keep gates) |
| **RETIRE as authority** | Admin/Site references to missing `PHASES-*.md` and `CHECKLIST.md` — mark historical only; contract + finish plan replace them |
| **INDEX** | `plan/README.md` — list full trio for Admin/Site/TechStack after domain agents land files |

### 1.3 Done when (this design)

- This file exists and is used by Docs agents 2–5.  
- Domain agents do **not** invent FEATURES rows without reading code.  
- No track claims PASS from this design alone.

---

## 2. Shared structure template

### 2.1 Status vocabulary (all tracks)

| Status | Meaning |
|--------|---------|
| **OPEN** | Unverified. Default for new or stale items. |
| **PASS** | Fresh evidence in the claiming session meets the track contract. |
| **FAIL** | Fresh check failed. Record command/exit or browser step. |
| **PARTIAL** | Code (and maybe unit) exists; full proof (browser / gate / env) missing. Checklist stays unchecked. |

Rules:

- Never claim done from plan ticks, old agent reports, or `results/` alone.  
- Unit-green ≠ browser PASS.  
- `results/` is tool output only.  
- Live code wins over docs when they disagree.  
- OPEN is not FAIL. FAIL is a fresh fail.  
- Add failure IDs; do not bury issues in prose.

### 2.2 Failure ID prefixes

| Prefix | Track | Registry home |
|--------|-------|----------------|
| **PF-** | Planner | `plan/Planner/FINISH-PLAN.md` + contract §7 |
| **AF-** | Admin | `plan/Admin/FINISH-PLAN.md` + contract §7 |
| **SF-** | Site | `plan/Site/FINISH-PLAN.md` + contract §7 (seed already in Site contract) |
| **TF-** | TechStack | `plan/TechStack/FINISH-PLAN.md` + contract §7 |

**TechStack migration:** Existing contract uses `TS-01…TS-22`. On refresh, renumber/alias to **TF-** with a one-line map (`TS-0N` → `TF-0N`) so reports stay searchable. Prefer TF going forward.

Do not reuse IDs across tracks. Cross-track blockers get an id on the **owning** track and a one-line pointer on the dependent track.

### 2.3 COMPLETION-CONTRACT.md — required headings

Copy Planner/Site/TechStack shape. Keep short sentences.

```text
# {Track} completion contract

**Status:** OPEN
**Authority:** execution contract — wins on how to prove done
**Relation to FINISH-PLAN:** same phases; this file stricter on evidence
**Code maps:** FEATURES.md
**Benchmarks / facts:** docs links (UI, security, locked engines as needed)
**Active blockers:** ../../Failures.md
**Agent reports:** ../../agent-reports/

## 1. Outcome
## 2. Truth rules (non-negotiable)
### 2.1 What counts as PASS
## 3. Evidence protocol
### 3.1 Gates (commands from repo root)
### 3.2 Report shape (≤50 lines + INDEX)
### 3.3 Agents (implementer vs parent re-verify)
## 4. Scope boundary (In / Out / Cross-track)
## 5. Product or stack non-negotiables
## 6. External benchmark (capability only — no copy)
## 7. Failure registry ({AF|SF|TF})
## 8. Execution phases (high level + exit/proof/stop)
## 9. Required test coverage (minimum)
## 10. Dependency order (ASCII graph)
## 11. How this exceeds FINISH-PLAN / fact docs
## 12. Immediate priority queue
## 13. Owner acceptance
```

PASS recipe (all tracks):

1. Code on claimed path.  
2. Automated proof where logic-only (named vitest, exit 0).  
3. Browser proof for customer/operator-visible UI (route, viewport, console 0, failed requests 0).  
4. Security-sensitive: owner/role/CSRF tests as required.  
5. Command + exit in the same session as the claim.  
6. Status flip only with that evidence.

### 2.4 FINISH-PLAN.md — required headings

```text
# {Track} completion plan

Status: OPEN.
**Proof bar:** COMPLETION-CONTRACT.md wins on evidence.

## Outcome
## Truth rules
## Scope boundary (Included / Excluded)
## Non-negotiable decisions
## External benchmark (optional; capability only)
## Current verified failures / phase status table
## Failure registry ({AF|SF|TF}-nn)
## Execution order
### {A|S|T}0. …
  - [ ] / [PASS] checklist items
  Exit gate: …
### …
## Browser / acceptance matrix (product tracks)
## Dependency notes (cross-track only when blocking)
```

Rules for checkboxes:

- Start unchecked unless already verified in-session.  
- `[PASS]` only with fresh proof.  
- Phase status table: OPEN | PARTIAL | PASS | FAIL | IN PROGRESS.  
- Block only direct dependants.

### 2.5 FEATURES.md — required headings

```text
# {Track} features

Repo-sourced index: feature → code path → honest gap.
Live code and fresh checks are authoritative.

| Doc | Role |
| This file | Current code map and known gaps |
| FINISH-PLAN.md | Required work and verification status |
| COMPLETION-CONTRACT.md | How to prove done |

**Code roots:** …
**Execution status (mirrors FINISH-PLAN, date):** …

## Phase / area tables
| Feature | Code | Gap |

## APIs (if any)
## Parallel paths / dual authorities (if any)
## Tests
## Reference (not truth)
```

FEATURES never grants PASS. Gaps stay honest. Prefer “browser proof open” over “implemented” when UI is unproved.

### 2.6 Phase model

| Track | Phase ids | Detail source |
|-------|-----------|---------------|
| Planner | P0–P17 | Existing (template) |
| Admin | **A0–A9** (skeleton §6.1) | Code: Admin FEATURES + `07-ADMIN-UI-BENCHMARK` + `08-DATABASE-SVG-CONTRACT` |
| Site | **S0–S7** | Already in Site COMPLETION-CONTRACT — FINISH-PLAN expands checklists |
| TechStack | **T0–T8** | Already in TechStack COMPLETION-CONTRACT — FINISH-PLAN expands checklists |

Domain agents may add An+ only with owner alignment if code proves a missing phase. Do not renumber Planner.

---

## 3. Scope boundaries per track

Aligned with `docs/architecture/02-DOMAINS.md` and product loop.

### 3.1 Admin

| | |
|--|--|
| **Owns** | Trusted public inventory: catalog identity, availability, SVG authoring (Excalidraw), publish/compile, descriptors, lifecycle, families/options, price books, rollback/audit, admin APIs under `app/api/admin/**`, admin UI under `app/admin/**` + `features/admin/**` |
| **Live authority (2026-07)** | Disk: `inventory/descriptors/`, `public/svg-catalog/`. DB dual-write optional stub when `PRODUCTS_DATABASE_URL` set — **not** full revision authority |
| **Target** | Products DB + R2 per `08-DATABASE-SVG-CONTRACT.md` |
| **Excludes** | Customer layout/canvas (Planner), marketing SEO/copy (Site), monorepo toolchain policy (TechStack), production CRM rebuild unless explicitly in-scope (FEATURES: localStorage demo CRM) |
| **Consumers** | Site marketing catalog; Planner managed catalog + SVG stamps |

### 3.2 Site

| | |
|--|--|
| **Owns** | Public visitors: marketing routes `app/(site)/`, components, `features/site/`, SEO/sitemap/robots, i18n marketing locales, consent/analytics attribution, public product discovery (consume released catalog), contact/query forms, Site→Planner entry continuity |
| **Excludes** | Planner workspace, Admin SVG/catalog authoring, DB-SVG cutover ownership, CRM ops UI, tech-docs product |
| **Cross-track** | Empty primary category blocks commercial discovery PASS unless owner-accepted fixture env — failure may be AF/data + SF empty-state honesty |

### 3.3 Planner (boundary only — already documented)

| | |
|--|--|
| **Owns** | Design, BOQ, handoff to Oando, guest/member plans |
| **Consumes** | Released inventory from Admin; entry params from Site |

### 3.4 TechStack

| | |
|--|--|
| **Owns** | pnpm/Node workspace, install guards, engine monoculture (Fabric / Three+R3F / Excalidraw embed), Vitest/Playwright configs, Turbo/CI pins, secrets lint, typecheck/lint/test/build/`release:gate` health, env example vs readers, DB client **boundaries** (not product cutover), docs/layout purity scripts |
| **Excludes** | Feature UX in Admin/Site/Planner, catalog SKU content, commercial price authority choice, restoring production data |
| **Honesty** | Must not claim DB/R2 SVG as live authority while disk is live |

### 3.5 Shared non-goals for all track writers

- No plagiarism / competitor trade dress.  
- No handwritten `any`.  
- No silent `test.skip` as PASS.  
- Secrets only in `.env.local`.  
- UI and a11y are acceptance concerns inside each track — not a separate product track.  
- Security benchmark applies cross-cutting; Security track may later get its own trio.

---

## 4. Cross-link rules

### 4.1 Plan ↔ plan

| From | To |
|------|-----|
| Each track `COMPLETION-CONTRACT` | Same-track `FINISH-PLAN`, `FEATURES` |
| Each track `FINISH-PLAN` | Same-track `COMPLETION-CONTRACT` as proof bar |
| Each track `FEATURES` | Same-track finish + contract; never claim finish |
| `plan/README.md` | All nine files (3 tracks × 3) + Planner trio + fact docs |
| Cross-track blocker | Owning track failure id + one line in dependent FEATURES/FINISH gap |

### 4.2 Plan ↔ docs/

| Topic | Doc |
|-------|-----|
| Domains | `docs/architecture/02-DOMAINS.md` |
| Planner UI bar | `docs/architecture/06-UI-BENCHMARK.md` |
| Admin UI bar | `docs/architecture/07-ADMIN-UI-BENCHMARK.md` |
| Site UI bar | `docs/architecture/09-SITE-UI-BENCHMARK.md` |
| DB-SVG contract | `docs/architecture/08-DATABASE-SVG-CONTRACT.md` |
| Security | `docs/architecture/10-SECURITY-BENCHMARK.md` |
| Runtime | `docs/architecture/11-RUNTIME-ARCHITECTURE.md` |
| Engines / i18n / deps | `docs/Lockedfiles/03-dependencies-engines-current.md` |
| Tests rules | `docs/site/tests.md` |
| Architecture map | `docs/site/ARCHITECTURE.md`, `docs/INDEX.md` |

Facts live in `docs/`. Plans do not duplicate long architecture essays. Plans **cite** and enforce proof.

### 4.3 Plan ↔ Failures.md

- `Failures.md` = **active** unresolved blockers only.  
- When a PF/AF/SF/TF clears with proof, remove or update Failures.md in the same change set as the status flip.  
- Do not dump full registries into Failures.md — registries stay in plan files.  
- Critical cross-track items (e.g. false DB-SVG authority) must appear in Failures.md while OPEN.

### 4.4 Plan ↔ agent-reports/

| Rule | Detail |
|------|--------|
| Location | `agent-reports/` only — never under `results/` or `site/` |
| Shape | `YYYY-MM-DD-{track}-{slice}.md` ≤50 lines + day INDEX |
| Track rollups | `agent-reports/ADMIN.md`, `SITE.md`, `TECH-STACK.md`, `PLANNER.md` — parent merges; not PASS proof alone |
| Forbidden | One mega dump as sole deliverable; using reports as authority over live code |

### 4.5 Plan ↔ results/

- `results/<track>/…` = raw tool output.  
- Never PASS evidence by itself.  
- Never Markdown completion reports under `results/`.  
- Never write under `site/results/` or `site/test-results/`.

---

## 5. Writer instructions

### 5.1 Voice

- Short sentences.  
- Brutal truth.  
- No ceremony.  
- Absolute paths in agent reports when citing files; plan files use repo-relative paths from `plan/`.

### 5.2 Truth

- Live code wins. Read FEATURES and source before writing gaps.  
- No fake PASS.  
- Prefer OPEN/PARTIAL over optimistic PASS.  
- Unit ≠ browser.  
- Old dated benchmarks seed failure registries; they do not clear them.  
- Lockfile wins for package versions.  
- Disk wins for live SVG authority until cutover proved.

### 5.3 What domain agents must do

| Agent | Writes | Reads first |
|-------|--------|-------------|
| Docs 2 Admin | Admin COMPLETION-CONTRACT, FINISH-PLAN, FEATURES refresh | This design, Admin FEATURES, `07-ADMIN-UI-BENCHMARK`, `08-DATABASE-SVG-CONTRACT`, `02-DOMAINS`, Failures.md, code roots listed in FEATURES |
| Docs 3 Site | Site FINISH-PLAN; light refresh contract + FEATURES | This design, Site contract (S0–S7, SF-*), Site FEATURES, `09-SITE-UI-BENCHMARK` |
| Docs 4 TechStack | TechStack FEATURES + FINISH-PLAN; light contract refresh (TF-) | This design, TechStack contract (T0–T8, TS→TF), Lockedfiles, Runtime, root/site package.json facts |
| Docs 5 Writer | `plan/README.md` index + consistency pass | All landed trios + this design |

### 5.4 What domain agents must not do

- Invent product features not in code or docs.  
- Overwrite Planner trio.  
- Mark PASS without commands.  
- Mutate canonical catalog in any example test recipe.  
- Commit or push.  
- Open `PROTECTED/`.  
- Treat missing PHASES/CHECKLIST files as live authority.

### 5.5 Checklist discipline (FINISH-PLAN)

- Every phase has an **Exit gate**.  
- Contract phases add **Proof required** and **Stop condition** where isolation or security matters (mirror Planner P0).  
- A0 / S0 / T0 always include test isolation first.

---

## 6. Recommended phase skeletons

High level only. Domain agents expand from code and benchmarks.

### 6.1 Admin — A0–A9

| Phase | Intent | Seed from |
|-------|--------|-----------|
| **A0** | Test isolation — tmp fixtures; no canonical descriptor/svg-catalog mutation; deterministic admin browser bootstrap; baseline AF list | FEATURES Step 0; contract P0 spirit |
| **A1** | Excalidraw-first authoring — studio shell, draft state, dimensions, compile preview, undo/lock | FEATURES Phase 1; UI benchmark |
| **A2** | Publish pipeline — disk authority honest; compile/sanitize server-side; rollback; stale draft gate | `publishDescriptorWithPipeline`; dual-write honesty |
| **A3** | Catalog lifecycle — CRUD, bulk, retire/restore, operator list UX (desktop + mobile) | FEATURES Phase 2 |
| **A4** | Product families / workstation options — form + release; Planner configurator contract | FEATURES Phase 3 |
| **A5** | Commercial governance — price books, governance actions, demo vs approved labeling | FEATURES Phase 4 |
| **A6** | DB-SVG cutover track — real revision bytes path, product pointers, fail-closed dual-write, parity tools; **no false PASS while disk is authority** | `08-DATABASE-SVG-CONTRACT`; FEATURES DB-SVG table |
| **A7** | Admin security — CSRF, rate limits, role gates, production auth (not DEV_AUTH_BYPASS as PASS) | Security benchmark; smoke scripts |
| **A8** | Browser matrix + a11y — publish, list, price book, family release journeys; axe critical/serious | UI benchmark routes |
| **A9** | Release gates + docs — layout/lint/typecheck/admin tests/build; FEATURES match code; Failures.md clean | Contract §3.1 |

**Suggested AF seeds (writers confirm against code/benchmark — do not mark PASS here):**

- AF-01 test isolation / canonical mutation risk  
- AF-02 publish browser unproved  
- AF-03 disk vs DB authority confusion  
- AF-04 dual-write stub treated as cutover  
- AF-05 bulk/list mobile UX  
- AF-06 price book raw storage UX / governance  
- AF-07 family → Planner BOQ end-to-end unproved  
- AF-08 production auth not proved by bypass  
- AF-09 retire/restore unproved  
- AF-10 lifecycle audit not durable (results/ only)  

### 6.2 Site — S0–S7

Already defined in `plan/Site/COMPLETION-CONTRACT.md`. FINISH-PLAN must expand each into checkboxes + exit gates. Do not renumber.

| Phase | Intent (summary) |
|-------|------------------|
| **S0** | Measurement and isolation |
| **S1** | Route truth and SEO floor |
| **S2** | Landing and commercial hierarchy |
| **S3** | Navigation, chrome, forms |
| **S4** | Product discovery + Planner entry params |
| **S5** | Content and i18n |
| **S6** | Analytics and Site→Planner contract |
| **S7** | A11y, performance, release |

SF-01…SF-20 already seeded in Site contract — FINISH-PLAN mirrors and updates status only with evidence.

### 6.3 TechStack — T0–T8

Already defined in `plan/TechStack/COMPLETION-CONTRACT.md`. FINISH-PLAN expands checkboxes. Failure ids become **TF-** (map from TS-).

| Phase | Intent (summary) |
|-------|------------------|
| **T0** | Inventory and honesty (engines, pins, Failures) |
| **T1** | Install and workspace (root-only, Node ≥24, pnpm pin) |
| **T2** | Engine monoculture (Fabric / Three / Excalidraw) |
| **T3** | Dependency hygiene |
| **T4** | Lint, typecheck, unit stability |
| **T5** | Security and secrets |
| **T6** | Build and release:gate |
| **T7** | Data plane client boundaries + SVG authority honesty |
| **T8** | Docs and ops closure |

FEATURES for TechStack is a **stack map**, not product UX: packageManager, engines, workspace packages, canvas/3D/SVG imports, CI pins, gate scripts, env contract, forbidden second engines.

### 6.4 Dependency order across tracks (execution, not doc writing)

```text
TechStack T0–T1 (install/gates healthy)
  → Admin A0 → A1–A2 publish (inventory exists)
    → Site S0–S4 (can show released products)
      → Planner P* (places inventory, BOQ, handoff)
Admin A6 (DB-SVG) blocks only cutover claims — not all Site/Planner work
TechStack T4–T6 continuous; release PASS requires stack + product gates
```

Unrelated phases continue when a blocker is narrow.

---

## 7. Evidence and gates (shared minimum)

### 7.1 Always from repo root

| Gate | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Lint | `pnpm run lint` |
| Typecheck | `pnpm run typecheck` |
| Unit | `pnpm run test` or focused filter |
| Build | `pnpm run build` (release claims) |

Track-specific commands stay in each COMPLETION-CONTRACT §3.1 (planner e2e, site a11y, admin coverage, release:gate, etc.).

### 7.2 Report template

```text
# Title
Verdict: PASS | PARTIAL | FAIL | OPEN
Evidence: commands + exits + routes/packages
Done (bullet + path)
Not done (bullet + why)
```

---

## 8. `plan/README.md` target shape (Docs 5)

After trios land, index should list:

| Purpose | File |
|---------|------|
| Planner contract / plan / features | `Planner/*` |
| Admin contract / plan / features | `Admin/*` |
| Site contract / plan / features | `Site/*` |
| TechStack contract / plan / features | `TechStack/*` |
| Stack facts | `docs/Lockedfiles/03-…` |
| Runtime | `docs/architecture/11-…` |
| Security benchmark | `docs/architecture/10-…` |
| Active blockers | `Failures.md` |

One line: **COMPLETION-CONTRACT evidence rules win** over bare FEATURES gaps and checklist ticks. **Lockfile wins** for versions.

---

## 9. Work order for docs agents

1. **Docs 1** — this file + short report (done when committed to disk).  
2. **Docs 2** — Admin full trio (create contract + finish plan; refresh FEATURES).  
3. **Docs 3** — Site FINISH-PLAN + light refresh.  
4. **Docs 4** — TechStack FEATURES + FINISH-PLAN + TF- alignment.  
5. **Docs 5** — README index, cross-link consistency, no contradictory status vocabulary.

Parallel 2–4 is fine if each sticks to its directory.

---

## 10. Acceptance of this design

This design is accepted for use when:

1. Domain agents can open this file and write track trios without inventing a second process.  
2. Matrix in §1 matches disk after agents finish.  
3. Failure prefixes AF/SF/TF/PF are used consistently.  
4. No product feature is invented solely in plan prose.

**Not acceptance:** product release, feature PASS, or gate green from design alone.

---

## 11. Explicit non-deliverables of Docs Agent 1

- No Admin/Site/TechStack plan content beyond this design.  
- No code changes.  
- No Failures.md edits.  
- No Planner edits.  
- No commit.
