/**
 * P03 Chrome DevTools W3 live eyes — place → select → Delete → Ctrl+Z
 * Drives chrome-devtools CLI (MCP daemon) against localhost:3000 guest planner.
 */
import { spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVIDENCE = __dirname;
const CDM = path.join(
  EVIDENCE,
  "_cdm",
  "node_modules",
  ".bin",
  process.platform === "win32" ? "chrome-devtools.cmd" : "chrome-devtools",
);
const URL = "http://127.0.0.1:3000/planner/guest/?plannerDevTools=1";
const logLines = [];

function log(msg) {
  const line = `${new Date().toISOString()} ${msg}`;
  logLines.push(line);
  console.log(line);
}

function cdm(args, { timeout = 120_000 } = {}) {
  const r = spawnSync(CDM, args, {
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: true,
  });
  const out = `${r.stdout || ""}${r.stderr || ""}`;
  if (r.error) throw r.error;
  return out;
}

function ensureDaemon() {
  const st = cdm(["status"]);
  if (!/is running/i.test(st)) {
    log("starting chrome-devtools daemon (headed, isolated)");
    cdm(["start", "--headless", "false", "--isolated", "true"]);
  } else {
    log("daemon already running");
  }
}

function listPages() {
  return cdm(["list_pages"]);
}

function selectPlanner() {
  let pages = listPages();
  let m = pages.match(/^(\d+):\s+.*planner\/guest/m);
  if (!m) {
    log("navigating to guest planner");
    cdm(["navigate_page", "--url", URL, "--timeout", "120000"]);
    pages = listPages();
    m = pages.match(/^(\d+):\s+.*planner\/guest/m);
  }
  if (!m) throw new Error(`planner page not found\n${pages}`);
  cdm(["select_page", m[1], "--bringToFront", "true"]);
  return m[1];
}

function evalScript(fnSource) {
  selectPlanner();
  return cdm(["evaluate_script", fnSource]);
}

function parseJsonFromEval(out) {
  const m = out.match(/```json\s*([\s\S]*?)\s*```/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return m[1];
  }
}

function bodyText() {
  const out = evalScript("() => document.body ? document.body.innerText : ''");
  const v = parseJsonFromEval(out);
  return typeof v === "string" ? v : String(out || "");
}

function furnitureCount() {
  const t = bodyText();
  const m = t.match(/(\d+)\s+furniture/i);
  return m ? Number.parseInt(m[1], 10) : -1;
}

function hasNoSelection() {
  return /No Selection/i.test(bodyText());
}

function snapshot() {
  selectPlanner();
  return cdm(["take_snapshot"]);
}

function uidFor(snap, re) {
  const m = snap.match(re);
  return m ? m[1] : null;
}

function clickUid(uid) {
  selectPlanner();
  return cdm(["click", uid]);
}

function pressKey(key) {
  selectPlanner();
  return cdm(["press_key", key]);
}

function screenshot(name) {
  selectPlanner();
  const fp = path.join(EVIDENCE, name);
  cdm(["take_screenshot", "--filePath", fp, "--format", "png"]);
  log(`screenshot ${name} furniture=${furnitureCount()}`);
}

async function sleep(ms) {
  await delay(ms);
}

async function waitFor(predicate, { timeoutMs = 30_000, label = "cond" } = {}) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = predicate();
    if (last) return last;
    await sleep(750);
  }
  throw new Error(`timeout waiting for ${label}; last=${JSON.stringify(last)}`);
}

