import { describe, expect, it } from "vitest";
import {
  formatPostDate,
  getAllPosts,
  getFeaturedPost,
  getFeaturedPosts,
  getNonFeaturedPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";

describe("blog lib structural invariants", () => {
  const posts = getAllPosts();

  it("returns a non-empty post collection", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("every post has every required field, non-empty", () => {
    for (const post of posts) {
      expect(post.slug, `${post.slug}: slug`).toBeTruthy();
      expect(post.title, `${post.slug}: title`).toBeTruthy();
      expect(post.excerpt, `${post.slug}: excerpt`).toBeTruthy();
      expect(post.body.length, `${post.slug}: body`).toBeGreaterThan(0);
      expect(post.category, `${post.slug}: category`).toBeTruthy();
      expect(post.publishedAt, `${post.slug}: publishedAt`).toBeTruthy();
      expect(post.readMinutes, `${post.slug}: readMinutes`).toBeGreaterThan(0);
      expect(post.author.name, `${post.slug}: author.name`).toBeTruthy();
      expect(post.cover.src, `${post.slug}: cover.src`).toBeTruthy();
      expect(post.cover.alt, `${post.slug}: cover.alt`).toBeTruthy();
    }
  });

  it("every slug is unique", () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every publishedAt parses to a valid Date", () => {
    for (const post of posts) {
      const ms = Date.parse(post.publishedAt);
      expect(Number.isNaN(ms), `${post.slug}: ${post.publishedAt}`).toBe(false);
    }
  });

  it("every cover.src is an absolute /images/... path", () => {
    for (const post of posts) {
      expect(post.cover.src.startsWith("/images/"), post.slug).toBe(true);
    }
  });

  it("category is one of the four allowed values", () => {
    const allowed = new Set([
      "Field Notes",
      "Programs",
      "Stories",
      "Transparency",
    ]);
    for (const post of posts) {
      expect(allowed.has(post.category), `${post.slug}: ${post.category}`).toBe(
        true,
      );
    }
  });
});

describe("getPostBySlug", () => {
  it("returns the matching post for a known slug", () => {
    const sample = getAllPosts()[0];
    const found = getPostBySlug(sample.slug);
    expect(found).toBeDefined();
    expect(found?.slug).toBe(sample.slug);
    expect(found?.title).toBe(sample.title);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPostBySlug("does-not-exist-anywhere")).toBeUndefined();
  });

  it("returns undefined for an empty-string slug", () => {
    expect(getPostBySlug("")).toBeUndefined();
  });
});

describe("getFeaturedPost", () => {
  it("returns the first post with featured=true (or undefined)", () => {
    const all = getAllPosts();
    const expected = all.find((p) => p.featured);
    expect(getFeaturedPost()).toEqual(expected);
  });

  it("the returned post (when present) has featured=true", () => {
    const featured = getFeaturedPost();
    if (featured) expect(featured.featured).toBe(true);
  });
});

describe("getFeaturedPosts", () => {
  it("returns only featured posts", () => {
    const featured = getFeaturedPosts();
    expect(featured.length).toBeGreaterThan(0);
    for (const post of featured) expect(post.featured).toBe(true);
  });

  it("count matches the number of featured posts in source", () => {
    const sourceFeaturedCount = getAllPosts().filter((p) => p.featured).length;
    expect(getFeaturedPosts().length).toBe(sourceFeaturedCount);
  });
});

describe("getNonFeaturedPosts", () => {
  it("returns only non-featured posts", () => {
    const non = getNonFeaturedPosts();
    for (const post of non) expect(post.featured).not.toBe(true);
  });

  it("does not overlap with getFeaturedPosts (partition invariant)", () => {
    const featuredSlugs = new Set(getFeaturedPosts().map((p) => p.slug));
    for (const post of getNonFeaturedPosts()) {
      expect(featuredSlugs.has(post.slug)).toBe(false);
    }
  });

  it("union of featured + non-featured equals full collection", () => {
    expect(getFeaturedPosts().length + getNonFeaturedPosts().length).toBe(
      getAllPosts().length,
    );
  });
});

describe("getRelatedPosts", () => {
  it("excludes the current post itself", () => {
    const current = getAllPosts()[0];
    const related = getRelatedPosts(current.slug);
    for (const post of related) expect(post.slug).not.toBe(current.slug);
  });

  it("respects the limit (default 3)", () => {
    const related = getRelatedPosts(getAllPosts()[0].slug);
    expect(related.length).toBeLessThanOrEqual(3);
  });

  it("respects an explicit limit of 1", () => {
    const related = getRelatedPosts(getAllPosts()[0].slug, 1);
    expect(related.length).toBeLessThanOrEqual(1);
  });

  it("respects a limit of 0", () => {
    const related = getRelatedPosts(getAllPosts()[0].slug, 0);
    expect(related.length).toBe(0);
  });

  it("prioritizes posts in the same category before others", () => {
    const all = getAllPosts();
    // pick a category that has at least 2 posts
    const candidate = all.find(
      (post) =>
        all.filter((p) => p.category === post.category && p.slug !== post.slug)
          .length >= 1,
    );
    if (!candidate) return;
    const related = getRelatedPosts(candidate.slug);
    if (related.length >= 1) {
      const sameCategoryAvailable = all.some(
        (p) =>
          p.slug !== candidate.slug && p.category === candidate.category,
      );
      if (sameCategoryAvailable) {
        expect(related[0].category).toBe(candidate.category);
      }
    }
  });

  it("returns [] for an unknown slug", () => {
    expect(getRelatedPosts("does-not-exist")).toEqual([]);
  });
});

describe("formatPostDate", () => {
  it("formats an ISO date in en-GB style (e.g. '15 April 2026')", () => {
    const out = formatPostDate("2026-04-15");
    expect(out).toMatch(/^\d{1,2} \w+ \d{4}$/);
    expect(out).toContain("2026");
    expect(out).toContain("April");
  });

  it("handles ISO datetimes (with time component)", () => {
    expect(() => formatPostDate("2026-04-15T10:00:00Z")).not.toThrow();
  });
});
