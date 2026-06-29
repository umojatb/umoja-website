import { afterEach, describe, expect, it } from "vitest";
import {
  _resetSearchIndexCache,
  buildSearchIndex,
  getSearchIndex,
  scoreEntry,
  searchEntries,
  type SearchEntry,
} from "@/lib/search";

afterEach(() => {
  _resetSearchIndexCache();
});

describe("buildSearchIndex", () => {
  it("returns a non-empty index", () => {
    const index = buildSearchIndex();
    expect(index.length).toBeGreaterThan(10);
  });

  it("includes the static high-value pages", () => {
    const index = buildSearchIndex();
    const hrefs = index.map((e) => e.href);
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/donate");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/programs");
    expect(hrefs).toContain("/impact");
    expect(hrefs).toContain("/contact");
  });

  it("includes mega-menu primary links", () => {
    const index = buildSearchIndex();
    const labels = index.map((e) => e.label);
    expect(labels).toContain("Our story");
    expect(labels).toContain("Vision & mission");
    expect(labels).toContain("Core values");
    expect(labels).toContain("Scholarships");
  });

  it("includes program entries from getAllPrograms", () => {
    const index = buildSearchIndex();
    const programs = index.filter((e) => e.section === "Program");
    expect(programs.length).toBeGreaterThan(0);
    expect(programs.some((p) => p.label === "Scholarships")).toBe(true);
  });

  it("includes blog entries from getAllPosts", () => {
    const index = buildSearchIndex();
    const blog = index.filter((e) => e.section === "Blog");
    expect(blog.length).toBeGreaterThan(0);
  });

  it("includes report entries from getAllReports", () => {
    const index = buildSearchIndex();
    const reports = index.filter((e) => e.section === "Report");
    expect(reports.length).toBeGreaterThan(0);
  });

  it("dedupes entries that share href + label", () => {
    const index = buildSearchIndex();
    const seen = new Set<string>();
    for (const entry of index) {
      const key = `${entry.href}::${entry.label.toLowerCase()}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});

describe("getSearchIndex caching", () => {
  it("returns the same reference across calls", () => {
    const a = getSearchIndex();
    const b = getSearchIndex();
    expect(a).toBe(b);
  });

  it("returns the same content as buildSearchIndex", () => {
    const cached = getSearchIndex();
    const fresh = buildSearchIndex();
    expect(cached.length).toBe(fresh.length);
    expect(cached.map((e) => e.href)).toEqual(fresh.map((e) => e.href));
  });

  it("rebuilds after _resetSearchIndexCache", () => {
    const a = getSearchIndex();
    _resetSearchIndexCache();
    const b = getSearchIndex();
    expect(a).not.toBe(b);
    expect(a.length).toBe(b.length);
  });
});

describe("scoreEntry", () => {
  const entry: SearchEntry = {
    label: "Scholarships",
    href: "/programs#scholarships",
    section: "Program",
    description: "Multi-year scholarships covering fees and materials.",
    keywords: ["scholarship", "fees", "covering"],
  };

  it("scores 0 for empty query", () => {
    expect(scoreEntry(entry, "")).toBe(0);
    expect(scoreEntry(entry, "   ")).toBe(0);
  });

  it("scores exact label match highest", () => {
    expect(scoreEntry(entry, "scholarships")).toBe(100);
  });

  it("scores startsWith higher than contains", () => {
    expect(scoreEntry(entry, "scho")).toBe(60);
  });

  it("scores word-boundary contains higher than mid-word contains", () => {
    const e: SearchEntry = { ...entry, label: "Annual report 2024" };
    expect(scoreEntry(e, "report")).toBe(40);
  });

  it("scores description match below label match", () => {
    expect(scoreEntry(entry, "covering")).toBeLessThanOrEqual(40);
  });

  it("scores keyword startsWith above keyword contains", () => {
    const e: SearchEntry = {
      label: "Foo",
      href: "/x",
      section: "Page",
      keywords: ["mentorship"],
    };
    expect(scoreEntry(e, "ment")).toBeGreaterThan(scoreEntry(e, "ship"));
  });

  it("returns 0 when nothing matches", () => {
    expect(scoreEntry(entry, "zzzzzz")).toBe(0);
  });

  it("is case insensitive", () => {
    expect(scoreEntry(entry, "SCHOLARSHIPS")).toBe(100);
    expect(scoreEntry(entry, "ScHo")).toBe(60);
  });
});

describe("searchEntries", () => {
  const fixtures: readonly SearchEntry[] = [
    { label: "Scholarships", href: "/a", section: "Program", priority: 2 },
    { label: "Scholarship FAQ", href: "/b", section: "Page" },
    { label: "Donate", href: "/donate", section: "Action", priority: 5 },
    { label: "About", href: "/about", section: "Page", priority: 3 },
    { label: "Mentorship", href: "/c", section: "Program" },
    { label: "Random", href: "/d", section: "Page" },
  ];

  it("returns curated highest-priority entries on empty query", () => {
    const out = searchEntries(fixtures, "");
    expect(out.length).toBeGreaterThan(0);
    // Donate has priority 5, should come first
    expect(out[0].label).toBe("Donate");
  });

  it("excludes entries with no priority on empty query", () => {
    const out = searchEntries(fixtures, "");
    const labels = out.map((e) => e.label);
    expect(labels).not.toContain("Random");
    expect(labels).not.toContain("Mentorship");
    expect(labels).not.toContain("Scholarship FAQ");
  });

  it("returns matches sorted by score then priority", () => {
    const out = searchEntries(fixtures, "scho");
    expect(out.length).toBe(2);
    // Both score 60 (startsWith); Scholarships has priority 2 vs FAQ's 0,
    // so it sorts first.
    expect(out[0].label).toBe("Scholarships");
    expect(out[1].label).toBe("Scholarship FAQ");
  });

  it("filters out non-matching entries", () => {
    const out = searchEntries(fixtures, "donate");
    expect(out.length).toBe(1);
    expect(out[0].label).toBe("Donate");
  });

  it("returns empty array when nothing matches", () => {
    const out = searchEntries(fixtures, "zzzzzz");
    expect(out).toEqual([]);
  });

  it("respects the limit parameter", () => {
    const out = searchEntries(fixtures, "", 2);
    expect(out.length).toBe(2);
  });
});
