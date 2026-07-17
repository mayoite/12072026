import { afterEach, describe, expect, it } from "vitest";

import {
  getSvgReleaseAuthority,
  isDbSvgReleaseAuthority,
} from "@/features/admin/svg-editor/publish/svgReleaseAuthority";

describe("svgReleaseAuthority", () => {
  afterEach(() => {
    delete process.env.SVG_RELEASE_AUTHORITY;
  });

  it("defaults to disk when unset or unknown", () => {
    expect(getSvgReleaseAuthority({})).toBe("disk");
    expect(getSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "  " })).toBe("disk");
    expect(getSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "disk" })).toBe(
      "disk",
    );
    expect(getSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "banana" })).toBe(
      "disk",
    );
    expect(isDbSvgReleaseAuthority({})).toBe(false);
  });

  it("accepts db/database/r2 as Products DB authority", () => {
    expect(getSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "db" })).toBe("db");
    expect(getSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "DB" })).toBe("db");
    expect(getSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "database" })).toBe(
      "db",
    );
    expect(getSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "r2" })).toBe("db");
    expect(isDbSvgReleaseAuthority({ SVG_RELEASE_AUTHORITY: "db" })).toBe(true);
  });
});
