import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { InnerPage } from "@/components/layout/inner-page";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to the Umoja team, questions, partnerships, donations, mentorship, or anything else. The two founders and the small core team read every message.",
};

type ContactOption = {
  readonly title: string;
  readonly body: string;
};

const CONTACT_OPTIONS: readonly ContactOption[] = [
  {
    title: "General inquiries",
    body: "Questions about the program, the scholars we currently support, how to apply, or anything you're curious about. Use the form below, we'll see it.",
  },
  {
    title: "Partnerships",
    body: "Schools, community leaders, small businesses, and corporate partners ready for a long-term collaboration. Pick \"Partnership\" as the reason, or write to us directly.",
  },
];

export default function ContactPage() {
  return (
    <InnerPage>
      <ContactHero />
      <ContactOptionsSection />
      <ContactFormSection />
      <ClosingCTASection />
    </InnerPage>
  );
}

function ContactHero() {
  return (
    <PageHero
      variant="color"
      eyebrow="Contact"
      title="Get in touch"
      description="Whether it's a question, a partnership idea, or a donation that doesn't fit the standard form, we'd love to hear it."
    />
  );
}

function ContactOptionsSection() {
  return (
    <Section variant="muted">
      <Heading
        level={2}
        eyebrow="Reach out"
        description="Three ways to start a conversation. All three land in the same inbox, pick the one that fits."
      >
        How to reach us
      </Heading>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex h-full flex-col p-5 md:p-6">
          <h3 className="text-lg font-semibold text-primary-900">
            Email us
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            The fastest way to reach the small core team. No form, no fields.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-auto pt-4 text-base font-semibold text-accent-500 underline underline-offset-2 hover:text-accent-600 transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </Card>
        {CONTACT_OPTIONS.map((option) => (
          <Card key={option.title} className="p-5 md:p-6">
            <h3 className="text-lg font-semibold text-primary-900">
              {option.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {option.body}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ContactFormSection() {
  return (
    <Section>
      <div className="mx-auto max-w-prose">
        <Heading
          level={2}
          eyebrow="Send a message"
          description="We read every message that comes in. Replies aren't always fast, but they're real, written by the small team that runs the program."
        >
          Write to us
        </Heading>
        <Card className="mt-8 p-5 md:p-8">
          <ContactForm />
        </Card>
      </div>
    </Section>
  );
}

function ClosingCTASection() {
  return (
    <CTASection
      heading="We're here. Write to us."
      description="Email or use the form above, both land in the same inbox, both get read, both get a real reply."
      primary={{ label: "Email us", href: `mailto:${CONTACT_EMAIL}` }}
      secondary={{ label: "Read our impact", href: "/impact" }}
    />
  );
}
