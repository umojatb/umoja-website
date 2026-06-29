import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { BlogHeroCarousel } from "@/components/hero/blog-hero-carousel";
import { CTASection } from "@/components/layout/cta-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { Section } from "@/components/ui/section";
import { TextLink } from "@/components/ui/text-link";
import {
  formatPostDate,
  getFeaturedPosts,
  getNonFeaturedPosts,
  type Post,
} from "@/lib/blog";
import { getFeaturedProgram } from "@/lib/programs";
import { formatReportDate, getLatestReport } from "@/lib/reports";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <OpportunityGapSection />
      <KeyStatementSection />
      <ApproachStorySection />
      <LongViewSection />
      <LatestBlogSection />
      <FeaturedProgramSection />
      <LatestReportSection />
      <CallToActionSection />
    </>
  );
}

function HeroSection() {
  const featuredPosts = getFeaturedPosts();
  if (featuredPosts.length === 0) return null;
  return (
    <section className="w-full bg-primary-700 py-6 md:py-8 lg:py-10">
      <div className="relative mx-auto w-[92%] min-h-[60vh] max-w-7xl overflow-hidden rounded-[2rem] md:min-h-[64vh] lg:min-h-[68vh]">
        <BlogHeroCarousel posts={featuredPosts} />
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <Section className="py-10 md:py-14 lg:py-20">
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto h-[3px] w-9 rounded-[2px] bg-secondary-500"
        />

        <p
          className="mx-auto mt-6 max-w-[680px] font-heading font-extrabold leading-[1.1] tracking-[-0.02em]"
          style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
        >
          Empowering Africa through{" "}
          <span className="font-extrabold text-primary-900">education</span>,
          one{" "}
          <span className="font-extrabold text-primary-900">student</span> at a
          time.
        </p>

        <div className="mt-[28px]">
          <Link
            href="/about"
            className="inline-flex items-center rounded-full border border-primary-900 bg-transparent px-[28px] py-[10px] text-sm font-normal text-primary-900 transition-colors duration-[180ms] hover:bg-neutral-50 motion-reduce:transition-none"
          >
            Learn more about who we are
          </Link>
        </div>
      </div>

      <div className="mt-[44px] grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2 lg:gap-3">
        <MissionCard
          titleLead="Our"
          titleAccent="impact"
          description="Five scholars currently supported in full, each with the holistic package: school fees, materials, clothing, pocket money, and mentorship."
          linkLabel="Explore our impact"
          href="/impact"
          image={{
            src: "/images/hero/yannis-h-uaPaEM7MiQQ-unsplash.jpg",
            alt: "Students gathered outside a community school",
          }}
        />
        <MissionCard
          titleLead="Get"
          titleAccent="involved"
          description="Donate, mentor, tutor, or partner. Umoja is a movement, and movements need partners willing to invest in young futures."
          linkLabel="See how to join"
          href="/get-involved"
          image={{
            src: "/images/hero/volunteer-helping-with-donation-box.jpg",
            alt: "Volunteers packing community donation boxes",
          }}
        />
      </div>
    </Section>
  );
}

type MissionCardProps = {
  readonly titleLead: string;
  readonly titleAccent: string;
  readonly description: string;
  readonly linkLabel: string;
  readonly href: string;
  readonly image: { readonly src: string; readonly alt: string };
};

function MissionCard({
  titleLead,
  titleAccent,
  description,
  linkLabel,
  href,
  image,
}: MissionCardProps) {
  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-xl border-[0.5px] border-neutral-200 bg-background transition-colors duration-200 hover:border-secondary-500 motion-reduce:transition-none sm:grid-cols-[34%_1fr] lg:grid-cols-[38%_1fr]">
      <div className="relative h-[200px] bg-neutral-200 sm:h-full sm:min-h-[160px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 19vw, (min-width: 640px) 17vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="px-[18px] py-[20px]">
        <h3 className="font-heading text-base font-normal text-primary-900 md:text-lg">
          {titleLead}{" "}
          <span className="font-heading font-semibold text-primary-900">
            {titleAccent}
          </span>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {description}
        </p>
        <Link
          href={href}
          className="link-underline-parent mt-3 inline-block text-sm font-medium text-primary-700 transition-colors hover:text-primary-900"
        >
          <span className="link-underline">{linkLabel}</span>
        </Link>
      </div>
    </article>
  );
}

