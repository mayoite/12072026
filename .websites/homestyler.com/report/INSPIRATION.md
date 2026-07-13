# Homestyler — Inspiration Report (O&O)

**Source:** Local Firecrawl/raw scrapes only (`D:\websites\homestyler.com\raw\`)  
**Date:** 2026-07-09  
**Ethics:** **INSPIRATION ONLY** — study product behavior and industry patterns; rebuild in O&O’s own UI, code, assets, and brand.  
**Do not:** copy Homestyler code, shaders, icons, models, textures, marketing copy, or pixel-match chrome.

---

## 0. Scrape quality honesty (read first)

| Check | Result |
|-------|--------|
| Live product editor shell scraped? | **No** — no authenticated `3d.homestyler.com` session |
| Full keyboard shortcut table? | **No** — only a few keys named in public posts |
| Help center usable? | **No** — see below |
| Marketing pages usable? | **Partial** — real product claims + heavy login overlay noise |
| Forum tutorials usable? | **Yes (best signal)** — two official posts describe UI zones |

### What went wrong in the raw set

1. **Auth modal pollution (most pages)**  
   Nearly every Homestyler scrape begins with ~90 lines of Sign In / Sign Up / Password Reset chrome (`ipassport.homestyler.com`, Google/Facebook/Apple/VK/Telegram/Twitter). Content after that is marketing or forum body. Treat the login block as **scrape noise**, not product UX to clone.

2. **Wrong-region / dead support**  
   `support.homestyler.com-hc-en-us.md` is **not Homestyler help**. It is a **Taobao** error page (“页面无法访问” / login.taobao.com). **Zero product value.**

3. **“Help” URL is marketing**  
   `homestyler.com-help.md` is the same **homepage funnel** as root marketing (Draw → Decorate → Visualize), not a help index.

4. **Keyboard SEO article is fluff**  
   `…mastering-keyboard-shortcuts…` never lists real bindings. It is generic SEO prose + product CTAs + community gallery. **Do not treat as a shortcut reference.**

5. **No live editor DOM**  
   There is no in-app toolbar dump, no minified app analysis, no full hotkey overlay capture. Inspiration below is from **public marketing + official forum tutorials only**.

### What is real and worth using

| File | Signal quality | What is real |
|------|----------------|--------------|
| `homestyler.com-forum-view-1613229904600383490.md` | **High** | Five-zone editor description; catalog modules; view modes; camera |
| `homestyler.com-forum-view-1560174293289902081.md` | **High** | Toolbar IA, Material Brush **B**, plane **1**, Arc Array, Help→Shortcuts |
| `homestyler.com.md` / `…-floor-planner.md` / `…-interior-design-software.md` | **Medium** | Funnel claims: AI plan upload, catalog scale, templates, community |
| `search-help.json` | **Low–Med** | Search snippets only (points to forum; camera WASD note) |
| `…keyboard-shortcuts…` article | **Near-zero** for keys | Marketing only |
| `support.homestyler.com-hc-en-us.md` | **Null** | Taobao wall |
| `homestyler.com-help.md` | **Duplicate marketing** | Same as home funnel |

**Verdict:** Useful for **editor zone map, catalog structure, 2D/3D navigation concepts, a few confirmed hotkeys**. Not useful for full shortcuts, pricing deep-dive, or live canvas behavior.

---

## 1. Product snapshot (from marketing claims)

| Item | Observation (claimed, not verified in-editor) |
|------|-----------------------------------------------|
| Product | Homestyler — online 3D home / interior design (Autodesk lineage mentioned in SEO copy) |
| Core loop | **Draw → Decorate → Visualize** |
| Draw | Upload 2D floor plan / sketch → “AI” → editable 3D; or templates / sketch |
| Decorate | Drag-drop furniture; “10M+” models / branded packs (marketing number) |
| Visualize | One-click **cloud rendering** |
| Templates | “500+” style templates (Mid-Century, Modern, Minimalist, Japandi, Warm-Beige…) |
| Social | Community gallery, challenges, vote-to-win; open shared designs (`openShared?assetId=…`) |
| CTA | `3d.homestyler.com` / “Design Now for FREE”; enterprise / demo / bootcamp paths |
| Infra signals (public only) | Alibaba/Aliyun OSS CDNs (`alicdn`, `oss-accelerate.aliyuncs.com`, `*.homestyler.com`); Nuxt client asset path in CDN |

---

## 2. Editor interface (usable patterns — forum)

Official post: **“1. Introduction to design interface”** (Homestyler Official).  
They describe **five parts**:

```
┌────────────┬──────────────────────────────┬─────────────┐
│            │         TOP TOOLBAR          │ Prefs/Help  │
│   LEFT     ├──────────────────────────────┤             │
│  CATALOG   │                              │   RIGHT     │
│            │       CENTRAL CANVAS         │  PROPERTY   │
│            │                              │   PANEL     │
│            ├──────────────────────────────┤  (+ room    │
│            │      BOTTOM TOOLBAR          │   nav mini) │
└────────────┴──────────────────────────────┴─────────────┘
```

This **five-zone shell** is industry-standard CAD/interior IA (not proprietary). O&O can use the *idea* of clear zones without copying layout pixels or icons.

### 2.1 Central canvas
- Draw floor plans and decorate rooms  
- Zoom with mouse  
- **3D / walk-through:** on-screen arrow controls + **WASD** or **arrow keys**; look by **left-drag**  
- (Industry pattern; implement with our Three.js/camera stack)

### 2.2 Left catalog — five modules (named in tutorial)
| Module | Content idea |
|--------|----------------|
| **Create Room** | Templates; import floor plan as **image or CAD**; sketch walls (center or edge) or whole rooms; doors/windows; openings, beams, columns |
| **Customize** | Full-house finishes (ceiling/wall/floor/tile); “Interior Modeling” (SketchUp-like freeform); **custom furniture** (kitchen/wardrobe/shelves) |
| **Autostyler** | Apply a style template to **whole house or single room**, then tweak positions/sizes |
| **Model Library** | Trends packs; Structure / Catalog / Finish; **AI Fabric** (curtain “wind blow”, soft goods “place down”); **Brands** |
| **My Folder** | Favorites (with groups), History, Uploads, Unlocked/purchased packs |

### 2.3 Top toolbar
- **Top-left:** project name + public/private  
- **Top-middle:** common tools — operation settings, **Material Brush**, tools menu, hide/view, **export**, **render**  
- **Top-right:** Preferences (drawing prefs + **units**), **Help** (beginner guide / tutorials / help center / **Shortcut Keys** category), Inbox  
- Render: **hover to pick render type** (forum update post) without full modal first  
- Construction IA: promote structural tools (**Flip Plane**, **Check Wall closure**) to first-level under Construction  
- Clear/delete elevated for discoverability  

### 2.4 Right property panel
- **Room navigation mini-viewport:** click rooms to jump; **single-room mode** to reduce browser load  
- With selection: size, rotation, style params  
- No selection: room/wall properties  

### 2.5 Bottom toolbar
- **Floors:** add/delete floors/basement; floor switcher; show all floors vs current only  
- **Display modes:** material / wireframe / transparent  
- **Views:**  
  - **2D:** Plane, RCP (reflected ceiling), Elevation  
  - **3D:** 3D, **Roam** (walkthrough)  
- Camera height / angle; **save views** for reuse in render UI  

### 2.6 Placement power tools (forum)
- **Arc Array:** circular duplicate around center (commercial seating, etc.)  
  - Switch to plane (shortcut **1**), select model, Arc Array, pick start/end, enter angle + count  
- Lamps: arc **and linear** array; linear for general furniture “coming soon” (as of that post)  

---

## 3. 3D navigation & shortcuts (only what is *actually* stated)

| Binding / control | Source | Role |
|-------------------|--------|------|
| **W / S / A / D** | Interface tutorial + search snippet | Walk-through move |
| **Arrow keys** | Interface tutorial | Same as WASD |
| **On-screen 4 arrows** | Interface tutorial | Walk-through (mouse users) |
| **Left-drag** | Interface tutorial | Look around in 3D |
| **Mouse zoom** | Interface tutorial | Zoom canvas |
| **B** | Shortcut/update forum post | Material Brush |
| **1** | Arc Array instructions | Switch to **plane** (2D top) view |
| Help → Shortcut Keys | Forum | In-app cheat sheet (content **not** scraped) |

**Camera tutorial (search-only, not full page scraped):**  
`HS for Beginners: Adjust Camera View` — W forward, S back (snippet); full left/right keys not in our raw files.

**Not available in raw:** undo/redo, delete, copy/paste, tool switches, grid snap, layer lock keys, etc.  
SEO article claims shortcuts help with layers, catalog, 2D/3D — **no keys given**.

### O&O recommendation on shortcuts
- Ship an **in-editor Shortcuts panel** (Help or `?`) — pattern is right; **define our own table**  
- Prefer standard creative-tool conventions where they do not collide (e.g. WASD roam, number keys for views) — **do not mirror Homestyler’s full map even if later scraped**  
- Document O&O keys in our own help, not theirs  

---

## 4. Marketing / catalog / community patterns (usable concepts)

### 4.1 Onboarding funnel (homepage)
1. **Draw** — upload plan or AI-assisted 2D→3D  
2. **Decorate** — large catalog + drag-drop  
3. **Visualize** — cloud render, one click  

Style-filter template rails (Japandi, Mid-Century, …) with **open shared project** CTAs.

### 4.2 Catalog presentation
- **Model packs** by style/scene (cover + thumb grid + count “112+”)  
- Formats mentioned on product cards (MAX / SKP / RAR — **their** asset pipeline; **do not ingest their models**)  
- Brand shelves + trending packs + freemium unlock language  

### 4.3 Community growth loop
- Public design gallery / “featured”  
- Challenges (style themes, app vs web)  
- Vote contests  
- User profiles, follow  

### 4.4 Trust & GTM surface
- “20M+ designers” claim  
- Enterprise + free demo  
- Bootcamp / learning path  
- ISO claim on marketing footer  

**Inspiration only for GTM structure** (consumer free + community + enterprise), not for copying claims or challenge IP.

---

## 5. O&O translation (what to build *our* way)

Map **ideas → O&O modules**. No Homestyler assets, labels, or layout cloning.

| Homestyler signal (idea) | O&O translation | Priority note |
|--------------------------|-----------------|---------------|
| Five-zone editor shell | Keep **clear canvas + tool rail + catalog + inspector + status/view bar**; use **our** design system / Phase 2A–2B planner UI | Align with existing planner contracts |
| Draw → Decorate → Visualize | Product narrative + onboarding steps; optional checklist overlay | Marketing + empty-state UX |
| Upload plan → walls | O&O floor-plan import / AI path when scheduled; keep vector truth in our schema | Do not copy their AI UX copy |
| Left modules (structure vs catalog vs personal) | Split catalog tabs: **Structure / Furnishings / Finishes / My assets** | Own taxonomy |
| Autostyler (template apply) | “Apply room template” / style packs on **our** templates | Only licensed or original packs |
| Single-room focus mode | Performance mode: hide other rooms in 3D | High value for heavy scenes |
| Room mini-map navigation | Floor plan navigator in inspector or bottom bar | Accessibility + wayfinding |
| Display: solid / wire / x-ray | Renderer display modes in canvas toolbar | World-standard |
| 2D: plan / RCP / elevation | Plan first; RCP/elevation as later pro views | Phase appropriately |
| 3D + Roam | Orbit 3D + first-person walk (WASD) | Use three.js controls we own |
| Save camera views → render | Named cameras feed render queue | Good for BOQ/presentation later |
| Material brush (paint finishes) | Finish-apply tool with clear cursor + shortcut | Own shortcut letter |
| Wall closure check | Validation: open wall loops, non-manifold rooms | Quality gate, not a clone of their tool name |
| Arc / linear array | Duplicate along arc/line with count + spacing | Pro placement; implement geometrically ourselves |
| Help → shortcuts overlay | Built-in cheatsheet + a11y docs | Required for power users |
| Community gallery / challenges | Optional later; O&O brand and moderation | Out of core planner path |
| Freemium catalog packs | Gate **depth/quality**, not basic draw | Match our monetization plan |

### Explicit non-goals from this research
- Homestyler Autostyler name/brand  
- Their model library, brand deals, or OSS URLs  
- Pixel-matching top toolbar icon order  
- Claiming “same as Homestyler” in marketing  
- Scraping authenticated editor or paid packs  

---

## 6. Anti-copy rules (Homestyler-specific)

| Allowed | Forbidden |
|---------|-----------|
| Rebuild **zone concepts** (canvas / catalog / inspector / view bar) | Copy their **icons, spacing, chrome colors, logos** |
| Use industry controls (WASD roam, plan vs 3D) | Paste their **tutorial text, screenshots as UI mock**, or forum GIFs into product |
| Implement array / brush / multi-floor **from first principles** | Ship their **meshes, textures, brand SKUs** |
| Compete on workflow quality | Use Homestyler / Autodesk Homestyler **trademarks** as if affiliated |
| Learn from public feature lists | Reverse-engineer private APIs, cracked clients, or authenticated scrapes for code |

**Rule of thumb:** A designer should say “O&O solves the same *problem*” — never “O&O is a Homestyler skin.”

---

## 7. Gaps / next scrape if needed (optional)

Only if product owners want more evidence later:

1. Authenticated **public** help articles with full shortcut table (if any) — English locale, no Taobao redirect  
2. Camera tutorial full page (`Adjust Camera View`)  
3. Live editor: **consent-based** screenshot of empty project for zone confirmation (no asset theft)  
4. Pricing page for freemium gates (not in this raw set as a clean dedicated scrape)

Until then, treat this report as **partial but sufficient** for high-level planner IA inspiration.

---

## 8. Evidence index

| Path | Use |
|------|-----|
| `raw/homestyler.com-forum-view-1613229904600383490.md` | Editor five zones, catalog modules, views, WASD |
| `raw/homestyler.com-forum-view-1560174293289902081.md` | Shortcuts in Help, toolbar IA, B / 1, Arc Array |
| `raw/homestyler.com.md` | Marketing funnel, catalog packs, community |
| `raw/homestyler.com-floor-planner.md` | Same funnel (login noise + product claims) |
| `raw/homestyler.com-interior-design-software.md` | Same + models/challenges |
| `raw/homestyler.com-help.md` | Marketing only (misnamed) |
| `raw/homestyler.com-article-floorplanner-mastering-keyboard-shortcuts-in-interior-design-software.md` | SEO fluff; **no key table** |
| `raw/search-help.json` | Pointers to forum; camera snippet |
| `raw/support.homestyler.com-hc-en-us.md` | **Discard** — Taobao error page |

---

## 9. Bottom line

- **Scrape is mostly walls + marketing**, with **two strong official forum tutorials** as the only dense product-UI signal.  
- **Usable inspiration:** five-zone editor IA, left catalog modules, multi-view bottom bar, roam navigation (WASD), single-room mode, material brush, wall-closure validation, array placement, Help→shortcuts overlay, Draw→Decorate→Visualize funnel.  
- **Not usable as truth:** full shortcut list, support.homestyler.com help, SEO shortcut article, live canvas behavior.  
- **O&O action:** translate patterns into **our** planner shell and open packages only; zero Homestyler code/assets/brand in the product.

**Inspiration is not cheating. Cloning expression is.**
