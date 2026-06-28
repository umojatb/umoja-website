/**
 * Site-wide search index + scoring.
 *
 * Indexes every page, navigation entry (top-level + mega-menu links),
 * section anchor on the long static pages, blog post, annual report,
 * and program. Each entry carries `keywords` so users can find a page
 * by content or topic ("scholarships", "founders", "selection") even
 * when the heading doesn't include the query verbatim.
 *
 * Scoring is a small hand-rolled relevance function: exact title match
 * beats title-startsWith beats title-contains beats keyword/section
 * matches. Tie-break is by `priority` (curated importance) then
 * alphabetical. There is no fuzzy/typo tolerance here — adding it would
 * mean shipping a fuzzy library, which isn't worth the bundle weight
 * for an index this small.
 */

import { getAllPosts } from "@/lib/blog";
import { mainNav, type NavItem } from "@/lib/navigation";
import { getAllPrograms } from "@/lib/programs";
import { getAllReports } from "@/lib/reports";

export type SearchSection =
  | "Page"
  | "Section"
  | "Program"
  | "Blog"
  | "Report"
  | "Action";

export type SearchEntry = {
  readonly label: string;
  readonly href: string;
  readonly section: SearchSection;
  readonly description?: string;
  readonly keywords?: readonly string[];
  /** Higher first when scores tie. Default 0. */
  readonly priority?: number;
};

const STATIC_PAGES: readonly SearchEntry[] = [
  {
    label: "Home",
    href: "/",
    section: "Page",
    description: "Umoja Africa, empowering communities through education.",
    keywords: ["start", "umoja", "africa", "homepage", "main"],
    priority: 5,
  },
  {
    label: "Donate",
    href: "/donate",
    section: "Action",
    description: "Make a one-time or monthly gift via Stripe.",
    keywords: ["give", "donation", "support", "monthly", "stripe", "money", "gift", "fund"],
    priority: 5,
  },
  {
    label: "Apply as a volunteer",
    href: "/apply/volunteer",
    section: "Action",
    description: "Mentor a scholar, tutor weekly, or run a workshop.",
    keywords: ["volunteer", "mentor", "tutor", "workshop", "help", "join"],
    priority: 4,
  },
  {
    label: "Become a partner",
    href: "/apply/partner",
    section: "Action",
    description: "Schools, businesses, and community partners.",
    keywords: ["partner", "school", "business", "ngo", "corporate", "collaborate"],
    priority: 4,
  },
  {
    label: "Contact",
    href: "/contact",
    section: "Page",
    description: "Talk to the Umoja team.",
    keywords: ["email", "contact", "reach", "message", "talk"],
    priority: 2,
  },
  {
    label: "Impact",
    href: "/impact",
    section: "Page",
    description: "How we measure outcomes for every scholar.",
    keywords: ["outcomes", "results", "metrics", "transparency", "scholars"],
    priority: 3,
  },
  {
    label: "About us",
    href: "/about",
    section: "Page",
    description: "Founders, story, vision, mission, values.",
    keywords: ["founders", "story", "vision", "mission", "values", "leadership"],
    priority: 3,
  },
  {
    label: "Programs",
    href: "/programs",
    section: "Page",
    description: "Scholarships, mentorship, community engagement.",
    keywords: ["scholarship", "mentorship", "community", "selection", "criteria"],
    priority: 3,
  },
  {
    label: "Annual reports",
    href: "/annual-reports",
    section: "Page",
    description: "Year-by-year transparency reports.",
    keywords: ["annual", "report", "transparency", "yearly", "finance"],
    priority: 2,
  },
  {
    label: "Blog",
    href: "/blog",
    section: "Page",
    description: "Field notes, stories, transparency posts.",
    keywords: ["news", "posts", "articles", "stories", "field notes", "blog"],
    priority: 2,
  },
  {
    label: "Get involved",
    href: "/get-involved",
    section: "Page",
    description: "All the ways to support Umoja.",
    keywords: ["help", "support", "volunteer", "donate", "partner"],
    priority: 3,
  },
  {
    label: "Privacy policy",
    href: "/privacy",
    section: "Page",
    keywords: ["privacy", "data", "cookies", "gdpr", "legal"],
  },
  {
    label: "Terms of service",
    href: "/terms",
    section: "Page",
    keywords: ["terms", "conditions", "legal", "agreement"],
  },
];

