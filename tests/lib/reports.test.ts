import { describe, expect, it } from "vitest";
import {
  formatReportDate,
  getAllReports,
  getLatestReport,
  getReportBySlug,
} from "@/lib/reports";

describe("reports lib structural invariants", () => {
  const reports = getAllReports();

  it("returns a non-empty report collection", () => {
    expect(reports.length).toBeGreaterThan(0);
  });

  it("every report has every required field, non-empty", () => {
    for (const report of reports) {
      expect(report.slug, `${report.slug}: slug`).toBeTruthy();
      expect(report.title, `${report.slug}: title`).toBeTruthy();
      expect(report.description, `${report.slug}: description`).toBeTruthy();
      expect(report.year, `${report.slug}: year`).toBeGreaterThan(2000);
      expect(report.category, `${report.slug}: category`).toBeTruthy();
      expect(report.pages, `${report.slug}: pages`).toBeGreaterThan(0);
      expect(report.publishedAt, `${report.slug}: publishedAt`).toBeTruthy();
      expect(report.fileUrl, `${report.slug}: fileUrl`).toBeTruthy();
      expect(report.cover.src, `${report.slug}: cover.src`).toBeTruthy();
      expect(report.cover.alt, `${report.slug}: cover.alt`).toBeTruthy();
    }
  });

  it("every slug is unique", () => {
    const slugs = reports.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("category is one of the four allowed values", () => {
    const allowed = new Set([
      "Annual Report",
      "Financial Audit",
      "Programs",
      "Methodology",
    ]);
    for (const report of reports) {
      expect(allowed.has(report.category), report.slug).toBe(true);
    }
  });

  it("every publishedAt parses to a valid Date", () => {
    for (const report of reports) {
      expect(Number.isNaN(Date.parse(report.publishedAt))).toBe(false);
    }
  });
});

describe("getReportBySlug", () => {
  it("returns the matching report for a known slug", () => {
    const sample = getAllReports()[0];
    expect(getReportBySlug(sample.slug)?.slug).toBe(sample.slug);
  });

  it("returns undefined for unknown slug", () => {
    expect(getReportBySlug("nope")).toBeUndefined();
  });
});

describe("getLatestReport", () => {
  it("returns the report with the most recent publishedAt", () => {
    const all = getAllReports();
    const expected = [...all].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt),
    )[0];
    expect(getLatestReport()?.slug).toBe(expected.slug);
  });

  it("does not mutate the original array order", () => {
    const before = getAllReports().map((r) => r.slug);
    getLatestReport();
    const after = getAllReports().map((r) => r.slug);
    expect(after).toEqual(before);
  });
});

describe("formatReportDate", () => {
  it("formats month + year (no day) per its DateTimeFormat options", () => {
    const out = formatReportDate("2026-04-15");
    expect(out).toContain("2026");
    expect(out).toContain("April");
    expect(out).not.toMatch(/\b15\b/);
  });
});
