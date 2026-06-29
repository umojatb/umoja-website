import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/layout/cta-section";
import { InnerPage } from "@/components/layout/inner-page";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import {
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  type Post,
} from "@/lib/blog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug, 3);
  return (
    <InnerPage>
      <ArticleHero post={post} />
      <ArticleBody post={post} />
      <AuthorCardSection post={post} />
      {related.length > 0 && <RelatedSection posts={related} />}
      <ArticleCTA />
    </InnerPage>
  );
}

function ArticleHero({ post }: { post: Post }) {
  return (
    <Section as="header" className="py-12 md:py-16">
      <p className="text-center font-heading text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">
        {post.category}
      </p>
      <Heading level={1} align="center" className="mt-4">
        {post.title}
      </Heading>
      <p className="mx-auto mt-5 max-w-prose text-center text-base leading-relaxed text-neutral-600 md:text-lg">
        {post.excerpt}
      </p>
      <p className="mt-6 text-center text-sm text-neutral-400">
        {post.author.name} &middot; {formatPostDate(post.publishedAt)} &middot;{" "}
        {post.readMinutes} min read
      </p>
      <div className="relative mx-auto mt-12 aspect-[21/9] max-w-5xl overflow-hidden rounded-3xl bg-neutral-200">
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes="(min-width: 1280px) 64rem, 90vw"
          priority
          className="object-cover"
        />
      </div>
    </Section>
  );
}

function ArticleBody({ post }: { post: Post }) {
  return (
    <Section className="py-8 md:py-12">
      <div className="mx-auto max-w-prose space-y-6 text-base leading-relaxed text-neutral-700 md:text-lg">
        {post.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}

function AuthorCardSection({ post }: { post: Post }) {
  const { author } = post;
  return (
    <Section variant="soft">
      <div className="mx-auto max-w-3xl">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          About the author
        </p>
        <div className="mt-5 flex items-start gap-5">
          <div
            role="img"
            aria-label={`Portrait of ${author.name}`}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-700 font-heading text-xl font-semibold text-white"
          >
            {author.initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-900">
              {author.name}
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {author.role}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
              {author.bio}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function RelatedSection({ posts }: { posts: readonly Post[] }) {
  return (
    <Section variant="muted">
      <Heading level={2} eyebrow="Related posts">
        Keep reading
      </Heading>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <RelatedCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}

function RelatedCard({ post }: { post: Post }) {
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
        <p className="mt-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          {post.category}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-primary-900 group-hover:text-primary-700 transition-colors">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-xs text-neutral-400">
          {formatPostDate(post.publishedAt)} &middot; {post.readMinutes} min read
        </p>
      </article>
    </Link>
  );
}

function ArticleCTA() {
  return (
    <CTASection
      heading="Read the work, then back the work"
      description="Posts like this one come out of the same field visits and partner reviews that inform every scholarship. Donate to fund the next cohort."
      primary={{ label: "Donate", href: "/donate" }}
      secondary={{ label: "Browse all posts", href: "/blog" }}
    />
  );
}
