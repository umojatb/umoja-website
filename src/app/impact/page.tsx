import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
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
    label: "Students supported",
    statement: "5",
    body: "Five scholars currently supported in full, each with the holistic package: school fees, learning materials, clothing, pocket money, and a dedicated mentor.",
  },
  {
    label: "Founded",
    statement: "June 2021",
    body: "Umoja began in June 2021 with a single 10-year-old scholar. Support has expanded one student at a time, never faster than the relationships can carry.",
  },
  {
    label: "Origin",
    statement: "DRC",
    body: "Born from a volunteer mission in the Democratic Republic of Congo, where co-founder Baka first saw that survival aid was meeting needs but missing the one thing that breaks the cycle of poverty: education.",
  },
];

type Story = { readonly title: string; readonly body: string };

const STORIES: readonly Story[] = [
  {
    title: "The first scholarship",
    body: "In its very first year, Umoja supported a 10-year-old girl whose parents were struggling to afford her school fees. Beyond tuition, the support covered her materials, clothing, and pocket money, and paired her with a dedicated mentor who checked in regularly with guidance, motivation, and personalized advice. That holistic package is the same one every Umoja scholar receives today.",
  },
  {
    title: "From one scholar to five",
    body: "The success of the first year fuelled Umoja's passion. Support expanded to four more students, each receiving the same holistic package. Today, Umoja proudly supports five students fully, thanks to the outpouring of support from volunteers and donors all over the world.",
  },
];

type FundBucket = {
  readonly category: string;
  readonly target: string;
  readonly body: string;
};

const FUND_BUCKETS: readonly FundBucket[] = [
  {
    category: "Scholarships",
    target: "≥ 75%",
    body: "Direct disbursements: school fees, books, transport, exam fees, and basic living costs that keep scholars in school from nomination through graduation.",
  },
  {
    category: "Mentorship",
    target: "~ 15%",
    body: "Mentor-coordinator stipends, alumni network operations, exam prep and career resources, and termly check-in materials.",
  },
  {
    category: "Operations",
    target: "≤ 10%",
    body: "Legal and accounting, the independent annual audit, software, and salaries for the small core team that keeps the program running.",
  },
];

export default function ImpactPage() {
  return (
    <>
      <ImpactHero />
      <KeyMetricsSection />
      <StoriesSection />
      <PledgeStatementSection />
      <FundsAllocationSection />
      <TransparencySection />
      <ImpactCTASection />
    </>
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
      <div className="mx-auto max-w-5xl rounded-2xl bg-neutral-50 p-6 shadow-sm md:p-8">
        <Heading
          level={2}
          eyebrow="Key metrics"
          description="Real numbers, updated as the program grows. We won't inflate them; today's number is five, and that's the one we share."
        >
          What we measure
        </Heading>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((metric) => (
            <Card key={metric.label}>
              <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-secondary-500">
                {metric.label}
              </p>
              <p className="mt-2 font-heading text-3xl font-bold text-primary-700">
                {metric.statement}
              </p>
              <p className="mt-2 text-sm text-neutral-600">{metric.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function StoriesSection() {
  return (
    <Section className="py-8 md:py-10">
      <Heading
        level={2}
        eyebrow="Stories from the cohort"
        description="The journey from a single scholarship in June 2021 to five scholars today. We publish full, named scholar stories with each scholar's consent in our annual impact reports."
      >
        What a scholarship looks like
      </Heading>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {STORIES.map((story) => (
          <Card key={story.title}>
            <h3 className="font-heading text-lg font-semibold text-primary-900">
              {story.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 md:text-base">
              {story.body}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function PledgeStatementSection() {
  return (
    <Section variant="brand" className="py-20 md:py-28 rounded-t-3xl">
      <Heading level={2} align="center" tone="inverted" display>
        We don’t promise, we <em>publish</em>.
      </Heading>
    </Section>
  );
}

function FundsAllocationSection() {
  return (
    <Section variant="muted">
      <div className="mx-auto max-w-5xl rounded-2xl bg-background p-6 shadow-sm md:p-9">
        <Heading
          level={2}
          eyebrow="Where the money goes"
          description="Our commitment for every dollar received. Audited actuals, with the full breakdown by program, geography, and cohort, publish each year in our annual impact report."
        >
          How funds are used
        </Heading>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {FUND_BUCKETS.map((bucket) => (
            <Card key={bucket.category}>
              <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-secondary-500">
                {bucket.category}
              </p>
              <p className="mt-2 font-heading text-4xl font-bold text-primary-700">
                {bucket.target}
              </p>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                target allocation
              </p>
              <p className="mt-3 text-sm text-neutral-600">{bucket.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
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
            outcomes, an independent financial audit, the schools and
            community leaders we work with, and what changed in our
            strategy. Updates fill in the months between.
          </p>
          <p>
            We commit to honest accounting: when something underperforms,
            we say so; when we change strategy, we explain why; when a donor
            asks to see the books, we open them. Our reports remain freely
            available, linked from this page once published.
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
