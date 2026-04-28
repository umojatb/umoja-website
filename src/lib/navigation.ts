/**
 * Centralized navigation config.
 *
 * Source of truth for the global Navbar and Footer. Adding a route to the
 * site means editing this file, never hardcode links inside components.
 *
 * `mainNav` is the flat route list. Items with a `panel` get a click-to-open
 * mega menu in the top bar. Items flagged `topBarHidden` are kept here for
 * footer rendering but skipped in the desktop nav (used to keep the top bar
 * to four anchor sections, Impact and Contact still link from inside the
 * About / Get Involved panels).
 */

export type NavLink = {
  readonly label: string;
  readonly href: string;
};

export type NavFeaturedCard = {
  readonly title: string;
  readonly excerpt: string;
  readonly href: string;
  readonly image: { readonly src: string; readonly alt: string };
};

export type NavPanel = {
  readonly description: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly primaryLinks: readonly NavLink[];
  readonly secondaryLinks: readonly NavLink[];
  readonly featured: NavFeaturedCard;
};

export type NavItem = {
  readonly label: string;
  readonly href: string;
  /** Click target opens this panel below the nav. No panel = direct link. */
  readonly panel?: NavPanel;
  /** Keep the route in the footer / search overlay but hide it from the top bar. */
  readonly topBarHidden?: boolean;
};

export const mainNav: readonly NavItem[] = [
  {
    label: "About us",
    href: "/about",
    panel: {
      description:
        "How Umoja was founded in June 2021 by Junior Baka Wa Bana Sumaili and Umutoni Tessy Mercy, and the values that guide every scholarship today.",
      ctaLabel: "Learn more about Umoja",
      ctaHref: "/about",
      primaryLinks: [
        { label: "Our story", href: "/about#our-story" },
        { label: "Vision & mission", href: "/about#vision-mission" },
        { label: "Core values", href: "/about#core-values" },
        { label: "Leadership", href: "/about#leadership" },
      ],
      secondaryLinks: [
        { label: "Impact", href: "/impact" },
        { label: "Annual reports", href: "/annual-reports" },
        { label: "Contact", href: "/contact" },
      ],
      featured: {
        title: "Born in the heart of Congo",
        excerpt:
          "How a volunteer mission in the DRC and a former educational-grant beneficiary became Umoja, founded in June 2021 with no resources and a shared belief in education.",
        href: "/about#our-story",
        image: {
          src: "/images/hero/tim-marshall-cAtzHUz7Z8g-unsplash.jpg",
          alt: "Students walking together along a community school path",
        },
      },
    },
  },
  {
    label: "Programs",
    href: "/programs",
    panel: {
      description:
        "Holistic scholarships, dedicated mentorship, and community partnerships, with a transparent seven-step selection process behind every scholar we support.",
      ctaLabel: "Learn more about our programs",
      ctaHref: "/programs",
      primaryLinks: [
        { label: "Scholarships", href: "/programs#core-programs" },
        { label: "Mentorship", href: "/programs#core-programs" },
        { label: "Community engagement", href: "/programs#core-programs" },
      ],
      secondaryLinks: [
        { label: "How it works", href: "/programs#how-it-works" },
        { label: "Selection criteria", href: "/programs#selection" },
        { label: "Continuity", href: "/programs#continuity" },
      ],
      featured: {
        title: "Featured program: Scholarships",
        excerpt:
          "Holistic scholarships that cover school fees, learning materials, clothing, and pocket money, with a dedicated mentor for every scholar.",
        href: "/programs",
        image: {
          src: "/images/hero/joel-muniz-A4Ax1ApccfA-unsplash.jpg",
          alt: "Scholars at work in a community study session",
        },
      },
    },
  },
  {
    label: "Get Involved",
    href: "/get-involved",
    panel: {
      description:
        "Umoja is a movement, and movements need partners. Donate, mentor, tutor, run a workshop, or partner as a school, business, or institution.",
      ctaLabel: "See all paths",
      ctaHref: "/get-involved",
      primaryLinks: [
        { label: "Donate", href: "/donate" },
        { label: "Volunteer", href: "/get-involved#volunteer" },
        { label: "Partner", href: "/get-involved#partner" },
      ],
      secondaryLinks: [
        { label: "Mentor a scholar", href: "/get-involved#volunteer" },
        { label: "Tutor weekly", href: "/get-involved#volunteer" },
        { label: "Run a workshop", href: "/get-involved#volunteer" },
        { label: "Corporate partnership", href: "/get-involved#partner" },
        { label: "Talk to us", href: "/contact" },
      ],
      featured: {
        title: "Become a monthly donor",
        excerpt:
          "Recurring gifts fund scholarships, learning materials, and the mentorship program. Every donor receives a yearly impact report.",
        href: "/donate",
        image: {
          src: "/images/hero/volunteer-helping-with-donation-box.jpg",
          alt: "Volunteers packing community donation boxes",
        },
      },
    },
  },
  {
    label: "Blog",
    href: "/blog",
    panel: {
      description:
        "Field notes, impact stories, and transparency posts, written by the founders and the small core team that runs Umoja day to day.",
      ctaLabel: "Read all posts",
      ctaHref: "/blog",
      primaryLinks: [
        { label: "Field Notes", href: "/blog?category=Field+Notes" },
        { label: "Programs", href: "/blog?category=Programs" },
        { label: "Stories", href: "/blog?category=Stories" },
        { label: "Transparency", href: "/blog?category=Transparency" },
      ],
      secondaryLinks: [
        {
          label: "Keep a scholarship past year three",
          href: "/blog/keep-scholarship-past-year-three",
        },
        {
          label: "Inside selection: how a scholar gets nominated",
          href: "/blog/inside-selection-process",
        },
        {
          label: "From scholar to selector: Aline’s story",
          href: "/blog/scholar-to-selector-aline",
        },
        {
          label: "How we count what counts",
          href: "/blog/impact-framework-how-we-count",
        },
      ],
      featured: {
        title: "What it takes to keep a scholarship past year three",
        excerpt:
          "Funding is the easy part. The hard part is the relationship that keeps a scholar in school when life gets in the way.",
        href: "/blog/keep-scholarship-past-year-three",
        image: {
          src: "/images/blog/michael-ali-cFU2iDh6NHI-unsplash.jpg",
          alt: "Two students walking together along a school path at dusk",
        },
      },
    },
  },
  { label: "Impact", href: "/impact", topBarHidden: true },
  { label: "Contact", href: "/contact", topBarHidden: true },
] as const;

export const legalNav: readonly NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Annual Reports", href: "/annual-reports" },
] as const;

export const donateHref = "/donate";

/** Items shown in the desktop top bar (skips topBarHidden routes). */
export function getTopBarItems(): readonly NavItem[] {
  return mainNav.filter((item) => !item.topBarHidden);
}
