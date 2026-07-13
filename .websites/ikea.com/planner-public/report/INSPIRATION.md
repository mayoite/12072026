# INSPIRATION — Public planner market patterns (O&O)

**Ethics:** Patterns only. **INSPIRATION ONLY.** Do not copy IKEA UI, chrome, brand, copy tone, imagery, product names, layouts, or assets. Do not reimplement competitor planners. Use this file to inform O&O manufacturer planner strategy — not to clone a retail experience.

**Scope of evidence:** Marketing / hub pages only (public scrape). No authenticated flows, no live planner canvas UX, no checkout/order internals.

---

## 1. Sources

| File | URL (as scraped) | What it covers |
|------|------------------|----------------|
| `raw/ikea.com-us-en-planners.md` | `https://www.ikea.com/us/en/planners/` | Design & planning hub: 3D home design, room planners, product planners, planning services CTAs |
| `raw/ikea.com-us-en-planners-kitchen-planner.md` | `https://www.ikea.com/us/en/planners/kitchen-planner/` | Kitchen planner landing: self-serve 3D, expert help, old-plan/PDF path, services ladder |
| `raw/ikea.com-us-en-planners-pax-planner.md` | `https://www.ikea.com/us/en/planners/pax-planner/` | Product-system planner landing (wardrobe configurator): self-serve, appointment, system catalog, related planners |
| `raw/ikea.com-us-en-customer-service-services-planning.md` | `https://www.ikea.com/us/en/customer-service/services/planning/` | **Failed page** (404 “Page can't be found”) — planning services detail not captured |

All files also contain ad-network noise (`servedby.flashtalking.com` blocked by client extension). That is scrape artifact, not product content.

---

## 2. Patterns

### 2.1 Product-first planners (kitchen / system / room)

Market pattern is a **split architecture**, not a single “do everything” canvas:

| Layer | Pattern | Evidence (abstracted) |
|-------|---------|------------------------|
| **Hub** | One “design & planning” entry that routes by intent | Hub lists 3D home design, room planners, product planners, planning services |
| **Room planners** | Space-first technical plan of a room type | Hub: detailed technical plan including **windows, outlets, pipes**; room-typed entries (bedroom, kitchen, living, bathroom, outdoor, office, hallway, dining, children’s) |
| **Product / system planners** | Product-line configurators for modular systems | Hub: “simple design tools” for complex product solutions — add/remove modular pieces and interior organizers; save design for later. Family/system list spans storage systems, modular sofas, simpler kitchen combos, desks, chairs, comfort guide |
| **Kitchen (heavy)** | Dedicated 3D kitchen planner + lighter combo tools | Kitchen landing: online 3D, no download; hub also lists simpler “customize combination” kitchen tools separate from full room/kitchen technical planner |
| **System (e.g. wardrobe)** | Dedicated configurator for one modular product system | System landing: try ideas quickly online; link back to system product catalog; link to sibling storage planners |
| **3D home design** | Scan or virtual room for multi-room furniture placement | Hub: virtual room or app scan; living/bedroom/office/etc. product placement (broader than SKU BOM) |

**Product-first takeaway for manufacturers:** The valuable commercial pattern is not “pretty room theater” alone — it is **one planner per configurable product system** (frames, fillers, interiors, doors, finishes) plus optional room context. Room planners exist where MEP/opening constraints matter (especially kitchen).

### 2.2 SKU truth

Patterns implied by the public marketing (not verified inside the live tools):

- **Design = composition of real catalog items** — modular pieces, organizers, covers, legs/tops, door systems — not freeform geometry alone.
- **Save design for later** — continuity of a configuration (implies durable design ID / cart-like BOM).
- **System catalog linked from planner landing** — “inspiration and product details” sit next to the configurator so planning is catalog-backed.
- **Old plan → PDF / re-open via human path** — kitchen landing offers retrieving a prior plan and PDF via short free consultation (plan as durable document, not only ephemeral 3D).
- **Price/availability not detailed on these landings** — hub/landings sell capability, not live SKU grids; assume real SKU truth lives inside the planner apps (not scraped here).

**Pattern name:** *Configuration → bill of real products → document/export (PDF) or handoff to expert*, not pure moodboard.

### 2.3 Guided planning services

Self-serve is primary; **optional help is a ladder**, not a replacement:

1. **Do it yourself** — online planner, no install (kitchen & system landings emphasize browser-based start).
2. **Book free planning appointment** — online and/or in-store specialists for ideal space (hub + kitchen + system CTAs).
3. **Remote / virtual kitchen expert** — hub: free virtual appointment for kitchen projects from home.
4. **Retrieve old plan / PDF** — short consultation when the user only needs an existing plan document.
5. **Talk to expert now** — phone/chat for purchase-time help.
6. **Business specialist** — B2B furniture/storage planning appointment.

Hub framing: “You can do everything yourself, but you don’t have to” (paraphrase of competitor message — **do not copy wording**). Pattern: **self-serve first, assisted second, always-on expert third**.

### 2.4 Mobile caveats

- Hub **explicitly states** the kitchen planner is **not compatible with mobile devices**.
- Heavy kitchen planning is positioned as a desktop/online app experience; mobile may be limited to marketing, booking, or lighter tools/app scan paths.
- Pattern for O&O: **honest device policy** beats a broken canvas. Either ship mobile-capable flows or declare desktop-required for complex configuration/BOQ.

### 2.5 Other recurring UX/IA patterns (abstract)

- **Intent routing on hub:** room vs product vs human service vs 3D home.
- **Category chips for product planners:** storage / sofas / bedroom / kitchen / desk / dining (group configurators by domain).
- **Low-friction start:** “few steps,” browser-only, no download claims.
- **Sibling discovery:** one system planner page points to “all wardrobe and storage configurators.”
- **Appointment as conversion** for complex projects (kitchen, wardrobe system), not only cart.

---

## 3. O&O translation

O&O is a **manufacturer planner**, not a big-box room marketplace. Translate patterns as follows:

| Market pattern | O&O translation |
|----------------|-----------------|
| Product-system configurators | **One configurator per O&O product system / series** driven by **manufacturer SKU catalog** (parts, options, constraints, finishes) |
| Room technical plan | Optional later: openings, walls, services — only where needed for fit/install; not the v1 hero if catalog + BOQ is the commercial core |
| 3D home / photoreal scan | **Deprioritize photoreal room theater.** Prefer accurate configuration, dimensions, and install-ready outputs over lifestyle rendering parity |
| Design → products | **Configuration → BOQ (bill of quantities) → quote** path as primary success metric |
| Save design / PDF | Persist designs; export **BOQ, cut list / packing logic, quote PDF**, not mood images alone |
| Expert ladder | Manufacturer/dealer planning assistance, remote review of a saved design, quote handoff — not retail-store theater |
| Mobile caveat | Desktop-first for full kitchen/system BOQ if needed; mobile for browse catalog, review quote, approve — with explicit messaging |
| Catalog truth | **SKU master is source of truth** (availability, option rules, pricing policy). Planner never invents non-catalog parts |

**O&O north star (from this research):**  
*Manufacturer SKU catalog + constraint-aware configuration + BOQ/quote path* over photoreal competitor-style room marketing.

Do **not** aim for feature parity with multi-room 3D lifestyle tools unless product strategy explicitly funds that; the commercial pattern that maps to O&O is **system configurator + documentable product truth**.

---

## 4. Anti-copy fence (no IKEA chrome / products)

**Forbidden in O&O product, UI, content, and marketing:**

- IKEA brand name, logo, blue/yellow retail chrome, typography, iconography, or layout clones of ikea.com planners hub or landings.
- Competitor product/system names, series names, or planner product names (kitchen tool branding, wardrobe system branding, storage series names, sofa series names, etc.).
- Competitor photography, lifestyle shots, or “employee + customer at monitor” visual tropes copied as composition.
- Competitor marketing copy, slogans, CTA phrasing, or section structure pasted into O&O.
- Deep-links or embeds of competitor planner apps as if they were O&O.
- Any UI that a reasonable user would mistake for the competitor’s planner.

**Allowed:**

- Abstract industry patterns: modular configuration, room vs product split, save design, PDF/export, appointment ladder, desktop-only honesty for heavy tools.
- O&O’s own brand, chrome, catalog, constraints, BOQ, and quote workflows.
- MIT/open-source tooling and original implementation only — no scraped assets, no reverse-engineered competitor planner code.

If a design review feels “too close,” **change structure, visual system, and copy** until the only remaining similarity is the abstract job-to-be-done.

---

## 5. Scrape quality honesty

| Item | Assessment |
|------|------------|
| **Coverage** | 4 URLs attempted; 3 content-rich marketing pages; 1 hard fail |
| **Planning services page** | `customer-service/services/planning` returned **“Page can't be found”** — no services detail, pricing of services, or process steps from that URL |
| **Planner app interiors** | **Not scraped.** Landing pages only. No step list, constraint UI, price stack, cart/BOM UI, or 3D controls captured |
| **Kitchen mobile note** | Explicit on hub; reliable as stated marketing policy, not verified by device testing here |
| **Images** | Many image URLs present; base64/extension-blocked ad frames polluted files — ignore for product design |
| **Ads / blockers** | All files show `ERR_BLOCKED_BY_CLIENT` for flashtalking — noise only |
| **Video** | Hub mentions embedded video unsupported in scrape environment — transcript not captured |
| **Freshness** | Snapshot of public pages at scrape time only; live site may differ |
| **Confidence** | **High** for IA/positioning patterns on hub + kitchen + system landings. **Low** for in-tool SKU mechanics, pricing, and exact configurator UX. **None** for the failed planning services page |

**Recommendation for any deeper research:** scrape only public landings and published help docs; treat live configurators as black boxes unless legal/compliance allows deeper public observation. Never import competitor assets into the O&O repo.

---

## Summary (patterns only)

1. **Hub → room planners | product/system planners | human planning services | optional 3D home.**  
2. **Commercial core for manufacturers:** product-system configurators on **real SKUs**, with save/export and optional expert handoff.  
3. **Kitchen-class tools** may be desktop-only — say so.  
4. **O&O should optimize for catalog truth → BOQ → quote**, not photoreal parity.  
5. **Fence:** no IKEA chrome, products, copy, or assets — inspiration patterns only.  
6. **Evidence gap:** services page 404; no live planner canvas data — do not over-claim.

---

*Generated from `D:\websites\ikea.com\planner-public\raw\` for O&O manufacturer planner research. Inspiration only.*
