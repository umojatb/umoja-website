/**
 * Centralized navigation config.
 *
 * Source of truth for the global Navbar and Footer. Adding a route to the
 * site means editing this file — never hardcode links inside components.
 */

export type NavItem = {
  readonly label: string;
  readonly href: string;
};

export const mainNav: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNav: readonly NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Annual Reports", href: "/annual-reports" },
] as const;

export const donateHref = "/donate";
