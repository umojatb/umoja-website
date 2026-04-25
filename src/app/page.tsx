import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OpportunityGapSection />
      <ApproachSection />
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
      <Container className="relative py-16 md:py-24">
        <Heading
          level={1}
          align="center"
          tone="inverted"
          eyebrow="Umoja Africa"
          description="A continent-wide effort to give every young African the foundation, scholarships, and mentorship they deserve — built alongside the communities we serve."
        >
          Empowering Africa Through Education
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

function OpportunityGapSection() {
  return (
    <Section variant="muted">
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
            School-age children across the continent without consistent access
            to quality learning resources.
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
    </Section>
  );
}

function ApproachSection() {
  return (
    <Section>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div
          aria-hidden
          className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-700 via-primary-500 to-secondary-400 shadow-2xl"
        />
        <div>
          <Heading
            level={2}
            eyebrow="Our approach"
            description="We don't parachute in. We build long-term partnerships that put scholarships and mentorship in the hands of the people closest to the work."
          >
            Sustained access. Sustained presence.
          </Heading>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Card>
              <h3 className="font-heading text-lg font-semibold text-primary-900">
                Scholarships
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Fully funded multi-year scholarships for high-potential
                learners chosen by their communities.
              </p>
            </Card>
            <Card>
              <h3 className="font-heading text-lg font-semibold text-primary-900">
                Mentorship
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Each scholar paired with practitioners and alumni who stay
                engaged through graduation.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}

function CallToActionSection() {
  return (
    <Section variant="dark">
      <Heading
        level={2}
        align="center"
        tone="inverted"
        description="Whether you give, mentor, or partner, your support compounds across thousands of lives. Start today."
      >
        Ready to make an impact?
      </Heading>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/donate"
          className={buttonStyles({ variant: "secondary", size: "lg" })}
        >
          Donate now
        </Link>
        <Link
          href="/get-involved"
          className={buttonStyles({ variant: "outline-inverted", size: "lg" })}
        >
          Get Involved
        </Link>
      </div>
    </Section>
  );
}
