import Image from "next/image";
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
            {/* White/mono logo variant on dark navy background */}
            <Link
              href="/"
              aria-label="Umoja Africa — home"
              className="inline-flex items-center gap-1 transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src="/images/logo/logo-white.png"
                alt=""
                aria-hidden="true"
                width={1536}
                height={1024}
                className="h-6 w-auto shrink-0"
              />
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Umoja Africa
              </span>
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
                    className="link-underline text-neutral-300 transition-colors hover:text-secondary-400"
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
                    className="link-underline text-neutral-300 transition-colors hover:text-secondary-400"
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
