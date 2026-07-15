// @vitest-environment node
import { execFile } from "node:child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { adminRouteAuthGuardPass } from "../../../scripts/phase07-auth-probe.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/phase07-auth-probe.mjs");
const evidencePath = path.resolve(siteRoot, "../results/site/phase-07/http-probe/http-probe-evidence.json");
const execFileAsync = promisify(execFile);

function handler(req: IncomingMessage, res: ServerResponse) {
  if ((req.url ?? "").startsWith("/api/admin/svg-editor") && req.method === "POST") {
    res.writeHead(401, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: { code: "401.unauthorized" } }));
    return;
  }
  res.writeHead(404);
  res.end("missing");
}

describe("phase07-auth-probe (name-mirror)", () => {
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

  it("static guard requires withAuth or requireAdminSession on admin routes", () => {
    expect(adminRouteAuthGuardPass()).toBe(true);
  });

  it("records auth-blocked admin POST evidence", async () => {
    const { stdout } = await execFileAsync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
      env: { ...process.env, PROBE_BASE_URL: baseUrl },
    });
    expect(stdout).toContain("Phase 07 auth probe");
    expect(stdout).toContain("authBlocked=true");
    const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8")) as {
      checkIds: string[];
      adminApi: { pass: boolean; status: number };
      taxonomy: { notDescriptor422: boolean; pass: boolean };
      staticGuard: { pass: boolean };
    };
    expect(evidence.checkIds).toEqual(expect.arrayContaining(["07-AUTH-04", "07-AUTH-09"]));
    expect(evidence.adminApi.pass).toBe(true);
    expect(evidence.adminApi.status).toBe(401);
    expect(evidence.taxonomy.notDescriptor422).toBe(true);
    expect(evidence.staticGuard.pass).toBe(true);
  });
});
