/**
 * TDD tests for /portal/svg-catalog/[slug] (05-PORT-02, 05-TEST-01/04).
 * Covers getPuckData, 404, render, metadata, inline SVG, a11y.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import SvgCatalogSlugPage, { generateMetadata } from "@/app/(site)/portal/svg-catalog/[slug]/page";
import * as loader from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import * as registry from "@/app/(site)/portal/svg-catalog/puckBlockRegistry";

vi.mock("next/navigation", () => ({ notFound: vi.fn(() => { throw new Error("404"); }) }));

vi.mock("@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader", () => ({
  tryLoad: vi.fn(),
}));

vi.mock("@/app/(site)/portal/svg-catalog/puckBlockRegistry", () => ({
  getPuckData: vi.fn((d: any) => ({ root: {}, content: [{ type: "BlockFixed", props: { slug: d.slug } }] })),
  puckConfig: { components: {} },
}));

vi.mock("@puckeditor/core", () => ({
  Render: (p: any) => <div data-testid="puck-render" data-slug={p.data?.content?.[0]?.props?.slug} />,
}));

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<any>("node:fs");
  return { ...actual, readFileSync: vi.fn(() => "<svg role=\"img\" aria-label=\"test\"><title>Test</title></svg>") };
});

describe("app/(site)/portal/svg-catalog/[slug]/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("05-TEST-01: server render roundtrip loads, renders Render + inline svg + a11y role", async () => {
    const desc = { slug: "side-table-001", variant: "fixed", schemaVersion: "v", title: "t" } as any;
    (loader.tryLoad as any).mockReturnValue({ ok: true, value: desc });

    const Page = await SvgCatalogSlugPage({ params: Promise.resolve({ slug: "side-table-001" }) });
    render(Page);

    expect(screen.getByTestId("puck-render")).toHaveAttribute("data-slug", "side-table-001");
    // svg inline present via mock
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("05-TEST-04: not found or invalid -> notFound + NotFound component", async () => {
    (loader.tryLoad as any).mockReturnValue({ ok: false, error: { kind: "notFound" } });
    await expect(
      SvgCatalogSlugPage({ params: Promise.resolve({ slug: "nope" }) })
    ).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });

  it("generateMetadata produces title/og with version", async () => {
    const desc = { slug: "x", schemaVersion: "2026-07-04.v2", variant: "fixed" } as any;
    (loader.tryLoad as any).mockReturnValue({ ok: true, value: desc });
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "x" }) });
    expect(meta.title).toMatch(/x/);
    expect(meta.openGraph?.images).toBeTruthy();
  });
});
