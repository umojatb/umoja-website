import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Umoja Africa began in eastern Congo, the people who built it, and the values that guide every scholarship and partnership today.",
};

type Value = {
  readonly title: string;
  readonly body: string;
};

const VALUES: readonly Value[] = [
  {
    title: "Community-led",
    body: "The people closest to the work decide what works. Selection, partnerships, and priorities start with them.",
  },
  {
    title: "Long-haul",
    body: "We commit through graduation. Education isn’t a one-time gift — it’s a relationship that compounds.",
  },
  {
    title: "Honest reporting",
    body: "What we do, what we don’t, and how the money moves — in public, on a steady cadence.",
  },
  {
    title: "Talent over paperwork",
    body: "Local teachers and elders know who’s ready. We listen first, gatekeep last.",
  },
] as const;

type Founder = {
  readonly name: string;
  readonly role: string;
  readonly initials: string;
  readonly bio: string;
};

const FOUNDERS: readonly Founder[] = [
  {
    name: "Baka",
    role: "Co-founder",
    initials: "B",
    bio: "Grew up in eastern Congo, where the work began. Leads the community partnerships that put the first scholarships in students’ hands.",
  },
  {
    name: "Tessy",
    role: "Co-founder",
    initials: "T",
    bio: "Built Umoja’s mentorship program — the relationship that pairs every scholar with practitioners and alumni through graduation.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStorySection />
      <VisionMissionSection />
      <CoreValuesSection />
      <LeadershipSection />
      <JoinUsCTASection />
    </>
  );
}

function AboutHero() {
  return (
    <Section as="header" className="py-14 md:py-20">
      <Heading
        level={1}
        align="center"
        eyebrow="About"
        description="We invest in young Africans through full scholarships and lasting mentorship — built in partnership with the communities that raised them."
      >
        About Umoja Africa
      </Heading>
    </Section>
  );
}

function OurStorySection() {
  return (
    <Section variant="muted">
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-12">
        <Heading level={2} eyebrow="Our story" className="lg:col-span-2">
          From a single classroom in Congo
        </Heading>
        <div className="space-y-3 text-base leading-relaxed text-neutral-700 md:text-lg lg:col-span-3">
          <p>
            Umoja Africa began in eastern Congo, where co-founders Baka and
            Tessy grew up watching brilliant classmates fall out of school —
            not because they couldn’t keep up, but because the system around
            them couldn’t keep them. School fees, transport, books, a single
            bad season for a family — any one of those could end an education
            that would have changed a community.
          </p>
          <p>
            They started with one student. One scholarship, one set of fees,
            one young person their teachers and neighbours had identified as
            ready. They learned what worked, what didn’t, and what the people
            closest to the work had been telling them all along: scholarships
            matter, but presence matters more.
          </p>
          <p>
            Today Umoja Africa runs on the same principle. We invest in young
            Africans the way Baka and Tessy invested in that first student —
            with full funding, real mentorship, and a relationship that
            doesn’t end at graduation. The geography expands, but the
            standard doesn’t.
          </p>
        </div>
      </div>
    </Section>
  );
}

function VisionMissionSection() {
  return (
    <Section>
      <Heading level={2} eyebrow="What we stand for">
        Vision &amp; mission
      </Heading>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Card>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-secondary-500">
            Vision
          </p>
          <p className="mt-2 font-heading text-xl font-medium text-primary-900 md:text-2xl">
            An Africa where talent — not income, not geography, not gender —
            decides who gets to learn.
          </p>
        </Card>
        <Card>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-secondary-500">
            Mission
          </p>
          <p className="mt-2 font-heading text-xl font-medium text-primary-900 md:text-2xl">
            Fund and accompany high-potential African students through the
            full arc of their education, in partnership with the communities
            that raised them.
          </p>
        </Card>
      </div>
    </Section>
  );
}

function CoreValuesSection() {
  return (
    <Section variant="muted">
      <Heading
        level={2}
        eyebrow="Core values"
        description="Four commitments that guide every scholarship, every partnership, and every report we publish."
      >
        How we work
      </Heading>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <Card key={value.title}>
            <h3 className="font-heading text-lg font-semibold text-primary-900">
              {value.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">{value.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function LeadershipSection() {
  return (
    <Section>
      <Heading
        level={2}
        eyebrow="Leadership"
        description="Umoja Africa was founded — and is still led day-to-day — by the people who started it."
      >
        The founders
      </Heading>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {FOUNDERS.map((founder) => (
          <Card key={founder.name}>
            <div className="flex items-start gap-3">
              <div
                role="img"
                aria-label={`Portrait of ${founder.name}`}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-700 font-heading text-xl font-semibold text-white"
              >
                {founder.initials}
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-primary-900">
                  {founder.name}
                </h3>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-secondary-600">
                  {founder.role}
                </p>
                <p className="mt-2 text-sm text-neutral-600">{founder.bio}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function JoinUsCTASection() {
  return (
    <CTASection
      heading="Join us in this work"
      description="Whether you give or get involved, your support compounds. Start where it fits."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Get Involved", href: "/get-involved" }}
    />
  );
}
