# Generic Parametric Product Factory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the desk-specific Admin parametric editor with a generic type-drawer factory that matches `32.jpg`, uses Dockview, React Aria, Tailwind v4, and locked semantic CSS, preserves Maker/publish behavior, and can accept a future bed or other product drawer without shell changes.

**Architecture:** Keep pure product geometry in the Planner asset engine and Admin form metadata in an explicit authoring registry. Extend the existing `AdminSvgDockHost` with a backward-compatible factory preset for tools, properties, and SVG canvas. React Aria provides all controls and dialogs. A client-safe product manifest enforces parity between authoring and server publish registries. Preview maps structured Maker paths; publish sanitizes the full SVG from that same render.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Zod, Maker.js, Dockview React, React Aria Components, Phosphor, Tailwind CSS v4, locked semantic CSS, Vitest, Playwright.

**Spec:** `docs/architecture/13-PARAMETRIC-PRODUCT-FACTORY.md`

**Visual authority:** `docs/ui-benchmarks/parametric-lock/32.jpg` only.

**Repository rules:** Do not create a worktree. Use exactly two peer agents for every implementation slice, with three participants total including the writer. Commit or push only under the active owner/repository instructions after verification.

---

## File Structure

### Pure geometry and registry

- Create `site/features/planner/asset-engine/svg/parametric/productDrawer.ts` — typed drawer and runtime-erasure contracts.
- Create `site/features/planner/asset-engine/svg/parametric/productDrawerRegistry.ts` — explicit allowlisted runtime registry helper.
- Create `site/features/planner/asset-engine/svg/parametric/linearDeskDrawer.ts` — compatibility adapter used while the production assembly drawer lands.
- Create `site/features/planner/asset-engine/svg/parametric/parametricProductManifest.ts` — client-safe production type-id parity authority.
- Create `site/features/planner/asset-engine/svg/parametric/deskAssemblyFields.ts` — linear/U layout, workstation, aisle, dimensions, and options schema.
- Create `site/features/planner/asset-engine/svg/parametric/drawDeskAssembly.ts` — Maker-only multipath desk assembly geometry.
- Create `site/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer.ts` — generic production drawer adapter.
- Modify `site/features/planner/asset-engine/svg/parametric/index.ts` — export generic contracts and the desk assembly drawer.

### Admin authoring system

- Create `site/features/admin/svg-editor/parametric/authoringTypes.ts` — display-field, section, tool, identity, and parse contracts.
- Create `site/features/admin/svg-editor/parametric/deskAssemblyAuthoringDefinition.ts` — assembly display adapter and field/tool definitions.
- Create `site/features/admin/svg-editor/parametric/parametricAuthoringRegistry.ts` — client-safe explicit registry.
- Create `site/features/admin/svg-editor/parametric/useParametricProductEditor.ts` — generic editor state and commands.
- Create `site/features/admin/svg-editor/parametric/ParametricProductEditor.tsx` — generic composition root.
- Create `site/features/admin/svg-editor/parametric/ParametricEditorTopBar.tsx` — Inventory, type selection, identity, Publish.
- Create `site/features/admin/svg-editor/parametric/ParametricStatusBar.tsx` — lifecycle, validation, footprint, release feedback.
- Create `site/features/admin/svg-editor/parametric/ParametricPropertiesPanel.tsx` — generic field-section renderer.
- Create `site/features/admin/svg-editor/parametric/ParametricPublishConfirmDialog.tsx` — generic React Aria publish confirmation.
- Create `site/features/admin/svg-editor/parametric/ParametricPlanCanvas.tsx` — SVG viewBox pan/zoom/fit, grid, measurement, part selection.
- Create `site/features/admin/svg-editor/parametric/ParametricToolRailAdapter.tsx` — maps drawer capabilities/tools into `CanvasToolRail` parametric mode.
- Modify `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx` — temporary compatibility wrapper around the generic editor.
- Modify `site/features/admin/svg-editor/parametric/LinearDeskPublishConfirmDialog.tsx` — temporary compatibility wrapper around the generic dialog.
- Modify `site/app/admin/svg-editor/parametric/page.tsx` — render the generic editor.

- Modify `site/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.tsx` — add backward-compatible factory slots/preset.
- Create `site/features/admin/svg-editor/views/edit-shell/adminSvgDockPresets.ts` — factory-only versioned storage/preset validation plus unchanged freehand seed behavior.

### Publish

- Create `site/features/admin/svg-editor/parametric/parametricPublishRegistry.server.ts` — server-only allowlisted drawer/descriptor adapters.
- Create `site/features/admin/svg-editor/parametric/compileParametricProductSvg.ts` — generic parse → Maker render → `sanitiseSvg` compile seam.
- Create `site/features/admin/svg-editor/parametric/deskAssemblyPublishDescriptor.ts` — descriptor builder with stable republish identity.
- Create `site/features/admin/svg-editor/parametric/linearDeskCompatibility.ts` — legacy linear input → assembly mapping.
- Create `site/features/admin/svg-editor/parametric/parametricFactoryE2eRoot.server.ts` — gated non-canonical browser publish/read roots.
- Create `site/features/admin/svg-editor/parametric/publishParametricProductAction.ts` — generic server action.
- Modify `site/features/admin/svg-editor/parametric/publishLinearDeskAction.ts` — compatibility wrapper while callers migrate.

### Shared rail and styling

- Create `site/features/planner/editor/canvasToolRailTypes.ts` — neutral discriminated command/toggle/part contract.
- Modify `site/features/planner/editor/CanvasToolRail.tsx` — backward-compatible Planner and parametric prop variants.
- Modify `site/app/css/core/locked/chrome/canvas-tool-rail.module.css` — explicit `data-mode="parametric"` wide three-column rail seam.
- Create `site/app/css/core/locked/chrome/parametric-product-editor.css` — Dockview shell, panels, separators, and supported-width layout.
- Create `site/app/css/core/locked/admin/parametric-product-editor.css` — Admin top/status/properties/publish states.
- Create `site/app/css/core/locked/svg/parametric-product-preview.css` — canvas grid, SVG part states, dimensions.
- Modify locked `index.css` files under `chrome/`, `admin/`, and `svg/` — import the new files.
- Modify `site/app/css/core/locked/chrome/studio-chrome.css` — remove obsolete `.admin-cad*` and desk-form rules after migration.

### Tests

