# Agents/Agents-architecture.md

## 1. Authority
- **Docs:** Cross-reference `../docs/architecture/` and `../Readme.md`.

## 2. Constraints
- **No Rogue Patterns:** Obey Drizzle for DB and Vanilla CSS/Tokens (`theme.css`). No Tailwind or new state managers without explicit command.
- **Respect Boundaries:** Adhere to `../docs/architecture/MODULE-LAYOUT.md`.

## 3. Proposal Phase
- **Plan First:** STOP and write an explicit architecture proposal via `Agents-Plan.md`.
- **No Silent Action:** Detail exact structural changes and why they adhere to `../Readme.md`.

## 4. Execution
- **Minimal Increment:** Isolate changes to what is strictly required. Do not refactor the world.
- **Convention Override:** Only break conventions if explicitly approved.

## 5. Escalation
- **Cascading Changes = Stop:** If a change impacts core shared libraries or other modules, STOP and ask.
