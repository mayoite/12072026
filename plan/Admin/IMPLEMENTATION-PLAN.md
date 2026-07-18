# Admin order factory — linear desk first

**Owner model:** exact fields → Maker SVG → publish → guest place → BOQ. Library as you go. No owner blockers. Supabase+R2 = live dual intent.

**Goal (now):** Guest-visible publish identity + easy form → C3 browser → C4 place/BOQ.  
**K1–K3 unit:** Maker pen done. Do not re-open dual-pen debates.

**Architecture:** Form → Zod mm → `drawLinearDesk` → Maker paths → sanitise → `publishDescriptorWithPipeline` (disk + dual-write when ready) → Fabric place. Do not rebuild Planner.

**Tech:** TypeScript, Maker.js, Fabric, Next.js, Vitest · **1 implementer** · commit verified slices; push only if owner asks.

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
  → NOW: guest identity (oando- slug, SKU) on publish
  → C3 browser 160 cm publish
  → C4 guest place + BOQ (1280 + 390)
  → later families when a job needs a new drawer
  → C-AI field draft optional; kill if delays ship
```

---

## Task K1: Wire form / CLI / publish to Maker only

**Files:**
- Create or modify: `site/features/planner/asset-engine/svg/parametric/drawLinearDesk.ts` (or replace template export)
- Modify: `site/features/planner/asset-engine/svg/parametric/index.ts`
- Modify: `site/features/planner/asset-engine/svg/makerJsRecipes.ts` (map schema insets if missing)
- Modify: `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx`
- Modify: `site/features/admin/svg-editor/parametric/compileLinearDeskSvg.ts`
- Modify: `site/scripts/render-linear-desk.mts`
- Test: `site/tests/unit/features/planner/asset-engine/svg/parametric/` (new or extend)
- Optionally thin-wrap or delete dual authority from `drawLinearDeskFromTemplate.ts` after green

- [ ] **Step 1: Write failing unit — parametric SVG uses Maker parts**

```typescript
// site/tests/unit/features/planner/asset-engine/svg/parametric/drawLinearDesk.test.ts
import { drawLinearDesk, renderLinearDeskSvg } from "@/features/planner/asset-engine/svg/parametric";
import { parseLinearDeskFields } from "@/features/planner/asset-engine/svg/parametric/linearDeskFields";

it("drawLinearDesk emits multipath ids from Maker (desk-top + pedestals)", () => {
  const fields = parseLinearDeskFields({
    type: "linear-desk",
    widthMm: 1600,
    depthMm: 800,
    pedestalCount: 2,
  });
  const draw = drawLinearDesk(fields);
  const ids = draw.parts.map((p) => p.id);
  expect(ids).toEqual(expect.arrayContaining(["desk-top", "pedestal-l", "pedestal-r"]));
});

