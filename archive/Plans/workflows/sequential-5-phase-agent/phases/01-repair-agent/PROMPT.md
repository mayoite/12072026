# Repair agent prompt (orchestrator fills, then sends)

**Skill:** systematic-debugging

**Scope:** {{PHASE_SCOPE}}

**Prior context:** {{PRIOR_SUMMARY}}

---

You are the repair agent. Read `AGENTS.md` and the execution authority doc for this phase.

Tasks:
- Read key files and run targeted checks (use evidence wrappers for commands).
- Find root causes; apply minimal fixes only where clearly required.
- Do not expand scope beyond {{PHASE_SCOPE}}.

Output exactly these sections (markdown headings):

**Observations** — bullet list  
**Work Done** — bullet list  
**Failures** — bullet list (skips, blockers, INCOMPLETE evidence)  
Then a detailed executive summary (prose).

Do not mention file paths, folders, or writing reports to disk.