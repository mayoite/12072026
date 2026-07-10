# Agents/Agents-css.md — CSS ownership & locked fence

**Authority:** Owner standing rule (2026-07-10). Complements `Agents-architecture.md` and `site/docs/architecture/CSS-SOLUTION.md`.  
**Why this exists:** Agents kept rewriting surface CSS ad hoc. Owner put a **hard stop** at the locked folder. That is intentional — not “wrong architecture.”

---

## 1. Stack (unconventional on purpose)

```text
site/app/css/
  index.css                    # shared entry: theme → utilities → components
  core/
    theme.css                  # @theme tokens — single source
    utilities/*                # typography, layout, colors, schemes, …
    components/*               # shared patterns (extract on 3rd use)
    locked/{site|admin|planner}/   # surface modules — FENCED
```

| Layer | Path | Role |
|-------|------|------|
| Tokens | `core/theme.css` | Design tokens only |
| Shared | `core/utilities/*`, `core/components/*` | Reusable patterns |
| **Locked** | `core/locked/{site\|admin\|planner}/` | Shell / route surfaces — **do not thrash** |

Layouts import locked bundles (e.g. `locked/site/index.css`, `locked/planner/open3d-workspace.css`). Details: `site/app/css/core/locked/README.md`.

---

## 2. Hard rule for every agent

| Zone | Agent may |
|------|-----------|
| **`site/app/css/core/locked/**`** | **NO edits.** No “quick fix,” no hardcode dump, no drive-by polish. |
| `core/theme.css` | Only if owner/phase **explicitly** requires token change. Prefer reusing existing tokens. |
| `core/utilities/*`, `core/components/*` | Yes — when a pattern is shared / 3rd use; keep token-first. |
| **Post-locked custom CSS** | Yes if needed: new non-locked sheet under `app/css/` (not under `locked/`), co-located `*.module.css` where that pattern already exists (e.g. open3d modules), or route-local import that does **not** rewrite locked files. Hardcoded values OK only there when no token covers a **local** fix. |
| TSX | Structure + semantic classes + existing utilities; no inventing a second design system. |

**Conflict:** Owner message wins. Without explicit unlock, **locked stays frozen.**

---

## 3. What to do instead of editing locked

1. Prefer existing classes / `var(--…)` / utilities already on the surface.  
2. Fix structure in TSX (layers, `key` on images, isolation) before new CSS.  
3. If paint is still wrong → **non-locked** custom CSS targeting the same class names (higher specificity OK), not a rewrite of the locked sheet.  
4. If the bug is truly “locked sheet is wrong for the whole product” → **stop and ask** (goal/architecture), do not silent-edit locked.

---

## 4. Subagent briefs (copy)

```
CSS fence: NEVER modify site/app/css/core/locked/**.
Theme/tiling already defined — use tokens + existing utilities.
Custom CSS only outside locked if required. Proof in results/.
```

---

## 5. Related

| Doc | Role |
|-----|------|
| `site/docs/architecture/CSS-SOLUTION.md` | Product CSS strategy |
| `site/app/css/core/locked/README.md` | Locked path map |
| `Agents/Agents-architecture.md` | Broader architecture bar |
| `Agents/Agents-browser.md` | UI proof via browser |
