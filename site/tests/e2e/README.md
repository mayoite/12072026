# E2E and proper fixes

Use this before calling a UI or planner change **done**. Goal: ship fixes that hold in **production builds**, under **real tests**, without hidden regressions.

Commands and gate policy: `START.md` (Playwright), `Failures.md`, `AGENTS.md` (Gates).

---

## Proper fix vs risky fix

| Proper fix | Risky / temp fix |
|------------|------------------|
| Matches the **contract** tests and a11y tree expect (role, name, behavior) | Changes the test to match broken UI without fixing users/screen readers |
| Traces **call chain** (setup → runtime check → render) | Adds env/config that nothing in code reads |
| Works in **production build** (`build && start` — how Playwright runs) | Only verified in `next dev` |
| One **named type** or helper at library boundaries | `as any`, `@ts-ignore`, or silent `eslint-disable` |
| Smallest diff that fixes **root cause** | Symptom patch (retry, timeout bump, `waitForTimeout` only) |
| Evidence: command output attached or noted in `Failures.md` | “Should work” / “looks fine locally” |

**Planner example (tool rail):** Removing `role="toolbar"` from `<nav>` was proper — tests used `getByRole("navigation")`, which is the implicit role of `<nav>`. Changing the spec to `toolbar` without fixing markup would have been a temp fix that leaves IA wrong for assistive tech.

---

## Pre-ship checklist (copy per task)

```
TASK:
CLAIM (one falsifiable sentence):
PROVE WRONG IN 60s (rg / open function / one test):
FILES TOUCHED (list paths — grep symbols, not filenames):
DONE WHEN (commands + exit code):
SKIPPED (and why):
RISKS LEFT:
```

Run before “done” when the change touches UI, planner, or E2E helpers:

1. **Symbol grep** — find every use, not just the file you were told to read:
   ```powershell
   cd site
   rg "YourSymbolOrString" .
   ```
2. **Who calls this?** — `rg "import.*YourModule"` or `rg "functionName"`.
3. **What do tests assert?** — read the spec *and* shared helpers (`plannerCanvasHelpers.ts`, `site-ui-helpers.ts`, `guestProjectSetup.ts`).
4. **Production path** — planner E2E uses `pnpm run build && pnpm run start`, not dev. `NODE_ENV` is production; query params and `NEXT_PUBLIC_*` (at build time) matter.
5. **Typecheck + lint** — from repo root:
   ```powershell
   pnpm --filter oando-site run typecheck
   pnpm run lint --max-warnings=0
   ```
6. **Relevant Playwright** — run the spec that owns the contract, not only the happy path you edited:
   ```powershell
   cd site
   pnpm exec playwright test tests/e2e/planner-chrome.spec.ts --reporter=line --config config/build/playwright.config.ts
   ```

Log blockers and skips in `Failures.md` per `AGENTS.md`.

---

## Hidden issues — how they slip through

### Wrong file, right feature

Filenames mislead. Always grep the **symbol**:

```powershell
rg "__plannerFabricView" features/
rg "isPlannerDevToolsEnabled" features/
```

Example: `__plannerFabricView` is set in `features/planner/canvas/PlannerFabricStage.tsx`.

### Locator vs behavior

| Failure kind | Check first |
|--------------|-------------|
| Timeout on `getByRole` / `getByLabel` | Chrome DevTools → **Accessibility** pane → **Role** and **Name** on the node |
| Action runs but wrong canvas/state | App logic, stores, Fabric hooks — not the locator |
| Flaky pass/fail | Race, animation, missing `await`, pool/DB — not “add 5s timeout” as the only fix |

### Env and flags

Trace the full chain:

```
test setup (guestProjectSetup, playwright.config)
  → runtime guard (e.g. isPlannerDevToolsEnabled)
    → UI render (#planner-tool-visibility-mode)
```

