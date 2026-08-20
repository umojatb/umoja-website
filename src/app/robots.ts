import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/**
 * robots.txt, served at /robots.txt.
 *
 * Crawling is open by default: this is a public NGO site and discovery
 * is the point. Two exclusions:
 *
 * - `/api/`, no crawlable content, only POST endpoints. Listing it
 *   avoids pointless crawl budget and stray 405s in search consoles.
 * - `/success`, the Stripe post-checkout page. It is reachable by
 *   direct URL and says "your gift went through", so it must never
 *   surface in search results for someone who has not donated.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/success"],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL,
  };
}
