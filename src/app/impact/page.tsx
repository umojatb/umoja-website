import type { Metadata } from "next";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { InnerPage } from "@/components/layout/inner-page";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "Five scholars fully supported, founded in June 2021 in the Democratic Republic of Congo. The numbers we publish, where every dollar goes, and the reporting commitments we keep.",
};

type Metric = {
  readonly label: string;
  readonly statement: string;
  readonly body: string;
};

const METRICS: readonly Metric[] = [
  {
    label: "Scholars in active support",
    statement: "5",
    body: "Five scholars currently supported in full, each with the holistic package: school fees, learning materials, clothing, pocket money, and a dedicated mentor.",
  },
  {
    label: "Founded",
    statement: "June 2021",
    body: "Umoja began with a single 10-year-old scholar. Support has expanded one student at a time, never faster than the relationships can carry.",
  },
  {
    label: "Origin",
    statement: "DRC",
    body: "Born from a volunteer mission in the Democratic Republic of Congo, where co-founder Baka first saw that survival aid was missing the thing that breaks cycles of poverty: education.",
  },
];

type GrowthPoint = {
  readonly year: string;
  readonly count: string;
  readonly note: string;
};

const GROWTH: readonly GrowthPoint[] = [
  { year: "2021", count: "1", note: "First scholar enrolled" },
  { year: "2022", count: "2", note: "Second scholar added" },
  { year: "2023", count: "4", note: "Expanded to four" },
  { year: "2024+", count: "5", note: "Five in active support" },
];

type FundBucket = {
  readonly category: string;
  readonly target: string;
  readonly barWidth: string;
  readonly body: string;
};

const FUND_BUCKETS: readonly FundBucket[] = [
  {
    category: "Scholarships",
    target: "75%+",
    barWidth: "75%",
    body: "Direct disbursements: school fees, books, transport, exam fees, and basic living costs that keep scholars in school from nomination through graduation.",
  },
  {
    category: "Mentorship",
    target: "~15%",
    barWidth: "15%",
    body: "Mentor-coordinator stipends, alumni network operations, exam prep and career resources, and termly check-in materials.",
  },
  {
    category: "Operations",
    target: "10% max",
    barWidth: "10%",
    body: "Legal and accounting, the independent annual audit, software, and salaries for the small core team that keeps the program running.",
  },
];

const COMMITMENTS = [
  "We publish an independent annual audit, not just internal figures.",
  "We name the scholars and schools in our reports, with their consent.",
  "When strategy changes, we explain why in writing before the next report.",
] as const;

export default function ImpactPage() {
  return (
    <InnerPage>
      <ImpactHero />
      <KeyMetricsSection />
      <ScholarOneSection />
      <GrowthSection />
      <ScholarTwoSection />
      <PledgeStatementSection />
      <FundsAllocationSection />
      <TransparencySection />
      <ImpactCTASection />
    </InnerPage>
  );
}

function ImpactHero() {
  return (
    <PageHero
      variant="image"
      eyebrow="Impact"
      title="Our impact"
      description="We are deliberately small and deliberately honest. Five scholars in active support, four years since founding, a single origin in the DRC, and the holistic package that sits behind every scholarship."
      image={{
        src: "/images/placeholders/christy-joseph-jacob-Mh-R3YrrHT8-unsplash.jpg",
        alt: "A scholar reading at a community library",
      }}
    />
  );
}

