# Product context (why we build this)

**For agents / anyone not in the business.** Short. Read before planning catalog, engines, or “just use X SaaS.”  
**Date locked:** 2026-07-09 · Owner: Ayush / O&O  

Hard rules: `AGENTS.md` · licenses: `17-LICENSES-CLEARED.md` · plan: `Plans/trustdata/INDEX.md` · research: `D:\websites` only  

---

## Business

| Fact | Detail |
|------|--------|
| Who | One&Only (O&O) — **premium** custom office / workstation furniture |
| Not | IKEA/home DIY fixed catalog · free 3D model dumps |
| Project shape | **Days** of recon/revision per project; can scale to **thousands of workstations** (e.g. ~5000) |
| Customer wait today | Design turnaround often **~12–4 hours**; **up to ~48 hours** when big |
| Why software | Cut that wait and multiply systems work — without enterprise vendor lock-in |

---

## Money (vendor alternative)

| Path | Cost (order of magnitude) | Problem |
|------|---------------------------|---------|
| Pro third-party planning stacks | ~**$40k** initial + ~**$10k**/year | Too expensive; **tied to vendor mercy** |
| Owner OK burn on tools we control | ~**$1k–1.5k / month** | Affordable; **we own** roadmap and data |

Build capability you’d otherwise rent at $40k+$10k/yr — **without** that price or lock-in.

---

## Product model (catalog / systems)

Not “one fixed chair SKU.” **Systems** (like Featherlite / HON / Haworth / Steelcase world — ideas only):

```
Client (e.g. Philips ≠ Ford)
  → System / family
    → Shape (linear, L, …)
      → Size grid (e.g. 900×600, 900×750, 1200×600, 1500×600, …)
        → Modules (desk, storage, partition, …)
          → Generate 2D (SVG / Block2D) + modular 3D
          → Place many instances on plan → later BOQ/quote
```

**Hard path:** non-coder defines rules; software expands permutations.  
**Wrong path:** free GLB dump or hand asset per size×shape×client.

Peers (public category only): featherlitefurniture.com · hon.com · haworth.com · steelcase.com  
(`hii.com` is not this category.)

---

## Engines (do not thrash)

| Layer | Choice |
|-------|--------|
| 2D plan edit | **Fabric only** as destination — one object engine. No Konva hybrid. |
| Live interim 2D | FeasibilityCanvas (native Canvas 2D) — **bridge**, not forever ideal |
| 3D | Three (+ orbit). **Not** a 2D plan engine. **Not** Foyr photoreal race |
| IDs | `crypto.randomUUID()` (UUID format) via `newEntityId` |

---

## Success metric

**Plan accuracy + configurable systems + place at scale + save + path to quote**  
— not photoreal 4K, not multiparty enterprise suite parity.

---

## Timeline honesty (2026-07-09)

| Horizon | Realistic |
|---------|-----------|
| **3 months** | Planner **usable** (draw/place/select/delete/2D↔3D/save) if scope frozen |
| **6 months** | **Serious prototype**: that spine + **one** workstation family (sizes + linear/L + modules) generating and placing at meaningful scale |
| Not 3–6 months | Full multi-client factory, every matrix, replace $40k tools feature-for-feature |

---

## Agent one-liner

*Premium custom workstation systems; days of human recon; scale to thousands of seats; can’t afford $40k+$10k/yr vendor lock-in; OK ~$1–1.5k/mo own stack; Fabric 2D destination; systems/SVG not free GLBs; 6‑month bar = serious prototype, not finished platform.*
