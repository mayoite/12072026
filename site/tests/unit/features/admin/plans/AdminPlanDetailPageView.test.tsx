import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import AdminPlanDetailPageView from "@/features/admin/plans/AdminPlanDetailPageView";
import { browserApiFetch } from "@/lib/api/browserApi";

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
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("AdminPlanDetailPageView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        plan: {
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
          status: "draft",
          review_status: "pending",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      }),
    } as Response);
  });

  it("fetches plan detail by id", async () => {
    render(<AdminPlanDetailPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());
  });
});
