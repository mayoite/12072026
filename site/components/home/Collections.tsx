"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HOMEPAGE_COLLECTIONS_CONTENT } from "@/features/site/data/homepage";
import { CollectionsSectionHeading } from "@/components/home/CollectionsSectionHeading";
import { fadeUp, useMotionSafeHover } from "@/lib/helpers/motion";

export function Collections() {
  const { catalogCta, items } = HOMEPAGE_COLLECTIONS_CONTENT;
  const navHover = useMotionSafeHover({ y: -1 }, { y: 0 });

  const autoplay = useRef(
    Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, slidesToScroll: 1 },
    [autoplay.current]
  );

  const [isPaused, setIsPaused] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  function toggleAutoplay() {
    const plugin = autoplay.current;
    if (!plugin) return;
    if (isPaused) {
      plugin.play();
    } else {
      plugin.stop();
    }
    setIsPaused((paused) => !paused);
  }

  return (
    <section
      data-testid="home-collections"
      aria-label="Product collections"
      className="home-section--soft border-t border-b border-theme-soft section-y-sm"
    >
      <div className="home-shell-xl">
        <div className="home-frame home-frame--standard">
          <motion.div
            className="mb-8 flex flex-wrap items-center justify-between gap-6"
            {...fadeUp(14, 0.06)}
          >
            <CollectionsSectionHeading />

            <div className="flex shrink-0 items-center gap-4">
              <div className="hidden items-center gap-4 sm:flex">
                <motion.button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={!canScrollPrev}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-soft text-body transition-all duration-300 hover:border-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-20"
                  {...navHover}
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </motion.button>
                <motion.button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={!canScrollNext}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-soft text-body transition-all duration-300 hover:border-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-20"
                  {...navHover}
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>
              <motion.button
                type="button"
                aria-label={isPaused ? "Play collection carousel" : "Pause collection carousel"}
                aria-pressed={isPaused}
                onClick={toggleAutoplay}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-soft text-body transition-all duration-300 hover:border-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-20"
                {...navHover}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {isPaused ? "▶" : "Ⅱ"}
                </span>
              </motion.button>
              <Link
                href={catalogCta.href}
                className="home-catalog-cta group typ-label inline-flex items-center gap-1.5 whitespace-nowrap sm:ml-2"
              >
                {catalogCta.label}
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>

          <motion.div {...fadeUp(18, 0.14)}>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="h-full">
                      <Link href={item.href} className="group home-collection-card block h-full">
                        {/* Layers: media (0) → overlay (1) → footer (2). One fill image only. */}
                        <Image
                          src={item.image}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="home-collection-card__media object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        <div className="home-collection-card__overlay" aria-hidden="true" />
                        <div className="home-collection-card__footer flex items-center justify-between gap-4 p-6 md:p-7">
                          <h3 className="typ-overlay-title text-inverse">{item.name}</h3>
                          <span className="home-collection-card__arrow shrink-0" aria-hidden="true">
                            <ArrowRight className="h-[1.125rem] w-[1.125rem]" />
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
