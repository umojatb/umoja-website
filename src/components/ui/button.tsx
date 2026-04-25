import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-1 rounded-full font-medium " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-700 text-white hover:bg-primary-600 focus-visible:outline-primary-700",
  secondary:
    "bg-secondary-500 text-primary-900 hover:bg-secondary-600 focus-visible:outline-secondary-500",
  outline:
    "border border-primary-700 text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-700",
  ghost:
    "text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-700",
};

/* Sizes are pinned to the 8px scale: 32 / 40 / 48 px tall, 16 / 24 / 32 px h-pad. */
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-4 px-2 text-sm",
  md: "h-5 px-3 text-sm",
  lg: "h-6 px-4 text-base",
};

type ButtonStylesArgs = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Returns the className for a button-shaped element. Use directly when a
 * non-`<button>` element needs to look like a button (e.g. a `<Link>` CTA).
 * The `<Button>` component below is the default consumer.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStylesArgs = {}): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant, size, className, type = "button", ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles({ variant, size, className })}
        {...rest}
      />
    );
  },
);
