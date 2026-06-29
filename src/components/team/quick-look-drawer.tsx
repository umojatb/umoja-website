"use client";

import { useEffect, useRef } from "react";
import type { TeamMember } from "@/lib/team-data";

type Props = {
  member: TeamMember;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function QuickLookDrawer({ member, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name} — quick look`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-white shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-neutral-200 p-6">
          <div
            role="img"
            aria-label={`Portrait of ${member.name}`}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-700 to-primary-900 font-heading text-lg font-semibold text-white"
          >
            {member.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold leading-tight text-primary-900">
              {member.name}
            </p>
            <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-accent-500">
              {member.role}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick look"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
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
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Tagline */}
          <p className="text-sm font-medium italic leading-relaxed text-primary-900">
            {member.tagline}
          </p>

          {/* Bio */}
          <div className="space-y-4">
            {member.bio.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-neutral-600">
                {para}
              </p>
            ))}
          </div>

          {/* Mission quote */}
          <blockquote className="border-l-2 border-accent-500 pl-4">
            <p className="font-display text-sm italic leading-relaxed text-primary-900">
              {member.mission}
            </p>
          </blockquote>

          {/* Highlights */}
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
              Highlights
            </p>
            <ul className="mt-3 space-y-2" aria-label="Key achievements">
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
          </div>
        </div>

        {/* Footer: link pills if available */}
        {member.links.length > 0 && (
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
