# Agents/Agents-docs.md

## 1. Authority
- **Docs:** Read `../docs/Lockedfiles/ReadmeLocked.md` (locked repo facts).

## 2. Synchronization
- **Live Facts Only:** Write docs based on verified live state, never intent.
- **No Implementation Speculation:** Keep architectural docs focused on structures. No massive code blocks.
- **Respect Locks:** Do not edit "Locked" files without explicit `Agents-Plan.md` workflow.

## 3. Generators
- **No Hand-Edits:** If auto-generated (e.g. `tech-stack-generator/`), edit the source generator, not the output.

## 4. Archiving
- **Archive Over Delete:** Move obsolete documentation to `../archive/`. Do not mix active and archive references.

## 5. Escalation
- **Massive Mismatch = Stop:** If live code entirely contradicts docs, STOP and report. Do not silently rewrite the stack.
