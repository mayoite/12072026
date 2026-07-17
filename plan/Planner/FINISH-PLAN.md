# Planner world-standard completion plan

Status: OPEN.

Owner instruction: Planner only. No subagents.

## Outcome

Deliver a professional office-planning workflow.

The benchmark is AutoCAD precision with SmartDraw usability.

The product is not a general CAD clone.

The customer journey is:

1. Draw or import the room.
2. Place and configure furniture.
3. Review, generate the BOQ, and send it to Oando.

## Truth rules

- Live code wins.
- Fresh browser behaviour wins.
- Every checklist item starts unchecked.
- Unit tests do not prove UI acceptance.
- Old reports do not prove completion.
- `results/` contains raw output only.
- Active blockers belong in `Failures.md`.
- No Planner failure may be hidden behind a later phase.
- No completed item may remain marked `OPEN`.
- No unverified item may be marked complete.

## Scope boundary

Included:

- Planner routes and entry contracts.
- Planner UUID and document identity.
- Guest and member persistence.
- Desktop and mobile Planner shells.
- Drawing, measurement, snapping, and editing.
- JSON import.
- Image, SVG, and PDF underlays.
- Sketch-to-Plan.
- Inventory and furniture placement.
- 2D and 3D parity.
- Validation.
- BOQ generation.
- Quote submission to Oando.
- Planner exports.
- Planner AI.
- Planner accessibility, security, performance, and recovery.
- Planner tests and browser acceptance.

Excluded:

- Admin redesign.
- Site redesign.
- SVG Editor redesign.
- Tech Docs work.
- General SEO work.
- Unrelated database work.

Inbound links from Dashboard, Choose Product, Portal, and Admin are tested as Planner entry contracts. Their pages are not redesigned here. A defect outside Planner becomes an explicit cross-track blocker.

## Non-negotiable product decisions

- Sketch-to-Plan stays.
- AI stays as an optional assistant.
- AI is never a required workflow gate.
- AI is not a docked panel.
- Layers are not a permanent customer panel.
- Internal drawing layers may exist for geometry, visibility, export, and performance.
- Dockview may manage desktop regions.
- Dockview must not define product workflow or document state.
- No customer `Panels` menu.
- No second-level toolbar dropdown for primary workflow tools.
- Primary actions remain directly visible.
- The canvas is the dominant surface.
- `Import plan` means Planner JSON only.
- `Sketch to plan` is a separate image or PDF action.
- A bare guest URL always starts a fresh draft.
- A guest URL with a valid ID resumes only that draft.
- Production runtime never writes into source code.
- Production runtime never writes under `site/` or `site/public/`.
- Runtime documents belong in memory, IndexedDB, database storage, or approved object storage.
- Generated GLB files use ephemeral blobs or approved object storage.
- Demo prices are never presented as approved commercial prices.
- Every drag action has a non-drag alternative.

## External benchmark

These sources define capability expectations. They do not authorize copying assets, code, layout, or trade dress.

### AutoCAD lessons

- Object snaps provide precise endpoint, midpoint, intersection, and object-relative placement.
- Drawing units separate calculation precision from displayed precision.
- Dynamic dimensions allow exact values while drawing and editing.
- Wall dimensions cover overall length, wall length, width, and intersections.
- Grips support direct reshaping and moving.
- Dimensional constraints preserve distances and angles.
- Autosave, backups, and recovery protect work.
- PDF import and underlays support traced source material.
- Internal layers organize, lock, hide, and export drawing classes.

Official references:

- https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-Core/files/GUID-76B81C1A-373E-4BCD-975A-789FB36C89FE.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Architecture/files/GUID-652DA67D-C364-43C6-A71D-FD1E676A0374.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Architecture/files/GUID-304D9844-4B1C-4ACA-A2BF-9C50FBA015B5.htm
- https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Architecture/files/GUID-3BA51ED7-3077-4E64-8788-A16682723B30.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-01DE459C-21A7-4E92-A1D6-E2C36CD89F0C.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-F7ED2587-8F25-4770-BD13-C7C95456E707.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-5692ECA7-091D-446B-B946-BC8FF893E296.htm
- https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-3F8671B7-B5E7-4092-96C7-C7C330E6C06C.htm
- https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-02D97F82-47EC-4EE8-9429-E9CF6198EF34.htm

