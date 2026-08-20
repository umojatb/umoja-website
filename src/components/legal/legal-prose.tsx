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
 * ACTION REQUIRED BEFORE LAUNCH: replace the address placeholder with
 * the real registered address, and confirm the legal entity name and
 * governing jurisdiction match your registration documents. These are
 * rendered verbatim on public legal pages, so a wrong value is worse
 * than an obviously blank one.
 */
export const LEGAL_ENTITY = {
  name: "Umoja Africa",
  address: "[REGISTERED ADDRESS, to be completed before launch]",
  jurisdiction: "[GOVERNING JURISDICTION, to be completed before launch]",
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
