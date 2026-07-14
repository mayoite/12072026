// @vitest-environment node
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/phase05-portal-route-probe.mjs");
const evidencePath = path.resolve(
  siteRoot,
  "../results/site/phase-05/http-probe/http-probe-evidence.json",
);
const SAMPLE = "side-table-001";

function handler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url ?? "/";
  if (url === "/portal/svg-catalog" || url === "/portal/svg-catalog/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(
      "<html><head><title>SVG catalog</title></head><body><p>12 blocks available</p></body></html>",
    );
    return;
  }
  if (url.includes(`/portal/svg-catalog/${SAMPLE}`)) {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(
      `<html><head><meta property="og:image" content="https://cdn.example/site-block-thumbs/${SAMPLE}.png"/></head>` +
        `<body><h1>${SAMPLE}</h1><div class="portal-svg-detail">Puck render</div>` +
        `<div class="svg-catalog-thumb">PNG thumb</div></body></html>`,
    );
    return;
  }
  res.writeHead(404);
  res.end("missing");
}

describe("phase05-portal-route-probe (name-mirror)", () => {
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

  it("checks portal index/slug and og:image R2 policy", () => {
    const output = execFileSync(process.execPath, [scriptPath], {
      cwd: siteRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        PROBE_BASE_URL: baseUrl,
        PHASE05_PROBE_SLUG: SAMPLE,
      },
    });
    expect(output).toContain("Phase 05 portal route probe");
    expect(output).toContain("05-PORT-01");
    const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8")) as {
      checkIds: string[];
      index: { pass: boolean };
      slug: { pass: boolean };
      metadata: { pass: boolean; ogImageIsR2: boolean };
    };
    expect(evidence.checkIds).toEqual(
      expect.arrayContaining(["05-PORT-01", "05-PORT-02", "05-PORT-09"]),
    );
    expect(evidence.index.pass).toBe(true);
    expect(evidence.slug.pass).toBe(true);
    expect(evidence.metadata.ogImageIsR2).toBe(true);
    expect(evidence.metadata.pass).toBe(true);
  });
});