- Create `site/tests/unit/features/planner/asset-engine/svg/parametric/productDrawerRegistry.test.ts`.
- Create `site/tests/unit/features/planner/asset-engine/svg/parametric/linearDeskDrawer.test.ts`.
- Create `site/tests/unit/features/admin/svg-editor/parametric/parametricAuthoringRegistry.test.ts`.
- Create `site/tests/unit/features/admin/svg-editor/parametric/useParametricProductEditor.test.tsx`.
- Create `site/tests/unit/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.test.tsx`.
- Create `site/tests/unit/features/admin/svg-editor/parametric/ParametricPropertiesPanel.test.tsx`.
- Create `site/tests/unit/features/admin/svg-editor/parametric/ParametricPublishConfirmDialog.test.tsx`.
- Create `site/tests/unit/features/admin/svg-editor/parametric/ParametricPlanCanvas.test.tsx`.
- Create `site/tests/unit/features/admin/svg-editor/parametric/publishParametricProductAction.test.ts`.
- Create `site/tests/unit/features/admin/svg-editor/parametric/noFabricDependency.test.ts`.
- Modify `site/tests/unit/features/planner/editor/CanvasToolRail.test.tsx`.
- Modify `site/tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx`.
- Create `site/tests/e2e/admin-parametric-product-factory.spec.ts`.
- Create `site/tests/e2e/helpers/parametricFactoryJourney.ts` — returns exact slug, SKU, descriptor, SVG bytes/checksum, and preview URL.
- Create `site/scripts/run-parametric-factory-e2e.mjs` — isolated root + localhost server + Playwright launcher + cleanup.
- Modify `site/app/api/planner/catalog/svg-blocks/route.ts` — gated E2E root read/preview mapping; production behavior unchanged.
- Modify `site/tests/e2e/planner-c4-guest-place-boq.spec.ts` — consume dynamic C3 artifact, not a fixed slug.
- Modify `.gitignore` — ignore only `.e2e-runtime/` and `site/public/.e2e-svg-catalog/` runtime roots.

---

### Task 0: Baseline and Catalog Isolation

**Files:**
- Modify: `site/features/admin/svg-editor/storage/catalogWriteIsolation.ts`
- Create: `site/features/admin/svg-editor/parametric/parametricFactoryE2eRoot.server.ts`
- Modify: `.gitignore`
- Read: `site/tests/helpers/adminCatalogIsolation.ts`
- Test: existing parametric and isolation suites

- [ ] **Step 1: Record the dirty tree without changing it**

Run:

```powershell
git status --short
```

Expected: existing owner changes are identified and preserved.

- [ ] **Step 2: Run the catalog isolation baseline**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/storage/catalogWriteIsolation.test.ts tests/unit/features/admin/svg-editor/publish/adminCatalogIsolation.a0.test.ts
```

Expected: PASS; no write under `site/inventory/descriptors/` or `site/public/svg-catalog/`.

- [ ] **Step 3: Define and test the browser isolation root**

`parametricFactoryE2eRoot.server.ts` activates only when `PARAMETRIC_FACTORY_E2E_RUN_ID` is present and production mode is false. The launcher sets `PARAMETRIC_FACTORY_E2E_ROOT=E:\12072026\.e2e-runtime\parametric-factory\<run-id>`. The helper resolves descriptors and lifecycle under that root, plus SVG bytes under `E:\12072026\site\public\.e2e-svg-catalog\<run-id>\`; Next serves those bytes at `/.e2e-svg-catalog/<run-id>/<slug>.svg`. Require run ids matching `^[a-z0-9-]{8,64}$`; require resolved paths to remain under those two parents; reject traversal, symlink/reparse escape, canonical `inventory/descriptors`, and canonical `public/svg-catalog`. Production calls return no override.

Add tests proving canonical roots are rejected, traversal is rejected, production ignores the env, and cleanup cannot escape the run directory.

- [ ] **Step 4: Run the existing parametric baseline**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric tests/unit/features/admin/svg-editor/parametric
```

Expected: record current PASS/FAIL exactly. Do not mark old failures as caused by this plan.

- [ ] **Step 5: Record a verified checkpoint**

Keep the baseline commands and exits for the final report. Run the two-peer team gate before any slice is proposed complete.

---

### Task 1: Pure Drawer Contract and Registry

**Files:**
- Create: `site/features/planner/asset-engine/svg/parametric/productDrawer.ts`
- Create: `site/features/planner/asset-engine/svg/parametric/productDrawerRegistry.ts`
- Create: `site/features/planner/asset-engine/svg/parametric/parametricProductManifest.ts`
- Test: `site/tests/unit/features/planner/asset-engine/svg/parametric/productDrawerRegistry.test.ts`

- [ ] **Step 1: Write the failing registry test**

```ts
import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  defineParametricProductDrawer,
  eraseParametricProductDrawer,
} from "@/features/planner/asset-engine/svg/parametric/productDrawer";
import { createParametricProductRegistry } from "@/features/planner/asset-engine/svg/parametric/productDrawerRegistry";

const TestBedSchema = z.object({
  type: z.literal("test-bed"),
  widthMm: z.number().min(800),
  depthMm: z.number().min(1600),
  storage: z.boolean(),
});

const testBedDrawer = defineParametricProductDrawer({
  type: "test-bed",
  label: "Test bed",
  schema: TestBedSchema,
  defaults: () => ({ type: "test-bed", widthMm: 1600, depthMm: 2000, storage: false }),
  capabilities: {
    selectableParts: true,
    measurable: true,
    supportsGrid: true,
    supportsSnap: false,
  },
  render: (fields) => renderMakerTestRectangle({
    widthMm: fields.widthMm,
    depthMm: fields.depthMm,
    partId: "frame",
  }),
});

describe("createParametricProductRegistry", () => {
  it("resolves only registered types and validates before rendering", () => {
    const registry = createParametricProductRegistry([
      eraseParametricProductDrawer(testBedDrawer),
    ]);

    expect(registry.get("test-bed")?.render({
      type: "test-bed",
      widthMm: 1800,
      depthMm: 2100,
      storage: true,
    }).parts).toMatchObject([{
      id: "frame",
      role: "frame",
      paths: [{
        id: "frame",
        d: expect.any(String),
        fill: expect.any(String),
        stroke: expect.any(String),
        strokeWidth: expect.any(Number),
      }],
    }]);
    expect(registry.get("unknown")).toBeUndefined();
    expect(() => registry.require("unknown")).toThrow("Unknown parametric product type");
  });
});
```