function navItemToEntries(item: NavItem): readonly SearchEntry[] {
  const entries: SearchEntry[] = [];
  if (item.panel) {
    for (const link of item.panel.primaryLinks) {
      entries.push({
        label: link.label,
        href: link.href,
        section: "Section",
        description: item.panel.description,
        keywords: [item.label.toLowerCase(), "menu", "navigation"],
      });
    }
    for (const link of item.panel.secondaryLinks) {
      entries.push({
        label: link.label,
        href: link.href,
        section: "Section",
        keywords: [item.label.toLowerCase()],
      });
    }
    entries.push({
      label: item.panel.featured.title,
      href: item.panel.featured.href,
      section: "Section",
      description: item.panel.featured.excerpt,
      keywords: [item.label.toLowerCase(), "featured"],
    });
  }
  return entries;
}

/**
 * Build the search index from scratch. Pure, deterministic. Exported
 * directly so tests can assert build behavior without sharing state
 * with the runtime cache below.
 */
export function buildSearchIndex(): readonly SearchEntry[] {
  const navEntries = mainNav.flatMap(navItemToEntries);

  const programEntries = getAllPrograms().map<SearchEntry>((p) => ({
    label: p.name,
    href: `/programs#${p.slug}`,
    section: "Program",
    description: p.shortDescription,
    keywords: [p.category.toLowerCase(), "program"],
    priority: 2,
  }));

  const blogEntries = getAllPosts().map<SearchEntry>((post) => ({
    label: post.title,
    href: `/blog/${post.slug}`,
    section: "Blog",
    description: post.excerpt,
    keywords: [post.category.toLowerCase(), "blog", "post", "article"],
  }));

  const reportEntries = getAllReports().map<SearchEntry>((report) => ({
    label: report.title,
    href: `/annual-reports#${report.slug}`,
    section: "Report",
    keywords: ["annual", "report", "transparency"],
  }));

  // Deduplicate by href + label so nav links that overlap with static
  // pages don't produce duplicate rows in the result list.
  const all = [
    ...STATIC_PAGES,
    ...navEntries,
    ...programEntries,
    ...blogEntries,
    ...reportEntries,
  ];
  const seen = new Set<string>();
  const deduped: SearchEntry[] = [];
  for (const entry of all) {
    const key = `${entry.href}::${entry.label.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(entry);
  }
  return deduped;
}

// Lazy module-level cache. The index draws from static lib data so it's
// safe to compute once per server / per browser tab, not once per overlay
// open. Lazy (rather than eager at module-eval) so the cost only happens
// on first search, not on every page render.
let cachedIndex: readonly SearchEntry[] | null = null;

export function getSearchIndex(): readonly SearchEntry[] {
  if (cachedIndex === null) cachedIndex = buildSearchIndex();
  return cachedIndex;
}

/** Test-only escape hatch to drop the cache between runs. */
export function _resetSearchIndexCache(): void {
  cachedIndex = null;
}

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Score one entry against a query. Returns 0 when no match — caller
 * filters those out. Higher is better.
 *
 *   100  exact label match
 *   60   label startsWith
 *   40   label contains as a whole word
 *   30   label contains anywhere
 *   18   description contains
 *   12   keyword startsWith
 *   8    keyword contains
 *   5    section contains
 */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = normalize(query.trim());
  if (!q) return 0;
  const label = normalize(entry.label);
  if (label === q) return 100;
  if (label.startsWith(q)) return 60;
  // Whole-word contain (` q ` with boundaries)
  if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(label)) {
    return 40;
  }
  if (label.includes(q)) return 30;
  if (entry.description && normalize(entry.description).includes(q)) return 18;
  if (entry.keywords) {
    for (const k of entry.keywords) {
      const nk = normalize(k);
      if (nk.startsWith(q)) return 12;
      if (nk.includes(q)) return 8;
    }
  }
  if (normalize(entry.section).includes(q)) return 5;
  return 0;
}

export type ScoredEntry = SearchEntry & { readonly score: number };

export function searchEntries(
  index: readonly SearchEntry[],
  query: string,
  limit = 25,
): readonly ScoredEntry[] {
  const trimmed = query.trim();
  if (!trimmed) {
    // Empty query -> show curated top results (highest priority) so the
    // user has something to click into without typing.
    return index
      .filter((e) => (e.priority ?? 0) > 0)
      .map((e) => ({ ...e, score: 0 }))
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || a.label.localeCompare(b.label))
      .slice(0, limit);
  }
  const scored: ScoredEntry[] = [];
  for (const entry of index) {
    const score = scoreEntry(entry, trimmed);
    if (score > 0) scored.push({ ...entry, score });
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((b.priority ?? 0) !== (a.priority ?? 0))
      return (b.priority ?? 0) - (a.priority ?? 0);
    return a.label.localeCompare(b.label);
  });
  return scored.slice(0, limit);
}
