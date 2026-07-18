# Admin SVG Generator Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guests see filled meeting legs, sample-desk pedestals, and readable multipath seating on Wave 1 heroes at 1280 and 390 — not swiss-cheese tables or grey CAD blobs.

**Architecture:** Live publish stays `pipelineCore+normalize` (S1→S2→S3→S4). Fix S1 role-aware boolean + hard-fail bad maker; upgrade `linear-desk` to sample-desk pedestals; recompile Wave 1 only; Admin Publish preview = server compile (parallel, not guest done bar). Soft structure gate; hard only image-unsafe paint / empty / unknown maker.

**Tech Stack:** TypeScript, Maker.js, polygon-clipping, Vitest, Next.js server actions, disk descriptors + `site/public/svg-catalog/`.

---

## Owner quality bar

Wave 1 is **guest-visible plan symbols** (~readable office-plan furniture), not photoreal brand geometry.

| Must see | Pass means |
|----------|------------|
| Meeting | Filled leg posts (union multipath), not corner holes / `difference` swiss cheese |
| Linear desk | Worksurface + dual pedestals (`sample-desk-1` language), not knee-slab only |
| Seating | Existing multipath seat/back/arms stay filled after Task 1 — **no new recipe required** for Wave 1 |
| Paint | No `currentColor` / `var(` fills in published SVG |
| Scale | Thumbs readable at **1280×800** and **390×844** |

**Out of scope for Wave 1 done:** full 22-SKU catalog, Fluid≠Flex≠Omnia silhouette differentiation, photoreal series, DB SVG authority flip, Excalidraw→publish IR mapper, Task 4a/4b recipe zoo.

**Two-tier done:**

1. **Guest Wave 1 done** = Tasks **1 + 3 + 5a + 8a + 9a** green (+ Task 0 if seed broken).
2. **Engine/Admin complete** = also Task 6 (+ Task 2′ / Task 7′ as needed). Wave 2 is separate.

Unit green without **8a + 9a** is **not** guest done.

---

## Wave 1 heroes (only these for done bar)

| Slug | Source after this plan |
|------|------------------------|
| `oando-classy-meeting-1800` | Blocks `tabletop` + `leg-*` → **union** via Task 1 |
| `oando-eclipse-meeting-2400` **or** `oando-halo-meeting-3000` | Same block pattern → union |
| `oando-fluid-desk-1600` | Maker `linear-desk` → pedestals via Task 3 |
| One other linear desk (`oando-fluid-desk-1400` or flex/omnia) | Same maker |
| Optional: `oando-phoenix-l-desk-1600` | Existing `l-desk` (no recipe work) |

Chairs/sofas/storage that **already** have multipath blocks: Task 1 + recompile only. Do **not** block Wave 1 on Task 4 recipes.

---

## Facts (code today)

- Workspace: `E:\12072026`; package `oando-site`; **pnpm from repo root**.
- Classy meeting published SVG is **difference holes** (`data-block-variant="difference"`, evenodd).
- Seed already has classy/eclipse/halo with `tabletop` + `leg-*` blocks; fluid desks use `maker: linear-desk`.
- `linear-desk` currently emits `desk-top` + `desk-body` + `desk-knee-space` — wrong language vs `sample-desk-1` (top band + dual pedestals).
- `sample-desk-1.svg`: top rect + left/right pedestal rects.
- `useDebouncedCompile(slug, form, opts?)` — action is fixed inside the hook; pass `{ delayMs }` only.
- `compileSvgForPublish` → `{ ok: true, svg, stages, normalized } | { ok: false, error, failedAt, stages }`.
- Scripts: `pnpm --filter oando-site run seed:block-descriptors` · `sync:descriptor-svgs`.
- Seed `themeTokens` keys today (`fill-primary`, hex values) may fail `BlockDescriptorThemeTokensSchema` (keys: `currentColor` \| `--kebab`; **no `#hex` in token values**). Run Task 0 preflight.

---

## Binding task graph

