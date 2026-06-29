import { describe, expect, it } from "vitest";
import {
  donateHref,
  getTopBarItems,
  legalNav,
  mainNav,
  type NavItem,
} from "@/lib/navigation";

function isValidHref(href: string): boolean {
  return (
    href.startsWith("/") ||
    href.startsWith("mailto:") ||
    href.startsWith("https://") ||
    href.startsWith("http://")
  );
}

describe("navigation lib structural invariants", () => {
  it("mainNav is non-empty", () => {
    expect(mainNav.length).toBeGreaterThan(0);
  });

  it("every mainNav item has a label and a valid href", () => {
    for (const item of mainNav) {
      expect(item.label, `${item.label}: label`).toBeTruthy();
      expect(item.href, `${item.label}: href`).toBeTruthy();
      expect(isValidHref(item.href), `${item.label}: ${item.href}`).toBe(true);
    }
  });

  it("every panel has description, ctaLabel, ctaHref, primary/secondary links, featured", () => {
    for (const item of mainNav) {
      if (!item.panel) continue;
      const { panel } = item;
      expect(panel.description, item.label).toBeTruthy();
      expect(panel.ctaLabel, item.label).toBeTruthy();
      expect(panel.ctaHref, item.label).toBeTruthy();
      expect(isValidHref(panel.ctaHref), item.label).toBe(true);
      expect(panel.primaryLinks.length, item.label).toBeGreaterThan(0);
      expect(panel.secondaryLinks.length, item.label).toBeGreaterThan(0);
      expect(panel.featured.title, item.label).toBeTruthy();
      expect(panel.featured.excerpt, item.label).toBeTruthy();
      expect(isValidHref(panel.featured.href), item.label).toBe(true);
      expect(panel.featured.image.src.startsWith("/images/"), item.label).toBe(
        true,
      );
      expect(panel.featured.image.alt, item.label).toBeTruthy();
    }
  });

  it("every panel link points to a parseable href starting with / or http(s)", () => {
    for (const item of mainNav) {
      if (!item.panel) continue;
      for (const link of item.panel.primaryLinks) {
        expect(link.label, `${item.label}.primary`).toBeTruthy();
        expect(isValidHref(link.href), `${item.label}: ${link.href}`).toBe(true);
      }
      for (const link of item.panel.secondaryLinks) {
        expect(link.label, `${item.label}.secondary`).toBeTruthy();
        expect(isValidHref(link.href), `${item.label}: ${link.href}`).toBe(true);
      }
    }
  });

  it("legalNav is a non-empty array of valid hrefs", () => {
    expect(legalNav.length).toBeGreaterThan(0);
    for (const item of legalNav) {
      expect(item.label).toBeTruthy();
      expect(isValidHref(item.href)).toBe(true);
    }
  });

  it("donateHref points to /donate", () => {
    expect(donateHref).toBe("/donate");
  });
});

describe("getTopBarItems", () => {
  it("excludes items flagged topBarHidden", () => {
    const topBar = getTopBarItems();
    for (const item of topBar) {
      expect(item.topBarHidden).not.toBe(true);
    }
  });

  it("includes items NOT flagged topBarHidden", () => {
    const topBar = getTopBarItems();
    const expectedCount = mainNav.filter(
      (item: NavItem) => !item.topBarHidden,
    ).length;
    expect(topBar.length).toBe(expectedCount);
  });

  it("preserves the source order of mainNav", () => {
    const topBarLabels = getTopBarItems().map((i) => i.label);
    const expectedLabels = mainNav
      .filter((i) => !i.topBarHidden)
      .map((i) => i.label);
    expect(topBarLabels).toEqual(expectedLabels);
  });

  it("returns the same reference shape on every call (idempotent)", () => {
    const a = getTopBarItems().map((i) => i.label);
    const b = getTopBarItems().map((i) => i.label);
    expect(a).toEqual(b);
  });
});
