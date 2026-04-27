import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export type HeadingLevel = 1 | 2 | 3;
export type HeadingAlign = "left" | "center";
export type HeadingTone = "default" | "inverted";

type HeadingProps = {
  level: HeadingLevel;
  /** Small uppercase tracked label rendered above the heading. */
  eyebrow?: string;
  /** Supporting paragraph rendered below the heading. */
  description?: ReactNode;
  align?: HeadingAlign;
  /** Switches text colors for use on dark surfaces. */
  tone?: HeadingTone;
  /**
   * When true, the heading is treated as page-level (h1-equivalent visual
   * weight) regardless of the `level` tag. Lets a section heading scale up
   * when it carries the page's primary message.
   */
  display?: boolean;
  className?: string;
  children: ReactNode;
};

const sizeByLevel: Record<HeadingLevel, string> = {
  1: "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  2: "text-3xl md:text-4xl lg:text-5xl",
  3: "text-2xl md:text-3xl",
};

/**
 * Section/page heading primitive. Bundles the optional eyebrow, the heading
 * tag itself, and an optional supporting description into a single styled
 * unit so the same vertical rhythm is repeated everywhere.
 */
export function Heading({
  level,
  eyebrow,
  description,
  align = "left",
  tone = "default",
  display = false,
  className,
  children,
}: HeadingProps) {
  const Tag = `h${level}` as `h${HeadingLevel}`;
  const isCentered = align === "center";
  const isInverted = tone === "inverted";

  return (
    <div className={cn(isCentered ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <Eyebrow tone={isInverted ? "inverted" : "default"}>{eyebrow}</Eyebrow>
      )}
      <Tag
        className={cn(
          "font-heading font-semibold tracking-tight",
          isInverted ? "text-white" : "text-primary-900",
          display ? sizeByLevel[1] : sizeByLevel[level],
          eyebrow && "mt-2",
        )}
      >
        {children}
      </Tag>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-prose text-base md:text-lg",
            isInverted ? "text-neutral-300" : "text-neutral-600",
            isCentered && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
