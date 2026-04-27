import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Three ways to help — donate, volunteer, or partner. Pick the one that fits you, or talk to us first.",
};

type Path = {
  readonly id: "donate" | "volunteer" | "partner";
  readonly title: string;
  readonly audience: string;
  readonly body: string;
  readonly cta: { readonly label: string; readonly href: string };
};

const PATHS: readonly Path[] = [
  {
    id: "donate",
    title: "Donate",
    audience:
      "individuals who want to directly fund a scholar’s education.",
    body: "One-time or recurring gifts go straight into the scholarship pool. Every donor receives a yearly impact report and can request a partial breakdown by cohort.",
    cta: { label: "Donate now", href: "/donate" },
  },
  {
    id: "volunteer",
    title: "Volunteer",
    audience:
      "practitioners and alumni who can give time, expertise, or steady mentorship.",
    body: "Mentor a scholar through their academic year, run a workshop in your field, or tutor weekly via video. Time commitments range from one workshop to a full school year.",
    cta: { label: "Become a volunteer", href: "/volunteer" },
  },
  {
    id: "partner",
    title: "Partner",
    audience:
      "schools, employers, and institutions ready for a long-term collaboration.",
    body: "Sponsor a cohort, host alumni for internships, or join a multi-year MOU with our partner schools. Partnerships are designed jointly and reviewed annually.",
    cta: { label: "Become a partner", href: "/partner" },
  },
];

type VolunteerOption = {
  readonly title: string;
  readonly commitment: string;
  readonly body: string;
};

const VOLUNTEER_OPTIONS: readonly VolunteerOption[] = [
  {
    title: "Mentorship",
    commitment: "≈ 1 hour / month",
    body: "Pair with a scholar in your field for an academic year. Monthly check-ins, exam-prep guidance, and the steady contact that keeps a scholarship from feeling transactional.",
  },
  {
    title: "Tutoring",
    commitment: "≈ 2 hours / week",
    body: "Weekly subject support over video — math, sciences, language, college prep. We match by subject and time zone to a scholar who needs it.",
  },
  {
    title: "Workshops",
    commitment: "1–3 hours, one-off",
    body: "Run a single session for a cohort: career talks, technical skills, university applications. Tell us what you’d teach and we’ll find the right audience.",
  },
];

type PartnerOption = { readonly title: string; readonly body: string };

const PARTNER_OPTIONS: readonly PartnerOption[] = [
  {
    title: "Corporate sponsorship",
    body: "Fund a cohort of scholars under your company’s name. We handle reporting and audit; your team meets the cohort each year.",
  },
  {
    title: "Resource contributions",
    body: "Lab access, software licenses, internship slots, in-kind goods. We map needs to the cohort and the partner — nothing wasted.",
  },
  {
    title: "Long-term collaboration",
    body: "A multi-year MOU with your school, university, or institution. Joint program design, shared metrics, annual review.",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <GetInvolvedHero />
      <PathSelectionSection />
      <WhyItMattersSection />
      <VolunteerDetailsSection />
      <ThreePathsAnchorSection />
      <PartnershipDetailsSection />
      <ClosingCTASection />
    </>
  );
}

function GetInvolvedHero() {
  return (
    <PageHero
      variant="color"
      eyebrow="Get involved"
      title="How will you help?"
      description="Three ways to help: fund a scholarship, volunteer your time, or partner as an institution. Pick the one that fits — or talk to us if it’s not on the list."
    />
  );
}

function PathSelectionSection() {
  return (
    <Section variant="muted">
      <Heading
        level={2}
        align="center"
        eyebrow="Your path"
        description="Each path is real, funded, and active. Most contributors start with one and grow from there."
      >
        Choose how you want to help
      </Heading>
      <div className="mt-8 grid gap-3 lg:grid-cols-3">
        {PATHS.map((path) => (
          <Card key={path.id} className="flex h-full flex-col">
            <h3 className="font-heading text-xl font-bold text-primary-900">
              {path.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-primary-800">
              Best for {path.audience}
            </p>
            <p className="mt-2 text-sm text-neutral-600">{path.body}</p>
            <div className="mt-auto pt-3">
              <Link
                href={path.cta.href}
                className={buttonStyles({
                  variant: "primary",
                  size: "md",
                  className: "w-full",
                })}
              >
                {path.cta.label}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function WhyItMattersSection() {
  return (
    <Section className="py-8 md:py-10">
      <div className="mx-auto max-w-prose">
        <Heading
          level={2}
          eyebrow="Why it matters"
          description="Money funds the scholarship; time builds the relationship; partnership scales both. Each contributor changes the program in a different way — and the program needs all three to work."
        >
          Each path moves the program
        </Heading>
      </div>
    </Section>
  );
}

function VolunteerDetailsSection() {
  return (
    <Section variant="muted">
      <Heading
        level={2}
        eyebrow="Volunteer in detail"
        description="Three concrete shapes for volunteer work, each with the time investment we’d ask of you up front."
      >
        Where your time goes
      </Heading>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {VOLUNTEER_OPTIONS.map((option) => (
          <Card key={option.title}>
            <h3 className="font-heading text-lg font-semibold text-primary-900">
              {option.title}
            </h3>
            <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">
              {option.commitment}
            </p>
            <p className="mt-2 text-sm text-neutral-600">{option.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ThreePathsAnchorSection() {
  return (
    <ImageTextSection
      variant="brand"
      eyebrow="From the work"
      title="All three paths build the same program."
      description="Money funds the scholarship. Time builds the relationship. Partnership scales both. Each contributor changes the program in a different way — and the program needs all of them."
      image={{
        src: "/images/placeholders/emmanuel-ikwuegbu-VC6MGt9ZoBA-unsplash.jpg",
        alt: "A scholar and mentor reviewing coursework together",
      }}
    />
  );
}

function PartnershipDetailsSection() {
  return (
    <Section>
      <Heading
        level={2}
        eyebrow="Partnership in detail"
        description="Institutional partnerships move the most people the fastest. Three formats we run today."
      >
        How institutions plug in
      </Heading>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {PARTNER_OPTIONS.map((option) => (
          <Card key={option.title}>
            <h3 className="font-heading text-lg font-semibold text-primary-900">
              {option.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">{option.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ClosingCTASection() {
  return (
    <CTASection
      heading="Have a different idea?"
      description="If your contribution doesn’t fit the paths above, write to us. Most partnerships start with a first email — and donations always work."
      primary={{ label: "Talk to us", href: "/contact" }}
      secondary={{ label: "Donate", href: "/donate" }}
    />
  );
}
