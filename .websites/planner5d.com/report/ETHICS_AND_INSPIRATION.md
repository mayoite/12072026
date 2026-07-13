# Inspiration vs copying — when is it an issue?

**Audience:** us (builders).  
**Stance:** We are not cheaters. Inspiration is welcome. We do **not** put their code, assets, or design system into our product.

---

## Short answer

| What you do | Issue? |
|-------------|--------|
| Study their **product behavior** (2D→3D flow, freemium gates, toolbar zones, collab roles) and rebuild in **your** UI/code | **Fine** |
| Use **public** tech signals (job posts, stack pages) to pick **open npm packages** (`three`, etc.) | **Fine** |
| Study **open-source** floor planners (MIT/Apache) and adapt ideas under their license | **Fine** (follow license) |
| Use **same category of feature** (walls, doors, catalog, render queue) that many apps share | **Fine** (ideas are not copyrighted) |
| Copy **minified JS**, source maps, internal APIs, shaders, catalog meshes, icons, brand, or pixel-match UI | **Not fine** |
| Ship a product that looks like a **confusing substitute** for Planner 5D (trade dress / trademark) | **Risky / not fine** |
| Scrape private/authenticated data or crack paid apps | **Not fine** |

**Rule of thumb:**  
If a reasonable person would say “you rebuilt the *idea* with your own work” → OK.  
If they would say “you took *their* implementation or look” → stop.

---

## What is usually *not* protected

- Product **concepts** (draw walls, switch 2D/3D, freemium catalog)
- **Workflow patterns** (async renders, share link roles)
- **Tech choices** people hire for (Three.js, WebGL, TypeScript)
- **Industry conventions** (left tool strip, right catalog)

Copyright does **not** protect ideas, procedures, or methods of operation — it protects **expression** (specific code, text, art).

---

## What *is* protected / off-limits

1. **Their source code** (including minified bundles and maps if you re-use them)  
2. **Their 3D assets / textures / furniture models**  
3. **Their brand** (name, logo, distinctive marketing copy)  
4. **Near-identical UI chrome** that could look like “their app rebranded”  
5. **Cracked** or leaked proprietary builds (ignore those GitHub hits)

---

## How we use research (this project)

| Allowed | Forbidden in our product |
|---------|---------------------------|
| Feature checklists for *what* to build | Paste their JS/CSS |
| Toolbar **zone map** as product design notes | Clone their icon set / layout pixels |
| Package list from **jobs** as “evaluate these libs” | “Steal their package.json and vendored code” |
| Open-source planners for **learning algorithms** | Copy without license compliance |

---

## Bottom line

**Inspiration is not cheating.**  
Cheating would be taking **their** code, assets, or brand into **ours**.  
Building a better/different planner after studying competitors is normal product work.
