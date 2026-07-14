import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AiAdvisorChat,
  AiAdvisorTrigger,
} from "@/features/planner/ai/AiAdvisorChat";

vi.mock("@/features/planner/ai/AiAdvisorChatPane", () => ({
  AiAdvisorChatPane: () => <div data-testid="chat-pane">pane</div>,
}));

describe("AiAdvisorChat", () => {
  afterEach(() => cleanup());

  it("renders nothing when closed", () => {
    const { container } = render(<AiAdvisorChat isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders dialog and pane when open", () => {
    const onClose = vi.fn();
    render(<AiAdvisorChat isOpen onClose={onClose} />);
    expect(screen.getByRole("dialog", { name: /AI Layout Advisor/i })).toBeTruthy();
    expect(screen.getByTestId("chat-pane")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Close advisor/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("AiAdvisorTrigger fires onClick", () => {
    const onClick = vi.fn();
    render(<AiAdvisorTrigger onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: /Open AI Layout Advisor/i }));
    expect(onClick).toHaveBeenCalled();
  });
});
