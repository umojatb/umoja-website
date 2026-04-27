import Link from "next/link";
import { Container } from "@/components/ui/container";
import { legalNav, mainNav } from "@/lib/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-neutral-300">
      <Container className="py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-heading text-xl font-bold tracking-tight text-white"
            >
              Umoja Africa
            </Link>
            <p className="mt-2 max-w-xs text-sm text-neutral-400">
              Empowering communities across the continent through education,
              opportunity, and shared progress.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Explore
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-300 transition-colors hover:text-secondary-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Legal
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-300 transition-colors hover:text-secondary-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-6 border-t border-primary-800 pt-3 text-xs text-neutral-400">
          &copy; {year} Umoja Africa. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
