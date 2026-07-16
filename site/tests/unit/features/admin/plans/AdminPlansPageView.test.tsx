import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
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
      json: async () => ({ success: true, plans: [], total: 0 }),
    } as Response);
  });

  it("loads plans list", async () => {
    render(<AdminPlansPageView />);
    await waitFor(() => expect(browserApiFetch).toHaveBeenCalled());
    expect(document.body.textContent?.length).toBeGreaterThan(0);
  });
});
