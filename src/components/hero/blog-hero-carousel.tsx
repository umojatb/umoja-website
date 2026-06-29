"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { buttonStyles } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
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
  /** Slide source, pass `getFeaturedPosts()` from the page. */
  posts: readonly Post[];
  /** Autoplay interval. Default 8s, long enough to read title + excerpt. */
  intervalMs?: number;
};

/**
 * Editorial hero carousel. Two-zone layout:
 *
 *   ┌──────────────────────────────────────┐
 *   │ TEXT (eyebrow + title + excerpt)     │  ← top zone, vertically centered,
 *   │                                      │     line-clamped (3/2) for layout
 *   │                                      │     stability across slides
 *   ├──────────────────────────────────────┤
 *   │ CTAs (Donate + Read)   • • •  ⏸     │  ← controls bar, absolute bottom,
 *   └──────────────────────────────────────┘     fixed position regardless of
 *                                                text length
 *
 * Autoplay pauses on the manual button or when the OS reports
 * `prefers-reduced-motion: reduce` (subscription via useSyncExternalStore).
 */
export function BlogHeroCarousel({
  posts,
  intervalMs = 8000,
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
            "absolute inset-0 z-0 transition-opacity duration-700 motion-reduce:transition-none",
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

      {/* Brand-navy gradient overlay, strong reading zone left, image breathes right.
         Mobile bumps to /95 opacity since text sits closer to centre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-primary-900/95 via-primary-900/60 to-transparent md:from-primary-900/90"
      />

      {/*
        Content layer uses normal flow (relative + flex-col + justify-between)
        instead of two absolute zones. This prevents the controls bar from
        overlapping the description on mobile when buttons wrap to multiple
        lines. Flex spacing adapts to content height automatically.
      */}
      <div className="relative z-20 flex h-full flex-col justify-between gap-6 px-6 py-6 md:px-16 md:py-8">
        {/* Text block, vertically centered in its allotted flex space. */}
        <div className="flex flex-1 items-center">
          <div className="max-w-xl md:max-w-2xl">
            <Eyebrow size="xs" tone="inverted">
              {active.category}
            </Eyebrow>
            {/*
              Mobile uses text-2xl (24px) so 11-character words like
              "SCHOLARSHIP" fit on a single line at typical phone widths.
              text-3xl scales up at sm: (640px) and text-5xl at md:.
              `tracking-[0.02em]` is positive (loose) tracking to
              override the global negative tracking — uppercase forms
              collide under tight tracking.
              `break-words` gives the browser permission to break inside
              very long words at extreme narrow widths (320px) instead
              of overflowing.
            */}
            <h1 className="mt-3 line-clamp-3 break-words font-heading text-2xl font-extrabold uppercase leading-tight tracking-[0.02em] text-white sm:text-3xl md:text-5xl">
              {active.title}
            </h1>
            <p className="mt-3 line-clamp-2 text-sm text-white/80 sm:mt-4 sm:text-base md:text-lg">
              {active.excerpt}
            </p>
          </div>
        </div>

        {/* Controls bar, end of flex column. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
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

          {posts.length > 1 && (
            <div className="flex items-center gap-3">
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
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/60",
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={
                  isPaused
                    ? "Resume carousel autoplay"
                    : "Pause carousel autoplay"
                }
                aria-pressed={isPaused}
                disabled={autoplayDisabled}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPaused || autoplayDisabled ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
