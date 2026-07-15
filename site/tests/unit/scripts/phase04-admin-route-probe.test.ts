// @vitest-environment node
import { execFile } from "node:child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/phase04-admin-route-probe.mjs");
const evidencePath = path.resolve(siteRoot, "../results/site/phase-04/http-probe/http-probe-evidence.json");
const execFileAsync = promisify(execFile);

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ?? "/";
  if (url.startsWith("/api/admin/svg-editor") && req.method === "POST") {
    res.writeHead(401, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { code: "401.unauthorized" } }));
    return;
  }
  if (url.startsWith("/admin/svg-editor")) {
    res.writeHead(200, { "content-type": "text/html" });
    res.end("<html><body>login access required</body></html>");
    return;
  }
  res.writeHead(404);
  res.end("missing");
}

describe("phase04-admin-route-probe (name-mirror)", () => {
  let baseUrl = "";
  let server: ReturnType<typeof createServer>;

  beforeAll(async () => {
    server = createServer(handler);
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });
    const addr = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("probes admin routes and writes evidence with check ids", async () => {
    const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
      env: { ...process.env, PROBE_BASE_URL: baseUrl },
    });
    expect(stdout).toContain("Phase 04 admin route probe");
    expect(stdout).toContain("04-ADMIN-01");
    expect(fs.existsSync(evidencePath)).toBe(true);
    const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8")) as {
      checkIds: string[];
      summary: { listRouteNot404: boolean; apiNot404: boolean };
      routes: Array<{ path: string; status: number }>;
    };
    expect(evidence.checkIds).toEqual(expect.arrayContaining(["04-ADMIN-01", "04-ADMIN-02", "04-ADMIN-09"]));
    expect(evidence.summary.listRouteNot404).toBe(true);
    expect(evidence.summary.apiNot404).toBe(true);
    expect(evidence.routes.some((r) => r.path === "/admin/svg-editor")).toBe(true);
  });
});