### SmartDraw lessons

- A customer can start from scratch, a template, or an imported plan.
- Rooms and walls close cleanly.
- Exact dimensions can be typed directly.
- Doors and windows snap and rotate with walls.
- Imported images and PDFs can be calibrated to scale.
- Furniture placement shows distance guides.
- Symbols retain structured product data.
- A manifest supports estimates and proposals.
- PDF, PNG, and SVG exports are expected.
- Precision must not require CAD training.

Official references:

- https://www.smartdraw.com/floor-plan/draw-floor-plans.htm
- https://www.smartdraw.com/floor-plan/import-and-scale.htm
- https://www.smartdraw.com/floor-plan/floor-plan-creator.htm
- https://www.smartdraw.com/visual-quoting/
- https://www.smartdraw.com/construction/

## Current verified failures

| ID | Failure | Status |
|---|---|---|
| PF-01 | Guest UUIDs still map to one fixed IndexedDB project key. | FAIL |
| PF-02 | A new guest URL can load an old guest draft. | FAIL |
| PF-03 | The guest route unit test fails after the redirect change. | FAIL |
| PF-04 | Onboarding tests still expect `Start placing furniture`. | FAIL |
| PF-05 | Room outline geometry is deferred. | FAIL |
| PF-06 | Persistent dimension annotations are deferred. | FAIL |
| PF-07 | Sketch-to-Plan has no customer UI entry. | FAIL |
| PF-08 | Sketch-to-Plan requires member auth and blocks guests. | FAIL |
| PF-09 | Planner GLB export does not exist. | FAIL |
| PF-10 | Planner does not send a quote to Oando. | FAIL |
| PF-11 | Live overlap validation is incomplete. | FAIL |
| PF-12 | Step navigation is labelled but not completion-aware. | FAIL |
| PF-13 | Review and quote UI has no dedicated tests. | FAIL |
| PF-14 | Many browser scripts use the removed onboarding label. | FAIL |
| PF-15 | The original localhost origin served stale Planner chunks. | OPEN |
| PF-16 | Import, export, BOQ, quote, 3D, and AI lack one complete fresh browser pass. | OPEN |
| PF-17 | Mobile has only partial smoke proof. | OPEN |
| PF-18 | Legacy Layers and docking code remain in active Planner paths. | OPEN |
| PF-19 | `OOPlannerWorkspace.tsx` owns too many unrelated concerns. | OPEN |
| PF-20 | Save state is duplicated and contradictory. | FAIL |
| PF-21 | Empty properties consume customer workspace. | FAIL |
| PF-22 | Catalog comparison and family grouping are weak. | FAIL |
| PF-23 | Generic furniture cannot complete the quote-cart path. | FAIL |
| PF-24 | The handoff route is not called and does not deliver to Oando. | FAIL |
| PF-25 | The handoff route lacks CSRF and idempotency. | FAIL |
| PF-26 | Branded customer-ready BOQ is not wired to the live workspace. | FAIL |
| PF-27 | 2D and 3D object parity lacks full browser proof. | OPEN |
| PF-28 | Runtime GLB generation can write under `site/public`. | FAIL |

## Execution order

Dependencies are strict. A blocked item stops only its direct dependants.

### P0. Test isolation and clean authority

- [ ] Create a Planner-only test run identifier.
- [ ] Confirm tests use temporary drafts and temporary catalog fixtures.
- [ ] Confirm no test writes canonical inventory files.
- [ ] Confirm no runtime test writes under `site/` or `site/public/`.
- [ ] Replace stale onboarding selectors in Planner tests and scripts.
- [ ] Repair the guest route test for redirect and resume cases.
- [ ] Add a deterministic browser bootstrap.
- [ ] Diagnose any browser hang before changing timeouts.
- [ ] Prove the served chunks match current source.
- [ ] Prove localhost service-worker behaviour does not cache development chunks.
- [ ] Record every fresh failing test as `FAIL`.

