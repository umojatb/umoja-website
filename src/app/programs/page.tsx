import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Three connected programs — scholarships, mentorship, and community engagement — and the five-step relationship that runs through them.",
};

type Program = { readonly title: string; readonly body: string };

const PROGRAMS: readonly Program[] = [
  {
    title: "Scholarships",
    body: "Multi-year, fully funded. We cover fees, books, transport, and the unexpected — so families don’t have to choose between this term and the next.",
  },
  {
    title: "Mentorship",
    body: "Each scholar paired with practitioners and alumni. Career advice, exam prep, and a steady relationship that doesn’t end at graduation.",
  },
  {
    title: "Community engagement",
    body: "Selection, partnerships, and reporting all happen with the schools and elders closest to the work. We don’t run programs at communities; we run them with.",
  },
];

type Step = { readonly title: string; readonly body: string };

const STEPS: readonly Step[] = [
  {
    title: "Student selection",
    body: "Local teachers and elders nominate learners who are ready. We look at potential — not just past grades or pedigree.",
  },
  {
    title: "Financial support",
    body: "A multi-year scholarship covers everything a scholar needs to stay in school: fees, transport, books, and basic living.",
  },
  {
    title: "Mentorship",
    body: "Each scholar is paired with a mentor — a practitioner or alumnus — who stays engaged with them through graduation.",
  },
  {
    title: "Progress monitoring",
    body: "Termly check-ins with the scholar, the school, and the family. Adjustments happen in writing, on a steady cadence, with the people involved.",
  },
  {
    title: "Long-term impact",
    body: "Alumni stay in the network. They mentor the next cohort and sit on the panels that select them.",
  },
];

type Criterion = { readonly title: string; readonly body: string };

const CRITERIA: readonly Criterion[] = [
  {
    title: "Merit-based",
    body: "Selection starts with potential, not pedigree. Local teachers identify learners who would thrive with support.",
  },
  {
    title: "Financial need",
    body: "Scholarships go to students whose families could not fund them otherwise. Need is verified discreetly, never punitively.",
  },
  {
    title: "Commitment",
    body: "Scholars and families commit to the relationship — termly check-ins, school attendance, and the small reciprocities that keep a program honest.",
  },
  {
    title: "Ethical process",
    body: "No nepotism, no payments for access. Selection panels include community members and every decision is documented end-to-end.",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHero />
      <CoreProgramsSection />
      <HowItWorksSection />
      <ContinuitySection />
      <SelectionSection />
      <ProgramsCTASection />
    </>
  );
}

function ProgramsHero() {
  return (
    <Section as="header" className="py-14 md:py-20">
      <Heading
        level={1}
        align="center"
        eyebrow="Programs"
        description="Three connected programs, one purpose: get high-potential African scholars through the full arc of their education — together with the communities that raised them."
      >
        Our programs
      </Heading>
    </Section>
  );
}

function CoreProgramsSection() {
  return (
    <Section variant="muted">
      <Heading
        level={2}
        eyebrow="What we run"
        description="One scholarship is rarely enough on its own. These three programs reinforce each other for every Umoja scholar."
      >
        Core programs
      </Heading>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROGRAMS.map((program) => (
          <Card key={program.title}>
            <h3 className="font-heading text-lg font-semibold text-primary-900">
              {program.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">{program.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function HowItWorksSection() {
  return (
    <Section>
      <Heading
        level={2}
        eyebrow="How it works"
        description="A five-step relationship that begins before a scholarship is awarded and continues into alumni life."
      >
        From nomination to network
      </Heading>
      <ol className="mt-8 space-y-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-700 font-heading text-base font-semibold text-white"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold text-primary-900">
                {step.title}
              </h3>
              <p className="mt-1 max-w-prose text-sm leading-relaxed text-neutral-700 md:text-base">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function ContinuitySection() {
  return (
    <Section>
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div>
          <Heading level={2} eyebrow="Why this works">
            Continuity is the program.
          </Heading>
          <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">
            Most scholarships end the day a student receives them. Ours start
            there. The relationship — termly check-ins, mentor pairings,
            alumni who come back to select the next cohort — is what turns
            one funded year into a generation of funded learners.
          </p>
        </div>
        <div
          aria-hidden
          className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary-300 via-secondary-400 to-primary-500 shadow-2xl"
        />
      </div>
    </Section>
  );
}

function SelectionSection() {
  return (
    <Section variant="brand">
      <Heading
        level={2}
        eyebrow="Student selection"
        tone="inverted"
        description="Four guarantees that shape every scholarship decision. Selection happens with — not at — the communities involved."
      >
        How we choose scholars
      </Heading>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {CRITERIA.map((criterion) => (
          <Card key={criterion.title}>
            <h3 className="font-heading text-lg font-semibold text-primary-900">
              {criterion.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">{criterion.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ProgramsCTASection() {
  return (
    <CTASection
      heading="Help us reach the next cohort"
      description="Fund the next cohort of scholarships, or partner with us as a school, employer, or institution."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Partner", href: "/partner" }}
    />
  );
}
