import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/layout/inner-page";
import {
  LAST_UPDATED,
  LEGAL_ENTITY,
  LegalBody,
  LegalSection,
  legalLinkClasses,
} from "@/components/legal/legal-prose";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { MAX_AMOUNT_USD, MIN_AMOUNT_USD } from "@/lib/validation";

/**
 * Terms of service.
 *
 * The donation terms below are pulled from the real constants in
 * `src/lib/validation.ts` rather than retyped, so the published limits
 * cannot silently drift away from what the checkout route enforces.
 *
 * The recurring-donation wording matches the actual Stripe integration:
 * monthly gifts create a Stripe subscription (`mode: "subscription"`),
 * which is why cancellation is described the way it is.
 */

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use the Umoja Africa website, donate, or apply to volunteer or partner with us.",
};

export default function TermsPage() {
  return (
    <InnerPage>
      <PageHero
        variant="color"
        eyebrow="Legal"
        title="Terms of Service"
        description={`The terms that apply when you use this website. Last updated ${LAST_UPDATED}.`}
      />

      <Section variant="default">
        <div className="mx-auto max-w-prose">
          <LegalSection title="Agreement to these terms">
            <LegalBody>
              By using this website you agree to these terms. If you do not
              agree with them, please do not use the site. These terms are
              between you and {LEGAL_ENTITY.name}.
            </LegalBody>
          </LegalSection>

          <LegalSection title="What this website is">
            <LegalBody>
              This site describes Umoja&rsquo;s scholarship, mentorship, and
              community programs, and provides ways to support them or apply
              to take part. The information here is provided in good faith and
              kept as accurate as we can, but it is general information about
              our work rather than a binding promise about any particular
              outcome for any particular student.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Donations">
            <LegalBody>
              Donations are voluntary gifts. Payments are processed by Stripe,
              and by donating you also accept Stripe&rsquo;s terms. We accept
              gifts from ${MIN_AMOUNT_USD} up to $
              {MAX_AMOUNT_USD.toLocaleString()}. To give more than that, or to
              give by wire transfer or stock, please{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClasses}>
                email us
              </a>{" "}
              directly.
            </LegalBody>
            <LegalBody>
              All amounts are in United States dollars. We direct donations to
              our programs as a whole, which lets us place support where it is
              most needed, so a gift is not earmarked for a named student
              unless we have agreed that with you in writing.
            </LegalBody>

            <h3 className="mt-6 font-heading text-lg font-semibold text-primary-900">
              Monthly donations
            </h3>
            <LegalBody>
              Choosing &ldquo;Monthly&rdquo; sets up a recurring payment that
              is charged once a month until you cancel it. You can cancel at
              any time, either from the receipt Stripe emails you or by
              emailing us, and cancelling stops all future charges. Cancelling
              does not refund payments already made.
            </LegalBody>

            <h3 className="mt-6 font-heading text-lg font-semibold text-primary-900">
              Refunds
            </h3>
            <LegalBody>
              Because donations are gifts rather than purchases, they are
              generally not refundable. We recognise that mistakes happen. If
              you donated in error, donated the wrong amount, or believe your
              card was used without your permission, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClasses}>
                {CONTACT_EMAIL}
              </a>{" "}
              within 30 days and we will review it and, in genuine cases,
              refund you.
            </LegalBody>

            <h3 className="mt-6 font-heading text-lg font-semibold text-primary-900">
              Tax treatment
            </h3>
            <LegalBody>
              Whether your donation is tax deductible depends on our
              registration status and on the rules where you live. We cannot
              give tax advice. If you need a receipt for tax purposes, contact
              us and we will tell you what we are able to provide.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Volunteer and partner applications">
            <LegalBody>
              Submitting an application does not create any agreement between
              us, and does not guarantee a place, a role, or a partnership. We
              review applications as capacity allows and we may decline any
              application. We may not be able to reply to every applicant
              individually.
            </LegalBody>
            <LegalBody>
              You agree that the information you give us is truthful and that
              you are entitled to provide it. Volunteer roles that involve
              direct contact with students are subject to our safeguarding
              checks, which sit outside this website.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Acceptable use">
            <LegalBody>
              Please use this site lawfully and considerately. Do not submit
              false information, do not use the forms to send spam or abusive
              content, do not attempt to gain unauthorized access to the site
              or its systems, and do not use automated tools to scrape or
              overload it.
            </LegalBody>
            <LegalBody>
              We rate-limit our forms and block abusive traffic. We may refuse
              service to anyone misusing the site.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Our content">
            <LegalBody>
              The text, photographs, logos, and reports on this site belong to
              Umoja or are used with permission. You are welcome to read,
              share, and link to our published reports and stories, and to
              quote them with attribution. Please do not reproduce our
              material commercially, or use our name or logo in a way that
              suggests we endorse something we do not, without asking us
              first.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Links to other sites">
            <LegalBody>
              Where we link to another organization&rsquo;s website, we do so
              because we think it is useful. We do not control those sites and
              we are not responsible for their content or their privacy
              practices.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Availability and liability">
            <LegalBody>
              We work to keep this site available and accurate, but we provide
              it as it is. We do not promise it will always be uninterrupted
              or error free, and we may change or remove content at any time.
            </LegalBody>
            <LegalBody>
              To the extent the law allows, we are not liable for indirect or
              consequential loss arising from your use of this site. Nothing in
              these terms limits liability that cannot lawfully be limited,
              including liability for fraud.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Privacy">
            <LegalBody>
              How we handle your personal information is set out in our{" "}
              <Link href="/privacy" className={legalLinkClasses}>
                Privacy Policy
              </Link>
              , which forms part of these terms.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Changes and governing law">
            <LegalBody>
              We may update these terms from time to time. The version
              published here is the one that applies, and the date at the top
              tells you when it last changed.
            </LegalBody>
            <LegalBody>
              These terms are governed by the laws of{" "}
              {LEGAL_ENTITY.jurisdiction}.
            </LegalBody>
          </LegalSection>

          <LegalSection title="Contact us">
            <LegalBody>
              Questions about these terms go to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClasses}>
                {CONTACT_EMAIL}
              </a>{" "}
              or through our{" "}
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
