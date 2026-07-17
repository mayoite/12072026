import { afterEach, describe, expect, it } from "vitest";

import {
  getDbReleaseAuthorityDualWriteBlockError,
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

  it("getDbReleaseAuthorityDualWriteBlockError: disk authority never blocks", () => {
    expect(
      getDbReleaseAuthorityDualWriteBlockError({
        dualWriteReady: false,
        mode: "skipped_no_db",
        env: {},
      }),
    ).toBeNull();
  });

  it("getDbReleaseAuthorityDualWriteBlockError: db authority ready allows publish", () => {
    expect(
      getDbReleaseAuthorityDualWriteBlockError({
        dualWriteReady: true,
        mode: "enabled",
        env: { SVG_RELEASE_AUTHORITY: "db" },
      }),
    ).toBeNull();
  });

  it("getDbReleaseAuthorityDualWriteBlockError: mode and productsDbConfigured messages", () => {
    expect(
      getDbReleaseAuthorityDualWriteBlockError({
        dualWriteReady: false,
        mode: "skipped_no_db",
        env: { SVG_RELEASE_AUTHORITY: "db" },
      }),
    ).toBe("DB release authority requires PRODUCTS_DATABASE_URL");

    expect(
      getDbReleaseAuthorityDualWriteBlockError({
        dualWriteReady: false,
        mode: "skipped_r2_unavailable",
        env: { SVG_RELEASE_AUTHORITY: "db" },
      }),
    ).toBe("DB release authority requires reachable R2 catalog storage");

    expect(
      getDbReleaseAuthorityDualWriteBlockError({
        dualWriteReady: false,
        productsDbConfigured: false,
        env: { SVG_RELEASE_AUTHORITY: "db" },
      }),
    ).toBe("DB release authority requires PRODUCTS_DATABASE_URL");

    expect(
      getDbReleaseAuthorityDualWriteBlockError({
        dualWriteReady: false,
        productsDbConfigured: true,
        env: { SVG_RELEASE_AUTHORITY: "db" },
      }),
    ).toBe("DB release authority requires reachable R2 catalog storage");
  });
});
