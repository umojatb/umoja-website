import type { ReactNode } from "react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export type CTAAction = {
  readonly label: string;
  readonly href: string;
};

type CTASectionProps = {
  heading: ReactNode;
  description?: ReactNode;
  /** Primary action — gold (`secondary` button variant). */
  primary: CTAAction;
  /** Optional secondary action — outline-on-dark variant. */
  secondary?: CTAAction;
  className?: string;
};

/**
 * Page-closing call-to-action used across every top-level page.
 *
 * Always sits on the dark navy surface, always renders an inverted
 * `<Heading level={2}>`, and always exposes one or two large buttons.
 * Copy varies per page; the shape does not.
 */
export function CTASection({
  heading,
  description,
  primary,
  secondary,
  className,
}: CTASectionProps) {
  return (
    <Section variant="dark" className={className}>
      <Heading
        level={2}
        align="center"
        tone="inverted"
        description={description}
      >
        {heading}
      </Heading>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primary.href}
          className={buttonStyles({ variant: "secondary", size: "lg" })}
        >
          {primary.label}
        </Link>
        {secondary && (
          <Link
            href={secondary.href}
            className={buttonStyles({
              variant: "outline-inverted",
              size: "lg",
            })}
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </Section>
  );
}
