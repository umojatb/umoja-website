import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/layout/cta-section";
import { Heading } from "@/components/ui/heading";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { CONTACT_EMAIL } from "@/lib/contact";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to the Umoja Africa team, questions, partnerships, donations, or anything else. Real people read every message.",
};

type ContactOption = {
  readonly title: string;
  readonly body: string;
};

const CONTACT_OPTIONS: readonly ContactOption[] = [
  {
    title: "General inquiries",
    body: "Questions about the program, our scholars, how to apply, or anything else you’re curious about. Use the form below, we’ll see it.",
  },
  {
    title: "Partnerships",
    body: "Schools, employers, and institutions ready for a long-term collaboration. Pick “Partnership” as the reason, or write to us directly.",
  },
];

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactOptionsSection />
      <ContactFormSection />
      <ClosingCTASection />
    </>
  );
}

function ContactHero() {
  return (
    <PageHero
      variant="color"
      eyebrow="Contact"
      title="Get in touch"
      description="Whether it’s a question, a partnership idea, or a donation that doesn’t fit the standard form, we’d love to hear it."
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
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex h-full flex-col">
          <h3 className="font-heading text-lg font-semibold text-primary-900">
            Email us
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            The fastest way to reach the small core team. No form, no fields.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-auto pt-3 font-heading text-base font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-600"
          >
            {CONTACT_EMAIL}
          </a>
        </Card>
        {CONTACT_OPTIONS.map((option) => (
          <Card key={option.title}>
            <h3 className="font-heading text-lg font-semibold text-primary-900">
              {option.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">{option.body}</p>
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
          description="We read every message that comes in. Replies aren’t always fast, but they’re real, written by the small team that runs the program."
        >
          Write to us
        </Heading>
        <Card className="mt-6 p-5 md:p-6">
          <ContactForm />
        </Card>
      </div>
    </Section>
  );
}

function ClosingCTASection() {
  return (
    <CTASection
      heading="We’re here. Write to us."
      description="Email or use the form above, both land in the same inbox, both get read, both get a real reply."
      primary={{ label: "Email us", href: `mailto:${CONTACT_EMAIL}` }}
      secondary={{ label: "Read our impact", href: "/impact" }}
    />
  );
}
