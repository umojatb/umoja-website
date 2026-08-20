import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";

/**
 * XML sitemap, served at /sitemap.xml.
 *
 * Static routes are listed explicitly rather than derived from the
 * filesystem, because "every page.tsx" is not the same set as "every
 * page we want indexed". `/success` is deliberately excluded: it is a
 * Stripe post-checkout landing page with no standalone value, and
 * having it in search results would show donors a "thank you" page for
 * a gift they never made.
 *
 * Blog posts are derived from `getAllPosts()` so adding a post updates
 * the sitemap with no edit here, and each carries its real
 * `publishedAt` date as `lastModified`.
 *
 * `SITE_URL` comes from `NEXT_PUBLIC_SITE_URL`. If that is unset in
 * production the sitemap will advertise the default domain, so it must
 * be set correctly on the deployment before launch.
 */

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: ReadonlyArray<{
  readonly path: string;
  readonly priority: number;
  readonly changeFrequency: Entry["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
  { path: "/donate", priority: 0.9, changeFrequency: "monthly" },
  { path: "/get-involved", priority: 0.8, changeFrequency: "monthly" },
  { path: "/impact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/apply/volunteer", priority: 0.7, changeFrequency: "monthly" },
  { path: "/apply/partner", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/annual-reports", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries];
}
