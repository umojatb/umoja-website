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
    "What we measure, where every dollar goes, and the reporting commitments we keep year after year.",
};

type Metric = {
  readonly label: string;
  readonly statement: string;
  readonly body: string;
};

const METRICS: readonly Metric[] = [
  {
    label: "Students supported",
    statement: "Growing each cohort",
    body: "Multi-year scholarships in active delivery. Cohort counts publish quarterly with each impact update.",
  },
  {
    label: "Schools partnered",
    statement: "Network expanding",
    body: "Each partnership is a formal MOU with a community school. The partner directory publishes with each annual report.",
  },
  {
    label: "Years active",
    statement: "Founded in Congo",
    body: "What began as a single scholarship between friends in eastern Congo is now a multi-country program — still run by the people who started it.",
  },
];

type Story = { readonly title: string; readonly body: string };

const STORIES: readonly Story[] = [
  {
    title: "Identified, funded, accompanied",
    body: "A scholar nominated by her teachers in rural eastern Congo. Umoja covers the fees, books, and transport that would otherwise have ended her education. Through every term, an alumna mentor from her field of study stays in steady contact — exam prep, career advice, the small reciprocities that keep a scholarship from feeling transactional.",
  },
  {
    title: "From scholar to selector",
    body: "Years after graduation, Umoja alumni return to the program — interviewing nominees, mentoring the next cohort, sitting on the panels that select them. The model is generational: the people closest to the work are the people who lived through it.",
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
      description="What we count, where every dollar goes, and the reporting commitments that hold us to it. We are early-stage on purpose — small enough to publish detail, big enough to matter."
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
          description="Real numbers replace these placeholders with each quarterly update. We won’t inflate them; if a quarter is slow, we’ll say so."
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
        description="Composite portraits drawn from typical scholar journeys at Umoja. Verifiable individual stories — with each scholar’s consent — appear in our annual impact reports."
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
        We don’t promise — we <em>publish</em>.
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
          description="Our commitment for every dollar received. Audited actuals — with the full breakdown by program, geography, and cohort — publish each year in our annual impact report."
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
            Umoja Africa publishes a full impact report each year — covering
            scholar outcomes, an independent financial audit, the partner
            directory, and what changed in our strategy. Quarterly updates
            fill in the months between.
          </p>
          <p>
            We commit to honest accounting: when something underperforms,
            we say so; when we change strategy, we explain why; when a donor
            asks to see the books, we open them. Our reports remain freely
            available — linked from this page once published.
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
      description="Every dollar enters the system you just read about — tracked, audited, and reported on a published cadence."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Read our reports", href: "/annual-reports" }}
    />
  );
}
