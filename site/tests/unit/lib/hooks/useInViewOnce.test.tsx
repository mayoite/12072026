import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(public callback: any, public options: any) {
    MockIntersectionObserver.lastInstance = this;
  }
  static lastInstance: MockIntersectionObserver | null = null;
}

const TestComponent = ({ threshold }: { threshold?: number }) => {
  const { ref, isVisible } = useInViewOnce(threshold);
  return (
    <div ref={ref} data-testid="target">
      {isVisible ? "Visible" : "Not Visible"}
    </div>
  );
};

describe("useInViewOnce", () => {
  const originalIntersectionObserver = global.IntersectionObserver;

  beforeEach(() => {
    global.IntersectionObserver = MockIntersectionObserver as any;
    MockIntersectionObserver.lastInstance = null;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it("should start as not visible and observe the element", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("target").textContent).toBe("Not Visible");
    expect(MockIntersectionObserver.lastInstance).not.toBeNull();
    expect(MockIntersectionObserver.lastInstance?.observe).toHaveBeenCalled();
  });

  it("should set visible and disconnect observer when intersecting", () => {
    render(<TestComponent threshold={0.5} />);
    expect(screen.getByTestId("target").textContent).toBe("Not Visible");

    // Trigger intersection
    const observerInstance = MockIntersectionObserver.lastInstance!;
    act(() => {
      observerInstance.callback([{ isIntersecting: true }]);
    });

    expect(screen.getByTestId("target").textContent).toBe("Visible");
    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  it("should disconnect observer on unmount", () => {
    const { unmount } = render(<TestComponent />);
    const observerInstance = MockIntersectionObserver.lastInstance!;
    unmount();
    expect(observerInstance.disconnect).toHaveBeenCalled();
  });
});
