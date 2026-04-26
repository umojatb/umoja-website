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
    <section className="relative w-full min-h-[80dvh] overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-secondary-400 md:min-h-[90dvh]">
      {/* Drop the hero clip in /public/hero.mp4 and a still frame in
          /public/hero-poster.webp (then pass it via the poster prop). The
          section gradient shows through until either resolves. */}
      <HeroVideo
        src="/hero.mp4"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/35 to-black/10"
      />
      <div className="absolute inset-0 z-10 flex items-center pt-24 md:pt-32">
        <div className="max-w-2xl px-6 text-white md:pl-16">
          <p className="mb-4 font-heading text-xs uppercase tracking-widest">
            Umoja Africa
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Empowering Africa Through Education
          </h1>
          <p className="mt-4 md:text-lg">
            A continent-wide effort to give every young African the
            foundation, scholarships, and mentorship they deserve — built
            alongside the communities we serve.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 md:mt-8">
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
