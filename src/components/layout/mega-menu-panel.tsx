"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MegaMenuPanelProps = {
  /** The nav item driving this panel — guaranteed to have `panel`. */
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
 * State is owned by the parent (Navbar) — this component only renders.
 * Animation: fade + slight downward slide, 200ms ease-out, disabled by
 * `motion-reduce`.
 */
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
        "absolute inset-x-0 top-full border-b border-neutral-200 bg-background shadow-lg",
        "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 lg:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1.4fr] lg:gap-10">
          <div className="border-b border-neutral-200 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <h2 className="font-heading text-xl font-semibold text-primary-900 md:text-2xl">
              {item.label}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {panel.description}
            </p>
            <Link
              href={panel.ctaHref}
              onClick={onLinkClick}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900"
            >
              {panel.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>

          <ul className="space-y-4 border-b border-neutral-200 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
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

          <ul className="space-y-4 border-b border-neutral-200 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
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
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-200">
              <Image
                src={panel.featured.image.src}
                alt={panel.featured.image.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
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
