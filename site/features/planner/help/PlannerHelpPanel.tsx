"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowSquareOut,
  MagnifyingGlass as Search,
  Question,
} from "@phosphor-icons/react";

import type { PlannerAccessContext } from "@/features/planner/lib/commands/plannerAccessContext";

import {
  PLANNER_HELP_FAQ_ITEMS,
  PLANNER_HELP_SECTIONS,
  type HelpSection,
} from "./helpSections";
import styles from "./PlannerHelpPanel.module.css";

export type PlannerHelpPanelProps = {
  accessContext?: PlannerAccessContext;
  /** Called when the user dismisses from inside the panel (optional). */
  onClose?: () => void;
};

function sectionMatches(section: HelpSection, q: string): boolean {
  if (!q) return true;
  return (
    section.title.toLowerCase().includes(q) ||
    section.summary.toLowerCase().includes(q) ||
    section.keywords.some((kw) => kw.includes(q))
  );
}

/**
 * In-workspace static help — separate from AI Assist.
 * Guests and members can open anytime without leaving the canvas.
 */
export function PlannerHelpPanel({
  accessContext = "authenticated",
  onClose,
}: PlannerHelpPanelProps) {
  const [query, setQuery] = useState("");
  const guest = accessContext === "guest";

  const q = query.trim().toLowerCase();

  const filteredSections = useMemo(
    () => PLANNER_HELP_SECTIONS.filter((section) => sectionMatches(section, q)),
    [q],
  );

  const filteredFaq = useMemo(() => {
    if (!q) return PLANNER_HELP_FAQ_ITEMS;
    return PLANNER_HELP_FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [q]);

  return (
    <div
      className={styles.panel}
      data-testid="planner-help-panel"
      data-access={accessContext}
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <Question size={18} weight="bold" aria-hidden />
          <h2 className={styles.title} id="planner-help-heading">
            Help
          </h2>
        </div>
        <p className={styles.subtitle}>
          Guides for the canvas. Separate from AI Assist.
        </p>
        {guest ? (
          <p className={styles.guestBanner} data-testid="planner-help-guest-banner">
            Guest mode — plans stay in this browser until you export or sign in.
          </p>
        ) : null}
      </header>

      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} size={16} aria-hidden />
        <input
          type="search"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help…"
          aria-label="Search help topics"
          autoComplete="off"
        />
      </div>
      <p className={styles.resultCount} aria-live="polite">
        {filteredSections.length} topics
        {filteredFaq.length > 0 ? ` · ${filteredFaq.length} FAQ` : ""}
      </p>

      <div className={styles.scroll} role="region" aria-labelledby="planner-help-heading">
        {filteredSections.length === 0 && filteredFaq.length === 0 ? (
          <p className={styles.empty}>No topics match “{query.trim()}”.</p>
        ) : null}

        <ul className={styles.sectionList}>
          {filteredSections.map((section) => (
            <li key={section.id} className={styles.sectionItem}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <p className={styles.sectionSummary}>{section.summary}</p>
            </li>
          ))}
        </ul>

        {filteredFaq.length > 0 ? (
          <section className={styles.faq} aria-label="Frequently asked questions">
            <h3 className={styles.faqHeading}>FAQ</h3>
            <ul className={styles.faqList}>
              {filteredFaq.map((item) => (
                <li key={item.question} className={styles.faqItem}>
                  <details>
                    <summary className={styles.faqQuestion}>{item.question}</summary>
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <footer className={styles.footer}>
        <Link
          href="/planner/help/"
          className={styles.fullHelpLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Full help center
          <ArrowSquareOut size={14} aria-hidden />
        </Link>
        {onClose ? (
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        ) : null}
      </footer>
    </div>
  );
}
