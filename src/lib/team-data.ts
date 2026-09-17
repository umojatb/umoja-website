/**
 * Team content source for the About page "Our Team" section.
 *
 * Shape is intentionally CMS-friendly, matching the convention used by
 * `blog.ts` and `programs.ts`: when this moves to a CMS, only the data
 * array is replaced and the accessor signatures stay the same.
 *
 * Adding a team member = appending one object to `TEAM`. No JSX changes.
 * Every field below `role` is optional, so a member whose full profile
 * has not been written yet still renders correctly.
 */

export type TeamPhoto = {
  /** Path under `/public`, e.g. `/images/team/name.jpg`. Local files only. */
  readonly src: string;
  readonly alt: string;
  /**
   * CSS `object-position` for the portrait crop, e.g. `"50% 20%"` to keep a
   * high-set face in frame. Defaults to `"50% 50%"` when omitted.
   */
  readonly position?: string;
};

export type TeamTimelineEntry = {
  readonly year: string;
  readonly text: string;
};

export type TeamLink = {
  readonly label: string;
  readonly href: string;
};

export type TeamMember = {
  readonly slug: string;
  readonly name: string;
  readonly role: string;
  /**
   * Monogram shown in the card's image frame until a real photo exists.
   * Omit for members with no confirmed name yet.
   */
  readonly initials?: string;
  /** Portrait. Omit until a real photo is supplied; the card falls back
   *  to a monogram panel rather than a broken or invented image. */
  readonly photo?: TeamPhoto;
  /** One-line personal statement shown on the card and atop the drawer. */
  readonly tagline?: string;
  readonly bio?: readonly string[];
  /** Pull-quote rendered as a blockquote in the drawer. */
  readonly mission?: string;
  readonly achievements?: readonly string[];
  readonly timeline?: readonly TeamTimelineEntry[];
  readonly links?: readonly TeamLink[];
  /**
   * True while the real name, photo, and biography are still to be
   * supplied. Placeholder members render as a muted, non-interactive
   * card: there is no profile to open yet. Delete this flag once the
   * real content lands and the card becomes clickable automatically.
   */
  readonly placeholder?: boolean;
};

/** True when the member has enough content for the drawer to be worth opening. */
export function hasProfile(member: TeamMember): boolean {
  return (
    !member.placeholder &&
    Boolean(
      member.tagline ||
        member.bio?.length ||
        member.mission ||
        member.achievements?.length ||
        member.timeline?.length,
    )
  );
}

export const TEAM: readonly TeamMember[] = [
  {
    slug: "junior-baka",
    name: "Junior Baka Wa Bana Sumaili",
    role: "Co-founder & Executive Director",
    initials: "JB",
    tagline:
      "Education is not a privilege. It is the lever that lifts a generation.",
    bio: [
      "During a volunteer mission in the Democratic Republic of Congo, Baka witnessed firsthand how aid efforts were meeting survival needs but missing the one intervention capable of breaking the cycle of poverty: sustained access to education.",
      "He returned with a conviction that became Umoja's founding premise, that a scholarship is not charity, it is investment. Together with Tessy, he channelled that conviction into action, launching Umoja in June 2021 with personal savings and a network of early believers.",
      "As Executive Director, Baka leads strategy, donor relations, and field operations, ensuring that every programme decision stays grounded in the lived realities of the communities Umoja serves.",
    ],
    mission:
      "My work is simple: remove the barriers that stop brilliant young people from becoming who they are meant to be. One scholarship at a time.",
    achievements: [
      "Co-founded Umoja Africa in June 2021",
      "Secured funding for 5 full scholarships in the first operating year",
      "Established the holistic scholarship model covering fees, books, clothing, and mentorship",
      "Built an international volunteer and donor network across three continents",
    ],
    timeline: [
      {
        year: "2020",
        text: "Volunteer mission to DRC; identified education as the critical gap in humanitarian aid.",
      },
      {
        year: "2021",
        text: "Co-founded Umoja Africa with Tessy Mercy; enrolled the first scholar.",
      },
      {
        year: "2022",
        text: "Expanded to three scholars; launched the online volunteer programme.",
      },
      {
        year: "2023",
        text: "Reached five fully funded scholars; formalised impact tracking and reporting.",
      },
      {
        year: "2024",
        text: "Opened applications for the 2025 cohort; began formal partnership outreach.",
      },
    ],
    links: [],
  },
  {
    slug: "tessy-mercy",
    name: "Umutoni Tessy Mercy",
    role: "Co-founder & Programme Director",
    initials: "UT",
    photo: {
      src: "/images/team/tessy-umutoni.jpeg",
      alt: "Umutoni Tessy Mercy, Co-founder and Programme Director at Umoja Africa",
    },
    tagline: "Someone reached out a hand to me. This is how I reach mine out.",
    bio: [
      "Tessy knows what a scholarship can mean because she lived it. As a young student, she received the kind of targeted educational support that changed the arc of her life, and she has carried the weight of that gift ever since.",
      "When Baka returned from the Congo and shared what he had seen, Tessy recognised the pattern immediately. Together they designed Umoja's programme model, not from theory, but from experience.",
      "As Programme Director, Tessy oversees scholar selection, welfare, and mentorship pairing. She reviews every application personally and maintains direct relationships with each family, ensuring the programme remains human at every stage.",
    ],
    mission:
      "Every child I support is also the child I once was. I know exactly what is at stake, and I will not let that be forgotten in the way we run this programme.",
    achievements: [
      "Co-founded Umoja Africa in June 2021",
      "Designed the holistic scholarship welfare model from lived experience",
      "Conducted all scholar welfare assessments and family interviews to date",
      "Established the peer mentorship component linking alumni with current scholars",
    ],
    timeline: [
      {
        year: "2018",
        text: "Received an educational grant that transformed her own academic trajectory.",
      },
      {
        year: "2021",
        text: "Co-founded Umoja Africa; authored the scholar selection criteria.",
      },
      {
        year: "2022",
        text: "Launched the quarterly welfare check-in system for all active scholars.",
      },
      {
        year: "2023",
        text: "Introduced alumni mentorship pairing, connecting past beneficiaries with current scholars.",
      },
      {
        year: "2024",
        text: "Expanded the scholar intake process; began formalising programme documentation.",
      },
    ],
    links: [],
  },
  {
    slug: "program-manager",
    name: "Athanase Matabaro",
    role: "Program Manager",
    initials: "AM",
    photo: {
      src: "/images/team/athanase-matabaro.png",
      alt: "Athanase Matabaro, Program Manager at Umoja Africa",
    },
    bio: [
      "As Program Manager, Athanase coordinates Umoja's programs and their day-to-day running.",
      "He supports student selection and follow-up, works with field agents and families, and contributes to program documentation, reporting, child protection, and long-term student support.",
    ],
  },
  /* ---------------------------------------------------------------------
   * Roles confirmed, people not yet announced.
   *
   * Names, photos, statements, and biographies for these two have NOT
   * been supplied, and none are invented here. Each renders as a muted
   * "profile coming soon" card. To publish one: fill in `name`,
   * `initials`, `photo`, `tagline`, `bio`, and delete `placeholder`.
   * ------------------------------------------------------------------- */
  {
    slug: "ground-leader-1",
    name: "To be announced",
    role: "Ground Leader",
    placeholder: true,
  },
  {
    slug: "ground-leader-2",
    name: "To be announced",
    role: "Ground Leader",
    placeholder: true,
  },
];

export function getMember(slug: string): TeamMember | undefined {
  return TEAM.find((m) => m.slug === slug);
}
