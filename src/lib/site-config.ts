/**
 * Central runtime configuration sourced from environment variables.
 *
 * Every consumer reads from this module so swapping a contact email,
 * canonical URL, or phone number is a one-env-var change with no code
 * edits required, only a dev-server / deployment restart.
 *
 * Naming: variables prefixed `NEXT_PUBLIC_*` are inlined into the client
 * bundle at build time (Next.js convention) so they're available to
 * client components. Server-only secrets (e.g. STRIPE_SECRET_KEY,
 * GOOGLE_SHEETS_WEBHOOK_URL) stay outside this module and are read
 * directly inside the route handlers that consume them.
 *
 * Each export ships a sensible default so dev environments work without
 * a fully-populated `.env.local`. Set the env var to override.
 */

const DEFAULT_CONTACT_EMAIL = "tb@umoja.tbafrica.org";
const DEFAULT_SITE_URL = "https://umoja-africa.org";
const DEFAULT_CONTACT_FROM = "Umoja Africa <onboarding@resend.dev>";

/**
 * Default destination address for the contact form (server-side
 * /api/contact email send). Re-exported so server code can fall back
 * without depending on the public `NEXT_PUBLIC_CONTACT_EMAIL` env var
 * being set at runtime.
 */
export const CONTACT_EMAIL_DEFAULT = DEFAULT_CONTACT_EMAIL;

/**
 * Default `from:` address used by Resend in /api/contact. Resend's
 * `onboarding@resend.dev` works without domain verification and is fine
 * for development. For production, verify your domain in the Resend
 * dashboard and set `CONTACT_FROM_EMAIL` to e.g.
 * `"Umoja Africa <no-reply@umoja-africa.org>"`.
 */
export const CONTACT_FROM_DEFAULT = DEFAULT_CONTACT_FROM;

/**
 * Public contact email, surfaced in `mailto:` links, the Contact card,
 * the donation-form fallback, and the apply-form thank-you message.
 *
 * Override with `NEXT_PUBLIC_CONTACT_EMAIL`.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? DEFAULT_CONTACT_EMAIL;

/**
 * Canonical site URL, used by Next.js as `metadataBase` to build absolute
 * Open Graph / Twitter / sitemap URLs from relative paths.
 *
 * Override with `NEXT_PUBLIC_SITE_URL`. Must include scheme (http(s)://).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

/**
 * Optional public phone number. Empty string means "not configured", and
 * consumers should hide the phone affordance when this is empty rather
 * than rendering a broken link.
 *
 * Override with `NEXT_PUBLIC_CONTACT_PHONE` (e.g. "+1 555 123 4567").
 */
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "";
