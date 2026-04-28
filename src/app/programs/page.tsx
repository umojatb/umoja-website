import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Holistic support for academically gifted students in Africa: full scholarships, dedicated mentorship, and community partnerships, with a transparent seven-step selection process.",
};

type Program = { readonly title: string; readonly body: string };

const PROGRAMS: readonly Program[] = [
  {
    title: "Scholarships",
    body: "We cover school fees, learning materials, clothing, and pocket money, the holistic package that keeps a student in school and lets them focus on learning.",
  },
  {
    title: "Mentorship",
    body: "Every Umoja scholar is paired with a dedicated mentor who checks in regularly, offering guidance, motivation, and personalized advice through their academic journey.",
  },
  {
    title: "Community engagement",
    body: "Selection, support, and reporting happen alongside school headmasters, teachers, and community leaders, the people closest to each scholar.",
  },
];

type Step = { readonly title: string; readonly body: string };

const STEPS: readonly Step[] = [
  {
    title: "Student selection",
    body: "Recommendations from school headmasters, teachers, or community leaders identify academically gifted students with strong character.",
  },
  {
    title: "Financial support",
    body: "A holistic scholarship covers everything an Umoja scholar needs: school fees, learning materials, clothing, and pocket money.",
  },
  {
    title: "Mentorship",
    body: "Each scholar is paired with a dedicated mentor who checks in regularly with guidance, motivation, and personalized advice.",
  },
  {
    title: "Progress monitoring",
    body: "Regular reports between the family, the school, and Umoja, with a clear contract that establishes the importance of open communication and visits.",
  },
  {
    title: "Long-term impact",
    body: "Beyond financial aid, scholars receive a sense of belonging and the assurance that someone believes in their potential, with us through every year of their education.",
  },
];

type Criterion = { readonly title: string; readonly body: string };

const CRITERIA: readonly Criterion[] = [
  {
    title: "Merit-Based Selection",
    body: "We prioritize academically gifted students with a proven track record of excellence. Recommendations from school headmasters, teachers, or community leaders are essential to identify students who excel academically and exhibit strong character.",
  },
  {
    title: "Financial Need Assessment",
    body: "Applicants must provide documentation to verify financial hardship, such as household income statements or community certifications. Home visits or interviews may be conducted to assess living conditions and financial challenges.",
  },
  {
    title: "Demonstrated Commitment",
    body: "Applicants submit a personal essay outlining their educational goals and commitment to Umoja's standards. Parents or guardians sign an agreement to actively support the student's academic journey and engage with Umoja.",
  },
  {
    title: "Holistic Evaluation",
    body: "We consider character attributes such as leadership potential, resilience, and willingness to contribute to their communities. Involvement in extracurricular activities or volunteer work is also taken into account.",
  },
  {
    title: "Transparent and Ethical Criteria",
    body: "Our selection criteria are clearly defined, emphasizing academic excellence, financial need, and alignment with Umoja's mission and values. We do not accept applications from family members or close associates of Umoja staff to ensure fairness and impartiality.",
  },
  {
    title: "Independent Screening Process",
    body: "An independent panel of educators, community leaders, and Umoja representatives reviews every application to maintain objectivity and integrity throughout the selection process.",
  },
  {
    title: "Ongoing Monitoring and Support",
    body: "Selected students are regularly reviewed for academic progress and commitment to the scholarship. Mentorship and guidance are provided to help every scholar achieve their full potential.",
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
    <PageHero
      variant="image"
      eyebrow="Programs"
      title="Our programs"
      description="Three connected programs, one purpose: support academically gifted, underprivileged students in Africa through the full arc of their education, with the communities that raised them."
      image={{
        src: "/images/hero/joel-muniz-A4Ax1ApccfA-unsplash.jpg",
        alt: "A scholar at work in a community classroom",
      }}
    />
  );
}

function CoreProgramsSection() {
  return (
    <Section id="core-programs" variant="muted">
      <Heading
        level={2}
        eyebrow="What we run"
        description="A scholarship on its own rarely changes a life; the three together do. Every Umoja scholar receives all three from day one."
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
    <Section id="how-it-works" className="py-12 md:py-16">
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
    <ImageTextSection
      id="continuity"
      eyebrow="Why this works"
      title="Continuity is the program."
      description="Umoja's support is not limited to tuition. From the first scholarship in 2021 onwards, every scholar has received the same holistic package: educational expenses, materials, clothing, pocket money, and a dedicated mentor who stays in regular contact through every term."
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
        description="Seven strategies that shape every scholarship decision. We select the most deserving students through a clearly defined, fair, and transparent process."
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
      heading="Help us reach the next student"
      description="Today we fully support five scholars, and we want that number to grow. Fund a scholarship, mentor, or partner as a school, employer, or institution."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Partner", href: "/get-involved#partner" }}
    />
  );
}
