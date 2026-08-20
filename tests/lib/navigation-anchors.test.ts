import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { mainNav, legalNav, type NavItem } from "@/lib/navigation";
import { getSearchIndex } from "@/lib/search";

/**
 * Guards two whole classes of dead link that the existing navigation
 * tests could not catch, because they only checked that hrefs were
 * well-formed strings.
 *
 * Both of these actually shipped:
 *
 * 1. `/about#leadership` and `/programs#core-programs` pointed at
 *    anchors that did not exist. The browser silently does nothing on
 *    an unresolvable fragment, so the user just lands at the top of
 *    the page with no error anywhere.
 * 2. `/privacy` and `/terms` were linked from the footer and indexed
 *    in the search overlay while neither page existed, producing two
 *    404s on every page of the site (the footer is in the root layout,
 *    and Next prefetches links as they enter the viewport).
 *
 * These tests read the actual page sources, so they fail if either a
 * link or its target moves.
 */

const APP_DIR = path.resolve(__dirname, "../../src/app");

/** Every href reachable from the nav config, flattened. */
function collectHrefs(): string[] {
  const hrefs: string[] = [];
  const pushItem = (item: NavItem) => {
    hrefs.push(item.href);
    if (!item.panel) return;
    hrefs.push(item.panel.ctaHref, item.panel.featured.href);
    for (const link of item.panel.primaryLinks) hrefs.push(link.href);
    for (const link of item.panel.secondaryLinks) hrefs.push(link.href);
  };
  for (const item of mainNav) pushItem(item);
  for (const item of legalNav) pushItem(item);
  return hrefs;
}

/** Maps an internal route to the page file that renders it. */
function pageFileFor(route: string): string {
  const clean = route === "/" ? "" : route;
  return path.join(APP_DIR, clean, "page.tsx");
}

function readPageSource(route: string): string | null {
  try {
    return readFileSync(pageFileFor(route), "utf8");
  } catch {
    return null;
  }
}

/** Internal hrefs only, external and mailto links are out of scope. */
function isInternal(href: string): boolean {
  return href.startsWith("/");
}

describe("navigation hash targets resolve to real anchors", () => {
  const hashHrefs = [...new Set(collectHrefs())]
    .filter(isInternal)
    .filter((href) => href.includes("#"));

  it("finds hash links to check (guards against the test silently no-oping)", () => {
    expect(hashHrefs.length).toBeGreaterThan(0);
  });

  it.each(hashHrefs)("%s points at an id that exists", (href) => {
    const [route, fragment] = href.split("#");
    const source = readPageSource(route);

    expect(
      source,
      `No page file found for route "${route}" (referenced by "${href}")`,
    ).not.toBeNull();

    expect(
      source!.includes(`id="${fragment}"`),
      `"${href}" points at #${fragment}, but no element with id="${fragment}" exists in ${route}/page.tsx`,
    ).toBe(true);
  });
});

describe("every linked internal route has a page", () => {
  const routes = [
    ...new Set([
      ...collectHrefs(),
      ...getSearchIndex().map((entry) => entry.href),
    ]),
  ]
    .filter(isInternal)
    // Reduce each href to its bare route: drop the fragment and any
    // query string. The search index legitimately links filtered views
    // like "/blog?category=Stories", which are the /blog page reading
    // its own search params, not separate routes.
    .map((href) => href.split("#")[0]!.split("?")[0]!)
    // Blog posts are generated from data via generateStaticParams, so
    // there is no literal page directory to find. Their slugs are
    // already covered by tests/lib/blog.test.ts.
    .filter((route) => !route.startsWith("/blog/"))
    .filter((route, index, all) => all.indexOf(route) === index);

  it.each(routes)("%s resolves to a page file", (route) => {
    expect(
      readPageSource(route),
      `"${route}" is linked but there is no page at src/app${route === "/" ? "" : route}/page.tsx`,
    ).not.toBeNull();
  });
});
