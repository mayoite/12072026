import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "@/app/offline/layout";

describe("Offline RootLayout", () => {
  it("renders correctly with html, body and children", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div data-testid="offline-child">Content</div>
      </RootLayout>
    );
    expect(html).toContain("<html");
    expect(html).toContain("<body");
    expect(html).toContain('data-testid="offline-child"');
  });
});
