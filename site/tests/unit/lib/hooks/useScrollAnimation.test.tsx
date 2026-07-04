import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { useScrollAnimation } from "@/lib/hooks/useScrollAnimation";
import { gsap } from "gsap";

const mockAnimationKill = vi.fn();
vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(() => ({
      kill: mockAnimationKill,
    })),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

const TestComponent = () => {
  const ref = useScrollAnimation();
  return <div ref={ref} data-testid="box">Animated Box</div>;
};

describe("useScrollAnimation", () => {
  beforeEach(() => {
    mockAnimationKill.mockClear();
    vi.mocked(gsap.fromTo).mockClear();
  });

  it("should register ScrollTrigger plugin on import/init", () => {
    expect(gsap.registerPlugin).toHaveBeenCalled();
  });

  it("should trigger gsap.fromTo with correct parameters when mounted", () => {
    render(<TestComponent />);
    expect(gsap.fromTo).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      { opacity: 0, y: 30 },
      expect.objectContaining({
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: expect.objectContaining({
          start: "top 85%",
        }),
      })
    );
  });

  it("should kill animation on unmount", () => {
    const { unmount } = render(<TestComponent />);
    expect(mockAnimationKill).not.toHaveBeenCalled();
    unmount();
    expect(mockAnimationKill).toHaveBeenCalled();
  });
});
