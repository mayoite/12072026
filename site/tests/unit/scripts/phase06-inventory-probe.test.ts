// @vitest-environment node
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const realSiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(realSiteRoot, "scripts/phase06-inventory-probe.mjs");

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ?? "/";
  if (url.startsWith("/api/planner/catalog/svg-blocks")) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        data: {
          items: [{ slug: "fixture-a" }, { slug: "fixture-b" }],
        },
      }),
    );
    return;
  }
  if (url.startsWith("/portal/svg-catalog/")) {
    const slug = url.split("/").pop() ?? "";
    res.writeHead(200, { "content-type": "text/html" });
    res.end(`<html><body>${slug}</body></html>`);
    return;
  }
  res.writeHead(404);
  res.end("missing");
}

describe("phase06-inventory-probe (name-mirror)", () => {
  let baseUrl = "";
  let server: ReturnType<typeof createServer>;
  let tmpRoot = "";
  let siteCwd = "";
  let evidencePath = "";

  beforeAll(async () => {
    server = createServer(handler);
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });
    const addr = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${addr.port}`;

    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "phase06-probe-"));
    siteCwd = path.join(tmpRoot, "site");
    const descDir = path.join(siteCwd, "inventory", "descriptors");
    fs.mkdirSync(descDir, { recursive: true });
    fs.writeFileSync(path.join(descDir, "fixture-a.json"), "{}");
    fs.writeFileSync(path.join(descDir, "fixture-b.json"), "{}");
    evidencePath = path.join(
      tmpRoot,
      "results",
      "site",
      "phase-06",
      "http-probe",
      "http-probe-evidence.json",
    );
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it("compares API slugs to disk descriptors and writes evidence", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteCwd,
      encoding: "utf8",
      env: { ...process.env, PROBE_BASE_URL: baseUrl },
    });
    expect(output).toContain("Phase 06 inventory probe");
    expect(output).toContain("06-INV-01");
    expect(fs.existsSync(evidencePath)).toBe(true);
    const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8")) as {
      checkIds: string[];
      api: { pass: boolean; itemCount: number };
      sync: { slugsMatch: boolean; pass: boolean };
      portal: { pass: boolean };
    };
    expect(evidence.checkIds).toEqual(
      expect.arrayContaining(["06-INV-01", "06-INV-05", "06-TEST-01"]),
    );
    expect(evidence.api.pass).toBe(true);
    expect(evidence.api.itemCount).toBe(2);
    expect(evidence.sync.slugsMatch).toBe(true);
    expect(evidence.portal.pass).toBe(true);
  });
});
