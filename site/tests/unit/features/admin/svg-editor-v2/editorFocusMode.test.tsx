// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminLayoutShell from "@/features/admin/AdminLayoutShell";
import { isSvgEditorFocusRoute } from "@/features/admin/svg-editor-v2/ui/SvgEditorNavigationToggle";

let pathname = "/admin";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: () => <span>Logo</span>,
}));

describe("SVG editor focus mode", () => {
  beforeEach(() => {
    pathname = "/admin";
  });

  it("only activates on SVG editor detail routes", () => {
    expect(isSvgEditorFocusRoute("/admin/svg-editor/new")).toBe(true);
    expect(isSvgEditorFocusRoute("/admin/svg-editor/chair")).toBe(true);
    expect(isSvgEditorFocusRoute("/admin/svg-editor")).toBe(false);
    expect(isSvgEditorFocusRoute("/admin/inventory")).toBe(false);
  });

  it("hides navigation on editor detail routes and restores focus after overlay close", () => {
    pathname = "/admin/svg-editor/new";
    render(<AdminLayoutShell><div>Editor content</div></AdminLayoutShell>);

    const toggle = screen.getByRole("button", { name: /show navigation/i });
    expect(screen.queryByLabelText("Admin navigation")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByRole("dialog", { name: /admin navigation/i })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: /admin navigation/i })).not.toBeInTheDocument();
    expect(document.activeElement).toBe(toggle);
  });

  it("keeps navigation visible on non-editor routes", () => {
    pathname = "/admin/svg-editor";
    render(<AdminLayoutShell><div>Inventory content</div></AdminLayoutShell>);

    expect(screen.getByLabelText("Admin navigation")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /show navigation/i })).not.toBeInTheDocument();
  });
});
