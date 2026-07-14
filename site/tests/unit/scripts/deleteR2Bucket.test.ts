// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  PROTECTED_BUCKET,
  deleteBucket,
  emptyBucket,
  isProtectedBucket,
  main,
  parseBuckets,
} from "@/scripts/deleteR2Bucket";

describe("deleteR2Bucket (name-mirror)", () => {
  it("protects the CDN bucket and parses argv", () => {
    expect(isProtectedBucket(PROTECTED_BUCKET)).toBe(true);
    expect(isProtectedBucket("tmp-bucket")).toBe(false);
    expect(parseBuckets(["node", "deleteR2Bucket.ts", "a", "--flag", "b"])).toEqual([
      "a",
      "b",
    ]);
  });

  it("empties a bucket by listing and deleting objects (mocked client)", async () => {
    const send = vi
      .fn()
      .mockResolvedValueOnce({
        Contents: [{ Key: "one.bin" }, { Key: "two.bin" }],
        IsTruncated: false,
      })
      .mockResolvedValueOnce({});
    const removed = await emptyBucket({ send } as never, "scratch");
    expect(removed).toBe(2);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("deletes bucket after empty", async () => {
    const send = vi.fn(async () => ({}));
    const empty = vi.fn(async () => 4);
    const removed = await deleteBucket("scratch", {
      createClient: (() => ({ send })) as never,
      empty: empty as never,
      log: vi.fn(),
    });
    expect(removed).toBe(4);
    expect(empty).toHaveBeenCalledWith({ send }, "scratch");
    expect(send).toHaveBeenCalledOnce();
  });

  it("refuses protected bucket without network", async () => {
    const error = vi.fn();
    const exit = vi.fn();
    const deleteOne = vi.fn();
    await main(["node", "deleteR2Bucket.ts", PROTECTED_BUCKET], {
      deleteOne: deleteOne as never,
      error,
      exit,
    });
    expect(deleteOne).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(`Refusing to delete protected bucket "${PROTECTED_BUCKET}"`),
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  it("requires at least one bucket name", async () => {
    const exit = vi.fn();
    await main(["node", "deleteR2Bucket.ts"], {
      deleteOne: vi.fn() as never,
      error: vi.fn(),
      exit,
    });
    expect(exit).toHaveBeenCalledWith(1);
  });
});
