"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container as="nav" aria-label="Primary" className="flex h-9 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-primary-700 transition-colors hover:text-primary-600"
        >
          Umoja Africa
        </Link>

        <ul className="hidden items-center gap-3 md:flex">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} active={isItemActive(pathname, item.href)} />
          ))}
        </ul>

        <Link
          href={donateHref}
          className={buttonStyles({ variant: "secondary", size: "md" })}
        >
          Donate
        </Link>
      </Container>
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
