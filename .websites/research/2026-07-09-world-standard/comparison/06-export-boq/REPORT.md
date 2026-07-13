# 06 — Export / BOQ / professional output

**Date:** 2026-07-09  
**Slice:** PDF · image/render · share link · BOQ/shopping list · branded export · quote readiness  
**Rule:** Ideas/patterns only — no competitor code, assets, or brand clones.  
**Score scale:** 1 = broken/missing · 3 = acceptable · 5 = class-leading (public product bar)  
**CSV:** `SCORES.csv` columns `product,pdf,image,share,boq,branded,quote`

---

## Executive takeaway (O&O)

**Win on INR/GST BOQ and quote handoff — do not race photoreal renders.**

Global room planners compete on pretty pictures and social share. India B2B and serious residential/office fit-out compete on **trustworthy quantities, prices in INR, GST, and a quote path a buyer can act on**. O&O already has the structural hooks (`buildBoq`, GST 18%, `exportBoqToPdf` / branded PDF, quote-cart bridge). Competitors either:

- ship beautiful floor-plan PDFs with **no commercial BOQ** (RoomSketcher), or  
- ship **SKU shopping lists** locked to one retailer (IKEA), or  
- treat “products list” as a CSV dump without tax/quote workflow (Floorplanner).

O&O’s public bar should be: **plan → BOQ (INR + GST) → branded PDF → quote cart**, not “beat Homestyler on AI render.”

---

## Dimension definitions

| Col | Meaning |
|-----|---------|
| **pdf** | Native or first-class PDF floor plan / document export (not only browser Print) |
| **image** | 2D/3D stills, high-res renders, PNG/JPG (photoreal optional) |
| **share** | Viewable share link / embed / QR without full account friction |
| **boq** | Bill of quantities / shopping list from placed items (SKU, qty, price) |
| **branded** | Logo/letterhead/white-label on client-facing export |
| **quote** | Path from design → priced proposal / cart / sales handoff |

---

## Product matrix (narrative)

### Planner5D

| pdf | image | share | boq | branded | quote |
|-----|-------|-------|-----|---------|-------|
| 3 | 4 | 5 | 2 | 3 | 2 |

- **PDF:** Web “Share → Print → Save as PDF”; not a structured multi-page deliverable on all platforms. Paid path adds CAD (DWG/DXF).  
- **Image:** Strong consumer renders and social-ready visuals; AI imaging is a product pillar.  
- **Share:** Share link is the primary cross-device handoff (explicitly recommended over PDF on mobile/desktop apps).  
- **BOQ:** Furniture “shop” is affiliate/browse, not a project-derived commercial BOQ with tax.  
- **Branded:** Business/white-label planner and embedded catalog for partners — B2B, not everyday consumer letterhead.  
- **Quote:** Partner/configurator story (“design and quote”) exists for business embeds; consumer app is design-share first.

**Pattern:** Link-first sharing + pretty 3D; commercial depth only in white-label deals.

---

### RoomSketcher

| pdf | image | share | boq | branded | quote |
|-----|-------|-------|-----|---------|-------|
| 5 | 5 | 4 | 2 | 5 | 1 |

- **PDF / image:** Class-leading **to-scale** 2D/3D floor plans as JPG/PNG/PDF (Pro/Team). Generation + download is the product.  
- **Share:** Project share including Live 3D (subscription-gated).  
- **BOQ:** Catalog for decoration only; **no** first-class shopping list / quantity takeoff from furniture.  
- **Branded:** **Letterhead + logo + company styling** on exports — best-in-class for real-estate/agent PDFs.  
- **Quote:** Not a quoting tool; deliverable is a polished plan image/PDF.

**Pattern:** Professional **document** output (branded plan sheets). Zero commercial BOQ.  
**O&O steal (ideas only):** Letterhead metadata (client, project, disclaimer, scale bar) around a BOQ PDF — without copying RS layout.

---

### Floorplanner

| pdf | image | share | boq | branded | quote |
|-----|-------|-------|-----|---------|-------|
| 4 | 4 | 5 | 3 | 2 | 2 |

- **PDF / image:** Tiered 2D/3D export (JPG/PNG/PDF); resolution and watermark by project level. FML/DXF on higher tiers.  
- **Share:** Share link + embed are mature first-class actions.  
- **BOQ:** “Products list” / download of products used in plan — **list**, not tax-aware quote.  
- **Branded:** Mostly watermark removal on paid; not full agency letterhead.  
- **Quote:** Product list stops short of proposal/GST/cart.

