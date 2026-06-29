"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { getSearchIndex, searchEntries } from "@/lib/search";
import { cn } from "@/lib/utils";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Modal overlay that searches every page, navigation entry, program,
 * blog post, and annual report. Empty query shows curated top entries
 * (Donate, About, Programs, etc.) so users get something useful before
 * they type.
 */
export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  // getSearchIndex() returns a cached frozen array, no need for useMemo
  // to memoize on top of it.
  const results = useMemo(() => searchEntries(getSearchIndex(), query), [query]);

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

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;
  const noMatches = hasQuery && results.length === 0;

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
            Search the site
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
          placeholder="Search pages, programs, posts, reports…"
          aria-label="Search the site"
          aria-controls={`${titleId}-results`}
          className="mt-4 w-full rounded-lg border border-neutral-300 bg-background px-4 py-3 text-base text-neutral-900 outline-none transition-colors placeholder:text-neutral-500 focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20"
        />
        {!hasQuery && (
          <p className="mt-3 text-xs text-neutral-500">
            Suggested pages, type to search.
          </p>
        )}
        {noMatches ? (
          <p className="mt-6 text-sm text-neutral-600">
            No results match “{trimmed}”. Try a shorter query, or browse{" "}
            <Link
              href="/"
              onClick={handleClose}
              className="font-medium text-primary-700 underline"
            >
              the home page
            </Link>
            .
          </p>
        ) : (
          <ul
            id={`${titleId}-results`}
            className="mt-6 max-h-[60vh] divide-y divide-neutral-200 overflow-y-auto rounded-lg border border-neutral-200 bg-background"
          >
            {results.map((entry) => (
              <li key={`${entry.section}::${entry.href}::${entry.label}`}>
                <Link
                  href={entry.href}
                  onClick={handleClose}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-primary-50 focus-visible:bg-primary-50 focus-visible:outline-none"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-primary-900">
                      {entry.label}
                    </span>
                    <span className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary-700">
                      {entry.section}
                    </span>
                  </span>
                  {entry.description && (
                    <span className="line-clamp-1 text-xs text-neutral-600">
                      {entry.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
