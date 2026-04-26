"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonStyles } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/contact";

const REASONS: readonly { value: string; label: string }[] = [
  { value: "", label: "Pick one (optional)" },
  { value: "general", label: "General question" },
  { value: "partnership", label: "Partnership" },
  { value: "donation", label: "Donation question" },
  { value: "volunteering", label: "Volunteering" },
  { value: "other", label: "Other" },
] as const;

const inputClasses =
  "w-full rounded-2xl border-2 border-neutral-200 bg-background px-3 py-2 text-base text-primary-900 placeholder:text-neutral-400 focus:border-primary-700 focus:outline-none";
const labelClasses =
  "block font-heading text-sm font-semibold text-primary-900";

export function ContactForm() {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const isValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    const reasonLabel = REASONS.find((r) => r.value === reason)?.label;
    const subject = reasonLabel
      ? `Umoja site — ${reasonLabel}`
      : "Umoja site — message";
    const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Contact">
      <div>
        <label htmlFor={`${formId}-name`} className={labelClasses}>
          Your name
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 ${inputClasses}`}
        />
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className={labelClasses}>
          Your email
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-1 ${inputClasses}`}
        />
      </div>

      <div>
        <label htmlFor={`${formId}-reason`} className={labelClasses}>
          Reason
        </label>
        <select
          id={`${formId}-reason`}
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
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={labelClasses}>
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`mt-1 resize-y ${inputClasses}`}
          placeholder="Write whatever's on your mind."
        />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={buttonStyles({
          variant: "primary",
          size: "lg",
          className: "w-full",
        })}
      >
        Send via email
      </button>

      <p className="text-center text-xs text-neutral-500">
        Submitting opens your email app with this message pre-written. Or
        write to{" "}
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
