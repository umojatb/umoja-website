import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { InnerPage } from "@/components/layout/inner-page";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { TeamDirectory } from "@/components/team/team-directory";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Umoja began in the Democratic Republic of Congo in June 2021, the two friends who built it, and the values that guide every scholarship today.",
};

type Value = {
  readonly title: string;
  readonly body: string;
};

const VALUES: readonly Value[] = [
  {
    title: "Community Service",
    body: "We are deeply rooted in the communities we serve, committed to giving back and fostering a sense of responsibility and service in our beneficiaries.",
  },
  {
    title: "Excellence",
    body: "We inspire hard work, dedication, and the pursuit of greatness, encouraging our beneficiaries to seize every opportunity for growth and achievement.",
  },
  {
    title: "Integrity",
    body: "We uphold honesty, fairness, and transparency in all our actions, ensuring an ethical and just approach to student selection and program implementation.",
  },
  {
    title: "Empowerment",
    body: "Through education and mentorship, we empower young people to realize their potential and become leaders who drive positive change in their communities.",
  },
  {
    title: "Sustainability",
    body: "Our focus is on creating lasting impact, fostering resilience, and equipping communities with the tools to achieve long-term development.",
  },
  {
    title: "Collaboration",
    body: "Partnerships with donors, educators, and volunteers amplify our reach and strengthen our ability to transform lives together.",
  },
  {
    title: "Inclusivity",
    body: "We embrace diversity and ensure equal opportunities for all, breaking barriers and providing access to education for underserved students.",
  },
  {
    title: "Compassion",
    body: "Our work is driven by empathy and a genuine desire to uplift lives, ensuring that every action reflects our commitment to making a meaningful difference.",
  },
] as const;


export default function AboutPage() {
  return (
    <InnerPage>
      <AboutHero />
      <OurStorySection />
      <FirstScholarSection />
      <VisionMissionSection />
      <CoreValuesSection />
      <TeamSection />
      <JoinUsCTASection />
    </InnerPage>
  );
}

function AboutHero() {
  return (
    <PageHero
      variant="image"
      eyebrow="About"
      title="About Umoja"
      description="An education-focused nonprofit, founded in June 2021 by two friends with no resources of their own, only a shared belief that education is the most powerful tool for breaking the cycle of poverty."
      image={{
        src: "/images/hero/tim-marshall-cAtzHUz7Z8g-unsplash.jpg",
        alt: "Students walking together along a community school path",
      }}
    />
  );
}

function OurStorySection() {
  return (
    <ImageTextSection
      id="our-story"
      variant="soft"
      eyebrow="Our story"
      title="Born in the heart of Congo"
      image={{
        src: "/images/hero/volunteer-helping-with-donation-box.jpg",
        alt: "A community supplying books and resources to a partner school",
      }}
      description={
        <>
          <p>
            Umoja was born from the founders&apos; firsthand experiences with the
            transformative power of education. During a volunteer mission in
            the Democratic Republic of Congo, Junior Baka Wa Bana Sumaili saw
            how access to education could uplift those in refugee camps and
            break the cycle of poverty.
          </p>
          <p>
            Having herself been a beneficiary of educational grants that
            broadened her horizons, Umutoni Tessy Mercy carried a strong
            desire to give back and continue the legacy of supporting others.
            Together, with their modest savings, a shared vision, and an
            unyielding commitment, they founded Umoja in June 2021.
          </p>
          <p>
            Today, Umoja proudly supports five students fully, thanks to the
            outpouring of support from volunteers and donors all over the world.
          </p>
        </>
      }
    />
  );
}

function FirstScholarSection() {
  return (
    <Section id="first-scholar" className="py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
          Scholar 01
        </p>
        <blockquote className="mt-4 border-l-2 border-accent-500 pl-6">
          <p className="text-2xl font-light leading-relaxed text-primary-900 md:text-3xl lg:text-4xl">
            In its very first year, Umoja supported a 10-year-old girl whose
            parents were struggling to afford her school fees. The support went
            beyond tuition: books, clothing, pocket money, and a dedicated
            mentor who checked in every term.
          </p>
        </blockquote>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-neutral-600 md:text-lg">
          That holistic package is the same one every Umoja scholar receives
          today. One student at a time, one scholarship at a time.
        </p>
      </div>
    </Section>
  );
}

function VisionMissionSection() {
  return (
    <Section
      id="vision-mission"
      variant="brand"
      className="-mt-4 md:-mt-8"
    >
      <Heading level={2} eyebrow="What we stand for" tone="inverted" display>
        Vision &amp; mission
      </Heading>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Card>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
            Vision
          </p>
          <p className="mt-2 text-xl font-medium text-primary-900 md:text-2xl">
            Empowering Africa through Education.
          </p>
        </Card>
        <Card>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
            Mission
          </p>
          <p className="mt-2 text-xl font-medium text-primary-900 md:text-2xl">
            To champion educational equity by supporting underprivileged
            African youth, ensuring that every student can pursue their
            academic goals and reach their full potential.
          </p>
        </Card>
      </div>
    </Section>
  );
}

function CoreValuesSection() {
  return (
    <Section id="core-values" variant="muted">
      <Heading
        level={2}
        eyebrow="Core values"
        description="Eight commitments that are the foundation of our mission to transform lives through education. They guide our efforts, decisions, and interactions, ensuring we remain a beacon of hope for underprivileged youth."
      >
        How we work
      </Heading>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <Card key={value.title}>
            <h3 className="text-lg font-semibold text-primary-900">
              {value.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {value.body}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function TeamSection() {
  return (
    <Section id="team" className="py-10 md:py-14">
      <Heading
        level={2}
        eyebrow="Our Team"
        description="Umoja was founded, and is still led day-to-day, by the two friends who started it in June 2021. Click Quick look on any card to read the full story."
      >
        The founders
      </Heading>
      <div className="mt-8">
        <TeamDirectory />
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