function KeyMetricsSection() {
  return (
    <Section variant="muted">
      <div className="mx-auto max-w-5xl">
        <Heading
          level={2}
          eyebrow="Key metrics"
          description="Real numbers, updated as the program grows. We won&apos;t inflate them; today&apos;s number is five, and that is the one we share."
        >
          What we measure
        </Heading>
        <dl className="mt-10 grid divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              className="py-8 first:pt-0 last:pb-0 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0"
            >
              <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {metric.label}
              </dt>
              <dd
                className={
                  i === 0
                    ? "mt-3 font-display text-[5.5rem] font-light leading-none tracking-tight text-accent-500"
                    : "mt-3 font-display text-4xl font-light leading-none text-primary-700"
                }
              >
                {metric.statement}
              </dd>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                {metric.body}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

function ScholarOneSection() {
  return (
    <Section id="stories" className="py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
          Scholar 01 — The first scholarship
        </p>
        <blockquote className="mt-5 border-l-2 border-accent-500 pl-6">
          <p className="text-2xl font-light leading-relaxed text-primary-900 md:text-3xl">
            A 10-year-old girl, 2021. Her parents couldn&apos;t afford the school
            fees. Umoja covered tuition, books, clothing, pocket money, and
            assigned her a dedicated mentor who checked in every term with
            guidance and encouragement.
          </p>
        </blockquote>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-neutral-600 md:text-lg">
          That first scholarship defined the model. Not a cheque, but a
          relationship. The holistic package that Scholar 01 received is the
          same one every Umoja scholar receives today.
        </p>
      </div>
    </Section>
  );
}

function GrowthSection() {
  return (
    <Section id="growth" variant="muted" className="py-12 md:py-16">
      <Heading
        level={2}
        eyebrow="Year by year"
        description="From one scholar in 2021 to five in active support today, one year at a time."
      >
        How we have grown
      </Heading>
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-neutral-200 sm:grid-cols-4">
        {GROWTH.map((point) => (
          <div key={point.year} className="bg-white px-6 py-8 text-center">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {point.year}
            </p>
            <p className="mt-3 font-display text-5xl font-light leading-none text-primary-900">
              {point.count}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              {point.note}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ScholarTwoSection() {
  return (
    <Section variant="soft" className="py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Scholars 02 to 05 &middot; From one to five
        </p>
        <h2 className="mt-5 text-3xl font-semibold text-primary-900 md:text-4xl">
          The success of the first year fuelled Umoja&apos;s passion.
        </h2>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-neutral-600 md:text-lg">
          Support expanded to four more students, each receiving the same
          holistic package: financial aid, mentorship, a sense of belonging,
          and the assurance that someone believes in their dreams. Today, Umoja
          proudly supports five students fully, thanks to the outpouring of
          support from volunteers and donors all over the world.
        </p>
        <p className="mt-4 text-sm font-medium text-neutral-500">
          Full, named scholar stories with each scholar&apos;s consent are published
          in our annual impact reports.
        </p>
      </div>
    </Section>
  );
}

function PledgeStatementSection() {
  return (
    <Section variant="brand" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Heading level={2} align="center" tone="inverted" display>
          We don&apos;t promise, we publish.
        </Heading>
        <ul className="mx-auto mt-10 max-w-lg space-y-5">
          {COMMITMENTS.map((commitment) => (
            <li key={commitment} className="flex gap-4">
              <span className="mt-0.5 shrink-0 text-accent-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 8.5l3.5 3.5 7-8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="text-sm leading-relaxed text-primary-100">
                {commitment}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function FundsAllocationSection() {
  return (
    <Section variant="muted">
      <div className="mx-auto max-w-4xl">
        <Heading
          level={2}
          eyebrow="Where the money goes"
          description="Our commitment for every dollar received. Audited actuals, with the full breakdown by program, geography, and cohort, publish each year in our annual impact report."
        >
          How funds are used
        </Heading>
        <div className="mt-10 space-y-5">
          {FUND_BUCKETS.map((bucket) => (
            <FundBar key={bucket.category} bucket={bucket} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function FundBar({ bucket }: { bucket: FundBucket }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
          {bucket.category}
        </p>
        <p className="font-display text-3xl font-light text-accent-500">
          {bucket.target}
        </p>
      </div>
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100"
        role="img"
        aria-label={`${bucket.category}: ${bucket.target} of total funds`}
      >
        <div
          className="h-full rounded-full bg-accent-500"
          style={{ width: bucket.barWidth }}
        />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">
        {bucket.body}
      </p>
    </div>
  );
}

function TransparencySection() {
  return (
    <ImageTextSection
      eyebrow="Transparency"
      title="What we publish, and how often"
      image={{
        src: "/images/placeholders/felicia-montenegro-EEbLJlfCnSI-unsplash.jpg",
        alt: "An open report on a desk with annotations",
      }}
      description={
        <>
          <p>
            Umoja publishes a full impact report each year, covering scholar
            outcomes, an independent financial audit, the schools and community
            leaders we work with, and what changed in our strategy. Updates
            fill in the months between.
          </p>
          <p>
            We commit to honest accounting: when something underperforms, we
            say so; when we change strategy, we explain why; when a donor asks
            to see the books, we open them.
          </p>
        </>
      }
    />
  );
}

function ImpactCTASection() {
  return (
    <CTASection
      heading="Donate with full transparency"
      description="Every dollar enters the system you just read about, tracked, audited, and reported on a published cadence."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Read our reports", href: "/annual-reports" }}
    />
  );
}
