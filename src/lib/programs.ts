/**
 * Programs content source, minimal shape for the homepage preview.
 *
 * The full /programs page currently keeps its own copy inline; this lib
 * only carries what the homepage Featured Program section needs. When the
 * /programs page is refactored to be data-driven, this lib expands to
 * carry the longer per-program copy.
 */

export type ProgramCategory = "Scholarships" | "Mentorship" | "Community";

export type Program = {
  readonly slug: string;
  readonly name: string;
  readonly category: ProgramCategory;
  readonly shortDescription: string;
  readonly cover: {
    readonly src: string;
    readonly alt: string;
  };
  readonly featured?: boolean;
};

const PROGRAMS: readonly Program[] = [
  {
    slug: "scholarships",
    name: "Scholarships",
    category: "Scholarships",
    shortDescription:
      "Multi-year scholarships that cover fees, transport, books, and exam costs, committed through to graduation, not term to term.",
    cover: {
      src: "/images/sections/emmanuel-ikwuegbu-VC6MGt9ZoBA-unsplash.jpg",
      alt: "A scholar reading at a community library",
    },
    featured: true,
  },
  {
    slug: "mentorship",
    name: "Mentorship",
    category: "Mentorship",
    shortDescription:
      "Every scholar paired with an alumna or practitioner, termly check-ins, exam prep, career support, and the relationship that keeps a scholarship from feeling transactional.",
    cover: {
      src: "/images/sections/felicia-montenegro-EEbLJlfCnSI-unsplash.jpg",
      alt: "A mentor and scholar in conversation",
    },
  },
  {
    slug: "community-engagement",
    name: "Community engagement",
    category: "Community",
    shortDescription:
      "Local partnership panels and alumni-led selection, the people closest to the work decide who’s ready and how the program runs in their district.",
    cover: {
      src: "/images/sections/emmanuel-ikwuegbu-Z-KCM4gK8C8-unsplash.jpg",
      alt: "Community members gathered around a partner school",
    },
  },
];

export function getAllPrograms(): readonly Program[] {
  return PROGRAMS;
}

export function getFeaturedProgram(): Program | undefined {
  return PROGRAMS.find((program) => program.featured);
}

export function getProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((program) => program.slug === slug);
}
