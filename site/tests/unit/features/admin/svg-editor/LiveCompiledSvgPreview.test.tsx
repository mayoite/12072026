import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveCompiledSvgPreview } from "@/features/admin/svg-editor/LiveCompiledSvgPreview";

describe("LiveCompiledSvgPreview", () => {
  it("shows pending state", () => {
    render(<LiveCompiledSvgPreview result={null} pending />);
    expect(screen.getByTestId("admin-svg-livepreview")).toHaveAttribute(
      "data-pending",
      "true",
    );
  });

  it("renders successful svg result", () => {
    render(
      <LiveCompiledSvgPreview
        result={{
          ok: true,
          svg: '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>',
        } as never}
        pending={false}
        meta={{ identity: "desk", footprint: "600×600", validation: "ok" }}
      />,
    );
    expect(screen.getByTestId("admin-svg-livepreview-identity")).toHaveTextContent(
      "desk",
    );
    expect(screen.getByTestId("admin-svg-livepreview-footprint")).toHaveTextContent(
      "600",
    );
  });
});
