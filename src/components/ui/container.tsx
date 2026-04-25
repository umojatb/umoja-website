import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Site-wide horizontal layout primitive.
 *
 * Caps content at 1280px (`max-w-7xl`) and centers it with responsive side
 * padding that follows the 8px spacing scale: 24px → 32px → 48px.
 * Every page section should compose with `<Container>` — never set page
 * width or side padding ad-hoc.
 */
export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
