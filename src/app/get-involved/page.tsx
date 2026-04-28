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
    "Three ways to help, donate, volunteer, or partner. Pick the one that fits you, or talk to us first.",
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
      "individuals who want to directly fund a scholar's education.",
    body: "Financial sponsorships fund scholarships, learning materials, and the mentorship program. Every donor receives a yearly impact report on the scholars they helped support.",
    cta: { label: "Donate now", href: "/donate" },
  },
  {
    id: "volunteer",
    title: "Volunteer",
    audience:
      "educators, practitioners, and mental-health advocates who can offer time, expertise, or steady mentorship.",
    body: "Mentor a scholar one-on-one, lead a workshop on leadership or career readiness, or tutor weekly in your subject. Time commitments range from a single session to a full academic year.",
    cta: { label: "Become a volunteer", href: "/get-involved#volunteer" },
  },
  {
    id: "partner",
    title: "Partner",
    audience:
      "local schools, community leaders, small businesses, and corporate partners ready for a long-term collaboration.",
    body: "Provide technology, books, or learning materials, offer internships, or back teacher training and extracurricular programs. Partnerships are designed jointly and reviewed annually.",
    cta: { label: "Become a partner", href: "/get-involved#partner" },
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
    body: "Guide a scholar with personal and professional advice over an academic year. Regular check-ins, motivation, and the steady contact that keeps a scholarship from feeling transactional.",
  },
  {
    title: "Tutoring",
    commitment: "≈ 2 hours / week",
    body: "Help scholars excel academically through subject-specific coaching, math, sciences, language, college prep. We match by subject and time zone to a scholar who needs it.",
  },
  {
    title: "Workshops",
    commitment: "1–3 hours, one-off",
    body: "Lead a session on leadership, life skills, or career readiness. Tell us what you'd teach and we'll find the right scholars to bring you into.",
  },
];

type PartnerOption = { readonly title: string; readonly body: string };

const PARTNER_OPTIONS: readonly PartnerOption[] = [
  {
    title: "Corporate Partnerships",
    body: "Provide technology, books, or learning materials, offer internships or apprenticeship opportunities, or support initiatives like teacher training and extracurricular programs.",
  },
  {
    title: "Schools and community leaders",
    body: "Umoja already collaborates with local schools and community leaders to identify deserving students. Joining as a school or community partner means jointly designing how the program runs in your district.",
  },
  {
    title: "Small businesses",
    body: "Existing small-business partners back individual scholars or fund specific learning resources. We handle the reporting; your team sees the impact directly.",
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
      description="Umoja is a movement, and movements need partners. Fund a scholarship, volunteer your time, or partner as a school, business, or institution. Pick the one that fits, or talk to us if it isn't on the list."
    />
  );
}

function PathSelectionSection() {
  return (
    <Section id="paths" variant="muted">
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
          description="Money funds the scholarship; time builds the relationship; partnership scales both. Each contributor changes the program in a different way, and the program needs all three to work."
        >
          Each path moves the program
        </Heading>
      </div>
    </Section>
  );
}

function VolunteerDetailsSection() {
  return (
    <Section id="volunteer" variant="muted">
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
      eyebrow="Together, we break barriers"
      title="All three paths build the same program."
      description="Together, we break down the barriers that prevent talented students from accessing the education they deserve, and create a community where every child has the opportunity to thrive, dream, and achieve."
      image={{
        src: "/images/placeholders/emmanuel-ikwuegbu-VC6MGt9ZoBA-unsplash.jpg",
        alt: "A scholar and mentor reviewing coursework together",
      }}
    />
  );
}

function PartnershipDetailsSection() {
  return (
    <Section id="partner">
      <Heading
        level={2}
        eyebrow="Partnership in detail"
        description="Umoja currently collaborates with local schools, community leaders, and small businesses to identify deserving students and support their education. Three concrete formats partners step into."
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
      description="If your contribution doesn’t fit the paths above, write to us. Most partnerships start with a first email, and donations always work."
      primary={{ label: "Talk to us", href: "/contact" }}
      secondary={{ label: "Donate", href: "/donate" }}
    />
  );
}
