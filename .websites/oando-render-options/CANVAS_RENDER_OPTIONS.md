# Canvas / render options (for our planner)

**Goal:** Understand ways to draw the floor plan / room when “canvas won’t render.”  
**Context (our repo):**  
- **2D live:** `FeasibilityCanvas` → `canvas.getContext("2d")`  
- **3D live:** `Planner3DViewer` → `@react-three/fiber` + Three.js / WebGL (with probe + fallback UI)  
- **Fabric:** package + archive; not default 2D engine yet  

This is **options analysis**, not a mandate to copy competitors.

---

## 1. First: which “canvas” is failing?

| Layer | API | Where | Typical failure |
|-------|-----|--------|-----------------|
| **A. 2D plan canvas** | Canvas **2D** | `FeasibilityCanvas` | `getContext("2d")` null; blank after draw; size 0; no redraw |
| **B. 3D viewer canvas** | **WebGL** / WebGL2 | `Planner3DViewer` R3F `<Canvas>` | WebGL blocked; context lost; GPU black list; SSR |
| **C. Overlay / hybrid** | 2D + 3D | Split mode | One works, other black; dual context limits |

Fix path depends on A vs B. Options below cover both.

---

## 2. Rendering technology options (pick by job)

### Option 1 — Canvas 2D (what FeasibilityCanvas uses)

**How:** `<canvas>` + `getContext("2d")` + manual draw (paths, fill, images).  

| Pros | Cons |
|------|------|
| Simple, wide support | No real 3D |
| Good for floor plans, walls, dimensions | You own hit-test, pan/zoom, selection |
| Predictable pixel control | Large scenes = manual perf work |

**When to use:** Primary **2D editor** (Planner5D-style structure mode).  
**Our status:** Live path. If this fails → browser/context/DOM size bug, not “need WebGL.”

**Packages (optional later):** none required; or Konva / Fabric for objects (we have Fabric parked).

---

### Option 2 — SVG DOM

**How:** React/SVG elements; transforms as attributes.  

| Pros | Cons |
|------|------|
| Crisp zoom; easy CSS | Heavy DOM for 1000s of nodes |
| Good a11y / select | Weak for photoreal 3D |

**When:** Printable plans, annotation, export PDF/SVG.  
**Not a full substitute** for interactive WebGL 3D.

---

### Option 3 — WebGL via Three.js (what Planner3DViewer uses)

**How:** WebGL context → Three.js scene graph (meshes, lights, camera). R3F wraps it in React.  

| Pros | Cons |
|------|------|
| Real 3D rooms, GLB furniture | Needs working GPU/WebGL |
| Same family as industry (P5D hires for Three.js) | Context loss, mobile limits |
| GLTF loaders, shadows | Heavier bundle |

**When:** **3D decorate / walkthrough** mode.  
**Our status:** Live. If WebGL probe fails → show 2D-only (already partially designed).

**Packages:** `three`, `@react-three/fiber`, `@react-three/drei` (already in stack).

---

### Option 4 — WebGL raw / Babylon / PlayCanvas

Same idea as Three, different engine.  

| Engine | Note |
|--------|------|
| **Three.js** | Our current; industry default for web planners |
| **Babylon.js** | Heavier, strong tooling |
| **PlayCanvas** | Editor-centric |

**Recommendation:** Stay on Three/R3F unless WebGL works and Three itself is the problem (rare).

---

### Option 5 — Hybrid 2D + 3D (recommended product model)

Matches competitors and our hybrid architecture:

```
2D mode  → Canvas 2D or SVG (structure, measure)
3D mode  → WebGL Three (volume, furniture, camera)
Split    → both; share document model, not the same GL context for everything
```

| Pros | Cons |
|------|------|
| Edit without WebGL | Two renderers to maintain |
| 3D when available | Sync transform/selection carefully |

**Planner 5D pattern (inspiration only):** 2D walls/doors → 3D furnish; camera/render on 3D.

---

### Option 6 — Offscreen / worker canvas

**How:** `OffscreenCanvas` + worker for heavy redraw.  

| Pros | Cons |
|------|------|
| Main thread freer | Harder debug; transferables |
| Better for big plans | Not a fix if context is null |

**When:** Perf only, after basic render works.

---

### Option 7 — Server / async “render” (photos, not live edit)

