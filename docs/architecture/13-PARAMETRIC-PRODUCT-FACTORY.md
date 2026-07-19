# Parametric Product Factory

**Status:** APPROVED DESIGN

**Owner lock:** Build a generic Admin parametric product factory. Do not hard-code the editor around desks or furniture; the selected drawer may represent a desk, bed, storage product, partition, or any future parametric product type.

**Visual lock:** `docs/ui-benchmarks/parametric-lock/32.jpg` only.

**Route:** `/admin/svg-editor/parametric`

**Required shell:**

```text
TOP BAR
TOOL RAIL | PRODUCT PROPERTIES | PLAN CANVAS
```

`32.jpg` defines density, hierarchy, panel order, and CAD craft. It does not define a desk-only product model. The middle panel title, fields, tools, measurements, and Maker output must come from the selected product drawer.

## Goal

Provide one shared-shell Admin editor where an operator selects a product type, enters exact dimensions and options, previews deterministic Maker.js geometry, and publishes a normalized product descriptor plus multipath SVG for Planner placement and BOQ identity.

The shell must accept new engineering drawers without adding another route or rewriting the shell.

## Non-Negotiables

- Maker.js remains the only parametric geometry pen.
- Fabric remains Planner-only. Admin uses an interactive SVG viewport, not a second plan-document canvas.
- The product shell is generic. No `LinearDesk*` state or labels belong in the generic shell.
- Each product drawer owns its schema, defaults, form definition, geometry, constraints, capabilities, and identity defaults.
- Product-specific assembly concepts remain product-specific. A desk may expose workstation count or U-layout; a bed may expose mattress, headboard, storage, and clearance.
- Published geometry is deterministic from validated canonical millimetre fields.
- Preview and publish call the same drawer render function.
- Existing release authority remains unchanged: disk is live; DB + R2 dual-write is optional until cutover is proven.
- Tests never write canonical catalog files.
- Dockview owns the editor panel layout. Do not recreate docking with a CSS grid.
- React Aria owns all new interactive controls, field widgets, overlays, and dialogs.
- Tailwind v4 is used for composition and responsive utilities.
- CSS authority stays under `site/app/css/core/locked/` from the first implementation slice.
- No raw palette utilities, arbitrary Tailwind values, inline presentation styles, raw hex/RGB, or new styling tree.
- New editor styling and tokens start under `site/app/css/core/locked/`; do not modify or create another CSS authority.

## Architecture

### 1. Pure Drawer Contract

Create a pure, non-React contract under the Planner asset engine:

```ts
type ParametricProductType = string;

type ParametricProductCapabilities = {
  selectableParts: boolean;
  measurable: boolean;
  supportsGrid: boolean;
  supportsSnap: boolean;
};

type ParametricPreview = {
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

type ParametricProductDrawer<TFields> = {
  type: ParametricProductType;
  label: string;
  schema: z.ZodType<TFields>;
  defaults: () => TFields;
  capabilities: ParametricProductCapabilities;
  render: (fields: TFields) => ParametricPreview;
};
```

The asset engine owns geometry contracts only. It must not import React, Admin components, browser APIs, or CSS.

### 2. Admin Authoring Definition

Each production drawer has an Admin authoring definition:

```ts
type ParametricFieldDefinition = {
  key: string;
  label: string;
  kind: "number" | "text" | "boolean" | "select";
  unit?: "length";
  options?: readonly { value: string; label: string }[];
};

type ParametricFormSection = {
  id: string;
  label: string;
  fields: readonly ParametricFieldDefinition[];
};

type ParametricAuthoringDefinition<TDisplay, TFields> = {
  drawer: ParametricProductDrawer<TFields>;
  defaultDisplay: (unit: "mm" | "cm") => TDisplay;
  parseDisplay: (display: TDisplay) => ParseResult<TFields>;
  convertUnit: (display: TDisplay, unit: "mm" | "cm") => TDisplay;
  sections: readonly ParametricFormSection[];
  identity: ParametricIdentityAdapter<TDisplay, TFields>;
  tools: readonly CanvasToolRailItem[];
};
```

