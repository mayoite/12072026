import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AiAdvisorChatPane } from "@/features/planner/ai/AiAdvisorChatPane";

vi.mock("@/lib/api/browserApi", () => ({
  browserApiFetch: vi.fn(async () => ({
    ok: true,
    json: async () => ({
      content: "Try a 2x2 desk bank near the window.",
      degraded: false,
      provider: "test",
    }),
  })),
}));

describe("AiAdvisorChatPane", () => {
  beforeEach(() => {
    if (!globalThis.crypto?.randomUUID) {
      Object.defineProperty(globalThis, "crypto", {
        value: { randomUUID: () => "uuid-test-1" },
        configurable: true,
      });
    }
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows welcome content and suggestion chips", () => {
    render(
      <AiAdvisorChatPane
        editor={null}
        projectMetadata={{
          projectName: "Hub",
          city: "Patna",
          floorAreaSqFt: 2000,
          primaryPurpose: "workstations",
          seatTarget: 12,
          completedAt: "2026-07-01T00:00:00.000Z",
        }}
      />,
    );
    expect(screen.getByRole("tabpanel")).toBeTruthy();
    expect(screen.getByText(/plan Hub/i)).toBeTruthy();
    expect(screen.getByLabelText("Suggested prompts")).toBeTruthy();
  });

  it("sends a message from the input", async () => {
    render(
      <AiAdvisorChatPane editor={null} projectMetadata={null} currentShapeCount={0} />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Suggest 8 desks" } });
    const send = screen.getByRole("button", { name: /send/i });
    fireEvent.click(send);
    await waitFor(() => {
      expect(screen.getByText(/Suggest 8 desks/i)).toBeTruthy();
    });
  });
});
