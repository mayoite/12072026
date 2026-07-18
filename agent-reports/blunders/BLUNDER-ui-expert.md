# Blunder report — UI/UX expert (studio chrome)

**Agent:** ui-expert (explore)  
**Date:** 2026-07-18  
**Scope:** Planner dock/rail vs Admin freehand vs parametric  
**Not PASS proof.**

## Consistency scores

| Pair | Score |
|------|------:|
| Admin freehand ↔ parametric | 7.5 |
| Admin freehand ↔ Planner | 6 |
| Admin parametric ↔ Planner | 5.5 |
| Overall triad | ~6.5 |

## Must-fix blunders

1. **Dock legend is theater** — icons never map to tabs.  
2. **Hex fallbacks in locked/chrome** — `#fff`, `#1e3a5f`, `#a30`.  
3. **Freehand Preview `tabIndex={0}`** without keyboard map.  
4. **Identity double-entry** — Form + Details both edit.  
5. **Fake Dock ToggleButton** — always selected, not a control.

## Leave alone (not blunders)

- Fabric out of Admin  
- Stage unclosable  
- Different panel names Admin vs Planner  
- stageScrollable vs canvas stage  
- Planner RAC rail quality  

## Parent take

Share **packages**, not CAD density. Fix honest controls + tokens **after** C3 if not blocking; do not redesign Planner into Admin.
