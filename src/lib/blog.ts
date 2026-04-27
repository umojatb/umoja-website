/**
 * Blog content source, mock data for /blog and /blog/[slug].
 *
 * Shape is intentionally CMS-friendly: when this moves to Sanity / WordPress
 * / MDX, only the data array is replaced. The accessor signatures stay the
 * same, so consumers don’t change.
 */

export type PostCategory =
  | "Field Notes"
  | "Programs"
  | "Stories"
  | "Transparency";

export type PostAuthor = {
  readonly name: string;
  readonly role: string;
  readonly initials: string;
  readonly bio: string;
};

export type Post = {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly body: readonly string[];
  readonly category: PostCategory;
  readonly publishedAt: string;
  readonly readMinutes: number;
  readonly author: PostAuthor;
  readonly cover: {
    readonly src: string;
    readonly alt: string;
  };
  readonly featured?: boolean;
};

const BAKA: PostAuthor = {
  name: "Baka",
  role: "Co-founder",
  initials: "B",
  bio: "Grew up in eastern Congo, where Umoja Africa began. Leads the community partnerships that put the first scholarships in students’ hands.",
};

const TESSY: PostAuthor = {
  name: "Tessy",
  role: "Co-founder",
  initials: "T",
  bio: "Built Umoja’s mentorship program, the relationship that pairs every scholar with practitioners and alumni through graduation.",
};

