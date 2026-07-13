# Chrome DevTools CLI / Admin probe — 2026-07-13

## Request

- Try `chrome-devtools` CLI / `npx chrome-devtools-mcp` patterns.
- If Google Chrome missing, document FAIL honestly.
- If dev server on `localhost:3000` with `DEV_AUTH_BYPASS`, open `/admin/svg-editor` and `/admin/price-books`; snapshot notes; console issues.
- Do not mutate catalog. No commit.

## Verdict

**BLOCKED — admin pages not hit.**

Two independent blockers:

1. **Google Chrome stable not installed** (default channel for `chrome-devtools-mcp`).
2. **No HTTP server on localhost:3000** (conditional navigation path not entered).

Playwright Chromium is present and CDP works; that does **not** replace Google Chrome for the MCP stable channel claim, and it does not create a running Admin app without a server.

## Tool availability

| Tool / path | Result |
|-------------|--------|
| `chrome-devtools` on PATH | **FAIL** — command not recognized |
| `npx chrome-devtools-mcp@1.5.0 --help` | **OK** — MCP server CLI options print |
| `npx chrome-devtools-mcp@1.5.0 --version` | **OK** — `1.5.0` |
| Package description | MCP server for Chrome DevTools (stdio MCP host required; not a one-shot browse CLI) |
| Google Chrome stable | **FAIL** — missing at all standard Windows install paths |
| Microsoft Edge | Present: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |
| Playwright Chromium | Present: `%LOCALAPPDATA%\ms-playwright\chromium-1228\chrome-win64\chrome.exe` |

### Google Chrome paths checked (all MISSING)

- `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
- `C:\Users\AyushWeb\AppData\Local\Google\Chrome\Application\chrome.exe`
- `C:\Program Files\Chromium\Application\chrome.exe`

**Chrome path blocker (stable channel):** install Google Chrome stable, **or** point MCP at a custom binary via `--executablePath` (e.g. Playwright Chromium) / connect via `--browserUrl` after CDP launch.

### CDP smoke (Playwright Chromium only)

Headless Playwright Chromium with `--remote-debugging-port=9222`:

- `GET http://127.0.0.1:9222/json/version` → **OK**
- Browser string: `Chrome/149.0.7827.55`
- Tab: `about:blank`

This proves a Chromium channel can speak CDP on this host. It does **not** prove Admin UI.

### MCP CLI notes (from `--help`)

Useful flags if Chrome/server are fixed later:

- `--channel stable|beta|dev|canary` (default stable)
- `--executablePath <chrome.exe>`
- `--browserUrl http://127.0.0.1:9222`
- `--headless`, `--isolated`, `--viewport 1280x720`
- Not a direct “navigate URL and print snapshot” shell command without an MCP client session

## Auth / env (observed, not used for navigation)

| File | Setting |
|------|---------|
| `.env.local` | `DEV_AUTH_BYPASS=1` (and `DEV_AUTH_BYPASS_ALLOW_PRODUCTION=1`) |
| `site\.env.development.local` | `DEV_AUTH_BYPASS=1` |

Bypass is configured for local/dev work. **Unused this run** — no server answered.

## Pages hit

| URL | Result |
|-----|--------|
| `http://localhost:3000` | **FAIL** — unable to connect |
| `http://localhost:3000/admin/svg-editor` | **NOT HIT** — no server |
| `http://localhost:3000/admin/price-books` | **NOT HIT** — no server |

### Port scan

| Port | State |
|------|-------|
| 3000 | closed |
| 3001 | closed |
| 3002 | closed |
| 4173 | closed |
| 5173 | closed |

Some `node` processes exist on the machine; none served these ports.

### Snapshots / console

| Check | Result |
|-------|--------|
| DOM / a11y snapshot notes | **N/A** — pages not opened |
| Console errors / warnings | **N/A** — pages not opened |
| Network failures on Admin APIs | **N/A** |

Conditional from the task: *if* dev server is up with bypass → navigate Admin routes. **Server was not up.** No navigation attempted; no catalog touch.

## Blockers (actionable)

1. **Install Google Chrome stable** (or configure `chrome-devtools-mcp` with  
   `--executablePath "%LOCALAPPDATA%\ms-playwright\chromium-1228\chrome-win64\chrome.exe"`  
   or CDP `--browserUrl http://127.0.0.1:9222`).
2. **Start the site** so Admin is reachable, e.g. from repo root with existing `DEV_AUTH_BYPASS=1` env (do not invent new secrets; do not mutate catalog).
3. Re-run with an MCP host (or CDP client) against:
   - `http://localhost:3000/admin/svg-editor`
   - `http://localhost:3000/admin/price-books`
4. Capture: accessibility/DOM snapshot notes, console messages, failed requests.

## Alignment with known gap

Matches `Failures.md` gap **“Chrome DevTools MCP / Lighthouse a11y path blocked”**: no Google Chrome stable; Playwright Chromium ≠ default MCP Chrome channel. Playwright + axe remains the existing a11y evidence path (`agent-reports/2026-07-13-admin-playwright-live.md`), not this CLI run.

## Hygiene

- Catalog: **not mutated**
- Commit / push: **none**
- `pnpm run check:layout`: **OK** — no forbidden `site/` paths

## Honest claim

This run verified tooling and host preconditions only. It does **not** support any claim about Admin SVG editor or price-books UI, console health, or Lighthouse/a11y scores via Chrome DevTools MCP.
