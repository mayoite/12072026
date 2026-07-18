# Admin order factory — linear desk first

**Owner model:** exact fields → Maker SVG → publish → guest place → BOQ. Library as you go. No owner blockers. Supabase+R2 = live dual intent.

**Goal (now):** **C3 browser** (160 cm → preview → publish) → **C4 browser** place/BOQ at 1280 + 390.  
**Unit done (do not re-open):** K1–K3 Maker pen + form knobs; guest identity (`oando-` slug / SKU); C4 load-rule **code path** (buyer live + place→BOQ).  
**Still OPEN:** C3 browser gate; C4 browser 1280/390; C4 unit may need authority-aware preview URL when `SVG_RELEASE_AUTHORITY=db`.

**Architecture:** Form → Zod mm → `drawLinearDesk` → Maker paths → sanitise → `publishDescriptorWithPipeline` (disk + dual-write when ready) → Fabric place. Do not rebuild Planner.

**Tech:** TypeScript, Maker.js, Fabric, Next.js, Vitest · **1 implementer** · commit verified slices; push when slice should land (see `Agents.md`).

---

## Code truth (re-verify with Read before claiming)

| Claim | Live code | Status |
|-------|-----------|--------|
| Form uses Maker | `LinearDeskParametricForm.tsx` → barrel `renderLinearDeskSvg` → `drawLinearDesk` → Maker | **K1 unit-green** |
| Compile uses Maker | `compileLinearDeskSvg.ts` → same Maker path | **K1 unit-green** |
| CLI uses Maker | `scripts/render-linear-desk.mts` → same Maker path | **K1 unit-green** |
| Schema fields | `linearDeskFields.ts`: type, widthMm, depthMm, heightMm, topThicknessMm, pedestalWidthMm, pedestalInsetMm, pedestalTopGapMm, pedestalBackInsetMm, pedestalCount 0\|2, modesty, seriesId, name, sku, slug | DONE (unit) |
| Form model vs schema | `linearDeskFormModel.ts` maps all mm fields via `units.ts` | DONE (unit) |
| Form UI knobs | `LinearDeskParametricForm.tsx` | **K3 unit-green** — pedestalTopGap + pedestalBackInset controls bound; browser OPEN |
| Maker recipes | `makerJsRecipes.ts`: `buildLinearDeskMakerModel`, `buildLDeskMakerModel`, `buildMakerModel`; form maps schema insets via `fieldsToLinearDeskMakerRecipe` | PARTIAL (unit) |
| Maker → path | `makerJsToPath.ts` `compileMakerRecipeToPaths` | PARTIAL (unit) — form pen + pipeline IR |
| Route | `site/app/admin/svg-editor/parametric/page.tsx` → `LinearDeskParametricForm` | PARTIAL |
| Publish | `publishLinearDeskAction.ts` → `compileLinearDeskSvg` → Maker SVG → pipeline | PARTIAL (browser OPEN) |
| Units | `features/planner/model/units.ts` `displayValueToMm` / `mmToDisplayValue` | DONE |
| Isolation | `catalogWriteIsolation.ts` + A0 unit suite | DONE (unit) |

**Barrel today:** `features/planner/asset-engine/svg/parametric/index.ts` exports Maker `drawLinearDesk` / `renderLinearDeskSvg`; template is deprecated residual only.

**GitHub pins:** Maker.js https://github.com/microsoft/maker.js · Fabric https://github.com/fabricjs/fabric.js · monorepo https://github.com/mayoite/12072026 · Excalidraw draft only https://github.com/excalidraw/excalidraw · **no** react-planner.

---

## Quality bar

| Id | Pass means |
|----|------------|
| Q1 | Meeting tables: filled legs/posts (Track G; not K1 gate) |
| Q2 | Chairs/sofas: multipath (later types) |
| Q3 | Linear desks: worksurface + dual pedestals (sample-desk language) |
| Q4 | No `currentColor` / `var(` in published fills |
| Q5 | Stroke scales with footprint (C5 / Track G) |
| Q6 | Admin preview markup = publish compile for same fields |
| Q8 | Unit tests never write canonical catalog |
| Q9 | Guest place readable at **1280** and **390** |

**Sample bar:** `site/public/svg-catalog/sample-desk-1.svg`

---

## Task order (strict)

```text
DONE unit: K1–K3 Maker pen + form knobs
DONE unit: guest identity (oando- slug, SKU) on publish
DONE unit path: C4 load rule code (live lifecycle + place→BOQ helpers) — browser OPEN
  → NOW: C3 browser 160 cm publish
  → NEXT: C4 guest place + BOQ (1280 + 390)
  → later families when a job needs a new drawer
  → C-AI field draft optional; kill if delays ship
```

