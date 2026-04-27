import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonStyles, type ButtonVariant } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section, type SectionVariant } from "@/components/ui/section";
import { cn } from "@/lib/utils";

type ImageTextSectionProps = {
  /** Small uppercase label rendered above the heading. */
  eyebrow?: string;
  /** Heading text or JSX (e.g. with `<em>` emphasis). */
  title: ReactNode;
  /** Body copy under the heading. */
  description: ReactNode;
  /** Cover image. */
  image: { readonly src: string; readonly alt: string };
  /** Swap columns on `lg+` so the image renders right and text renders left. */
  reverse?: boolean;
  /** Optional CTA below the description. */
  cta?: {
    readonly label: string;
    readonly href: string;
    readonly variant?: ButtonVariant;
  };
  /** Section surface (default / soft / muted / brand / dark / inset). */
  variant?: SectionVariant;
  /** DOM id on the underlying section — used as an anchor target by the nav. */
  id?: string;
};

/**
 * Editorial image-and-text section. Stacks on mobile (image first, then
 * text); switches to a 2-col split on `lg+` with image-left by default,
 * image-right when `reverse` is set.
 *
 * Composes `Section` + `Heading` + `Image` so the editorial rhythm,
 * Container alignment, and responsive spacing all stay consistent with
 * the rest of the site.
 */
export function ImageTextSection({
  eyebrow,
  title,
  description,
  image,
  reverse = false,
  cta,
  variant,
  id,
}: ImageTextSectionProps) {
  const isDarkSurface = variant === "brand" || variant === "dark";
  return (
    <Section variant={variant} id={id}>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200",
            reverse && "lg:order-last",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <Heading
            level={2}
            eyebrow={eyebrow}
            tone={isDarkSurface ? "inverted" : "default"}
          >
            {title}
          </Heading>
          <div
            className={cn(
              "mt-4 max-w-prose space-y-3 text-base leading-relaxed md:text-lg",
              isDarkSurface ? "text-neutral-200" : "text-neutral-600",
            )}
          >
            {typeof description === "string" ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
          {cta && (
            <div className="mt-6">
              <Link
                href={cta.href}
                className={buttonStyles({
                  variant: cta.variant ?? "outline",
                  size: "md",
                })}
              >
                {cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
