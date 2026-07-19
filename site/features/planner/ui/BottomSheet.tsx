"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "@/app/css/core/locked/planner/bottom-sheet.module.css";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapPoints?: readonly string[];
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  snapPoints: _snapPoints,
}: BottomSheetProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const dialog = dialogRef.current;
    const frame = requestAnimationFrame(() => {
      const firstControl = dialog?.querySelector<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      );
      (firstControl ?? dialog)?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((control) => control.getClientRects().length > 0);
      if (controls.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  return (
    <>
      <button
        type="button"
        className={`${styles.backdrop} pw-bottom-sheet-backdrop`}
        data-open={open ? "true" : "false"}
        aria-label="Close bottom sheet"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <section
        ref={dialogRef}
        className={`${styles.sheet} pw-bottom-sheet`}
        data-open={open ? "true" : "false"}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        <div className={styles.handle}>
          <span className={styles.handleMark} aria-hidden />
        </div>
        {title ? (
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
        ) : null}
        <div className={styles.content}>
          {children}
        </div>
      </section>
    </>
  );
}
