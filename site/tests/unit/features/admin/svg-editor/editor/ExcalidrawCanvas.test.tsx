import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockExcalidrawClient(props: { checksum?: string }) {
      return (
        <div data-testid="mock-excalidraw-client">
          {props.checksum ?? "no-checksum"}
        </div>
      );
    },
}));

import { ExcalidrawCanvas } from "@/features/admin/svg-editor/editor/ExcalidrawCanvas";

describe("ExcalidrawCanvas", () => {
  it("forwards props to the dynamic Excalidraw client", () => {
    render(
      <ExcalidrawCanvas
        initialSvg=""
        checksum="abc123"
        readRequest={1}
        onDocument={vi.fn()}
        onError={vi.fn()}
      />,
    );
    expect(screen.getByTestId("mock-excalidraw-client")).toHaveTextContent(
      "abc123",
    );
  });
});
