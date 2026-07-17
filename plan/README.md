# Current execution

**Primary product plan:** Planner finish.  
**Plan shape:** each product track has a three-file set (Planner is the voice template).  
**Design:** `plan/_meta/DOC-SET-DESIGN.md` (Docs 1 — matrix, prefixes, roles).

## Track matrix

| Track | COMPLETION-CONTRACT (evidence wins) | FINISH-PLAN (checklists) | FEATURES (live code map) |
|-------|-------------------------------------|--------------------------|---------------------------|
| **Planner** | [`Planner/COMPLETION-CONTRACT.md`](./Planner/COMPLETION-CONTRACT.md) | [`Planner/FINISH-PLAN.md`](./Planner/FINISH-PLAN.md) | [`Planner/FEATURES.md`](./Planner/FEATURES.md) |
| **Admin** | [`Admin/COMPLETION-CONTRACT.md`](./Admin/COMPLETION-CONTRACT.md) | [`Admin/FINISH-PLAN.md`](./Admin/FINISH-PLAN.md) | [`Admin/FEATURES.md`](./Admin/FEATURES.md) |
| **Site** | [`Site/COMPLETION-CONTRACT.md`](./Site/COMPLETION-CONTRACT.md) | [`Site/FINISH-PLAN.md`](./Site/FINISH-PLAN.md) | [`Site/FEATURES.md`](./Site/FEATURES.md) |
| **TechStack** | [`TechStack/COMPLETION-CONTRACT.md`](./TechStack/COMPLETION-CONTRACT.md) | [`TechStack/FINISH-PLAN.md`](./TechStack/FINISH-PLAN.md) | [`TechStack/FEATURES.md`](./TechStack/FEATURES.md) |

### File roles

| File | Role | Authority |
|------|------|-----------|
| `COMPLETION-CONTRACT.md` | How to prove done; gates; PASS recipe; failure registry | Wins on **evidence** |
| `FINISH-PLAN.md` | Phase checklists, exit gates, execution order | Wins on **checkbox detail** |
| `FEATURES.md` | Feature → code path → honest gap | Wins on **what exists in code** |

### Status vocabulary (all tracks)

| Status | Meaning |
|--------|---------|
| **OPEN** | Unverified. Default. |
| **PASS** | Fresh evidence meets the track contract. |
| **FAIL** | Fresh check failed. |
| **PARTIAL** | Code (and maybe unit) exists; full proof missing. Checklist stays unchecked. |

Rules: live code wins. Unit ≠ browser. `results/` is not PASS proof. Plan ticks are not completion. **Lockfile wins** package versions. Disk is live SVG authority until cutover is proved.

### Failure ID prefixes

| Prefix | Track |
|--------|-------|
| **PF-** | Planner |
| **AF-** / **ADM-** | Admin (design = AF-; ADM-* aliases for auth/SVG slice) |
| **SF-** | Site |
| **TF-** / **TS-** | TechStack (prefer TF-; TS-n = TF-n for n≤22) |

### Phases

| Track | Phase ids |
|-------|-----------|
| Planner | P0–P17 |
| Admin | A0–A6 execution (FEATURES also maps code areas A0–A11) |
| Site | S0–S7 |
| TechStack | T0–T8 |

## Supporting facts (not plan authority)

| Purpose | File |
|---------|------|
| Doc-set design | `_meta/DOC-SET-DESIGN.md` |
| Stack engines / i18n / deps | `../docs/Lockedfiles/03-dependencies-engines-current.md` |
| Runtime architecture | `../docs/architecture/11-RUNTIME-ARCHITECTURE.md` |
| Security benchmark | `../docs/architecture/10-SECURITY-BENCHMARK.md` |
| Admin UI bar | `../docs/architecture/07-ADMIN-UI-BENCHMARK.md` |
| Site UI bar | `../docs/architecture/09-SITE-UI-BENCHMARK.md` |
| Planner UI bar | `../docs/architecture/06-UI-BENCHMARK.md` |
| DB-SVG target | `../docs/architecture/08-DATABASE-SVG-CONTRACT.md` |
| Domains | `../docs/architecture/02-DOMAINS.md` |
| Active blockers | `../Failures.md` |
| Facts and commands | `../Readme.md` |
| Track status (one file each) | `../agent-reports/{PLANNER,ADMIN,SITE,TECH-STACK}.md` |

## How to claim done

1. Track `COMPLETION-CONTRACT.md` evidence rules win over FEATURES gaps, bare checklist ticks, or stale reports.  
2. Flip status only with command + exit (and browser when UI is claimed) in the **same session**.  
3. Slice reports: `agent-reports/YYYY-MM-DD-{track}-{slice}.md` (short). Permanent rollups: one file per track under `agent-reports/`.  
4. Never invent PASS. Never use `results/` alone as proof.

**Security** is a cross-cutting bar (`10-SECURITY-BENCHMARK.md`). No Security plan trio in this matrix yet.

Until owner acceptance on a track: that track **Status remains OPEN**.
