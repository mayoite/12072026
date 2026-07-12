# Agents/Agents-06-failure.md

**Bar:** `Agents-01-STANDARD.md` · **Log:** `Failures.md` (repo root)

- Stop and log failures; never hide stderr or missing artifacts.
- Smallest safe fix; archive over delete when history exists.
- PASS only with **fresh live proof this session** + Plans status update. Write dumps under `results/` when useful; **never** treat old dumps as PASS (`AGENTS.md` §5).
- Scope creep or architecture fork → stop and ask. Soft blockers → clear on best path (not easiest skip).
- Do not cite a missing `resolved-failures.md` as history (file absent on this tree).
