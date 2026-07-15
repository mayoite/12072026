/**
 * Debounced live-compile hook for the no-code SVG editor (A4).
 *
 * Debounces form edits (~300ms) then calls `previewSvgEditorAction` to compile
 * the real SVG. Server actions cannot be aborted, so each effect cleanup marks
 * its request stale. Only the latest active request may update state.
 */

"use client";

import { useEffect, useState } from "react";
import {
  previewSvgEditorAction,
  type SvgPreviewResult,
} from "./previewSvgEditorAction";
import type { SvgEditorFormState } from "../form/svgEditorFormState";

export interface UseDebouncedCompileOptions {
  readonly delayMs?: number;
}

export interface UseDebouncedCompileReturn {
  readonly result: SvgPreviewResult | null;
  readonly pending: boolean;
}

export function useDebouncedCompile(
  slug: string,
  form: SvgEditorFormState,
  opts?: UseDebouncedCompileOptions,
): UseDebouncedCompileReturn {
  const delayMs = opts?.delayMs ?? 300;
  const [result, setResult] = useState<SvgPreviewResult | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    let disposed = false;
    const timer = setTimeout(() => {
      if (disposed) return;
      setPending(true);
      void previewSvgEditorAction(slug, form)
        .then((next) => {
          if (!disposed) {
            setResult(next);
            setPending(false);
          }
        })
        .catch((error: unknown) => {
          if (!disposed) {
            const message =
              error instanceof Error ? error.message : String(error);
            setResult({
              ok: false,
              phase: "compile",
              issues: [],
              error: message,
            });
            setPending(false);
          }
        });
    }, delayMs);

    return () => {
      disposed = true;
      clearTimeout(timer);
    };
  }, [delayMs, form, slug]);

  return { result, pending };
}
