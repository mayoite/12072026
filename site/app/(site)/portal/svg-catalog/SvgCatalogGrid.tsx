"use client";

/**
 * 05-PORT-01 (a11y follow-up): roving-focus grid for the portal SVG catalog index.
 *
 * Extracted from page.tsx as a client boundary because keyboard roving-tabindex
 * requires DOM focus management (useRef/useState), which an RSC page cannot do.
 * The RSC page (page.tsx) still owns data loading (loadAll()) and only passes
 * plain serializable card data across the server/client boundary.
 *
 * Pattern mirrors the established roving-focus keyboard nav in
 * `site/features/planner/open3d/editor/InventoryPanel.tsx` (ArrowUp/ArrowDown/
 * Home/End, single tabbable item at a time) per WAI-ARIA roving tabindex
 * authoring practice. GS: BP-05 anti-copy (semantic tokens only, no donor UI).
 */

import Link from "next/link";
import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";

export interface SvgCatalogCard {
  readonly slug: string;
  readonly variant: string;
  readonly schemaVersion: string;
  readonly thumbUrl: string;
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
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
          className="block border rounded p-3 hover:bg-muted"
          role="listitem"
          tabIndex={index === focusedIndex ? 0 : -1}
          onFocus={() => setFocusedIndex(index)}
        >
          <div className="mb-2">
            <Image
              src={card.thumbUrl}
              alt={`${card.slug} thumbnail`}
              width={240}
              height={120}
              className="w-full h-auto"
            />
          </div>
          <div>
            <code>{card.slug}</code>
            <span className="ml-2 text-xs opacity-70">{card.variant}</span>
          </div>
          <div className="text-xs text-muted">v{card.schemaVersion}</div>
        </Link>
      ))}
    </div>
  );
}