**Re-verify command (2026-07-18 parent):** Maker draw + form-model + guest-identity units green. **Not green same session:** `c4GuestPlaceLoadRule` (disk URL vs revision API under `SVG_RELEASE_AUTHORITY=db`); `publishLinearDeskIsolatedPath` (`result.success` false). Fix those before claiming C4 / isolated-publish unit PASS.

---

## Task K1: Wire form / CLI / publish to Maker only — **DONE (unit)**

**Evidence:** `drawLinearDesk.test.ts` · barrel Maker exports · form/compile/CLI → `renderLinearDeskSvg` · template residual only.  
**Do not re-open dual-pen.**

**Files (landed):**
- `drawLinearDesk.ts`, parametric `index.ts`, `makerJsRecipes.ts`, `LinearDeskParametricForm.tsx`, `compileLinearDeskSvg.ts`, `scripts/render-linear-desk.mts`
- Tests: `tests/unit/features/planner/asset-engine/svg/parametric/`

- [x] **Step 1: Unit — parametric SVG uses Maker parts** — `drawLinearDesk.test.ts` (desk-top + pedestals; width regenerates; no currentColor)
- [x] **Step 2: Run units** — parametric suite green (re-run on change)
- [x] **Step 3: Single Maker drawer** — `fieldsToLinearDeskMakerRecipe` → `compileMakerRecipeToPaths`
- [x] **Step 4: Form + compile + CLI** → Maker barrel only
- [x] **Step 5: Units PASS** — Maker + form parametric suites
- [x] **Step 6: Commit** — prior verified slices (historical)

---

## Task K2: Unit proves Maker path (no template authority) — **DONE (unit)**

- [x] **Step 1: Compile/form path Maker part ids** — not template-only roles
- [x] **Step 2: Units green**
- [x] **Step 3: Template demoted** — `drawLinearDeskFromTemplate.ts` deprecated residual; form/CLI/publish unused
- [x] **Step 4: Commit** — prior verified slices

---

## Task K3: Form fields = schema 1:1 — **DONE (unit)** · browser C3 OPEN

**Files:**
- `linearDeskFormModel.ts` · `LinearDeskParametricForm.tsx` · `linearDeskFormModel.test.ts`

- [x] **Step 1: Audit form keys vs `LinearDeskFieldsSchema`** — full mm knobs incl. pedestalTopGap / pedestalBackInset
- [x] **Step 2: Unit tests for mm/cm via `units.ts`** — 160 cm → 1600 mm; round-trip
- [x] **Step 3: Form UI binds gaps** — K3 unit PASS (2026-07-18)
- [x] **Step 4: Commit** — prior verified slices

---

## Task GUEST-ID: Guest-visible slug / SKU — **DONE (unit)**

**Not “NOW”.** Code: `linearDeskGuestIdentity.ts` · used by `publishLinearDeskAction` / `buildLinearDeskPublishDescriptor`.  
**Tests:** `linearDeskGuestIdentity.test.ts` · `linearDeskPublishDescriptor.test.ts`.

- [x] `ensureGuestVisibleSlug` → `oando-*`
- [x] `ensureCommercialSku` commercial default
- [x] Width syncs default slug/SKU/name only while pattern-default (form model)
- [x] Publish sets lifecycle **live** for guest visibility (`setCatalogLifecycle`)

---

## Task C3: Admin zero-code UI browser gate — **NOW (OPEN)**

**Files (exist):**
- `site/app/admin/svg-editor/parametric/page.tsx`
- `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx`
- `site/features/admin/svg-editor/parametric/publishLinearDeskAction.ts`
- List CTA: `site/features/admin/svg-editor/views/AdminSvgEditorListView.tsx`

**Unblocked:** K1–K3 + guest identity unit green. **Gate = browser only.**

- [ ] **Step 1: Manual / Playwright browser**

Preconditions: `DEV_AUTH_BYPASS=1` in repo-root `.env.local` for local interactive admin (not deploy auth proof).

```powershell
pnpm run dev
# open /admin/svg-editor/parametric
```

Steps:
1. Unit toggle **cm**.
2. Set width **160** cm (1600 mm).
3. Preview shows multipath desk (not single grey slab).
4. Publish succeeds.
5. Artifact / revision path recorded honestly (disk and/or DB+R2 per live authority) — no fake cutover claim.

Record: console errors = 0, failed requests = 0.

- [ ] **Step 2: Optional e2e** under `site/tests/e2e/` with isolation helpers (tmp catalog) if wanted — never mutate canonical catalog from unit tests.

- [ ] **Step 3: Update CHECKLIST Part C C3 statuses only with evidence**

- [ ] **Step 4: Commit** — after verified slice

---

## Task C4: Planner consume + browser place — **NEXT (OPEN)**