```
Task 0 (if seed freeze fails): themeTokens schema-legal
    ↓
Task 1: role-aware boolean + hard-fail maker + orphan delete
    ├── parallel → Task 6 (Admin honesty; not guest done bar)
    ↓
Task 3: linear-desk sample pedestals (numeric)
    ↓
Task 5a: thin fixtures
    ↓
Task 8a: seed + recompile Wave 1 heroes ONLY
    ↓
Task 9a: browser Wave 1 @ 1280 + 390   ← guest done bar

Support if needed: Task 2′ (min paint safety), Task 7′ (soft/hard gate)
Wave 2: Task 4a/4b, Task 8b rest of catalog
```

**FORBIDDEN**

- Full-catalog recompile / claim “all 22 done” before **1 + 3 + 5a** green and **8a + 9a** pass.
- Task 3 ∥ Task 4 (same maker files) — 4 is Wave 2 anyway.
- Unit tests calling `seed:block-descriptors` or `sync:descriptor-svgs`.
- Unit tests writing `inventory/descriptors` or `public/svg-catalog`.
- Claiming guest done without **8a + 9a**.
- Quality gate auto-passing solely because `difference` + `evenodd`.
- Client imports of `compileSvgForPublish` / `makerJsRecipes` / `pipelineCore`.
- Commit/push unless owner asked.

---

## File map

| Path | Role |
|------|------|
| `site/features/planner/asset-engine/svg/normalizeDescriptorForPipeline.ts` | S1 boolean + maker hard-fail |
| `site/features/planner/asset-engine/svg/makerJsRecipes.ts` | `linear-desk` geometry |
| `site/features/planner/catalog/svg/svgTypes.ts` | Zod maker + themeTokens |
| `site/scripts/generate-svg/pipelineCore.ts` | Paint / stroke / SVG string |
| `site/scripts/seed-block-descriptors.ts` | Seed freeze + heroes |
| `site/features/admin/svg-editor/views/AdminSvgEditorEditView.tsx` | Publish preview wire |
| `site/features/admin/svg-editor/publish/useDebouncedCompile.ts` | Use as-is API |
| `site/features/admin/svg-editor/publish/planSvgQualityGate.ts` | **Create** if Task 7′ |
| `site/features/admin/svg-editor/publish/publishDescriptorWithPipeline.ts` | Call gate after compile |
| Name-mirrored tests under `site/tests/unit/...` | TDD only |

**Delete orphan (exact):**

- `site/tests/unit/features/planner/asset-engine/normalizeDescriptorForPipeline.test.ts`  
  Keep only `.../svg/normalizeDescriptorForPipeline.test.ts`.

---

### Task 0: Seed themeTokens freeze preflight (if needed)

**Files:** `site/scripts/seed-block-descriptors.ts`, optionally a tiny freeze unit under `site/tests/unit/scripts/`.

- [ ] **Step 1:** Prove freeze path. From repo root:

```powershell
pnpm --filter oando-site exec tsx -e "const { BlockDescriptorThemeTokensSchema } = require('./features/planner/catalog/svg/svgTypes.ts'); console.log(BlockDescriptorThemeTokensSchema.safeParse({ 'fill-primary': '#8a8680', 'stroke-accent': '#2c2a28' }))"
```

If invalid (expected: bad keys and/or `#hex` values), fix seed tokens to schema-legal, e.g. keys `currentColor` / `--fill-primary` / `--stroke-accent` with **semantic var values** (no `#hex` in `themeTokens`). Image-safe hex paint still comes from pipeline defaults / resolved paint — not illegal token map entries.

- [ ] **Step 2:** Confirm `freezeFreshDescriptor` / `buildDescriptor` succeeds for one hero slug without throw (run seed dry or existing freeze helper).

- [ ] **Step 3:** If freeze already green, mark Task 0 N/A and continue.

---

### Task 1: Role-aware boolean + hard-fail maker + orphan delete

**Files:**

- Modify: `site/features/planner/asset-engine/svg/normalizeDescriptorForPipeline.ts`
- Modify: `site/tests/unit/features/planner/asset-engine/svg/normalizeDescriptorForPipeline.test.ts`
- Delete: `site/tests/unit/features/planner/asset-engine/normalizeDescriptorForPipeline.test.ts`

