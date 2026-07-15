"use client";

export function isSvgEditorFocusRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "");
  return /^\/admin\/svg-editor\/[^/]+$/.test(normalized);
}

export function SvgEditorNavigationToggle({
  expanded,
  onToggle,
  buttonRef,
}: {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="shell-admin-mobile-toggle"
      aria-expanded={expanded}
      aria-controls="admin-mobile-sidebar"
      aria-label={expanded ? "Hide navigation" : "Show navigation"}
      onClick={onToggle}
    >
      {expanded ? "Hide navigation" : "Show navigation"}
    </button>
  );
}
