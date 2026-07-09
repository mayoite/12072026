# Honest quality bar (owner)

**Date:** 2026-07-09  
**Repo:** `D:\OandO07072026` · **No worktrees**

---

## Explicit position

### **NOT happy claiming product-done**

Hard-path *spine* is real on `main` (ordered SVG publish authority, modular place→2D/3D, GLB policy, partial G8 load, crypto entity IDs, fail-closed publish **code**).  

That is **not** the same as:

- signed-off admin publish in a real browser session  
- real mesh files on disk/CDN that the 3D viewer loads as product default  
- Fabric 2D cutover  
- clean a11y on `/planner/open3d`  
- “good looking” cabinet mesh (still stacked boxes / procedural)

**Do not ship marketing language that says the planner asset pipeline is finished.** Unit/CLI green ≠ product quality signed off.

Related: [01-RECAP.md](./01-RECAP.md) · [00-PENDING.md](./00-PENDING.md) · [05-CODE-REVIEW.md](./05-CODE-REVIEW.md)

---

## Up to the mark vs not

| Area | Up to the mark? | Reality |
|------|-----------------|---------|
| Entity IDs | **Yes** (for this rule) | `crypto.randomUUID` / `newEntityId` only |
| Designer static GLB removed | **Yes** (policy path) | Pathname-only `catalog-assets/generated/` or `blob:`; spoof-via-query fixed |
| SVG publish compile authority (code) | **Yes** (path chosen) | `pipelineCore` + S1 normalize via `compileSvgForPublish`; V1 reference-only |
| Publish fail-closed (unit) | **Mostly yes** | Compile gate → S4 `skipCompile` → persist; unit-tested |
| Admin publish **browser** E2E | **No** | No signed-off UI publish run |
| Modular place → procedural 3D | **Yes** (cabinet-v0 spine) | Multi-part boxes work; not “pretty mesh” |
| Modular 2D footprint | **Yes** (unit) | Footprint resolver tested |
| G5 GLB binary export | **Partial** | In-memory binary + validate; **no** product upload |
| G8 viewer GLB load | **Partial** | Async policy load + procedural fallback; no browser smoke; place default still procedural |
| Path-only stamp without file | **Not product-safe** | Can 404 then fall back (honest, but footgun) |
| Fabric 2D full stage | **No** | Flag OFF; walls still FeasibilityCanvas |
| Fabric flag ON smoke | **No** | Not browser-proved |
| S5 PNG thumbs on publish | **No** | Stub / URL only |
| 2C Supabase descriptors/assets | **No** | Disk `block-descriptors/` |
| Open3d a11y | **No** | Nested `main`, hydration `data-viewport` (live report dirty) |
| Mesh visual quality (cabinet-v0) | **No** | Stacked procedural boxes — no “good mesh” bar met |
| Dual SVG stacks (V1 + pipelineCore) | **Intentional dual** | Not a cutover; do not claim “one compiler everywhere” |
| SSR cloud | **N/A yet** | Later, when shared URL needed |

---

## Kill-path list (P0.1–P0.3)

These are the **next quality raisers**. Closing docs or more skeleton stages does **not** substitute for these.

| # | Kill-path | Why it matters | Done when |
|---|-----------|----------------|-----------|
| **P0.1** | **Admin SVG publish browser E2E** | Unit/CLI only today; product path is the admin UI | You publish one block in admin UI → `public/svg-catalog/{slug}.svg` updates; failure shows an error (not silent persist) |
| **P0.2** | **G5 → storage → stamp → G8 browser load** | Binary exists in memory; upload + real Chrome load open | Place modular (or stamp) → file under `catalog-assets/generated/` → 3D loads mesh (not only procedural boxes) |
| **P0.3** | **Open3d a11y: nested `main` + hydration `data-viewport`** | Live a11y report is not clean | Single `main` landmark; no hydration mismatch on `/planner/open3d` |

**After P0.1–P0.3:** still not “product-done.” Next honesty bar includes P0.4 (honest “good mesh” quality for cabinet-v0 + visual smoke) and P1 Fabric/path-only/S5 items — see [00-PENDING.md](./00-PENDING.md).

---

## Suggested single next move

Pick **one** kill-path (do not start SSR until you need a shared URL):

1. **P0.1** Admin publish browser E2E, or  
2. **P0.2** GLB upload + Chrome load, or  
3. **P0.3** A11y nested main + hydration  

---

*If an agent claims “done,” demand which kill-path closed and where the `results/planner/*` evidence lives.*
