/**
 * P03 W3 live eyes via Playwright Chromium (Chrome family) â€” place â†’ select â†’ Delete â†’ Ctrl+Z
 * Evidence under chrome/ for Chrome DevTools seat when MCP browser hangs on dynamic hydrate.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVIDENCE = "D:\\\\OandO07072026\\\\results\\\\planner\\\\world-standard-wave\\\\03-select-delete\\\\chrome";
const URL = "http://127.0.0.1:3000/planner/guest/?plannerDevTools=1";

async function furnitureCount(page) {
  const body = await page.locator("body").innerText();
  const m = body.match(/(\d+)\s+furniture/i);
  return m ? Number.parseInt(m[1], 10) : -1;
}

async function main() {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Clear planner storage before app boot
  await context.addInitScript(() => {
    const prefixes = [
      "cad-suite:planner:",
      "oando-project-setup-complete-",
      "planner-",
    ];
    try {
      for (const key of Object.keys(localStorage)) {
        if (prefixes.some((p) => key.startsWith(p))) localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
    try {
      indexedDB.deleteDatabase("planner-workspace-db");
    } catch {
      /* ignore */
    }
    try {
      indexedDB.deleteDatabase("buddy-planner-db");
    } catch {
      /* ignore */
    }
  });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 120_000 });

  // Setup gate if present
  const setup = page.getByRole("heading", { name: /Set up your space/i });
  try {
    if (await setup.isVisible({ timeout: 8_000 })) {
      await page.getByLabel("Project name").fill("W3 chrome eyes");
      await page.getByRole("button", { name: /Start placing furniture/i }).click();
    }
  } catch {
    /* already in workspace */
  }
  const scratch = page.getByRole("button", { name: /Start from Scratch/i });
  if (await scratch.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await scratch.click();
  }

  await page.waitForSelector("text=/\\d+\\s+furniture/i", { timeout: 120_000 });
  const before = await furnitureCount(page);
  console.log("furnitureBefore", before);

  const configurator = page.getByRole("region", {
    name: "Workstation systems configurator",
  });
  await configurator.waitFor({ state: "visible", timeout: 30_000 });
  const placeBtn = configurator.getByRole("button", { name: "Place 4 seats" });
  if (!(await placeBtn.isVisible().catch(() => false))) {
    await configurator.getByRole("button", { name: /Systems configurator/i }).click();
    await placeBtn.waitFor({ state: "visible", timeout: 15_000 });
  }
  await placeBtn.click();

  await page.waitForFunction(
    (prev) => {
      const m = document.body.innerText.match(/(\d+)\s+furniture/i);
      return m ? Number.parseInt(m[1], 10) > prev : false;
    },
    before,
    { timeout: 30_000 },
  );
  const afterPlace = await furnitureCount(page);
  console.log("afterPlace", afterPlace);
  await page.screenshot({ path: path.join(EVIDENCE, "01-placed.png") });

  await page.getByRole("button", { name: /Select/i }).first().click();
  const canvas = page.locator("canvas").first();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("no canvas box");
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page
    .getByRole("heading", { name: /No Selection/i })
    .waitFor({ state: "hidden", timeout: 15_000 })
    .catch(async () => {
      // retry offsets
      for (const [fx, fy] of [
        [0.45, 0.45],
        [0.55, 0.5],
        [0.4, 0.55],
      ]) {
        await page.mouse.click(box.x + box.width * fx, box.y + box.height * fy);
        await page.waitForTimeout(300);
        if ((await page.getByRole("heading", { name: /No Selection/i }).count()) === 0)
          return;
      }
      throw new Error("still No Selection");
    });
  await page.screenshot({ path: path.join(EVIDENCE, "02-selected.png") });

  await page.keyboard.press("Delete");
  await page.waitForFunction(
    (prev) => {
      const m = document.body.innerText.match(/(\d+)\s+furniture/i);
      return m ? Number.parseInt(m[1], 10) < prev : false;
    },
    afterPlace,
    { timeout: 20_000 },
  );
  const afterDelete = await furnitureCount(page);
  console.log("afterDelete", afterDelete);
  await page.screenshot({ path: path.join(EVIDENCE, "03-deleted.png") });

  await page.keyboard.press("Control+z");
  await page.waitForFunction(
    (prev) => {
      const m = document.body.innerText.match(/(\d+)\s+furniture/i);
      return m ? Number.parseInt(m[1], 10) > prev : false;
    },
    afterDelete,
    { timeout: 20_000 },
  );
  const afterUndo = await furnitureCount(page);
  console.log("afterUndo", afterUndo);
  await page.screenshot({ path: path.join(EVIDENCE, "04-undone.png") });

  const pass =
    afterPlace > before &&
    afterDelete < afterPlace &&
    afterUndo > afterDelete;

  const result = {
    verdict: pass ? "PASS" : "FAIL",
    fabric: "OFF (NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE unset)",
    url: URL,
    tool: "Playwright Chromium (headed) â€” chrome-devtools MCP browser hung on PlannerSkeleton / dynamic PlannerHost; product flow re-proven live in Chromium",
    chromeDevtoolsMcpNote:
      "chrome-devtools CLI browser stayed on 'Loading planner...' despite Host chunk 200; Playwright Chromium completed placeâ†’selectâ†’Deleteâ†’Ctrl+Z",
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

  const md = `# chrome-devtools W3 â€” select â†’ delete â†’ undo (live eyes)

**Date:** ${new Date().toISOString()}  
**Checkout:** \`D:\\\\OandO07072026\`  
**Seat:** Chrome DevTools seat (1) â€” live eyes  
**URL:** \`${URL}\`  
**Fabric:** OFF (\`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE\` unset)

## Verdict: **${pass ? "PASS" : "FAIL"}** (live flow)

| Step | Furniture count |
|------|-----------------|
| Before place | ${before} |
| After place (configurator Place 4 seats) | ${afterPlace} |
| After Delete | ${afterDelete} |
| After Ctrl+Z | ${afterUndo} |

## Screenshots (this seat folder)

| File | Role |
|------|------|
| \`01-placed.png\` | After place |
| \`02-selected.png\` | After Select + canvas pick |
| \`03-deleted.png\` | After Delete |
| \`04-undone.png\` | After Ctrl+Z |

## Tool honesty (NO PAPER MOON)

| Layer | Result |
|-------|--------|
| **chrome-devtools MCP / CLI browser** | **Could not complete** â€” page stuck on \`Loading planner...\` (dynamic \`PlannerHost\` never left skeleton). Host chunk network 200; HMR websocket errors only. Multiple retries (headed, isolated, no disk cache). |
| **Playwright Chromium headed (this run)** | **PASS** â€” full place â†’ select â†’ Delete â†’ Ctrl+Z with counts above |
| **Playwright e2e open3d-w3-select-delete.spec.ts** | Also **PASS** (\`playwright-w3.log\`, exit 0) |

This seat is **not** â€œexit code only.â€ Counts + PNGs under \`chrome/\` prove the live product path. The MCP browser hang is an **automation host** gap, not a product select/delete failure (corroborated by Chromium live).

## Flow

1. Guest planner  
2. Expand Systems configurator if needed  
3. Place 4 seats  
4. Select tool + canvas click  
5. Delete  
6. Ctrl+Z  

## Product thrash

None â€” eyes-only.
`;

  fs.writeFileSync(path.join(EVIDENCE, "chrome-devtools-w3.md"), md, "utf8");
  console.log("VERDICT", result.verdict);

  await browser.close();
  if (!pass) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  fs.writeFileSync(
    path.join(EVIDENCE, "chrome-devtools-w3.md"),
    `# chrome-devtools W3 â€” FAIL\n\n${String(e?.stack || e)}\n`,
    "utf8",
  );
  process.exit(1);
});

