# Plans

**Live plan only:** [`trustdata/`](./trustdata/)  
**Constitution:** [`../AGENTS.md`](../AGENTS.md)  
**Scoreboard:** [`../ayushdocs/19-GOALS-SLICES.md`](../ayushdocs/19-GOALS-SLICES.md) · **Why:** [`../ayushdocs/18-PRODUCT-CONTEXT.md`](../ayushdocs/18-PRODUCT-CONTEXT.md)

Everything else under `Plans/` history is either gone from this tree or lives in **`archive/Plans/`**. Do not treat archived folders as authority.

---

## How to read (2 minutes)

| Order | Open | Role |
|------:|------|------|
| 1 | [`trustdata/README.md`](./trustdata/README.md) | Map of the trustdata folder |
| 2 | [`trustdata/INDEX.md`](./trustdata/INDEX.md) | Approach A, kill order, phases |
| 3 | [`trustdata/00-START.md`](./trustdata/00-START.md) | Unlock + approach record |
| 4 | Phase file under [`trustdata/phases/`](./trustdata/phases/) | How for one CP |
| 5 | [`trustdata/checkpoints/CHECKPOINTS.md`](./trustdata/checkpoints/CHECKPOINTS.md) | Pass / stop rules |
| 6 | Evidence under `results/planner/world-standard-wave/` | Proof (data wins) |

**Agent contract (short):** [`trustdata/checklists/AGENT-RULES.md`](./trustdata/checklists/AGENT-RULES.md)  
**Checkbox scoreboard (program):** [`trustdata/checklists/MASTER-CHECKLIST.md`](./trustdata/checklists/MASTER-CHECKLIST.md)

---

## Layout (on disk today)

```
Plans/
├── README.md                 ← you are here
├── plan-execution.md         ← pointer → trustdata
└── trustdata/                ← ONLY live program
    ├── README.md             ← folder map
    ├── INDEX.md              ← program index
    ├── 00-START.md           ← unlock / approach
    ├── LATER.md              ← not kill-path
    ├── RESEARCH-MAP.md
    ├── RESULTS-MAP.md
    ├── phases/               ← P01–P10
    ├── checkpoints/          ← CP table
    ├── checklists/           ← AGENT-RULES + MASTER
    └── reviews/              ← expert notes (not execution authority)
```

**Archived (not live):** `archive/Plans/` — including old `00-governance/`, `01-execution/`, `02-recovery/`, `07072026/`, etc.

---

## Authority order

1. Current owner message  
2. **`AGENTS.md`**  
3. **`Plans/trustdata/`** (INDEX → phase → CHECKPOINTS)  
4. World-standard design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`  
5. `ayushdocs/` (18 why · 19 scoreboard · 12 workflow · 10 residuals)

---

## Mode

- **Default:** Agent per `AGENTS.md` — targeted tests; evidence in `results/`; commit as you go; push/mirror when right.  
- **Bar:** Global manufacturer-planner standard · quality over speed.  
- **Agents:** `AGENTS.md` only.  
- **Ship / release gates:** `Failures.md` + `START.md` when claiming release.