Setting `NEXT_PUBLIC_*` in Playwright only helps if the **client code reads it** and the **build** saw the var. Guest E2E also uses `?plannerDevTools=1` in `guestProjectSetup.ts`.

### Type escapes

Red flags in diffs:

```powershell
rg "as any|@ts-ignore|eslint-disable" features/planner/ tests/
```

Prefer patterns already in planner canvas code:

- `PlannerFabricObject` (`floorplanCanvasTypes.ts`) for Fabric `.name` / `.id`
- `as unknown` + narrow for JSON/`window` test hooks — not `as any`
- Type guards for union selects (e.g. `PlannerToolVisibilityMode`)

### One bug, many failing tests

A single broken landmark locator can fail every test that clicks a tool. Fix the **shared contract** once (component or helper), then re-run the whole spec file.

---

## Planner E2E contracts

| Helper / setup | Contract |
|----------------|----------|
| `guestProjectSetup.enterGuestPlannerWorkspace` | Navigates to `/planner/guest/?plannerDevTools=1`; clears planner storage unless `preservePlannerState` |
| `plannerToolButton(page, name)` | `getByRole("navigation", { name: "Drawing tools" })` then button by accessible name |
| `setToolVisibilityMode` | `#planner-tool-visibility-mode` visible when dev tools enabled; labels **Balanced**, **Step-focused**, **All tools** |
| `window.__plannerFabricView` | Set only when `navigator.webdriver` (Playwright); used by canvas position helpers — do not remove |

Tool rail markup (`PlannerToolRail.tsx`):

- `<nav aria-label="Drawing tools">` — no `role="toolbar"` on the outer `<nav>` (overrides implicit `navigation`)
- Groups: `role="group"` + `aria-label`
- Tools: `<button>` + `aria-label` / `aria-pressed`

Visibility labels (`plannerToolVisibility.ts`):

- `balanced` → `"Balanced"`
- `step` → `"Step-focused"`
- `all` → `"All tools"`

---

## Debugging a failing `getByRole`

1. Open the page under test (guest URL with `?plannerDevTools=1` if needed).
2. Inspect the element → **Accessibility**: note **Role** and **Name**.
3. Compare to the helper/spec exactly (role string, name string or regex).
4. Fix **component** first (`aria-label`, remove conflicting `role`, visibility).
5. Change the spec only if the component is correct and the selector was genuinely wrong — document why.

---

## Commands (quick reference)

From repo root unless noted:

```powershell
pnpm --filter oando-site run test:browsers:install   # once
pnpm --filter oando-site run typecheck
pnpm run lint --max-warnings=0

cd site
pnpm exec playwright test tests/e2e/planner-chrome.spec.ts --reporter=line --config config/build/playwright.config.ts
pnpm exec playwright test tests/e2e/planner-custom-tools.spec.ts --reporter=line --config config/build/playwright.config.ts
pnpm exec playwright test tests/e2e/planner-guest-workspace.spec.ts --reporter=line --config config/build/playwright.config.ts
```

Playwright config: `site/config/build/playwright.config.ts` (production build webServer).

### CSS bundle boundaries (marketing)

| Bundle | Loaded from | Purpose |
|--------|-------------|---------|
| `site-marketing.css` | `(site)/layout.tsx`, `planner/layout.tsx` | `site-surfaces` + `marketing-primitives` (shared shells, sections, hero CTAs, teaser) |
| `homepage-sections.css` | `(site)/page.tsx` only | `@reference` main Tailwind entry; showcase carousel, trust KPI, projects band, planner demo |
| `planner/.../marketing.css` | `planner/layout.tsx` | Planner landing (includes `planner-landing.css`) |

Do not add `/`-only section CSS to `marketing-primitives.css`. See `Failures.md` UI backlog Batch 2.

---

## When to stop and ask

- Fix needs more files or behavior than the task described.
- Root cause unclear after grep + one failing test + a11y check.
- Only fix available is `as any`, skipping tests, or lowering thresholds — escalate instead of shipping.

