# UI — CHECKLIST

Tick [UI-BAR.md](../UI-BAR.md) **and** the phase section below. `results/` is a dump. Failures → `../FAILURES.md`.

## PHASE-01 — Dimension (M) + Text (T) live
- [ ] Task 0: `pnpm view roughjs license` + `pnpm view @excalidraw/math license` → MIT each; `SCOPE.md` in results dump (Tier A only, Fabric sole host)
- [ ] MIT libs added + licenses recorded (`excalidraw-MIT.txt`, `03-dependencies-engines-current.md`); build exit 0; chunk delta in report
- [ ] `useRoomElements.ts` M/T shortcuts wired to handlers (same path as walls → `pureActions`)
- [ ] `annotationGeometry` + `roughAnnotationAdapter` unit tests pass (deterministic per id)
- [ ] Annotations paint when `layerVisibility.annotations` is on; stale groups removed before rebuild (no second canvas)
- [ ] M measures a wall (real mm); T adds a text label; both survive save/reload
- [ ] Annotation IDs survive hard reload (reload-ID proof)
- [ ] `open3d-annotations-m-t.spec.ts` green (E2E after unit Tasks 0–5)
- [ ] `toolShortcutTruth` + `canvasToolRail.a11y` (23/23); `hostWiringP01` 4/4

## PHASE-02 — Public entry + brief/room
- [ ] `/planner/` → guest CTA → setup gate → canvas, no dev flags
- [ ] Brief fields: project name, **client**, **location**, **seats**, **work mode**, **budget**, units
- [ ] Room fields: width, depth, doors, windows, **columns**, **keep-out zones**
- [ ] Start **blank** or from an **owned template** — path honest (implement or document omission)
- [ ] Brief-derived room keeps IDs after hard reload (openings, columns, constraints)
- [ ] **Millimetres** remain document authority under metric or imperial display
- [ ] Honest storage labels (guest chip + TopBar + `PlannerSessionDialog` consistent)
- [ ] One short wizard: plain defaults, inline correction, full keyboard path, visible focus
- [ ] Keyboard path through setup; room renders at 375×812 and desktop (main action visible)
- [ ] `DEV_AUTH_BYPASS` / canvas route buyer vs dev path documented
- [ ] Onboarding vitest + public-entry playwright green; `hostWiringP01` 4/4 after edits
- [ ] `open3d-world-standard-journey.spec.ts` green (walls/openings/furniture deltas)
