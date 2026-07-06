# benchmark-summary

Phase 0 = governance and global-standard revision. Maps to execution **Phase 00** in `00-governance/01-phase1-execution/02-plan-foundation.md`.

Date: 2026-07-04. Active benchmark reference. Advisory only; not execution authority.

Referenced by live governance: `00-governance/01-phase1-execution/09-design-benchmark-protocol.md`, `00-governance/01-phase1-execution/01-implementation-decisions.md`, `PACKAGES.md`.

Design spec: `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md`.

Full text: `archive/plans/00-global-standard-revision/benchmark.md`.

---

## Five-product model

1. **Planner 5D** — Catalogue-first. 2D↔3D continuity. AI as entry path, not chrome.
2. **Floorplanner** — Canvas-dominant. Sidebar tools. Avoid illogical feature sprawl.
3. **AutoCAD Web** — Docked command line. Workspace bundles. Palette grammar.
4. **Figma UI3** — Minimize UI. Thin sidebars. Contextual properties.
5. **Sketchfab** — Cursor search. Cap ≤24. Facets. No marketing-grid in editor.

---

## Key facts (2026-07-04 disk)

- Package map resolves per phase in `PACKAGES.md`.
- Status vocabulary is locked in I-D. No wip/todo/draft.
- Coverage: 95% target, 90% hard floor. Zero bypass.
- PNG thumbs → R2 only. Not `public/svg-catalog/`.
- Anti-copy: no donor trade dress. Semantic tokens from `site/app/css/`.

---

## Recommendations (REC-01–05)

- REC-01: Figma minimize-UI on every Puck panel (Phases 04–05).
- REC-02: Sketchfab cursor search for catalog (Phase 06, ≤24).
- REC-03: AutoCAD-style bottom command/error surface (Phases 04–06).
- REC-04: Catalogue-first sidebar (Phase 06). No branded fav list unless subcatalogs ship.
- REC-05: Keep json-render inactive until Phase 09 brief.

---

## Binding proposals (BP-01–07)

| BP | Phase | Core bind |
|----|-------|-----------|
| 01 | 01 | Pin `fabric@7.4.0`. Cross-ref `PLAN-FAIL-0401`. |
| 02 | 02 | Single schema at `svgTypes.ts`. Shared by 03/04/06. |
| 03 | 03 | Option A pipeline order locked. Version pins. |
| 04 | 04 | Puck + Ark + RAC chrome only. No Radix in admin. |
| 05 | 05 | ≤1 Puck.Render per route. Anti-copy cite. |
| 06 | 06 | `svgBlockDescriptorLoader.ts` consumer. Search parity. |
| 07 | 09 | three + r3f only. drei Tier-2 reserved. |

---

## Rejections (REJ-01–06)

No mega-tab sidebar. No donor palettes. No AutoCAD ribbon copy. No Sketchfab marketing grid in editor. No Figma pixel widths. No Mantine in Phase 04.

---

## Stale policy

Do not edit in place. Add a new dated benchmark if evidence changes.

Active planner benchmarks: `00-governance/01-phase1-execution/05-benchmark-foundation.md`, `06-benchmark-delivery.md`, `07-benchmark-governance.md`.

Cross-refs: `01-critique-summary.md`, `02-handover-summary.md`.
