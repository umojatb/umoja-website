"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { buttonStyles } from "@/components/ui/button";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void): () => void {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

type BlogHeroCarouselProps = {
  /** Slide source — pass `getFeaturedPosts()` from the page. */
  posts: readonly Post[];
  /** Autoplay interval. Default 6s. */
  intervalMs?: number;
};

/**
 * Editorial hero carousel. Cross-fades blog cover images and updates the
 * overlaid title / excerpt / CTA per active slide. Mounts inside the framed
 * hero card on the homepage — the card supplies the rounded clip + min-height;
 * this component fills it via `absolute inset-0`.
 *
 * Autoplay pauses when the user clicks the pause button or when the OS
 * reports `prefers-reduced-motion: reduce` — in which case the pause button
 * is disabled and shows the play glyph.
 */
export function BlogHeroCarousel({
  posts,
  intervalMs = 6000,
}: BlogHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    if (isPaused || reducedMotion || posts.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % posts.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [isPaused, reducedMotion, posts.length, intervalMs]);

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % posts.length) + posts.length) % posts.length;
      setActiveIndex(next);
    },
    [posts.length],
  );

  if (posts.length === 0) return null;

  const active = posts[activeIndex];
  const autoplayDisabled = reducedMotion;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      className="absolute inset-0"
    >
      {posts.map((post, i) => (
        <div
          key={post.slug}
          aria-hidden={i !== activeIndex}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === activeIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1280px) 1280px, 92vw"
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
      />

      <div className="absolute inset-0 z-10 flex items-center">
        <div
          key={active.slug}
          className="max-w-xl px-6 md:max-w-2xl md:px-16 lg:max-w-3xl"
        >
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400">
            {active.category}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold uppercase leading-tight text-white md:text-6xl">
            {active.title}
          </h1>
          <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
            {active.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
            <Link
              href="/donate"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              Donate
            </Link>
            <Link
              href={`/blog/${active.slug}`}
              className={buttonStyles({
                variant: "outline-inverted",
                size: "lg",
              })}
            >
              Read article
            </Link>
          </div>
        </div>
      </div>

      {posts.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3 md:bottom-6 md:right-6">
          <div
            role="group"
            aria-label="Slide navigation"
            className="flex gap-1.5"
          >
            {posts.map((post, i) => (
              <button
                key={post.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${post.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  i === activeIndex
                    ? "bg-secondary-500"
                    : "bg-white/40 hover:bg-white/60",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={
              isPaused ? "Resume carousel autoplay" : "Pause carousel autoplay"
            }
            aria-pressed={isPaused}
            disabled={autoplayDisabled}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-black/55 text-white transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPaused || autoplayDisabled ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
