import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

export type PageHeroAlign = "left" | "center";

/**
 * Reusable hero block for sub-pages. Two variants:
 *
 * - `image`, full-width cover image in a rounded card (matches the
 *   homepage hero framing) with a left-anchored brand-navy gradient.
 *   Eyebrow + title + description sit on the left in white. Use for
 *   storytelling pages (About, Programs, Impact, Blog).
 *
 * - `color`, solid `bg-primary-700` brand canvas, no imagery. Eyebrow
 *   + title + description on the canvas, centered by default. Use for
 *   utility / archive pages where photos compete with the content
 *   (Annual Reports, Get Involved, Contact).
 *
 * The variant is a discriminated union so TypeScript enforces the
 * `image` prop on `image` variant and the optional `align` on `color`.
 */
type PageHeroProps =
  | {
      variant: "image";
      eyebrow?: string;
      title: ReactNode;
      description?: ReactNode;
      image: { readonly src: string; readonly alt: string };
    }
  | {
      variant: "color";
      eyebrow?: string;
      title: ReactNode;
      description?: ReactNode;
      align?: PageHeroAlign;
    };

export function PageHero(props: PageHeroProps) {
  if (props.variant === "image") {
    return <ImageHero {...props} />;
  }
  return <ColorHero {...props} />;
}

type ImageHeroProps = Extract<PageHeroProps, { variant: "image" }>;

function ImageHero({ eyebrow, title, description, image }: ImageHeroProps) {
  return (
    <header className="w-full bg-primary-700 py-6 md:py-8 lg:py-10">
      <div className="relative mx-auto w-[92%] min-h-[40vh] max-w-7xl overflow-hidden rounded-[2rem] md:min-h-[48vh] lg:min-h-[55vh]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1280px) 1280px, 92vw"
          priority
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/60 to-transparent md:from-primary-900/90"
        />
        <div className="absolute inset-0 z-10 flex items-center px-6 md:px-16">
          <div className="max-w-xl md:max-w-2xl">
            <Heading
              level={1}
              eyebrow={eyebrow}
              description={description}
              tone="inverted"
            >
              {title}
            </Heading>
          </div>
        </div>
      </div>
    </header>
  );
}

type ColorHeroProps = Extract<PageHeroProps, { variant: "color" }>;

function ColorHero({
  eyebrow,
  title,
  description,
  align = "center",
}: ColorHeroProps) {
  return (
    <header className="w-full bg-primary-700 py-14 md:py-20 lg:py-24">
      <Container>
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <Heading
            level={1}
            eyebrow={eyebrow}
            description={description}
            tone="inverted"
            align={align}
          >
            {title}
          </Heading>
        </div>
      </Container>
    </header>
  );
}
