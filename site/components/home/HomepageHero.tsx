"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, SealCheck } from "@phosphor-icons/react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";

import {
  DEFAULT_HERO_FALLBACK,
  HOMEPAGE_HERO_CONTENT,
  HOMEPAGE_HERO_IMAGES,
  joinAccessibleTitleLines,
  resolveHeroTitleLines,
} from "@/features/site/data/homepage";
import { TrackedLink } from "@/components/ui/TrackedLink";
import {
  MOTION_EASE,
  MOTION_TOKENS,
  useMotionSafeHover,
} from "@/lib/helpers/motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.26, delayChildren: 0.45 } },
};

const wordVariants: Variants = {
  hidden: { y: "105%", opacity: 0, rotate: 3 },
  visible: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { duration: MOTION_TOKENS.slow, ease: MOTION_EASE },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: MOTION_TOKENS.distanceMd },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_TOKENS.medium, ease: MOTION_EASE },
  },
};

export function HomepageHero() {
  const t = useTranslations("home");
  // Prefer i18n messages; provenance fields stay on the TS source of truth.
  const title = resolveHeroTitleLines(t.raw("hero.title"), HOMEPAGE_HERO_CONTENT.title);
  const accessibleTitle = joinAccessibleTitleLines(title);
  const kicker = t("hero.kicker");
  const primaryCta = {
    label: t("hero.primaryCta.label"),
    href: t("hero.primaryCta.href"),
  };
  const secondaryCta = {
    label: t("hero.secondaryCta.label"),
    href: t("hero.secondaryCta.href"),
  };
  const glassProof = {
    badge: t("hero.glassProof.badge"),
    lead: t("hero.glassProof.lead"),
    support: t("hero.glassProof.support"),
    href: t("hero.glassProof.href"),
    cta: t("hero.glassProof.cta"),
    source: HOMEPAGE_HERO_CONTENT.glassProof.source,
    owner: HOMEPAGE_HERO_CONTENT.glassProof.owner,
    reviewDate: HOMEPAGE_HERO_CONTENT.glassProof.reviewDate,
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [motionReady, setMotionReady] = useState(false);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const primaryCtaHover = useMotionSafeHover({ scale: 1.02, y: -2 }, { scale: 0.98 });
  const secondaryCtaHover = useMotionSafeHover({ scale: 1.02, y: -2 }, { scale: 0.98 });

  const currentImage = HOMEPAGE_HERO_IMAGES[currentIndex];
  const resolvedImageSrc =
    failedImageSrc === currentImage.src && currentImage.src !== DEFAULT_HERO_FALLBACK
      ? DEFAULT_HERO_FALLBACK
      : currentImage.src;

  const imageTransition = reduceMotion
    ? { duration: 0 }
    : { duration: MOTION_TOKENS.medium, ease: MOTION_EASE };

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMotionReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const revealMotion = motionReady && !reduceMotion;

  return (
    <section
      id="home-hero"
      className="relative min-h-[min(78vh,44rem)] w-full overflow-hidden bg-inverse pt-20 md:min-h-[85vh] md:pt-24"
      aria-labelledby="home-hero-heading"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedImageSrc}
          className="absolute inset-0 h-[115%] w-full -top-[7%] origin-center"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={imageTransition}
        >
          <Image
            src={resolvedImageSrc}
            alt={currentImage.alt}
            fill
            priority={currentIndex === 0}
            loading={currentIndex === 0 ? "eager" : undefined}
            sizes="100vw"
            className="object-cover object-center md:object-[64%_48%]"
            onError={() => setFailedImageSrc(currentImage.src)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/62 to-black/48 lg:bg-gradient-to-r lg:from-black/86 lg:via-black/58 lg:to-black/18" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/78 via-black/28 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="home-hero__layout relative z-10 min-h-[calc(78vh-5rem)] py-10 md:py-16 lg:py-20">
        <motion.div
          className="home-hero__copy w-full max-w-4xl space-y-6 md:space-y-8"
          variants={containerVariants}
          initial={revealMotion ? "hidden" : "visible"}
          animate="visible"
        >
          <h1 id="home-hero-heading" className="home-hero-title-homepage text-inverse">
            {/* SITE-HOME-02 / SF-01: accessible name keeps spaces; animated lines are decorative. */}
            <span className="sr-only">{accessibleTitle}</span>
            <span aria-hidden="true">
              {title.map((line, i) => (
                <span key={`${i}-${line}`} className="block overflow-hidden">
                  <motion.span
                    className={`inline-block${i === title.length - 1 ? " text-accent-italic-on-dark" : ""}`}
                    variants={wordVariants}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            variants={fadeUpVariants}
            className="home-kicker text-[color:var(--color-bronze-300)]"
          >
            {kicker}
          </motion.p>

          <motion.div variants={fadeUpVariants} className="home-actions">
            <motion.div {...primaryCtaHover}>
              <TrackedLink
                href={primaryCta.href}
                label={primaryCta.label}
                surface="homepage-hero"
                className="btn-hero-primary btn-primary shadow-theme-panel"
              >
                {primaryCta.label}
              </TrackedLink>
            </motion.div>
            <motion.div {...secondaryCtaHover}>
              <TrackedLink
                href={secondaryCta.href}
                label={secondaryCta.label}
                surface="homepage-hero"
                className="btn-hero-secondary btn-accent shadow-theme-panel"
              >
                {secondaryCta.label}
              </TrackedLink>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="home-hero-glass-stack"
          variants={fadeUpVariants}
          initial={revealMotion ? "hidden" : "visible"}
          animate="visible"
        >
          <TrackedLink
            href={glassProof.href}
            label={glassProof.cta}
            surface="homepage-hero-proof"
            className="home-hero-proof-panel group typ-body-sm text-inverse"
          >
            <span className="home-hero-proof-panel__badge">
              <SealCheck className="shrink-0" size={16} weight="fill" aria-hidden="true" />
              {glassProof.badge}
            </span>
            <p className="home-hero-proof-panel__lead">{glassProof.lead}</p>
            <p className="home-hero-proof-panel__support text-inverse-body">{glassProof.support}</p>
            <span className="home-hero-proof-panel__cta">
              {glassProof.cta}
              <ArrowRight className="shrink-0" size={16} weight="bold" aria-hidden="true" />
            </span>
          </TrackedLink>
        </motion.div>
      </div>

      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-0.5 sm:bottom-6"
        role="group"
        aria-label="Hero project images"
      >
        {HOMEPAGE_HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            aria-label={`Show project image ${i + 1} of ${HOMEPAGE_HERO_IMAGES.length}`}
            aria-current={i === currentIndex ? "true" : undefined}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "home-hero-progress--active" : "home-hero-progress"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
