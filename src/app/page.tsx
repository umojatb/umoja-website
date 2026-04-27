import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { HeroVideo } from "@/components/hero-video";
import { Section } from "@/components/ui/section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <OpportunityGapSection />
      <KeyStatementSection />
      <ApproachStorySection />
      <LongViewSection />
      <CallToActionSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="w-full bg-primary-700 py-6 md:py-8 lg:py-10">
      <div className="relative mx-auto w-[92%] min-h-[60vh] max-w-7xl overflow-hidden rounded-[2rem] md:min-h-[64vh] lg:min-h-[68vh]">
        <HeroVideo
          src="/images/hero/hero.mp4"
          poster="/images/hero/poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
        />
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="max-w-xl px-6 md:max-w-2xl md:px-16 lg:max-w-3xl">
            <h1 className="font-heading text-4xl font-extrabold uppercase leading-tight text-white md:text-6xl">
              Empowering Africa Through Education
            </h1>
            <p className="mt-6 text-white/80 md:text-lg">
              A continent-wide effort to give every young African the
              foundation, scholarships, and mentorship they deserve — built
              alongside the communities we serve.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <Link
                href="/donate"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                Donate
              </Link>
              <Link
                href="/get-involved"
                className={buttonStyles({
                  variant: "outline-inverted",
                  size: "lg",
                })}
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
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

function OpportunityGapSection() {
  return (
    <Section variant="muted" className="py-16 md:py-20">
      <Heading
        level={2}
        eyebrow="The opportunity gap"
        description="Across Africa, millions of young people are ready to learn — and the systems around them are still catching up. We close that distance, one community partnership at a time."
      >
        Talent is everywhere. Opportunity is not.
      </Heading>

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
        <p className="font-heading text-7xl font-semibold leading-none tracking-tight text-primary-700 md:text-8xl lg:text-9xl">
          100M+
        </p>
        <p className="max-w-prose text-base leading-relaxed text-neutral-700 md:text-lg">
          school-age children across the continent without consistent access to
          quality learning resources. One in three adults still cannot read or
          write fluently in their primary language; today we partner with{" "}
          <span className="font-medium text-primary-700">200+</span>{" "}
          community-led schools across six countries — and counting.
        </p>
      </div>
    </Section>
  );
}

function KeyStatementSection() {
  return (
    <Section variant="brand" className="py-20 md:py-28 rounded-t-3xl">
      <div className="max-w-3xl">
        <Heading level={2} tone="inverted" display>
          Talent doesn’t choose its address. We don’t ask it to.
        </Heading>
      </div>
    </Section>
  );
}

function ApproachStorySection() {
  return (
    <Section className="py-16 md:py-20">
      <div className="max-w-2xl md:ml-auto">
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
    </Section>
  );
}

function LongViewSection() {
  return (
    <Section className="py-16 md:py-20">
      <div className="max-w-2xl border-l-2 border-secondary-500 pl-6 md:pl-10">
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
