# Area G - Planner Audit Remediation

**Status:** active
**Started:** 2026-06-30
**Owner:** planner UI follow-up

## Goal

Close the open planner audit findings from `docs/audit/planner/` with the smallest safe set of changes. Keep the intentional planner decisions intact: workspace `noindex`, `dynamic(..., { ssr: false })` for the workspace shell, and the existing client motion/search patterns that are already accepted.

## Source findings

- High: `PlannerWorkspace.tsx` split is already landed; keep follow-up limited to validating the extracted seams, not redoing the split.
- SEO partials: `BreadcrumbList` and `FAQPage` JSON-LD are already landed on planner marketing routes; planner-specific OG image is still generic; Lighthouse/CWV baseline has not been measured.
- Low a11y: planner catalog thumbnails now use product names for `alt`; no open thumbnail-alt fix remains.
- Low metadata guard: route tests now cover `/planner/features/`, `/planner/features/[slug]/`, and `/planner/help/`; only fallback-policy follow-up remains if needed.
- Low security hygiene: shared-device draft exposure, client feature-flag overrides, future HTML-rendering regression risk, SVG preview assumptions, and sketch upload cap mismatch remain documented risks.

## Execution order

1. Confirm the extracted planner workspace seams remain the active architecture.
2. Keep planner marketing structured data and metadata coverage locked.
3. Capture a Lighthouse baseline for `/planner/`.
4. Document the remaining low-risk security and UX hygiene items.

## Work packages

### P1. Workspace decomposition

- [x] Map the current `PlannerWorkspace.tsx` responsibilities to concrete seams: session handlers, sketch import/recovery, canvas stage, export modals, and file inputs.
- [x] Extract the session-related state and mutations into a smaller hook or adjacent module.
- [x] Extract sketch import and recovery flow logic into a dedicated module or hook.
- [x] Extract canvas-stage and export-modal wiring so the top-level component becomes orchestration only.
- [x] Preserve current route behavior, props, and storage interactions while moving code.
- [x] Add focused unit coverage for extracted seams (`PlannerWorkspace.test.tsx`, `plannerWorkspaceModules.test.ts`).
- [ ] Re-run planner E2E after the refactor to confirm no behavior drift.

Acceptance:

- [x] Workspace logic is split into smaller, testable units.
- [ ] Planner E2E stays green after the refactor.
- [x] The extracted seams have at least one direct test each.

### P2. SEO structured data

- [x] Define or reuse a JSON-LD helper for planner marketing pages so `BreadcrumbList` and `FAQPage` stay server-rendered.
- [x] Add `BreadcrumbList` JSON-LD to planner features pages and the help page.
- [x] Add `FAQPage` JSON-LD to `/planner/help/` using the existing help content.
- [ ] Decide whether `SoftwareApplication` belongs in the current metadata policy before adding it.
- [ ] Decide whether planner-specific OG art is worth the extra design/code work after the structured data lands.
- [x] Add or update metadata tests so the structured data and route metadata stay locked.

Acceptance:

- [x] Server-rendered JSON-LD is visible in page source.
- [x] Planner marketing metadata tests cover the current routes.
- [x] The help page exposes FAQ structured data without breaking the existing page copy.

### P3. Catalog accessibility

- Replace `alt=""` on catalog thumbnails with product-specific alt text or an accessible card label.
- Keep the visual layout unchanged.

Acceptance:

- [x] Screen reader users can identify catalog tiles without relying on the visual thumbnail.
- [ ] No layout regressions in the planner catalog grid.

### P4. Metadata contracts

- [x] Add route-level tests that lock titles, descriptions, canonical URLs, and social metadata for `/planner/features/`, `/planner/features/[slug]/`, and `/planner/help/`.
- Decide whether `site/app/planner/layout.tsx` should provide a safe default metadata fallback for future marketing children.

Acceptance:

- [x] New covered planner marketing routes cannot silently omit metadata.
- [x] The metadata helper path stays compile-time safe.

### P5. Measurement

- Run Lighthouse on a built `/planner/` page after the code and metadata fixes land.
- Record the command used, the build hash, and the resulting metrics in the audit docs.

Acceptance:

- A baseline exists for the planner marketing surface.
- The audit docs capture the run and the result instead of leaving the check implicit.

### P6. Security hygiene

- Document the shared-device draft-storage risk where user-facing copy is missing.
- Keep client feature flags non-authoritative; do not use them for authorization.
- Leave React text escaping and internal SVG preview assumptions in place unless a sanitizer-backed renderer is introduced.
- Resolve the sketch upload cap mismatch only if it improves UX without weakening server caps.

Acceptance:

- No auth/security boundary changes are introduced.
- Any user-facing copy or helper text reflects the real storage and upload behavior.

## Non-goals

- Do not change workspace `noindex` / robots behavior.
- Do not restore dock chrome or other intentionally removed planner controls.
- Do not add raw HTML rendering to AI chat.
- Do not widen the scope into unrelated site UI.

## Live evidence (2026-07-01)

- `site/features/planner/editor/PlannerWorkspace.tsx` is now a thin entry point over `PlannerWorkspaceContent.tsx`.
- Extracted workspace modules are present under `site/features/planner/editor/`.
- Planner marketing routes emit `BreadcrumbList` / `FAQPage` JSON-LD in `site/app/planner/(marketing)/help/page.tsx`, `features/page.tsx`, and `features/[slug]/page.tsx`.
- Route tests exist in `site/tests/unit/app/planner/(marketing)/help/page.test.tsx`, `features/page.test.tsx`, and `features/[slug]/page.test.tsx`.
- Planner catalog avatars now use product-name `alt` text in `site/features/planner/ui/CatalogPanel.tsx`.
