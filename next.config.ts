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

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