it("width change regenerates different path data", () => {
  const a = renderLinearDeskSvg(parseLinearDeskFields({ type: "linear-desk", widthMm: 1400, depthMm: 800 }));
  const b = renderLinearDeskSvg(parseLinearDeskFields({ type: "linear-desk", widthMm: 1800, depthMm: 800 }));
  expect(a).not.toBe(b);
  expect(a).toMatch(/viewBox="0 0 1400/);
  expect(b).toMatch(/viewBox="0 0 1800/);
});

it("renderLinearDeskSvg has no currentColor / var(", () => {
  const svg = renderLinearDeskSvg(parseLinearDeskFields({ type: "linear-desk", widthMm: 1600, depthMm: 800 }));
  expect(svg).not.toMatch(/currentColor|var\s*\(/i);
});
```

- [ ] **Step 2: Run — expect FAIL until Maker wired**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric --reporter=dot
```

- [ ] **Step 3: Implement single Maker drawer**

1. Map `LinearDeskFields` → `LinearDeskMakerRecipe` (`recipe: "linear-desk"`, width/depth/top/pedestal flags from fields).
2. Call `compileMakerRecipeToPaths` from `makerJsToPath.ts`.
3. Assemble image-safe multipath SVG (reuse paint approach from template `linearDeskPartsToSvg` or pipeline-safe hex).
4. Export `drawLinearDesk` + `renderLinearDeskSvg` from barrel; form/compile/CLI must import only that.
5. Extend Maker recipe if schema insets (`pedestalInsetMm`, `pedestalTopGapMm`, `pedestalBackInsetMm`, modesty) are still hard-coded constants — schema is authority for parametric path.
6. Ensure `renderLinearDeskSvg` is **not** a pure re-export of `drawLinearDeskFromTemplate` after this task.

- [ ] **Step 4: Point Admin form + compile + CLI at Maker path only**

- `LinearDeskParametricForm.tsx`: keep `renderLinearDeskSvg` import from parametric barrel (now Maker).
- `compileLinearDeskSvg.ts`: same.
- `scripts/render-linear-desk.mts`: same barrel; still default write under `results/admin/parametric/`; `--catalog` owner-only.

- [ ] **Step 5: Run units — expect PASS**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric tests/unit/features/planner/asset-engine/svg/makerJsRecipes.test.ts tests/unit/features/admin/svg-editor/parametric --reporter=dot
```

- [ ] **Step 6: Commit** — after verified slice (push only if owner asks)

```powershell
git add site/features/planner/asset-engine/svg/parametric site/features/admin/svg-editor/parametric site/scripts/render-linear-desk.mts site/tests/unit/features/planner/asset-engine/svg/parametric
git commit -m "feat(admin): parametric linear desk draw via Maker.js only (K1)"
```

---

## Task K2: Unit proves Maker path (no template authority)

**Files:**
- Test: extend parametric unit suite
- Optional: assert source/module of draw does not call template when `pedestalCount === 2`

- [ ] **Step 1: Failing test that template-only path is not used for publish compile**

Spy or structural assert: `compileLinearDeskSvg` output part ids match Maker ids (`desk-top`, `pedestal-l`, `pedestal-r`) and fail if only frame/top/pedestal template roles without Maker path.

- [ ] **Step 2: Run**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric tests/unit/features/planner/asset-engine/svg/parametric --reporter=dot
```

- [ ] **Step 3: Remove or demote `drawLinearDeskFromTemplate` to deprecated helper unused by form/publish**

- [ ] **Step 4: Commit** — after verified slice (push only if owner asks)

---

## Task K3: Form fields = schema 1:1

**Files:**
- `site/features/admin/svg-editor/parametric/linearDeskFormModel.ts`
- `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx`
- `site/tests/unit/features/admin/svg-editor/parametric/linearDeskFormModel.test.ts`

- [ ] **Step 1: Audit form keys vs `LinearDeskFieldsSchema`**

Exact schema names (live): `type`, `widthMm`, `depthMm`, `heightMm`, `topThicknessMm`, `pedestalWidthMm`, `pedestalInsetMm`, `pedestalTopGapMm`, `pedestalBackInsetMm`, `pedestalCount`, `modesty`, `seriesId`, `name`, `sku`, `slug`. Display unit is session-only.

Form model keys today: `width`, `depth`, `height`, `topThickness`, `pedestalWidth`, `pedestalInset`, `pedestalTopGap`, `pedestalBackInset` (via `units.ts`) + pedestalCount, modesty, name, sku, seriesId, slug.

**Live UI (re-verify 2026-07-18):** `LinearDeskParametricForm.tsx` binds `pedestalTopGap` + `pedestalBackInset` (K3 unit PASS). Browser C3 still OPEN.

- [x] **Step 2: Unit tests for mm/cm convert via `units.ts`**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/linearDeskFormModel.test.ts --reporter=dot
```

Cases: 160 cm → 1600 mm; 1400 mm → 140 cm; round-trip stable; draw always receives mm.

- [x] **Step 3: Fix gaps** — pedestalTopGap + pedestalBackInset controls bound; schema 1:1.

- [ ] **Step 4: Commit** — after verified slice (push only if owner asks)

---

## Task C3: Admin zero-code UI browser gate

**Files (exist):**
- `site/app/admin/svg-editor/parametric/page.tsx`
- `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx`
- `site/features/admin/svg-editor/parametric/publishLinearDeskAction.ts`
- List CTA: `site/features/admin/svg-editor/views/AdminSvgEditorListView.tsx`

**Blocked on:** K1–K2 green.

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
5. Artifact under disk catalog + descriptor (slug) — confirm paths; do not claim DB authority.

Record: console errors = 0, failed requests = 0.

- [ ] **Step 2: Optional e2e** under `site/tests/e2e/` with isolation helpers (tmp catalog) if owner wants automation — never mutate canonical catalog from unit tests.

- [ ] **Step 3: Update CHECKLIST Part C C3 statuses only with evidence**

- [ ] **Step 4: Commit** — after verified slice (push only if owner asks)

---

## Task C4: Planner consume + browser place

**Files (map before edit):**
- Planner SVG load: `site/app/api/planner/catalog/svg-blocks/route.ts`
- Guest inventory / place: planner guest routes under `site/app/planner/`
- BOQ name/SKU from product fields

- [ ] **Step 1: Ensure published parametric slug is buyer/approved-visible for guest**

- [ ] **Step 2: Browser place at 1280 and 390**

```powershell
pnpm run dev
# /planner/guest/ — inventory thumb + place desk
```

Pass: Fabric paints published SVG (not Block2D miss); BOQ shows name + SKU; console 0 / failed SVG 0.

- [ ] **Step 3: Update CHECKLIST C4 with evidence**

- [ ] **Step 4: Commit** — after verified slice (push only if owner asks)

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

## Task C-AI (defer until C2/K1 unit green)

- [ ] **C-AI.0** No AI on publish path before K1 unit green.
- [ ] **C-AI.1** "Suggest fields" → untrusted JSON → `LinearDeskFieldsSchema` → form draft only.
- [ ] **C-AI.2** Preview + publish = Maker `drawLinearDesk` only.
- [ ] **C-AI.3** Human gate; server keys; rate limit; no BOQ/PII in prompts.
- [ ] **C-AI.5** Kill switch: if AI delays K1/C3, drop AI and ship desk.

---

## Explicit non-goals

- `SVG_RELEASE_AUTHORITY=db` flip
- react-planner or full GitHub planner import
- Switch pen off Maker.js
- AI geometry
- All furniture types day one
- Photoreal 3D first
- Canonical catalog mutation in tests
- Commit/push unless owner asked

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

1. K1–K3 unit green (Maker-only parametric path).  
2. C3 browser: form → preview → publish desk (160 cm).  
3. C4 browser: guest place at 1280 + 390; BOQ name/SKU.  
4. Q4 no currentColor on that published SVG.  
5. CHECKLIST Part C statuses updated with same-session evidence.

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