function OpportunityGapSection() {
  return (
    <Section variant="muted" className="py-16 md:py-20">
      <Heading
        level={2}
        eyebrow="The opportunity gap"
        description="Across Africa, brilliant students fall out of school not because they can't keep up, but because their families can't cover the fees. Umoja exists to close that gap, one student at a time."
      >
        Talent is everywhere. Opportunity is not.
      </Heading>

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
        <p className="font-heading text-7xl font-semibold leading-none tracking-tight text-primary-700 md:text-8xl lg:text-9xl">
          5
        </p>
        <p className="max-w-prose text-base leading-relaxed text-neutral-700 md:text-lg">
          scholars currently supported in full by Umoja, each with school
          fees, learning materials, clothing, pocket money, and a dedicated
          mentor. We started with{" "}
          <span className="font-medium text-primary-700">one</span> in June
          2021. Every new scholar has been added one at a time, never faster
          than the relationships can carry.
        </p>
      </div>
    </Section>
  );
}

function KeyStatementSection() {
  return (
    <Section variant="brand" className="py-20 md:py-28 lg:py-28 rounded-t-3xl">
      <div className="max-w-3xl">
        <Heading level={2} tone="inverted" display>
          Talent doesn’t choose its address. We don’t ask it to.
        </Heading>
      </div>
    </Section>
  );
}

function ApproachStorySection() {
  return (
    <ImageTextSection
      eyebrow="Our approach"
      title="Holistic support. Real mentorship."
      description="Umoja's support is not limited to tuition. Every scholar receives the same package: school fees, learning materials, clothing, pocket money, and a dedicated mentor who checks in regularly with guidance, motivation, and personalized advice."
      image={{
        src: "/images/placeholders/alvin-david-0AKPfr-xlCU-unsplash.jpg",
        alt: "Community partners walking through a school courtyard",
      }}
      cta={{ label: "See how it works", href: "/programs" }}
    />
  );
}

function LongViewSection() {
  return (
    <ImageTextSection
      eyebrow="The long view"
      title="Each gift reaches a person, not a number."
      description="We are deliberately small. Every donor sees the scholars their gift funds, every volunteer is paired with a scholar by name, and every partnership is reviewed by the two founders themselves. The motto we work to: together, we break down the barriers that prevent talented students from accessing the education they deserve."
      image={{
        src: "/images/placeholders/bennett-tobias-tqwOJAvUIh4-unsplash.jpg",
        alt: "A scholar studying at a community library",
      }}
      reverse
    />
  );
}

function LatestBlogSection() {
  const posts = getNonFeaturedPosts().slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <Section variant="soft">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Heading level={2} eyebrow="From the blog">
          More stories
        </Heading>
        <TextLink href="/blog">Read all posts</TextLink>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {posts.map((post) => (
          <BlogPreviewCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}

function BlogPreviewCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <Eyebrow size="xs" className="mt-4">
          {post.category}
        </Eyebrow>
        <h3 className="mt-2 font-heading text-lg font-semibold text-primary-900 group-hover:text-primary-700">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-xs text-neutral-600">
          {formatPostDate(post.publishedAt)} · {post.readMinutes} min read
        </p>
      </article>
    </Link>
  );
}

function FeaturedProgramSection() {
  const program = getFeaturedProgram();
  if (!program) return null;
  return (
    <Section>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
          <Image
            src={program.cover.src}
            alt={program.cover.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <Heading level={2} eyebrow="Featured program">
            {program.name}
          </Heading>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-neutral-600 md:text-lg">
            {program.shortDescription}
          </p>
          <div className="mt-6">
            <Link
              href="/programs"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              Explore programs
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

function LatestReportSection() {
  const report = getLatestReport();
  if (!report) return null;
  const isPlaceholder = report.fileUrl === "#";
  return (
    <Section variant="muted">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        <div>
          <Heading level={2} eyebrow="Latest report">
            {report.title}
          </Heading>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-neutral-600 md:text-lg">
            {report.description}
          </p>
          <p className="mt-3 text-sm text-neutral-600">
            {report.category} · {report.year} · {report.pages} pages ·
            Published {formatReportDate(report.publishedAt)}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {isPlaceholder ? (
              <button
                type="button"
                disabled
                className={buttonStyles({ variant: "primary", size: "md" })}
              >
                Coming soon
              </button>
            ) : (
              <Link
                href={report.fileUrl}
                className={buttonStyles({ variant: "primary", size: "md" })}
              >
                Download PDF
              </Link>
            )}
            <TextLink href="/annual-reports">All reports</TextLink>
          </div>
        </div>
        <div className="relative aspect-[3/4] w-full max-w-[16rem] overflow-hidden rounded-xl bg-neutral-200">
          <Image
            src={report.cover.src}
            alt={report.cover.alt}
            fill
            sizes="(min-width: 1024px) 16rem, 60vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}

function CallToActionSection() {
  return (
    <CTASection
      heading="Ready to make an impact?"
      description="Whether you give, mentor, or partner, your support compounds across thousands of lives. Start today."
      primary={{ label: "Donate now", href: "/donate" }}
      secondary={{ label: "Get Involved", href: "/get-involved" }}
    />
  );
}
