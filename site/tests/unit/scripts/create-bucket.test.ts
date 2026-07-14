// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const createR2CatalogClient = vi.fn(() => ({ send }));
const resolveCatalogBucketName = vi.fn(() => "oando-asset-cdn");
const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

vi.mock("@aws-sdk/client-s3", () => ({
  CreateBucketCommand: class CreateBucketCommand {
    input: { Bucket: string };
    constructor(input: { Bucket: string }) {
      this.input = input;
    }
  },
}));

vi.mock("../../../scripts/lib/r2Catalog", () => ({
  createR2CatalogClient: () => createR2CatalogClient(),
  resolveCatalogBucketName: () => resolveCatalogBucketName(),
}));

describe("create-bucket (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    send.mockResolvedValue({});
    createR2CatalogClient.mockReturnValue({ send });
    resolveCatalogBucketName.mockReturnValue("oando-asset-cdn");
  });

  it("creates the catalog bucket through the mocked R2 client", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await import("../../../scripts/create-bucket.ts");
    await vi.waitFor(() => {
      expect(send).toHaveBeenCalled();
    });
    expect(resolveCatalogBucketName).toHaveBeenCalled();
    expect(createR2CatalogClient).toHaveBeenCalled();
    expect(log.mock.calls.flat().join("\n")).toContain("SUCCESS");
    expect(exitSpy).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it("treats already-exists errors as success", async () => {
    send.mockRejectedValueOnce(new Error("BucketAlreadyOwnedByYou"));
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await import("../../../scripts/create-bucket.ts");
    await vi.waitFor(() => {
      expect(send).toHaveBeenCalled();
    });
    expect(log.mock.calls.flat().join("\n")).toMatch(/already exists/i);
    expect(exitSpy).not.toHaveBeenCalled();
    log.mockRestore();
  });
});
