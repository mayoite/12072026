import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPlansPageView from "@/features/admin/plans/AdminPlansPageView";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("AdminPlansPageView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        plans: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 },
        source: "db",
      }),
    } as Response);
  });

  it("loads plans list", async () => {
    render(<AdminPlansPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());
    expect(document.body.textContent?.length).toBeGreaterThan(0);
  });

  it("renders loaded plans with admin links and status labels", async () => {
    vi.mocked(browserApiFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        plans: [
          {
            id: "plan-1",
            title: "Focus Suite",
            project_name: "HQ",
            client_name: "Acme",
            item_count: 12,
            room_width_mm: 4800,
            room_depth_mm: 3600,
            status: "active",
            review_status: "approved",
            created_at: "2026-07-16T08:00:00Z",
            updated_at: "2026-07-16T09:00:00Z",
          },
        ],
        pagination: { page: 1, limit: 50, total: 1, pages: 1 },
        source: "db",
      }),
    } as Response);

    render(<AdminPlansPageView />);

    await waitFor(() => {
      expect(screen.getByText("Focus Suite")).toBeInTheDocument();
    });
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 1 plan")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open in canvas/i })).toHaveAttribute(
      "href",
      expect.stringContaining("plan-1"),
    );
  });

  it("shows unconfigured storage and empty state messaging", async () => {
    vi.mocked(browserApiFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        plans: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 },
        source: "unconfigured",
      }),
    } as Response);

    render(<AdminPlansPageView />);

    await waitFor(() => {
      expect(screen.getByText(/Database storage is not configured/i)).toBeInTheDocument();
    });
    expect(screen.getByText("No plans found yet.")).toBeInTheDocument();
  });

  it("applies search and status filters, then allows clearing them", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers();

    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          plans: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 },
          source: "db",
        }),
      } as Response)
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          plans: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 },
          source: "db",
        }),
      } as Response);

    render(<AdminPlansPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalledTimes(1));

    await user.type(screen.getByPlaceholderText("Title, project, client…"), "Acme");
    await vi.advanceTimersByTimeAsync(350);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalledTimes(2));

    await user.selectOptions(screen.getByDisplayValue("All statuses"), "archived");
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalledTimes(3));

    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
    expect(screen.getByText("No plans match the current filters.")).toBeInTheDocument();
    expect(vi.mocked(browserApiFetch).mock.calls.at(-1)?.[0]).toContain("status=archived");
    expect(vi.mocked(browserApiFetch).mock.calls.at(-1)?.[0]).toContain("search=Acme");

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalledTimes(4));

    vi.useRealTimers();
  });

  it("shows a fetch error when refresh fails", async () => {
    const user = userEvent.setup();
    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          plans: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 },
          source: "db",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

    render(<AdminPlansPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole("button", { name: "Refresh" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Failed to load plans (500)");
    });
  });
});
