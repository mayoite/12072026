// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  PLAYWRIGHT_DEV_LOCK_PATH,
  PLAYWRIGHT_DEV_LOCK_STALE_MS,
  acquirePlaywrightDevLock,
  releasePlaywrightDevLock,
} from "../../../scripts/playwright-dev-lock.mjs";

describe("playwright-dev-lock (name-mirror)", () => {
  afterEach(() => {
    try {
      if (fs.existsSync(PLAYWRIGHT_DEV_LOCK_PATH)) {
        fs.unlinkSync(PLAYWRIGHT_DEV_LOCK_PATH);
      }
    } catch {
      // ignore cleanup races
    }
  });

  it("exports lock path under results/planner and 30m stale window", () => {
    expect(PLAYWRIGHT_DEV_LOCK_PATH.replace(/\\/g, "/")).toMatch(
      /results\/planner\/\.playwright-dev\.lock$/,
    );
    expect(PLAYWRIGHT_DEV_LOCK_STALE_MS).toBe(30 * 60 * 1000);
  });

  it("acquires and releases lock for the owning pid", () => {
    const owner = `unit-test-${process.pid}`;
    acquirePlaywrightDevLock(owner, process.pid);
    expect(fs.existsSync(PLAYWRIGHT_DEV_LOCK_PATH)).toBe(true);
    const lock = JSON.parse(fs.readFileSync(PLAYWRIGHT_DEV_LOCK_PATH, "utf8")) as {
      owner: string;
      pid: number;
    };
    expect(lock.owner).toBe(owner);
    expect(lock.pid).toBe(process.pid);

    releasePlaywrightDevLock(process.pid);
    expect(fs.existsSync(PLAYWRIGHT_DEV_LOCK_PATH)).toBe(false);
  });

  it("throws while a fresh lock is held by another owner", () => {
    fs.mkdirSync(path.dirname(PLAYWRIGHT_DEV_LOCK_PATH), { recursive: true });
    fs.writeFileSync(
      PLAYWRIGHT_DEV_LOCK_PATH,
      `${JSON.stringify({
        owner: "other-owner",
        pid: process.pid,
        startedAt: new Date().toISOString(),
      })}\n`,
      { encoding: "utf8", flag: "w" },
    );
    expect(() => acquirePlaywrightDevLock("unit-contender", process.pid)).toThrow(
      /Playwright dev lock held/,
    );
  });

  it("recovers a fresh lock whose process is dead", () => {
    fs.mkdirSync(path.dirname(PLAYWRIGHT_DEV_LOCK_PATH), { recursive: true });
    fs.writeFileSync(
      PLAYWRIGHT_DEV_LOCK_PATH,
      `${JSON.stringify({
        owner: "dead-owner",
        pid: 2_147_483_647,
        startedAt: new Date().toISOString(),
      })}\n`,
      { encoding: "utf8", flag: "w" },
    );

    acquirePlaywrightDevLock("unit-contender", process.pid);

    const lock = JSON.parse(fs.readFileSync(PLAYWRIGHT_DEV_LOCK_PATH, "utf8")) as {
      owner: string;
      pid: number;
    };
    expect(lock.owner).toBe("unit-contender");
    expect(lock.pid).toBe(process.pid);
  });
});
