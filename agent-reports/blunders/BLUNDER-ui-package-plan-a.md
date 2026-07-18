# Blunder report — UI package plan A

**Agent:** ui-package-plan-a (explore)  
**Date:** 2026-07-18  
**Mode:** plan only  
**Not PASS proof.**

## Blunder diagnosed

Treating Dockview/Aria/Phosphor polish as the main track. Dock chrome is **good enough**; factory is not.

## Approved plan summary (parent)

### Freeze chrome rebuild

Surgery only if it blocks C3 click path.

### Phases

| Phase | When | What |
|-------|------|------|
| U0 | Before C3 | Unblock publish journey only |
| U1 | After C3 / with C4 | Identity single-entry; success shows slug/SKU |
| U2 | After C4 only | Legend, fake toggle, tabIndex, hex tokens |
| U3 | Never here | Site polish, shared StudioDock package, theme thrash |

### Package rules

- Dockview: AdminSvgDockHost + Planner dock only  
- Aria: real chrome controls; no fake toggles  
- Phosphor: real actions, not decorative legends  
- Excalidraw: freehand stage only  
- Fabric: Planner only  
- Maker: geometry only  

### CSS

- `locked/chrome` = docks/rails  
- `locked/svg` = paint  
- Do not “fix” Admin via planner-shell  

### Top backlog (UI only)

1. Publish CTA usable (U0)  
2. Identity Details read-only (U1)  
3. Kill fake toggle + legend (U2)  
4. Preview tabIndex (U2)  
5. Tokenize hex (U2)  

**One line:** UI packages frozen; factory evidence is C3 then C4 browsers.