**Files:**
- Planner SVG load: `site/app/api/planner/catalog/svg-blocks/route.ts`
- Guest inventory / place: planner guest routes under `site/app/planner/`
- BOQ: `projectFurnitureBoq` / place stamps
- Unit: `tests/unit/features/planner/catalog/c4GuestPlaceLoadRule.test.ts`

- [x] **Step 1a: Code path** — publish → guest-visible slug + live lifecycle + catalog map (see FEATURES “C4 load rule”)
- [ ] **Step 1b: Unit green under live authority** — 2026-07-18: can FAIL if test hard-codes `/svg-catalog/{slug}.svg` while DB authority returns `/api/planner/catalog/svg/{revisionId}` — make assertion authority-aware before claiming unit PASS
- [ ] **Step 2: Browser place at 1280 and 390**

```powershell
pnpm run dev
# /planner/guest/ — inventory thumb + place desk
```

Pass: Fabric paints published SVG (not Block2D miss); BOQ shows name + SKU; console 0 / failed SVG 0.

- [ ] **Step 3: Update CHECKLIST C4 with evidence**

- [ ] **Step 4: Commit** — after verified slice

---

## Task G1–G3 (generator quality — after or parallel post-K1)

Do **not** block K1. Greys on **descriptor/maker IR** pipeline (Excalidraw path) are separate from parametric form pen.

| # | Focus | Primary paths | Unit command |
|---|-------|---------------|--------------|
| G1 | Role-aware boolean (legs = union not holes) | `normalizeDescriptorForPipeline.ts` | `pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/normalizeDescriptorForPipeline.test.ts` |
| G2 | Role paint + scale-aware stroke | `scripts/generate-svg/pipelineCore.ts` | `pnpm --filter oando-site exec vitest run tests/unit/scripts/generate-svg/pipelineCore.test.ts` |
| G3 | Linear-desk Maker sample language | `makerJsRecipes.ts` | `pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/makerJsRecipes.test.ts` |

Further G4–G9 (more recipes, fixtures, preview honesty, soft quality gate, owner recompile, guest place) live in CHECKLIST C5 / AF rows — expand only after G1–G3 unit green.

---

## Task C-AI (optional after C3; never blocks desk ship)

K1 unit is **done** — do not treat “wait for K1” as current work.

- [x] **C-AI.0** K1 unit green satisfied (historical gate).
- [ ] **C-AI.1** "Suggest fields" → untrusted JSON → `LinearDeskFieldsSchema` → form draft only.
- [ ] **C-AI.2** Preview + publish = Maker `drawLinearDesk` only.
- [ ] **C-AI.3** Human gate; server keys; rate limit; no BOQ/PII in prompts.
- [ ] **C-AI.5** Kill switch: if AI delays **C3**, drop AI and ship desk.

---

## Explicit non-goals

- `SVG_RELEASE_AUTHORITY=db` flip
- react-planner or full GitHub planner import
- Switch pen off Maker.js
- AI geometry
- All furniture types day one
- Photoreal 3D first
- Canonical catalog mutation in tests
- Leave verified slices uncommitted (Agents.md: commit; push when slice should land)

---

## Commands (cheat sheet)

```powershell
# Parametric + Maker units
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric tests/unit/features/admin/svg-editor/parametric tests/unit/features/planner/asset-engine/svg/makerJsRecipes.test.ts

# CLI (default results/ — not canonical catalog)
pnpm --filter oando-site run scripts:render-linear-desk -- scripts/generate-svg/_fixtures/linear-desk-param.json

# Isolation
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/storage/catalogWriteIsolation.test.ts tests/unit/features/admin/svg-editor/publish/adminCatalogIsolation.a0.test.ts

# Dev UI
pnpm run dev
# Admin: /admin/svg-editor/parametric
# Guest: /planner/guest/

# Before claim done
pnpm run check:layout
pnpm run check:plans-purity
```

---

## Done-enough ship slice

1. ~~K1–K3 unit green (Maker-only parametric path).~~ **done**  
2. ~~Guest identity unit (oando- slug / SKU / live).~~ **done**  
3. **NOW** C3 browser: form → preview → publish desk (160 cm).  
4. **NEXT** C4 browser: guest place at 1280 + 390; BOQ name/SKU.  
5. Q4 no currentColor on that published SVG.  
6. CHECKLIST Part C statuses updated with same-session evidence.

Then: C5 finesse, G4+ recipes, C6 next types, optional C-AI.

---

## Related

| Doc | Role |
|-----|------|
| `CHECKLIST.md` | Official evidence + phases + Part C spine |
| `FEATURES.md` | Live code map |
| `REALITY-AND-STACK.md` | Market reality + engine matrix |
| `../../Failures.md` | Active blockers / DB cutover |
| `../../agent-reports/ADMIN.md` | Track status notes |
