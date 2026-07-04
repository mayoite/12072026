"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/helpers/motion";

interface SectionIntroProps {
  kicker?: string;
  title: string;
  /** Optional stressed phrase rendered in the canonical italic-bronze accent. */
  titleAccent?: string;
  description?: string;
  className?: string;
  maxWidthClassName?: string;
  /** Set when the intro sits on a dark/inverse surface. */
  tone?: "light" | "dark";
}

export function SectionIntro({
  kicker,
  title,
  titleAccent,
  description,
  className = "",
  maxWidthClassName = "max-w-3xl",
  tone = "light",
}: SectionIntroProps) {
  const isDark = tone === "dark";

  return (
    <motion.div
      className={`${maxWidthClassName} ${className}`.trim()}
      {...fadeUp(18, 0.04)}
    >
      {kicker ? (
        <p className={`typ-label mb-4 ${isDark ? "text-inverse-muted" : "text-body"}`}>{kicker}</p>
      ) : null}
      <h2 className={`home-heading ${isDark ? "text-inverse" : ""}`}>
        {title}
        {titleAccent ? (
          <>
            {" "}
            <span className={isDark ? "text-accent-italic-on-dark" : "text-accent-italic"}>
              {titleAccent}
            </span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className={`page-copy mt-5 ${isDark ? "text-inverse-body" : "text-body"}`}>
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