Exit gate:

- Planner tests are isolated.
- The browser runs current source.
- The baseline failure list is reproducible.

### P1. Entry points, UUIDs, and document identity

- [ ] Define one route contract for `/planner/`.
- [ ] Define one route contract for `/planner/guest/`.
- [ ] Define one route contract for `/planner/guest/?id=<uuid>`.
- [ ] Define one route contract for `/planner/canvas/`.
- [ ] Define one route contract for `/planner/canvas/?id=<uuid>`.
- [ ] Define resume contracts for Portal plan links.
- [ ] Verify inbound links from Dashboard and Choose Product.
- [ ] Verify inbound links from Admin and public product pages.
- [ ] Generate new IDs at runtime with a cryptographic UUID API.
- [ ] Validate every URL ID before it reaches persistence or database code.
- [ ] Reject malformed, empty, overlong, and ambiguous IDs.
- [ ] Scope every guest IndexedDB key by guest plan ID.
- [ ] Keep the legacy guest key only for explicit migration.
- [ ] Make bare `/planner/guest/` create a new blank plan.
- [ ] Make an ID URL resume only its matching plan.
- [ ] Prevent one guest ID from overwriting another.
- [ ] Scope member persistence by authenticated owner and plan ID.
- [ ] Prevent plan-ID enumeration from exposing another customer plan.
- [ ] Preserve guest-to-member claim without overwriting member work.
- [ ] Test new, resume, migrate, missing, malformed, expired, and unauthorized states.

Exit gate:

- Two guest UUIDs produce two independent drafts.
- Reloading either URL restores only that draft.
- No ID is written into source code.

### P2. Document, units, scale, and precision

- [ ] Keep millimetres as canonical calculation units.
- [ ] Separate canonical units from displayed units.
- [ ] Support mm, cm, m, inches, and feet-inches display.
- [ ] Define linear, angular, area, and quantity precision.
- [ ] Preserve full calculation precision during display rounding.
- [ ] Define insertion scaling for imported objects.
- [ ] Define a stable world origin and canvas transform.
- [ ] Define object coordinates, rotation, dimensions, elevation, and floor ownership.
- [ ] Define wall centreline, thickness, start, end, and joins.
- [ ] Define opening host-wall and offset contracts.
- [ ] Define furniture catalog identity, variant, configuration, and transform.
- [ ] Version the Planner document schema.
- [ ] Validate imports before replacing current state.
- [ ] Migrate supported older versions.
- [ ] Fail visibly on unsupported versions.
- [ ] Preserve unknown safe data only when the schema permits it.
- [ ] Add round-trip invariants for save, load, import, export, 2D, and 3D.

Exit gate:

- A measured object retains the same real size across save, load, unit changes, and exports.

### P3. Workflow and shell

- [ ] Keep exactly three visible customer steps.
- [ ] Make `Draw room` the first active task.
- [ ] Make `Place furniture` the second task.
- [ ] Make `Review & quote` the third task.
- [ ] Allow backward navigation without losing work.
- [ ] Permit forward navigation with clear incomplete-state warnings.
- [ ] Do not fake completion by disabling exploration.
- [ ] Show completion state for each step.
- [ ] Show one authoritative save state.
- [ ] Show offline, saving, saved, unsaved, and failed states distinctly.
- [ ] Keep desktop command bar to one row.
- [ ] Keep direct Import, Sketch-to-Plan, Save, and Export actions.
- [ ] Keep AI as an optional action.
- [ ] Remove the customer `Panels` menu.
- [ ] Remove permanent docked Layers and AI.
- [ ] Collapse empty properties.
- [ ] Open properties from selection context.
- [ ] Use Dockview only for useful desktop regions.
- [ ] Make the desktop canvas at least 65 percent of viewport area by default.
- [ ] Build a deliberate mobile top bar.
- [ ] Build a deliberate mobile bottom tool bar.
- [ ] Use mutually exclusive mobile sheets for Inventory and Properties.
- [ ] Keep the mobile canvas at least 60 percent of initial viewport height.
- [ ] Support portrait and landscape.
- [ ] Reset only layout state when requested.
- [ ] Never reset project content through a layout reset.

