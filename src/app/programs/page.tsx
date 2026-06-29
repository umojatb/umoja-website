import type { Metadata } from "next";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { InnerPage } from "@/components/layout/inner-page";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Holistic support for academically gifted students in Africa: full scholarships, dedicated mentorship, and community partnerships, with a five-step selection process built around the scholar.",
};

type Program = {
  readonly num: string;
  readonly title: string;
  readonly body: string;
  readonly features: readonly string[];
};

const PROGRAMS: readonly Program[] = [
  {
    num: "01",
    title: "Scholarships",
    body: "We cover the full cost of a scholar's education. The holistic package keeps students in school and lets them focus entirely on learning, not on how to pay for it.",
    features: [
      "School fees paid in full",
      "Learning materials and textbooks",
      "Clothing and school uniform",
      "Monthly pocket money",
    ],
  },
  {
    num: "02",
    title: "Mentorship",
    body: "Every Umoja scholar is paired with a dedicated mentor who stays in regular contact through each term, offering guidance, motivation, and personalised advice.",
    features: [
      "Assigned personal mentor",
      "Regular check-ins each term",
      "Academic and personal guidance",
      "Alumni connection on completion",
    ],
  },
  {
    num: "03",
    title: "Community engagement",
    body: "Selection, support, and progress reporting happen alongside the school headmasters, teachers, and community leaders who know each scholar personally.",
    features: [
      "School headmaster referrals",
      "Teacher progress reports",
      "Community leader endorsement",
      "Home visits and family meetings",
    ],
  },
];

type Step = { readonly title: string; readonly body: string };

const STEPS: readonly Step[] = [
  {
    title: "Nomination",
    body: "School headmasters, teachers, or community leaders refer academically gifted students with strong character and genuine financial need.",
  },
  {
    title: "Assessment",
    body: "We review each nomination alongside supporting documentation. Home visits and family conversations confirm both need and commitment.",
  },
  {
    title: "Award",
    body: "A full holistic scholarship is awarded: school fees, books, clothing, pocket money, and a matched mentor from our volunteer pool.",
  },
  {
    title: "Support",
    body: "Termly check-ins between the scholar, their mentor, and the family keep everyone accountable and the scholar supported through each year.",
  },
  {
    title: "Continuity",
    body: "Scholars remain with Umoja through their full academic journey. Alumni stay connected as mentors for the next generation of scholars.",
  },
];

type Criterion = { readonly title: string; readonly body: string };

const CRITERIA: readonly Criterion[] = [
  {
    title: "Merit-based selection",
    body: "We prioritise academically gifted students with a track record of excellence and a commitment to their education, identified by those closest to them.",
  },
  {
    title: "Financial need",
    body: "Applicants provide documentation of financial hardship. Home visits or interviews may be conducted to assess living conditions and genuine need.",
  },
  {
    title: "Demonstrated commitment",
    body: "Applicants submit a personal statement. Parents or guardians sign an agreement to actively support the student's academic journey.",
  },
  {
    title: "Holistic evaluation",
    body: "We consider character attributes including leadership potential, resilience, and willingness to contribute. Extracurricular involvement is taken into account.",
  },
  {
    title: "Transparent criteria",
    body: "Our selection standards are clearly defined and published. Family members or close associates of Umoja staff are not eligible to apply.",
  },
  {
    title: "Independent review",
    body: "An independent panel of educators, community leaders, and Umoja representatives reviews every application to ensure objectivity throughout.",
  },
  {
    title: "Ongoing monitoring",
    body: "Selected scholars are regularly reviewed for academic progress. Mentorship and guidance are provided through every year of their education.",
  },
];

export default function ProgramsPage() {
  return (
    <InnerPage>
      <ProgramsHero />
      <ScholarStorySection />
      <ProgramPillarsSection />
      <HowItWorksSection />
      <ContinuitySection />
      <SelectionSection />
      <ProgramsCTASection />
    </InnerPage>
  );
}

function ProgramsHero() {
  return (
    <PageHero
      variant="image"
      eyebrow="Programs"
      title="Our programs"
      description="Three connected programs, one purpose: support academically gifted, underprivileged students through the full arc of their education, with the communities that raised them."
      image={{
        src: "/images/hero/joel-muniz-A4Ax1ApccfA-unsplash.jpg",
        alt: "A scholar at work in a community classroom",
      }}
    />
  );
}

