import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import {
  formatPostDate,
  getFeaturedPost,
  getNonFeaturedPosts,
  type Post,
} from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Field notes, impact stories, and transparency posts from Umoja Africa, written by the people closest to the work.",
};

export default function BlogPage() {
  const featured = getFeaturedPost();
  const posts = getNonFeaturedPosts();
  return (
    <>
      <BlogHero />
      {featured && <FeaturedArticleSection post={featured} />}
      <ArticleGridSection posts={posts} />
      <BlogCTASection />
    </>
  );
}

function BlogHero() {
  return (
    <PageHero
      variant="image"
      eyebrow="Blog"
      title="Insights & stories"
      description="Field notes, impact stories, and transparency posts, written by the people doing the work, on a steady cadence."
      image={{
        src: "/images/placeholders/different-people-doing-volunteer-work-with-food.jpg",
        alt: "Community volunteers sorting supplies for a partner school",
      }}
    />
  );
}

function FeaturedArticleSection({ post }: { post: Post }) {
  return (
    <Section variant="soft">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700">
        Featured
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
        <Link
          href={`/blog/${post.slug}`}
          className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200"
          aria-label={post.title}
        >
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700">
            {post.category}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-primary-900 md:text-4xl lg:text-5xl">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-primary-700"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            {post.excerpt}
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            {post.author.name} · {formatPostDate(post.publishedAt)} ·{" "}
            {post.readMinutes} min read
          </p>
          <div className="mt-6">
            <Link
              href={`/blog/${post.slug}`}
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              Read article
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ArticleGridSection({ posts }: { posts: readonly Post[] }) {
  return (
    <Section>
      <Heading level={2} eyebrow="More posts">
        Latest from the team
      </Heading>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}

function ArticleCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <p className="mt-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-secondary-700">
          {post.category}
        </p>
        <h3 className="mt-2 font-heading text-lg font-semibold text-primary-900 group-hover:text-primary-700">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
          {post.excerpt}
        </p>
        <p className="mt-3 text-xs text-neutral-500">
          {formatPostDate(post.publishedAt)} · {post.readMinutes} min read
        </p>
      </article>
    </Link>
  );
}

function BlogCTASection() {
  return (
    <CTASection
      heading="Stay close to the work"
      description="New posts publish on a steady cadence. Become a donor or volunteer to follow the cohorts behind every story."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Get Involved", href: "/get-involved" }}
    />
  );
}
