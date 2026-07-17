import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import AdminPlanDetailPageView from "@/features/admin/plans/AdminPlanDetailPageView";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "plan-1" }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const draftPlan = {
  id: "plan-1",
  title: "Test Plan",
  project_name: null,
  client_name: null,
  prepared_by: null,
  room_width_mm: 4000,
  room_depth_mm: 3000,
  seat_target: 4,
  unit_system: "mm",
  item_count: 0,
  thumbnail_url: null,
  scene_json: {},
  status: "draft" as const,
  review_status: "pending" as const,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  const status = init.status ?? (init.ok === false ? 500 : 200);
  const ok = init.ok ?? (status >= 200 && status < 300);
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe("AdminPlanDetailPageView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browserApiFetch).mockResolvedValue(
      jsonResponse({ success: true, plan: draftPlan }),
    );
  });

  it("fetches plan detail by id", async () => {
    render(<AdminPlanDetailPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());
    expect(apiPath).toHaveBeenCalledWith("/api/admin/plans/plan-1");
    expect(await screen.findByText("Test Plan")).toBeInTheDocument();
  });

  it("PATCHes status via browserApiFetch (CSRF-bearing client)", async () => {
    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce(jsonResponse({ success: true, plan: draftPlan }))
      .mockResolvedValueOnce(
        jsonResponse({
          plan: { ...draftPlan, status: "active", review_status: "approved" },
        }),
      );

    render(<AdminPlanDetailPageView />);
    await screen.findByText("Test Plan");

    const approve = screen.getByRole("button", { name: /approve|active/i });
    fireEvent.click(approve);

    await waitFor(() => {
      expect(browserApiFetch).toHaveBeenCalledWith(
        "/api/admin/plans/plan-1",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "active" }),
        }),
      );
    });
  });

  it("surfaces PATCH failure", async () => {
    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce(jsonResponse({ success: true, plan: draftPlan }))
      .mockResolvedValueOnce(jsonResponse({}, { ok: false, status: 403 }));

    render(<AdminPlanDetailPageView />);
    await screen.findByText("Test Plan");

    const approve = screen.getByRole("button", { name: /approve|active/i });
    fireEvent.click(approve);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Failed to update plan \(403\)/i,
    );
  });
});
