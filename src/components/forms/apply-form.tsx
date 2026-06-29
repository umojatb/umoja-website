"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Field, inputClasses } from "@/components/forms/field";
import { buttonStyles } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/site-config";
import {
  validateEmail,
  validateLocation,
  validateMotivation,
  validateName,
  validateOneOf,
  validateOptionalUrl,
  validatePhone,
  validateRequiredText,
  type Result,
} from "@/lib/validation";

/**
 * Shared application form for /apply/volunteer and /apply/partner.
 *
 * One form, two shapes. The `type` prop drives the title and which set of
 * type-specific fields render below the common five (name, email, phone,
 * location, motivation). Validation runs on blur and again on submit.
 * Server-returned per-field errors hydrate the same map so a 400 response
 * shows messages inline under the offending fields.
 */

export type ApplyType = "volunteer" | "partner";

const TITLES: Record<ApplyType, string> = {
  volunteer: "Apply as a Volunteer",
  partner: "Become a Partner",
};

const INTROS: Record<ApplyType, string> = {
  volunteer:
    "Mentor a scholar, tutor weekly, or run a workshop. Tell us how you’d like to help and we’ll match you to a scholar who needs it.",
  partner:
    "Schools, community leaders, small businesses, and corporate partners. Tell us how you’d like to collaborate and we’ll set up a first conversation.",
};

const VOLUNTEER_ROLES = [
  { value: "", label: "Pick one" },
  { value: "Mentor", label: "Mentor (≈ 1 hour / month)" },
  { value: "Tutor", label: "Tutor (≈ 2 hours / week)" },
  { value: "Workshop facilitator", label: "Workshop facilitator (one-off)" },
  { value: "Other", label: "Other / not sure yet" },
] as const;

const PARTNERSHIP_TYPES = [
  { value: "", label: "Pick one" },
  { value: "School", label: "School / educational institution" },
  { value: "Community leader", label: "Community leader / NGO" },
  { value: "Corporate", label: "Corporate partnership" },
  { value: "Small business", label: "Small business" },
  { value: "Other", label: "Other" },
] as const;

const VOLUNTEER_ROLE_VALUES = [
  "Mentor",
  "Tutor",
  "Workshop facilitator",
  "Other",
] as const;

const PARTNERSHIP_TYPE_VALUES = [
  "School",
  "Community leader",
  "Corporate",
  "Small business",
  "Other",
] as const;

type SubmitState = "idle" | "submitting" | "success" | "error";
type Errors = Record<string, string | undefined>;
type Touched = Record<string, boolean>;

function applyResult(
  errors: Errors,
  field: string,
  result: Result<unknown>,
): Errors {
  return { ...errors, [field]: result.ok ? undefined : result.message };
}