async function main() {
  if (!fs.existsSync(CDM)) throw new Error(`missing ${CDM}`);
  ensureDaemon();
  selectPlanner();

  // Soft reload to ensure clean client hydrate
  cdm(["navigate_page", "--type", "reload", "--ignoreCache", "true", "--timeout", "120000"]);
  await sleep(2000);
  selectPlanner();

  await waitFor(
    () => /INVENTORY|Systems configurator|\d+\s+furniture/i.test(bodyText()),
    { timeoutMs: 120_000, label: "planner ready" },
  );
  log("planner ready");

  const before = furnitureCount();
  log(`furnitureBefore=${before}`);
  if (before < 0) throw new Error("could not read furniture count");

  let snap = snapshot();
  fs.writeFileSync(path.join(EVIDENCE, "snap-before-place.txt"), snap, "utf8");

  let placeUid = uidFor(snap, /uid=(\w+)\s+button "Place 4 seats"/);
  if (!placeUid) {
    const cfgUid =
      uidFor(snap, /uid=(\w+)\s+button "SYSTEMS CONFIGURATOR"/) ||
      uidFor(snap, /uid=(\w+)\s+button "Systems configurator[^"]*"/);
    log(`expand configurator uid=${cfgUid}`);
    if (!cfgUid) throw new Error("Systems configurator button not found");
    clickUid(cfgUid);
    await sleep(1000);
    snap = snapshot();
    fs.writeFileSync(
      path.join(EVIDENCE, "snap-config-expanded.txt"),
      snap,
      "utf8",
    );
    placeUid = uidFor(snap, /uid=(\w+)\s+button "Place 4 seats"/);
  }
  log(`placeUid=${placeUid}`);
  if (!placeUid) throw new Error("Place 4 seats not found after expand");
  clickUid(placeUid);
  log("clicked Place 4 seats");

  const afterPlace = await waitFor(
    () => {
      const c = furnitureCount();
      log(`place-poll count=${c}`);
      return c > before ? c : null;
    },
    { timeoutMs: 30_000, label: "furniture after place" },
  );
  log(`afterPlace=${afterPlace}`);
  screenshot("01-placed.png");

  snap = snapshot();
  const selectUid =
    uidFor(snap, /uid=(\w+)\s+button "Select \(V\)"/) ||
    uidFor(snap, /uid=(\w+)\s+button "Select"/);
  log(`selectUid=${selectUid}`);
  if (selectUid) clickUid(selectUid);
  await sleep(400);

  const clickFn = `() => {
    const c = document.querySelector("canvas");
    if (!c) return { ok: false, reason: "no-canvas" };
    const r = c.getBoundingClientRect();
    const pts = [[0.5, 0.5], [0.45, 0.45], [0.55, 0.5], [0.4, 0.55], [0.5, 0.4]];
    for (const [fx, fy] of pts) {
      const x = r.left + r.width * fx;
      const y = r.top + r.height * fy;
      const o = {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        button: 0,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
      };
      c.dispatchEvent(new PointerEvent("pointerdown", o));
      c.dispatchEvent(new PointerEvent("pointerup", o));
      c.dispatchEvent(new MouseEvent("mousedown", o));
      c.dispatchEvent(new MouseEvent("mouseup", o));
      c.dispatchEvent(new MouseEvent("click", o));
    }
    return { ok: true, w: r.width, h: r.height };
  }`;
  log(`canvasClick=${evalScript(clickFn)}`);
  await sleep(1000);

  await waitFor(() => !hasNoSelection(), {
    timeoutMs: 15_000,
    label: "selection active",
  });
  log("selected=true");
  screenshot("02-selected.png");

  pressKey("Delete");
  log("pressed Delete");
  const afterDelete = await waitFor(
    () => {
      const c = furnitureCount();
      log(`delete-poll count=${c}`);
      return c >= 0 && c < afterPlace ? c : null;
    },
    { timeoutMs: 20_000, label: "furniture after delete" },
  );
  log(`afterDelete=${afterDelete}`);
  screenshot("03-deleted.png");

  pressKey("Control+z");
  log("pressed Ctrl+Z");
  const afterUndo = await waitFor(
    () => {
      const c = furnitureCount();
      log(`undo-poll count=${c}`);
      return c > afterDelete ? c : null;
    },
    { timeoutMs: 20_000, label: "furniture after undo" },
  );
  log(`afterUndo=${afterUndo}`);
  screenshot("04-undone.png");

  const pass =
    afterPlace > before &&
    afterDelete < afterPlace &&
    afterUndo > afterDelete;

  const result = {
    verdict: pass ? "PASS" : "FAIL",
    fabric: "OFF (NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE unset)",
    url: URL,
    tool: "chrome-devtools CLI (MCP daemon, headed)",
    furnitureBefore: before,
    furnitureAfterPlace: afterPlace,
    furnitureAfterDelete: afterDelete,
    furnitureAfterUndo: afterUndo,
    screenshots: [
      "01-placed.png",
      "02-selected.png",
      "03-deleted.png",
      "04-undone.png",
    ],
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(EVIDENCE, "run.json"),
    JSON.stringify(result, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(EVIDENCE, "run-w3-chrome.log"),
    logLines.join("\n"),
    "utf8",
  );

  const md = `# chrome-devtools W3 — select → delete → undo (live eyes)

**Date:** ${new Date().toISOString()}  
**Checkout:** \`D:\\\\OandO07072026\`  
**Seat:** Chrome DevTools seat (1) — live eyes  
**Tool:** chrome-devtools CLI / MCP daemon (headed, isolated)  
**URL:** \`${URL}\`  
**Fabric:** OFF (\`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE\` unset)

## Verdict: **${pass ? "PASS" : "FAIL"}**

| Step | Furniture count |
|------|-----------------|
| Before place | ${before} |
| After place (configurator Place 4 seats) | ${afterPlace} |
| After Delete | ${afterDelete} |
| After Ctrl+Z | ${afterUndo} |

## Screenshots

| File | Role |
|------|------|
| \`01-placed.png\` | After place |
| \`02-selected.png\` | After Select tool + canvas pick |
| \`03-deleted.png\` | After Delete |
| \`04-undone.png\` | After Ctrl+Z |

## Flow

1. Guest planner open (\`/planner/guest/?plannerDevTools=1\`)
2. Expand Systems configurator (if collapsed)
3. Click **Place 4 seats**
4. Select tool (V) + canvas click
5. **Delete** key
6. **Ctrl+Z**

## Honesty

- Live chrome-devtools browser automation — not Playwright exit code alone.
- FAIL if place/select/delete/undo counts do not move as above.
- Product select/delete thrash: none (eyes-only seat).

## Log

See \`run-w3-chrome.log\` and \`run.json\`.
`;
  fs.writeFileSync(path.join(EVIDENCE, "chrome-devtools-w3.md"), md, "utf8");

  log(`VERDICT=${result.verdict}`);
  if (!pass) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  try {
    fs.writeFileSync(
      path.join(EVIDENCE, "chrome-devtools-w3.md"),
      `# chrome-devtools W3 — FAIL\n\n${String(err?.stack || err)}\n`,
      "utf8",
    );
    fs.writeFileSync(
      path.join(EVIDENCE, "run-w3-chrome.log"),
      logLines.concat(String(err?.stack || err)).join("\n"),
      "utf8",
    );
  } catch {
    /* ignore */
  }
  process.exit(1);
});
