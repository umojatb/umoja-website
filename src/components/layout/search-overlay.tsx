"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { getAllPosts } from "@/lib/blog";
import { mainNav } from "@/lib/navigation";
import { getAllReports } from "@/lib/reports";
import { cn } from "@/lib/utils";

type SearchablePage = {
  readonly label: string;
  readonly href: string;
  readonly section: string;
};

const STATIC_PAGES: readonly SearchablePage[] = [
  { label: "Home", href: "/", section: "Site" },
  { label: "Donate", href: "/donate", section: "Site" },
];

function buildPageIndex(): readonly SearchablePage[] {
  const navPages: readonly SearchablePage[] = mainNav.map((item) => ({
    label: item.label,
    href: item.href,
    section: "Site",
  }));
  const blogPages: readonly SearchablePage[] = getAllPosts().map((post) => ({
    label: post.title,
    href: `/blog/${post.slug}`,
    section: "Blog",
  }));
  const reportPages: readonly SearchablePage[] = getAllReports().map(
    (report) => ({
      label: report.title,
      href: `/annual-reports#${report.slug}`,
      section: "Reports",
    }),
  );
  return [...STATIC_PAGES, ...navPages, ...blogPages, ...reportPages];
}

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Modal overlay that lists every published page on the site, with a
 * client-side filter input. Replaces a real search backend, when one
 * exists, swap the page list for fetched results.
 */
export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const allPages = useMemo(() => buildPageIndex(), []);
  const filtered = useMemo(() => {
    if (!query.trim()) return allPages;
    const q = query.toLowerCase();
    return allPages.filter(
      (page) =>
        page.label.toLowerCase().includes(q) ||
        page.section.toLowerCase().includes(q),
    );
  }, [query, allPages]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!isOpen}
      inert={!isOpen || undefined}
      className={cn(
        "fixed inset-0 z-[60] bg-background/95 backdrop-blur transition-opacity duration-200 ease-out-strong motion-reduce:transition-none",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={handleClose}
    >
      <div
        className="mx-auto h-full max-w-3xl px-6 py-12 md:py-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id={titleId}
            className="font-heading text-lg font-semibold text-primary-900"
          >
            Browse the site
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-primary-700 transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-primary-50 active:scale-[0.92] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-3 w-3"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter pages by name…"
          aria-label="Filter pages"
          className="mt-4 w-full rounded-lg border border-neutral-300 bg-background px-4 py-3 text-base text-neutral-900 outline-none transition-colors placeholder:text-neutral-500 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20"
        />
        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-600">
            No pages match “{query}”.
          </p>
        ) : (
          <ul className="mt-6 max-h-[60vh] divide-y divide-neutral-200 overflow-y-auto rounded-lg border border-neutral-200 bg-background">
            {filtered.map((page) => (
              <li key={`${page.section}::${page.href}::${page.label}`}>
                <Link
                  href={page.href}
                  onClick={handleClose}
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-primary-50"
                >
                  <span className="text-sm font-medium text-primary-900">
                    {page.label}
                  </span>
                  <span className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary-700">
                    {page.section}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
