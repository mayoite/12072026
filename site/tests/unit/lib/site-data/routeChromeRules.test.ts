import { describe, expect, it } from "vitest";
import { resolveRouteChromeMode } from "@/lib/site-data/routeChromeRules";

describe("routeChromeRules", () => {
  it("hides chrome on workspace and CAD routes", () => {
    expect(resolveRouteChromeMode("/access")).toEqual({ header: "hidden", footer: "hidden" });
    expect(resolveRouteChromeMode("/dashboard")).toEqual({ header: "hidden", footer: "hidden" });
    expect(resolveRouteChromeMode("/planner/canvas")).toEqual({ header: "hidden", footer: "hidden" });
    expect(resolveRouteChromeMode("/planner/guest")).toEqual({ header: "hidden", footer: "hidden" });
    expect(resolveRouteChromeMode("/planner/open3d")).toEqual({ header: "hidden", footer: "hidden" });
  });

  it("shows login footer tools only on login routes", () => {
    expect(resolveRouteChromeMode("/login")).toEqual({ header: "hidden", footer: "login-tools" });
    expect(resolveRouteChromeMode("/login?next=%2Fdashboard")).toEqual({
      header: "full",
      footer: "login-tools",
    });
  });

  it("shows full chrome on marketing routes", () => {
    expect(resolveRouteChromeMode("/")).toEqual({ header: "full", footer: "full" });
    expect(resolveRouteChromeMode("/about")).toEqual({ header: "full", footer: "full" });
    expect(resolveRouteChromeMode("/solutions")).toEqual({ header: "full", footer: "full" });
  });

  it("treats planner marketing landing as full chrome", () => {
    expect(resolveRouteChromeMode("/oando-planner")).toEqual({ header: "full", footer: "full" });
    expect(resolveRouteChromeMode("/buddy-planner")).toEqual({ header: "full", footer: "full" });
  });
});
