import "@/tests/helpers/nextIntlServerEnMock";
import { expect, test, vi } from "vitest";
import RootLayout from "@/app/layout";

vi.mock("@/lib/layout/siteLayoutContext", () => ({
  getSiteLayoutContext: vi.fn().mockResolvedValue({ messages: {}, locale: "en", lang: "en-IN" }),
}));

test("RootLayout renders with children", async () => {
  const children = <div id="test-child">Test Child</div>;
  const jsx = await RootLayout({ children });
  expect(jsx).toBeDefined();
  expect(jsx.type).toBe("html");
  expect(jsx.props.lang).toBe("en-IN");
});