- [ ] **Step 1: Failing tests** (name-mirrored file only)

```typescript
const POSITIVE_PARTS = [
  { id: "tabletop", x: 0, y: 0, width: 1800, depth: 900 },
  { id: "leg-nw", x: 80, y: 80, width: 60, depth: 60 },
  { id: "leg-ne", x: 1660, y: 80, width: 60, depth: 60 },
  { id: "leg-sw", x: 80, y: 760, width: 60, depth: 60 },
  { id: "leg-se", x: 1660, y: 760, width: 60, depth: 60 },
];

it("fixed meeting tabletop + leg-* → union", () => {
  const n = normalizeDescriptorForPipeline({
    slug: "oando-classy-meeting-1800",
    variant: "fixed",
    viewBox: { x: 0, y: 0, width: 1800, height: 900 },
    blocks: POSITIVE_PARTS,
  });
  expect(n.variant).toBe("union");
});

it("fixed chair seat/backrest/base → union", () => {
  const n = normalizeDescriptorForPipeline({
    slug: "chair",
    variant: "fixed",
    viewBox: { x: 0, y: 0, width: 650, height: 650 },
    blocks: [
      { id: "seat", x: 100, y: 140, width: 450, depth: 380 },
      { id: "backrest", x: 100, y: 100, width: 450, depth: 80 },
      { id: "base", x: 200, y: 500, width: 250, depth: 80 },
    ],
  });
  expect(n.variant).toBe("union");
});

it("plural legs/arms tokens count as positive", () => {
  const n = normalizeDescriptorForPipeline({
    slug: "sofa",
    variant: "fixed",
    viewBox: { x: 0, y: 0, width: 2200, height: 900 },
    blocks: [
      { id: "seat", x: 100, y: 200, width: 2000, depth: 500 },
      { id: "arms", x: 50, y: 180, width: 80, depth: 540 },
      { id: "legs", x: 120, y: 720, width: 60, depth: 60 },
    ],
  });
  expect(n.variant).toBe("union");
});

it("leg-cutout-* + tabletop fixed → difference", () => {
  const n = normalizeDescriptorForPipeline({
    slug: "cutout-table",
    variant: "fixed",
    viewBox: { x: 0, y: 0, width: 600, height: 900 },
    blocks: [
      { id: "tabletop", x: 0, y: 0, width: 600, depth: 600 },
      { id: "leg-cutout-nw", x: 25, y: 25, width: 50, depth: 50 },
    ],
  });
  expect(n.variant).toBe("difference");
});

it("id cut + tabletop fixed → difference", () => {
  const n = normalizeDescriptorForPipeline({
    slug: "side-table-001",
    variant: "fixed",
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    blocks: [
      { id: "tabletop", x: 0, y: 0, width: 600, depth: 600 },
      { id: "cut", x: 25, y: 25, width: 50, depth: 50 },
    ],
  });
  expect(n.variant).toBe("difference");
});

it("explicit variant difference wins over positive ids", () => {
  expect(
    resolveBooleanVariant("difference", [
      { x: 0, y: 0, width: 100, height: 100, id: "seat" },
      { x: 10, y: 10, width: 20, height: 20, id: "leg-1" },
    ]),
  ).toBe("difference");
});

it("unknown maker recipe throws", () => {
  expect(() =>
    normalizeDescriptorForPipeline({
      slug: "x",
      viewBox: { x: 0, y: 0, width: 1, height: 1 },
      maker: { recipe: "not-a-real-recipe", widthMm: 1, depthMm: 1 },
    }),
  ).toThrow(/Unknown maker recipe/i);
});

it("incomplete linear-desk maker throws", () => {
  expect(() =>
    normalizeDescriptorForPipeline({
      slug: "x",
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      maker: { recipe: "linear-desk" },
    }),
  ).toThrow(/Invalid maker recipe/i);
});
```

