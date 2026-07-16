# Codebase Exploration Report: TopBar & Brand Layout Refinement

**Explorer Metadata:**
- Working directory: `.agents/teamwork_preview_explorer_layout_1`
- Original parent: `2f9d91c6-26b5-47f5-a463-190caffb408a`

---

## 1. TopBar & Logo Locations
- **Top Bar component**: `site/features/planner/editor/TopBar.tsx`
- **Logo component**: `site/components/ui/Logo.tsx`
- **Styles**: `site/features/planner/editor/workspace.module.css`

---

## 2. Restoring OneAndOnlyLogo
To restore `OneAndOnlyLogo` next to the project title, the following modifications are recommended:

### Code Change in `TopBar.tsx`
1. Import the logo component:
   ```typescript
   import { OneAndOnlyLogo } from "@/components/ui/Logo";
   ```
2. Insert `<OneAndOnlyLogo className={styles.brandLogo} />` in the brand layout block:
   ```tsx
   <div className={styles.brand}>
     <OneAndOnlyLogo className={styles.brandLogo} />
     {isEditingName ? (
       <input ... />
     ) : (
       <h1 className={styles.brandTitle} ...>{projectName}</h1>
     )}
   </div>
   ```

### Code Change in `workspace.module.css`
Style the `.brandLogo` class to size the logo gracefully depending on top bar density and prevent shrink/stretch behavior:
```css
.brandLogo {
  height: 1.25rem;
  width: auto;
  flex-shrink: 0;
}

.header[data-density="touch"] .brandLogo {
  height: 1.5rem;
}
```

---

## 3. Responsive Layout Analysis (< 48rem)
Under viewports less than `48rem`, the layout behavior consists of:
- **3-Row Stacked Grid Layout**: The header grid switches to:
  ```css
  grid-template-areas:
    "brand"
    "center"
    "actions";
  ```
- **Hiding Non-Essential Controls**: Grid, Snap, and Handoff ("Send to Oando") buttons are completely hidden on mobile/tablet viewports via the `.desktopOnly { display: none !important; }` class.
- **Horizontal Scroll Containers**: Instead of vertical wrapping (which would shatter the header box), `.center` and `.actions` use `flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;` to allow horizontal scrolling while hiding visual scrollbars.

---

## 4. Recommendations to Prevent Layout Shattering or Overflow
To guarantee the layout never shatters and remains fully functional on mobile/tablet:
1. **Move Grid, Snap, and Handoff Toggles to Popover**:
   Instead of hiding them entirely, move Grid, Snap, and Handoff buttons into the existing `Prefs` dropdown menu when rendered under small viewports.
   This can be done using a `.mobileOnly` class:
   ```css
   .mobileOnly {
     display: none;
   }
   @media (max-width: 48rem) {
     .mobileOnly {
       display: flex;
     }
   }
   ```
2. **Prevent Logo Shrinkage**:
   Apply `flex-shrink: 0` on the brand logo image container to keep it crisp next to the project title.
3. **Limit Project Title Width**:
   Ensure `.brandTitle` uses the existing `text-overflow: ellipsis` truncation rules on narrow screens to fit next to the logo.
