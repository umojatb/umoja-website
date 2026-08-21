import type { ReactNode } from "react";

/**
 * Shared building blocks for the Privacy Policy and Terms of Service
 * pages. These two pages are long-form prose rather than the card and
 * grid layouts the rest of the site uses, so they get their own small
 * set of primitives instead of bending `Heading` and `Card` into a
 * shape they were not built for.
 *
 * Kept deliberately minimal: a section wrapper, a paragraph, and one
 * link class. Anything more elaborate would drift from the rest of the
 * design system.
 */

/**
 * Organization identity shown on both legal pages.
 *
 * There is deliberately no `address` or `jurisdiction` field. Umoja
 * operates as an online initiative and is not yet formally registered
 * at a physical address, so both pages state that plainly rather than
 * asserting a registered office or a governing law that could not be
 * substantiated. Claiming either on a public legal page is worse than
 * omitting it.
 *
 * WHEN THE ORGANIZATION FORMALLY REGISTERS: add the registered address
 * here and surface it in the Privacy Policy's "Who we are" section,
 * and add a governing-law clause to the Terms. Until then the Terms
 * intentionally carry no choice-of-law provision.
 */
export const LEGAL_ENTITY = {
  name: "Umoja Africa",
  /** Operating status, stated on both legal pages. */
  status: "Umoja Africa currently operates as an online non-profit initiative.",
} as const;

/**
 * Shown as "Last updated" on both legal pages. Bump this whenever the
 * substance of either page changes, not on cosmetic edits.
 */
export const LAST_UPDATED = "20 August 2026";

export const legalLinkClasses =
  "font-medium text-primary-700 underline underline-offset-2 hover:text-primary-600";

export function LegalSection({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-heading text-2xl font-semibold text-primary-900 md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LegalBody({ children }: { readonly children: ReactNode }) {
  return (
    <p className="mt-4 text-base leading-relaxed text-neutral-700">
      {children}
    </p>
  );
}
