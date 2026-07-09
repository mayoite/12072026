"use client";

export type CommandsPaletteTriggerProps = {
  onOpen: () => void;
};

/**
 * Status-bar Commands control (Ctrl/Cmd+K). Accessible name must keep the
 * visible word "Commands" (WCAG 2.5.3 label-in-name).
 */
export function CommandsPaletteTrigger({ onOpen }: CommandsPaletteTriggerProps) {
  return (
    <button
      type="button"
      className="open3d-palette-trigger"
      onClick={onOpen}
      aria-label="Commands (Ctrl+K)"
    >
      <span className="open3d-palette-trigger__long">Commands (Ctrl+K)</span>
      <span className="open3d-palette-trigger__short">Commands</span>
    </button>
  );
}
