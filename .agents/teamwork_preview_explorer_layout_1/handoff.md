# Codebase Exploration Report: TopBar & Brand Layout Refinement

## Observation

1. **TopBar and Brand rendering logic**:
   - Location: `site/features/planner/editor/TopBar.tsx`
   - Currently, the brand container at lines 229–254 does not render any logo. It only renders the project title or an inline text editor input:
     ```tsx
     <div className={styles.brand}>
       {isEditingName ? (
         <input
           ref={nameInputRef}
           className={styles.brandTitleInput}
           value={editName}
           onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
           onBlur={handleNameCommit}
           onKeyDown={handleNameKeyDown}
           aria-label="Project name"
           autoFocus
         />
       ) : (
         <h1
           className={styles.brandTitle}
           onClick={handleNameStartEdit}
           onKeyDown={(e: KeyboardEvent<HTMLHeadingElement>) => {
             if (e.key === "Enter" || e.key === " ") handleNameStartEdit();
           }}
           tabIndex={0}
           title="Rename project"
         >
           {projectName}
         </h1>
       )}
     </div>
     ```

2. **OneAndOnlyLogo Component**:
   - Location: `site/components/ui/Logo.tsx`
   - It exports `OneAndOnlyLogo` at lines 16–31, which wraps a Next.js `<Image>` component displaying `/logo-v2.webp` (default "orange" variant) or `/images/brand/logo-sharp-white.png` ("white" variant):
     ```typescript
     export function OneAndOnlyLogo({ className, variant = "orange" }: LogoProps) {
       return (
         <div className={cn("relative flex items-center", className)}>
           <Image
             src={ONE_AND_ONLY_LOGO_SRC[variant]}
             alt="One&Only Furniture"
             width={1024}
             height={263}
             priority
             sizes="(max-width: 768px) 9.375rem, 15rem"
             unoptimized
             className="h-full w-auto object-contain"
           />
         </div>
       );
     }
     ```

3. **Responsive behaviors on viewports < 48rem**:
   - In `site/features/planner/editor/workspace.module.css` (lines 170–214 & 1130–1365):
     - The Grid, Snap, and Handoff ("Send to Oando") buttons are completely hidden on mobile/tablet viewports via `.desktopOnly { display: none !important; }`.
     - The top bar header grid transforms from a single row 3-column layout (`grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);`) to a 3-row stacked grid layout:
       ```css
       grid-template-columns: minmax(0, 1fr);
       grid-template-rows: auto auto auto;
       grid-template-areas:
         "brand"
         "center"
         "actions";
       ```
     - Flex wrapping is prevented inside `.center` and `.actions` by setting them to `flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;` (scrollbars are hidden). This converts the rows into horizontal scroll areas, preventing layout shattering and stacking on narrow screens.
     - On extremely small screens (`width < 23.4375rem` / ~375px), `.brandTitle` max-width is reduced to `7rem`, and non-error save status labels are hidden.

---

## Logic Chain

1. **Brand Logo Restoration**:
   - To restore `OneAndOnlyLogo` next to the project title in `TopBar.tsx`, it must be imported from its path. Based on path mapping in `site/tsconfig.json` (`"@/components/*": ["./components/*"]`), the component can be imported via `import { OneAndOnlyLogo } from "@/components/ui/Logo";`.
   - The logo should be placed inside `<div className={styles.brand}>`, preceding the project title name edit block. Since `.brand` has `display: flex; align-items: center; gap: var(--space-2);` defined in `workspace.module.css` (line 235), the logo will align horizontally alongside the title automatically with a standard gap.
   - To prevent the logo from shattering layout height, we must define `.brandLogo` CSS styling in `workspace.module.css` to scale its height safely (e.g. `height: 1.25rem` for compact, `1.5rem` for touch density) and prevent squishing (`flex-shrink: 0`).

2. **Ensuring Layout Integrity (No Shatter / Overflow on Mobile/Tablet)**:
   - Hiding Grid, Snap, and Handoff buttons directly on screens `< 48rem` removes crucial planner commands for mobile/tablet users.
   - Simply forcing them to display in the `.actions` row would increase its horizontal width, which is safely handled by the row's `overflow-x: auto` scroll container, but risks creating bad UX due to excessive scrolling.
   - A robust solution is to move these secondary options into the existing "Prefs" popover menu dynamically on mobile/tablet viewports, ensuring they remain accessible without cluttering the main layout or causing vertical shattering.
   - The logo container itself must have `flex-shrink: 0` so it remains fully visible on narrow mobile screens (where `.brand` takes up 100% grid width on the top row), with the project title truncated using the existing `max-width` and `text-overflow: ellipsis` rules.

---

## Caveats

- We assumed that `OneAndOnlyLogo`'s default `"orange"` variant is appropriate for the TopBar design. If a dark theme is toggled, the `"white"` variant should be passed dynamically depending on the app's theme state.
- Hiding scrollbars completely using CSS is set in the stylesheet but can sometimes behave inconsistently on older mobile browsers; touch-scrolling momentum (`-webkit-overflow-scrolling: touch`) is correctly defined.
- Handoff, Grid, and Snap buttons are currently marked with `styles.desktopOnly`. Directly removing this class will display them on mobile, but since we suggest moving them into a popover, a new class `.mobileOnly` should be introduced to keep code clean.

---

## Conclusion

1. **Logo Restoration**:
   - Import `OneAndOnlyLogo` from `@/components/ui/Logo` into `site/features/planner/editor/TopBar.tsx`.
   - Place `<OneAndOnlyLogo className={styles.brandLogo} />` as the first child of the `.brand` div container.
   - Add `.brandLogo { height: 1.25rem; width: auto; flex-shrink: 0; }` with touch-override to `1.5rem` to `workspace.module.css` to prevent stretching.

2. **Layout Integrity & Button Consolidation**:
   - Introduce `.mobileOnly` in CSS with `display: none;` on desktop and `display: flex;` on `max-width: 48rem`.
   - Append "Toggle Grid", "Toggle Snap", and "Send to Oando" menu options into the `Prefs` dropdown menu in `TopBar.tsx`, assigning them the `mobileOnly` style class. This preserves functionality on tablet/mobile while keeping the header layout clean and shatter-proof.

---

## Verification Method

1. **Layout Integrity check**:
   - Execute `pnpm run check:layout` from the workspace root to ensure no forbidden path violations occur.
2. **Visual & Behavioral Verification**:
   - In the dev environment, launch the site using `pnpm dev`.
   - Navigate to the planner workspace. Inspect the top bar at desktop viewports to verify `OneAndOnlyLogo` renders next to the project title.
   - Shrink the viewport width using Chrome DevTools responsive emulator (to `< 768px` / `48rem`). Verify that:
     - The top bar shifts to the 3-row layout safely without layout shattering.
     - The Grid, Snap, and Handoff actions are removed from the direct header row.
     - Open the "Prefs" dropdown and verify that "Enable/Disable Grid", "Enable/Disable Snap", and "Send to Oando" are listed.
3. **Purity/Test Suite verification**:
   - Run `pnpm run check:agents-folder` to ensure agent metadata is placed in correct layout.
