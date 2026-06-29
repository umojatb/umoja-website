import type { ReactNode } from "react";

/**
 * Wraps every inner page (all routes except the homepage) in the
 * `.page-serif` scope declared in globals.css. That scope swaps Manrope
 * for Fraunces on h1-h6 elements, giving inner pages a characterful
 * display serif without touching the homepage or navbar.
 */
export function InnerPage({ children }: { children: ReactNode }) {
  return <div className="page-serif">{children}</div>;
}
