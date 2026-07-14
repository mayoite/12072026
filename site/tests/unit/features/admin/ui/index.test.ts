import { describe, expect, it } from "vitest";
import * as barrel from "@/features/admin/ui";
import { AdminShell } from "@/features/admin/ui/AdminShell";
import { AdminDashboard } from "@/features/admin/ui/AdminDashboard";

describe("admin ui barrel", () => {
  it("re-exports shell and dashboard by identity", () => {
    expect(barrel.AdminShell).toBe(AdminShell);
    expect(barrel.AdminDashboard).toBe(AdminDashboard);
  });
});
