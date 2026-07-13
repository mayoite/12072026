# Planner 5D — deep stack & packages (public sources)

**Date:** 2026-07-09  
**Output only under** `D:\websites\planner5d.com\`  
**Purpose:** Real package/stack signals for **inspiration** — implement with **our** code.  
**Not their source tree.** Their editor ships as proprietary minified JS; there is no public monorepo to “get their code” legally.

---

## Honesty about “actual packages or code”

| Source | What you get |
|--------|----------------|
| Live `/editor` HTML scrape | Nearly empty shell — app is **client JS** after load; headless often fails full tool UI |
| Minified production bundles | You can *see* URLs if exposed; **do not copy** into product |
| **Job postings (best signal)** | Explicit stack list written by the company |
| Himalayas “tech stack” | Aggregated tools (corroborates jobs) |
| **Public script tags + bundle fingerprints** | Vendor jQuery, hammer, tippy; huge webpack `app.js` with `three` / `React` string hits |
| Random GitHub “Planner5D” | Mostly **unofficial** / homework / junk; one old preview-service homework; **not** official editor source |
| Open-source floor planners | **Real code you may study** under their licenses |

**Conclusion:** Best stack signal = **hiring + public CDN script list + bundle string fingerprints**. That is enough to choose open packages. **Do not ship their `app.js`.**

---

## A. Stack they publish in hiring (primary evidence)

### Frontend / 3D (Typescript developer · 3D graphics)

From Firecrawl scrape of public job text:

| Area | Stack they list |
|------|-----------------|
| Languages | JavaScript, **TypeScript**, ES6+ |
| Style | **OOP**, strict coding standards |
| 2D | **SVG**, **Canvas** |
| 3D | **Three.js**, **WebGL** (listed as Three.js / OpenGL in post) |
| Legacy UI | **jQuery** (legacy) |
| Build / test | **Webpack**, **Jest**, Docker |
| Realtime | **WebSocket** |
| Nice-to-have | AngularJS, VueJS, LESS, SASS, Bootstrap |

### Backend (same posts + full-stack PHP+TS)

| Area | Stack |
|------|--------|
| PHP | **PHP** 7.4/8.1 → posts also show **8.4** |
| Framework | **Symfony**, PHPUnit; full-stack also: Api Platform / Laravel familiarity |
| Data | **MySQL**, **MongoDB**, **Redis**, **RabbitMQ** |
| Ops | **Git**, **Docker** |

### Full-stack variant extras

- Front: native JS, jQuery legacy, **TypeScript**, **React**, Three.js, Webpack, Websocket, Jest, SVG  
- Also: Vue / Angular familiarity  
- 2D/3D: Canvas, WebGL, OpenGL  

### Himalayas company tech page (secondary)

Languages/frameworks: **Symfony, three.js, JavaScript, Python, PHP, Ruby, Ubuntu, TypeScript**  
Dev: **Jest, Webpack, Git, Docker**  
Libs: **jQuery, WebGL**  
Data: **MySQL, MongoDB, SQLite, Redis, RabbitMQ**  
Other: OneTrust, OpenGL, **Stripe**

Treat Himalayas as **third-party aggregation** (can lag). Prefer job posts for core.

**Raw files:**  
`raw/deep/job-ts-3d.md`, `raw/deep/job-fullstack.md`, `raw/deep/himalayas-stack.md`

---

## A2. Public editor scripts (CDN — research only)

From `raw/deep/editor-raw.html` (version path `web/js/2.1.3/…`):

### Explicit vendor scripts (named files — strongest “actual package” evidence)

| Script / lib | Path pattern |
|--------------|--------------|
| **jQuery 3.6.0** | `…/vendors/jquery-3.6.0.min.js` |
| **Hammer.js 2.0.8** | `…/vendors/hammer-2.0.8.min.js` |
| **Popper** | `…/vendors/popper.min.js` |
| **Tippy** | `…/vendors/tippy.min.js` |
| roundslider | `…/vendors/roundslider.min.js` |
| mCustomScrollbar 3.1.5 | `…/vendors/jquery.mCustomScrollbar-…` |
| jquery.mousewheel | vendor |
| jquery.tree 1.4.6 | vendor |
| jquery.images-compare | vendor |
| Swiper | CSS + marketing |
| cssgram | filters CSS |
| OneTrust / Cookie Law | consent |
| Google reCAPTCHA | bot |

### App bundles (proprietary — fingerprint only)

| File | Size / note |
|------|-------------|
| `…/build/app.js` | ~**17.7 MB** production bundle |
| `…/build/old.js` | legacy |
| `…/build/payments.js` | payments |
| `…/6/fastboot.js` | small bootstrap |

**String counts in first 2 MB of `app.js` (research, not for reuse):**

| Token | Hits (sample window) |
|-------|----------------------|
| `webpack` | 338 |
| `React` | 64 |
| `three` | 5 |
| `Vue` | 4 |
| `webgl` | 1 |

Stored only under `raw/deep/bundles/` for research. **Never copy into our product.**

This **corroborates** hiring: jQuery vendors on page + webpack app with Three/React-class code.

---

## B. npm / package shortlist for *our* product (inspired by A)

Use **our** licenses and versions. These are open packages that match the domain they hire for.

### 3D / 2D editor core

| Package | Why (inspiration) |
|---------|-------------------|
| `three` | Same family they hire for WebGL 3D |
| `@types/three` | TS |
| `three/examples/jsm/loaders/*` | GLTF/OBJ import path (Pro-like capability) |
| Native **Canvas 2D** or **SVG** | Matches their 2D hiring ask |
| Optional: `@react-three/fiber` + `drei` | Only if we choose React (their full-stack post mentions React) |

### UI helpers they load as vendors (optional open equivalents)

| They ship | We might use (open) |
|-----------|---------------------|
| jQuery (legacy) | Prefer none / modern framework |
| hammer.js | `hammerjs` or pointer events |
| tippy + popper | `@popperjs/core`, `tippy.js` |
| swiper | `swiper` |
| round slider | any range UI |

### App / API (if we stay modern; they use PHP — we need not)

| Need | Options |
|------|---------|
| Realtime collab | `yjs` + provider, or Liveblocks, or custom WebSocket (they list WebSocket) |
| Jobs/renders queue | Redis + worker (they use Redis/RabbitMQ) |
| Auth/payments | our stack; they list Stripe on Himalayas |

### Floor-plan geometry helpers (common, not “theirs”)

| Package | Role |
|---------|------|
| `earcut` | polygon triangulation for floor meshes |
| `robust-predicates` / geometry utils | wall/snap math |
| `gl-matrix` or three math | transforms |

### Explicit: do **not** vendor

- Any script from `planner5d.com` or `static.planner5d.com`  
- Catalog assets from their CDN  
- Cracked “Planner 5D Pro” repos  

---

## C. Open-source *code* you can actually read (legal inspiration)

These are **not** Planner 5D. They implement similar *problems* (2D plan → 3D). Study under their licenses.

| Project | Stack | Use for |
|---------|-------|---------|
| [cvdlab/react-planner](https://github.com/cvdlab/react-planner) | React, catalog, 2D planner | Catalog + draw model ideas |
| [furnishup/blueprint3d](https://github.com/furnishup/blueprint3d) (classic) / community “Blueprint3D Modern” rewrites | Three.js + TS | Floor plan → 3D rooms |
| Various `three.js` room planner demos | Three.js | Scene graph patterns |

**Workflow:** clone **those** repos, not Planner 5D. Extract *patterns* (wall extrusion, camera, catalog schema), rewrite for our architecture.

---

## D. Why Firecrawl felt “shallow” on the editor

1. `/editor` is a **heavy SPA**; Firecrawl HTML often returns empty `<body>` or welcome dialogs only.  
2. **Interact** sessions failed to reattach to scrape context.  
3. Production code is **minified** — even if you fetch a `.js` URL, reading it is reverse engineering, not a package list, and **shipping it is not OK**.  
4. Marketing pages are SEO-deep; the **editor is intentionally opaque**.

**What *does* work for stack:** jobs + stack aggregators + open-source peers.  
**What works for UX:** use the **live** editor yourself: https://planner5d.com/editor + our notes in `TOOLBARS.md`.

---

## E. Recommended build path (ours)

1. **Editor shell:** Next/React (or our existing stack) — not Symfony required.  
2. **2D plan:** Canvas or SVG walls/doors/windows + measurements.  
3. **3D:** `three` scene, extrude walls, place furniture meshes (our catalog).  
4. **Realtime:** WebSocket layer when needed.  
5. **Renders:** async job + storage (pattern only).  
6. **Never:** paste P5D bundles or assets.

---

## F. Evidence index

| File | Role |
|------|------|
| `raw/deep/job-ts-3d.md` | Official-ish job stack (Three.js, TS, jQuery legacy, Webpack…) |
| `raw/deep/job-fullstack.md` | PHP 8.x Symfony + React/Three |
| `raw/deep/himalayas-stack.md` | Aggregated stack |
| `raw/deep/search-*.json` | Search trails |
| `raw/deep/github-preview-service.md` | Unofficial old homework — **not** product source |
| `raw/deep/editor-raw.html` | Full raw HTML + script URLs |
| `raw/deep/bundles/app.js` | Research copy of public minified app (**do not use in product**) |
| `report/ETHICS_AND_INSPIRATION.md` | When inspiration is OK |
| `report/PACKAGES_INSPIRATION.md` | Earlier short list |
| `report/TOOLBARS.md` + `toolbar-mock/` | UX zones + local mock |

---

## G. One-line for the team

**We cannot legally obtain Planner 5D’s private source; we *can* use their published hiring stack + open-source planners to pick packages and invent our own implementation.**
