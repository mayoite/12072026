# Phase 04 — Admin Portal SVG Editor

Date: 2026-07-04
Status: Planned

## Objective
Surface a Puck visual editor at `/admin/svg-editor` (list + new) and `/admin/svg-editor/[id]` (edit existing), wired through middleware (`withAuth`) and Zod-validated persistence at `site/block-descriptors/{slug}.{n}.json`, with a save action that shells out to Phase 03's `scripts/generate-svg.mjs` and uploads PNG thumbs via R2.

## Inputs to read
- `D:\new\plannnerplan\IMPLEMENTATION-DECISIONS.md` — `/admin/svg-editor` row (member-gated via `withAuth`), Ark UI + Puck assignment
- `D:\new\plannnerplan\QUALITY-GATES.md` — auth matrix test gate (Phase 04 deferral to Phase 07)
- `D:\new\plannnerplan\FAILURESPLAN.md` — PLAN-FAIL-0403 ownership; PLAN-FAIL-0407 PNG path ownership
- `D:\new\PACKAGES.md` — admin panel set rationale
- `D:\new\plannnerplan\phases\02-catalog-source-of-truth-and-blockdescriptor.md` — schema & error taxonomy consumed
- `D:\new\plannnerplan\phases\03-svg-pipeline-implementation.md` — pipeline invocation contract

## Scope
In scope: routes `/admin/svg-editor` and `/admin/svg-editor/[id]`, integration into existing `AdminShell.tsx` + `features/planner/admin/adminNav.ts` under the "Catalog Assets" group label, `puckBlockRegistry.ts`, `POST /api/admin/svg-editor`, atomic write to `site/block-descriptors/{slug}.{n}.json` with rotation, shell-out to Phase 03, R2 PNG upload, Ark UI primitives wrapped as Puck blocks, `react-aria-components` gap-fills, 422 error mapping.

Out of scope: Supabase persistence (Phase 08), the AI-driven `@vercel-labs/json-render` activation (Tier-3 reserved), planner consumer changes (Phase 06), portal preview route (Phase 05), Mantine chrome.

## Architecture
```mermaid
flowchart TB
    A[Operator opens /admin/svg-editor] --> B[withAuth middleware admin role]
    B -->|deny 401| C[Login]
    B -->|allow| D[Puck editor mounts puckBlockRegistry]
    D --> E{Drag drop Ark UI combobox / dialog / number input}
    E --> F[Save click]
    F --> G[POST /api/admin/svg-editor]
    G --> H[Zod BlockDescriptor.parse]
    H -->|invalid| I[Open3dDescriptorError.invalid → 422 with field path]
    H -->|valid| J[Atomic rename site/block-descriptors/{slug}.{n}.json]
    J --> K[scripts/generate-svg.mjs runPipeline]
    K --> L[catalog_snapshot_upload_r2.ts → <bucket per IMPLEMENTATION-DECISIONS.md>/{slug}.png]
    L --> M[Descriptor + thumb URL returned]
```

Editor mounts a single `<Puck>` instance per admin route; portal mounts `<Puck.Render>` (Phase 05). Ark UI primitives (combobox, dialog, number input, color picker) wrap into Puck blocks via `puckBlockRegistry.ts`; `react-aria-components` fills date picker + virtualized listbox gaps Phase 02 fixture already exercises.

