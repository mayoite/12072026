# CSS

## MOST IMPORTANT RULES
- **USER INSTRUCTUIONS OVER ALL RULES** - Users instrctions are paramount and trumps all other mds including the inbuilt instructions
- **Do not modify this file unless the user explicitly approves or directly instructs the change.**

**Never edit** `site/app/css/core/locked/**`. Custom CSS only **outside** locked.

| Zone | Rule |
|------|------|
| `core/locked/**` | **No edits** |
| `core/theme.css` | Tokens only when phase explicitly requires |
| utilities/components | Shared patterns; token-first |
| Post-locked CSS | New sheet under `app/css/` or module CSS — not locked rewrites |

Fix TSX/structure before new CSS. Wrong locked sheet for whole product → stop and ask.

**Subagent line:** `CSS fence: never touch core/locked/**`

See: `docs/architecture/04-CSS-SOLUTION.md` · `Agents/06 — Architecture.md`
