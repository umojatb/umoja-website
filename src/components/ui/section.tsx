import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type SectionVariant =
  | "default"
  | "soft"
  | "muted"
  | "brand"
  | "dark"
  | "inset";

type SectionProps = {
  as?: ElementType;
  variant?: SectionVariant;
  /** Skip the inner Container wrapper (e.g. for full-bleed media). */
  bare?: boolean;
  containerClassName?: string;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/* Surface tokens.
 *
 * `soft` / `muted` / `inset` form a neutral elevation ladder:
 *   page (white) → soft (neutral-50) → muted (neutral-100)
 * `brand` is the navy emphasis surface — used for mid-page anchors.
 * `dark` is the neutral-black surface — used by the closing CTA.
 * `inset` is `soft` without the auto-Container; the consumer renders
 * its own inner panel to create container layering. */
const variantClasses: Record<SectionVariant, string> = {
  default: "bg-background text-foreground",
  soft: "bg-neutral-50 text-foreground",
  muted: "bg-neutral-100 text-foreground",
  brand: "bg-primary-700 text-white",
  dark: "bg-neutral-900 text-white",
  inset: "bg-neutral-50 text-foreground",
};

/**
 * Vertical section primitive.
 *
 * Standardizes vertical rhythm site-wide: every page section should be a
 * `<Section>`. Default padding is `py-10 md:py-14` (80 / 112 px on the 8px
 * scale). Wraps content in a `<Container>` by default; pass `bare` to opt
 * out for full-bleed sections. The `inset` variant also opts out
 * automatically — the consumer takes responsibility for inner layout
 * (container layering pattern).
 */
export function Section({
  as,
  variant = "default",
  bare = false,
  containerClassName,
  className,
  children,
  ...rest
}: SectionProps) {
  const Component = (as ?? "section") as ElementType;
  const skipContainer = bare || variant === "inset";
  return (
    <Component
      className={cn(
        "py-10 md:py-14 lg:py-20",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {skipContainer ? (
        children
      ) : (
        <Container className={containerClassName}>{children}</Container>
      )}
    </Component>
  );
}