Exit gate:

- A new customer can identify the current task and next action without opening a menu.

### P4. Draw room

- [ ] Implement room outline creation.
- [ ] Support rectangle rooms by exact width and depth.
- [ ] Support connected wall chains.
- [ ] Support automatic corner joining.
- [ ] Support clean room closure.
- [ ] Prevent duplicate and zero-length walls.
- [ ] Support direct wall length input while drawing.
- [ ] Support direct wall angle input while drawing.
- [ ] Support wall thickness input.
- [ ] Support orthogonal lock.
- [ ] Support grid snap.
- [ ] Support endpoint, midpoint, intersection, perpendicular, and nearest snaps.
- [ ] Show snap markers and snap names.
- [ ] Show live length and angle next to the pointer.
- [ ] Allow Tab or an equivalent action to move between numeric fields.
- [ ] Support Escape to cancel the active operation.
- [ ] Support Enter to commit exact values.
- [ ] Add doors and windows only to valid host walls.
- [ ] Snap and rotate openings with host walls.
- [ ] Support exact opening width and wall offset.
- [ ] Prevent invalid or overlapping openings.
- [ ] Support wall selection grips.
- [ ] Support endpoint editing without corrupting connected geometry.
- [ ] Implement persistent linear dimensions.
- [ ] Implement overall room dimensions.
- [ ] Implement wall and opening dimensions.
- [ ] Implement distance and area measurement tools.
- [ ] Keep dimensions readable across zoom.
- [ ] Export dimensions consistently.
- [ ] Add columns and keep-out zones needed for office layout validation.
- [ ] Make undo and redo atomic for drawing operations.

Exit gate:

- A customer can create a measured closed room with walls, doors, and windows without guessing scale.

### P5. Import, underlay, and Sketch-to-Plan

- [ ] Keep Planner JSON import separate.
- [ ] Accept only documented Planner JSON versions in `Import plan`.
- [ ] Add a separate `Sketch to plan` action.
- [ ] Support PNG and JPEG sketches.
- [ ] Support SVG floor-plan input safely.
- [ ] Support PDF floor-plan input or record a precise technical blocker.
- [ ] Sanitize SVG before preview or conversion.
- [ ] Limit file size, pixel count, page count, and processing time.
- [ ] Reject deceptive MIME types and malformed files.
- [ ] Add imported images and PDFs as locked underlays.
- [ ] Support underlay opacity, visibility, crop, rotation, and deletion.
- [ ] Calibrate underlay scale using a known reference distance.
- [ ] Preserve underlay scale across reload.
- [ ] Allow manual tracing over the underlay.
- [ ] Wire the existing Sketch-to-Plan client to the customer UI.
- [ ] Reconcile the two existing sketch endpoints into one contract.
- [ ] Permit the intended external customer role.
- [ ] Require CSRF protection for conversion requests.
- [ ] Apply guest-safe rate limits.
- [ ] Keep provider keys server-side.
- [ ] Show upload, processing, preview, success, fallback, and failure states.
- [ ] Return converted walls, openings, scale confidence, and warnings.
- [ ] Preview conversion before changing the project.
- [ ] Require explicit customer acceptance.
- [ ] Apply accepted geometry as one undoable transaction.
- [ ] Preserve the source underlay for comparison.
- [ ] Never claim AI geometry is construction-authoritative.
- [ ] Test provider absence, timeout, invalid output, CSRF failure, and retry.

Exit gate:

- A guest can upload a sketch, calibrate it, preview editable geometry, accept it, and undo it.

### P6. Place and configure furniture