## Checklist
### Routes (04-ADMIN)
- 04-ADMIN-01 Route `site/app/admin/svg-editor/page.tsx` — list view of registered descriptors + "new block" CTA; gated by `withAuth(['admin'])`.
- 04-ADMIN-02 Route `site/app/admin/svg-editor/[id]/page.tsx` — edit existing; loads by slug from `svgBlockDescriptorLoader`.
- 04-ADMIN-03 Layout integration: register in `features/admin/ui/AdminShell.tsx` + `features/planner/admin/adminNav.ts` under group label "Catalog Assets" (alphabetical order with existing groups).
- 04-ADMIN-04 Route contract: append both paths to `site/config/route-contract.json` (read by Playwright smoke tests in Phase 06).
- 04-ADMIN-05 `puckBlockRegistry.ts` declares each block descriptor as a Puck block: a Zod schema + an Ark UI primitive `Component` + an Ark UI `fields` schema.
- 04-ADMIN-06 Save action `POST /api/admin/svg-editor` accepts JSON, parses via Zod, atomic-rename writes to `site/block-descriptors/{slug}.{n}.json`.
- 04-ADMIN-07 On save, API shells-out to `scripts/generate-svg.mjs` via `node:child_process.execFile` (idempotent); output captured to standard streams; non-zero exit → 500 with stderr captured.
- 04-ADMIN-08 On save success, dispatch to `catalog_snapshot_upload_r2.ts` for PNG thumb; CDN URL appended to descriptor response.
- 04-ADMIN-09 Error taxonomy: `Open3dDescriptorError.invalid → 422` with `{ code, fieldPath, message }` shape; mapper unit-tested (re-uses Phase 02 mapping).
- 04-ADMIN-10 Ark UI primitives wrapped as Puck blocks: combobox, dialog, number input, color picker.
- 04-ADMIN-11 `react-aria-components` gap-fills: date picker, virtualized listbox (Ark UI lacks these at parity).
- 04-ADMIN-12 Auth-bypass lint guard: linter rejects any newly added Puck block under `/planner/*` that bypasses admin auth.

### Tests (04-TEST)
- 04-TEST-01 Auth gate: unauthorized `POST /api/admin/svg-editor` returns 401; `planner-session` role returns 403.
- 04-TEST-02 Zod schema rejects missing required fields with explicit field-path errors (no silent acceptance).
- 04-TEST-03 Atomic rename test: write `{n+1}`, rename to current; concurrent write fails idempotently without partial-state exposure.
- 04-TEST-04 R2 upload idempotency: re-save yields same CDN URL (content addressing).
- 04-TEST-05 Puck block registry: each block exposes a Zod schema, a component, and a fields object — reflection check enforces completeness.
- 04-TEST-06 Forbidden-action lint guard: rule denies `puckBlock` import under `/planner/*` paths without `withAuth` parent.

### Subsystems (04-SUB)
- 04-SUB-01 `Open3dDescriptorError` mapper accepts `Result<descriptor, error>` typed input from Phase 02.
- 04-SUB-02 Spawn wrapper enforces timeout (10 s) and max-buffer (1 MB stderr) — never hangs.
- 04-SUB-03 Server-side only: `/api/admin/svg-editor` is a Next route handler, never called from client bundle.

## Exit gate
- `/admin/svg-editor` serves list view to `admin` role (Playwright mock auth); denied roles get redirected.
- `/admin/svg-editor/[id]` loads an existing descriptor (Phase 03 fixture) and surfaces all fields without `any` cast.
- Save → JSON persisted, SVG generated, PNG uploaded; CDN URL round-tripped on response.
- 422 mapping works on malformed input from each invalid field.
- Lint guard active: PR attempting a `/planner/*` Puck block without auth fails CI.
- Status flow: `Planned → Implemented` after routes + Puck mount + atomic-rename green; `Verified in staging` after Phase 03 fixture round-trip via the API; `Promoted` after Phase 07 wires `withAuth`; `Accepted` after Phase 06 planner consumer reads the saved descriptor.

## Phase governance
### Forbidden actions
- Do NOT auto-create admin blocks from anonymous traffic — gate is `withAuth(['admin'])` only.
- Do NOT auto-rename existing blocks on slug change — create a new slug instead (avoid shadowing existing descriptors).
- Do NOT bypass Zod validation on save — even if capture is "trusted internal", still parse at the API boundary.
- Do NOT mount `<Puck>` without registering its config in `puckBlockRegistry.ts` — empty registry breaks layout fallbacks.
- Do NOT activate `@vercel-labs/json-render` — Tier-3 reserved until explicit user signal.

