import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { InnerPage } from "@/components/layout/inner-page";
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
  readonly featured?: boolean;
};

const PATHS: readonly Path[] = [
  {
    id: "donate",
    title: "Donate",
    audience:
      "individuals who want to directly fund a scholar's education.",
    body: "Financial sponsorships fund scholarships, learning materials, and the mentorship program. Every donor receives a yearly impact report on the scholars they helped support.",
    cta: { label: "Donate now", href: "/donate" },
    featured: true,
  },
  {
    id: "volunteer",
    title: "Volunteer",
    audience:
      "educators, practitioners, and mental-health advocates who can offer time, expertise, or steady mentorship.",
    body: "Mentor a scholar one-on-one, lead a workshop on leadership or career readiness, or tutor weekly in your subject. Time commitments range from a single session to a full academic year.",
    cta: { label: "Become a volunteer", href: "/apply/volunteer" },
  },
  {
    id: "partner",
    title: "Partner",
    audience:
      "local schools, community leaders, small businesses, and corporate partners ready for a long-term collaboration.",
    body: "Provide technology, books, or learning materials, offer internships, or back teacher training and extracurricular programs. Partnerships are designed jointly and reviewed annually.",
    cta: { label: "Become a partner", href: "/apply/partner" },
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
    commitment: "1 hour / month",
    body: "Guide a scholar with personal and professional advice over an academic year. Regular check-ins, motivation, and the steady contact that keeps a scholarship from feeling transactional.",
  },
  {
    title: "Tutoring",
    commitment: "2 hours / week",
    body: "Help scholars excel academically through subject-specific coaching, math, sciences, language, college prep. We match by subject and time zone to a scholar who needs it.",
  },
  {
    title: "Workshops",
    commitment: "1 to 3 hours, one-off",
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
    <InnerPage>
      <GetInvolvedHero />
      <PathSelectionSection />
      <WhyItMattersSection />
      <VolunteerDetailsSection />
      <ThreePathsAnchorSection />
      <PartnershipDetailsSection />
      <ClosingCTASection />
    </InnerPage>
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
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {PATHS.map((path) => (
          <Card
            key={path.id}
            className={[
              "flex h-full flex-col p-5 md:p-6",
              path.featured
                ? "border-accent-400 ring-1 ring-accent-400"
                : "",
            ].join(" ")}
          >
            {path.featured && (
              <span className="mb-3 self-start rounded-full bg-accent-500 px-2.5 py-0.5 font-heading text-xs font-semibold uppercase tracking-wider text-white">
                Most direct
              </span>
            )}
            <h3 className="text-xl font-bold text-primary-900">
              {path.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-primary-700">
              Best for {path.audience}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {path.body}
            </p>
            <div className="mt-auto pt-4">
              <Link
                href={path.cta.href}
                className={buttonStyles({
                  variant: path.featured ? "primary" : "outline",
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
    <Section className="py-10 md:py-14">
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
        description="Three concrete shapes for volunteer work, each with the time investment we'd ask of you up front."
      >
        Where your time goes
      </Heading>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {VOLUNTEER_OPTIONS.map((option) => (
          <Card key={option.title} className="p-5 md:p-6">
            <h3 className="text-lg font-semibold text-primary-900">
              {option.title}
            </h3>
            <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
              {option.commitment}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {option.body}
            </p>
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
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {PARTNER_OPTIONS.map((option) => (
          <Card key={option.title} className="p-5 md:p-6">
            <h3 className="text-lg font-semibold text-primary-900">
              {option.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {option.body}
            </p>
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
      description="If your contribution doesn't fit the paths above, write to us. Most partnerships start with a first email, and donations always work."
      primary={{ label: "Talk to us", href: "/contact" }}
      secondary={{ label: "Donate", href: "/donate" }}
    />
  );
}
