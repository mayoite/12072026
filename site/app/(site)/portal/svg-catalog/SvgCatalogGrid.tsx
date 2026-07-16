"use client";

/**
 * 05-PORT-01 (a11y follow-up): roving-focus grid for the portal SVG catalog index.
 *
 * Extracted from page.tsx as a client boundary because keyboard roving-tabindex
 * requires DOM focus management (useRef/useState), which an RSC page cannot do.
 * The RSC page (page.tsx) still owns data loading and only passes
 * plain serializable card data across the server/client boundary.
 *
 * Pattern mirrors the established roving-focus keyboard nav in
 * `site/features/planner/editor/InventoryPanel.tsx` (ArrowUp/ArrowDown/
 * Home/End, single tabbable item at a time) per WAI-ARIA roving tabindex
 * authoring practice. GS: BP-05 anti-copy (semantic tokens only, no donor UI).
 */

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";

import { buildBlockThumbSrcSet } from "@/features/planner/project/catalog/svg/svgPreviewAssets";

export interface SvgCatalogCard {
  readonly slug: string;
  readonly variant: string;
  readonly schemaVersion: string;
  readonly thumbUrl: string;
  /** Prefer vector preview when the compiled SVG exists on disk. */
  readonly svgUrl?: string;
}

export function SvgCatalogGrid({
  cards,
}: {
  cards: ReadonlyArray<SvgCatalogCard>;
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const focusItem = useCallback(
    (index: number) => {
      if (cards.length === 0) return;
      const clamped = Math.max(0, Math.min(index, cards.length - 1));
      setFocusedIndex(clamped);
      itemRefs.current[clamped]?.focus();
    },
    [cards.length],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusItem(focusedIndex + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusItem(focusedIndex - 1);
          break;
        case "Home":
          event.preventDefault();
          focusItem(0);
          break;
        case "End":
          event.preventDefault();
          focusItem(cards.length - 1);
          break;
        default:
          break;
      }
    },
    [focusItem, focusedIndex, cards.length],
  );

  return (
    <div
      className="portal-svg-catalog-grid"
      role="list"
      aria-label="SVG catalog blocks"
      onKeyDown={handleKeyDown}
    >
      {cards.map((card, index) => (
        <Link
          key={card.slug}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          href={`/portal/svg-catalog/${card.slug}`}
          className="shell-portal-grid-card portal-svg-catalog-card"
          role="listitem"
          tabIndex={index === focusedIndex ? 0 : -1}
          onFocus={() => setFocusedIndex(index)}
        >
          <div className="svg-catalog-thumb-wrap shell-portal-thumbnail portal-svg-catalog-card__media">
            {card.svgUrl ? (
              <Image
                src={card.svgUrl}
                alt={`${card.slug} vector preview`}
                width={512}
                height={256}
                className="svg-catalog-thumb svg-catalog-thumb--vector"
                loading="lazy"
                unoptimized
              />
            ) : (
              <Image
                src={card.thumbUrl}
                alt={`${card.slug} thumbnail`}
                width={512}
                height={256}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                className="svg-catalog-thumb"
                loading="lazy"
                unoptimized
                // Retina variants remain available as metadata for future next/image loaders.
                data-srcset={buildBlockThumbSrcSet(card.slug)}
              />
            )}
          </div>
          <div className="portal-svg-catalog-card__body">
            <div className="portal-svg-catalog-card__title-row">
              <code className="portal-svg-catalog-card__slug">{card.slug}</code>
              <span className="portal-svg-catalog-card__variant">{card.variant}</span>
            </div>
            <div className="portal-svg-catalog-card__meta">v{card.schemaVersion}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