- [ ] Show recognizable product imagery or 2D geometry.
- [ ] Show full name, SKU, family, variant, dimensions, and availability.
- [ ] Group variants by family.
- [ ] Filter by family, seats, dimensions, material, and availability.
- [ ] Keep search keyboard accessible.
- [ ] Support click-to-place.
- [ ] Support drag-to-place.
- [ ] Provide a non-drag placement alternative.
- [ ] Show a placement ghost with true dimensions.
- [ ] Snap furniture to grid, walls, and nearby objects.
- [ ] Show distance guides to walls and nearby furniture.
- [ ] Support exact X, Y, width, depth, and rotation input.
- [ ] Preserve catalog identity during resize and rotation.
- [ ] Support duplicate, copy, paste, and delete.
- [ ] Support multi-select.
- [ ] Support align and distribute.
- [ ] Support exact spacing.
- [ ] Support rows and rectangular arrays for workstations.
- [ ] Support group and ungroup where product semantics allow it.
- [ ] Support front/back ordering where it affects 2D editing.
- [ ] Prevent silent placement outside the room.
- [ ] Warn about clearance and overlap during placement.
- [ ] Keep placed 2D geometry recognizable from the catalog preview.
- [ ] Keep configuration options attached to the placed instance.
- [ ] Recalculate BOQ data after every relevant edit.
- [ ] Make bulk actions one undoable transaction.

Exit gate:

- A customer can place and arrange a workstation layout using exact spacing without repeated manual dragging.

### P7. 2D and 3D parity

- [ ] Define one source document for 2D and 3D.
- [ ] Remove divergent 2D-only and 3D-only state.
- [ ] Keep wall, opening, furniture, rotation, material, and floor parity.
- [ ] Rebuild 3D deterministically from the Planner document.
- [ ] Load approved generated GLB assets only.
- [ ] Use procedural fallback geometry visibly when GLB is unavailable.
- [ ] Never label a fallback as GLB-ready.
- [ ] Remove production writes to `site/public`.
- [ ] Use browser blob URLs for ephemeral previews.
- [ ] Use approved object storage for persistent generated GLB files.
- [ ] Revoke stale blob URLs.
- [ ] Handle missing, slow, invalid, and unauthorized assets.
- [ ] Keep 3D lazy-loaded.
- [ ] Preserve camera usability on mouse, touch, and keyboard alternatives.
- [ ] Test repeated 2D and 3D switching without document drift.

Exit gate:

- The same saved project produces equivalent 2D and 3D contents after reload.

### P8. Validation and review

- [ ] Replace overlap stubs with rotation-aware geometry.
- [ ] Detect furniture outside closed rooms.
- [ ] Detect wall and furniture intersections.
- [ ] Detect opening clearance conflicts.
- [ ] Detect furniture-to-furniture overlap.
- [ ] Detect unconfigured products.
- [ ] Detect missing catalog identity.
- [ ] Detect unavailable products.
- [ ] Detect missing approved prices.
- [ ] Detect unsupported geometry in exports.
- [ ] Distinguish errors, warnings, and information.
- [ ] Link every issue to the affected canvas object.
- [ ] Focus or select the object from the issue list.
- [ ] Revalidate after every relevant change.
- [ ] Do not claim regulatory compliance without an approved rule authority.
- [ ] Show furniture count, seats, validation state, and BOQ readiness.
- [ ] Add dedicated tests for Review and Quote.

Exit gate:

- Review never says `Ready` while a known blocking error exists.

### P9. BOQ and commercial truth

- [ ] Select one canonical BOQ builder.
- [ ] Reconcile generic furniture and workstation BOQ paths.
- [ ] Include project identity and revision.
- [ ] Include floor, product, SKU, configuration, quantity, and units.
- [ ] Include catalog revision and validation revision.
- [ ] Separate priced and unpriced lines.
- [ ] Separate demo prices from approved commercial prices.
- [ ] Block customer-ready price totals when price authority is absent.
- [ ] Allow a clearly labelled unpriced draft BOQ.
- [ ] Wire branded PDF BOQ to the live workspace.
- [ ] Use approved Oando branding.
- [ ] Remove placeholder branding.
- [ ] Show warnings and unsupported items in every BOQ format.
- [ ] Make BOQ generation deterministic.
- [ ] Give every BOQ a traceable document version.
- [ ] Test JSON, CSV, and branded PDF contents.

