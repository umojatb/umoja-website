import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";

type Program = {
  readonly number: string;
  readonly title: string;
  readonly description: string;
};

const programs: readonly Program[] = [
  {
    number: "01",
    title: "Scholarships",
    description:
      "Multi-year support placed in the hands of scholars chosen by community boards. Every donor sees the cohort their gift funds.",
  },
  {
    number: "02",
    title: "Mentorship",
    description:
      "Every volunteer is paired with a scholar by name for the duration of the program, reviewed each year by the same small team.",
  },
  {
    number: "03",
    title: "Community engagement",
    description:
      "Long-term partnerships with 200+ community-led schools across six African countries, chosen with the people closest to the work.",
  },
];

/**
 * "What do you actually do?", the beat right after the hero.
 *
 * Pays off the brand promise of structural transparency by *being*
 * structured: an asymmetric editorial split with a numbered, hairline-
 * separated list of the three programs on the right. The numbered list
 * is the section's payoff, show, don't tell.
 *
 * Stacks on mobile (statement above, programs below).
 */
export function ProgramsOverviewSection() {
  return (
    <Section className="py-16 md:py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-primary-900 md:text-4xl lg:text-5xl">
            Three programs.
            <br />
            One long-term commitment.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-700 md:text-lg">
            The structure that follows is the proof, how we choose, who we
            partner with, and how the money moves.
          </p>
        </div>

        <ol className="divide-y divide-neutral-200 lg:col-span-6 lg:col-start-7">
          {programs.map((program) => (
            <ProgramRow key={program.number} {...program} />
          ))}
        </ol>
      </div>
    </Section>
  );
}

function ProgramRow({ number, title, description }: Program) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-6 first:pt-0 last:pb-0 md:gap-x-8 md:py-8">
      <span
        aria-hidden="true"
        className="font-heading text-base font-semibold tabular-nums text-secondary-700 md:text-lg"
      >
        {number}
      </span>
      <h3 className="font-heading text-xl font-semibold text-primary-900 md:text-2xl">
        {title}
      </h3>
      <span aria-hidden="true" />
      <p className="text-base leading-relaxed text-neutral-700 md:text-lg">
        {description}
      </p>
    </li>
  );
}