**Pattern:** Clean export ladder (free watermark → HD → 4K) + link/embed. Light product list only.

---

### Homestyler

| pdf | image | share | boq | branded | quote |
|-----|-------|-------|-----|---------|-------|
| 4 | 5 | 4 | 3 | 2 | 3 |

- **PDF / image:** Floor plan export (image/PDF; DWG/floor-plan variants discussed in help/forums). Cloud **photoreal** is the differentiator.  
- **Share:** Public project URL / share for view or duplicate-edit.  
- **BOQ:** Brand models and shopping-list style flows exist in ecosystem (product links); not India GST BOQ.  
- **Branded:** Consumer/community brand, not pro letterhead.  
- **Quote:** Toward “buy these products,” not formal B2B quote PDF.

**Pattern:** Photoreal + community share. Commercial output is retail inspiration, not procurement document.

---

### IKEA (Kitchen / room planners)

| pdf | image | share | boq | branded | quote |
|-----|-------|-------|-----|---------|-------|
| 5 | 3 | 4 | 5 | 2 | 5 |

- **PDF:** Explicit multi-part PDF: summary page, **items list**, views — print/save as PDF after sign-in.  
- **Image:** Functional plan views; not a photoreal arms race.  
- **Share:** Share via **link and/or QR** (market-dependent help pages).  
- **BOQ:** **Items list with live retail pricing** is the gold standard shopping-list pattern.  
- **Branded:** Always IKEA brand; no third-party agency letterhead.  
- **Quote:** Design → priced list → store/service path = purchase-ready.

**Pattern:** **Catalog-locked BOQ** wins trust. Every line is a real SKU you can buy.  
**O&O steal (ideas only):** Same trust model with **O&O SKUs + INR + GST**, not IKEA articles.

---

### SmartDraw

| pdf | image | share | boq | branded | quote |
|-----|-------|-------|-----|---------|-------|
| 5 | 4 | 5 | 4 | 4 | 5 |

- **PDF / image:** First-class PDF and common image formats (PNG/SVG) from diagrams/floor plans.  
- **Share:** Share-with-anyone link; collab edit without full seat for viewers.  
- **BOQ:** Custom data on symbols → **manifest / material lists / estimating** — data-enabled floor plans.  
- **Branded:** Own product catalog + professional proposal styling for teams.  
- **Quote:** Marketed **visual quoting** — plan + data → proposal PDF.

**Pattern:** B2B **data on shapes → estimate**. Closest “pro output” cousin to O&O’s BOQ thesis (but not India GST/workspace furniture native).

---

### O&O (live product / codebase bar)

| pdf | image | share | boq | branded | quote |
|-----|-------|-------|-----|---------|-------|
| 4 | 3 | 3 | 5 | 4 | 5 |

Evidence (repo, ideas only for competitors):

- **BOQ:** `buildBoq` → line items with SKU, qty, dimensions, **`unitPriceInr`**; **`subtotalInr` / `gstRate` / `gstAmountInr` / `grandTotalInr`** (default 18% furniture GST).  
- **PDF:** `exportBoqToPdf`, `exportBrandedPdf` / `exportBoqOnly`, vector PDF helpers — plan + BOQ table, One&Only header/presets.  
- **Quote:** `boqToQuoteCart` / quote-cart site path — design to commercial shortlist.  
- **Image:** Canvas/PNG capture paths exist; **not** competing on photoreal cloud render.  
- **Share:** Persistence has share-link encode/decode concepts; public polish likely behind pure “copy link” leaders (Planner5D/Floorplanner).

**Scores assume:** BOQ/GST/quote stack is the **strategic peak**; visual export is **good enough**, not world #1.

---

## Scoreboard (sum of 6 dims, max 30)

| Product | pdf | image | share | boq | branded | quote | **Total** |
|---------|-----|-------|-------|-----|---------|-------|-----------|
| SmartDraw | 5 | 4 | 5 | 4 | 4 | 5 | **27** |
| IKEA | 5 | 3 | 4 | 5 | 2 | 5 | **24** |
| RoomSketcher | 5 | 5 | 4 | 2 | 5 | 1 | **22** |
| **O&O** | 4 | 3 | 3 | **5** | 4 | **5** | **24** |
| Homestyler | 4 | 5 | 4 | 3 | 2 | 3 | **21** |
| Floorplanner | 4 | 4 | 5 | 3 | 2 | 2 | **20** |
| Planner5D | 3 | 4 | 5 | 2 | 3 | 2 | **19** |

