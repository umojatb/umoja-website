import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/layout/inner-page";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { CONTACT_EMAIL } from "@/lib/site-config";
import {
  LAST_UPDATED,
  LEGAL_ENTITY,
  LegalBody,
  LegalSection,
  legalLinkClasses,
} from "@/components/legal/legal-prose";

/**
 * Privacy policy.
 *
 * IMPORTANT: the disclosures below describe what this codebase actually
 * does, verified against the route handlers, not a generic template:
 *
 * - `/api/contact` sends the message via Resend, it stores nothing.
 * - `/api/submit-application` forwards applications to a Google Apps
 *   Script webhook which appends a row to a Google Sheet.
 * - `/api/create-checkout-session` hands off to Stripe Checkout. Card
 *   details never reach this server.
 * - `src/lib/rate-limit.ts` holds a caller's IP in memory for the
 *   length of the rate-limit window. That is a real (if brief)
 *   processing of personal data, so it is disclosed.
 * - No analytics, no advertising, and no cookies are set by this site.
 *   Fonts are self-hosted at build time by `next/font`, so rendering a
 *   page makes no request to Google.
 *
 * If any of those change, this page must change with them.
 */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Umoja Africa collects, uses, and protects your personal information, and the rights you have over it.",
};

export default function PrivacyPage() {
  return (
    <InnerPage>
      <PageHero
        variant="color"
        eyebrow="Legal"
        title="Privacy Policy"
        description={`How we handle your personal information, in plain language. Last updated ${LAST_UPDATED}.`}
      />

      <Section variant="default">
        <div className="mx-auto max-w-prose">
          <LegalSection title="Who we are">
            <LegalBody>
              {LEGAL_ENTITY.name} (&ldquo;Umoja&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;) runs this website and the scholarship,
              mentorship, and community programs described on it. We are the
              data controller for the information described below.
            </LegalBody>
            <LegalBody>
              Registered address: {LEGAL_ENTITY.address}. You can reach us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClasses}>
                {CONTACT_EMAIL}
              </a>
              .
            </LegalBody>
          </LegalSection>

          <LegalSection title="What we collect, and when">
            <LegalBody>
              We only collect information you type into a form. We do not
              build profiles, we do not buy data about you, and we do not
              track you across other websites.
            </LegalBody>

            <h3 className="mt-6 font-heading text-lg font-semibold text-primary-900">
              When you use the contact form
            </h3>
            <LegalBody>
              We collect your name, your email address, the reason you
              selected, and your message. This is sent to our team inbox by
              email. It is not stored in a database on this website.
            </LegalBody>

            <h3 className="mt-6 font-heading text-lg font-semibold text-primary-900">
              When you apply to volunteer or partner
            </h3>
            <LegalBody>
              We collect your name, email address, phone number, location, and
              your written motivation. Volunteers also provide availability,
              skills, and preferred role. Partner applicants also provide an
              organization name, partnership type, a description of the
              proposed contribution, and optionally a website address.
            </LegalBody>
            <LegalBody>
              These applications are stored in a private Google Sheet that only
              authorized Umoja team members can open.
            </LegalBody>

            <h3 className="mt-6 font-heading text-lg font-semibold text-primary-900">
              When you donate
            </h3>
            <LegalBody>
              Donations are processed by Stripe. You are taken to a payment
              page hosted by Stripe, and your card details are entered there.{" "}
              <strong className="font-semibold text-primary-900">
                Your card number never reaches our servers and we never see or
                store it.
              </strong>{" "}
              Stripe shares with us the transaction record we need for
              accounting and for thanking you, such as the amount, the date,
              and the name and email you gave them.
            </LegalBody>

            <h3 className="mt-6 font-heading text-lg font-semibold text-primary-900">
              Automatically, for abuse prevention
            </h3>
            <LegalBody>
              When you submit the contact form, your IP address is held
              temporarily in server memory so we can limit how many messages a
              single sender can post in a short window. It is used for nothing
              else, it is never written to disk, and it is discarded when the
              window expires.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Why we use it">
            <LegalBody>
              To reply to your message, to assess and respond to volunteer and
              partnership applications, to process and acknowledge donations,
              to meet our accounting and reporting obligations, and to protect
              our forms from spam and abuse.
            </LegalBody>
            <LegalBody>
              Where the law requires a legal basis, ours is your consent when
              you choose to submit a form, our legitimate interest in running
              the organization and keeping it secure, and our legal obligation
              to keep financial records.
            </LegalBody>
            <LegalBody>
              We do not use your information for advertising, and we do not
              sell or rent it to anyone. Ever.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Who else can see it">
            <LegalBody>
              We use a small number of service providers, and each one sees
              only what it needs to do its job:
            </LegalBody>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-neutral-700">
              <li>
                <strong className="font-semibold text-primary-900">
                  Stripe
                </strong>{" "}
                processes donation payments and handles your card details
                directly.
              </li>
              <li>
                <strong className="font-semibold text-primary-900">
                  Resend
                </strong>{" "}
                delivers contact form messages to our inbox.
              </li>
              <li>
                <strong className="font-semibold text-primary-900">
                  Google
                </strong>{" "}
                stores volunteer and partner applications in a private Google
                Sheet.
              </li>
              <li>
                <strong className="font-semibold text-primary-900">
                  Vercel
                </strong>{" "}
                hosts this website and processes standard server request logs.
              </li>
            </ul>
            <LegalBody>
              These providers may process data outside your country, including
              in the United States. We otherwise disclose your information only
              where we are legally required to.
            </LegalBody>
          </LegalSection>

          <LegalSection title="How long we keep it">
            <LegalBody>
              Contact messages stay in our email inbox for as long as they are
              useful for the conversation, and are deleted during periodic
              inbox review. Volunteer and partner applications are kept for up
              to two years so we can contact you when a suitable opportunity
              opens, unless you ask us to remove them sooner. Donation records
              are kept for as long as accounting and charity reporting rules
              require.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Your rights">
            <LegalBody>
              You can ask us to show you the information we hold about you, to
              correct it if it is wrong, or to delete it. You can withdraw
              consent at any time, and you can object to how we are using your
              information.
            </LegalBody>
            <LegalBody>
              Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClasses}>
                {CONTACT_EMAIL}
              </a>{" "}
              and we will respond within 30 days. There is no charge for this.
              If you are in the UK or EU and you are unhappy with our response,
              you have the right to complain to your national data protection
              authority.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Cookies">
            <LegalBody>
              This website sets no cookies of its own. We run no analytics and
              no advertising trackers, and the fonts we use are served from
              this site rather than fetched from a third party.
            </LegalBody>
            <LegalBody>
              If you go through the donation flow, Stripe sets cookies on its
              own payment page in order to process the payment securely and
              prevent fraud. That happens on Stripe&rsquo;s domain and is
              covered by Stripe&rsquo;s own privacy policy.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Children">
            <LegalBody>
              This website is intended for adults. The forms on it are for
              volunteers, partners, and donors, and we do not knowingly collect
              information through this site from anyone under 16.
            </LegalBody>
            <LegalBody>
              Information about the students we support is collected offline,
              through our selection process, with the involvement of their
              parents, guardians, or schools, and is handled under separate
              safeguarding practices rather than through this website.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Changes to this policy">
            <LegalBody>
              If we change how we handle your information, we will update this
              page and change the date at the top. Significant changes will be
              noted clearly.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Contact us">
            <LegalBody>
              Questions about this policy, or about your information, go to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClasses}>
                {CONTACT_EMAIL}
              </a>
              . You can also use our{" "}
              <Link href="/contact" className={legalLinkClasses}>
                contact form
              </Link>
              .
            </LegalBody>
          </LegalSection>
        </div>
      </Section>
    </InnerPage>
  );
}
