# The Master Pivot: UI Purge + Visual Editor

If we throw out the old recovery documents and look purely at what this codebase actually needs, this is the right baseline.

We shouldn't waste time wiring a robust backend to a dead JSON editor. Instead, we are going to purge the UI debt to stabilize the DOM, and then immediately mount the real visual editor (Puck) so that the backend API can be wired to the *final* product experience, not a stopgap.

## 1. The Great UI Purge (Option 1)
We will run a strict codemod to rip out the 274 instances of dead Tailwind utility classes (`flex`, `relative`, `w-full`, etc.) scattered across `site/features/planner/**/*.tsx`.
- **Why:** The recent 100dvh bug proved that the React components are hallucinating a design system that doesn't exist. We must map these components strictly to `app-shell.css` to prevent silent layout failures as we build the 3D canvas.

## 2. Mount the Puck Visual Editor (Option 3)
We will throw away the legacy JSON text box in the Admin Panel (`AdminSvgEditorEditView.tsx`).
- **Why:** We will wire the visual `<Puck>` editor directly into the admin view, using the `Zod` schemas as the source of truth. 
- The `onPublish` action will be wired so that the admin is visually composing the SVG metadata, and when they hit publish, the exact output is sent to the compiler.

## 3. The Backend Compilation Gate
With Puck mounted, we will alter `POST /api/admin/svg-editor` to compile the SVG *before* it persists to the database. If it fails, Puck will immediately show the admin a 422 error, completely eliminating the silent data corruption flaw.

## User Review Required
> [!WARNING]
> This is a heavy architectural pivot. It touches ~30 files for the CSS purge and rewires the core admin component. Are you prepared for the file churn required to establish this true baseline?

## Verification Plan
1. **Linting:** Run `npm run lint:ui:strict`. If there are any stray Tailwind classes, it must fail.
2. **E2E:** Run Playwright. The 100dvh shell must hold.
3. **Admin Test:** We will navigate to the Admin Panel and physically see the Puck visual editor instead of a JSON text box.
