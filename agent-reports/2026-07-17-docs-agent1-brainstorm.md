# Docs Agent 1 — doc-set brainstorm

**Verdict:** PASS (design only)  
**Output:** `plan/_meta/DOC-SET-DESIGN.md`

## Decisions

1. Mirror Planner trio: COMPLETION-CONTRACT (evidence wins) · FEATURES (code map) · FINISH-PLAN (checklists).
2. Matrix: Admin create contract+plan, refresh FEATURES; Site create FINISH-PLAN, light refresh; TechStack create FEATURES+FINISH-PLAN, light contract refresh; Planner untouched template.
3. Status vocabulary: OPEN / PASS / FAIL / PARTIAL only. No fake PASS; live code wins; unit ≠ browser; `results/` not proof.
4. Failure prefixes: PF / AF / SF / TF. TechStack migrates TS→TF with alias map.
5. Phases: Admin A0–A9 (isolation→author→publish→lifecycle→families→prices→DB-SVG→security→browser→release); Site keep S0–S7; TechStack keep T0–T8.
6. Scope follows product loop + `02-DOMAINS.md`. TechStack = toolchain/engines/gates only.
7. Cross-links: architecture docs, Failures.md (active only), agent-reports short+INDEX, plan/README after trios land.
8. Writers: short sentences; seed AF from FEATURES/benchmarks without inventing features; retire missing PHASES/CHECKLIST as authority.

## Not done

- Domain trios (Docs 2–4). README index (Docs 5).
