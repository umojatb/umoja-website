export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  initials: string;
  tagline: string;
  bio: string[];
  mission: string;
  achievements: string[];
  timeline: { year: string; text: string }[];
  links: { label: string; href: string }[];
};

export const TEAM: TeamMember[] = [
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
];

export function getMember(slug: string): TeamMember | undefined {
  return TEAM.find((m) => m.slug === slug);
}
