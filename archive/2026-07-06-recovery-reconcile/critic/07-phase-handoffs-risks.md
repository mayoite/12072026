# 07 — Phase Handoffs & Risks

**Date:** 2026-07-04

---

## Major Cross-Phase Seams Currently Open

```mermaid
graph LR
    P2["Phase 02<br/>BlockDescriptor + resolver"]
    P3["Phase 03<br/>SVG generator"]
    P4["Phase 04<br/>Admin Puck"]
    P6["Phase 06<br/>Inventory + loader"]
    P8["Phase 08<br/>Persistence + versioning"]

    P2 -->|"blocks field + no-cast contract"| P3
    P2 -->|"blocks field + no-cast"| P6
    P2 -.->|"schema drift risk"| P4
    P3 -->|"generated assets"| P5["Phase 05 Portal"]
    P6 -->|"catalog consumer"| P3
    P8 -->|"versioned + .latest.json"| P2
    P8 -->|"versioned + .latest.json"| P6

    classDef open fill:#f8d7da
    class P2,P6,P8 open
```

---

## Key Open Handoffs (with citations)

| From | To | Seam | Current State | Risk Level | Citation |
|------|----|------|---------------|------------|----------|
| Phase 02 | Phase 06 | `blocks` field on descriptor | Cast in resolver + test | High | PLAN-FAIL-0413, benchmark BP-02 |
| Phase 02/06 | Phase 08 | Loader reads plain `.json` | Phase 08 defines pointer + rotation | High | svgBlockDescriptorLoader.ts vs phases/08 |
| Phase 04 | Phase 05 | Registry canonical path | Documented path ≠ actual file + no portal alias yet | Medium-High | I-D:67, PLAN-FAIL-0417 |
| Phase 03 | Phase 05 | Generated assets for visual review | Goldens exist, full run skipped in recent restores | Medium | benchmark §6 anti-copy |
| All | — | Global Standard Gate checklist | BP cites present, dedicated gate section missing | High | I-D:129-130 + Q-G:66-69 |

---

## Risk Heatmap by Phase

```mermaid
flowchart TB
    subgraph Phase02["Phase 02 — Catalog"]
        R1["Schema seam (blocks)"]
        R2["Evidence citation error"]
        R3["Premature Implemented claim"]
    end

    subgraph Phase03["Phase 03 — SVG"]
        R4["Anti-copy not yet exercised"]
    end

    subgraph Phase04["Phase 04 — Admin"]
        R5["Registry path drift"]
        R6["Missing GS gate checklist"]
    end

    subgraph Phase06["Phase 06 — Inventory"]
        R7["Loader contract not aligned"]
        R8["Catalogue-first + cursor search not wired"]
    end

    R1 --> R7
    R2 --> R3
    R5 --> R6
    R7 --> R8
```

---

## Observations (Positive)

- Many BP alignments from the 2026-07-04 benchmark are already present in the phase files (good signal).
- Option A pipeline order is verbatim in Phase 03 and I-D.
- Error taxonomy updates (409 suffixes, 422 for versionMismatch) have landed in several places.
- Live routes table in I-D correctly reflects the hybrid / pilot reality.

---

## Systemic Risk

The biggest systemic risk is **premature status advancement + missing evidence** combined with **contract seams**.

If Phase 02 is treated as "Implemented", later phases will inherit:
- A schema that still requires casts
- A loader that cannot read the versioning scheme Phase 08 is building
- A registry whose documented location is wrong

This is exactly the kind of accumulated technical debt the Global Standard Gate and strict evidence rules were designed to prevent.

---

**Next file:** `08-recommendations-roadmap.md`
