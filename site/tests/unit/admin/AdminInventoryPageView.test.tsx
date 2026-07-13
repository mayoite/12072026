import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import AdminInventoryPageView from "@/features/planner/admin/AdminInventoryPageView";

const HEADER =
  "kind,url_route,area,render_mode,auth,file,summary";

function csv(rows: string[]): string {
  return [HEADER, ...rows].join("\n");
}

describe("AdminInventoryPageView", () => {
  it("shows empty inventory message when CSV has no data rows", () => {
    render(<AdminInventoryPageView csv={HEADER} generatedAt={null} rowCount={0} />);
    expect(
      screen.getByText(/Inventory file is missing or empty/i),
    ).toBeInTheDocument();
  });

  it("parses CRLF lines and falls back to how_it_works when summary is absent", () => {
    const body = [
      "kind,url_route,area,render_mode,auth,file,how_it_works",
      'page,/legacy,admin,ssr,admin,app/legacy.tsx,"Works via how_it_works"',
    ].join("\r\n");

    render(
      <AdminInventoryPageView csv={body} generatedAt={null} rowCount={1} />,
    );

    expect(screen.getByText("/legacy")).toBeInTheDocument();
    expect(screen.getByText("Works via how_it_works")).toBeInTheDocument();
    expect(screen.getByText(/Showing 1 of 1/)).toBeInTheDocument();
  });

  it("unescapes doubled quotes inside CSV fields", () => {
    const body = csv([
      'page,/q,admin,ssr,admin,app/q.tsx,"Says ""hello"" here"',
    ]);
    render(<AdminInventoryPageView csv={body} generatedAt={null} rowCount={1} />);
    expect(screen.getByText('Says "hello" here')).toBeInTheDocument();
  });

  it("filters by kind, area, and search together", () => {
    const body = csv([
      'page,/admin,admin,ssr,admin,app/admin/page.tsx,"Admin hub"',
      'api,/api/plans,planner,route,admin,app/api/plans/route.ts,"Plans API"',
      'page,/planner,planner,ssr,member,app/planner/page.tsx,"Planner canvas"',
    ]);
    render(
      <AdminInventoryPageView
        csv={body}
        generatedAt="2026-07-01T00:00:00.000Z"
        rowCount={3}
      />,
    );

    expect(screen.getByText(/3\s+rows/)).toBeInTheDocument();
    expect(screen.getByText(/Showing 3 of 3/)).toBeInTheDocument();

    const [kindSelect, areaSelect] = screen.getAllByRole("combobox");
    fireEvent.change(kindSelect, { target: { value: "page" } });
    expect(screen.getByText(/Showing 2 of 3/)).toBeInTheDocument();
    expect(screen.queryByText("/api/plans")).not.toBeInTheDocument();

    fireEvent.change(areaSelect, { target: { value: "planner" } });
    expect(screen.getByText(/Showing 1 of 3/)).toBeInTheDocument();
    expect(screen.getByText("/planner")).toBeInTheDocument();
    expect(screen.queryByText("/admin")).not.toBeInTheDocument();

    const search = screen.getByPlaceholderText("Search route, file, summary…");
    fireEvent.change(search, { target: { value: "no-match-xyz" } });
    expect(screen.getByText(/Showing 0 of 3/)).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "canvas" } });
    expect(screen.getByText(/Showing 1 of 3/)).toBeInTheDocument();
    expect(screen.getByText("Planner canvas")).toBeInTheDocument();
  });

  it("searches auth and file columns", () => {
    const body = csv([
      'page,/a,admin,ssr,member-only,app/special-file.tsx,"Alpha"',
      'page,/b,admin,ssr,public,app/other.tsx,"Beta"',
    ]);
    render(<AdminInventoryPageView csv={body} generatedAt={null} rowCount={2} />);

    fireEvent.change(
      screen.getByPlaceholderText("Search route, file, summary…"),
      { target: { value: "special-file" } },
    );
    expect(screen.getByText("/a")).toBeInTheDocument();
    expect(screen.queryByText("/b")).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText("Search route, file, summary…"),
      { target: { value: "member-only" } },
    );
    expect(screen.getByText("/a")).toBeInTheDocument();
  });

  it("renders em dash when url_route is empty and tolerates short rows", () => {
    const body = [
      "kind,url_route,area,render_mode,auth,file,summary",
      "page,,admin,ssr,admin,app/x.tsx,No route",
      "orphan-only",
    ].join("\n");
    render(<AdminInventoryPageView csv={body} generatedAt={null} rowCount={2} />);
    // Empty url_route and short CSV rows both render "—" in the route column
    expect(screen.getAllByText("—").length).toBe(2);
    expect(screen.getByText("No route")).toBeInTheDocument();
    expect(screen.getByText("app/x.tsx")).toBeInTheDocument();
    // kind appears in both filter option and table cell
    expect(screen.getAllByText("orphan-only").length).toBe(2);
    expect(screen.getByText(/Showing 2 of 2/)).toBeInTheDocument();
  });
});