Proper fixes are usually boring: correct role, correct type, correct env chain, green commands. That is the bar.

---

## Skips, green CI, and “really passing”

**Green CI means the checks that ran passed.** It does not automatically mean the product is safe.

| Action | Honest? | What it actually means |
|--------|---------|-------------------------|
| Fix root cause, tests green | Yes | Contract still holds |
| `test.skip` / commented assertion / `.only` left in | No (if undeclared) | That check was removed |
| Loosen matcher until red → green | No | Test may no longer catch the bug |
| Skip in code, no `Failures.md` entry | No | Hidden debt; next person trusts CI |

**Legitimate skip** (still log it):

- Narrow scope (one spec, one env limitation) with reason + owner + follow-up issue
- Documented in `Failures.md` under **Skipped** or open table with `[!]` blocked
- Time-bounded (“until DB fixture lands”) — not “indefinite so we can merge”

**Illegitimate skip** (treat as open bug):

- “Make CI green” without fixing behavior
- Skip because diagnosis is hard / you’re tired — **capture in backlog instead** (see below), don’t silently skip

This repo: `AGENTS.md` — **Skipped = say skipped.** Never imply a check passed when it didn’t.

Audit for hollow tests (optional):

```powershell
cd site
pnpm exec tsx scripts/find-fake-tests-ast.ts
```

---

## When you’re tired or can’t diagnose — still don’t fake green

Fatigue feels like “I’m bad at this.” Often it’s **too many open lanes** (planner UI, marketing site-ui, release gate, admin). Use **capture now, fix in batches** — not skip-and-forget.

### Step 1 — Capture one row (5 minutes)

Add to the **UI / quality backlog** table in `Failures.md` (section below). You do **not** need root cause yet.

| Field | Example |
|-------|---------|
| **Symptom** | “About page card spacing wrong on mobile” |
| **Repro** | URL + viewport, or command that fails |
| **Evidence** | Screenshot path, Playwright trace, or “not run — tired” |
| **Lane** | `planner` / `marketing-site-ui` / `admin` / `gate` |
| **Severity** | user-visible / test-only / cosmetic |
| **Proposal** | “Fix in batch X” or “needs pairing” |

### Step 2 — Propose a fix track (not a single hero fix)

Pitch **batches** to whoever owns merges — issue, doc, or short message:

```
## UI quality batch — proposal

**Problem:** CI / UI debt is mixed; some fixes are hidden behind skips or unrun gates.

**Goal:** Honest green — fixes root cause, skips only with Failures.md entry.

**Batch 1 (evidence):** Run ___ ; list failures with links/traces (no code yet).
**Batch 2 (contracts):** Fix shared helpers / a11y / tokens — one lane.
**Batch 3 (gate):** Re-run owning specs; update Failures.md resolved/skipped.

**Out of scope this round:** ___ 
**Ask:** ___ hours / review / no skip-without-log policy
```

Smallest shippable batch wins. Planner tool-rail was **one attribute** — not a rewrite.

### Step 3 — One lane per week (protect energy)

| Lane | Owning check | When stuck |
|------|----------------|------------|
| Planner E2E | `planner-chrome`, `planner-custom-tools`, `planner-guest-workspace` | `site/tests/e2e/README.md` + a11y pane |
| Marketing site-ui | `test:site-ui`, `check:site-ui:*` | `plans/site-ui-uniformity-10-file-plan/` |
| Full gate | `Failures.md` release gate row | `release:gate:fast` first, not full gate cold |

**If you can’t diagnose today:** log the row in `Failures.md`, run **one** repro command tomorrow, stop. That’s working for your career, not failing the project.

### Step 4 — Team norm (one sentence)

> “Green means the check ran and passed; skips go in Failures.md with a reason. We don’t max out suites by deleting assertions.”

You’re not being picky — you’re asking for **honest signal**.
