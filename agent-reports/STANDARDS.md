# Work standard (owner bar)

Owner expects **far higher** than “agent said done.” This is binding for future work in this repo.

## Never claim

- PASS without **fresh command exit code** in the same session
- Deploy ready without: layout + lint + typecheck + **full** test + build + browser on changed routes
- Unit green as browser proof
- Old plan ticks / `results/` / prior reports as truth

## Always

1. **Evidence first** — command, exit, counts
2. **Multiple short reports** under `agent-reports/YYYY-MM-DD-*.md` + `INDEX.md` (≤40 lines each body)
3. **OPEN** for unverified; **FAIL** for fresh fail
4. **Finish user-visible issues** (color, layout, 1px) with browser measure, not CSS guess only
5. Subagents that change code: parent **re-runs** lint/typecheck/focused tests before status
6. Security > polish; fix IDOR before essays
7. One track to green before opening ten new tracks

## Report shape (every report)

```
# Title
Verdict: PASS | FAIL | OPEN
Evidence: commands + exits
Fixed / Found (bullets, paths)
Still open
```

## Deploy bar

| Required | Bar |
|----------|-----|
| Gates | layout, lint, typecheck, full test, build — all exit 0 |
| Security | no known Critical open |
| Browser | changed routes: load, no console errors, measured layout/color |
| A11y | no broken modal trap on new dialogs; touch ≥ 44px on new controls |
| Docs | stack truth only in `docs/`; no fake completion in plan |

Anything less is **not** high standard.
