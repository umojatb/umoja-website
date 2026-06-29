"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Field, inputClasses } from "@/components/forms/field";
import { buttonStyles } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/site-config";
import {
  validateEmail,
  validateMotivation,
  validateName,
  type Result,
} from "@/lib/validation";

const REASONS = [
  { value: "", label: "Pick one (optional)" },
  { value: "general", label: "General question" },
  { value: "partnership", label: "Partnership" },
  { value: "donation", label: "Donation question" },
  { value: "volunteering", label: "Volunteering" },
  { value: "other", label: "Other" },
] as const;

type SubmitState = "idle" | "submitting" | "success" | "error";
type Errors = Record<string, string | undefined>;
type Touched = Record<string, boolean>;

function validateField(field: string, value: string): Result<unknown> {
  switch (field) {
    case "name":
      return validateName(value, "Your name");
    case "email":
      return validateEmail(value);
    case "message":
      return validateMotivation(value, "Message");
    default:
      return { ok: true, value };
  }
}

export function ContactForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot — hidden from real users via CSS, normally stays empty.
  // The server treats a non-empty value as a bot signal.
  const [company, setCompany] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const [status, setStatus] = useState<SubmitState>("idle");
  const [bannerMessage, setBannerMessage] = useState("");

  const isSubmitting = status === "submitting";

  function markTouched(field: string) {
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
  }

  function validateOnBlur(field: string, value: string) {
    markTouched(field);
    const result = validateField(field, value);
    setErrors((e) => ({ ...e, [field]: result.ok ? undefined : result.message }));
  }

  function validateAll(): { ok: boolean; errors: Errors } {
    const next: Errors = {};
    let ok = true;
    const fields: ReadonlyArray<readonly [string, string]> = [
      ["name", name],
      ["email", email],
      ["message", message],
    ];
    for (const [field, value] of fields) {
      const result = validateField(field, value);
      if (!result.ok) {
        next[field] = result.message;
        ok = false;
      }
    }
    return { ok, errors: next };
  }

  function fieldError(field: string): string | undefined {
    return touched[field] ? errors[field] : undefined;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const { ok, errors: validationErrors } = validateAll();
    if (!ok) {
      setErrors(validationErrors);
      setTouched({ name: true, email: true, message: true });
      setStatus("error");
      setBannerMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setBannerMessage("");
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          reason,
          message,
          company,
        }),
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
        throw new Error(data.message ?? "Couldn't send your message.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setBannerMessage(
        error instanceof Error
          ? error.message
          : "Couldn't send your message. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <h2 className="font-heading text-2xl font-semibold text-primary-900 md:text-3xl">
          Message sent
        </h2>
        <p className="mt-3 text-base text-neutral-700">
          Thank you. The Umoja team will read your note and reply by email
          within a week. If you don&rsquo;t hear back, write to{" "}
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

  const isValid = validateAll().ok;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      aria-label="Contact"
      noValidate
    >
      <Field
        formId={formId}
        name="name"
        label="Your name"
        error={fieldError("name")}
      >
        <input
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => validateOnBlur("name", e.target.value)}
          className={`mt-1 ${inputClasses}`}
        />
      </Field>

      <Field
        formId={formId}
        name="email"
        label="Your email"
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

      <Field formId={formId} name="reason" label="Reason">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`mt-1 ${inputClasses}`}
        >
          {REASONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        formId={formId}
        name="message"
        label="Message"
        error={fieldError("message")}
      >
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={(e) => validateOnBlur("message", e.target.value)}
          className={`mt-1 resize-y ${inputClasses}`}
          placeholder="Write whatever's on your mind."
        />
      </Field>

      {/*
        Honeypot field. Visually hidden + marked as not-tabbable + an
        autocomplete value bots tend to fill. A non-empty value here on
        submit is treated by the server as a bot signal and silently
        dropped. We render with `aria-hidden` and `tabIndex={-1}` so
        keyboard / screen-reader users don't ever land on it.
      */}
      <div
        aria-hidden="true"
        className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={`${formId}-company`}>Company (leave blank)</label>
        <input
          id={`${formId}-company`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

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
        disabled={!isValid || isSubmitting}
        className={buttonStyles({
          variant: "primary",
          size: "lg",
          className: "w-full",
        })}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>

      <p className="text-center text-xs text-neutral-500">
        Or write to{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-600"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        directly.
      </p>
    </form>
  );
}
