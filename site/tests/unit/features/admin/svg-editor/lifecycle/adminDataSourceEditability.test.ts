import { describe, expect, it } from "vitest";
import {
  declareSvgEditSources,
  formatDataSourceBanner,
} from "@/features/admin/svg-editor/lifecycle/adminDataSourceEditability";

describe("adminDataSourceEditability", () => {
  it("marks both sources editable when live with publish wired", () => {
    const live = declareSvgEditSources({
      catalogLifecycle: "live",
      hasOnPublishAction: true,
    });
    expect(live).toHaveLength(2);
    expect(live.every((s) => s.mode === "editable")).toBe(true);
    expect(live.map((s) => s.kind)).toEqual([
      "disk-block-descriptor",
      "disk-published-svg",
    ]);
    expect(live[1]?.reason).toMatch(/Publish replaces/i);
    expect(live[1]?.reason).toMatch(/disk \(live authority\)/i);
  });

  it("keeps draft descriptors editable but still requires publish for SVG writes", () => {
    const draft = declareSvgEditSources({
      catalogLifecycle: "draft",
      hasOnPublishAction: true,
    });
    expect(draft[0]?.mode).toBe("editable");
    expect(draft[1]?.mode).toBe("editable");
  });

  it("makes published SVG read-only when publish action is not wired", () => {
    const noPublish = declareSvgEditSources({
      catalogLifecycle: "live",
      hasOnPublishAction: false,
    });
    expect(noPublish[0]?.mode).toBe("editable");
    expect(noPublish[1]?.mode).toBe("read-only");
    expect(noPublish[1]?.reason).toMatch(/not wired/i);
  });

  it("forces all sources read-only when product is retired", () => {
    const retired = declareSvgEditSources({
      catalogLifecycle: "retired",
      hasOnPublishAction: true,
    });
    expect(retired.every((s) => s.mode === "read-only")).toBe(true);
    expect(retired[0]?.reason).toMatch(/retired/i);
    expect(retired[1]?.reason).toMatch(/Retired products/i);
  });

  it("formats a banner listing mode and reason for each source", () => {
    const live = declareSvgEditSources({
      catalogLifecycle: "live",
      hasOnPublishAction: true,
    });
    const banner = formatDataSourceBanner(live);
    expect(banner).toMatch(/Editable/);
    expect(banner).toContain(" · ");
    expect(banner).toMatch(/Block descriptor draft/);

    const retired = declareSvgEditSources({
      catalogLifecycle: "retired",
      hasOnPublishAction: false,
    });
    expect(formatDataSourceBanner(retired)).toMatch(/Read-only/);
  });
});