- [ ] **Step 2: Expect FAIL**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/normalizeDescriptorForPipeline.test.ts --reporter=dot
```

- [ ] **Step 3: Implement shared token helper** (not one mega-regex)

```typescript
const POSITIVE_TOKENS = new Set([
  "leg", "legs", "arm", "arms", "base", "door", "drawer", "seat", "backrest",
  "tabletop", "top", "body", "carcass", "screen", "run", "pedestal", "modesty",
  "worksurface", "handle", "core", "post", "support", "panel", "cushion",
  "return", "main", "desk",
]);
const CUTOUT_TOKENS = new Set([
  "cutout", "hole", "void", "subtract", "knockout", "cut",
]);

function idTokens(id: string | undefined): string[] {
  if (!id) return [];
  return id.toLowerCase().split(/[-_./]+/).filter(Boolean);
}

function blockIdSuggestsCutout(id: string | undefined): boolean {
  return idTokens(id).some((t) => CUTOUT_TOKENS.has(t));
}

function blockIdSuggestsPositiveFurniture(id: string | undefined): boolean {
  if (blockIdSuggestsCutout(id)) return false;
  return idTokens(id).some((t) => POSITIVE_TOKENS.has(t));
}

function blocksLookLikeCutouts(blocks: readonly PipelineBlockRect[]): boolean {
  if (blocks.length < 2) return false;
  const areas = blocks.map((b) => b.width * b.height);
  const maxArea = Math.max(...areas);
  if (maxArea <= 0) return false;

  const hasPositive = blocks.some((b) => blockIdSuggestsPositiveFurniture(b.id));
  if (hasPositive) {
    const small = blocks.filter((b) => (b.width * b.height) / maxArea < 0.15);
    if (small.length === 0) return false;
    // Difference only if every small part is explicitly cutout-named
    return small.every((b) => blockIdSuggestsCutout(b.id));
  }

  if (blocks.some((b) => blockIdSuggestsCutout(b.id))) return true;
  const minArea = Math.min(...areas);
  return minArea / maxArea < 0.15;
}
```

**parseMakerRecipe hard-fail** — replace silent `undefined` for unknown / incomplete:

```typescript
const KNOWN_RECIPES = new Set(["linear-desk", "l-desk"]); // Wave 2 expands here only

function parseMakerRecipe(raw: unknown): MakerRecipe | undefined {
  const o = asRecord(raw);
  if (!o) return undefined;
  const recipe = typeof o.recipe === "string" ? o.recipe.trim() : "";
  if (!recipe) return undefined;
  if (!KNOWN_RECIPES.has(recipe)) {
    throw new Error(`Unknown maker recipe: ${recipe}`);
  }
  // missing required numbers → throw Invalid maker recipe: ...
}
```

- [ ] **Step 4: Delete orphan; PASS**

```powershell
Remove-Item -Force site/tests/unit/features/planner/asset-engine/normalizeDescriptorForPipeline.test.ts -ErrorAction SilentlyContinue
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/normalizeDescriptorForPipeline.test.ts --reporter=dot
```

- [ ] **Step 5:** Commit only if owner asked.

---

### Task 3: Linear-desk sample pedestals (numeric)

**Do not start Task 4 in parallel.** Wave 1 does not require `rect-table`.

**Files:**

- `site/features/planner/asset-engine/svg/makerJsRecipes.ts`
- `site/features/planner/catalog/svg/svgTypes.ts` (Zod lockstep)
- `parseMakerRecipe` in normalize (optional `pedestalWidthMm`, `pedestals`)
- Tests: `makerJsToPath.test.ts`, `makerJsRecipes.test.ts`, `makerJsPipeline.test.ts`

**Single recipe registry rule:** every new field lands in **types + Zod + parseMakerRecipe + buildMakerModel** together. No third half-updated path.

- [ ] **Step 1: Failing test**

```typescript
it("linear-desk emits desk-top + pedestal-l + pedestal-r (no knee slab)", () => {
  const { parts } = compileMakerRecipeToPaths({
    recipe: "linear-desk",
    widthMm: 1600,
    depthMm: 800,
    topThicknessMm: 80,
  });
  const ids = parts.map((p) => p.id);
  expect(ids).toEqual(expect.arrayContaining(["desk-top", "pedestal-l", "pedestal-r"]));
  expect(ids).not.toContain("desk-knee-space");
});
```

- [ ] **Step 2: Implement numeric sample-desk language**

Defaults when `pedestals !== false`:

- Top band: full width × `topThicknessMm` (default 80).
- Dual **square/rect pedestals** (not circles): inset like `sample-desk-1` (~120mm inset, pedestal ~200mm wide, height from below top to depth).
- Optional `pedestalWidthMm`, `pedestals?: boolean`.
- Keep existing Maker.js **Y-export convention** (do not flip coordinate system).
- Prefer filled rect posts; **no** circle legs in this task.

Zod:

```typescript
z.object({
  recipe: z.literal("linear-desk"),
  widthMm: z.number().finite().positive(),
  depthMm: z.number().finite().positive(),
  topThicknessMm: z.number().finite().positive().optional(),
  pedestalWidthMm: z.number().finite().positive().optional(),
  pedestals: z.boolean().optional(),
}),
```

- [ ] **Step 3: Suite PASS**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine --reporter=dot
```

