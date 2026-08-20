import type { NextConfig } from "next";

/**
 * Allowed origins for cross-origin dev-server requests (HMR, RSC fetches,
 * Server Actions). Without these, Next.js 15+ rejects requests from any
 * origin that doesn't match the bound host — which breaks tunneled
 * environments like ngrok and Cloudflare Tunnel where the public URL is
 * a different origin from `0.0.0.0:3000`.
 *
 * Wildcard subdomains are matched with a leading `*.`. The list covers
 * the three commonly used free tunnels. To add a one-off origin (e.g. a
 * paid ngrok subdomain or a custom tunnel), set the
 * `NEXT_PUBLIC_DEV_ORIGIN` env var; it's appended at config-load time.
 *
 * This setting only affects `next dev`. Production builds ignore it.
 */
const TUNNEL_ORIGINS = [
  "*.ngrok-free.app",
  "*.ngrok.app",
  "*.ngrok.io",
  "*.trycloudflare.com",
  "*.loca.lt",
];

const extraOrigin = process.env.NEXT_PUBLIC_DEV_ORIGIN?.trim();
const allowedDevOrigins = extraOrigin
  ? [...TUNNEL_ORIGINS, extraOrigin]
  : TUNNEL_ORIGINS;

/**
 * Security response headers.
 *
 * Scope note: this is deliberately NOT a full Content-Security-Policy.
 * A script-src policy on Next.js needs either `'unsafe-inline'` (which
 * buys almost nothing) or per-request nonces, and nonces require
 * middleware that forces every route to render dynamically. That would
 * turn all 24 currently-static pages into on-demand renders, a real
 * performance cost for a marketing site.
 *
 * So we ship the directives that are strictly additive and need no
 * nonce: `frame-ancestors`, `base-uri`, `form-action`, `object-src`.
 * `frame-ancestors 'none'` supersedes X-Frame-Options in modern
 * browsers; X-Frame-Options stays for older ones.
 *
 * `form-action 'self'` is safe here because no form does a native
 * cross-origin POST. The donate form fetches `/api/create-checkout-
 * session` and then navigates via `window.location.assign()`, which is
 * a navigation, not a form submission.
 */
const CSP_DIRECTIVES = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // Force HTTPS for two years. `preload` is intentionally omitted: it
  // commits the domain to the browser preload list and is slow to undo.
  // Add it only once the production domain is confirmed HTTPS-stable.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  // Stop MIME sniffing turning an uploaded/served file into script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking guard for browsers predating frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  // Send the full referrer same-origin, only the origin cross-origin,
  // and nothing at all when downgrading HTTPS to HTTP.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these APIs. Deny them outright.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins,

  // Drop the `X-Powered-By: Next.js` banner. Free, removes a version
  // hint from every response.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
