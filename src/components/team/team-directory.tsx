"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TeamProfileDrawer } from "@/components/team/profile-drawer";
import { TEAM, hasProfile, type TeamMember } from "@/lib/team-data";
import { cn } from "@/lib/utils";

/* Rolling entrance stagger. Indexes past the end wrap, so the grid keeps
 * a sensible cascade no matter how many members the data grows to. */
const STAGGER = [
  "animate-fade-up",
  "animate-fade-up-delay-1",
  "animate-fade-up-delay-2",
  "animate-fade-up-delay-3",
  "animate-fade-up-delay-4",
];

/* Flex-wrap rather than `grid-cols-*` so a partial final row centres itself.
 * With a 3-up desktop grid and 5 members that turns an orphaned, left-hugging
 * pair into a balanced, centred 3 + 2.
 *
 * Each width is "1/n of the row, minus that card's share of the gutters".
 * The project's spacing scale is 8px based (`--spacing: 0.5rem`), so the
 * `gap-6` on the <ul> is 3rem, and a card's share is 1.5rem at 2-up and
 * 2rem at 3-up. The extra ~0.05rem is slack: at an exact fit, sub-pixel
 * rounding is enough to wrap the last column. Keep in sync with `gap-6`. */
const CARD_WIDTH =
  "w-full sm:w-[calc(50%-1.55rem)] lg:w-[calc(33.333%-2.05rem)]";

export function TeamDirectory() {
  const [openMember, setOpenMember] = useState<TeamMember | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  function openProfile(member: TeamMember, trigger: HTMLElement) {
    lastFocusRef.current = trigger;
    setOpenMember(member);
  }

  function closeDrawer() {
    setOpenMember(null);
    // Return the caret to the card that opened the drawer, so keyboard
    // users land back exactly where they were in the grid.
    requestAnimationFrame(() => lastFocusRef.current?.focus());
  }

  return (
    <>
      <ul className="flex list-none flex-wrap justify-center gap-6 p-0">
        {TEAM.map((member, index) => (
          <li
            key={member.slug}
            className={cn(CARD_WIDTH, STAGGER[index % STAGGER.length])}
          >
            <TeamCard member={member} onOpen={openProfile} />
          </li>
        ))}
      </ul>

      {openMember && (
        <TeamProfileDrawer member={openMember} onClose={closeDrawer} />
      )}
    </>
  );
}

function TeamCard({
  member,
  onOpen,
}: {
  member: TeamMember;
  onOpen: (member: TeamMember, trigger: HTMLElement) => void;
}) {
  const interactive = hasProfile(member);
  /* Members who lead with a personal statement show it; those whose profile
   * is a role description instead fall back to its opening line, so every
   * published card carries a sentence rather than an empty block. */
  const summary = member.tagline ?? member.bio?.[0];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "motion-reduce:transition-none",
        interactive
          ? [
              "border border-neutral-200 shadow-sm",
              "hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl",
              "motion-reduce:hover:translate-y-0",
              // Card-level emphasis when the inner trigger takes keyboard focus.
              "has-[:focus-visible]:border-primary-700 has-[:focus-visible]:shadow-xl",
            ]
          : "border border-dashed border-neutral-300 bg-neutral-50/60",
      )}
    >
      <PortraitFrame member={member} interactive={interactive} />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-medium leading-tight text-primary-900">
          {interactive ? (
            <button
              type="button"
              onClick={(e) => onOpen(member, e.currentTarget)}
              /* `after:absolute after:inset-0` stretches this button across
               * the whole card, so the entire card is the click target while
               * the accessible name stays the person's name. */
              className={cn(
                "cursor-pointer text-left after:absolute after:inset-0 after:rounded-2xl after:content-['']",
                "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700",
              )}
            >
              {member.name}
              <span className="sr-only">, {member.role}. Read full profile.</span>
            </button>
          ) : (
            <span className="text-neutral-500">{member.name}</span>
          )}
        </h3>

        <p
          className={cn(
            "mt-1.5 font-heading text-xs font-semibold uppercase tracking-[0.15em]",
            interactive ? "text-accent-500" : "text-neutral-400",
          )}
        >
          {member.role}
        </p>

        {/* Always present so every card's footer line sits at the same height
         * when the row stretches, whether or not there is copy to show. */}
        <div className="mt-3 flex-1">
          {summary ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">
              {summary}
            </p>
          ) : interactive ? null : (
            <p className="text-sm leading-relaxed text-neutral-500">
              Full profile coming soon.
            </p>
          )}
        </div>

        {interactive && (
          /* Affordance only. The button above already covers the card, so
           * this stays out of the tab order and out of the a11y tree. */
          <p
            aria-hidden="true"
            className="mt-4 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 transition-colors duration-300 group-hover:text-primary-700 motion-reduce:transition-none"
          >
            Read profile
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Fixed 4:5 portrait frame. A consistent aspect ratio means differently
 * sized source photos cannot disturb the grid, and `object-cover` plus an
 * optional `object-position` crops rather than distorts them.
 *
 * With no photo supplied the frame falls back to a monogram panel that
 * fills the same rectangle, keeping the card's proportions identical
 * whether or not a portrait exists.
 */
function PortraitFrame({
  member,
  interactive,
}: {
  member: TeamMember;
  interactive: boolean;
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
      {member.photo ? (
        <Image
          src={member.photo.src}
          alt={member.photo.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          style={{ objectPosition: member.photo.position ?? "50% 50%" }}
          className={cn(
            "object-cover transition-transform duration-500 ease-out motion-reduce:transition-none",
            interactive &&
              "group-hover:scale-[1.04] motion-reduce:group-hover:scale-100",
          )}
        />
      ) : (
        <Monogram member={member} interactive={interactive} />
      )}
    </div>
  );
}

/**
 * Photo-absent fallback. Decorative: `aria-hidden` because the name and
 * role sit directly beneath it as real text, so announcing the initials
 * again would only add noise.
 */
function Monogram({
  member,
  interactive,
}: {
  member: TeamMember;
  interactive: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 grid place-items-center",
        interactive
          ? "bg-gradient-to-br from-primary-700 to-primary-900"
          : "bg-neutral-100",
      )}
    >
      {member.initials ? (
        <span className="font-display text-5xl font-medium tracking-wide text-white/85">
          {member.initials}
        </span>
      ) : (
        /* No confirmed name yet, so no monogram to draw. A quiet rule keeps
         * the frame deliberate rather than looking like a failed image. */
        <span className="h-px w-10 bg-neutral-300" />
      )}
    </div>
  );
}