If goldens / pipeline golden tests break solely from path id changes, run **Golden update procedure** (below) — that is support work, not a separate milestone.

- [ ] **Step 4:** Commit only if owner asked.

---

### Task 5a: Thin fixtures (Wave 1 proof)

**Files:**

- Fixtures: `site/scripts/generate-svg/_fixtures/` (create as needed)
- Create: `site/tests/unit/scripts/generate-svg/furnitureQualityCompile.test.ts`

Resolve fixture paths from `__dirname` toward `site/scripts/generate-svg/_fixtures` (do not assume `process.cwd()` alone).

- [ ] **Step 1: Cases**

| Case | Assert |
|------|--------|
| Meeting blocks (classy shape) | multipath / part ids for legs; **not** `data-block-variant="difference"`; no `currentColor` |
| Maker linear-desk 1600 | `pedestal-l` + `pedestal-r` present; no `desk-knee-space` |
| Side-table cutouts | still **difference** + evenodd when cutout-named |
| Empty / broken maker | `ok: false` with error (hard-fail path) |

Do **not** require task-chair/sofa recipe fixtures for Wave 1. Seating is proven by Task 1 unit tests + real multipath SVGs after 8a if present.

- [ ] **Step 2: Run**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/scripts/generate-svg/furnitureQualityCompile.test.ts --reporter=dot
```

- [ ] **Step 3:** Commit only if owner asked.

---

### Task 8a: Recompile Wave 1 heroes only

**Only after Tasks 1 + 3 + 5a green.** Never from unit tests.

- [ ] **Step 1: Seed + sync**

```powershell
pnpm --filter oando-site run seed:block-descriptors
pnpm --filter oando-site run sync:descriptor-svgs
```

- [ ] **Step 2: Spot-check Wave 1**

```powershell
Select-String -Path site/public/svg-catalog/oando-classy-meeting-1800.svg -Pattern 'leg-nw|difference|currentColor|data-block-variant'
Select-String -Path site/public/svg-catalog/oando-fluid-desk-1600.svg -Pattern 'pedestal|desk-knee'
Select-String -Path site/public/svg-catalog/oando-eclipse-meeting-2400.svg -Pattern 'difference|leg-'
# or halo if that is the chosen second meeting
```

**Expected**

- Classy (and second meeting): filled multipath; **not** difference holes; no `currentColor`.
- Fluid 1600: pedestals present; no `desk-knee-space`.

- [ ] **Step 3:** Do **not** treat full 22 recompile as Wave 1 done. Extra SKUs may recompile as side effect of sync — guest bar remains Wave 1 heroes only.

---

### Task 9a: Mandatory browser Wave 1

**Not optional.** Unit green ≠ done.

```powershell
pnpm run dev
```

| ID | Check |
|----|--------|
| G1 | **1280×800**: inventory thumb `oando-classy-meeting-1800` — filled legs, not swiss cheese |
| G2 | **390×844**: same thumb readable |
| G3 | `oando-fluid-desk-1600` pedestals at both widths |
| G4 | Second meeting (eclipse or halo) at both widths |
| G5 | Second linear desk (1400 / flex / omnia) pedestal language |
| C1 | Place meeting + desk on guest canvas light grid — structure holds |
| H | Hard-refresh if SVG cached |

Optional: `oando-phoenix-l-desk-1600` place check. Seating thumbs only if multipath already on disk after 8a.

- [ ] Record PASS/FAIL honestly. Guest Wave 1 **fails** if G1–G3 fail.

---

### Task 6: Admin Publish preview honesty (parallel after Task 1)

**Not on guest done bar.** Different files from engine geometry.

**Files:** `AdminSvgEditorEditView.tsx`, preview rail; tests that assert hook **called**.

- [ ] Wire:

```typescript
const { result: preview, pending: previewPending } = useDebouncedCompile(slug, formForCompile, {
  delayMs: 300,
});
// Never pass action as prop — fixed inside hook
```

- [ ] `formForCompile` signature via `useMemo` over compile-relevant IR only.
- [ ] Primary rail: **Publish preview** → server result only (`LiveCompiledSvgPreview`).
- [ ] Secondary collapsed: **Studio sketch** — never `data-compiler-authority="compileSvgForPublish"`.
- [ ] **Maker-over-blocks banner** when form has `maker`: publish geometry is maker; studio is not released.
- [ ] IR strip: `maker: linear-desk` **or** `N blocks · union|difference`.
- [ ] `canPublish`: `preview?.ok && !previewPending && preview.svg` + footprint + core fields. Do not require Excalidraw non-blank when blocks/maker exist.
- [ ] No client imports of compile/maker/pipelineCore.
- [ ] Preview: no hard quality gate (soft warnings OK).

| Surface | Copy |
|---------|------|
| Header | Publish preview |
| Hint | Same server compile as Publish. |
| Studio | Studio sketch — drawing aid only; not what guests get |
| Banner | Geometry for Publish comes from product form (blocks or maker). Studio is not released. |

---

### Task 2′: Minimum paint safety (support, if needed)

**Demote** role-paint taxonomy and goldens-as-quality. Only required if published SVGs still have image-unsafe paint or fixed unusable stroke after Task 1/3/5a.

- Ensure published fills are image-safe hex (no `currentColor` / `var(` in guest SVG).
- Fix fallback stroke in `pipelineCore` if still `currentColor`.
- Optional light role shade is fine; do not block Wave 1 on paint craft scoreboard.

**Golden update procedure** (when unit goldens fail after intentional paint/path changes):

1. Run the failing golden test; capture current `runPipelineCore` / fixture output.
2. Overwrite only the affected files under `site/scripts/generate-svg/__goldens__/`.
3. Assert goldens: no `currentColor`/`var(`; structural ids still meaningful.
4. Re-run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/catalog-api/svgPipelineGolden.test.ts tests/unit/scripts/generate-svg/pipelineCore.test.ts --reporter=dot
```

Goldens are a **procedure**, not a quality milestone and not guest proof.

---

### Task 7′: Soft/hard quality gate (support)

**Files:** create `planSvgQualityGate.ts`; call from `publishDescriptorWithPipeline.ts` after `compile.ok`, before S4.

**Hard fail only**

- Image-unsafe paint (`fill="currentColor"` / `var(`).
- Empty SVG.
- Unknown / incomplete maker already failed at S1 (compile `ok: false`).

**Soft (warn or non-blocking structure message)**

- Under-structured symbols: prefer structure from **maker part ids OR multipath SVG ids OR blocks** — never path-count alone as craft claim.
- **Never** auto-pass solely because `difference` + `evenodd`.

```typescript
export type PlanSvgQualityResult =
  | { ok: true; warnings?: string[] }
  | { ok: false; error: string };

export function assertPlanSvgQuality(
  svg: string,
  ctx: {
    slug: string;
    variant?: string;
    partIds?: readonly string[];
    makerPartCount?: number;
  },
): PlanSvgQualityResult {
  if (!svg.trim()) return { ok: false, error: `empty svg for ${ctx.slug}` };
  if (/fill\s*=\s*["']currentColor/i.test(svg) || /fill\s*=\s*["']var\(/i.test(svg)) {
    return { ok: false, error: `image-unsafe paint on ${ctx.slug}` };
  }
  // Soft structure: compute from maker parts / multipath ids / blocks — warn only for Wave 1
  return { ok: true };
}
```

Publish maps hard fails to `PublishDescriptorResult` errors (Result dialect, no throw).

---

## Wave 2 (deferred — not guest Wave 1)

| Task | What |
|------|------|
| **4a** `rect-table` | Optional if blocks + Task 1 insufficient for some meetings; filled **square** posts, positive multipath, never cutouts |
| **4b** | `task-chair`, `sofa-3`, `storage-bays` — full recipe registry lockstep |
| **8b** | Recompile rest of brand heroes / full 22 |
| Browser | Expand matrix beyond Wave 1 |

Round cafe table: out of scope (use blocks or later rect-table).

---

## Done definition

### Guest Wave 1

- [ ] Task 0 done or N/A
- [ ] Task 1 unit suite green; orphan normalize test deleted
- [ ] Task 3 pedestals green; no `desk-knee-space` default
- [ ] Task 5a fixtures green
- [ ] `oando-classy-meeting-1800.svg`: filled legs, not difference holes
- [ ] `oando-fluid-desk-1600.svg`: `pedestal-l` / `pedestal-r`
- [ ] Task 9a G1–G3 PASS at 1280 and 390
- [ ] `pnpm run check:layout` PASS
- [ ] No `SVG_RELEASE_AUTHORITY=db` change
- [ ] Owner decides commit/push

### Engine/Admin complete (after guest)

- [ ] Task 6: Publish preview = server compile; studio secondary; maker banner
- [ ] Task 2′ / 7′ as needed (hard paint/empty only; soft structure)

### Explicit non-claims

- Unit green without **8a + 9a** is not product done.
- Full 22 recompile is not Wave 1 done.
- Goldens / path-count / role-paint taxonomy are not guest quality proof.

---

## Discussion appendix (brainstormer + critic consensus)

**Product (brainstormer):** Guest-visible wins first. Sample-driven archetypes beat recipe zoo. Wave 1 = few heroes, not all 22. Meetings/chairs/sofas with multipath blocks need Task 1 + recompile — not Task 4 recipes. Task 4b Wave 2; Task 4a only if blocks fail. Task 6 honesty is parallel, not guest done bar. Soft structure gate; hard only unsafe paint / empty / bad maker. Demote role-paint scoreboard, path-count craft claims, goldens-as-quality.

**Technical (critic):** Structure signals = maker parts **or** multipath ids **or** blocks — never auto-pass difference+evenodd. Shared positive/cutout tokens including plurals (`legs`, `arms`). Single recipe registry lockstep. Task 3 numeric pedestals; keep Maker Y convention; square posts. Task 1 hard-fails unknown/incomplete maker. Task 6 exact `useDebouncedCompile(slug, form, { delayMs })`; no client compile imports. Seed must freeze under `BlockDescriptorThemeTokensSchema` before 8a (Task 0). Delete exact orphan path. Golden updates are a procedure. Forbidden: full catalog before 1+3+5a; 3∥4; unit seed; done without 8a+9a.

---

## Open questions for owner (max 3)

1. Second meeting hero for Wave 1 browser matrix: **eclipse-2400** or **halo-3000**?
2. Second linear desk for Wave 1: **fluid-1400**, **flex-1200**, or **omnia-1800**?
3. Include optional **phoenix-l-desk-1600** in the mandatory 9a checklist, or leave optional?

---

## Self-check before declaring done

```powershell
pnpm run check:layout
```

Commits only if owner asked.