**How:** Server or cloud job produces PNG/4K image (P5D-style “Renders” gallery).  

| Pros | Cons |
|------|------|
| High quality offline | Not interactive canvas |
| Avoids client GPU | Cost, latency |

**When:** Marketing shots, export — not the live editor.

---

### Option 8 — `<model-viewer>` / iframe embeds

**How:** Display GLB only.  

| Pros | Cons |
|------|------|
| Easy product preview | Not a floor-plan editor |

**When:** Catalog product spin, not wall drawing.

---

## 3. Decision table

| Need | Prefer |
|------|--------|
| Draw walls, dimensions, snap | **Canvas 2D** (current) or SVG |
| Object selection / transform handles | Canvas 2D + hit graph, or **Fabric/Konva** |
| Room in perspective + GLB | **Three / R3F WebGL** (current) |
| User has no WebGL | **2D only** + clear message (already in viewer) |
| Photoreal stills | **Async server render** later |
| Match “runnable like P5D” | Hybrid 2D Canvas + 3D Three |

---

## 4. If “unable to render” — diagnostic tree

### A. 2D (`getContext("2d")` fails or blank)

1. Is `<canvas>` in DOM with **non-zero** CSS + attribute width/height?  
2. Device pixel ratio: set `canvas.width = cssW * dpr` then `scale(dpr)`.  
3. Draw after layout (`requestAnimationFrame` / ResizeObserver) — FeasibilityCanvas already uses rAF in places.  
4. Multiple contexts / re-mount destroying canvas.  
5. Exception in draw loop (check console).  

**Options if 2D API itself is unusable (very rare):** SVG layer, or Fabric on a fresh canvas.

### B. 3D (WebGL unavailable / crash)

1. `probeWebGL()` already in `Planner3DViewer` — trust it.  
2. Browser: Chrome/Firefox (P5D also requires modern browsers for 3D).  
3. Hardware acceleration disabled; remote desktop; too many WebGL contexts (tab limit).  
4. Context lost: listen `webglcontextlost`, dispose R3F, recreate.  
5. Fallback UX: stay in 2D / Split without 3D pane (product already aims at this).  

**Options:** keep Three; do **not** switch engines hoping GPU appears. Fix environment or degrade.

### C. “Renders” / screenshots black

Often **preserveDrawingBuffer** / readback timing, or wrong camera/far plane — not “wrong package.”

---

## 5. Package menu (inspiration → our install)

| Role | Package | Notes |
|------|---------|--------|
| 2D engine (current) | browser Canvas 2D | Keep for plan |
| 2D object model (future) | `fabric` (we have) / `konva` | Phase when Feasibility outgrows |
| 3D engine (current) | `three` + `@react-three/fiber` + `drei` | Keep |
| Load furniture | GLTFLoader / drei `useGLTF` | Our catalog GLB |
| Optional collab later | WebSocket / Yjs | Not for basic draw |
| Competitor-adjacent (P5D hires) | Three.js, Canvas, SVG, Webpack era → we use modern bundler | Inspiration only |

**Do not** drop their minified `app.js` into our app.

---

## 6. Practical recommendation for Oando

| Priority | Action |
|----------|--------|
| P0 | Confirm fail is **2D or 3D** (screenshot + console) |
| P0 | Keep **Canvas 2D** for plan; **Three** for 3D |
| P1 | Hard **WebGL fail → 2D-only** path (no black hole) |
| P1 | Ensure canvas **resize + dpr** always before draw |
| P2 | Fabric only if FeasibilityCanvas interaction debt is worse than migration |
| P3 | Async photoreal pipeline later (separate from live canvas) |

---

## 7. How this maps to competitors (inspiration)

| Competitor pattern | Engine family | Our analogue |
|--------------------|---------------|--------------|
| P5D 2D structure | Canvas/SVG-class | FeasibilityCanvas |
| P5D 3D decorate | Three/WebGL-class | Planner3DViewer |
| P5D “3D not supported” | Browser upgrade message | WebGL probe UI |
| P5D async 4K render | Server job | Future export queue |

---

## 8. What we need from you to go deeper

Reply with one of:

1. **2D blank** (plan editor)  
2. **3D black / WebGL message**  
3. **Both**  
4. **Export/screenshot only**

Plus browser + any console error text. Then we can pick **one** option path and implement — without copying anyone’s code.
