import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/layout/inner-page";
import { buttonStyles } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page doesn't exist. Find your way back to Umoja Africa's programs, impact, and ways to get involved.",
  // A 404 must never be indexed, whatever URL produced it.
  robots: { index: false, follow: true },
};

/**
 * Custom 404. Lives at the app root so it renders inside the root
 * layout, which means the navbar and footer come along and the user
 * has a way out. Next's built-in fallback is an unstyled bare page
 * with no navigation, which on a site whose whole job is directing
 * people to donate or apply is a dead end.
 *
 * The links below cover the four things a lost visitor most plausibly
 * wanted, rather than dumping the full sitemap on them.
 */
export default function NotFound() {
  return (
    <InnerPage>
      <Section className="py-24 md:py-32">
        <div className="mx-auto max-w-prose text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-secondary-600">
            Error 404
          </p>
          <Heading level={1} align="center" className="mt-3">
            We couldn&rsquo;t find that page.
          </Heading>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 md:text-lg">
            The link may be out of date, or the page may have moved. Nothing
            you did caused this. Here are the places people usually mean to
            go.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              Back to home
            </Link>
            <Link
              href="/programs"
              className={buttonStyles({ variant: "outline", size: "md" })}
            >
              Our programs
            </Link>
          </div>

          <p className="mt-8 text-sm text-neutral-500">
            Looking to give?{" "}
            <Link
              href="/donate"
              className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-600"
            >
              Donate
            </Link>
            . Want to help?{" "}
            <Link
              href="/get-involved"
              className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-600"
            >
              Get involved
            </Link>
            .
          </p>
        </div>
      </Section>
    </InnerPage>
  );
}
