# ROOT CAUSE — `createContext is not a function` on `/planner/features/[slug]`

**Date:** 2026-07-10  
**Symptom:** `next build` / e2e webServer fails:

```
Error: Failed to collect configuration for /planner/features/[slug]
  [cause]: TypeError: (0 , e.createContext) is not a function
Error: Failed to collect page data for /planner/features/[slug]
```

## Chain (server page data collection)

1. **Server route (no `"use client"`):**  
   `site/app/planner/(marketing)/features/[slug]/page.tsx`  
   - L3–8: imports `PlannerFeaturePageView` **and** data from `plannerFeaturePages`  
   - L17–18 `generateStaticParams`, L21–32 `generateMetadata`, L35+ page body all evaluate that data module on the server during build.

2. **Shared data module (also no `"use client"`):**  
   `site/features/planner/landing/plannerFeaturePages.ts`  
   - **L1:** `import type { Icon } from "@phosphor-icons/react"` (type-only — fine)  
   - **L2:** `import { Cube as Box, FileText, Stack as Layers3, Ruler, Sparkle as Sparkles } from "@phosphor-icons/react"`  
     → **runtime CSR entry** of Phosphor

3. **Phosphor CSR → React context at module eval:**  
   CSR icons pull `IconBase` → `IconContext` from  
   `node_modules/@phosphor-icons/react/dist/lib/context.es.js` **L1:**

   ```js
   import { createContext as r } from "react";
   const o = r({ ... }); // IconContext
   ```

   Under Next App Router **RSC / page-data collection**, the server React binding does **not** provide a working `createContext` (hence `(0 , e.createContext) is not a function`), so module evaluation of `plannerFeaturePages` aborts before the route can be configured.

## Why not the client view alone?

`PlannerFeaturePageView.tsx` is `"use client"` and also imports phosphor CSR — that is normal for client bundles. The **build killer** is the **server page’s direct import** of a data module that **side-loads CSR icons** for `generateStaticParams` / metadata / page config.

Same bug class as prior marketing fix (`results/site/runtime-fix/contact-products-500-fix-2026-07-09.md`): Server Components must use `@phosphor-icons/react/dist/ssr` (SSRBase has **no** `createContext`), not the default CSR entry.

## Confirmed non-causes (this fail)

| Suspect | Why not this fail |
|---------|-------------------|
| Typecheck / TS | Already green; this is runtime module eval at build |
| `HomeMarketingLayout` | Pure layout, no createContext |
| `optimizePackageImports` alone | Amplifies tree-shaking; does not introduce createContext — CSR package does |
| Contact residual | Contact already on `/dist/ssr`; current log names `/planner/features/[slug]` only |

## Fix direction (minimal)

Change **runtime** icon imports in `plannerFeaturePages.ts` L2 to `@phosphor-icons/react/dist/ssr` (keep type-only import as-is). No Fabric/cloud/mesh; no broad phosphor rewrite.