Exit gate:

- The same project revision produces the same complete BOQ in every supported format.

### P10. Send quote to Oando

- [ ] Replace the workstation-only local cart bridge.
- [ ] Support all quote-eligible Planner products.
- [ ] Define the Planner handoff payload.
- [ ] Include project revision and BOQ checksum.
- [ ] Require explicit customer confirmation.
- [ ] Collect only required contact and project data.
- [ ] Require CSRF protection.
- [ ] Apply rate limiting.
- [ ] Apply idempotency.
- [ ] Prevent duplicate submissions after retry or reload.
- [ ] Validate authorization for member-only data.
- [ ] Deliver to the approved Oando destination.
- [ ] Return a traceable submission reference.
- [ ] Show sending, sent, failed, and retry states.
- [ ] Preserve the draft after failure.
- [ ] Emit handoff analytics without sensitive payload data.
- [ ] Verify the receiving system, not only the API response.

Exit gate:

- A customer can send a validated BOQ once and receive a verifiable Oando reference.

### P11. Export and interoperability

- [ ] Keep JSON import and export round-trip safe.
- [ ] Verify SVG export dimensions and scale.
- [ ] Verify PNG export dimensions and background.
- [ ] Verify PDF vector quality, pages, branding, and scale notes.
- [ ] Verify DXF units, layers, walls, openings, furniture, and dimensions.
- [ ] Implement Planner GLB export for the supported 3D scene.
- [ ] Validate GLB structure before download.
- [ ] Include only policy-approved generated assets.
- [ ] Report unsupported objects before export.
- [ ] Use accurate filenames and MIME types.
- [ ] Surface asynchronous export failures.
- [ ] Prevent empty or corrupt downloads.
- [ ] Test downloads in Chromium from the real Planner UI.
- [ ] Separate draft plan exports from customer-ready BOQ exports.

Exit gate:

- Every visible export option downloads a valid file or is removed from the menu.

### P12. AI assistant

- [ ] Keep AI optional.
- [ ] Keep AI outside the core dock layout.
- [ ] Send only necessary plan context.
- [ ] Keep provider keys server-side.
- [ ] Verify live CSRF bootstrap.
- [ ] Verify rate-limit behaviour.
- [ ] Verify provider failover.
- [ ] Verify no-provider fallback.
- [ ] Label degraded responses.
- [ ] Validate every structured suggestion.
- [ ] Preview geometry-changing suggestions.
- [ ] Require explicit acceptance.
- [ ] Apply accepted suggestions as one undoable transaction.
- [ ] Prevent AI from inventing catalog SKUs or prices.
- [ ] Prevent AI from claiming compliance approval.
- [ ] Keep chat usable with keyboard and assistive technology.

Exit gate:

- AI can fail completely without blocking drawing, placement, BOQ, or handoff.

### P13. Persistence, recovery, and versions

- [ ] Use one authoritative autosave state machine.
- [ ] Debounce saves without losing the final edit.
- [ ] Flush safely on page lifecycle events where supported.
- [ ] Recover after tab crash or browser restart.
- [ ] Detect and explain storage quota failures.
- [ ] Handle IndexedDB denial or unavailability.
- [ ] Handle offline member saves.
- [ ] Resolve sync conflicts explicitly.
- [ ] Never overwrite a newer remote revision silently.
- [ ] Add immutable named revisions for member plans.
- [ ] Pin catalog, validation, and price versions in commercial revisions.
- [ ] Keep local guest revisions clearly labelled as local.
- [ ] Support Save, Save as copy, restore, and delete with confirmation.
- [ ] Provide migration for the legacy shared guest key.
- [ ] Test recovery with real reloads and browser restarts.

Exit gate:

- No supported navigation, reload, crash, or retry path silently loses accepted work.

### P14. Accessibility and interaction quality

