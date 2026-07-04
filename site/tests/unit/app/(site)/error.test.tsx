import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ErrorBoundary from "../../../../app/(site)/error";

describe("Site Error Boundary", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    vi.clearAllMocks();
  });

  it("renders the error boundary UI", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    expect(screen.getByText("Something went wrong")).toBeDefined();
    expect(
      screen.getByText(/We encountered an unexpected error/i)
    ).toBeDefined();
  });

  it("calls console.error with the provided error on mount", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    expect(console.error).toHaveBeenCalledWith("[site-error-boundary]", error);
  });

  it("calls reset when the 'Try again' button is clicked", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    const button = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(button);

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
