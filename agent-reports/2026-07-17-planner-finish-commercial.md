# Planner commercial loop (Agent B) — 2026-07-17

## Done (code + unit)

| Item | Change |
|---|---|
| PF-13 | Extended `ReviewQuotePanel.test.tsx`: send gate, guest block, demo confirm, error/empty BOQ disable, quote/PDF actions |
| PF-26 | Live path already wired; unit-proved `exportBoqOnly` → `exportBoqToPdf` + furniture PDF rows |
| PF-11 / P8 | `furnitureRoomBoundary.ts`, `furnitureClearance.ts`; `runFloorValidation` runs overlap + outside-room + 900 mm aisle |
| PF-23 | `furnitureBoqBridge` + project BOQ: non-workstation lines → quote cart / PDF / handoff (unit) |
| PF-20 | Confirmed TopBar sole live save authority (`plannerSaveStatusLabel`) |
| PF-21 | `closePlannerDockPanel` on deselect; `PropertiesPanel` returns null when empty (no underlay) |
| Handoff | No security regression intended; CSRF/member/demo confirm left intact |

## OPEN (honest)

- Browser CRM handoff proof
- Chromium branded PDF download
- Scene GLB export
- `compliance.ts` still not fabric-live (legacy stub with pointer)
- Dual workstation-only BOQ export remains as specialty

## Verify (run from repo root)

```
pnpm --filter oando-site exec vitest run tests/unit/features/planner/editor/ReviewQuotePanel.test.tsx tests/unit/features/planner/shared/export tests/unit/features/planner/lib/validation tests/unit/app/api/planner/handoff
pnpm run typecheck
pnpm run lint
pnpm run check:layout
```

**Parent re-verify (same session as this note):**  
`vitest` focused commercial set → **22 files / 68 tests PASS**, exit 0.  

Lint/typecheck/layout not re-run in this note. Browser CRM / PDF download still OPEN. Not ship-ready.

## Key paths

- `site/features/planner/lib/validation/runValidation.ts`
- `site/features/planner/lib/validation/furnitureRoomBoundary.ts`
- `site/features/planner/lib/validation/furnitureClearance.ts`
- `site/features/planner/editor/ReviewQuotePanel.tsx` (+ tests)
- `site/features/planner/shared/export/brandedPdfExport.ts` / `furnitureBoqBridge.ts`
- `site/features/planner/editor/dock/ModularPlannerShell.tsx` + `closePlannerDockPanel`
