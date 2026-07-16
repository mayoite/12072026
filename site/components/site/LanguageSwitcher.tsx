"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "हिन्दी",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

/** Full labels for footer / mobile drawer. */
const LANGUAGE_NAMES_FULL: Record<string, string> = {
  en: "English",
  hi: "हिन्दी (Hindi)",
  fr: "Français (French)",
  de: "Deutsch (German)",
  es: "Español (Spanish)",
};

export type LanguageSwitcherProps = {
  /**
   * `header` — compact select for site chrome (desktop + drawer).
   * `footer` — labeled block for footer (default).
   */
  variant?: "header" | "footer";
  className?: string;
};

export function LanguageSwitcher({
  variant = "footer",
  className,
}: LanguageSwitcherProps) {
  const reactId = useId();
  const selectId =
    variant === "header" ? `locale-switcher-header-${reactId}` : "locale-switcher";
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*NEXT_LOCALE\s*=\s*([^;]+)/);
    if (match) {
      Promise.resolve().then(() => setCurrentLocale(match[2]));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(nextLocale);
    window.location.reload();
  };

  const names = variant === "header" ? LANGUAGE_NAMES : LANGUAGE_NAMES_FULL;

  if (variant === "header") {
    return (
      <div className={cn("site-header__locale shrink-0", className)}>
        <label htmlFor={selectId} className="sr-only">
          Select Language
        </label>
        <select
          id={selectId}
          value={currentLocale}
          onChange={handleChange}
          aria-label="Select Language"
          className="site-header__locale-select min-h-11 max-w-[7.5rem] cursor-pointer rounded-full border border-soft bg-panel px-3 py-2 text-xs font-semibold text-strong shadow-none transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:max-w-[8.5rem] sm:text-sm"
        >
          {Object.entries(names).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5 mt-2", className)}>
      <label htmlFor={selectId} className="typ-label text-inverse-muted">
        Select Language
      </label>
      <select
        id={selectId}
        value={currentLocale}
        onChange={handleChange}
        className="w-40 cursor-pointer rounded border border-theme-soft bg-panel px-2.5 py-1 text-sm text-strong focus:border-primary focus:outline-none"
      >
        {Object.entries(names).map(([code, name]) => (
          <option key={code} value={code} className="bg-panel text-strong">
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
