import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { BlogHeroCarousel } from "@/components/hero/blog-hero-carousel";
import { CTASection } from "@/components/layout/cta-section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { ImageTextSection } from "@/components/sections/image-text-section";
import { ProgramsOverviewSection } from "@/components/sections/programs-overview";
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
      <ProgramsOverviewSection />
      <VisualBreakSection />
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

function VisualBreakSection() {
  return (
    <Section className="py-8 md:py-12">
      <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl bg-neutral-200">
        <Image
          src="/images/hero/yannis-h-uaPaEM7MiQQ-unsplash.jpg"
          alt="Students gathered outside a community school"
          fill
          sizes="(min-width: 1280px) 1280px, 92vw"
          className="object-cover"
        />
      </div>
    </Section>
  );
}

function OpportunityGapSection() {
  return (
    <Section variant="muted" className="py-16 md:py-20">
      <Heading
        level={2}
        eyebrow="The opportunity gap"
        description="Across Africa, millions of young people are ready to learn — and the systems around them are still catching up. We close that distance, one community partnership at a time."
      >
        Talent is everywhere. Opportunity is not.
      </Heading>

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
        <p className="font-heading text-7xl font-semibold leading-none tracking-tight text-primary-700 md:text-8xl lg:text-9xl">
          100M+
        </p>
        <p className="max-w-prose text-base leading-relaxed text-neutral-700 md:text-lg">
          school-age children across the continent without consistent access to
          quality learning resources. One in three adults still cannot read or
          write fluently in their primary language; today we partner with{" "}
          <span className="font-medium text-primary-700">200+</span>{" "}
          community-led schools across six countries — and counting.
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
      title="Sustained access. Sustained presence."
      description="We don’t parachute in. We build long-term partnerships that put scholarships and mentorship in the hands of the people closest to the work."
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
      title={
        <>
          Each gift reaches a <em>person</em>, not a number.
        </>
      }
      description="We’re built deliberately small. Every donor sees the cohort their gift funds, every volunteer is paired with a scholar by name, and every partnership is reviewed each year by the same small team. When that changes, it’ll be because we decided it should."
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
