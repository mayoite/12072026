import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  acquirePlaywrightDevLock,
  releasePlaywrightDevLock,
} from "./playwright-dev-lock.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.dirname(siteRoot);
const runId = `factory-${randomBytes(6).toString("hex")}`;
const runtimeRoot = path.join(
  repoRoot,
  ".e2e-runtime",
  "parametric-factory",
  runId,
);
const specIndex = process.argv.indexOf("--spec");
const spec = specIndex >= 0 ? process.argv[specIndex + 1] : undefined;
const grepIndex = process.argv.indexOf("--grep");
const grep = grepIndex >= 0 ? process.argv[grepIndex + 1] : undefined;

if (!spec || !/^tests\/e2e\/[a-z0-9-]+\.spec\.ts$/.test(spec)) {
  throw new Error("Use --spec tests/e2e/<name>.spec.ts");
}

const env = {
  ...process.env,
  DEV_AUTH_BYPASS: "1",
  NEXT_PUBLIC_PLANNER_DEV_TOOLS: "true",
  PARAMETRIC_FACTORY_E2E_RUN_ID: runId,
  PARAMETRIC_FACTORY_E2E_ROOT: runtimeRoot,
  SVG_RELEASE_AUTHORITY: "disk",
  PLAYWRIGHT_BASE_URL: "http://localhost:3000",
  PORT: "3000",
};

async function waitForServer() {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Parametric factory server exited with ${server.exitCode}`);
    }
    try {
      const response = await fetch("http://localhost:3000/admin/svg-editor/parametric");
      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 750));
        if (server.exitCode !== null) {
          throw new Error(`Parametric factory server exited with ${server.exitCode}`);
        }
        return;
      }
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Timed out waiting for http://localhost:3000");
}

const pnpmCommand =
  process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "pnpm";
const pnpmPrefix =
  process.platform === "win32" ? ["/d", "/s", "/c", "pnpm"] : [];
acquirePlaywrightDevLock("parametric-factory-e2e");
try {
  const stale = await fetch("http://localhost:3000/admin/svg-editor/parametric").catch(
    () => null,
  );
  if (stale) throw new Error("Port 3000 already has a responder; refusing stale-server reuse");
} catch (error) {
  if (error instanceof Error && error.message.includes("refusing stale-server")) {
    releasePlaywrightDevLock();
    throw error;
  }
}
const server = spawn(pnpmCommand, [...pnpmPrefix, "run", "dev"], {
  cwd: siteRoot,
  env,
  stdio: "inherit",
});

let exitCode = 1;
try {
  await waitForServer();
  const args = [
    "exec",
    "playwright",
    "test",
    "-c",
    "config/build/playwright.config.ts",
    spec,
    "--workers=1",
    "--reporter=list",
  ];
  if (grep) args.push("--grep", grep);
  const result = spawnSync(pnpmCommand, [...pnpmPrefix, ...args], {
    cwd: siteRoot,
    env,
    stdio: "inherit",
  });
  exitCode = result.status ?? 1;
} finally {
  if (process.platform === "win32" && server.pid) {
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  } else {
    server.kill("SIGTERM");
  }
  const cleanup = spawnSync(
    pnpmCommand,
    [...pnpmPrefix, "exec", "tsx", "scripts/cleanup-parametric-factory-e2e.mts"],
    { cwd: siteRoot, env, stdio: "inherit" },
  );
  if ((cleanup.status ?? 1) !== 0) exitCode = 1;
  releasePlaywrightDevLock();
}

process.exit(exitCode);
