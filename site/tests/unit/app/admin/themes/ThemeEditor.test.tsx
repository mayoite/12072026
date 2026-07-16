import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import React from "react";
import { ThemeEditor } from "@/app/admin/themes/ThemeEditor";
import { browserApiFetch } from "@/lib/api/browserApi";
import { PLANNER_THEME_PACKS } from "@/lib/theme/plannerThemePacks";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";
});

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (path: string) => path,
  browserApiFetch: vi.fn(),
}));

vi.mock("@phosphor-icons/react", () => ({
  FloppyDisk: (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden data-testid="icon-save" {...props} />
  ),
  CloudArrowUp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden data-testid="icon-upload" {...props} />
  ),
  WarningCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden data-testid="icon-alert" {...props} />
  ),
  ArrowsClockwise: (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden data-testid="icon-refresh" {...props} />
  ),
  CircleNotch: (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden data-testid="icon-loader" {...props} />
  ),
}));

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  };
}

function starterPayload() {
  return {
    success: true,
    source: "starter",
    themes: PLANNER_THEME_PACKS.map((p) => ({
      id: p.id,
      name: p.name,
      is_active: p.is_active,
      description: p.description,
      tokens: p.tokens,
      tokenCount: Object.keys(p.tokens).length,
      source: "starter" as const,
    })),
  };
}

describe("app/admin/themes/ThemeEditor.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders starter packs and wood tokens after load", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse(starterPayload()) as never,
    );

    render(<ThemeEditor />);

    expect(
      await screen.findByRole("heading", { name: "premium-light" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Source: starter/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /woods/i })).toBeInTheDocument();
    expect(
      await screen.findByText("--block-wood-ash-base"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Planner tokens only/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Live/i })).toBeInTheDocument();
  });

  it("shows error and retry when the themes API fails", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse({}, false, 500) as never,
    );

    render(<ThemeEditor />);

    expect(
      await screen.findByText(/Could not load themes/i),
    ).toBeInTheDocument();
    const retryButtons = screen.getAllByRole("button", { name: /^Retry$/i });
    expect(retryButtons.length).toBeGreaterThan(0);

    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse(starterPayload()) as never,
    );

    fireEvent.click(retryButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "premium-light" }),
      ).toBeInTheDocument();
    });
  });

  it("shows clear empty state with publish starter when no themes", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse({ success: true, themes: [], source: "none" }) as never,
    );

    render(<ThemeEditor />);

    expect(
      await screen.findByText(/No planner theme packs yet/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Publish starter pack/i }).length,
    ).toBeGreaterThan(0);
  });

  it("publishes selected pack to planners", async () => {
    const pack = PLANNER_THEME_PACKS[0];
    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          themes: [
            {
              id: pack.id,
              name: pack.name,
              is_active: true,
              description: pack.description,
              tokens: pack.tokens,
              source: "starter",
            },
          ],
          source: "starter",
        }) as never,
      )
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          url: "https://cdn.example/themes/premium-light.json",
        }) as never,
      );

    render(<ThemeEditor />);
    expect(
      await screen.findByRole("heading", { name: "premium-light" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Publish to Planners/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/Published/i)).toBeInTheDocument();
    });

    expect(browserApiFetch).toHaveBeenCalledWith(
      "/api/admin/themes/publish",
      expect.objectContaining({
        method: "POST",
      }),
    );

    const publishCall = vi.mocked(browserApiFetch).mock.calls.find(
      (call) => call[0] === "/api/admin/themes/publish",
    );
    expect(publishCall).toBeDefined();
    const init = publishCall?.[1] as { body?: string };
    const body = JSON.parse(init.body ?? "{}") as {
      themeName: string;
      tokens: Record<string, string>;
    };
    expect(body.themeName).toBe("premium-light");
    expect(body.tokens["block-wood-ash-base"]).toBeDefined();
  });

  it("switches material category tabs", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse(starterPayload()) as never,
    );

    render(<ThemeEditor />);
    await screen.findByRole("heading", { name: "premium-light" });

    fireEvent.click(screen.getByRole("tab", { name: /metals/i }));
    const panel = screen.getByRole("tabpanel");
    expect(
      within(panel).getByText("--block-metal-chrome-base"),
    ).toBeInTheDocument();
  });
});
