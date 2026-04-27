import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/layout/cta-section";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import {
  formatReportDate,
  getAllReports,
  type Report,
} from "@/lib/reports";

export const metadata: Metadata = {
  title: "Annual Reports",
  description:
    "Independent audits, impact reports, and methodology papers, Umoja Africa’s published record, free to read and share.",
};

export default function AnnualReportsPage() {
  const reports = getAllReports();
  return (
    <>
      <ReportsHero />
      <ReportsGridSection reports={reports} />
      <ReportsCTA />
    </>
  );
}

function ReportsHero() {
  return (
    <PageHero
      variant="color"
      eyebrow="Annual reports"
      title="Reports & publications"
      description="Independent audits, impact reports, and methodology papers, free to read, free to share. The reports listed below are publishing soon; this page becomes the live archive once they’re online."
    />
  );
}

function ReportsGridSection({ reports }: { reports: readonly Report[] }) {
  return (
    <Section variant="soft">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {reports.map((report) => (
          <ReportCard key={report.slug} report={report} />
        ))}
      </div>
    </Section>
  );
}

function ReportCard({ report }: { report: Report }) {
  const isPlaceholder = report.fileUrl === "#";
  return (
    <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-background p-6 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-200">
        <Image
          src={report.cover.src}
          alt={report.cover.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 90vw"
          className="object-cover"
        />
        {isPlaceholder && (
          <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-secondary-500 px-2.5 py-1 font-heading text-xs font-semibold uppercase tracking-wider text-primary-900">
            Coming soon
          </span>
        )}
      </div>
      <p className="mt-5 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700">
        {report.category} · {report.year}
      </p>
      <h3 className="mt-2 font-heading text-lg font-semibold text-primary-900">
        {report.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
        {report.description}
      </p>
      <p className="mt-4 text-xs text-neutral-500">
        {report.pages} pages · Published {formatReportDate(report.publishedAt)}
      </p>
      <div className="mt-5">
        <Link
          href={report.fileUrl}
          aria-label={
            isPlaceholder
              ? `${report.title}, coming soon`
              : `Download ${report.title} PDF`
          }
          aria-disabled={isPlaceholder || undefined}
          className="inline-flex items-center gap-1 font-heading text-sm font-semibold text-primary-700 hover:text-primary-900"
        >
          Download PDF
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

function ReportsCTA() {
  return (
    <CTASection
      heading="Donate with full transparency"
      description="Every dollar enters the system documented in these reports, tracked, audited, and reported on a published cadence."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Read the impact page", href: "/impact" }}
    />
  );
}
