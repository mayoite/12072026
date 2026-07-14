// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const mkdirSync = vi.fn();
const writeFileSync = vi.fn();

vi.mock("@aws-sdk/client-s3", () => ({
  ListObjectsV2Command: class ListObjectsV2Command {
    input: Record<string, unknown>;
    constructor(input: Record<string, unknown>) {
      this.input = input;
    }
  },
  S3Client: class S3Client {
    send = send;
    constructor(_cfg: unknown) {
      void _cfg;
    }
  },
}));

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
  config: vi.fn(),
}));

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    default: {
      ...actual,
      mkdirSync: (...args: unknown[]) => mkdirSync(...(args as Parameters<typeof mkdirSync>)),
      writeFileSync: (...args: unknown[]) =>
        writeFileSync(...(args as Parameters<typeof writeFileSync>)),
    },
    mkdirSync: (...args: unknown[]) => mkdirSync(...(args as Parameters<typeof mkdirSync>)),
    writeFileSync: (...args: unknown[]) =>
      writeFileSync(...(args as Parameters<typeof writeFileSync>)),
  };
});

describe("count-r2-objects (name-mirror)", () => {
  const prevArgv = process.argv.slice();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.argv = [process.argv[0], "count-r2-objects.mjs", "test-bucket"];
    process.env.CLOUDFLARE_ACCOUNT_ID = "acct-test";
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key";
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "secret";
    send.mockResolvedValueOnce({
      KeyCount: 2,
      Contents: [{ Key: "a.webp" }, { Key: "b.webp" }],
      IsTruncated: false,
    });
  });

  afterEach(() => {
    process.argv = prevArgv;
  });

  it("lists R2 objects via mocked S3 client and writes a report", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await import("../../../scripts/count-r2-objects.mjs");

    expect(send).toHaveBeenCalledTimes(1);
    expect(mkdirSync).toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalled();
    const written = writeFileSync.mock.calls[0];
    expect(String(written[0]).replaceAll("\\", "/")).toContain("results/audits/r2-object-count.json");
    const payload = JSON.parse(String(written[1])) as {
      bucket: string;
      objectCount: number;
      sampleKeys: string[];
    };
    expect(payload.bucket).toBe("test-bucket");
    expect(payload.objectCount).toBe(2);
    expect(payload.sampleKeys).toEqual(["a.webp", "b.webp"]);
    expect(log).toHaveBeenCalledWith("bucket=test-bucket objects=2");
    log.mockRestore();
  });
});
