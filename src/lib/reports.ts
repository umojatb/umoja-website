/**
 * Reports content source — mock data for /annual-reports.
 *
 * The `fileUrl` is intentionally `#` for now; once the actual PDFs are in
 * place under /public/reports, swap each `fileUrl` to the file path. The
 * "Coming soon" badge on each card is gated by `fileUrl === "#"`.
 */

export type ReportCategory =
  | "Annual Report"
  | "Financial Audit"
  | "Programs"
  | "Methodology";

export type Report = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly year: number;
  readonly category: ReportCategory;
  readonly pages: number;
  readonly publishedAt: string;
  readonly fileUrl: string;
  readonly cover: {
    readonly src: string;
    readonly alt: string;
  };
};

const REPORTS: readonly Report[] = [
  {
    slug: "2025-annual-impact-report",
    title: "2025 Annual Impact Report",
    description:
      "Cohort outcomes, financial allocation, and partnership health across six countries — the full year audit and the questions we’re carrying into 2026.",
    year: 2025,
    category: "Annual Report",
    pages: 56,
    publishedAt: "2026-04-01",
    fileUrl: "#",
    cover: {
      src: "/images/reports/emmanuel-ikwuegbu-VC6MGt9ZoBA-unsplash.jpg",
      alt: "Cover of the 2025 Annual Impact Report",
    },
  },
  {
    slug: "financial-audit-2025",
    title: "Independent Financial Audit, FY 2025",
    description:
      "Independent third-party audit of Umoja Africa’s revenue, allocation, and reserves for the fiscal year ending December 2025.",
    year: 2025,
    category: "Financial Audit",
    pages: 22,
    publishedAt: "2026-03-15",
    fileUrl: "#",
    cover: {
      src: "/images/reports/felicia-montenegro-EEbLJlfCnSI-unsplash.jpg",
      alt: "Cover of the FY 2025 Financial Audit",
    },
  },
  {
    slug: "cohort-2023-outcomes",
    title: "Cohort 2023: Three-Year Outcomes",
    description:
      "Three years on from the 2023 cohort. Where the scholars are now, completion rates by partner school, and the post-graduation paths we didn’t predict.",
    year: 2026,
    category: "Programs",
    pages: 18,
    publishedAt: "2026-02-20",
    fileUrl: "#",
    cover: {
      src: "/images/reports/francisco-venancio-ay5JXZnl5Pk-unsplash.jpg",
      alt: "Cover of the 2023 Cohort Three-Year Outcomes report",
    },
  },
  {
    slug: "impact-methodology",
    title: "Methodology: How Umoja Measures Impact",
    description:
      "The framework behind every public metric. Definitions, data sources, edge cases, and the limits of what we can claim with confidence.",
    year: 2026,
    category: "Methodology",
    pages: 14,
    publishedAt: "2026-01-30",
    fileUrl: "#",
    cover: {
      src: "/images/reports/guillermo-suarez-2HM3rnzMcM0-unsplash.jpg",
      alt: "Cover of the Methodology paper",
    },
  },
];

const REPORT_DATE_LOCALE = "en-GB";
const REPORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
};

export function formatReportDate(iso: string): string {
  return new Date(iso).toLocaleDateString(
    REPORT_DATE_LOCALE,
    REPORT_DATE_OPTIONS,
  );
}

export function getAllReports(): readonly Report[] {
  return REPORTS;
}

export function getReportBySlug(slug: string): Report | undefined {
  return REPORTS.find((report) => report.slug === slug);
}

export function getLatestReport(): Report | undefined {
  if (REPORTS.length === 0) return undefined;
  return [...REPORTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  )[0];
}
