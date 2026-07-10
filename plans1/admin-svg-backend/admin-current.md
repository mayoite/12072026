# Admin — current (locked)

## 1. Baseline & Status
- **Date:** 2026-07-05
- **Revision 1B:** NOT ACCEPTED. SVG editor is currently JSON + `Render` preview only. No full `<Puck>` mount.

## 2. Cross-Links
- **Layout:** [`../../architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md)
- **UI Contract:** [`../../architecture/ADMIN-UI-CONTRACT.md`](../../architecture/ADMIN-UI-CONTRACT.md)
- **Index:** [`../INDEX.md`](../INDEX.md)

## 3. Core Domain (On Disk)
- **Shell:** `requireAuthUser("admin")` + `CsrfBootstrap` -> `AdminLayoutShell.tsx`.
- **Nav:** CRM, Ops, Planner, Catalog, Platform, SVG Editor (`adminNav.ts`).
- **SVG Editor:** `/admin/svg-editor`. Pure JSON edit with Puck `<Render>`.
- **Portal:** `/portal/svg-catalog` (Puck `<Render>`).

## 4. Package Boundaries
- **Allowed in Client:** `@puckeditor/core` (Registry/Render only), `@ark-ui/react`, `react-aria-components`, `zod`, `lucide-react`.
- **Strictly Server-Only:** `dompurify`, `svgo`, `@resvg/resvg-js`, `sharp`, `@flatten-js/core` (Enforced by `svgPackageBoundaries.test.ts`).

## 5. Known Weaknesses & Gaps
- **SVG Pipeline:** Publish can succeed even if pipeline fails. Needs atomic draft/publish with visible failure states.
- **Admin Product:** Lags behind plumbing infrastructure.
