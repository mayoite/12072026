# Planner Phases 1–2 — start, BOQ, and design workspace

## Phase 1 — start and BOQ

### Outcome

Public visitors enter Planner, start a project, and get a deterministic branded BOQ after at most one blocking choice.

### Entry and marketing

- Site entry without hidden flags; guests need no account.
- State Planner outcome before setup.
- Marketing landing, feature hub, feature detail pages, and help explain the journey.
- Onboarding coach for catalog, tools, templates, 3D, and AI.
- Guest route supports optional `?id=` plan load.
- Session dialog and workspace error boundary for guest vs member.
- Offer template, scratch, and import or trace together — one setup gate, never a second gate with one choice only.
- Remove or wire dead `StartingPointStep.tsx`.
- Back and skip on non-essential steps.
- Protect member, Admin, and private routes.
- Emit full Site conversion contract: `PLANNER_ENTRY`, `PROJECT_START`, `FIRST_PLACEMENT`, `BOQ_GENERATED` (no private geometry).

### Project setup

- Prefill name, location, floor area, purpose, units; editable after workspace entry.
- Optional fields must not block exploration.
- Geometry only as required by the starting mode.
- Templates, scratch, and import/trace use documented formats (`ProjectSetupStep.tsx`).
- Doors, windows, columns, keep-outs in editor; mm authority; stable room IDs.
- Brief and room survive reload; keyboard-complete with visible focus.

### Deterministic BOQ

- One calculation authority across workspace and exports (`projectFurnitureBoq`; retire or unify `workstationBoqV0`, `buildBoq`).
- Product-backed placements only; isolated fixture when live catalog unavailable.
- Group by stable product, family version, options, commercial identity.
- Lines include description, options, qty, units, source object IDs.
- Exclude unsupported/unbranded items with visible reason.
- Identical inputs → identical lines, order, and hash.
- Unpriced branded BOQ without live pricing; formatting separate from calculation.

### Phase 1 blockers

| Gap | Blocks only |
|---|---|
| Live Admin catalog | Live-catalog proof |
| Approved prices | Live pricing (not unpriced BOQ) |
| Analytics infra | End-to-end event receipt (not emission checks) |

---

## Phase 2 — design workspace

### Outcome

The customer builds an accurate layout from public Oando inventory. One project survives 2D, 3D, save, reload, devices, and input methods.

### Workspace shell

- Command palette, layers panel, tool rail, top bar, docked panels, status bar.
- Pan, grid, snap, density toggles; deferred room, dimension, and text tools labelled honest.
- Entity lock, multi-floor selector, 2D/3D toggle, image/plan import, calibration, templates, room presets.
- Guest blocked commands match `plannerPermissions.ts`.

### Core layout

- Create and edit walls, doors, and windows; columns and keep-outs where model supports them.
- Select, move, rotate, resize, duplicate, and delete.
- Millimetres stored; metric and imperial display.
- Numeric properties keyboard-editable; one undo/redo authority for all mutations.

### Catalog and placement

- Inventory panel: search, favorites, recent, fuse-ranked results, buyer-facing filter.
- Consume versioned Admin catalog; published customer-visible products only.
- Configurator and workstation configurator bridges; batch place with custom counts.
- Show imagery or 2D geometry, name, SKU, dimensions, family, availability; group variants.
- Preserve product, family, version, option, and commercial identity on placement.
- Catalog APIs: `/api/planner/catalog`, `/configurator`, `/svg-blocks`.
- Released SVG via server path; pin revision identity on placement; `Block2D` only while loading or on miss.
- Catalog drop feedback; quote cart from placement where applicable.
- Isolated fixture when live catalog unavailable.

### SVG and asset consumption

- Planner reads released SVG identity through server catalog boundary (not disk-only long term).
- Import exact artifact bytes by committed revision and storage key when DB contract is live.
- Canvas uses published SVG when loaded; honest Block2D fallback.
- Asset engine: `compileSvgForPublish` authority, normalize, public SVG write, descriptor persist, `previewImageUrl` stamp.
- Generated GLB policy, modular cabinet export, procedural 3D mesh, `POST /api/planner/generated-glb`.

### AI assisted layout

- AI assist drawer, advisor chat, `POST /api/planner/ai-advisor`.
- Space suggest, apply layout, catalog match, layout preview SVG.
- Sketch-to-plan and project-sketch APIs.
- Workspace AI bridge; shell bootstrap from scratch starting mode.

### One project document

- One normalized document for 2D, 3D, save, reload, import, export, and BOQ.
- Guest IndexedDB autosave vs member Drizzle persistence; offline sync queue; guest promotion.
- Local version snapshots; truthful save states; never show success after failed save.

### 2D and 3D continuity

- Same identities in both views; preserve count, pose, rotation, options.
- Three.js scene from document; GLB load when policy allows; clear fallback states.

### Interface quality

- Desktop header one row; canvas ≥65% viewport; empty properties collapsed.
- Phone: compact bars; chrome ≤40%; canvas ≥60%; exclusive inventory/properties sheets; 44×44px targets.
- Keyboard and drag alternatives; focus visible; WCAG 2.2 AA primary journey.
- Light and dark themes; no unexplained console, request, or hydration errors.

### Phase 2 blockers

| Gap | Blocks only |
|---|---|
| Live catalog blocks | Live integration proof |
| Disk vs DB SVG split | Released SVG authority proof |
| Missing 3D assets | Affected 3D visual proof |
| Remote storage | Remote-save proof |