import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Generic surface for content groupings — blog cards, program tiles,
 * impact stats. Provides a consistent border, radius, padding, and elevation;
 * override with `className` when a specific instance needs more or less.
 */
export function Card({ as, children, className, ...rest }: CardProps) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "rounded-2xl border border-neutral-200 bg-background p-4 shadow-sm transition-shadow",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
