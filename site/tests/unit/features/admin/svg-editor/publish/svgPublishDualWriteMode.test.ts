import { describe, expect, it } from "vitest";

import {
  formatSvgDualWriteListSourceMeta,
  type SvgPublishDualWriteMode,
} from "@/features/admin/svg-editor/publish/svgPublishDualWriteMode";

describe("svgPublishDualWriteMode (name-mirror)", () => {
  it.each([
    "enabled",
    "skipped_no_db",
    "skipped_r2_unavailable",
    "skipped_schema_missing",
  ] as const satisfies ReadonlyArray<SvgPublishDualWriteMode>)(
    "formats Dual-write readiness for %s without claiming cutover",
    (mode) => {
      const line = formatSvgDualWriteListSourceMeta(mode);
      expect(line).toBe(
        `Dual-write: ${mode} · live authority remains disk until cutover`,
      );
      expect(line).not.toMatch(/cutover complete|sole authority|DB is live/i);
    },
  );
});