O&O ties IKEA on total by **different strengths**: IKEA = retail SKU list; O&O = **workspace catalog + GST + quote cart**. SmartDraw leads overall as a general visual-quoting suite — O&O should stay **category-specific** (workspace furniture India), not diagram-everything.

---

## Gap map (what each leader owns)

| Capability | Who owns public bar | Gap vs O&O |
|------------|---------------------|------------|
| Photoreal stills | Homestyler, Planner5D | **Ignore for now** (costly arms race) |
| Scale plan PDF + letterhead | RoomSketcher | Add **metadata chrome** around O&O BOQ PDF |
| Share link / embed | Floorplanner, Planner5D, SmartDraw | Harden one-click **view-only share** |
| SKU shopping list + price | IKEA | O&O has INR lines — keep catalog truthful |
| Tax-aware BOQ | **O&O** (GST) | **Defend & productize** in UI |
| Quote / cart handoff | IKEA, SmartDraw, **O&O** | Ship end-to-end demo path |
| Agency white-label | Planner5D Business, RoomSketcher letterhead | Optional later B2B |

---

## Patterns to steal (ideas only)

1. **IKEA PDF pack structure** — cover/summary · plan view · **itemized BOQ** · totals. Map to: project meta · canvas snapshot · INR lines · GST · grand total.  
2. **RoomSketcher letterhead** — logo, prepared-by, client, disclaimer, scale note — around O&O brand, not RS clone.  
3. **Floorplanner export tiers** — free watermark vs clean paid — only if freemium ships; not required for B2B-first.  
4. **SmartDraw symbol data** — every placed SKU carries price/SKU/dims into BOQ automatically (O&O already closer via catalog geometry).  
5. **Share link as default** — PDF is attachment; link is collaboration (Planner5D lesson).

## Anti-patterns

- Chasing **4K photoreal** before GST line items are obvious in the main export.  
- Generic “products list” without **currency, tax, or quote CTA**.  
- Branded PDF that is logo-only with empty commercial table.  
- Export behind so many paywalls that demo cannot show quote readiness.

---

## O&O recommendation (this slice)

### Do next (export/BOQ priority)

1. **Default export = BOQ-first PDF**  
   - Project name, client, date  
   - Plan snapshot (2D is enough)  
   - Line items: SKU · name · qty · unit INR · line total  
   - Subtotal · GST (rate + amount) · **Grand total INR**  
2. **One click → Quote cart** from same BOQ (already bridged in code — make UI undeniable).  
3. **Branded preset** (One&Only header, optional partner logo later) — RoomSketcher-class professionalism without photoreal.  
4. **Share link** for view-only plan + BOQ summary (even if v1 is signed-in only).  

### Explicitly deprioritize

- Photoreal AI render quality race vs Homestyler/Planner5D.  
- Multi-format CAD export as a launch pillar (nice-to-have after quote path).  

### Success bar (public)

> “I placed O&O products → I downloaded an **INR + GST BOQ PDF** my accounts team trusts → I sent a **quote request** without retyping SKUs.”

If that sentence is true in a 10-minute demo, O&O wins this slice against every pure-pretty planner — even when total score ties IKEA/SmartDraw.

---

## Sources (public / marketing-level)

- Planner5D Help: exporting / print-to-PDF (web); share-link on other platforms; business white-label.  
- RoomSketcher Help: download/print options (JPG/PNG/PDF), letterhead branding, share + Live 3D.  
- Floorplanner: project levels (export resolution, PDF, products list, share/embed).  
- Homestyler: export image/PDF/floor plan; public share URLs; render-centric marketing.  
- IKEA Help: kitchen planner PDF (summary + items list); share link/QR.  
- SmartDraw: PDF export, share link, manifest/material lists, visual quoting.  
- O&O repo: `shared/boq/*`, `shared/export/pdfExport.ts`, `brandedPdfExport.ts`, quote-cart bridge/tests.

---

## File outputs

| File | Role |
|------|------|
| `REPORT.md` | This narrative |
| `SCORES.csv` | Machine-readable scores for `MASTER-CHART.md` |

**Orchestrator note:** After all slices land, assemble `MASTER-CHART.md`; do not wait on chat for this slice alone.
