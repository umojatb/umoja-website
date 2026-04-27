"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MegaMenuPanel } from "@/components/layout/mega-menu-panel";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  donateHref,
  getTopBarItems,
  type NavItem,
  type NavPanel,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function panelDomId(label: string): string {
  return `mega-panel-${label.toLowerCase().replace(/\s+/g, "-")}`;
}

type ItemWithPanel = NavItem & { panel: NavPanel };

function hasPanel(item: NavItem): item is ItemWithPanel {
  return Boolean(item.panel);
}

export function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const topItems = getTopBarItems();

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpenPanel(null);
    setIsMobileOpen(false);
    setMobileExpanded(null);
    setIsSearchOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openPanel) setOpenPanel(null);
      if (isMobileOpen) setIsMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openPanel, isMobileOpen]);

  useEffect(() => {
    if (!openPanel && !isMobileOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setOpenPanel(null);
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [openPanel, isMobileOpen]);

  /* Lock body scroll when a modal-style overlay is open (mobile drawer or
     search). Mega panels don't lock, they sit inline like a hover menu. */
  useEffect(() => {
    if (!isMobileOpen && !isSearchOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileOpen, isSearchOpen]);

  const togglePanel = (label: string) => {
    setOpenPanel((current) => (current === label ? null : label));
  };

  const toggleMobileSection = (label: string) => {
    setMobileExpanded((current) => (current === label ? null : label));
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-neutral-200 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
      >
        <Container
          as="nav"
          aria-label="Primary"
          className="flex h-9 items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight text-primary-700 transition-colors hover:text-primary-600"
          >
            Umoja Africa
          </Link>

          <ul className="hidden items-center gap-5 md:flex">
            {topItems.map((item) => (
              <li key={item.label}>
                {hasPanel(item) ? (
                  <button
                    type="button"
                    onClick={() => togglePanel(item.label)}
                    aria-expanded={openPanel === item.label}
                    aria-haspopup="true"
                    aria-controls={panelDomId(item.label)}
                    aria-current={
                      isItemActive(pathname, item.href) ? "page" : undefined
                    }
                    className={cn(
                      "relative inline-flex items-center gap-1 text-sm font-medium",
                      "transition-[transform,color] duration-150 ease-out-strong",
                      "active:scale-[0.97] motion-reduce:active:scale-100",
                      "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[6px] after:h-[2px] after:rounded-full after:bg-secondary-500 after:opacity-0 after:transition-opacity after:duration-200 after:ease-out-strong",
                      openPanel === item.label ||
                        isItemActive(pathname, item.href)
                        ? "text-primary-700 after:opacity-100"
                        : "text-neutral-600 hover:text-primary-700",
                    )}
                  >
                    {item.label}
                    <ChevronIcon open={openPanel === item.label} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={
                      isItemActive(pathname, item.href) ? "page" : undefined
                    }
                    className={cn(
                      "relative text-sm font-medium",
                      "transition-colors duration-150 ease-out-strong",
                      "after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[6px] after:h-[2px] after:rounded-full after:bg-secondary-500 after:opacity-0 after:transition-opacity after:duration-200 after:ease-out-strong",
                      isItemActive(pathname, item.href)
                        ? "text-primary-700 after:opacity-100"
                        : "text-neutral-600 hover:text-primary-700",
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search the site"
              className="hidden h-6 w-6 items-center justify-center rounded-full text-primary-700 transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-primary-50 active:scale-[0.92] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 md:inline-flex"
            >
              <SearchIcon />
            </button>
            <Link
              href={donateHref}
              className={buttonStyles({
                variant: "secondary",
                size: "md",
                className: "h-6 md:h-5",
              })}
            >
              Donate
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-primary-700 transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-primary-50 active:scale-[0.92] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 md:hidden"
            >
              {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </Container>

        {topItems.filter(hasPanel).map((item) => (
          <MegaMenuPanel
            key={item.label}
            item={item}
            isOpen={openPanel === item.label}
            panelId={panelDomId(item.label)}
            onLinkClick={() => setOpenPanel(null)}
          />
        ))}

        <div
          id="mobile-nav"
          aria-hidden={!isMobileOpen}
          inert={!isMobileOpen || undefined}
          className={cn(
            "absolute inset-x-0 top-full max-h-[calc(100vh-3rem)] overflow-y-auto border-t border-neutral-200 bg-background/95 backdrop-blur transition-[transform,opacity] duration-200 ease-out-strong motion-reduce:transition-none md:hidden",
            isMobileOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0",
          )}
        >
          <Container className="py-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex w-full items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-600 transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-neutral-100 active:scale-[0.99] motion-reduce:active:scale-100"
            >
              <SearchIcon />
              <span>Search the site</span>
            </button>
            <ul className="mt-3 flex flex-col gap-1">
              {topItems.map((item) => (
                <MobileNavEntry
                  key={item.label}
                  item={item}
                  active={isItemActive(pathname, item.href)}
                  expanded={mobileExpanded === item.label}
                  onToggle={() => toggleMobileSection(item.label)}
                  onLinkClick={() => setIsMobileOpen(false)}
                />
              ))}
            </ul>
          </Container>
        </div>
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

type MobileNavEntryProps = {
  item: NavItem;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
};

function MobileNavEntry({
  item,
  active,
  expanded,
  onToggle,
  onLinkClick,
}: MobileNavEntryProps) {
  if (!hasPanel(item)) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onLinkClick}
          aria-current={active ? "page" : undefined}
          className={cn(
            "block rounded-md px-2 py-2 text-base font-medium transition-colors",
            active
              ? "bg-primary-50 text-primary-700"
              : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-700",
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  const { panel } = item;
  const sectionId = `mobile-section-${item.label
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={sectionId}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-2 py-2 text-base font-medium transition-colors",
          active
            ? "bg-primary-50 text-primary-700"
            : "text-neutral-700 hover:bg-neutral-100 hover:text-primary-700",
        )}
      >
        <span>{item.label}</span>
        <ChevronIcon open={expanded} />
      </button>
      <div
        id={sectionId}
        hidden={!expanded}
        className="space-y-3 px-2 pb-3 pt-1"
      >
        <p className="text-xs text-neutral-600">{panel.description}</p>
        <ul className="space-y-1">
          {[...panel.primaryLinks, ...panel.secondaryLinks].map((link) => (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                onClick={onLinkClick}
                className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={panel.ctaHref}
          onClick={onLinkClick}
          className="inline-flex items-center gap-1 px-2 text-xs font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-900"
        >
          {panel.ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </li>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "h-2 w-2 transition-transform duration-200 motion-reduce:transition-none",
        open && "rotate-180",
      )}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-3 w-3"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
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
  );
}
