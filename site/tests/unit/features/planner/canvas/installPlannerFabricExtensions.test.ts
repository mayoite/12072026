import { afterEach, describe, expect, it, vi } from "vitest";
import { PLANNER_COLOR_TOKENS } from "@/features/planner/shared/themeColorTokens";

const { AligningGuidelinesCtor, disposeMock } = vi.hoisted(() => {
  const disposeMock = vi.fn();
  const AligningGuidelinesCtor = vi.fn(function MockAligningGuidelines(
    this: { dispose: ReturnType<typeof vi.fn> },
  ) {
    this.dispose = disposeMock;
  });
  return { AligningGuidelinesCtor, disposeMock };
});

vi.mock("@/features/planner/canvas/fabricAligningGuidelines", () => ({
  AligningGuidelines: AligningGuidelinesCtor,
}));

vi.mock("@/features/planner/shared/readThemeColor", () => ({
  resolvePaintColor: vi.fn((_color: string | undefined, token: string) => `resolved:${token}`),
}));

describe("installPlannerFabricExtensions", () => {
  afterEach(() => {
    AligningGuidelinesCtor.mockClear();
    disposeMock.mockClear();
  });

  it("installs AligningGuidelines with the theme align-guide token and disposes cleanly", async () => {
    const { installPlannerFabricExtensions } = await import(
      "@/features/planner/canvas/installPlannerFabricExtensions"
    );
    const canvas = {} as import("fabric").Canvas;

    const handles = installPlannerFabricExtensions(canvas);

    expect(AligningGuidelinesCtor).toHaveBeenCalledTimes(1);
    expect(AligningGuidelinesCtor).toHaveBeenCalledWith(canvas, {
      color: `resolved:${PLANNER_COLOR_TOKENS.alignGuide}`,
    });

    handles.dispose();
    expect(disposeMock).toHaveBeenCalledTimes(1);
  });

  it("omits color when the theme token is unavailable", async () => {
    const { resolvePaintColor } = await import(
      "@/features/planner/shared/readThemeColor"
    );
    vi.mocked(resolvePaintColor).mockImplementationOnce(() => {
      throw new Error("Missing theme token: --color-primary");
    });

    const { installPlannerFabricExtensions } = await import(
      "@/features/planner/canvas/installPlannerFabricExtensions"
    );
    const canvas = {} as import("fabric").Canvas;

    installPlannerFabricExtensions(canvas);

    expect(AligningGuidelinesCtor).toHaveBeenCalledWith(canvas, {});
  });
});
