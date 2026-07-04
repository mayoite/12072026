import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeEditor } from "@/app/admin/themes/ThemeEditor";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";
});

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  })),
}));

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (path: string) => path,
  browserApiFetch: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  Save: (props: React.SVGProps<SVGSVGElement>) => <svg aria-hidden data-testid="icon-save" {...props} />,
  UploadCloud: (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden data-testid="icon-upload" {...props} />
  ),
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden data-testid="icon-alert" {...props} />
  ),
}));

describe("app/admin/themes/ThemeEditor.tsx", () => {
  it("renders theme editor after themes load", async () => {
    render(<ThemeEditor />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Publish to Planners/i })).toBeInTheDocument();
    });
  });
});
