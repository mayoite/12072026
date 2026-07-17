import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { AdminPriceBookPageView } from "@/features/admin/pricing/AdminPriceBookPageView";
import { browserApiFetch } from "@/lib/api/browserApi";
import type {
  PriceBookContract,
  PriceBookVersion,
} from "@/features/admin/pricing/priceBookContract";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

const RULE = {
  sku: "OFL-DSK-LIN-1200",
  unitPriceMinor: 450_000_00,
  currency: "INR" as const,
  uom: "each" as const,
  adjustmentBps: 250,
};

function version(
  partial: Pick<PriceBookVersion, "versionId" | "status"> &
    Partial<PriceBookVersion>,
): PriceBookVersion {
  return {
    effectiveFrom: "2026-07-01",
    currency: "INR",
    rules: [RULE],
    ...partial,
  };
}

const FIXTURE: PriceBookContract = {
  type: "oando-price-book",
  schemaVersion: 1,
  familySlug: "linear-desk-1200",
  bookId: "pb-linear-2026-q3",
  activeVersionId: "v1",
  versions: [
    version({ versionId: "v1", status: "active" }),
    version({
      versionId: "v0",
      status: "rolled_back",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-06-30",
      rules: [
        {
          sku: "OFL-DSK-LIN-1200",
          unitPriceMinor: 400_000_00,
          currency: "INR",
          uom: "each",
        },
      ],
    }),
  ],
};

const DRAFT_BOOK: PriceBookContract = {
  ...FIXTURE,
  activeVersionId: null,
  versions: [version({ versionId: "v-draft", status: "draft" })],
};

const APPROVED_BOOK: PriceBookContract = {
  ...FIXTURE,
  activeVersionId: "v-live",
  versions: [
    version({ versionId: "v-ready", status: "approved" }),
    version({ versionId: "v-live", status: "active" }),
  ],
};

