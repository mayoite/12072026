import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import DynamicBotWrapper from "@/features/site/assistant/DynamicBotWrapper";

vi.mock("next/dynamic", () => {
  return {
    default: () => {
      return function MockedAssistant() {
        return <div data-testid="unified-assistant" />;
      };
    },
  };
});

describe("DynamicBotWrapper", () => {
  it("renders UnifiedAssistant", () => {
    render(<DynamicBotWrapper />);
    expect(screen.getByTestId("unified-assistant")).toBeDefined();
  });
});
