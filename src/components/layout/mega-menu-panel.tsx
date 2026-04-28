"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const FEATURED_FALLBACK_SRC = "/images/hero/volunteer-helping-with-donation-box.jpg";

type MegaMenuPanelProps = {
  /** The nav item driving this panel, guaranteed to have `panel`. */
  item: NavItem & { panel: NonNullable<NavItem["panel"]> };
  isOpen: boolean;
  /** DOM id used by the trigger's `aria-controls`. */
  panelId: string;
  /** Called when a link inside the panel is clicked, so the parent can close. */
  onLinkClick: () => void;
};

/**
 * Full-width mega menu panel rendered below the navbar. 4-column layout on
 * `lg+`; column 1 is a context card with description + CTA, columns 2 and 3
 * are link lists, column 4 is a featured content card.
 *
 * State is owned by the parent (Navbar), this component only renders.
 * Animation: fade + slight downward slide, 200ms ease-out, disabled by
 * `motion-reduce`.
 */
/**
 * Featured card image. If the configured src is empty OR fails to load
 * (404, decode error), we swap to a thematic photograph from /public so
 * the card always shows a real image, never a coloured rectangle.
 *
 * Image source itself is centralised in `src/lib/navigation.ts` per panel,
 * so swapping images is a single-file edit.
 */
function FeaturedCardImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);
  const useFallback = !src || hasError;
  const finalSrc = useFallback ? FEATURED_FALLBACK_SRC : src;
  const finalAlt = useFallback ? "Umoja Africa community photograph" : alt;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-neutral-200">
      <Image
        src={finalSrc}
        alt={finalAlt}
        fill
        sizes="(min-width: 1024px) 25vw, 100vw"
        onError={() => {
          if (!hasError) setHasError(true);
        }}
        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

export function MegaMenuPanel({
  item,
  isOpen,
  panelId,
  onLinkClick,
}: MegaMenuPanelProps) {
  const { panel } = item;
  return (
    <div
      id={panelId}
      role="region"
      aria-label={`${item.label} menu`}
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={cn(
        "absolute inset-x-0 top-full max-h-[45vh] overflow-hidden border-b border-neutral-200 bg-background shadow-lg",
        "transition-[opacity,transform] duration-200 ease-out-strong motion-reduce:transition-none",
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl flex-col px-3 py-3 sm:px-4 lg:px-6 lg:py-4">
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1.1fr_1fr_1fr_1.4fr] lg:gap-8">
          <div className="border-b border-neutral-200 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-primary-900">
              {item.label}
            </h2>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-neutral-600">
              {panel.description}
            </p>
            <Link
              href={panel.ctaHref}
              onClick={onLinkClick}
              className="link-underline-parent mt-3 inline-flex items-center gap-1 text-xs text-neutral-600 transition-colors hover:text-primary-700"
            >
              <span className="link-underline">{panel.ctaLabel}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ul className="overflow-y-auto border-b border-neutral-200 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            {panel.primaryLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={onLinkClick}
                  className="link-underline-parent block py-1 text-sm text-neutral-700 hover:text-primary-700"
                >
                  <span className="link-underline">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="overflow-y-auto border-b border-neutral-200 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
            {panel.secondaryLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={onLinkClick}
                  className="link-underline-parent block py-1 text-sm text-neutral-700 hover:text-primary-700"
                >
                  <span className="link-underline">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={panel.featured.href}
            onClick={onLinkClick}
            className="group block rounded-md bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
          >
            <FeaturedCardImage
              src={panel.featured.image.src}
              alt={panel.featured.image.alt}
            />
            <h3 className="mt-2 line-clamp-2 font-heading text-sm font-medium text-primary-900 group-hover:text-primary-700 md:text-base">
              {panel.featured.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
              {panel.featured.excerpt}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
