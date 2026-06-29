import { describe, expect, it } from "vitest";
import {
  getAllPrograms,
  getFeaturedProgram,
  getProgramBySlug,
} from "@/lib/programs";

describe("programs lib structural invariants", () => {
  const programs = getAllPrograms();

  it("returns a non-empty program collection", () => {
    expect(programs.length).toBeGreaterThan(0);
  });

  it("every program has every required field, non-empty", () => {
    for (const program of programs) {
      expect(program.slug, `${program.slug}: slug`).toBeTruthy();
      expect(program.name, `${program.slug}: name`).toBeTruthy();
      expect(program.category, `${program.slug}: category`).toBeTruthy();
      expect(
        program.shortDescription,
        `${program.slug}: shortDescription`,
      ).toBeTruthy();
      expect(program.cover.src, `${program.slug}: cover.src`).toBeTruthy();
      expect(program.cover.alt, `${program.slug}: cover.alt`).toBeTruthy();
    }
  });

  it("every slug is unique", () => {
    const slugs = programs.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("category is one of the three allowed values", () => {
    const allowed = new Set(["Scholarships", "Mentorship", "Community"]);
    for (const program of programs) {
      expect(allowed.has(program.category), program.slug).toBe(true);
    }
  });

  it("every cover.src is an absolute /images/... path", () => {
    for (const program of programs) {
      expect(program.cover.src.startsWith("/images/"), program.slug).toBe(true);
    }
  });

  it("at most one program is marked featured", () => {
    const featuredCount = programs.filter((p) => p.featured).length;
    expect(featuredCount).toBeLessThanOrEqual(1);
  });
});

describe("getFeaturedProgram", () => {
  it("returns the program flagged featured (or undefined when none)", () => {
    const expected = getAllPrograms().find((p) => p.featured);
    expect(getFeaturedProgram()).toEqual(expected);
  });

  it("the returned program (when present) has featured=true", () => {
    const featured = getFeaturedProgram();
    if (featured) expect(featured.featured).toBe(true);
  });
});

describe("getProgramBySlug", () => {
  it("returns the matching program for a known slug", () => {
    const sample = getAllPrograms()[0];
    const found = getProgramBySlug(sample.slug);
    expect(found).toBeDefined();
    expect(found?.slug).toBe(sample.slug);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProgramBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getProgramBySlug("")).toBeUndefined();
  });
});