`renderMakerTestRectangle` is a test fixture that builds a Maker.js rectangle model and exports both full SVG and structured path records. It must not handwrite SVG path data.

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric/productDrawerRegistry.test.ts
```

Expected: FAIL because the contract and registry files do not exist.

- [ ] **Step 3: Implement the typed drawer and runtime erasure**

```ts
import type { z } from "zod";

export type ParametricProductCapabilities = {
  selectableParts: boolean;
  measurable: boolean;
  supportsGrid: boolean;
  supportsSnap: boolean;
};

export type ParametricPreview = {
  svg: string;
  viewBox: { x: number; y: number; width: number; height: number };
  widthMm: number;
  depthMm: number;
  parts: readonly {
    id: string;
    role: string;
    paths: readonly {
      id: string;
      d: string;
      fill: string | "none";
      stroke: string;
      strokeWidth: number;
    }[];
  }[];
};

export type ParametricProductDrawer<TFields> = {
  type: string;
  label: string;
  schema: z.ZodType<TFields>;
  defaults: () => TFields;
  capabilities: ParametricProductCapabilities;
  render: (fields: TFields) => ParametricPreview;
};

export type ParametricProductDrawerRuntime = {
  type: string;
  label: string;
  capabilities: ParametricProductCapabilities;
  defaults: () => unknown;
  parse: (raw: unknown) => unknown;
  render: (raw: unknown) => ParametricPreview;
};

export function defineParametricProductDrawer<TFields>(
  drawer: ParametricProductDrawer<TFields>,
): ParametricProductDrawer<TFields> {
  return drawer;
}

export function eraseParametricProductDrawer<TFields>(
  drawer: ParametricProductDrawer<TFields>,
): ParametricProductDrawerRuntime {
  return {
    type: drawer.type,
    label: drawer.label,
    capabilities: drawer.capabilities,
    defaults: drawer.defaults,
    parse: (raw) => drawer.schema.parse(raw),
    render: (raw) => drawer.render(drawer.schema.parse(raw)),
  };
}
```

Implement `createParametricProductRegistry` with duplicate-type rejection, `get`, `require`, and `list`.

- [ ] **Step 4: Add the client-safe production manifest and parity assertion**

Export production type ids only. Add a pure helper that compares manifest ids to a runtime registry and fails missing, duplicate, or extra production entries. Client authoring and server publish tests both call this helper.

- [ ] **Step 5: Run the registry test**

Run the Step 2 command.

Expected: PASS.

- [ ] **Step 6: Run typecheck for the new public contract**

Run:

```powershell
pnpm run typecheck
```

Expected: PASS with no handwritten `any`.

---

### Task 2: Adapt the Existing Linear Desk Drawer

**Files:**
- Create: `site/features/planner/asset-engine/svg/parametric/linearDeskDrawer.ts`
- Modify: `site/features/planner/asset-engine/svg/parametric/index.ts`
- Test: `site/tests/unit/features/planner/asset-engine/svg/parametric/linearDeskDrawer.test.ts`

- [ ] **Step 1: Write the failing adapter test**

```ts
import { describe, expect, it } from "vitest";
import { linearDeskDrawer } from "@/features/planner/asset-engine/svg/parametric/linearDeskDrawer";

