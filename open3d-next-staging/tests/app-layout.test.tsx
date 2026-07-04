import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "../app/layout";

describe("app/layout", () => {
  it("declares the root document shell and metadata", () => {
    const element = RootLayout({
      children: <main>Workspace</main>,
    });

    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("en");

    const body = element.props.children;
    expect(body.type).toBe("body");
    expect(body.props.className).toBe("planner-workspace");
    expect(body.props.children.props.children).toBe("Workspace");

    expect(metadata).toMatchObject({
      title: "open3dFloorplan",
      robots: { index: false, follow: false },
    });
  });
});
