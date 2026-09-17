"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { TeamMember } from "@/lib/team-data";
import { useScrollLock } from "@/lib/use-scroll-lock";

type Props = {
  member: TeamMember;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Right-side profile panel for a single team member.
 *
 * Opened by clicking a card in the team directory. Every content block
 * below the identity header is optional, so members with a short profile
 * and members with a long one both render cleanly without empty headings.
 */
export function TeamProfileDrawer({ member, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  // Keep the ref pointing at the latest `onClose` without re-binding
  // the document-level Escape listener on every render. Assigning
  // during render instead would be a render side effect, which breaks
  // under StrictMode's double-render and concurrent rendering, and is
  // what the react-hooks/refs rule was flagging.
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Escape key to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Initial focus + tab trap
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    getFocusable()[0]?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const els = getFocusable();
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    drawer.addEventListener("keydown", handleTab);
    return () => drawer.removeEventListener("keydown", handleTab);
  }, []);

  // Lock body scroll. See useScrollLock for why this is not
  // `body { overflow: hidden }`, which jumps the page to the top. On
  // the About page that means the drawer yanks the reader away from
  // the team member they just clicked.
  useScrollLock(true);

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel. `w-full` with a max width means it is a near-full-width
       * sheet on phones and a 460px side panel from small tablets up. */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}, profile`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col bg-white shadow-2xl animate-slide-in-right"
      >
        {/* Identity header. The close button is absolutely placed rather than
         * a flex sibling so it does not squeeze long names into a narrow
         * column, while staying first in the DOM so the focus trap lands
         * on it when the drawer opens. */}
        <div className="relative border-b border-neutral-200 p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Stacked on phones, where the panel is full-bleed and a side-by-side
           * portrait would squeeze long names into a four-line column. */}
          <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:gap-4">
            <PortraitThumb member={member} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-medium leading-tight text-primary-900">
                {member.name}
              </p>
              <p className="mt-1.5 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-accent-500">
                {member.role}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {member.tagline && (
            <p className="text-sm font-medium italic leading-relaxed text-primary-900">
              {member.tagline}
            </p>
          )}

          {member.bio && member.bio.length > 0 && (
            <div className="space-y-4">
              {member.bio.map((para) => (
                <p key={para} className="text-sm leading-relaxed text-neutral-600">
                  {para}
                </p>
              ))}
            </div>
          )}

          {member.mission && (
            <blockquote className="border-l-2 border-accent-500 pl-4">
              <p className="font-display text-sm italic leading-relaxed text-primary-900">
                {member.mission}
              </p>
            </blockquote>
          )}

          {member.achievements && member.achievements.length > 0 && (
            <section>
              <SectionLabel>Highlights</SectionLabel>
              <ul className="mt-3 space-y-2">
                {member.achievements.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 8.5l3.5 3.5 7-8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm leading-relaxed text-neutral-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {member.timeline && member.timeline.length > 0 && (
            <section>
              <SectionLabel>Journey</SectionLabel>
              <ol className="mt-3 space-y-3 border-l border-neutral-200 pl-4">
                {member.timeline.map((entry) => (
                  <li key={entry.year} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[1.3125rem] top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500"
                    />
                    <p className="font-heading text-xs font-semibold tracking-[0.1em] text-primary-900">
                      {entry.year}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      {entry.text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* Footer: link pills if available */}
        {member.links && member.links.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-neutral-200 p-6">
            {member.links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-primary-700 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              >
                {label}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 2H2a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1V6M6 1h3m0 0v3M9 1 4.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
      {children}
    </h3>
  );
}

/**
 * Small rectangular portrait in the drawer header, matching the card's
 * photo-or-monogram treatment so the two views read as the same person.
 */
function PortraitThumb({ member }: { member: TeamMember }) {
  return (
    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
      {member.photo ? (
        <Image
          src={member.photo.src}
          alt={member.photo.alt}
          fill
          sizes="56px"
          style={{ objectPosition: member.photo.position ?? "50% 50%" }}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary-700 to-primary-900 font-display text-lg font-medium text-white/85"
        >
          {member.initials}
        </div>
      )}
    </div>
  );
}
