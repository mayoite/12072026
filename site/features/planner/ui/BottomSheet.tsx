"use client";

import { useEffect, useId, type ReactNode } from "react";
import { Z } from "@/lib/z-index";

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

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <>
      <button
        type="button"
        className={`bg-inverse/40 transition-opacity duration-300 md:hidden ${ open ? "opacity-100" : "pointer-events-none opacity-0" }`}
        style={{ zIndex: Z.panel - 1 }}
        aria-label="Close bottom sheet"
        onClick={onClose}
      />
      <section
        className={`bottom-0 left-0 right-0 max-h-[90dvh] rounded-t-2xl border border-soft bg-panel pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-300 md:hidden ${ open ? "translate-y-0" : "pointer-events-none translate-y-full" }`}
        style={{ zIndex: Z.panel }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby={title ? titleId : undefined}
      >
        <div className="py-3">
          <span className="h-1 w-10 rounded-full bg-soft" aria-hidden />
        </div>
        {title ? (
          <h2 id={titleId} className="px-4 pb-3 text-sm font-semibold text-strong">
            {title}
          </h2>
        ) : null}
        <div className="max-h-[calc(90dvh-56px)] overscroll-contain">
          {children}
        </div>
      </section>
    </>
  );
}