function ScholarStorySection() {
  return (
    <Section id="scholar-story" className="py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
          Scholar 01
        </p>
        <blockquote className="mt-4 border-l-2 border-accent-500 pl-6">
          <p className="text-2xl font-light leading-relaxed text-primary-900 md:text-3xl">
            Our first scholar was ten years old. Her parents could not afford
            her school fees. Within a few weeks, Umoja covered the fees,
            supplied her books, clothed her, and gave her a mentor who checked
            in every term. She has not missed a school year since.
          </p>
        </blockquote>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-neutral-600 md:text-lg">
          That is the programme in a single story. Financial support, consistent
          mentorship, and a community that knows her name. Every Umoja scholar
          receives exactly the same.
        </p>
      </div>
    </Section>
  );
}

function ProgramPillarsSection() {
  return (
    <Section id="pillars" variant="muted">
      <Heading
        level={2}
        eyebrow="What we provide"
        description="A scholarship alone rarely changes a life. All three pillars together do. Every Umoja scholar receives all three from day one."
      >
        Three pillars, one scholar
      </Heading>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROGRAMS.map((program) => (
          <ProgramCard key={program.title} program={program} />
        ))}
      </div>
    </Section>
  );
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-7">
      {/* Display number */}
      <span
        className="font-display text-5xl font-light leading-none text-accent-500/20"
        aria-hidden
      >
        {program.num}
      </span>

      {/* Title + body */}
      <h3 className="mt-4 text-xl text-primary-900">{program.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        {program.body}
      </p>

      {/* Feature list */}
      <div className="mt-5 border-t border-neutral-100 pt-5">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
          What&apos;s included
        </p>
        <ul className="mt-3 space-y-2">
          {program.features.map((f) => (
            <li key={f} className="flex gap-2.5">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 8.5l3.5 3.5 7-8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm text-neutral-700">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="py-14 md:py-20">
      <Heading
        level={2}
        eyebrow="How it works"
        description="A five-step relationship that begins before a scholarship is awarded and continues into alumni life."
      >
        From nomination to network
      </Heading>
      <ol
        className="mt-10 divide-y divide-neutral-100"
        aria-label="Five steps from nomination to alumni network"
      >
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="grid grid-cols-[5rem_1fr] gap-6 py-8 md:grid-cols-[8rem_1fr] md:gap-10 lg:grid-cols-[10rem_1fr]"
          >
            <div className="flex items-start pt-1">
              <span
                className="font-display text-5xl font-light leading-none text-accent-500 md:text-6xl"
                aria-label={`Step ${index + 1}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="py-1">
              <h3 className="text-xl text-primary-900 md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 max-w-prose text-base leading-relaxed text-neutral-600">
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
    <ImageTextSection
      id="continuity"
      variant="soft"
      eyebrow="Why this works"
      title="Continuity is the programme."
      description="Umoja's support is not limited to tuition. From the first scholarship in 2021, every scholar has received the same holistic package: educational expenses, materials, clothing, pocket money, and a dedicated mentor who stays in regular contact through every term."
      image={{
        src: "/images/placeholders/emmanuel-ikwuegbu-Z-KCM4gK8C8-unsplash.jpg",
        alt: "A mentor and scholar reviewing schoolwork together",
      }}
      reverse
    />
  );
}

function SelectionSection() {
  return (
    <Section id="selection" variant="brand" className="py-16 md:py-20">
      <Heading
        level={2}
        eyebrow="Student selection"
        tone="inverted"
        description="Seven principles that shape every scholarship decision. We select the most deserving students through a clearly defined, fair, and transparent process."
      >
        How we choose scholars
      </Heading>
      <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {CRITERIA.map((criterion, i) => (
          <div key={criterion.title} className="flex gap-5">
            <span
              className="mt-1 font-display text-2xl font-light leading-none text-accent-300 tabular-nums"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">
                {criterion.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-primary-200">
                {criterion.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProgramsCTASection() {
  return (
    <CTASection
      heading="Help us reach the next student"
      description="Today we fully support five scholars, and we want that number to grow. Fund a scholarship, volunteer as a mentor, or partner as a school or institution."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Partner with us", href: "/get-involved" }}
    />
  );
}