Definitions are registered by type. The generic editor reads the selected definition and renders its properties, tools, preview, status, and publish request.

### 3. Registry

Use explicit registration, not filesystem discovery or dynamic arbitrary imports. A client-safe product manifest is the parity authority for product type ids. Client authoring and server publish registries must each prove that they cover every manifest id exactly once.

```ts
const PARAMETRIC_PRODUCT_MANIFEST = ["desk-assembly"] as const;
```

Adding a future bed requires a Maker drawer plus authoring and publish adapters, then one manifest entry. It must not require changing the shell, canvas, publish orchestration, or layout CSS. Registry parity tests fail if either runtime omits or duplicates that manifest id.

The first production migration upgrades the existing linear desk into a configurable desk-assembly drawer. It supports linear and U layouts, workstation count, aisle clearance, canonical dimensions, and drawer-owned options. The generic shell only renders its definition; no assembly field belongs in shell state.

A test-only second drawer proves that the shell is not desk-specific without shipping fake inventory. Its geometry must also pass through Maker.js; raw handwritten test SVG is forbidden.

### 4. Generic Editor Shell

Split the current `LinearDeskParametricForm.tsx` responsibilities:

| Component | Responsibility |
|---|---|
| `ParametricProductEditor` | Selected type, generic authoring state, parse result, publish orchestration |
| `ParametricEditorTopBar` | Inventory navigation, type selector, selected product identity, Publish |
| `ParametricStatusBar` | Draft/published state, validation, footprint, and release result rendered inside the top bar; not a third chrome row |
| `AdminSvgDockHost` factory preset | Existing Admin Dockview host extended with tools, properties, and canvas slots |
| `ParametricToolRailAdapter` | Supplies drawer-declared tools to the shared `CanvasToolRail` |
| `ParametricPropertiesPanel` | Renders definition sections and field controls |
| `ParametricPlanCanvas` | Pan, zoom, fit, grid, selected part, measurements, SVG preview |
| Product definition | Product-specific fields, labels, constraints, tools, identity defaults |

The route remains thin and renders `ParametricProductEditor`.

### 5. Dockview Layout

Extend the existing `site/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost.tsx` with a backward-compatible factory preset. Freehand keeps its current preview/stage/details ids and behavior. Do not create a second Admin Dockview host, import Planner document state, or extend Planner layout preset types.

The host registers three semantic panel ids:

| Panel id | Content | Desktop position |
|---|---|---|
| `tools` | `ParametricToolRailAdapter` | left |
| `properties` | `ParametricPropertiesPanel` | center-left |
| `canvas` | `ParametricPlanCanvas` | dominant right |

The factory preset matches `32.jpg`. The canvas is required and cannot close. Tools and properties may resize within locked semantic limits. Factory mode alone uses a versioned storage key; invalid restore resets to the known factory preset. Freehand remains unpersisted and unchanged.

Dockview owns panel order, resizing, stacking, and responsive rearrangement. Locked CSS themes Dockview surfaces, headers, separators, and focus states. It must not duplicate Dockview layout with `grid-template-columns`.

### 6. React Aria Controls

Use React Aria Components for every new interactive element:

- `Button` for commands and Publish;
- `ToggleButton` or `ToggleButtonGroup` for tool and view modes;
- `NumberField`, `TextField`, `Input`, `Label`, and `Group` for property values;
- `Select`, `ListBox`, `ListBoxItem`, and `Popover` for product type and enumerated options;
- `Checkbox` for boolean options;
- `ModalOverlay`, `Modal`, and `Dialog` for publish confirmation.

The generic field renderer selects the React Aria component from each field definition. Labels, descriptions, validation messages, disabled reasons, focus visibility, keyboard operation, and 44px targets are acceptance behavior. New shell code must not substitute native interactive elements or custom div-based controls.

### 7. Tool Rail

Keep `CanvasToolRail` as the shared component. Extend it with a backward-compatible configurable mode:

