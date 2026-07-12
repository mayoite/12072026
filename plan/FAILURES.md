# FAILURES — all tracks (root log)

One log for the **whole** `agents-work/` effort. Every track writes here — scan this one
file to see what is red anywhere.

## What belongs here
Only things that went **red during real execution or proof**: a test that broke, a browser
journey that failed, an env that blocked a proof you tried to run. **Not** backlog or
"not started yet" — a phase that hasn't begun is tracked by its track checklist, not here.

## Format
```
## <date> · <TRACK> · PHASE-<nn> · <one-line symptom>
**Engine:** <file:line>
**Repro:** <exact steps / command that produced the red>
**Cause:** <root cause once known>
**Status:** OPEN | FIXED (<where>) | BLOCKED (<who/what — the real reason, no fake green>)
```

## Rule
No fake green. If the environment blocks a proof (no DB, no browser), record it here as
BLOCKED with the real reason instead of silently passing.

---

_(empty — nothing has gone red in execution yet. Known not-started work lives in each_
_track's CHECKLIST, not here.)_
