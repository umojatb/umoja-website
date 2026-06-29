import type { Metadata } from "next";
import { ApplyForm } from "@/components/forms/apply-form";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { InnerPage } from "@/components/layout/inner-page";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Become a Partner",
  description:
    "Schools, community leaders, small businesses, and corporate partners. Tell us how you'd like to collaborate and we'll set up a first conversation.",
};

export default function ApplyPartnerPage() {
  return (
    <InnerPage>
      <Section as="header" variant="muted" className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <Heading
            level={1}
            eyebrow="Get involved"
            description="Schools, community leaders, small businesses, and corporate partners. Tell us how you'd like to collaborate and we'll set up a first conversation."
          >
            Become a Partner
          </Heading>
        </div>
      </Section>
      <Section className="py-10 md:py-12">
        <div className="mx-auto max-w-2xl">
          <Card className="p-5 md:p-8">
            <ApplyForm type="partner" />
          </Card>
        </div>
      </Section>
    </InnerPage>
  );
}
