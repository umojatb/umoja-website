"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TextLink } from "@/components/ui/text-link";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

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
 * Featured card image with a branded fallback. If the configured src is
 * empty OR the image fails to load (404, decode error), we render a navy
 * placeholder with the menu section label in white uppercase tracking,  * intentional-looking, never a broken-image gray rectangle.
 *
 * Image source itself is centralised in `src/lib/navigation.ts` per panel,
 * so swapping images is a single-file edit.
 */
function FeaturedCardImage({
  label,
  src,
  alt,
}: {
  label: string;
  src: string;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src || hasError;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-primary-700">
      {showFallback ? (
        <div
          role="img"
          aria-label={`${label} placeholder`}
          className="absolute inset-0 grid place-items-center bg-primary-700"
        >
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-white">
            {label}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, 100vw"
          onError={() => setHasError(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      )}
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
      className={cn(
        "absolute inset-x-0 top-full max-h-[45vh] overflow-hidden border-b border-neutral-200 bg-background shadow-lg",
        "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl flex-col px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
        <div className="grid min-h-0 flex-1 gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1.4fr] lg:gap-10">
          <div className="border-b border-neutral-200 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-primary-900 md:text-2xl">
              {item.label}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
              {panel.description}
            </p>
            <TextLink href={panel.ctaHref} onClick={onLinkClick} className="mt-4">
              {panel.ctaLabel}
            </TextLink>
          </div>

          <ul className="space-y-4 overflow-y-auto border-b border-neutral-200 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            {panel.primaryLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={onLinkClick}
                  className="text-sm text-neutral-700 underline-offset-4 hover:text-primary-700 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-4 overflow-y-auto border-b border-neutral-200 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            {panel.secondaryLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={onLinkClick}
                  className="text-sm text-neutral-700 underline-offset-4 hover:text-primary-700 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={panel.featured.href}
            onClick={onLinkClick}
            className="group block rounded-xl bg-neutral-50 p-4 transition-colors hover:bg-neutral-100"
          >
            <FeaturedCardImage
              label={item.label}
              src={panel.featured.image.src}
              alt={panel.featured.image.alt}
            />
            <h3 className="mt-3 font-heading text-base font-semibold text-primary-900 group-hover:text-primary-700 md:text-lg">
              {panel.featured.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600 md:text-sm">
              {panel.featured.excerpt}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