```ts
type CanvasToolRailProps =
  | PlannerCanvasToolRailProps
  | ParametricCanvasToolRailProps;
```

Planner defaults and tests must remain unchanged. Parametric mode receives drawer-declared tools and uses the wider multi-column presentation required by `32.jpg`.

Only implemented actions are enabled. Generic shared actions are select, pan, fit, grid, snap, and measure. Product tools select or focus drawer parts; they do not invent freehand geometry.

### 8. Interactive SVG Canvas

Admin does not import Fabric. `ParametricPlanCanvas` owns transient viewport state only:

- zoom percentage;
- pan offset;
- fit-to-view;
- grid visibility;
- snap visibility/state when the drawer supports it;
- selected Maker part id;
- dimension overlays returned by the drawer.

Canonical fields remain the geometry authority. Canvas interaction may select/focus parts and inspect measurements; it does not directly mutate path data.

The Maker renderer must emit stable part identifiers and path records from the same Maker model used to build the full publish SVG. `ParametricPlanCanvas` maps those trusted path records to React `<path>` elements and attaches `data-part-id`; it never injects or nests full SVG strings. Publish sanitizes the full SVG through the existing compile seam and invokes the same drawer render on the server.

### 9. Generic Publish Orchestration

Introduce `publishParametricProductAction`:

1. Require Admin auth.
2. Resolve the drawer by `type` from an allowlisted server registry.
3. Validate canonical fields with the drawer schema.
4. Render deterministic Maker SVG.
5. Sanitize through the existing compile seam.
6. Build the product descriptor through the drawer identity adapter while preserving stable `id` and `generatedAt` on same-slug republish.
7. Call the existing `publishDescriptorWithPipeline` with the exact sanitized drawer SVG.
8. Set the intended lifecycle only after publish success.
9. Revalidate Admin inventory, parametric editor, and Planner guest catalog.

The existing linear desk action becomes a compatibility wrapper during migration, then can be removed after all callers and tests use the generic action.

### 10. Styling Contract

Tailwind v4 is already loaded through `site/app/css/index.css`. This slice consumes existing utilities and declares any new semantic custom properties only in locked CSS.

Rules for this editor:

- Use static Tailwind v4 utilities for composition where semantic values already exist.
- Never use arbitrary utilities such as `grid-cols-[...]`, `w-[...]`, or palette utilities such as `bg-slate-500`.
- Put the Dockview theme bridge, panel surfaces, separators, focus states, and supported-width states in `site/app/css/core/locked/chrome/parametric-product-editor.css`.
- Keep all `CanvasToolRail` mode styling in its existing locked `canvas-tool-rail.module.css`; do not duplicate rail paint in editor CSS.
- Put Admin-only status/publish presentation in `site/app/css/core/locked/admin/parametric-product-editor.css`.
- Put Maker preview paint and part-selection states in `site/app/css/core/locked/svg/parametric-product-preview.css`.
- Import each file from its existing locked index.
- Add reusable editor dimensions as named custom properties inside the matching locked CSS file, not repeated literals or `theme.css` edits.
- Do not create CSS modules for the new generic editor.
- Keep existing freehand editor CSS untouched.

Both hardcoding audits are mandatory for every UI slice:

```powershell
node site/scripts/audit-hardcoded-detail.mjs
node site/scripts/audit-tsx-hardcoded.mjs
```

### 11. Responsive Behavior

Desktop follows `32.jpg`: Dockview places a wide tool rail, properties inspector, and dominant plan canvas.

Tablet applies a Dockview preset that keeps the plan dominant and allows the properties panel to narrow within semantic token limits.

Below the existing 60rem Admin authoring threshold, keep the current unsupported-authoring notice. Do not introduce phone editing or a second responsive factory shell.

At supported desktop/tablet widths, Dockview keeps this arrangement:

```text
TOP BAR
TOOL RAIL | PRODUCT PROPERTIES | PLAN CANVAS (DOMINANT)
```

