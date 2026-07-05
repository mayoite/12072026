# Saved from research agent (e64bb1e8-a38a-4e05-89df-5d7c9e30d6cb)

Date: 2026-07-05

# Web Floor-Plan / CAD UI/UX Research (2024–2026)

> **Note:** Bright Data MCP returned 401; research used live web search and official docs. All URLs below are from retrieved sources.

---

## Executive Summary

Professional web planners converge on a **canvas-first shell** (60–80% viewport), **collapsible side panels**, **bottom or left tool rails**, **catalogue-first furnishing flows**, and **explicit 2D/3D mode switches** with state continuity. Power-user patterns (command line, command palette, numeric entry, snap overrides) are industry-standard to adopt; visual trade dress (Figma UI3 chrome, AutoCAD blue ribbon, Planner 5D red FAB, Sketchfab watermark layout) is not. For `/planner/open3d` → guest/canvas promotion: prioritize **principles and interaction grammar**, token-based styling, Phosphor icons, WCAG 2.2 AA with Mirror-DOM canvas accessibility, 44px mobile targets, and lazy 3D loading with explicit performance budgets.

---

## Per-Product Analysis

### 1. Figma UI3

**ADOPT (principles)**
- **Canvas-first, chrome-second:** Resizable/collapsible panels; work occupies center stage ([Figma UI3 Help](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3), [Behind the Redesign](https://www.figma.com/blog/behind-our-redesign-ui3/)).
- **Minimize UI mode:** Collapse panels while keeping tools reachable — `Shift+\` pattern for focus mode ([UI3 Guide](https://www.figma.com/blog/making-the-move-to-ui3-a-guide-to-figmas-next-chapter/)).
- **Bottom tool rail:** Moves primary tools away from top chrome; frees vertical canvas ([UI3 Help](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)).
- **Contextual properties:** Right panel reflects selection; irrelevant controls hidden ([Approach to UI3](https://www.figma.com/blog/our-approach-to-designing-ui3/)).
- **Actions / command surface:** Unified search + AI + plugins in one palette ([Actions in toolbar](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3), [AI Search blog](https://www.figma.com/blog/how-we-built-ai-search-in-figma/)).
- **Mode switch in toolbar:** Dev Mode toggle at tool level, not buried in menus ([UI3 Help](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)).
- **Fixed > floating panels for pro use:** Beta floating panels slowed power users; fixed resizable panels won ([Approach to UI3](https://www.figma.com/blog/our-approach-to-designing-ui3/)).
- **Mirror DOM for a11y:** Two-way sync between canvas selection and keyboard focus ([Figma a11y blog](https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/)).

**REJECT (trade dress)**
- Figma's specific bottom toolbar shape, pill styling, and icon set.
- "Actions" branding, AI-first positioning, spotlight/minimize choreography.
- FigJam-style floating panels as default (unstable for CAD-length sessions).
- Figma purple/neutral palette and Marcin van Damme icon style.

**Open3D mapping:** Top bar = project/save/mode; left = catalogue/layers; right = contextual properties; bottom or left = tool rail; `Shift+\` or equivalent for canvas-maximize (already in PHASE-1 §5).

---

### 2. AutoCAD Web

**ADOPT (principles)**
- **Docked command line** at bottom-left of drawing area with autocomplete and in-command options ([AutoCAD Web Command Line](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html.html)).
- **Dual input paths:** Ribbon/command palette above canvas *or* typed commands — same muscle memory as desktop ([AutoCAD Web Features](https://www.autodesk.com/ca-en/products/autocad-web/features)).
- **Grid, snap, ortho, osnap** as persistent drafting states with visible toggles ([Command list](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/AutoCAD_Web_Help_List_Commands_html.html)).
- **Numeric coordinate entry** during active commands (Enter commits).
- **Layer/properties/layers panel** separate from drawing tools.
- **Clean-screen / focus** (`CLEANSCREENON` in command set).

**REJECT (trade dress)**
- AutoCAD blue chrome, ribbon tab hierarchy, Autodesk iconography.
- Exact command-line typography and prompt styling.
- Desktop-emulation ribbon as the *only* path (web users need simpler defaults).

**Caution / gap:** AutoCAD Web has known snap/grid UX bugs when files carry desktop snap state ([Community thread](https://forums.autodesk.com/t5/autocad-on-the-web-forum/autocad-on-the-web-how-to-turn-off-grid-snap-in-web-app/td-p/11200487)). **Adopt the pattern; implement reliable snap toggles and always-exposed grid/snap state.**

**Open3D mapping:** PHASE-1 §4–§6 already targets command foundation, grid/snap, Enter/Escape/Space. Add explicit **command-line or command-palette** surface (see cross-cutting).

---

### 3. SketchUp Web

**ADOPT (principles)**
- **Left vertical main toolbar** for high-frequency tools ([Main Toolbar](https://help.sketchup.com/en/sketchup-web/sketchup-web-main-toolbar)).
- **Expanded toolset drawer** for infrequent tools — flat list, not nested flyouts ([Expanded Toolset](https://help.sketchup.com/en/sketchup-web/sketchup-web-expanded-toolbar)).
- **Recent-tools slots** at bottom of main rail — promotes learnability without permanent clutter ([Community announcement](https://forums.sketchup.com/t/introducing-an-improved-toolbar-for-sketchup-for-web/226193)).
- **Search-for-tools** at top of toolbar (`Shift+S` pattern) — command discovery ([Main Toolbar](https://help.sketchup.com/en/sketchup-web/sketchup-web-main-toolbar)).
- **User-customizable tool order** with reset to defaults.
- **Shortcut labels on hover** for learnability.
- **Responsive toolbar scaling** across breakpoints.

**REJECT (trade dress)**
- SketchUp's specific left-rail width, red/gray palette, tool icon shapes.
- Three-dot expanded-menu affordance as exact visual.
- SketchUp orbit/pan iconography.

**Open3D mapping:** Tool rail + expanded toolset + search maps well to PHASE-1 §5–§6. Consider **recent-tools strip** in Phase 2 preferences.

---

### 4. Floorplanner

**ADOPT (principles)**
- **Sidebar modes:** Build / Decorate / Furnish as task tabs, not one overloaded panel ([Editor Manual](https://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf)).
- **Catalogue-first furnishing:** Search → category → drag-drop to canvas ([Manual](https://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf)).
- **Contextual sidebar on selection:** Properties appear in same panel region when item selected.
- **Hold-modifier to disable snap** during drag (industry-standard override).
- **Wheel zoom + click-drag pan** on empty canvas.
- **Room-by-room or wall-by-wall** drawing modes with numeric commit (Enter).
- **One-click 2D/3D switch** with no re-authoring ([Personal product page](https://floorplanner.com/personal), [Embed API `api.view`](https://floorplanner.readme.io/reference/embedding-the-editor-v2)).
- **Floor switcher** in chrome, not buried in document.
- **Minimap** optional for orientation ([Manual](https://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf)).

**REJECT (trade dress)**
- Floorplanner's sidebar tab icons, color system, and marketing "simple buttons" aesthetic.
- Exact drag-drop ghost styling and material teardrop UI.
- Their embed/branding model.

**Open3D mapping:** PHASE-1 §7 catalogue + §5 separate catalogue/layers aligns. Add **task-tab or segmented mode** for Build vs Furnish if sidebar gets crowded.

---

### 5. Planner 5D

**ADOPT (principles)**
- **Persistent left catalogue** on desktop; **big add (+) entry** on mobile for catalogue ([Catalogue Web](https://support.planner5d.com/en/articles/5876855-catalogue-menu-web), [Android nav](https://support.planner5d.com/en/articles/5886016-menu-navigation-android)).
- **2D/3D toggler in top menu** — always visible, edit in both modes ([3D Mode help](https://support.planner5d.com/en/articles/15112460-how-to-use-3d-mode)).
- **Click or drag** to place catalogue items.
- **Selection affordances on canvas** (move, rotate, delete, customize) — contextual, not only in panel ([Selected Object menu](https://support.planner5d.com/en/articles/5876757-menu-of-the-selected-object-web)).
- **Bottom dimension bar** on selection for W×D×H numeric edit ([Changing Dimensions](https://support.planner5d.com/en/articles/5876845-changing-dimensions-web)).
- **Room-by-room workflow** encouraged in help copy — task-based onboarding pattern.
- **Upper-left project menu + upper-right settings** split ( wayfinding vs document prefs).

**REJECT (trade dress)**
- Planner 5D's large red **+** FAB and brand pink/red palette.
- Exact icon ring around selected objects.
- Their gamified/consumer visual tone.
- VR button prominence (unless you ship VR).

**Open3D mapping:** PHASE-2 §3 bottom command bar + catalogue drawer covers mobile. **Reject red FAB** — use Phosphor icon in token-colored bottom bar. Desktop: left catalogue panel per PHASE-1.

---

### 6. Sketchfab (3D catalog / navigation)

**ADOPT (principles)**
- **Visually light viewer chrome** — controls discoverable but not dominant ([Community blog](https://sketchfab.com/blogs/community/5-feature-easter-eggs-on-sketchfab/)).
- **Orbit vs First-Person** navigation modes with explicit switch.
- **Standard orbit/pan/zoom** + keyboard WASD in FP mode.
- **Annotation / inspector** as optional deep-dive, not default clutter.
- **Lazy embed / API control** — hide default UI via init params when embedding ([Viewer API](https://sketchfab.com/developers/viewer)).
- **Progressive disclosure** of debug views (wireframe, matcap) via keyboard, not toolbar spam.

**REJECT (trade dress)**
- Sketchfab watermark, bottom-right control cluster layout.
- Their specific viewer button shapes and dark gradient overlay.
- First-person as default (inappropriate for floor-plan editing).

**Open3D mapping:** PHASE-2 §4 3D continuity — adopt orbit/pan/zoom/fit/standard views; lazy-load; **custom chrome** with semantic tokens, not Sketchfab-like overlay.

---

## Cross-Cutting UI/UX Rules

### Canvas-first workspace layout
| Rule | Evidence |
|------|----------|
| **≥60–70% canvas width at 1440px** (PHASE-1 already says 60%) | [Vibe Coding Patterns](https://vibecodingux.lovable.app/patterns/canvas-panel), [NN/g golden ratio](https://www.nngroup.com/articles/golden-ratio-ui-design/) |
| **Left = structure/catalogue, center = canvas, right = properties** | [Contentstack Composition Editor](https://www.contentstack.com/docs/studio/composition-editor-overview), [Customer's Canvas layout](https://customerscanvas.com/dev/ui-framework/ui/editor-layout.html) |
| **Mobile: canvas 100% viewport; tools in drawers** | [Customer's Canvas](https://customerscanvas.com/dev/ui-framework/ui/editor-layout.html), [DeskFlow mobile case study](https://dev.to/rocketsquirreldev/making-a-canvas-based-web-app-mobile-friendly-deskflow-v118-2dnk) |
| **Resizable dividers + persisted ratios** | Figma UI3, PHASE-1 §5 |
| **Narrow panels: vertical stack, full-width controls** | [Canva Apps layout guidelines](https://www.canva.dev/docs/apps/design-guidelines/layout/) |

### Mobile drawer patterns
| Rule | Evidence |
|------|----------|
| **One drawer at a time** (PHASE-2 §3) | Prevents gesture/focus conflict |
| **Vaul-style bottom sheet** for catalogue/actions; **left sheet** for nav/libraries | [Vaul docs](https://www.npmjs.com/package/vaul), [Emil Kowalski drawer article](https://emilkowal.ski/ui/building-a-drawer-component) |
| **Drag-to-dismiss only when scroll-at-top** | [Vaul shouldDrag](https://emilkowal.ski/ui/building-a-drawer-component) |
| **Snap points** (peek / half / full) for catalogue vs properties | [DesignRevision drawer patterns](https://designrevision.com/components/drawer) |
| **Restore focus on close** | [Shadcn drawer a11y](https://www.shadcn.io/ui/drawer) |
| **Desktop: collapsible panels; mobile: drawer — same content** | [Responsive dialog/drawer pattern](https://nextjsshop.com/resources/blog/responsive-dialog-drawer-shadcn-ui) |

### Command palettes & command line
| Rule | Evidence |
|------|----------|
| **`Ctrl/Cmd+K` or dedicated shortcut** opens unified search: tools, commands, catalogue items, navigation | [DesignSystems.one command palette](https://www.designsystems.one/design-systems/patterns/search-and-command) |
| **Fuzzy match, recents when empty, grouped results, async loading** | Same |
| **Focus trap inside palette; Esc dismisses** | Same |
| **CAD apps: typed command + suggestions** complements palette | [AutoCAD Web command line](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html.html) |
| **SketchUp Search** as lighter-weight variant for tool discovery | [SketchUp Main Toolbar](https://help.sketchup.com/en/sketchup-web/sketchup-web-main-toolbar) |

### Catalogue-first flows
1. **Search → filter/category → preview → place** (click center or drag to canvas).
2. **Separate catalogue from layers** (PHASE-1 §5) — never merge.
3. **Recent + favorites** (PHASE-2 §5).
4. **Readiness/retry/offline states** (PHASE-1 §7).
5. **Placement payload identical** for click and drag (PHASE-1 §7).

### 2D/3D mode switch
| Rule | Evidence |
|------|----------|
| **Explicit toggle in top bar** — not implicit camera drift | [Planner 5D](https://support.planner5d.com/en/articles/15112460-how-to-use-3d-mode), [Floorplanner API](https://floorplanner.readme.io/reference/embedding-the-editor-v2) |
| **Lazy-load 3D on first activation** (PHASE-2 §4) | Performance best practice |
| **Preserve selection, floor, units, object IDs, camera intent** | PHASE-2 §4 |
| **Edit properties in both modes** where sensible | [Planner 5D tip](https://support.planner5d.com/en/articles/5876855-catalogue-menu-web) |
| **Show loading progress + fallback** on 3D activation | PHASE-2 §4 |

### Touch targets
| Standard | Size | Source |
|----------|------|--------|
| **WCAG 2.2 AA minimum** | 24×24 CSS px (with spacing exceptions) | [WCAG 2.2 SC 2.5.8](https://www.w3.org/TR/WCAG22/) |
| **Recommended mobile/planner** | **44×44 CSS px** (PHASE-2 §3) | [Apple HIG](https://developer.apple.com/design/tips/), [WCAG 2.5.5 AAA](https://www.w3.org/TR/WCAG22/) |
| **Material reference** | 48×48 dp | [Touch target analysis](https://wolfnhare.com/apple-touch-target-design-the-44-point-rule-for-comfortable-taps) |
| **Spacing between targets** | ≥8px | Apple HIG / Material |

**Planner rule:** Enforce 44×44 on mobile chrome; 24×24 minimum only for dense desktop tool rails with spacing compensation.

### Gesture precedence (mobile)
Recommended priority stack (document in PHASE-2):

```
1. System/browser chrome (safe areas, back gesture zones)
2. Active drawer drag-to-dismiss (when scroll-at-top)
3. Active tool gesture (draw, place, transform handle)
4. Object drag/rotate/resize (when hit-tested on entity)
5. Pinch-zoom (2 fingers only — disable pan when touches > 1)
6. Single-finger canvas pan (empty canvas / pan mode)
7. Long-press context (optional)
```

Evidence: [DeskFlow pinch/pan fix](https://dev.to/rocketsquirreldev/making-a-canvas-based-web-app-mobile-friendly-deskflow-v118-2dnk), [Gesture conflict resolution](https://omr.it.com/blog/gesture-conflict-resolution-multi-touch-uis/), [Gesture testing matrix](https://yrkan.com/course/module-07-mobile/gesture-testing/).

**Implementation:** `touch-action: none` on canvas; hit-test before routing; no transparent pan overlay absorbing touches on mobile (DeskFlow lesson).

### Accessibility (WCAG for canvas apps)
| Requirement | Approach |
|---------------|----------|
| **SC 2.1.1 Keyboard** | All non-path-dependent ops via keyboard; numeric entry for geometry | [W3C Understanding 2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard) |
| **SC 2.5.1 Pointer Gestures** | Single-pointer alternatives for multipoint/path gestures | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| **SC 2.5.7 Dragging** | Move buttons / numeric nudge as alternative to drag | WCAG 2.2 |
| **SC 2.5.8 Target Size** | 24px min (AA); target 44px on mobile | WCAG 2.2 |
| **SC 2.4.11 Focus Not Obscured** | Drawers/modals must not hide focused control | WCAG 2.2 |
| **Mirror DOM** | Hidden/focusable DOM synced to canvas nodes | [Figma a11y blog](https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/) |
| **Announce** tool, selection, validation, save | Live regions (PHASE-2 §6) |
| **`prefers-reduced-motion`** | Disable panel/canvas transitions | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [web.dev](https://web.dev/articles/prefers-reduced-motion) |
| **`forced-colors`** | System color keywords; don't fight high contrast | PHASE-2 §6 |

### Performance budgets (web CAD)
PHASE-2 §9 already states: **2.5s first usable 2D**, **4s 3D after activation**, **60fps target / 45fps floor**.

| Technique | Rationale | Source |
|-----------|-----------|--------|
| **Lazy-load 3D chunk** | Keep 2D initial bundle lean | PHASE-2, [cad-viewer example](https://github.com/mlightcad/cad-simple-viewer-example) |
| **Dynamic `import()` for plugins/export** | Separate chunks, no preload | [cad-simple-viewer-example](https://github.com/mlightcad/cad-simple-viewer-example) |
| **Geometry batching / instancing** | Avoid per-entity draw calls | [mlightcad batching article](https://medium.com/@mlightcad/building-a-high-performance-web-based-cad-viewer-with-batched-geometry-system-a8859bbb0a3a) |
| **Web Workers for parse** | Offload DWG/SVG parse from main thread | Same |
| **Measure beyond bundle size** | Parse/compile, TTI, frame time via User Timing API | [Nolan Lawson](https://nolanlawson.com/2021/02/23/javascript-performance-beyond-bundle-size/) |
| **Pause render when hidden/tab background** | PHASE-2 §4 | Battery/thermal |
| **Virtualize catalogue only after profiling** | PHASE-2 §5 | Avoid premature optimization |

**Suggested explicit budgets to add:**
- Initial JS for 2D route: document target (e.g. ≤500KB gzip planner shell — set after baseline capture in PHASE-1 §1).
- Long-task budget: no main-thread block >200ms during pan/zoom.
- Catalogue search: interactive ≤100ms after debounce (client-side Fuse).

---

## Gaps to Add to `plann/02-PHASE-1.md`

| Gap | Suggested addition |
|-----|-------------------|
| **Command palette / tool search** | §4 or §5: `Ctrl/Cmd+K` palette for tools, commands, catalogue jump; fuzzy match, recents, grouped results |
| **Minimize UI / canvas maximize** | §5: document shortcut (`Shift+\` equivalent) and persisted preference |
| **Snap override modifier** | §6: hold modifier temporarily disables snap during drag (Floorplanner pattern) |
| **Command-line status strip** | §6: show active command, options, typed input, and validation inline (AutoCAD pattern) |
| **Sidebar task modes** | §5 or §7: optional Build / Place / Inspect segmented control to reduce panel overload |
| **Hover shortcut hints** | §5: tool rail shows shortcut on hover/focus (SketchUp pattern) |
| **Baseline performance capture** | §1: record LCP, TTI, long tasks, frame time during pan/zoom — not just bundle size |
| **Touch-action policy** | §6: `touch-action: none` on canvas; document gesture routing |
| **Trade-dress guardrail** | §3: "Principles from benchmarks only; no competitor color, icon, or layout cloning" |
| **First-use task list** | §6: draw room → place item → 2D/3D preview (3-step, dismissible) |

---

## Gaps to Add to `plann/03-PHASE-2.md`

| Gap | Suggested addition |
|-----|-------------------|
| **Gesture precedence matrix** | §3: numbered priority table (drawer vs tool vs pinch vs pan); test cases |
| **Drawer snap points** | §3: catalogue=half-height peek, properties=full; one Vaul drawer at a time |
| **Command palette on mobile** | §3: accessible from bottom bar; same engine as desktop |
| **Recent tools strip** | §3 or preferences: last N tools from expanded set (SketchUp) |
| **Canvas selection handles spec** | §3: handle size 44px mobile; keyboard nudge alternative |
| **3D navigation mode spec** | §4: orbit default; optional walk/first-person later; standard views palette |
| **Performance measurement methodology** | §9: User Timing marks, Chrome Performance traces, frame-time percentiles |
| **Bundle budget numbers** | §9: explicit KB gzip targets after Phase 1 baseline |
| **Mirror DOM milestone** | §6: ship synchronized accessible layer tree before guest promotion |
| **Edge-swipe conflict tests** | §3 + §10 E2E: Android back gesture vs drawer (start swipe >20dp from edge) |
| **Virtual keyboard bounds** | §3: reposition bottom bar / drawer when `visualViewport` shrinks |
| **Onboarding / empty states** | §5: task-based guidance copy; empty canvas CTA (template / import / draw room) |

---

## Missing from a Typical UI Expert Brief

Add these to any external UI/UX brief:

1. **Promotion route map** — `/planner/open3d` pilot → guest → canvas with rollback boundaries (PHASE-2 §8).
2. **Token/icon constraints** — semantic CSS tokens, Phosphor only, no emoji controls.
3. **Undo scope contract** — document commands undo; UI state does not (PHASE-1 §4).
4. **Units & locale** — metric/imperial, dimension input format, keyboard decimal separator.
5. **Density modes** — compact desktop vs touch (PHASE-1 §3).
6. **Error recovery grammar** — invalid ops explain without discarding work (PHASE-1 §6).
7. **Catalogue data states** — loading/skeleton/stale/offline/empty/no-results (PHASE-1 §7).
8. **Selection contract** — single/multi, locked layers, shared property rules (PHASE-1 §7).
9. **Evidence requirements** — screenshots at 1440×900, 1024×768, 768×1024, 390×844 + axe/manual SR (PHASE-1 §1, PHASE-2 §9).
10. **Anti-copy clause** — benchmark for interaction principles, not visual identity.
11. **Print & export preview** — layout for print stylesheet (PHASE-1 §3 reduced-motion/print).
12. **Admin vs planner shell divergence** — Phase 2 admin composition UI is separate product surface.
13. **WebGL loss / reduced quality** — degraded mode UX copy and recovery (PHASE-2 §4).
14. **Keyboard-first acceptance** — complete desktop workflow without pointer (PHASE-1 §11).

---

## Sources

- [Figma UI3 — Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) (2024)
- [Figma — Behind Our Redesign UI3](https://www.figma.com/blog/behind-our-redesign-ui3/) (2024)
- [Figma — Our Approach to Designing UI3](https://www.figma.com/blog/our-approach-to-designing-ui3/) (2024)
- [Figma — Making the Move to UI3](https://www.figma.com/blog/making-the-move-to-ui3-a-guide-to-figmas-next-chapter/) (2024)
- [Figma — Building Accessibility Into a Canvas-Based Product](https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/) (2024–2025)
- [Figma — How We Built AI Search](https://www.figma.com/blog/how-we-built-ai-search-in-figma/) (2024)
- [AutoCAD Web — Command Line](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html.html)
- [AutoCAD Web — Features](https://www.autodesk.com/ca-en/products/autocad-web/features)
- [AutoCAD Web — Commands List](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/AutoCAD_Web_Help_List_Commands_html.html)
- [Autodesk Community — Grid/Snap Web Issues](https://forums.autodesk.com/t5/autocad-on-the-web-forum/autocad-on-the-web-how-to-turn-off-grid-snap-in-web-app/td-p/11200487)
- [SketchUp — Main Toolbar](https://help.sketchup.com/en/sketchup-web/sketchup-web-main-toolbar) (2026)
- [SketchUp — Expanded Toolset](https://help.sketchup.com/en/sketchup-web/sketchup-web-expanded-toolbar) (2026)
- [SketchUp Community — Improved Toolbar](https://forums.sketchup.com/t/introducing-an-improved-toolbar-for-sketchup-for-web/226193) (2024)
- [Floorplanner — Editor Manual PDF](https://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf)
- [Floorplanner — Personal Product](https://floorplanner.com/personal)
- [Floorplanner — Embed API](https://floorplanner.readme.io/reference/embedding-the-editor-v2)
- [Planner 5D — Catalogue Menu Web](https://support.planner5d.com/en/articles/5876855-catalogue-menu-web)
- [Planner 5D — Menu Navigation Web](https://support.planner5d.com/en/articles/5876772-menu-navigation-web)
- [Planner 5D — 3D Mode](https://support.planner5d.com/en/articles/15112460-how-to-use-3d-mode)
- [Planner 5D — Selected Object Menu](https://support.planner5d.com/en/articles/5876757-menu-of-the-selected-object-web)
- [Planner 5D — Changing Dimensions](https://support.planner5d.com/en/articles/5876845-changing-dimensions-web)
- [Sketchfab — Viewer Easter Eggs / Navigation](https://sketchfab.com/blogs/community/5-feature-easter-eggs-on-sketchfab/)
- [Sketchfab — Viewer API](https://sketchfab.com/developers/viewer)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C — Understanding SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard)
- [DesignSystems.one — Command Palette Pattern](https://www.designsystems.one/design-systems/patterns/search-and-command)
- [Apple — UI Design Tips (44pt targets)](https://developer.apple.com/design/tips/)
- [Emil Kowalski — Building a Drawer (Vaul)](https://emilkowal.ski/ui/building-a-drawer-component) (2024)
- [Vaul npm](https://www.npmjs.com/package/vaul) (Dec 2024)
- [DeskFlow — Canvas Mobile Friendly](https://dev.to/rocketsquirreldev/making-a-canvas-based-web-app-mobile-friendly-deskflow-v118-2dnk)
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [web.dev — prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [mlightcad — Web CAD Batching](https://medium.com/@mlightcad/building-a-high-performance-web-based-cad-viewer-with-batched-geometry-system-a8859bbb0a3a)
- [Nolan Lawson — JS Performance Beyond Bundle Size](https://nolanlawson.com/2021/02/23/javascript-performance-beyond-bundle-size/)
- [Canva Apps — Layout Guidelines](https://www.canva.dev/docs/apps/design-guidelines/layout/)
- [Customer's Canvas — Editor Layout](https://customerscanvas.com/dev/ui-framework/ui/editor-layout.html)
- [Vibe Coding Patterns — Canvas Panel](https://vibecodingux.lovable.app/patterns/canvas-panel)

[REDACTED]