const POSTS: readonly Post[] = [
  {
    slug: "keep-scholarship-past-year-three",
    title: "What it takes to keep a scholarship past year three",
    excerpt:
      "Funding is the easy part. The hard part is the relationship that keeps a scholar in school when life gets in the way.",
    body: [
      "When we tell donors that a scholarship is a multi-year commitment, the response is usually a nod. The implication is understood: tuition, transport, books, fees, paid through to graduation. That’s the easy part.",
      "What makes a scholarship work past year three isn’t another tranche of funding. It’s a phone call when a student stops showing up. A teacher who notices. An alumna who texts back. A coordinator who knows the family by name and shows up when something has gone quiet.",
      "We’ve watched fully-funded scholars walk away in year three because no one was watching closely enough. We’ve watched under-funded ones graduate because someone was. The lesson Umoja keeps learning is the same one our partners told us from the start: scholarships matter, but presence matters more.",
      "Year three is where the relationship gets tested. The fees are already paid; the early excitement has worn off; life has gotten complicated. If the only thing connecting a scholar to the program at that point is a wire transfer, the program isn’t doing what it claims to.",
    ],
    category: "Field Notes",
    publishedAt: "2026-04-15",
    readMinutes: 6,
    author: BAKA,
    cover: {
      src: "/images/blog/michael-ali-cFU2iDh6NHI-unsplash.jpg",
      alt: "Two students walking together along a school path at dusk",
    },
    featured: true,
  },
  {
    slug: "inside-selection-process",
    title: "Inside selection: how a scholar gets nominated",
    excerpt:
      "Local teachers, elders, and alumni do the work that an external panel can’t. Here’s how nomination actually moves.",
    body: [
      "Most foundation scholarships work top-down: an external panel reads applications and picks winners. The model is efficient on paper. It’s also blind to the kind of context that decides who’s actually ready.",
      "We invert it. At Umoja, every scholar is nominated by the people closest to them, their teacher, the head of their school, an alumna in their district. The nomination is the work. Local partners know who’s been waking up at 4 a.m. to walk to school, who’s been carrying their younger siblings through a hard year, who’s quietly become the student the others come to for help.",
      "The interview panel doesn’t pick the readiest candidate from a stack of files. It confirms what the community already knows. That changes the relationship from day one: the program isn’t gifting a scholarship; it’s backing a decision the community already made. Five years later, the alumni from that scholarship sit on the next panel.",
    ],
    category: "Programs",
    publishedAt: "2026-04-02",
    readMinutes: 5,
    author: TESSY,
    cover: {
      src: "/images/blog/michael-ali-_TPjI57-uMk-unsplash.jpg",
      alt: "A community gathering in a school courtyard",
    },
    featured: true,
  },
  {
    slug: "scholar-to-selector-aline",
    title: "From scholar to selector: Aline’s story",
    excerpt:
      "Aline graduated three years ago. Today she sits on the panel that interviews next year’s nominees in her home district.",
    body: [
      "Aline was nominated by her chemistry teacher in 2019. He’d been watching her stay behind after class for two years, helping classmates work through problems she’d already solved. He told the Umoja partner in her district that she was the kind of student who would change a community if someone gave her a runway.",
      "She graduated in 2024 with a degree in environmental engineering. The scholarship covered her fees, transport, and exam costs. Her mentor, an alumna of an earlier cohort, two years ahead, stayed on the phone with her through every term, including the one her family thought she’d have to leave for.",
      "Today Aline sits on the Umoja panel that interviews nominees in her home district. She remembers what it felt like to be the one across the table. She also remembers that the panel didn’t pick her, her teacher did, and her community did. The panel just confirmed it. That’s the model she’s now passing forward.",
    ],
    category: "Stories",
    publishedAt: "2026-03-20",
    readMinutes: 4,
    author: BAKA,
    cover: {
      src: "/images/blog/michael-ali-2_rFy9TFRRc-unsplash.jpg",
      alt: "A young woman speaking at a community panel",
    },
    featured: true,
  },
  {
    slug: "2025-site-visits-lessons",
    title: "Five things we learned from our 2025 site visits",
    excerpt:
      "Trip notes from a year of partner schools. What worked, what didn’t, and what we changed afterward.",
    body: [
      "Every year, the Umoja core team visits each of our partner schools. It’s not an audit and it’s not a photo opportunity, we go because the only way to know what’s working is to be there long enough to notice what isn’t. Five things came out of the 2025 trips that changed how we’ll operate next year.",
      "Ratio matters more than headcount. The schools where mentor-to-scholar ratios stayed under 1:8 had retention rates eight points higher than the ones that scaled up faster. We’ll be holding the line on growth rather than chasing scholar count.",
      "Transport is the most invisible cost. We’ve underestimated it for years. Two of our partners are now bundling transport into the scholarship envelope, and the early data on attendance is the strongest signal we’ve seen.",
      "Alumni mentorship needs more structure. The pairs that worked best had monthly cadence and a written rhythm; the pairs that drifted didn’t. We’re piloting a lightweight check-in template across all partners next term. The full set of changes will publish alongside the 2026 annual report.",
    ],
    category: "Field Notes",
    publishedAt: "2026-03-05",
    readMinutes: 7,
    author: TESSY,
    cover: {
      src: "/images/blog/michael-ali-dMmZ4jSsjJM-unsplash.jpg",
      alt: "An open notebook on a wooden desk in a classroom",
    },
  },
  {
    slug: "impact-framework-how-we-count",
    title: "How we count what counts: our impact framework",
    excerpt:
      "The metrics we publish aren’t the only ones we track. Here’s the full framework, what each number means, and why we chose it.",
    body: [
      "Every nonprofit publishes numbers. Most of them are either too high (inflated outputs) or too vague (impact without definition). We’ve spent five years trying to land somewhere in the middle: small enough to be honest, specific enough to mean something.",
      "Our published metrics are deliberately narrow. Scholars supported with multi-year scholarships in active delivery. Schools partnered with formal MOUs. Years active. Three numbers, all verifiable, all republished quarterly. We don’t add a metric to the public report unless we can keep collecting it the same way every quarter for the next decade.",
      "Internally, we track more, completion rates by cohort, post-graduation paths, alumni retention into the panel role, partner renewal rates. These move slowly, and we’d rather publish them once a year with the audit than show preliminary versions that drift.",
      "What we don’t track: anything we can’t verify ourselves. Inferred impact, beneficiary counts that double-count, lives changed in any form, none of it makes the report. The framework isn’t sophisticated. It’s just disciplined.",
    ],
    category: "Transparency",
    publishedAt: "2026-02-18",
    readMinutes: 8,
    author: BAKA,
    cover: {
      src: "/images/placeholders/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg",
      alt: "A spread of audit documents and pens on a wooden table",
    },
  },
  {
    slug: "partnership-outlasts-grant",
    title: "Why partnership outlasts a grant cycle",
    excerpt:
      "We don’t run programs. We invest in the people running them. The difference shows up in year five, not year one.",
    body: [
      "Grant cycles end. Programs that were built around them end too, usually quietly, often without a clean handoff. We’ve watched it happen more than once: a foundation funds a five-year initiative, the cycle closes, the program winds down, and the people who showed up every day disappear with it.",
      "Umoja was built to fail differently. We don’t run programs at our partner schools, we invest in the people running them. The selection panels are local. The mentor coordinators are alumni or community members. The scholarship envelopes go through the partner school’s own systems, not parallel ones we’d have to take with us if we left.",
      "What this looks like in year five is a partnership that wouldn’t notice if our funding paused. The relationships are between the school and the community, not between the school and us. That’s not a bug, it’s the design. Our role is to keep the funding consistent and the standards visible. Their role is to do the work that’s been theirs from the start.",
    ],
    category: "Programs",
    publishedAt: "2026-02-01",
    readMinutes: 5,
    author: TESSY,
    cover: {
      src: "/images/placeholders/hannah-busing-Zyx1bK9mqmA-unsplash.jpg",
      alt: "Two community partners reviewing documents at a wooden table",
    },
  },
];

const POST_DATE_LOCALE = "en-GB";
const POST_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString(
    POST_DATE_LOCALE,
    POST_DATE_OPTIONS,
  );
}

export function getAllPosts(): readonly Post[] {
  return POSTS;
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

export function getFeaturedPost(): Post | undefined {
  return POSTS.find((post) => post.featured);
}

export function getFeaturedPosts(): readonly Post[] {
  return POSTS.filter((post) => post.featured);
}

export function getNonFeaturedPosts(): readonly Post[] {
  return POSTS.filter((post) => !post.featured);
}

export function getRelatedPosts(slug: string, limit = 3): readonly Post[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const sameCategory = POSTS.filter(
    (post) => post.slug !== slug && post.category === current.category,
  );
  const otherCategory = POSTS.filter(
    (post) => post.slug !== slug && post.category !== current.category,
  );
  return [...sameCategory, ...otherCategory].slice(0, limit);
}
