import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopBar } from "@/features/planner/editor/TopBar";

/** UI-MOB-03 phone floor (CSS pixels). */
const PHONE_MIN_TAP_PX = "44";
const PHONE_MIN_TAP_REM = "2.75";
/** STRONG-W2: two phone rows × 44–56px ≤ 112px top chrome band. */
const PHONE_TOPBAR_MAX_PX = "112";
const PHONE_TOPBAR_MAX_REM = "7rem";

function workspaceCssSource(): string {
  return readFileSync(
    path.resolve(
      process.cwd(),
      "features/planner/editor/workspace.module.css",
    ),
    "utf8",
  );
}

afterEach(() => cleanup());

describe("TopBar", () => {
  it("shows project name and save status", () => {
    render(
      <TopBar
        projectName="Mirror Plan"
        viewMode="2d"
        onViewModeChange={vi.fn()}
      />,
    );
    expect(document.body.textContent).toMatch(/Mirror Plan/);
    expect(screen.getByTestId("open3d-save-status")).toBeDefined();
    expect(screen.getByTestId("open3d-save-status").textContent?.length).toBeGreaterThan(0);
  });

  it("renders desktop Grid and Snap buttons wired to toggles", async () => {
    const onToggleGrid = vi.fn();
    const onToggleSnap = vi.fn();
    const user = userEvent.setup();

    render(
      <TopBar
        projectName="Grid Plan"
        viewMode="2d"
        gridEnabled
        snapEnabled={false}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
      />,
    );

    const gridBtn = screen.getByRole("button", { name: /Disable grid/i });
    const snapBtn = screen.getByRole("button", { name: /Enable snap/i });

    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(snapBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(gridBtn);
    await user.click(snapBtn);

    expect(onToggleGrid).toHaveBeenCalledTimes(1);
    expect(onToggleSnap).toHaveBeenCalledTimes(1);
  });

  it("labels guest save/export as local-only downloads", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();

    render(
      <TopBar
        accessContext="guest"
        projectName="Guest Draft"
        viewMode="2d"
        saveStatus="idle"
        saveCloudEnabled={false}
        onSave={onSave}
      />,
    );

    expect(screen.getByTestId("planner-guest-local-badge")).toHaveTextContent(/Local only/i);
    expect(screen.getByTestId("open3d-save-status").textContent).toMatch(/Guest · local/i);
    expect(screen.getByTestId("open3d-save-status")).toHaveAttribute("data-storage", "local");
    expect(screen.getByTestId("open3d-save-status")).toHaveAttribute("data-ui-state", "idle");

    const saveBtn = screen.getByTestId("planner-save-button");
    expect(saveBtn).toHaveTextContent(/Save draft/i);
    expect(saveBtn).toHaveAttribute("aria-label", expect.stringMatching(/this device/i));

    await user.click(saveBtn);
    expect(onSave).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId("planner-guest-export")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export — download plan or BOQ to this device/i }),
    ).toBeInTheDocument();
    // Guest has no Import — persistence actions are member-only.
    expect(screen.queryByRole("button", { name: /Import/i })).toBeNull();
  });

  describe("UI-MOB phone chrome (two-row top + 44px targets)", () => {
    it("declares two-row phone layout, 112px budget, and primary/tools row markers", () => {
      render(
        <TopBar
          projectName="Phone chrome"
          viewMode="2d"
          chromeMode="slim"
          onToggleLeftPanel={vi.fn()}
          onToggleRightPanel={vi.fn()}
          onToggleBottomPanel={vi.fn()}
          onSave={vi.fn()}
        />,
      );

      const topbar = screen.getByTestId("planner-topbar");
      expect(topbar).toHaveAttribute("data-mobile-chrome", "top");
      expect(topbar).toHaveAttribute("data-phone-layout", "two-row");
      expect(topbar).toHaveAttribute("data-phone-topbar-max-px", PHONE_TOPBAR_MAX_PX);
      expect(topbar).toHaveAttribute("data-chrome-mode", "slim");

      const primaryRows = topbar.querySelectorAll('[data-phone-row="primary"]');
      const toolsRows = topbar.querySelectorAll('[data-phone-row="tools"]');
      expect(primaryRows.length).toBe(2); // brand + actions
      expect(toolsRows.length).toBe(1); // center view pack
    });

    it("marks frequent phone actions with ≥44px tap contract", () => {
      render(
        <TopBar
          projectName="Tap targets"
          viewMode="2d"
          chromeMode="slim"
          onToggleLeftPanel={vi.fn()}
          onToggleRightPanel={vi.fn()}
          onToggleBottomPanel={vi.fn()}
          onSave={vi.fn()}
          onExport={vi.fn()}
        />,
      );

      const save = screen.getByTestId("planner-save-button");
      expect(save).toHaveAttribute("data-min-tap-px", PHONE_MIN_TAP_PX);

      expect(screen.getByTestId("planner-toggle-inventory")).toHaveAttribute(
        "data-min-tap-px",
        PHONE_MIN_TAP_PX,
      );
      expect(screen.getByTestId("planner-toggle-properties")).toHaveAttribute(
        "data-min-tap-px",
        PHONE_MIN_TAP_PX,
      );
      expect(screen.getByTestId("planner-toggle-layers")).toHaveAttribute(
        "data-min-tap-px",
        PHONE_MIN_TAP_PX,
      );
      expect(screen.getByTestId("planner-more-actions")).toHaveAttribute(
        "data-min-tap-px",
        PHONE_MIN_TAP_PX,
      );

      const viewMode = screen.getByTestId("planner-view-mode");
      const radios = viewMode.querySelectorAll("[data-min-tap-px]");
      expect(radios.length).toBeGreaterThanOrEqual(2);
      for (const radio of radios) {
        expect(radio).toHaveAttribute("data-min-tap-px", PHONE_MIN_TAP_PX);
      }
    });

    it("slim chrome collapses file actions into More (less clutter)", () => {
      render(
        <TopBar
          projectName="Slim pack"
          viewMode="2d"
          chromeMode="slim"
          onImport={vi.fn()}
          onSketchToPlan={vi.fn()}
          onExport={vi.fn()}
          onShowDockPanel={vi.fn()}
          onResetLayout={vi.fn()}
        />,
      );

      expect(screen.getByTestId("planner-more-actions")).toBeInTheDocument();
      // Full-mode sprawl stays out of the slim tree
      expect(screen.queryByRole("button", { name: /Import plan/i })).toBeNull();
      expect(screen.queryByRole("button", { name: /Sketch to plan/i })).toBeNull();
      expect(screen.queryByTestId("planner-density-toggle")).toBeNull();
    });

    it("exposes Help toggle separate from AI (guest-safe)", async () => {
      const user = userEvent.setup();
      const onToggleHelp = vi.fn();
      render(
        <TopBar
          projectName="Help chrome"
          viewMode="2d"
          chromeMode="slim"
          accessContext="guest"
          isHelpOpen={false}
          onToggleHelp={onToggleHelp}
          onSave={vi.fn()}
        />,
      );

      const helpPhone = screen.getByTestId("planner-toggle-help");
      expect(helpPhone).toHaveAttribute("aria-label", "Open help");
      expect(helpPhone).toHaveAttribute("data-min-tap-px", PHONE_MIN_TAP_PX);
      await user.click(helpPhone);
      expect(onToggleHelp).toHaveBeenCalledTimes(1);

      const helpDesktop = screen.getByTestId("planner-toggle-help-desktop");
      expect(helpDesktop).toHaveAttribute("aria-label", "Open help");
      expect(helpDesktop.className).toMatch(/desktopOnly/);
    });

    it("keeps floor and unit selectors desktop-only (phone primary = 2D/3D)", () => {
      render(
        <TopBar
          projectName="Secondary hide"
          viewMode="2d"
          chromeMode="slim"
          floors={[{ id: "f1", name: "Ground" }]}
          activeFloorId="f1"
          displayUnit="cm"
          onFloorChange={vi.fn()}
          onDisplayUnitChange={vi.fn()}
        />,
      );

      const floorBtn = screen.getByRole("button", { name: /Active floor: Ground/i });
      const unitBtn = screen.getByRole("button", { name: /Display unit: cm/i });
      // desktopOnly class is applied so phone CSS can hide without removing a11y on desktop
      expect(floorBtn.className).toMatch(/desktopOnly/);
      expect(unitBtn.className).toMatch(/desktopOnly/);
    });

    it("CSS enforces ≤112px top chrome budget, two-row areas, ≥44px targets", () => {
      const css = workspaceCssSource();

      // Deliberate two-row composition (not three stacked full-width rows)
      expect(css).toContain('data-phone-layout="two-row"');
      expect(css).toMatch(
        /grid-template-areas:\s*"brand actions"\s*"center center"/,
      );
      expect(css).toContain('data-phone-row="primary"');
      expect(css).toContain('data-phone-row="tools"');

      // Height budget tokens (7rem = 112px @ 16px root)
      expect(css).toContain(`--ws-phone-topbar-max-h: ${PHONE_TOPBAR_MAX_REM}`);
      expect(css).toContain("--ws-phone-topbar-row-h:");
      expect(css).toMatch(
        /max-height:\s*calc\(\s*var\(--ws-phone-topbar-max-h/,
      );
      // Documented 112px band in comments (prove intent is not open-ended)
      expect(css).toMatch(/112px/);
      expect(css).toMatch(/7rem/);

      // Touch floor via planner token (2.75rem = 44px at 16px root)
      expect(css).toContain(`min-height: var(--planner-touch-target, ${PHONE_MIN_TAP_REM}rem)`);
      expect(css).toContain(`min-width: var(--planner-touch-target, ${PHONE_MIN_TAP_REM}rem)`);
      expect(css).toMatch(/\.mobilePanelBtn[\s\S]*min-height:\s*var\(--planner-touch-target/);
      expect(css).toMatch(/\.phonePrimaryBtn[\s\S]*min-height:\s*var\(--planner-touch-target/);

      // History + guest badge stay desktop-only on phone (declutter)
      expect(css).toMatch(/\.historyActions\s*\{[\s\S]*?display:\s*none/);
      expect(css).toMatch(/\.brandSub\s*\{[\s\S]*?display:\s*none/);

      // Canvas flex growth chain documented for phone
      expect(css).toMatch(/grid-template-rows:\s*auto minmax\(0,\s*1fr\) auto/);
      expect(css).toMatch(/\.mobileBottomChrome[\s\S]*max-height:/);
    });
  });
});
