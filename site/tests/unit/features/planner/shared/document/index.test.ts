import { describe, expect, it } from "vitest";
import * as documentBarrel from "@/features/planner/shared/document";

describe("shared/document index", () => {
  it("re-exports document bridge and types module surface", () => {
    // Runtime surface is documentBridge helpers; types are compile-time only.
    const keys = Object.keys(documentBarrel);
    expect(keys.length).toBeGreaterThan(0);
    const fns = keys.filter((k) => typeof (documentBarrel as Record<string, unknown>)[k] === "function");
    expect(fns.length).toBeGreaterThan(0);
  });
});
