import Link, { type LinkProps } from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TextLinkProps = LinkProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof LinkProps | "children"> & {
    children: ReactNode;
    /** Hide the trailing arrow. Default: arrow shown. */
    noArrow?: boolean;
    className?: string;
  };

/**
 * Compact text-style action link (e.g. "Read all posts →") with a built-in
 * trailing arrow that nudges right on hover. Replaces the duplicated
 * `font-heading text-sm font-semibold text-primary-700 ...` Link pattern
 * scattered across pages.
 */
export function TextLink({
  noArrow,
  className,
  children,
  ...rest
}: TextLinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "group/textlink inline-flex items-center gap-1 font-heading text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900",
        className,
      )}
    >
      <span>{children}</span>
      {!noArrow && (
        <span
          aria-hidden="true"
          className="transition-transform group-hover/textlink:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/textlink:translate-x-0"
        >
          →
        </span>
      )}
    </Link>
  );
}
