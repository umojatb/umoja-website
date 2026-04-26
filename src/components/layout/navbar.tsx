"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNav, donateHref, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
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

        <ul className="hidden items-center gap-3 md:flex">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isItemActive(pathname, item.href)}
            />
          ))}
        </ul>

        <div className="flex items-center gap-1">
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
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 md:hidden"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        aria-hidden={!isOpen}
        className={cn(
          "absolute inset-x-0 top-full border-t border-neutral-200 bg-background/95 backdrop-blur transition-[transform,opacity] duration-200 ease-out md:hidden",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <Container className="py-3">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                active={isItemActive(pathname, item.href)}
              />
            ))}
          </ul>
        </Container>
      </div>
    </header>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "text-sm font-medium transition-colors",
          active
            ? "text-primary-700"
            : "text-neutral-600 hover:text-primary-700",
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}

function MobileNavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
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