- [ ] Meet WCAG 2.2 AA for the primary journey.
- [ ] Complete the full journey with keyboard only.
- [ ] Keep focus visible and unobscured.
- [ ] Restore focus after menus, sheets, and dialogs close.
- [ ] Give every icon control an accessible name.
- [ ] Use correct button, menu, tab, dialog, and status semantics.
- [ ] Announce save, import, conversion, validation, export, and handoff states.
- [ ] Give every drag action a pointer and keyboard alternative.
- [ ] Keep frequent mobile targets at 44 by 44 pixels where practical.
- [ ] Support zoom without clipping critical controls.
- [ ] Respect reduced motion.
- [ ] Preserve contrast in focus, selection, grid, dimensions, and validation.
- [ ] Avoid colour-only state communication.
- [ ] Test screen-reader names and focus order.

Exit gate:

- Axe has no serious or critical issue in the full Planner journey.
- Keyboard users can complete the same commercial outcome.

### P15. Performance and reliability

- [ ] Split `OOPlannerWorkspace` by workflow responsibility.
- [ ] Keep one source of document truth.
- [ ] Remove dead Layers, docking, BOQ, catalog, and AI paths after migration.
- [ ] Prevent unnecessary full-canvas rerenders.
- [ ] Virtualize large inventories when measurement proves it necessary.
- [ ] Lazy-load 3D, PDF, GLB, and AI code.
- [ ] Measure initial Planner JavaScript.
- [ ] Measure interaction latency for draw, select, drag, and undo.
- [ ] Measure a representative large office plan.
- [ ] Keep zoom and pan responsive under the accepted object budget.
- [ ] Cancel stale network and AI requests.
- [ ] Revoke object URLs and dispose 3D resources.
- [ ] Keep service worker and HMR behaviour distinct.
- [ ] Capture console errors and failed requests in browser tests.
- [ ] Define and enforce performance budgets before release.

Exit gate:

- The accepted large-plan fixture remains usable on the supported desktop baseline.
- The initial mobile shell does not lock the main thread during entry.

### P16. Browser acceptance matrix

Every row needs a fresh pass. No row may rely on screenshots alone.

| Journey | Desktop | Mobile portrait | Mobile landscape | Keyboard | Failure state |
|---|---|---|---|---|---|
| `/planner/` landing to Planner | [ ] | [ ] | [ ] | [ ] | [ ] |
| Dashboard link to Planner | [ ] | [ ] | [ ] | [ ] | [ ] |
| Choose Product link to Planner | [ ] | [ ] | [ ] | [ ] | [ ] |
| Bare guest creates a fresh UUID draft | [ ] | [ ] | [ ] | [ ] | [ ] |
| Guest ID resumes the correct draft | [ ] | [ ] | [ ] | [ ] | [ ] |
| Member canvas opens owned plan | [ ] | [ ] | [ ] | [ ] | [ ] |
| Unauthorized member plan is rejected | [ ] | [ ] | [ ] | [ ] | [ ] |
| Draw exact room | [ ] | [ ] | [ ] | [ ] | [ ] |
| Add measured openings | [ ] | [ ] | [ ] | [ ] | [ ] |
| Import Planner JSON | [ ] | [ ] | [ ] | [ ] | [ ] |
| Import and calibrate underlay | [ ] | [ ] | [ ] | [ ] | [ ] |
| Sketch-to-Plan preview and accept | [ ] | [ ] | [ ] | [ ] | [ ] |
| Place and configure furniture | [ ] | [ ] | [ ] | [ ] | [ ] |
| Align, distribute, and array | [ ] | [ ] | [ ] | [ ] | [ ] |
| Switch 2D and 3D | [ ] | [ ] | [ ] | [ ] | [ ] |
| Review validation | [ ] | [ ] | [ ] | [ ] | [ ] |
| Download JSON, SVG, PNG, PDF, DXF, and GLB | [ ] | [ ] | [ ] | [ ] | [ ] |
| Download JSON, CSV, and branded PDF BOQ | [ ] | [ ] | [ ] | [ ] | [ ] |
| Send quote to Oando | [ ] | [ ] | [ ] | [ ] | [ ] |
| AI suggestion and provider failure | [ ] | [ ] | [ ] | [ ] | [ ] |
| Offline save and recovery | [ ] | [ ] | [ ] | [ ] | [ ] |

