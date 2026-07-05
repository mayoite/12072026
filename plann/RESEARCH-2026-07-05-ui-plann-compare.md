# UI/UX vs plann comparison (2026-07-05)

Research covers 2024–2026 patterns from official product docs and help centers (Bright Data MCP returned 401; web search and primary sources used instead). Access date: **5 Jul 2026**.

---

## Executive Summary

Current leading web CAD/floor-planner UX converges on **canvas-first chrome**, **contextual side panels**, **persistent command/measurement feedback**, and **catalogue-first placement** — all already captured in `plann/START.md` §3 and the ayush brief. The biggest 2024–2026 shifts are **Figma UI3’s minimize-UI + selection-driven properties** ([Figma Help](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)), **AutoCAD Web’s bottom-docked command surface** ([Autodesk](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html.html)), and **Planner 5D’s catalogue-left + 2D/3D toggler** ([Planner 5D Help](https://support.planner5d.com/en/articles/5876855-catalogue-menu-web)). On-disk code has solid token/shell/catalog foundations but **does not yet match** PHASE-1 checklists for command dispatch, panel resizing, layers IA, emoji removal, or SVG pipeline completion.

---

## 1. Per Product: Adopt vs Reject (with citations)

### Figma UI3
| Adopt (principle) | Reject (trade dress) |
|---|---|
| Resizable/collapsible panels; Minimize UI; properties reopen on selection ([Figma Help](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)) | Bottom slim toolbar placement, floating toolbar styling, UI3 icon set, “Actions” sparkle menu ([Figma Blog](https://www.figma.com/blog/behind-our-redesign-ui3/)) |
| Assets/layers separation in left nav ([Figma Blog](https://www.figma.com/blog/our-approach-to-designing-ui3/)) | Exact panel widths, Figma terminology (“Minimize UI”, “Dev Mode”) |
| Contextual property grouping by selection type ([Config 2024 keynote](https://www.youtube.com/watch?v=n5gJgkO2Dg0)) | Pixel-fine Figma chrome (aligns with governance **REJ-05**) |

**Verdict:** START §3 Figma block is **correct and current**. Add explicit reject of bottom-toolbar dock (principle yes, composition no).

---

### AutoCAD Web (+ Dynamic Blocks grammar)
| Adopt | Reject |
|---|---|
| Bottom-docked command line for prompts/options ([Autodesk Web Help](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html.html)) | Full command-line vocabulary for customers; ribbon-emulation layout above canvas ([Autodesk features](https://www.autodesk.com/ca-en/products/autocad-web/features)) |
| Persistent command state, numeric entry, explicit commit/cancel | Desktop CUI workspace model, blue interface palette |
| Grid/snap/layer palette semantics | **Dynamic block editing UI** — Web does **not** support dynamic blocks, visibility states, or Block Editor ([Autodesk Community](https://forums.autodesk.com/t5/autocad-on-mobile-forum/dynamic-blocks-on-autocad-web/td-p/12801766)) |

**Verdict:** Adopt **command grammar** and bottom prompt surface (**REC-03**). Adopt **parametric block semantics** only in **admin/SVG pipeline** (your internal model), not as “AutoCAD Web dynamic blocks.” Reject ribbon/command-palette clone (**REJ-03**).

---

### SketchUp Web
| Adopt | Reject |
|---|---|
| Compact primary toolbar + expanded secondary toolset ([SketchUp Help](https://help.sketchup.com/en/sketchup-web/navigating-sketchup-web)) | Left vertical toolbar layout clone |
| Measurements box: type dimensions without clicking the box ([SketchUp Community](https://forums.sketchup.com/t/sketchup-free-tool-bars/76002)) | SketchUp instructor panel visual design |
| Status-bar tool tips + visible save state ([SketchUp Help](https://help.sketchup.com/en/sketchup-web/navigating-sketchup-web)) | SketchUp iconography/terminology |

**Verdict:** START §3 SketchUp block is **accurate**. Code’s left `CanvasToolRail` + status bar partially matches; missing **instructor/guidance panel** and **keyboard-first measurement commit**.

---

### Floorplanner
| Adopt | Reject |
|---|---|
| Sidebar as tool hub; selection → contextual sidebar ([Floorplanner Manual](http://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf)) | Build/Decorate/Furnish mega-tab sidebar (**REJ-01**) |
| Fast room/wall/opening/door/window flows | Exact tab chrome, minimap, 3D render marketing UI |
| 2D canvas dominant; 2D/3D toggle; drag-drop furnish | Floorplanner colour/layout trade dress |

**Verdict:** START §3 Floorplanner block is **correct**. Governance “canvas-dominant sidebar tools, avoid feature sprawl” matches 2024–2026 reality.

---

### Planner 5D
| Adopt | Reject |
|---|---|
| Catalogue-first left menu; drag/click place ([Catalogue Menu Web](https://support.planner5d.com/en/articles/5876855-catalogue-menu-web), updated Jan 2026) | AI competition/gamification chrome as shell |
| 2D/3D toggler; continuous editing across modes ([3D Mode Help](https://support.planner5d.com/en/articles/15112460-how-to-use-3d-mode)) | Smart Wizard branded onboarding clone |
| Metric/imperial; template/wizard entry paths ([planner5d.com](https://planner5d.com/use/room-planner-tool)) | Exact catalogue grid density and paywall popups |

**Verdict:** START §3 + ayush brief align. **REC-04** (catalogue-first sidebar, no fav list unless subcatalogs ship) is consistent.

---

### Sketchfab
| Adopt | Reject |
|---|---|
| Focused 3D navigation; orbit/pan/zoom; `recenterCamera` / `focusOnVisibleGeometries` ([Viewer API](https://sketchfab.com/developers/viewer/functions)) | Marketing-grid editor layout (**REJ-04**) |
| Progressive loading (`preload`, `modelLoadProgress`) ([Viewer Examples](https://sketchfab.com/developers/viewer/examples)) | Sketchfab viewer chrome, fade-out control styling |
| Selection, inspection, annotations, camera presets via API ([Sketchfab Blog](https://sketchfab.com/blogs/community/learn-to-code-with-the-sketchfab-viewer-api-part-2-controlling-the-camera/)) | Native Sketchfab annotation hotspot visuals |
| Progressive disclosure; loading/recovery states ([devfab.io](https://www.devfab.io/guide/camera/)) | |

**Verdict:** START §3 Sketchfab block is **correct**. **REC-02** (cursor search, cap ≤24) is a **catalog UX** adoption from Sketchfab’s facet/search discipline — not yet in `plann/PHASE-*.md`.

---

## 2. Compare to START §3, Governance REC/REJ, Ayush Brief

| Area | START §3 / Ayush | Governance (`benchmark-summary.md`) | 2024–2026 research | Gap |
|---|---|---|---|---|
| Figma minimize + contextual props | ✓ Adopt | REC-01 Puck panels | Confirmed UI3 default since Config 2024 | None — add explicit **reject bottom toolbar** |
| Sketchfab catalog search | Not in START | **REC-02** ≤24 cursor search | Faceted search + progressive load is standard | **Missing from PHASE-1/2** |
| Bottom command surface | Partial (tool status) | **REC-03** AutoCAD-style | AutoCAD Web docks command line bottom-left | **Under-specified in plann** |
| Catalogue-first sidebar | ✓ | **REC-04** | Planner 5D + Floorplanner both catalogue-left | Code has inventory-left ✓ |
| Anti-copy | ✓ | REJ-01–06 | Still industry norm | Aligned |
| Dynamic blocks | Adopt semantics | — | **Not on AutoCAD Web** | Clarify: internal SVG parametrics only |
| AI entry | — | REC-05 json-render deferred | Planner 5D AI as **entry**, not chrome | Correctly absent from plann |

**Ayush brief** maps 1:1 to START §3–§12. No conflicts found.

---

## 3. PHASE-1/2 vs Research Best Practices

### Missing (should add)
| Item | Best-practice source | Suggested phase |
|---|---|---|
| First-run empty state + templates + “draw room / import plan” | `design-benchmark-protocol.md` dimension; Planner 5D wizard | **PHASE-1 §6** (partial checkbox exists, needs acceptance criteria) |
| Bottom command/prompt surface (tool, modifiers, numeric input, errors) | AutoCAD Web; REC-03 | **PHASE-1 §5–6** |
| Catalog search cap ≤24 + cursor-follow ranking | REC-02 / Sketchfab | **PHASE-1 §7** |
| Instructor/dismissible tool guidance panel | SketchUp Web status + instructor | **PHASE-1 §6** |
| Selection-driven temporary properties reveal | Figma UI3 Minimize UI | **PHASE-1 §5** |
| Baseline screenshots + perf at 4 viewports | Protocol + PHASE-1 §1 | **PHASE-1 §1** (still unchecked) |
| Live regions for tool/save/validation | PHASE-2 §6 | Could start **PHASE-1** (status bar exists, not announced) |

### Extra or mis-phased
| Item | Issue |
|---|---|
| Full SVG pipeline + 3 reference blocks (PHASE-1 §8–10) | Competes with “releasable desktop workspace”; industry ships 2D shell before admin compiler |
| `react-resizable-panels` in START §5 | Open3D uses custom `useDockingSystem`, not that package — plan/package mismatch |
| 3D view toggle in Phase 1 code | PHASE-2 owns “3D continuity”; lazy load exists but mode switch is already exposed |
| Layers in **bottom** panel | PHASE-1 says “separate catalogue and layers” — Floorplanner/Figma put layers **left**, not bottom |

### Wrong / stale assumptions
- **AutoCAD Web dynamic blocks** as customer-facing pattern — not available on web ([forum](https://forums.autodesk.com/t5/autocad-on-mobile-forum/dynamic-blocks-on-autocad-web/td-p/12801766)); keep in admin SVG model only.
- **Figma bottom toolbar** — adopt “free the top” principle via top bar + status, not bottom tool dock.

---

## 4. HANDOVER “Done” vs Code Reality

| HANDOVER claim | Code reality | Match? |
|---|---|---|
| Route containment `/planner/open3d` | Thin layout, planner CSS bundle | **Partial** — layout is thin; marketing chrome hiding not verified here |
| Semantic token foundation | `workspace.module.css` maps `--planner-*` tokens | **Yes** |
| Tool lifecycle contracts | `canvasTool.ts` defines phases; workspace uses `activeTool` string, not full state machine | **Partial** |
| Panel contracts | `workspacePreferences.ts` has `PlannerPanelId`; shell uses `left/right/bottom` not semantic IDs | **Partial** |
| Preference schema + recovery | `workspacePreferences.ts` with Zod | **Yes** |
| `PlannerCommand` defined | `plannerCommand.ts` exists; **`executePlannerCommand` not called** from workspace — mutations go through `updateProject` | **No** |
| Separate catalogue and layers | Inventory **left**; Layers **bottom** (“Output”) | **Partial** — separated but not side-by-side left dock |
| Resizable/collapsible panels | `useDockingSystem` has resize/collapse; no drag handles in CSS audit | **Partial** |
| Phosphor icons, no emoji | `CanvasToolRail` uses Phosphor; `TopBar` uses ●/✓/○; `LayersPanel` uses ◉/○ | **No** |
| React Query + Fuse catalog | `useOpen3dWorkspaceCatalog` + `catalogSearch.ts` + `InventoryPanel` | **Yes** |
| Contextual properties | `PropertiesPanel` is selection-driven | **Yes** |
| Canvas-maximize | TopBar Focus/Restore + `isCanvasMaximized` | **Yes** |
| Verified: route tests, typecheck | HANDOVER cites evidence paths; build/a11y skipped | **Honest** |

**Bottom line:** HANDOVER accurately reflects **foundation docs + shell/tokens**, but overstates **command architecture** and **CSS contract compliance** relative to live editor code.

---

## 5. Prioritized Edits to `plann/`

### P0 — Add (Phase 1, before more UI polish)
1. **PHASE-1 §4:** “Route all document mutations through `executePlannerCommand`” — make blocking; matches HANDOVER next action.
2. **PHASE-1 §5–6:** Add **bottom command surface** spec (tool name, shortcut, numeric field, validation message) — adopt REC-03 semantics, reject AutoCAD ribbon/blue chrome.
3. **PHASE-1 §7:** Add **catalog search ≤24 visible results** + cursor-follow ranking (REC-02).
4. **PHASE-1 §3:** Add explicit checklist: **replace TopBar/LayersPanel unicode status with Phosphor + tokens** (violates START §2 today).
5. **START §3 Figma:** Add reject line: **bottom-docked primary toolbar** (trade dress).

### P1 — Clarify / restructure
6. **PHASE-1 §5:** Resolve **layers IA** — pick left-docked Layers (Figma/Floorplanner) *or* document bottom panel as “floor output” only; don’t call bottom panel “layers” if it’s not the layer hierarchy.
7. **START §5 / PHASE-1 §5:** Either mandate **`react-resizable-panels` in open3d** or change package line to “custom docking with tokenized widths” — remove contradiction.
8. **START §3 AutoCAD:** Footnote that **Web lacks dynamic blocks**; parametric semantics are **One&Only admin SVG only**.
9. **PHASE-1 §6:** Add **instructor/guidance strip** (SketchUp pattern) tied to `CANVAS_TOOL_GUIDANCE`.
10. **PHASE-1 §1:** Move screenshot/perf capture to **first unchecked gate** — required by `design-benchmark-protocol.md`.

### P2 — Defer / remove
11. **Defer PHASE-1 §8–10** (full SVG pipeline + 3 reference blocks) to **late Phase 1 or early Phase 2** if desktop 2D acceptance is the gate — or split into PHASE-1B so shell isn’t blocked.
12. **Keep mobile Vaul/bottom bar in PHASE-2** — shared `MobileDrawerSheet` exists but should not expand Phase 1 scope.
13. **Do not add** Figma bottom toolbar, Floorplanner mega-tabs, Sketchfab marketing grid, or Planner 5D AI competition chrome (all covered by REJ-01–04).

### P3 — New dated benchmark note
14. Add **`plann/BENCHMARK-2026-07-05.md`** (or update via governance stale policy) capturing: UI3 minimize-on-selection, AutoCAD bottom command dock, Planner 5D Jan 2026 catalogue doc, Sketchfab preload/progress API — so PHASE checklists trace to fresh citations.

---

## Sources

- [Navigating UI3 – Figma Help](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) (2024–2026)
- [Behind Our Redesign UI3 – Figma Blog](https://www.figma.com/blog/behind-our-redesign-ui3/)
- [AutoCAD Web Command Line – Autodesk Help](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html.html)
- [AutoCAD Web Features – Autodesk](https://www.autodesk.com/ca-en/products/autocad-web/features)
- [Dynamic Blocks on AutoCAD Web – Autodesk Community](https://forums.autodesk.com/t5/autocad-on-mobile-forum/dynamic-blocks-on-autocad-web/td-p/12801766)
- [Navigating SketchUp for Web – SketchUp Help](https://help.sketchup.com/en/sketchup-web/navigating-sketchup-web)
- [Floorplanner Editor Manual (PDF)](http://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf)
- [Catalogue Menu (Web) – Planner 5D Help](https://support.planner5d.com/en/articles/5876855-catalogue-menu-web) (Jan 2026)
- [How to Use 3D Mode – Planner 5D Help](https://support.planner5d.com/en/articles/15112460-how-to-use-3d-mode)
- [Sketchfab Viewer API – Functions](https://sketchfab.com/developers/viewer/functions)
- [Sketchfab Viewer API – Examples](https://sketchfab.com/developers/viewer/examples)
- On-disk: `plann/START.md`, `PHASE-1.md`, `PHASE-2.md`, `HANDOVER.md`, `plans/2026-07-04_global-standard-revision/benchmark-summary.md`, `site/features/planner/open3d/editor/*`

[REDACTED]