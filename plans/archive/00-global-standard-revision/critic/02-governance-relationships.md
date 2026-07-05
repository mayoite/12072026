# 02 — Governance Relationships

**Date:** 2026-07-04  
**Inputs:** `plans/2026-07-04/benchmark.md`, `plannnerplan/IMPLEMENTATION-DECISIONS.md`, `plannnerplan/QUALITY-GATES.md`

---

## Authority Hierarchy (as declared)

```mermaid
flowchart TD
    subgraph Top["Highest Authority"]
        A["AGENTS.md + repo root instructions"]
        B["docs/Lockedfiles/*"]
    end

    subgraph PlannerGovernance["Planner Governance (this project)"]
        C["IMPLEMENTATION-DECISIONS.md<br/>(explicitly declared #3)"]
        D["benchmark.md (dated)"]
        E["QUALITY-GATES.md"]
        F["DESIGN-BENCHMARK-PROTOCOL.md"]
    end

    subgraph Execution["Execution Layer (bound by above)"]
        G["plannnerplan/phases/*.md"]
        H["HANDOVER.md / FAILURESPLAN.md"]
        I["Code + tests + results/"]
    end

    A --> C
    B --> C
    C --> D
    C --> E
    D --> G
    E --> G
    C -->|Binds| H
    G --> I
    H --> I

    classDef source fill:#e8f4fd
    class C,D,E source
```

**Key rule from IMPLEMENTATION-DECISIONS.md:3-4**
> "This file (`IMPLEMENTATION-DECISIONS.md`) is the planner project's source-of-truth. Phase files bind to this file; conflicts go here."

---

## The Three Mandatory Documents — Relationship Diagram

```mermaid
flowchart LR
    B["benchmark.md<br/>• 5-product comparison<br/>• FACTs / RECs / BPs<br/>• Anti-copy rule<br/>• Stale-evidence policy"]
    I["IMPLEMENTATION-DECISIONS.md<br/>• Authority order<br/>• Status vocabulary<br/>• Global Standard Framework<br/>• UI/UX Standards (Intensified)<br/>• SVG/Features/Packages Mandates<br/>• Live routes + locked packages"]
    Q["QUALITY-GATES.md<br/>• Phase gate table<br/>• 95%/90% coverage + zero-bypass<br/>• Global Standard Gate (binding)<br/>• Test layers<br/>• Evidence integrity rules"]

    B -->|"BP-0x feed into"| I
    I -->|"Defines vocabulary + mandates"| Q
    Q -->|"Release-blocking before Implemented"| Phases

    subgraph Phases["Affected Phases (03,04,05,06,10)"]
        P1["Phase 03 SVG"]
        P2["Phase 04 Admin"]
        P3["Phase 05 Portal"]
        P4["Phase 06 Inventory"]
        P5["Phase 10 Cleanup"]
    end

    style B fill:#fff3cd
    style I fill:#d4edda
    style Q fill:#cce5ff
```

---

## Document Interaction Matrix

| Concern                        | benchmark.md                  | IMPLEMENTATION-DECISIONS.md      | QUALITY-GATES.md              | Winner / Binding Rule |
|--------------------------------|-------------------------------|----------------------------------|-------------------------------|-----------------------|
| Status vocabulary              | References                    | Defines exactly (Planned → Accepted) | Enforces via exit rules      | I-D (primary)        |
| Coverage floors                | Cross-refs                    | 95% target / 90% hard            | Same numbers + zero-bypass   | Match (both)         |
| Global Standard Gate           | Provides dated report + BPs   | Declares binding + "must add checklist" | Makes it release-blocking    | All three            |
| Anti-copy rule                 | §6 + 5-product details        | "only semantic tokens"           | Visual regression + gate     | benchmark primary    |
| Evidence format                | "stale-evidence policy"       | Results/ per handbook            | `results/<module>/<phase>/...` + run.json/raw.log | Q-G + handbook      |
| Schema / contract anchoring    | BP-02                         | Module paths + single source     | Contract tests               | I-D + benchmark BP   |

---

## What "Binds" Means in Practice

From the documents:

1. A phase may only move from `Planned` → `Implemented` after the relevant gates in Q-G are satisfied.
2. Global Standard Gate (I-D + Q-G) requires:
   - Fresh dated benchmark
   - Independent UI review sign-off
   - Anti-copy + pattern attestation in Decision Log
3. Phase files are **not** independent documents — they are checklists that must reference the above.

Current observed state (2026-07-04):
- Many phases still correctly say `Status: Planned`.
- HANDOVER and FAILURESPLAN have begun claiming "Implemented" for Phase 02 without satisfying the gates above.
- This is the core coherence failure surfaced by the Critic role.

---

## Recommended Reading Order (for future agents)

1. `IMPLEMENTATION-DECISIONS.md` (authority + vocabulary + mandates)
2. `plans/2026-07-04/benchmark.md` (concrete FACTs + BPs + 5-product model)
3. `plannnerplan/QUALITY-GATES.md` (what must be proven before promotion)
4. Individual phase files (only as checklists against the above)

---

**Next:** See `03-status-vocabulary-drift.md` for the most visible symptom of the current drift.
