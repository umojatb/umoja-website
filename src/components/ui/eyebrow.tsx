import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EyebrowSize = "xs" | "sm";
export type EyebrowTone = "default" | "inverted";

type EyebrowProps = {
  as?: ElementType;
  /** xs (12px) for in-card / inline use; sm (14px) for section eyebrows. */
  size?: EyebrowSize;
  /** Switches text color for use on dark surfaces. */
  tone?: EyebrowTone;
  className?: string;
  children: ReactNode;
};

/**
 * Small uppercase tracked label that pairs with a heading or a card image.
 * Single source of truth for the eyebrow treatment, section headings,
 * blog card categories, and hero slide categories all compose this.
 *
 * Footer column headings (`<h2>EXPLORE</h2>`, `<h2>LEGAL</h2>`) look
 * similar but are navigation labels on a dark surface using `text-white`,
 * not eyebrows. They share only the tracking value, not the component.
 */
export function Eyebrow({
  as = "p",
  size = "sm",
  tone = "default",
  className,
  children,
}: EyebrowProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={cn(
        "font-heading font-semibold uppercase tracking-[0.2em]",
        size === "xs" ? "text-xs" : "text-sm",
        tone === "inverted" ? "text-secondary-400" : "text-secondary-700",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
