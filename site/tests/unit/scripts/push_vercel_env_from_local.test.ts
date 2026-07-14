// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  SKIP_KEYS,
  SKIP_PREFIXES,
  parseEnvFile,
  shouldSkip,
} from "../../../scripts/push_vercel_env_from_local.mjs";

describe("push_vercel_env_from_local (name-mirror)", () => {
  it("skips database and digitalocean keys", () => {
    expect(SKIP_KEYS.has("DATABASE_URL")).toBe(true);
    expect(SKIP_KEYS.has("PLANNER_DATABASE_URL")).toBe(true);
    expect(SKIP_PREFIXES).toContain("DO_");
    expect(shouldSkip("DATABASE_URL")).toBe(true);
    expect(shouldSkip("DO_SPACES_KEY")).toBe(true);
    expect(shouldSkip("NEXT_PUBLIC_SITE_URL")).toBe(false);
  });

  it("parses env files with comments, blanks, and quoted values", () => {
    const vars = parseEnvFile(
      [
        "# comment",
        "",
        "FOO=bar",
        'QUOTED="hello world"',
        "EMPTY=",
        "NEXT_PUBLIC_X=1",
      ].join("\n"),
    );
    expect(vars.get("FOO")).toBe("bar");
    expect(vars.get("QUOTED")).toBe("hello world");
    expect(vars.get("NEXT_PUBLIC_X")).toBe("1");
    expect(vars.has("EMPTY")).toBe(false);
    expect(vars.size).toBe(3);
  });
});
