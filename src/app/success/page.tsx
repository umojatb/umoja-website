import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { InnerPage } from "@/components/layout/inner-page";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Thank you",
  description:
    "Your donation has been received. Thank you for supporting a scholar through Umoja.",
};

export default function SuccessPage() {
  return (
    <InnerPage>
      <Section className="py-24 md:py-32">
        <div className="mx-auto max-w-prose text-center">
          <span
            aria-hidden
            className="block text-5xl mb-6 select-none"
            role="presentation"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="mx-auto"
            >
              <circle cx="24" cy="24" r="24" fill="#fef4ed" />
              <path
                d="M14 25l7 7 13-14"
                stroke="#e8772e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Heading level={1} eyebrow="Thank you" align="center">
            Your gift went through.
          </Heading>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 md:text-lg">
            A receipt is on its way to your email. Every dollar enters the
            program directly, school fees, learning materials, clothing,
            pocket money, and the mentorship that sits behind each scholarship.
            You&apos;ll receive a yearly impact report on the scholars your gift
            helps support.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            One student at a time. That&apos;s how this works, and you just moved
            that number forward.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              Back to home
            </Link>
            <Link
              href="/impact"
              className={buttonStyles({ variant: "outline", size: "md" })}
            >
              Read our impact
            </Link>
          </div>
        </div>
      </Section>
    </InnerPage>
  );
}