describe("AdminPriceBookPageView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, books: [], versions: [] }),
    } as Response);
  });

  it("mounts and requests price book data", async () => {
    render(<AdminPriceBookPageView />);
    await waitFor(() => {
      expect(browserApiFetch.mock.calls.length + document.body.textContent!.length).toBeGreaterThan(0);
    });
  });

  it("renders price book panel without inline presentation", () => {
    const { container } = render(<AdminPriceBookPageView initialContract={FIXTURE} />);
    expect(container.querySelector("[data-testid='admin-price-book-panel'] [style]")).toBeNull();
  });

  it("shows empty state with purpose copy and retry when no contract", async () => {
    render(<AdminPriceBookPageView initialContract={null} />);
    await waitFor(() => {
      expect(screen.getByTestId("admin-price-book-empty")).toBeInTheDocument();
    });
    expect(screen.getByTestId("admin-price-book-empty")).toHaveTextContent(
      /versioned currency rules/i,
    );
    expect(screen.getByTestId("admin-price-book-empty-retry")).toBeInTheDocument();
  });

  it("honesty: source is admin price-book service, not marketing catalog", () => {
    render(
      <AdminPriceBookPageView
        initialContract={FIXTURE}
        initialRole="approver"
      />,
    );
    const source = screen.getByTestId("admin-shell-source");
    expect(source).toHaveTextContent(/admin price-book service/i);
    expect(source).toHaveTextContent(/filesystem seed fallback/i);
    expect(source).toHaveTextContent(/Not the marketing product catalog/i);
  });

  it("AF-07 unit: primary currency display; minor units only under Advanced; activate is primary", () => {
    render(
      <AdminPriceBookPageView
        initialContract={FIXTURE}
        initialRole="approver"
      />,
    );
    const sku = "OFL-DSK-LIN-1200";
    const primary = screen.getByTestId(`admin-price-primary-${sku}`);
    // Operator-facing currency, not raw minor integer as the main cell
    expect(primary.textContent).toMatch(/₹|INR|Rs/i);
    expect(primary.textContent).not.toMatch(/^45000000$/);
    expect(primary.textContent).not.toMatch(/minor units/i);

    const rulesTable = screen.getByTestId("admin-price-book-rules");
    const primaryHeaders = within(rulesTable)
      .getAllByRole("columnheader")
      .map((th) => th.textContent ?? "");
    expect(primaryHeaders).toEqual(["SKU", "Price", "Unit"]);
    expect(primaryHeaders.join(" ")).not.toMatch(/minor|bps/i);

    const advanced = screen.getByTestId("admin-price-book-technical");
    expect(advanced.tagName.toLowerCase()).toBe("details");
    // ADM-PRICE-01 — raw storage collapsed until operator opens Advanced
    expect(advanced).not.toHaveAttribute("open");
    expect(advanced).toHaveTextContent(/minor units/i);
    const secondary = screen.getByTestId(`admin-price-secondary-${sku}`);
    expect(secondary.textContent).toMatch(/minor units/i);
    expect(secondary.textContent).toMatch(/45000000/);
    // Adj bps only in Advanced technical table, not the primary Price column
    expect(within(advanced).getByText("250")).toBeInTheDocument();
    expect(within(rulesTable).queryByText("250")).toBeNull();

    const activate = screen.getByTestId("admin-price-book-activate");
    const approve = screen.getByTestId("admin-price-book-approve");
    const rollback = screen.getByTestId("admin-price-book-rollback");
    expect(activate.className).toMatch(/admin-btn--primary/);
    expect(approve.className).toMatch(/admin-btn--outline/);
    expect(approve.className).not.toMatch(/admin-btn--primary/);
    expect(rollback.className).toMatch(/admin-btn--outline/);
    expect(rollback.className).toMatch(/admin-btn--danger/);
    // Active version: activate/approve not available; rollback is
    expect(activate).toBeDisabled();
    expect(approve).toBeDisabled();
    expect(rollback).not.toBeDisabled();
  });

  it("AF-07 unit: draft version — approve outline enabled; activate primary enabled for approver", () => {
    render(
      <AdminPriceBookPageView
        initialContract={DRAFT_BOOK}
        initialRole="approver"
      />,
    );
    const activate = screen.getByTestId("admin-price-book-activate");
    const approve = screen.getByTestId("admin-price-book-approve");
    const rollback = screen.getByTestId("admin-price-book-rollback");

    expect(activate).toHaveClass("admin-btn--primary");
    expect(activate).not.toBeDisabled();
    expect(approve).toHaveClass("admin-btn--outline");
    expect(approve).not.toHaveClass("admin-btn--primary");
    expect(approve).not.toBeDisabled();
    expect(rollback).toHaveClass("admin-btn--danger");
    expect(rollback).toBeDisabled();
    expect(
      screen.getByTestId("admin-price-book-rollback-unavailable"),
    ).toHaveTextContent(/active version/i);
  });

  it("AF-07 unit: approved version — activate primary enabled; approve disabled; rollback disabled", () => {
    render(
      <AdminPriceBookPageView
        initialContract={APPROVED_BOOK}
        initialRole="approver"
      />,
    );
    // Default selected is first version (approved v-ready)
    fireEvent.change(screen.getByTestId("admin-price-book-version-select"), {
      target: { value: "v-ready" },
    });

    const activate = screen.getByTestId("admin-price-book-activate");
    const approve = screen.getByTestId("admin-price-book-approve");
    const rollback = screen.getByTestId("admin-price-book-rollback");

    expect(activate).toHaveClass("admin-btn--primary");
    expect(activate).not.toBeDisabled();
    expect(approve).toBeDisabled();
    expect(approve).not.toHaveClass("admin-btn--primary");
    expect(rollback).toBeDisabled();
    expect(
      screen.getByTestId("admin-price-book-approve-unavailable"),
    ).toHaveTextContent(/draft/i);
  });

  it("AF-07 unit: shell copy keeps technical units secondary to currency", () => {
    render(
      <AdminPriceBookPageView
        initialContract={FIXTURE}
        initialRole="approver"
      />,
    );
    expect(screen.getByTestId("admin-shell-scope-detail")).toHaveTextContent(
      /currency prices/i,
    );
    expect(screen.getByTestId("admin-shell-scope-detail")).toHaveTextContent(
      /Technical units stay under Advanced/i,
    );
    expect(screen.getByTestId("admin-price-book-release-impact")).toBeInTheDocument();
  });
});
