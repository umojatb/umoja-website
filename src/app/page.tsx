import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ApproachStorySection />
      <KeyStatementSection />
      <LayeredMetricsSection />
      <LongViewSection />
      <CallToActionSection />
    </>
  );
}

function HeroSection() {
  return (
    <Section
      bare
      as="header"
      className="relative isolate overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_20%_30%,rgba(197,160,89,0.22),transparent_70%)]"
      />
      <Container className="relative py-24 md:py-32">
        <Heading
          level={1}
          align="center"
          tone="inverted"
          eyebrow="Umoja Africa"
          description="A continent-wide effort to give every young African the foundation, scholarships, and mentorship they deserve — built alongside the communities we serve."
        >
          Empowering Africa Through <em>Education</em>
        </Heading>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/donate"
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            Donate
          </Link>
          <Link
            href="/get-involved"
            className={buttonStyles({ variant: "outline-inverted", size: "lg" })}
          >
            Get Involved
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function IntroSection() {
  return (
    <Section className="py-12">
      <div className="mx-auto max-w-prose">
        <p className="text-base leading-relaxed text-neutral-700 md:text-lg">
          Umoja Africa runs three programs — scholarships, mentorship, and
          community engagement — across multiple African countries. The
          structure that follows is the proof: how we choose, who we partner
          with, and how the money moves.
        </p>
      </div>
    </Section>
  );
}

function ApproachStorySection() {
  return (
    <Section className="py-16">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div
          aria-hidden
          className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-700 via-primary-500 to-secondary-400 shadow-2xl"
        />
        <div>
          <Heading
            level={2}
            eyebrow="Our approach"
            description="We don’t parachute in. We build long-term partnerships that put scholarships and mentorship in the hands of the people closest to the work."
          >
            Sustained access. Sustained presence.
          </Heading>
          <div className="mt-6">
            <Link
              href="/programs"
              className={buttonStyles({ variant: "outline", size: "md" })}
            >
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

function KeyStatementSection() {
  return (
    <Section variant="brand" className="py-24 md:py-32 rounded-t-3xl">
      <Heading level={2} align="center" tone="inverted" display>
        Talent doesn’t choose its address. We don’t ask it to.
      </Heading>
    </Section>
  );
}

function LayeredMetricsSection() {
  return (
    <Section variant="muted" className="py-16">
      <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
        <Heading
          level={2}
          eyebrow="The opportunity gap"
          description="Across Africa, millions of young people are ready to learn — and the systems around them are still catching up. We close that distance, one community partnership at a time."
        >
          Talent is everywhere. Opportunity is not.
        </Heading>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="font-heading text-4xl font-bold text-primary-700">
              100M+
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              School-age children across the continent without consistent
              access to quality learning resources.
            </p>
          </Card>
          <Card>
            <p className="font-heading text-4xl font-bold text-primary-700">
              1 in 3
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Adults who still cannot read or write fluently in their primary
              language.
            </p>
          </Card>
          <Card>
            <p className="font-heading text-4xl font-bold text-primary-700">
              200+
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Community-led schools we partner with across six countries — and
              counting.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}

function LongViewSection() {
  return (
    <Section className="py-16">
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div
          aria-hidden
          className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary-300 via-secondary-400 to-primary-500 shadow-2xl"
        />
        <div>
          <Heading level={2} eyebrow="The long view">
            Each gift reaches a <em>person</em>, not a number.
          </Heading>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-neutral-700 md:text-lg">
            We’re built deliberately small. Every donor sees the cohort their
            gift funds, every volunteer is paired with a scholar by name, and
            every partnership is reviewed each year by the same small team.
            When that changes, it’ll be because we decided it should.
          </p>
        </div>
      </div>
    </Section>
  );
}

function CallToActionSection() {
  return (
    <CTASection
      heading="Ready to make an impact?"
      description="Whether you give, mentor, or partner, your support compounds across thousands of lives. Start today."
      primary={{ label: "Donate now", href: "/donate" }}
      secondary={{ label: "Get Involved", href: "/get-involved" }}
    />
  );
}
