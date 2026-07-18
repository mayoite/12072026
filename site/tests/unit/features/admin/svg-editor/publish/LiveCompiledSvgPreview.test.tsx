import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveCompiledSvgPreview } from "@/features/admin/svg-editor/publish/LiveCompiledSvgPreview";

describe("LiveCompiledSvgPreview", () => {
  it("shows pending state", () => {
    render(<LiveCompiledSvgPreview result={null} pending />);
    expect(screen.getByTestId("admin-svg-livepreview")).toHaveAttribute(
      "data-pending",
      "true",
    );
  });

  it("empty state does not claim visual studio as sole path", () => {
    render(<LiveCompiledSvgPreview result={null} pending={false} />);
    const empty = screen.getByTestId("admin-svg-livepreview-empty");
    expect(empty).toHaveTextContent(/server compile|blocks or maker/i);
    expect(empty).not.toHaveTextContent(/Draw a shape in the visual studio/i);
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