export function ApplyForm({ type }: { type: ApplyType }) {
  const formId = useId();

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [motivation, setMotivation] = useState("");

  // Volunteer-specific
  const [availability, setAvailability] = useState("");
  const [skills, setSkills] = useState("");
  const [preferredRole, setPreferredRole] = useState("");

  // Partner-specific
  const [orgName, setOrgName] = useState("");
  const [partnershipType, setPartnershipType] = useState("");
  const [contributionDetails, setContributionDetails] = useState("");
  const [website, setWebsite] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const [status, setStatus] = useState<SubmitState>("idle");
  const [bannerMessage, setBannerMessage] = useState("");

  const isSubmitting = status === "submitting";

  function markTouched(field: string) {
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
  }

  function validateField(field: string, value: string): Result<unknown> {
    switch (field) {
      case "fullName":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "location":
        return validateLocation(value);
      case "motivation":
        return validateMotivation(value);
      case "availability":
        return validateRequiredText(value, "Availability");
      case "skills":
        return validateRequiredText(value, "Skills");
      case "preferredRole":
        return validateOneOf(value, VOLUNTEER_ROLE_VALUES, "Preferred role");
      case "orgName":
        return validateRequiredText(value, "Organization name");
      case "partnershipType":
        return validateOneOf(value, PARTNERSHIP_TYPE_VALUES, "Partnership type");
      case "contributionDetails":
        return validateRequiredText(value, "Contribution details", { min: 10 });
      case "website":
        return validateOptionalUrl(value);
      default:
        return { ok: true, value };
    }
  }

  function validateOnBlur(field: string, value: string) {
    markTouched(field);
    setErrors((e) => applyResult(e, field, validateField(field, value)));
  }

  function validateAll(): { ok: boolean; errors: Errors } {
    const next: Errors = {};
    const fields: Array<[string, string]> = [
      ["fullName", fullName],
      ["email", email],
      ["phone", phone],
      ["location", location],
      ["motivation", motivation],
    ];
    if (type === "volunteer") {
      fields.push(
        ["availability", availability],
        ["skills", skills],
        ["preferredRole", preferredRole],
      );
    } else {
      fields.push(
        ["orgName", orgName],
        ["partnershipType", partnershipType],
        ["contributionDetails", contributionDetails],
        ["website", website],
      );
    }
    let ok = true;
    for (const [field, value] of fields) {
      const result = validateField(field, value);
      if (!result.ok) {
        next[field] = result.message;
        ok = false;
      }
    }
    return { ok, errors: next };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const { ok, errors: validationErrors } = validateAll();
    if (!ok) {
      setErrors(validationErrors);
      setTouched((t) => {
        const merged = { ...t };
        for (const key of Object.keys(validationErrors)) merged[key] = true;
        return merged;
      });
      setStatus("error");
      setBannerMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setBannerMessage("");
    setErrors({});

    const payload = {
      type,
      fullName,
      email,
      phone,
      location,
      motivation,
      ...(type === "volunteer"
        ? { availability, skills, preferredRole }
        : { orgName, partnershipType, contributionDetails, website }),
    };

    try {
      const res = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: Record<string, string>;
      };
      if (!res.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setTouched((t) => {
            const merged = { ...t };
            for (const key of Object.keys(data.errors ?? {})) merged[key] = true;
            return merged;
          });
        }
        throw new Error(data.message ?? "Submission failed.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setBannerMessage(
        error instanceof Error ? error.message : "Submission failed.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <h1 className="font-heading text-2xl font-semibold text-primary-900 md:text-3xl">
          Thank you
        </h1>
        <p className="mt-3 text-base text-neutral-700">
          We received your{" "}
          {type === "volunteer" ? "volunteer" : "partnership"} application.
          The Umoja team will review it and reach out by email. If you don’t
          hear from us within a week, write to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-600"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  function fieldError(name: string): string | undefined {
    return touched[name] ? errors[name] : undefined;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label={TITLES[type]}
      noValidate
    >
      <div>
        <h1 className="font-heading text-2xl font-semibold text-primary-900 md:text-3xl">
          {TITLES[type]}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 md:text-base">
          {INTROS[type]}
        </p>
      </div>

      <Field
        formId={formId}
        name="fullName"
        label="Full name"
        error={fieldError("fullName")}
      >
        <input
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={(e) => validateOnBlur("fullName", e.target.value)}
          className={`mt-1 ${inputClasses}`}
        />
      </Field>

      <Field
        formId={formId}
        name="email"
        label="Email"
        error={fieldError("email")}
      >
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateOnBlur("email", e.target.value)}
          className={`mt-1 ${inputClasses}`}
        />
      </Field>

      <Field
        formId={formId}
        name="phone"
        label="Phone"
        error={fieldError("phone")}
      >
        <input
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={(e) => validateOnBlur("phone", e.target.value)}
          className={`mt-1 ${inputClasses}`}
        />
      </Field>

      <Field
        formId={formId}
        name="location"
        label="Location"
        error={fieldError("location")}
      >
        <input
          type="text"
          autoComplete="address-level2"
          required
          placeholder="City, country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={(e) => validateOnBlur("location", e.target.value)}
          className={`mt-1 ${inputClasses}`}
        />
      </Field>

      <Field
        formId={formId}
        name="motivation"
        label="Motivation"
        error={fieldError("motivation")}
      >
        <textarea
          required
          rows={4}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          onBlur={(e) => validateOnBlur("motivation", e.target.value)}
          className={`mt-1 resize-y ${inputClasses}`}
          placeholder={
            type === "volunteer"
              ? "What draws you to this work?"
              : "Why does your organization want to partner with Umoja?"
          }
        />
      </Field>

      {type === "volunteer" ? (
        <>
          <Field
            formId={formId}
            name="availability"
            label="Availability"
            error={fieldError("availability")}
          >
            <input
              type="text"
              required
              placeholder="e.g. weekday evenings, ~2 hours / week"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              onBlur={(e) => validateOnBlur("availability", e.target.value)}
              className={`mt-1 ${inputClasses}`}
            />
          </Field>

          <Field
            formId={formId}
            name="skills"
            label="Skills"
            error={fieldError("skills")}
          >
            <input
              type="text"
              required
              placeholder="e.g. mathematics, software engineering, university advising"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              onBlur={(e) => validateOnBlur("skills", e.target.value)}
              className={`mt-1 ${inputClasses}`}
            />
          </Field>

          <Field
            formId={formId}
            name="preferredRole"
            label="Preferred role"
            error={fieldError("preferredRole")}
          >
            <select
              required
              value={preferredRole}
              onChange={(e) => setPreferredRole(e.target.value)}
              onBlur={(e) => validateOnBlur("preferredRole", e.target.value)}
              className={`mt-1 ${inputClasses}`}
            >
              {VOLUNTEER_ROLES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </>
      ) : (
        <>
          <Field
            formId={formId}
            name="orgName"
            label="Organization name"
            error={fieldError("orgName")}
          >
            <input
              type="text"
              autoComplete="organization"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              onBlur={(e) => validateOnBlur("orgName", e.target.value)}
              className={`mt-1 ${inputClasses}`}
            />
          </Field>

          <Field
            formId={formId}
            name="partnershipType"
            label="Partnership type"
            error={fieldError("partnershipType")}
          >
            <select
              required
              value={partnershipType}
              onChange={(e) => setPartnershipType(e.target.value)}
              onBlur={(e) => validateOnBlur("partnershipType", e.target.value)}
              className={`mt-1 ${inputClasses}`}
            >
              {PARTNERSHIP_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            formId={formId}
            name="contributionDetails"
            label="Contribution details"
            error={fieldError("contributionDetails")}
          >
            <textarea
              required
              rows={4}
              value={contributionDetails}
              onChange={(e) => setContributionDetails(e.target.value)}
              onBlur={(e) => validateOnBlur("contributionDetails", e.target.value)}
              className={`mt-1 resize-y ${inputClasses}`}
              placeholder="What you can offer: scholarships, internships, materials, training, etc."
            />
          </Field>

          <Field
            formId={formId}
            name="website"
            label="Website"
            optional
            error={fieldError("website")}
          >
            <input
              type="url"
              autoComplete="url"
              placeholder="https://"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              onBlur={(e) => validateOnBlur("website", e.target.value)}
              className={`mt-1 ${inputClasses}`}
            />
          </Field>
        </>
      )}

      {status === "error" && bannerMessage && (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {bannerMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!validateAll().ok || isSubmitting}
        className={buttonStyles({
          variant: "primary",
          size: "lg",
          className: "w-full",
        })}
      >
        {isSubmitting
          ? "Sending…"
          : type === "volunteer"
            ? "Submit volunteer application"
            : "Submit partnership inquiry"}
      </button>

      <p className="text-center text-xs text-neutral-500">
        By submitting, you agree to be contacted by the Umoja team about your
        application. We don’t share your details with anyone else.
      </p>
    </form>
  );
}