### Phase entry checklist
- Phase 02 schema and 422 mapper stable.
- Phase 03 fixture runner reusable from `node:child_process.spawn`.
- `withAuth` middleware exists (Phase 07 widens it; Phase 04 only consumes the existing admin variant).
- `catalog_snapshot_upload_r2.ts` helper verified end-to-end with a 1-byte file upload.

### Rollback criteria
- Unauthorized POST not returning 401 on first attempt → abort promotion; auth wiring must be fixed before any other sub-step.
- Atomic rename leaves a half-written file under `site/block-descriptors/` → abort; restore from git.
- Spawn wrapper hangs beyond timeout → abort spawn wrapper; replace with `execFile` and capture error early.

### Risk register
- Risk: Puck JSON config drift breaking save parity. Mitigation: snapshot tests on each block; CI snapshot diff gate.
- Risk: R2 bucket name mismatch rejecting uploads. Mitigation: explicit config check on boot; Plan-Failure 0407 tracked.
- Risk: Ark UI combobox state-machine not Gizmo-compatible. Mitigation: wrap with `react-aria-components` Combobox as fallback.

### Success metrics
- Save round-trip p95 ≤ 600 ms end-to-end (Zod + spawn + R2).
- Auth gate response time p95 ≤ 80 ms.
- Puck mount-to-interactive p95 ≤ 1.2 s on a 100-block registry.

### Dependencies
- `withAuth(['admin'])` middleware exists (Phase 07 widens but Phase 04 consumes existing variant).
- `catalog_snapshot_upload_r2.ts` helper.
- `scripts/generate-svg.mjs` from Phase 03.
- Phase 02 schema and `svgBlockDescriptorLoader`.

### Performance budgets
- Save round-trip ≤ 600 ms p95.
- Puck mount ≤ 1.2 s p95 at 100 blocks.
- API handler memory ceiling: 32 MB per invocation.

### Security considerations
- All admin routes enforce `withAuth(['admin'])`; non-admin roles get 401 or 403, never a partial render.
- Save action rejects payloads > 256 KB at the API boundary (DoS guard).
- R2 upload uses scoped credentials: a per-directory token with per IMPLEMENTATION-DECISIONS.md write-only.
- Zod schema is the only path to persistence; `any` payload cannot reach disk.

### Accessibility considerations
- Puck mount exposes keyboard focus, escape-to-cancel, roving focus arrays from Phase 02.
- Ark UI combobox and dialog expose names, roles, and states; `react-aria-components` provides the date-picker accessibility that Ark UI omits.
- Color picker wraps Ark UI `<ColorPicker>` with semantic token references; no hardcoded hex picker.

### Decision log
- 2026-07-04 — Decision: gates admin route through existing `withAuth(['admin'])` even though wider keying lands in Phase 07. Reason: do not block Phase 04 behind Phase 07; the admin role already exists. Alternatives: gate by raw user record — rejected, breaks IMPL-DEC auth model. Owner: UI agent.
- 2026-07-04 — Decision: spawn wrapper uses `execFile` (not `spawn` arg array directly) to avoid shell injection. Reason: defense-in-depth even though inputs are descriptor-driven. Alternatives: keep `spawn` with escaped args — rejected for clarity. Owner: UI agent.
- 2026-07-04 — Decision: slug change creates a new descriptor, never renames in place. Reason: descriptors are content-addressed and renames hide shadow-write semantics. Alternatives: shadow via tombstone file — rejected as complexity-leak. Owner: UI agent.
- 2026-07-04 — Decision: removed-task lint guard pattern prevents stealth admin expansions under `/planner/*`. Reason: future contributors could add a `puckBlock` to a planner route and bypass auth. Alternatives: rely on code review — rejected. Owner: UI agent.