Dockview owns the supported-width arrangement. Touch targets stay at least 44px. Publish remains reachable. The product type and identity remain visible without covering the plan.

## Data Flow

```text
select product type
  -> registry resolves authoring definition + Maker drawer
  -> default display fields
  -> operator edits mm/cm form
  -> adapter converts to canonical mm
  -> drawer schema validates
  -> drawer renders deterministic Maker preview
  -> operator confirms publish
  -> server resolves same drawer and validates again
  -> same Maker render
  -> existing publish pipeline
  -> guest catalog
  -> Planner placement stamps slug/SKU/revision
  -> BOQ uses stamped identity
```

## Error Handling

- Unknown type: fail closed; no fallback drawer.
- Invalid fields: field-level errors; preview and publish disabled.
- Drawer render failure: retain form values, clear stale preview, show a specific render error.
- Unsupported tool: disabled with an accessible explanation.
- Publish failure: retain draft and preview; never display published state.
- Dual-write unavailable: report disk publish honestly; do not claim DB authority.
- Catalog write isolation failure: stop the test or publish path before canonical mutation.

## Testing Strategy

1. Contract tests for drawer registration, unknown types, schema validation, and deterministic rendering.
2. A Maker-backed test-only bed-like drawer proves the generic shell can render a second field set without production bed inventory.
3. Configurable desk-assembly tests cover linear/U layout, workstation count, aisle, dimensions, options, mm/cm conversion, identity sync, Maker part ids, and publish output.
4. `CanvasToolRail` regression tests prove Planner mode is unchanged and parametric mode renders drawer tools.
5. Dockview tests prove the factory preset, required canvas, resize behavior, versioned restore fallback, unchanged freehand mode, and supported-width keyboard reachability.
6. React Aria tests cover fields, selectors, toggles, validation, and publish dialog keyboard/focus behavior.
7. `ParametricPlanCanvas` tests cover fit, zoom, pan, grid, part selection, and blocked preview.
8. Publish action tests use isolated inventory roots and prove the exact sanitized SVG reaches `publishDescriptorWithPipeline`, registry parity, and stable republish identity.
9. Admin browser proof at a supported desktop width covers Dockview geometry, type selection, fields, Maker preview, React Aria keyboard/focus behavior, publish confirmation, 44px targets, and no console/network failures.
10. C4 browser proof consumes the exact isolated C3 artifact and confirms published identity reaches Planner placement and BOQ at 1280 and 390px.
11. A dependency-boundary test fails any Fabric import under `site/features/admin/svg-editor/parametric/`.
12. Run hardcoding audits, focused Vitest, lint, typecheck, `check:layout`, and `check:plans-purity`.

## Acceptance

- The generic shell contains no desk-specific field names or labels.
- A test-only second drawer works without shell changes.
- Configurable desk assemblies support linear/U layout, workstation count, aisle, dimensions, and options through preview and publish.
- Dockview owns the `32.jpg` panel order and resizing at supported authoring widths.
- React Aria owns every new form control, command, toggle, selector, and publish dialog.
- The rail is wide and product-aware in Admin while Planner mode remains unchanged.
- The canvas is interactive without importing Fabric into Admin.
- Preview and publish SVG are generated by the same drawer.
- No new hardcoded CSS, palette utility, arbitrary Tailwind value, inline presentation style, or CSS tree.
- Published product still places in Planner with correct name/SKU and BOQ identity.

## Explicit Non-Goals

- Shipping every product type immediately.
- A mega-schema containing every possible product option.
- AI-generated path data or SVG authority.
- Fabric inside Admin.
- Rebuilding or importing Planner document state; the factory extends the existing `AdminSvgDockHost`.
- Changing freehand Excalidraw.
- Flipping DB SVG release authority.
- Photorealistic 3D as a prerequisite.

## Image Generation Decision

No generated mockup is needed. The owner supplied `32.jpg` as the exact visual reference, and the deliverable is deterministic code-native UI. Image generation would add another visual interpretation and is intentionally not used.
