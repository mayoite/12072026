# Layout overflow (look & feel — not a Plans gate)

Ordinary professional tool chrome: each region **one** scrollport; shell clips to viewport.

| Surface | Scroll owner | File |
|---------|--------------|------|
| Library results | `.itemGrid` only | `inventory.module.css` |
| Properties body | `.content` only | `properties.module.css` |
| Layers list | `.layersPanelList` | `layers-panel.module.css` |
| Tool rail | `.rail` if tools overflow height | `canvas-tool-rail.module.css` |
| Side panel shell | clip (`overflow: hidden`) | `workspace.module.css` `.panelContent` |
| Canvas | stage host, no page blowout | fabric stage + shell canvas area |

PNGs / raw runs stay under `results/` (gitignored). Important gate notes under `agents-work/world-standard-wave/`.