Required viewport baselines:

- Desktop: 1440 by 900.
- Compact desktop: 1024 by 768.
- Mobile portrait: 390 by 844.
- Mobile landscape: 844 by 390.

### P17. Final gates and documentation

- [ ] Run focused unit tests after each implementation slice.
- [ ] Run focused integration tests after each boundary change.
- [ ] Run Planner Playwright journeys after each UI slice.
- [ ] Run `pnpm --filter oando-site typecheck`.
- [ ] Run `pnpm --filter oando-site lint`.
- [ ] Run `pnpm --filter oando-site lint:ui:strict`.
- [ ] Run `pnpm --filter oando-site test:planner-catalog`.
- [ ] Run `pnpm --filter oando-site test:e2e:planner-world`.
- [ ] Run `pnpm --filter oando-site gate:planner`.
- [ ] Run `pnpm run check:layout`.
- [ ] Run the relevant security and accessibility checks.
- [ ] Run a production build before release acceptance.
- [ ] Verify the production-like server, not only Next development mode.
- [ ] Update `plan/Planner/FEATURES.md` from verified code.
- [ ] Move stable product and architecture facts into `docs/`.
- [ ] Keep only real unresolved blockers in `Failures.md`.
- [ ] Remove stale Planner plans after all acceptance gates pass.

## Required test coverage

Unit coverage:

- UUID validation and project-key scoping.
- Document invariants and migrations.
- Unit and scale conversion.
- Wall joins and openings.
- Snapping and numeric entry.
- Dimension calculations.
- Import validation and sanitization.
- Sketch response validation.
- Placement transforms.
- 2D and 3D mapping.
- Rotation-aware validation.
- BOQ determinism.
- Handoff idempotency.
- Export preflight and file structure.
- Save-state transitions.

Integration coverage:

- Guest create and resume.
- Guest-to-member claim.
- JSON round trip.
- Underlay persistence.
- Sketch-to-Plan request, preview, accept, and undo.
- Catalog placement through BOQ.
- 2D to 3D rebuild.
- BOQ to Oando handoff.
- CSRF, auth, rate limit, and provider failure.
- Offline queue and conflict handling.

Browser coverage:

- The complete acceptance matrix in P16.
- Console errors.
- Failed network requests.
- Accessibility violations.
- Download filenames and contents.
- Focus order and restoration.
- Reload and recovery.
- Visual hierarchy at every baseline viewport.

## Release blockers

The Planner cannot ship while any condition below is true:

- A bare guest route can load another guest draft.
- Sketch-to-Plan is absent or guest-inaccessible.
- Room dimensions are not exact and persistent.
- Visible exports do not work.
- BOQ content is incomplete or commercially misleading.
- Quote submission does not reach Oando.
- Runtime writes generated files into source directories.
- Validation says ready while known blocking errors exist.
- 2D and 3D lose object parity.
- The full journey fails keyboard or WCAG 2.2 AA acceptance.
- Mobile remains a wrapped desktop layout.
- Browser tests hang without a diagnosed cause.
- Tests, typecheck, lint, layout, build, or Planner browser gates fail.

## Completion rule

This plan is complete only when every applicable checkbox is verified.

Completion requires one fresh end-to-end customer journey:

1. Enter Planner.
2. Create or import a measured room.
3. Use Sketch-to-Plan successfully or verify its recoverable failure path.
4. Place and configure real inventory.
5. Review validation.
6. Inspect equivalent 2D and 3D output.
7. Generate the branded BOQ.
8. Send it to Oando.
9. Reload the exact saved revision.
10. Repeat the core outcome on mobile and keyboard.

After completion:

- Move stable facts to `docs/`.
- Keep verified code paths in `plan/Planner/FEATURES.md`.
- Keep unresolved external blockers in `Failures.md`.
- Remove this execution plan only after its authority has moved to final documentation.
