import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type SectionVariant = "default" | "muted" | "dark";

type SectionProps = {
  as?: ElementType;
  variant?: SectionVariant;
  /** Skip the inner Container wrapper (e.g. for full-bleed media). */
  bare?: boolean;
  containerClassName?: string;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

const variantClasses: Record<SectionVariant, string> = {
  default: "bg-background text-foreground",
  muted: "bg-neutral-50 text-foreground",
  dark: "bg-primary-900 text-neutral-100",
};

/**
 * Vertical section primitive.
 *
 * Standardizes vertical rhythm site-wide: every page section should be a
 * `<Section>`. Default padding is `py-10 md:py-14` (80 / 112 px on the 8px
 * scale). Wraps content in a `<Container>` by default; pass `bare` to opt
 * out for full-bleed sections.
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
  return (
    <Component
      className={cn("py-10 md:py-14", variantClasses[variant], className)}
      {...rest}
    >
      {bare ? (
        children
      ) : (
        <Container className={containerClassName}>{children}</Container>
      )}
    </Component>
  );
}