describe("linearDeskDrawer", () => {
  it("returns stable Maker parts and publish SVG from canonical fields", () => {
    const fields = linearDeskDrawer.defaults();
    const preview = linearDeskDrawer.render(fields);

    expect(preview.widthMm).toBe(fields.widthMm);
    expect(preview.depthMm).toBe(fields.depthMm);
    expect(preview.parts.map((part) => part.id)).toContain("desk-top");
    expect(preview.svg).toContain('data-product-type="linear-desk"');
    expect(preview.svg).not.toContain("currentColor");
    expect(preview.svg).not.toContain("var(");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric/linearDeskDrawer.test.ts
```

Expected: FAIL because `linearDeskDrawer.ts` does not exist.

- [ ] **Step 3: Implement the linear desk adapter without changing the Maker pen**

```ts
import { defineParametricProductDrawer } from "./productDrawer";
import { drawLinearDesk, linearDeskPartsToSvg } from "./drawLinearDesk";
import { LinearDeskFieldsSchema } from "./linearDeskFields";

export const linearDeskDrawer = defineParametricProductDrawer({
  type: "linear-desk",
  label: "Linear desk",
  schema: LinearDeskFieldsSchema,
  defaults: () => LinearDeskFieldsSchema.parse({
    type: "linear-desk",
    widthMm: 1600,
    depthMm: 800,
    heightMm: 750,
    topThicknessMm: 120,
    pedestalWidthMm: 200,
    pedestalInsetMm: 120,
    pedestalTopGapMm: 40,
    pedestalBackInsetMm: 80,
    pedestalCount: 2,
    modesty: false,
  }),
  capabilities: {
    selectableParts: true,
    measurable: true,
    supportsGrid: true,
    supportsSnap: false,
  },
  render: (fields) => {
    const draw = drawLinearDesk(fields);
    return {
      svg: linearDeskPartsToSvg(draw),
      viewBox: draw.viewBox,
      widthMm: fields.widthMm,
      depthMm: fields.depthMm,
      parts: draw.parts.map((part) => ({
        id: part.id,
        role: part.role,
        paths: [{
          id: part.id,
          d: part.dPath,
          fill: part.fill,
          stroke: part.stroke,
          strokeWidth: part.strokeWidth,
        }],
      })),
    };
  },
});
```

- [ ] **Step 4: Run old and new Maker tests**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric
```

Expected: PASS; existing `drawLinearDesk` behavior remains unchanged.

---

### Task 2B: Production Configurable Desk Assembly Drawer

**Files:**
- Create: `site/features/planner/asset-engine/svg/parametric/deskAssemblyFields.ts`
- Create: `site/features/planner/asset-engine/svg/parametric/drawDeskAssembly.ts`
- Create: `site/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer.ts`
- Modify: `site/features/planner/asset-engine/svg/makerJsRecipes.ts`
- Modify: `site/features/planner/asset-engine/svg/parametric/index.ts`
- Test: `site/tests/unit/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer.test.ts`

- [ ] **Step 1: Write failing schema and Maker geometry tests**

Cover `layout: "linear" | "u"`, workstation count, aisle clearance, overall/run dimensions, desk depth/height, power rail, cable management, modesty, and partitions. Assert invalid U-layout aisle or workstation distributions fail schema validation.

```ts
const preview = deskAssemblyDrawer.render({
  ...deskAssemblyDrawer.defaults(),
  layout: "u",
  workstationCount: 12,
  aisleMm: 1200,
});

expect(preview.parts.filter((part) => part.role === "workstation")).toHaveLength(12);
expect(preview.parts.map((part) => part.id)).toContain("aisle-clearance");
expect(preview.svg).toContain('data-product-type="desk-assembly"');
expect(preview.parts.every((part) => part.paths.every((path) => path.d.length > 0))).toBe(true);
```

- [ ] **Step 2: Run the focused test and verify it fails**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer.test.ts
```

- [ ] **Step 3: Build assembly geometry through Maker.js only**

Add a `desk-assembly` Maker recipe. Generate stable multipath submodels for each workstation, shared runs, returns, aisle-clearance guide, and enabled options. Linear and U topology are drawer logic, not shell conditionals. Produce full `svg`, a viewBox, and structured part/path records from the same Maker model.

- [ ] **Step 4: Preserve the current linear desk as a compatibility input**

Map existing linear desk defaults into a one-run assembly configuration. Keep old slug/SKU compatibility where required, but register `desk-assembly` as the production factory type in the manifest.

- [ ] **Step 5: Run Maker and assembly suites**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric tests/unit/features/planner/asset-engine/svg/makerJsRecipes.test.ts tests/unit/features/planner/asset-engine/svg/makerJsToPath.test.ts
```

Expected: PASS; all production geometry is Maker-backed multipath output.

---

### Task 3: Admin Authoring Contracts and Registry

**Files:**
- Create: `site/features/planner/editor/canvasToolRailTypes.ts`
- Create: `site/features/admin/svg-editor/parametric/authoringTypes.ts`
- Create: `site/features/admin/svg-editor/parametric/deskAssemblyAuthoringDefinition.ts`
- Create: `site/features/admin/svg-editor/parametric/parametricAuthoringRegistry.ts`
- Modify: `site/features/admin/svg-editor/parametric/linearDeskFormModel.ts`
- Test: `site/tests/unit/features/admin/svg-editor/parametric/parametricAuthoringRegistry.test.ts`

- [ ] **Step 1: Write a failing generic-registry test with a test-only bed definition**

The test must register the production desk assembly definition plus a local Maker-backed `test-bed` definition, then assert both expose different sections and tool sets while the registry API is identical.

```ts
expect(registry.require("desk-assembly").sections.map((section) => section.id)).toContain("layout");
expect(registry.require("test-bed").sections.map((section) => section.id)).toContain("mattress");
expect(registry.require("test-bed").tools.map((tool) => tool.id)).toContain("headboard");
expect(() => registry.require("sofa")).toThrow("Unknown parametric authoring type");
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/parametricAuthoringRegistry.test.ts
```

Expected: FAIL because the generic Admin contracts do not exist.

- [ ] **Step 3: Implement explicit field, section, tool, identity, and parse contracts**

```ts
export type ParametricFieldDefinition = {
  key: string;
  label: string;
  kind: "number" | "text" | "boolean" | "select";
  unit?: "length";
  options?: readonly { value: string; label: string }[];
  span?: "single" | "full";
};

export type ParametricFormSection = {
  id: string;
  label: string;
  fields: readonly ParametricFieldDefinition[];
};

export type ParametricParseResult<TFields> =
  | { ok: true; fields: TFields }
  | { ok: false; errors: readonly { path: string; message: string }[] };
```

Define a neutral `CanvasToolRailItem` in `canvasToolRailTypes.ts` as a discriminated union of command, toggle, and part-focus items. Include `disabledReason?: string`; do not use a static `enabled` flag. Both Planner and Admin may import this neutral contract. Planner code must never import Admin authoring types.

Define `ParametricAuthoringDefinition<TDisplay, TFields>` with `drawer`, `defaultDisplay`, `parseDisplay`, `convertUnit`, `sections`, `tools: readonly CanvasToolRailItem[]`, and identity accessors.

- [ ] **Step 4: Move assembly-only metadata out of the shell**

Define exact assembly sections: `identity`, `layout`, `dimensions`, `workstations`, `aisle`, and `options`. Define tools as discriminated commands/toggles/part-focus items. Keep legacy linear desk form conversion inside the compatibility adapter only.

Assert the authoring registry exactly matches `PARAMETRIC_PRODUCT_MANIFEST`. Task 8 performs the server-registry parity assertion after that registry exists.

- [ ] **Step 5: Run authoring and existing form-model tests**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/parametricAuthoringRegistry.test.ts tests/unit/features/admin/svg-editor/parametric/linearDeskFormModel.test.ts
```

Expected: PASS. The test-only bed proves the registry is not desk-bound; it is not published inventory.

---

### Task 4: Generic Editor State

**Files:**
- Create: `site/features/admin/svg-editor/parametric/useParametricProductEditor.ts`
- Test: `site/tests/unit/features/admin/svg-editor/parametric/useParametricProductEditor.test.tsx`

- [ ] **Step 1: Write failing state tests**

Cover:

```ts
expect(result.current.type).toBe("desk-assembly");
expect(result.current.parse.ok).toBe(true);
expect(result.current.preview?.parts.map((part) => part.id)).toContain("desk-top");

act(() => result.current.selectType("test-bed"));
expect(result.current.type).toBe("test-bed");
expect(result.current.sections.map((section) => section.id)).toContain("mattress");
expect(result.current.selectedPartId).toBeNull();
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/useParametricProductEditor.test.tsx
```

Expected: FAIL because the generic hook does not exist.

- [ ] **Step 3: Implement generic state without product field names**

The hook owns `type`, `display`, `unit`, parse result, preview, selected tool, selected part, publish state, and messages. Product-specific updates go through definition adapters:

```ts
const definition = registry.require(type);
const parse = definition.parseDisplay(display);
const preview = parse.ok ? definition.drawer.render(parse.fields) : null;
```

Do not place `width`, `pedestal`, `mattress`, or another product field in the hook.

- [ ] **Step 4: Expose generic commands without rendering UI**

Expose typed commands for type selection, field updates, unit conversion, tool selection, part focus, viewport commands, and publish state. Do not create or import UI components in this task.

- [ ] **Step 5: Run the hook tests**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/useParametricProductEditor.test.tsx
```

Expected: PASS without importing any not-yet-created shell component.

---

### Task 5: Backward-Compatible Product-Aware CanvasToolRail

**Files:**
- Modify: `site/features/planner/editor/canvasToolRailTypes.ts`
- Modify: `site/features/planner/editor/CanvasToolRail.tsx`
- Modify: `site/app/css/core/locked/chrome/canvas-tool-rail.module.css`
- Create: `site/features/admin/svg-editor/parametric/ParametricToolRailAdapter.tsx`
- Modify: `site/tests/unit/features/planner/editor/CanvasToolRail.test.tsx`

- [ ] **Step 1: Add failing Planner-regression and parametric-mode tests**

```tsx
render(<CanvasToolRail activeTool="wall" onToolChange={onPlannerToolChange} />);
expect(screen.getByTestId("canvas-tool-wall")).toBeInTheDocument();

render(
  <CanvasToolRail
    mode="parametric"
    activeToolId="select"
    tools={[
      { kind: "command", id: "select", label: "Select", icon: "select", command: "select" },
      { kind: "part", id: "headboard", label: "Headboard", icon: "part", partRole: "headboard" },
    ]}
    onParametricToolChange={onParametricToolChange}
    layout="wide"
  />,
);
expect(screen.getByRole("button", { name: "Headboard" })).toBeInTheDocument();
expect(screen.getByTestId("canvas-tool-rail")).toHaveAttribute("data-mode", "parametric");
```

- [ ] **Step 2: Run the rail tests and verify parametric mode fails**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/editor/CanvasToolRail.test.tsx tests/unit/features/planner/canvasToolRail.a11y.test.tsx
```

Expected: existing Planner tests PASS; new parametric test FAILS.

- [ ] **Step 3: Implement discriminated rail props**

Keep the current Planner props as the default branch. Add a `mode: "parametric"` branch that accepts explicit tools and callbacks. Do not change Planner tool arrays, shortcuts, local storage keys, docking, or orientation behavior.

Parametric mode sets `data-mode="parametric"`, disables the rail's floating-position persistence, and renders the locked `32.jpg` seam: three tool columns, 56px control tiles, product labels, and panel-contained scrolling. All presentation stays in `canvas-tool-rail.module.css`; the generic editor does not recreate the rail.

```ts
export type CanvasToolRailProps =
  | ({ mode?: "planner" } & PlannerCanvasToolRailProps)
  | ({
      mode: "parametric";
      activeToolId: string;
      tools: readonly CanvasToolRailItem[];
      onParametricToolChange: (toolId: string) => void;
      layout: "wide" | "compact";
    });
```

- [ ] **Step 4: Use the adapter in Admin**

`ParametricToolRailAdapter` receives the selected definition and maps tool selection to generic editor commands. Product part tools set `selectedPartId`; select/pan/fit/grid/measure invoke canvas commands.

- [ ] **Step 5: Run rail and accessibility tests**

Run the Step 2 command.

Expected: PASS in Planner and parametric modes.

---

### Task 6: Interactive SVG Plan Canvas

**Files:**
- Create: `site/features/admin/svg-editor/parametric/ParametricPlanCanvas.tsx`
- Test: `site/tests/unit/features/admin/svg-editor/parametric/ParametricPlanCanvas.test.tsx`

- [ ] **Step 1: Write failing viewport and selection tests**

Cover fit, zoom in/out, pan, grid toggle, selected part, invalid preview, and drawer capability gates.

```tsx
expect(screen.getByTestId("parametric-plan-svg")).toHaveAttribute("viewBox", "0 0 1600 800");
await user.click(screen.getByRole("button", { name: "Zoom in" }));
expect(screen.getByTestId("parametric-zoom-status")).toHaveTextContent("110%");
await user.click(screen.getByTestId("parametric-part-desk-top"));
expect(onPartSelect).toHaveBeenCalledWith("desk-top");
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/ParametricPlanCanvas.test.tsx
```

Expected: FAIL because the canvas component does not exist.

- [ ] **Step 3: Implement zoom and pan through SVG viewBox values**

Use SVG attributes, not inline CSS transforms:

```tsx
<svg
  data-testid="parametric-plan-svg"
  viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
  aria-label={`${definition.label} plan preview`}
>
  {preview.parts.flatMap((part) =>
    part.paths.map((path) => (
      <path
        key={path.id}
        id={path.id}
        d={path.d}
        fill={path.fill}
        stroke={path.stroke}
        strokeWidth={path.strokeWidth}
        data-part-id={part.id}
        data-part-role={part.role}
        onClick={() => onPartSelect(part.id)}
      />
    )),
  )}
</svg>
```

Wheel/pointer actions update the numeric viewBox state. Fit restores the drawer viewBox. Part selection uses structured Maker part/path records. Never inject a full SVG string, parse nested SVG at render time, or mutate path data.

- [ ] **Step 4: Add accessible non-pointer controls**

Add React Aria `Button` and `ToggleButton` controls for zoom in, zoom out, fit, and grid. Measurements are readable text and SVG dimension overlays when `capabilities.measurable` is true.

- [ ] **Step 5: Run canvas tests**

Run the Step 2 command.

Expected: PASS.

---

### Task 7: Dockview Shell, React Aria Controls, and Locked Styling

**Files:**
- Modify: `site/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.tsx`
- Create: `site/features/admin/svg-editor/views/edit-shell/adminSvgDockPresets.ts`
- Modify: `site/app/admin/svg-editor/parametric/page.tsx`
- Create: `site/features/admin/svg-editor/parametric/ParametricEditorTopBar.tsx`
- Create: `site/features/admin/svg-editor/parametric/ParametricStatusBar.tsx`
- Create: `site/features/admin/svg-editor/parametric/ParametricPropertiesPanel.tsx`
- Create: `site/features/admin/svg-editor/parametric/ParametricPublishConfirmDialog.tsx`
- Modify: `site/features/admin/svg-editor/parametric/LinearDeskPublishConfirmDialog.tsx`
- Create: `site/features/admin/svg-editor/parametric/ParametricProductEditor.tsx`
- Modify: `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx`
- Create: locked CSS files listed in File Structure
- Modify: locked CSS index files
- Modify: `site/app/css/core/locked/chrome/studio-chrome.css`
- Test: `site/tests/unit/features/admin/svg-editor/parametric/ParametricPropertiesPanel.test.tsx`
- Test: `site/tests/unit/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.test.tsx`
- Test: `site/tests/unit/features/admin/svg-editor/parametric/ParametricPublishConfirmDialog.test.tsx`
- Test: `site/tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx`

- [ ] **Step 1: Write failing Dockview and generic properties tests**

Render the factory preset and assert Dockview owns `tools`, `properties`, and required `canvas` panels in that order. Test versioned restore fallback and unchanged freehand mode. Render desk-assembly and test-bed definitions. Assert labels come from definitions and the shell never contains a hard-coded `Desk properties` label.

Keyboard assertions: `Tab` reaches each Dockview tab/header and its first panel control; `Enter`/`Space` activates a focused tab; `ArrowLeft`/`ArrowRight` changes the active tab when panels are user-stacked; preset restore returns focus to the active panel; canvas cannot close by keyboard. Freehand keyboard behavior remains unchanged.

```tsx
expect(screen.getByRole("heading", { name: "Desk assembly properties" })).toBeInTheDocument();
rerender(<ParametricPropertiesPanel definition={testBedDefinition} {...bedProps} />);
expect(screen.getByRole("heading", { name: "Test bed properties" })).toBeInTheDocument();
expect(screen.getByLabelText("Mattress width (cm)")).toBeInTheDocument();
expect(screen.getByTestId("admin-svg-dock-host")).toHaveAttribute("data-layout-mode", "factory");
expect(screen.getByTestId("admin-svg-dock-panel-canvas")).toHaveAttribute("data-required", "true");
```

- [ ] **Step 2: Extend the existing Admin Dockview host**

Add a discriminated `layoutMode: "freehand" | "factory"` contract to the existing `AdminSvgDockHost`. Preserve freehand preview/stage/details ids, titles, behavior, and tests; do not invent freehand persistence. Factory mode registers stable ids `tools`, `properties`, and `canvas`; makes canvas non-closable; bounds tools/properties with locked semantic minimums; uses its own versioned storage key; and falls back to the factory preset on invalid restore. Do not create another Admin host or import Planner document state.

```tsx
<AdminSvgDockHost
  layoutMode="factory"
  factorySlots={{
    tools: <ParametricToolRailAdapter />,
    properties: <ParametricPropertiesPanel />,
    canvas: <ParametricPlanCanvas />,
  }}
/>
```

- [ ] **Step 3: Implement the generic field renderer with React Aria**

Map `number`, `text`, `boolean`, and `select` definitions to React Aria Components. Use `NumberField`, `TextField`, `Checkbox`, `Select`, `ListBox`, `ListBoxItem`, `Popover`, `Label`, `Input`, and `Group`. Use one generic `onFieldChange(key, value)` seam. Unit labels come from field metadata plus current display unit.

- [ ] **Step 4: Compose the `32.jpg` shell**

Use static Tailwind v4 utilities for outer composition. Dockview owns panel order, resizing, and stacking:

```tsx
<main className="parametric-editor flex min-h-0 flex-1 flex-col overflow-hidden">
  <ParametricEditorTopBar status={<ParametricStatusBar />} />
  <AdminSvgDockHost layoutMode="factory" factorySlots={panels} />
</main>
```

Forbidden examples: a parallel CSS-grid panel layout, `grid-cols-[260px_288px_1fr]`, `bg-slate-50`, `style={{ width: 260 }}`, raw hex/RGB.

After the composed component test passes, update `page.tsx` to render `ParametricProductEditor initialType="desk-assembly"`. This is the route cutover; it occurs only after Tasks 5–7 exist.

- [ ] **Step 5: Use React Aria for shell commands and publish confirmation**

Use React Aria `Button`, `ToggleButton`/`ToggleButtonGroup`, and `Select` in the top bar and tool commands. Replace the custom publish confirmation with `ModalOverlay`, `Modal`, and `Dialog`. Verify focus enters the dialog, Escape closes it, cancel restores focus, and Publish is reachable by keyboard. Do not add native button/select/input controls or div-based interactive widgets in new shell code.

- [ ] **Step 6: Add locked semantic sizing tokens**

Declare Dockview panel minimums, header height, canvas grid size, and control targets as semantic custom properties inside the matching locked CSS file. Tokenize the `32.jpg` targets: 3.5rem tool cells, approximately 16.25rem properties width, 2.75rem minimum interactive targets, and a dominant remaining canvas. Do not modify `theme.css`.

- [ ] **Step 7: Create locked CSS ownership**

Theme Dockview without taking over its layout:

```css
/* locked/chrome/parametric-product-editor.css */
.parametric-editor__dock-host {
  min-width: 0;
  min-height: 0;
}
```

Locked chrome CSS owns the Dockview theme bridge, panel surfaces, separators, and focus states. The existing `canvas-tool-rail.module.css` is the sole rail presentation authority. Editor CSS must not style rail internals or set `grid-template-columns` for the workspace. Use Admin locked CSS for publish/status and SVG locked CSS for grid/part paint. Import each from the matching index. Remove migrated `.admin-cad*` declarations from `studio-chrome.css` after no component references them.

- [ ] **Step 8: Implement supported-width factory behavior**

Supported desktop/tablet preset: wide tools | properties | dominant canvas. Below the existing 60rem Admin authoring threshold, retain the current unsupported-authoring notice. Do not create phone authoring, a phone Dockview preset, or a second CSS-only shell.

- [ ] **Step 9: Run Dockview, component, accessibility, and hardcoding tests**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.test.tsx tests/unit/features/admin/svg-editor/parametric/ParametricPropertiesPanel.test.tsx tests/unit/features/admin/svg-editor/parametric/ParametricPublishConfirmDialog.test.tsx tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx tests/unit/features/admin/svg-editor/parametric/noFabricDependency.test.ts
node site/scripts/audit-hardcoded-detail.mjs
node site/scripts/audit-tsx-hardcoded.mjs
```

Expected: PASS; zero new arbitrary Tailwind, palette utility, inline presentation style, raw CSS color, or duplicate CSS-tree findings.

- [ ] **Step 10: Enforce the Admin canvas dependency boundary**

`noFabricDependency.test.ts` scans handwritten imports under `site/features/admin/svg-editor/parametric/` and fails on `fabric` or Planner Fabric-canvas modules. It also asserts the factory uses `AdminSvgDockHost`, not a second Dockview host implementation.

---

### Task 8: Generic Server Publish Action

**Files:**
- Create: `site/features/admin/svg-editor/parametric/parametricPublishRegistry.server.ts`
- Create: `site/features/admin/svg-editor/parametric/compileParametricProductSvg.ts`
- Create: `site/features/admin/svg-editor/parametric/deskAssemblyPublishDescriptor.ts`
- Create: `site/features/admin/svg-editor/parametric/linearDeskCompatibility.ts`
- Use: `site/features/admin/svg-editor/parametric/parametricFactoryE2eRoot.server.ts`
- Create: `site/features/admin/svg-editor/parametric/publishParametricProductAction.ts`
- Modify: `site/features/admin/svg-editor/parametric/publishLinearDeskAction.ts`
- Test: `site/tests/unit/features/admin/svg-editor/parametric/publishParametricProductAction.test.ts`
- Test: existing isolated publish tests

- [ ] **Step 1: Write failing unknown-type, parity, assembly, and republish tests**

```ts
await expect(publishParametricProductAction({ type: "unknown" })).resolves.toMatchObject({
  success: false,
  error: "Unknown parametric product type",
});

await expect(publishParametricProductAction(validDeskAssemblyRaw)).resolves.toMatchObject({
  success: true,
  descriptor: { slug: "oando-desk-assembly-12", sku: "OANDO-DSK-ASM-12" },
});
```

Use temporary inventory roots and the existing catalog isolation helpers. Spy on `publishDescriptorWithPipeline` and assert its `compileSvg` result equals the exact sanitized SVG from the registered drawer. Publish the same slug twice and assert stable `id` and `generatedAt`. Assert the server registry exactly matches `PARAMETRIC_PRODUCT_MANIFEST`.

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/publishParametricProductAction.test.ts
```

Expected: FAIL because the generic server registry/action do not exist.

- [ ] **Step 3: Implement the allowlisted server registry**

Register an exact adapter per production type:

```ts
export const PARAMETRIC_PUBLISH_REGISTRY = createParametricPublishRegistry([
  {
    type: "desk-assembly",
    drawer: eraseParametricProductDrawer(deskAssemblyDrawer),
    buildDescriptor: buildDeskAssemblyPublishDescriptorFromUnknown,
    lifecycle: "live",
  },
]);
```

The server registry must not trust a client-provided module path, renderer, lifecycle, or descriptor builder. Its construction fails unless its ids exactly match the client-safe manifest.

- [ ] **Step 4: Implement the generic compile and descriptor seams**

`compileParametricProductSvg` resolves the allowlisted drawer, validates fields, renders Maker geometry, runs the existing `sanitiseSvg` authority, rejects non-SVG/image-unsafe paint, and returns canonical fields plus the exact sanitized full SVG. `deskAssemblyPublishDescriptor.ts` owns default identity and stable same-slug `id`/`generatedAt`. `linearDeskCompatibility.ts` owns the legacy input mapping used by the wrapper.

- [ ] **Step 5: Implement the generic action**

Flow: Admin auth → require registry type → parse → Maker render → existing sanitize/compile seam → descriptor with stable same-slug `id`/`generatedAt` → resolve production or gated E2E runtime roots → exact sanitized SVG through `publishDescriptorWithPipeline` → lifecycle on success → revalidate. The E2E runtime injects `runPipeline`, `persist`, existing-identity load, and lifecycle directories from one validated run root; production uses existing defaults. Return specific errors without exposing secrets.

- [ ] **Step 6: Convert the old action to a wrapper**

```ts
export async function publishLinearDeskAction(raw: PublishLinearDeskInput) {
  return publishParametricProductAction(mapLegacyLinearDeskToAssembly(raw));
}
```

- [ ] **Step 7: Run generic and legacy publish tests**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/publishParametricProductAction.test.ts tests/unit/features/admin/svg-editor/parametric/publishLinearDeskAction.test.ts tests/unit/features/admin/svg-editor/parametric/publishLinearDeskIsolatedPath.test.ts
```

Expected: PASS with no canonical catalog changes.

---

### Task 9: C3 Admin Browser Acceptance

**Files:**
- Create: `site/tests/e2e/admin-parametric-product-factory.spec.ts`
- Create: `site/tests/e2e/helpers/parametricFactoryJourney.ts`
- Create: `site/scripts/run-parametric-factory-e2e.mjs`
- Modify: `site/app/api/planner/catalog/svg-blocks/route.ts`

- [ ] **Step 1: Write the browser journey**

At `http://localhost:3000/admin/svg-editor/parametric` and an exact `1280×720` viewport:

1. Measure left-to-right tool rail | product properties | dominant plan canvas geometry.
2. Assert the rail has three columns with tokenized 56px controls, properties is approximately 260px, and canvas owns the remaining dominant width.
3. Select Desk assembly, choose U layout, set workstation count 12 and aisle 1200mm, then confirm Maker multipath parts update.
4. Exercise fit, zoom, grid, measure, and part selection by pointer and keyboard.
5. Prove React Aria behavior: NumberField/Select/Checkbox keys, `aria-invalid`, described field error, live status announcement, visible focus, and measured 44x44 minimum targets.
6. Prove the publish dialog has an accessible name, traps focus, closes on Escape, and restores focus to Publish.
7. Publish through isolated catalog paths and retain the emitted slug/SKU/artifact path for Task 10.
8. Confirm success identity and zero console/network errors.

The launcher creates a unique run id and the exact E-drive roots defined in Task 0, starts `http://localhost:3000` with those env values, invokes Playwright with `-c config/build/playwright.config.ts`, and cleans only those validated run directories. `parametricFactoryJourney` reads the emitted descriptor and SVG, verifies checksum/bytes, and returns `{ slug, sku, descriptor, svgPath, svgBytes, svgChecksum, previewUrl }`. The catalog route reads the same descriptor/lifecycle root and maps preview to Next's public `/.e2e-svg-catalog/<run-id>/<slug>.svg`. No canonical fixture is copied or mutated.

- [ ] **Step 2: Run desktop browser proof**

Run:

```powershell
node site/scripts/run-parametric-factory-e2e.mjs --spec tests/e2e/admin-parametric-product-factory.spec.ts --grep "desktop"
```

Expected: PASS at `1280×720`; no failed requests and no console errors.

- [ ] **Step 3: Verify the existing phone authoring block**

Run:

```powershell
node site/scripts/run-parametric-factory-e2e.mjs --spec tests/e2e/admin-parametric-product-factory.spec.ts --grep "phone authoring blocked"
```

Expected: PASS at 390px; the existing unsupported-authoring notice is shown and the factory editor is not mounted.

- [ ] **Step 4: Compare against `32.jpg`**

Run a final element-by-element visual pass at `1280×720` against `32.jpg` only. Do not open or mix `35.jpg` or `37.jpg`. Record PASS/FAIL for every row:

| Area | Elements to inspect |
|---|---|
| Top bar | Product title, breadcrumb, Inventory, product selector, Publish, embedded status, account controls, spacing, focus/hover/disabled states |
| Dockview | Tools/properties/canvas order, panel headers, separators, resize handles, active/focus treatment, required canvas, no duplicate status row |
| Tool rail | Three-column density, 56px tiles, Phosphor icons, labels, shortcuts, selected/hover/focus/disabled states, footer count/settings, panel-contained scroll |
| Properties | Product identity, type selector, section hierarchy, NumberField/TextField/Select/Checkbox/toggles, units, validation/error text, swatches/options, workstation/aisle values, preview thumbnail |
| Plan canvas | Header/title/scale, cool CAD surface, grid, Maker multipath paint, U-layout geometry, workstation count, aisle/dimensions, selection handles, zoom/coordinate status, dominant width |
| Publish dialog | Accessible title, summary, warning/error/success states, Cancel/Publish hierarchy, backdrop, focus ring, no clipping |
| Whole page | No overlap, clipping, unintended horizontal scroll, raw browser controls, palette drift, arbitrary styling, ecru cast, or invented toolbar |

Capture a fresh full-page screenshot and focused screenshots for top bar, tool rail, properties, canvas, and publish dialog. Screenshots are review evidence only, not PASS by themselves. Geometry assertions, console/network checks, keyboard proof, and the two-peer team gate must also pass. Do not copy the screenshot's desk geometry into non-desk drawers.

---

### Task 10: C4 Planner Consumer and BOQ Regression

**Files:**
- Test: `site/tests/e2e/planner-c4-guest-place-boq.spec.ts`
- Use: `site/tests/e2e/helpers/parametricFactoryJourney.ts`
- Test: `site/tests/unit/features/planner/catalog/c4GuestPlaceLoadRule.test.ts`

- [ ] **Step 1: Run authority-aware load rule unit**

Run:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/catalog/c4GuestPlaceLoadRule.test.ts
```

Expected: PASS for disk and revision API preview URLs.

- [ ] **Step 2: Consume the exact isolated C3 artifact**

Use the helper from Task 9 to publish the configured U assembly in the same test lifecycle, then open Planner with that emitted slug/SKU. Do not use a pre-existing fixed catalog slug or silently substitute a fixture.

- [ ] **Step 3: Run desktop place and BOQ proof**

Run:

```powershell
node site/scripts/run-parametric-factory-e2e.mjs --spec tests/e2e/planner-c4-guest-place-boq.spec.ts --grep "desktop 1280"
```

Expected: PASS; fetch the Planner catalog item's `previewUrl`, hash its response bytes, and require equality with C3's retained `svgChecksum` before placement. The published SVG paints, placed item stamps identity, and BOQ shows name/SKU.

- [ ] **Step 4: Run 390px place and BOQ proof**

Run:

```powershell
node site/scripts/run-parametric-factory-e2e.mjs --spec tests/e2e/planner-c4-guest-place-boq.spec.ts --grep "390"
```

Expected: PASS without forced clicks, increased timeouts, or Block2D being accepted as published SVG success. At both viewports, fetched SVG checksum and BOQ name/SKU equal the isolated C3 artifact.

---

### Task 11: Final Gates and Documentation Alignment

**Files:**
- Modify only if evidence changed: `plan/Admin/CHECKLIST.md`
- Modify only if paths changed: `plan/Admin/FEATURES.md`
- Modify only if task ordering changed: `plan/Admin/IMPLEMENTATION-PLAN.md`
- Modify only if stack policy changed: `plan/Admin/REALITY-AND-STACK.md`
- Keep docs count unchanged

- [ ] **Step 1: Run focused unit suites**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric tests/unit/features/admin/svg-editor/parametric tests/unit/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.test.tsx tests/unit/features/planner/editor/CanvasToolRail.test.tsx tests/unit/features/planner/canvasToolRail.a11y.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run UI hardcoding audits**

```powershell
node site/scripts/audit-hardcoded-detail.mjs
node site/scripts/audit-tsx-hardcoded.mjs
```

Expected: PASS with no new findings in touched files.

- [ ] **Step 3: Run lint and typecheck**

```powershell
pnpm run lint
pnpm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Run repository layout and plan purity gates**

```powershell
pnpm run check:layout
pnpm run check:plans-purity
```

Expected: PASS. Admin still has exactly four plan files; docs count remains within policy.

- [ ] **Step 5: Update plan truth only from fresh evidence**

Mark C3/C4 or generic-factory rows only with same-session command exits and browser facts. Do not claim PASS from this plan file, screenshots alone, old reports, or unit tests standing in for browser proof.

- [ ] **Step 6: Record final checkpoint**

Run the two-peer team gate and record both peers' PASS/N/A evidence. Three participants total, including the writer. This plan does not itself authorize or forbid a git action; follow the active owner and repository instructions.

---

## Completion Conditions

- The generic editor shell contains no desk-specific field names or product assumptions.
- The production desk assembly supports linear/U layout, workstation count, aisle, dimensions, and options through the generic contracts.
- A Maker-backed test-only bed definition proves a second type requires no shell changes.
- `CanvasToolRail` Planner behavior remains unchanged.
- Admin parametric mode provides a wide product-aware rail matching `32.jpg` hierarchy.
- The existing `AdminSvgDockHost` owns supported-width factory panels; no duplicate host or CSS-grid workspace exists.
- React Aria owns all new fields, selectors, commands, toggles, and publish confirmation behavior.
- Admin canvas supports fit, zoom, pan, grid, measure, and part selection without Fabric.
- Preview paths and the exact sanitized publish SVG come from the same allowlisted Maker drawer; stable republish identity is preserved.
- Tailwind v4 composition and locked semantic CSS are used from the first slice.
- No arbitrary Tailwind values, palette utilities, raw CSS colors, inline presentation styles, or new CSS tree.
- C3 Admin publish passes at supported desktop width; 390px shows the existing authoring block. C4 consumes that exact artifact and passes Planner place/BOQ at 1280 and 390px.
- Client/server registries match the product manifest, and the Admin parametric dependency boundary rejects Fabric imports.
- `pnpm run check:layout` and `pnpm run check:plans-purity` pass.
