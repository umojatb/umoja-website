"use client";

import { useRef, useState } from "react";
import { TEAM, type TeamMember } from "@/lib/team-data";
import { QuickLookDrawer } from "@/components/team/quick-look-drawer";
import { cn } from "@/lib/utils";

const STAGGER = [
  "animate-fade-up",
  "animate-fade-up-delay-1",
  "animate-fade-up-delay-2",
  "animate-fade-up-delay-3",
];

export function TeamDirectory() {
  const [openMember, setOpenMember] = useState<TeamMember | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  function openDrawer(member: TeamMember, trigger: HTMLElement) {
    lastFocusRef.current = trigger;
    setOpenMember(member);
  }

  function closeDrawer() {
    setOpenMember(null);
    requestAnimationFrame(() => lastFocusRef.current?.focus());
  }

  return (
    <>
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
        }}
      >
        {TEAM.map((member, index) => (
          <TeamCard
            key={member.slug}
            member={member}
            staggerClass={STAGGER[index] ?? "animate-fade-up"}
            onQuickLook={openDrawer}
          />
        ))}
      </div>

      {openMember && (
        <QuickLookDrawer member={openMember} onClose={closeDrawer} />
      )}
    </>
  );
}

function TeamCard({
  member,
  staggerClass,
  onQuickLook,
}: {
  member: TeamMember;
  staggerClass: string;
  onQuickLook: (member: TeamMember, trigger: HTMLElement) => void;
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-[6px] hover:shadow-xl",
        staggerClass,
      )}
    >
      {/* Avatar */}
      <div
        role="img"
        aria-label={`Portrait of ${member.name}`}
        className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary-700 to-primary-900 font-heading text-2xl font-semibold text-white"
      >
        {member.initials}
      </div>

      {/* Name + role */}
      <h3 className="mt-5 font-display text-xl font-medium leading-tight text-primary-900">
        {member.name}
      </h3>
      <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-accent-500">
        {member.role}
      </p>

      {/* Tagline */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 line-clamp-3">
        {member.tagline}
      </p>

      {/* Quick look — sole action */}
      <div className="mt-5 border-t border-neutral-100 pt-4">
        <button
          type="button"
          onClick={(e) => onQuickLook(member, e.currentTarget)}
          className="rounded-full bg-primary-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
        >
          Quick look
        </button>
      </div>
    </article>
  );
}
