# Planner 5D — Inspiration Report (features / UX / tech)

**Source:** Firecrawl only (scrape, map, search).  
**Date:** 2026-07-09  
**Purpose:** Inspiration only — features, UX patterns, package/tech ideas. **Do not copy code, assets, branding, or proprietary catalogs.**  
**Raw evidence:** `D:\websites\planner5d.com\raw\`

---

## 1. Product snapshot

| Item | Observation |
|------|-------------|
| Product | Planner 5D — AI-powered 2D/3D home / room design |
| Pitch | Draw floor plan + 3D home design “in 10 minutes”; 4K renders |
| Scale claims | 120M+ users / ecosystem; 400M+ homes improved (marketing) |
| Social proof | G2/Capterra ~4.4–4.6; logos (NYT, Forbes, TechCrunch, etc.) |
| Primary CTA | “Get Started” / “Get Started For Free” → `/editor` |
| Platforms | Web, Windows, Android, iOS, macOS promos; Apple Vision Pro |

---

## 2. Features (inspiration checklist)

### Core design loop
1. **Template or blank** — start from template, scratch, or upload plan  
2. **Structural 2D** — walls, doors, windows (drag-and-drop)  
3. **Furnish** — catalog items, materials, colors  
4. **3D preview** — toggle 3D; realistic lighting/shadows  
5. **Export / share** — renders, collab, CAD (higher tiers)

### Feature inventory (from public pages)

| Area | Capability | Notes for us |
|------|------------|--------------|
| Floor plan | Draw from scratch; multi-room / multi-level | Core editor path |
| AI floor-plan recognition | Upload sketch/photo → editable plan | High-value onboarding |
| Catalog | ~7k–10k+ items; free = ~50% of catalog | Freemium gate on library |
| Renders | Standard + unlimited 4K (Pro) | Tier by quality/count |
| Walkthrough | 360° walkthrough + 360° panorama | Pro showcase |
| AI Design Generator | Auto design variants from criteria | Premium |
| Smart Wizard | Guided furniture/layout by room function/style | Onboarding UX |
| Mood boards | Collect inspiration images | Side tool, not editor-only |
| Shopping list / budget | Cost estimate; budget vs luxury widgets | Monetization + utility |
| Import 3D | Photo→model (Premium); .obj/.fbx/.blend/.stl (Pro) | Pro interoperability |
| Export CAD | Technical docs (Pro) | Pro/architect path |
| Specs & price estimator | Professional workflow tools | B2B |
| AR / VR / Vision Pro | Preview in AR/VR; Apple Vision Pro | Platform expansion |
| Collaboration | Real-time multiplayer; cursors; roles | Free tier includes shared edit |
| Business | White-label, configurator, ecommerce cart, API/CRM/ERP | Separate GTM |

### Audience segments (landing cards)
Homeowners · Interior designers · Architecture · Enterprise · Schools · Real estate · Commercial PM  

**Inspiration:** same engine, multiple use-case landings + SEO pages (`/use/*`, `/ai/*`, `/costs/*`).

---

## 3. UX patterns (inspiration only)

### Marketing → product funnel
- Hero: outcome-first (“dream home”, time claim, AI + 4K)  
- Card grid of use cases (floor plan, room, home, AI, collab, shop)  
- Social proof strip (press + reviews)  
- Feature deep-dives with AVIF/WebP visuals  
- Repeated bottom CTA: free start  
- SEO use-case pages with **3-step how-to** (template → structure → 3D)

### Editor UX signals (from `/editor` scrape)
- Projects list: My Projects, folders, rename, archive, import  
- Templates entry  
- View-only vs edit modes; “copy project to edit”  
- Render pipeline async: “Render will appear after a while in Renders”  
- Cover/thumbnail for project  
- Categories hint: `floor | ceil | indoor | outdoor`  
- Hard fail path: **“3D mode not supported”** → upgrade browser (Chrome/Firefox)

### Collaboration UX
1. Open project → Share → invite email/link  
2. Permissions: view / comment / edit  
3. Live cursors + presence  
4. Conflict resolution claimed for simultaneous object edits  
5. Guests can view without account; edit needs free account  

### Pricing UX (public)
| Plan | Price (public) | Gate highlights |
|------|----------------|-----------------|
| Free | $0 | Unlimited projects; ~50% catalog; multi-device |
| Premium | ~$4.99/mo effective ($59.99/yr or $19.99/mo) | AI generator, plan upload→3D, full catalog, standard renders, budget widget |
| Professional | ~$33.33/mo annual ($399.99/yr or $49.99/mo) | Unlimited 4K, model import formats, 360°, CAD export, branded profile |
| Enterprise | Contact | White-label, catalog, configurators, ecommerce, Vision Pro |

**Inspiration:** freemium by **catalog depth + AI + render quality**, not by project count.

---

## 4. Tech stack & packages (inspiration only — not confirmed source map)

> Inferred from Firecrawl **search** + **public assets**. Treat as **inspiration candidates**, not a reverse-engineered stack to clone.

### Observed infrastructure (public)
| Signal | Evidence |
|--------|----------|
| Marketing CDN | `static.planner5d.com/assets/...` with `?ux=2.1.1` versioning |
| User content CDN | `storage.planner5d.com/s/...` |
| Asset formats | AVIF, WebP for marketing; responsive intro images |
| Editor host | `https://planner5d.com/editor` (app shell; 3D requires modern browser) |
| Video | Vimeo embeds for product demos |
| Analytics (marketing) | Common marketing stack patterns on page |

### Hiring / industry signals (Firecrawl search — not official docs)
- Job posts mention **TypeScript** + interest in **Three.js / WebGL** for 3D graphics roles  
- Community discussions compare Planner5D-class apps with **Three.js** or **Unity WebGL**

### Package / tech inspiration list (what *we* might evaluate)

**3D / floor-plan editor**
| Package / approach | Why it inspires |
|--------------------|-----------------|
| `three` (+ controls, loaders) | Browser 2D/3D scene, GLTF/OBJ import path |
| `@react-three/fiber` + `drei` | If React app shell |
| WebGL / WebGPU | Core render path |
| `earcut` / polygon libs | Floor plan mesh from 2D walls |
| Snap/grid helpers | CAD-like wall drawing |
| GLTF / OBJ / FBX loaders | User model import (Pro-like) |

**App shell**
| Area | Inspiration |
|------|-------------|
| SPA editor route | `/editor` isolated from marketing |
| Project CRUD + cloud sync | Multi-device projects |
| Feature flags by plan | Catalog %, AI, 4K, CAD |
| Realtime collab | Presence, roles, OT/CRDT-style conflict handling |

**AI (product concepts, not their APIs)**
| Concept | Inspiration |
|---------|-------------|
| Floor-plan recognition | Upload photo/sketch → vector walls |
| Design generator | Style + room type → layout variants |
| Smart wizard | Step wizard over freeform canvas |
| Photo → 3D asset | Premium import path |

**Business / packages**
| Concept | Inspiration |
|---------|-------------|
| White-label embed | Room planner in partner site |
| Product configurator | Rules + finishes + ERP/CPQ |
| Cart/quote handoff | Design → SKU list → cart |
| API-first B2B | CRM/ERP/ecommerce connectors |

### Explicit non-goals
- Do **not** scrape or reuse their catalog meshes/textures  
- Do **not** copy UI chrome, copywriting, or brand  
- Do **not** assume Three.js is confirmed production stack without further evidence  

---

## 5. Inspiration priorities for our product

### P0 — product
1. Template + blank + upload-plan onboarding  
2. Wall/door/window 2D → instant 3D  
3. Catalog freemium gate  
4. Async render job queue + “Renders” gallery  
5. Share link with view/edit roles  

### P1 — differentiation-ready
6. AI plan recognition  
7. Guided Smart Wizard  
8. Budget / shopping list from placed items  
9. 360 walkthrough export  

### P2 — platform
10. Mobile/desktop continuity  
11. Import open 3D formats  
12. White-label / configurator B2B later  

---

## 6. Firecrawl evidence index

| File | Content |
|------|---------|
| `raw/home.md` | Homepage marketing + features |
| `raw/planner5d.com-pricing.md` | Plans |
| `raw/planner5d.com-use-floor-plan-software.md` | Floor plan use case |
| `raw/planner5d.com-use-ai-interior-design.md` | AI tools |
| `raw/planner5d.com-collaboration-tool.md` | Multiplayer |
| `raw/planner5d.com-business.md` | B2B white-label / API |
| `raw/planner5d.com-editor.md` | Editor chrome strings |
| `raw/home-tech.json` | HTML + links |
| `raw/map.json` | Site URL map (large SEO footprint) |
| `raw/search.json`, `raw/search-tech.json` | Search hits |

**Note:** Firecrawl `agent` run failed (`ECONNRESET`); report built from scrape + search only.

---

## 7. Legal / ethics line

Use this report for **ideas only**. Reimplement with original UX, original assets, and open or licensed libraries. No scraping of authenticated editor internals beyond public pages.
