"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useViewportHeight } from "@/features/planner/hooks/useViewportHeight";

const WORKSPACE_PREFIXES = ["/planner/canvas", "/planner/guest"];

function usesWorkspaceShell(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return WORKSPACE_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

/** Route-aware body classes: marketing = scheme-page, editor = planner-workspace. */
export function PlannerBodyTheme() {
  useViewportHeight();

  const pathname = usePathname();

  useEffect(() => {
    const workspace = usesWorkspaceShell(pathname);
    document.body.classList.toggle("planner-workspace", workspace);
    document.body.classList.toggle("planner-root", workspace);
    document.body.classList.toggle("scheme-page", !workspace);
    document.body.classList.remove("planner-dark-shell");

    if (workspace) {
      document.body.classList.add("h-dvh", "w-screen", "overflow-hidden");
    } else {
      document.body.classList.remove("h-dvh", "w-screen", "overflow-hidden");
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
    }

    return () => {
      document.body.classList.remove("planner-workspace", "planner-root", "scheme-page", "h-dvh", "w-screen", "overflow-hidden");
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
    };
  }, [pathname]);

  return null;
}
