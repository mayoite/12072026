// @vitest-environment node
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/phase0412-runtime-probe.mjs");
const evidencePath = path.resolve(
  siteRoot,
  "../results/site/release-gates/runtime-0412/runtime-0412-evidence.json",
);

function html(body: string) {
  return `<!DOCTYPE html><html><body>${body}</body></html>`;
}

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ?? "/";
  if (url.startsWith("/api/admin/svg-editor") && req.method === "POST") {
    res.writeHead(403, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { code: "403.forbidden" } }));
    return;
  }
  if (url.startsWith("/api/planner/catalog/svg-blocks")) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ data: { items: [{ slug: "side-table-001" }] } }));
    return;
  }
  if (
    url.startsWith("/admin/svg-editor") ||
    url.startsWith("/portal/svg-catalog") ||
    url.startsWith("/planner/guest") ||
    url.startsWith("/planner/open3d")
  ) {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(html(url));
    return;
  }
  res.writeHead(404);
  res.end("missing");
}

describe("phase0412-runtime-probe (name-mirror)", () => {
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

  it("records PLAN-FAIL-0412 runtime pass with route and API probes", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        BASE_URL: baseUrl,
        PROBE_BASE_URL: baseUrl,
        PLAYWRIGHT_BASE_URL: baseUrl,
      },
    });
    expect(output).toContain("PLAN-FAIL-0412");
    expect(output).toMatch(/pass=true/);
    const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8")) as {
      pass: boolean;
      checkIds: string[];
      apis: { adminSvgEditorPost: { authBlocked: boolean }; catalogSvgBlocks: { status: number } };
    };
    expect(evidence.checkIds).toContain("PLAN-FAIL-0412");
    expect(evidence.pass).toBe(true);
    expect(evidence.apis.adminSvgEditorPost.authBlocked).toBe(true);
    expect(evidence.apis.catalogSvgBlocks.status).toBe(200);
  });
});
