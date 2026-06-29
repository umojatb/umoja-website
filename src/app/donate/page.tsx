import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { InnerPage } from "@/components/layout/inner-page";
import { Section } from "@/components/ui/section";
import { DonationForm } from "./donation-form";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support a scholar's education. Choose one-time or monthly, pick an amount, and read where every dollar goes.",
};

type TrustLink = {
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly href: string;
};

const TRUST_LINKS: readonly TrustLink[] = [
  {
    title: "Where the money goes",
    body: "Our target allocation, the categories we spend in, and what we publish each year.",
    cta: "See our impact",
    href: "/impact",
  },
  {
    title: "Annual audited reports",
    body: "Independent annual audit, scholar outcomes, and the partner directory, published yearly.",
    cta: "Read our reports",
    href: "/annual-reports",
  },
  {
    title: "Talk to a person",
    body: "Questions about giving, allocation, or wire transfers go to the small core team. We answer.",
    cta: "Contact us",
    href: "/contact",
  },
];

type ImpactTier = {
  readonly amount: string;
  readonly body: string;
};

const IMPACT_TIERS: readonly ImpactTier[] = [
  {
    amount: "$25",
    body: "Approximately one term of books, exam fees, and learning materials for a scholar in active program.",
  },
  {
    amount: "$50",
    body: "Approximately one month of school fees and transport for a scholar, the most common monthly gift.",
  },
  {
    amount: "$100",
    body: "Approximately one full term of fees, transport, and basic living for a scholar.",
  },
];

export default function DonatePage() {
  return (
    <InnerPage>
      <DonateHero />
      <DonationFormSection />
      <TrustSignalsSection />
      <ImpactMappingSection />
      <OtherWaysToGiveCTA />
    </InnerPage>
  );
}

function DonateHero() {
  return (
    <Section as="header" className="py-16 md:py-24">
      <Heading
        level={1}
        align="center"
        eyebrow="Donate"
        description="One scholar at a time, one term at a time. Every dollar funds the program you read about, and every donor gets a yearly impact report."
      >
        Support a scholar&apos;s future
      </Heading>
    </Section>
  );
}

function DonationFormSection() {
  return (
    <Section variant="muted" className="py-10 md:py-14">
      <div className="mx-auto max-w-prose">
        <Card className="p-5 md:p-8">
          <DonationForm />
        </Card>
      </div>
    </Section>
  );
}

function TrustSignalsSection() {
  return (
    <Section>
      <Heading
        level={2}
        eyebrow="Why this is safe to fund"
        description="Three places to check the work before you give, and one person to talk to if anything is unclear."
      >
        Trust signals
      </Heading>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          >
            <Card className="h-full p-5 md:p-6 transition-shadow group-hover:shadow-md">
              <h3 className="text-lg font-semibold text-primary-900">
                {link.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {link.body}
              </p>
              <p className="mt-4 text-sm font-semibold text-accent-500 group-hover:text-accent-600 transition-colors">
                {link.cta} →
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function ImpactMappingSection() {
  return (
    <Section variant="muted">
      <Heading
        level={2}
        eyebrow="What your donation does"
        description="Approximate, honest framing. Exact costs vary by country, school, and term, full breakdowns publish in our annual report."
      >
        Where each gift lands
      </Heading>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {IMPACT_TIERS.map((tier) => (
          <Card key={tier.amount} className="p-5 md:p-6">
            <p className="font-display text-4xl font-bold text-accent-500">
              {tier.amount}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {tier.body}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function OtherWaysToGiveCTA() {
  return (
    <CTASection
      heading="Other ways to give"
      description="Major gifts, corporate contributions, employer matching, and stock or wire transfers go through a different channel. Email us and we'll walk you through it."
      primary={{ label: "Talk to a person", href: "/contact" }}
      secondary={{ label: "Read our reports", href: "/annual-reports" }}
    />
  );
}
