import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CrmWorkspaceBanner } from "@/features/crm/CrmWorkspaceBanner";

const seedDemoData = vi.fn();
const clearAll = vi.fn();
const exportSnapshot = vi.fn(() => ({
  version: 1 as const,
  exportedAt: "2026-01-01",
  clients: [],
  projects: [],
  quotes: [],
}));
const importSnapshot = vi.fn(() => true);

let clients: unknown[] = [];
let projects: unknown[] = [];
let quotes: unknown[] = [];

vi.mock("@/features/crm/stores/crmStore", () => ({
  useCrmStore: (selector?: (s: Record<string, unknown>) => unknown) => {
    const state = {
      clients,
      projects,
      quotes,
      seedDemoData,
      clearAll,
      exportSnapshot,
      importSnapshot,
    };
    return typeof selector === "function" ? selector(state) : state;
  },
  // getState used by import handler
  getState: () => ({ importSnapshot }),
}));

// patch getState on the module mock after import via useCrmStore.getState
vi.mock("@/features/crm/stores/crmDemoSeed", () => ({
  isCrmDemoModeEnabled: () => false,
}));

describe("CrmWorkspaceBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clients = [];
    projects = [];
    quotes = [];
  });

  it("shows load sample data when empty", () => {
    render(<CrmWorkspaceBanner />);
    expect(screen.getByText(/Browser-only CRM/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Load sample data/i }));
    expect(seedDemoData).toHaveBeenCalled();
  });

  it("shows export and clear when data exists", () => {
    clients = [{ id: "c1" }];
    render(<CrmWorkspaceBanner />);
    expect(screen.getByRole("button", { name: /Export JSON/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear all/i })).toBeInTheDocument();
  });
});
