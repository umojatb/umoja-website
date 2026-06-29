"use client";

import Link from "next/link";
import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { buttonStyles } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { validateAmount } from "@/lib/validation";

type Frequency = "once" | "monthly";
type AmountChoice = "25" | "50" | "100" | "custom";

const FREQUENCIES: readonly { value: Frequency; label: string }[] = [
  { value: "once", label: "One-time" },
  { value: "monthly", label: "Monthly" },
] as const;

const AMOUNT_CHOICES: readonly { value: AmountChoice; label: string }[] = [
  { value: "25", label: "$25" },
  { value: "50", label: "$50" },
  { value: "100", label: "$100" },
  { value: "custom", label: "Custom" },
] as const;

type SubmitState = "idle" | "submitting" | "redirecting" | "error";

export function DonationForm() {
  const formId = useId();
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState<AmountChoice>("50");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Captured Stripe checkout URL. Held in state so a visible fallback
  // link can render if the browser drops `window.location.assign()`
  // (rare but documented on iOS Safari after long async chains).
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const rawAmount =
    amount === "custom" ? Number(customAmount) || 0 : Number(amount);
  const amountValidation = validateAmount(rawAmount);
  const isValid = amountValidation.ok;
  const effectiveAmount = amountValidation.ok ? amountValidation.value : 0;
  const isSubmitting = status === "submitting";

  // Inline error for the custom amount field, only after the user has typed
  // something. We don't show it if they haven't picked Custom yet, even if
  // technically a fresh form has 0 in custom.
  const customAmountError =
    amount === "custom" && customAmount.length > 0 && !amountValidation.ok
      ? amountValidation.message
      : "";

  const buttonLabel =
    status === "submitting"
      ? "Starting checkout…"
      : status === "redirecting"
        ? "Redirecting to Stripe…"
        : !isValid
          ? "Choose an amount"
          : `Donate $${effectiveAmount}${frequency === "monthly" ? " / month" : ""}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setStatus("submitting");
    setErrorMessage("");
    setCheckoutUrl(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          frequency,
          cancelUrl: window.location.href,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        message?: string;
      };
      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.message ?? "Could not start checkout.");
      }
      // Capture the URL in state BEFORE attempting navigation so the
      // fallback link is already rendered if the redirect drops. iOS
      // Safari occasionally treats the gesture context as "lost" after
      // long async chains and silently no-ops the navigation, leaving
      // the user on /donate with no feedback.
      setCheckoutUrl(data.url);
      setStatus("redirecting");
      // `assign()` is semantically explicit (vs `href = url` which is
      // a property setter that some browsers treat differently in
      // certain contexts). If this dropped, the visible fallback link
      // below catches the user.
      window.location.assign(data.url);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not start checkout.",
      );
    }
  }

  function handleCustomChange(event: ChangeEvent<HTMLInputElement>) {
    setCustomAmount(event.target.value);
    if (amount !== "custom") setAmount("custom");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Donate">
      <fieldset>
        <legend className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-secondary-600">
          Frequency
        </legend>
        <div
          className="mt-2 flex rounded-full border border-neutral-200 bg-neutral-50 p-0.5"
          role="presentation"
        >
          {FREQUENCIES.map((option) => (
            <label key={option.value} className="relative flex-1">
              <input
                type="radio"
                name={`${formId}-frequency`}
                value={option.value}
                checked={frequency === option.value}
                onChange={() => setFrequency(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block cursor-pointer rounded-full py-1.5 text-center text-sm font-medium",
                  "text-neutral-600 transition-colors",
                  "peer-checked:bg-primary-700 peer-checked:text-white",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-700 peer-focus-visible:ring-offset-2",
                )}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-secondary-600">
          Amount
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {AMOUNT_CHOICES.map((choice) => (
            <label key={choice.value} className="relative">
              <input
                type="radio"
                name={`${formId}-amount`}
                value={choice.value}
                checked={amount === choice.value}
                onChange={() => setAmount(choice.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block cursor-pointer rounded-2xl border-2 border-neutral-200 bg-background py-2 text-center font-heading text-lg font-bold",
                  "text-primary-900 transition-colors",
                  "peer-checked:border-primary-700 peer-checked:bg-primary-50 peer-checked:text-primary-700",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-700 peer-focus-visible:ring-offset-2",
                )}
              >
                {choice.label}
              </span>
            </label>
          ))}
        </div>

        {amount === "custom" && (
          <div className="mt-2">
            <label
              htmlFor={`${formId}-custom-amount`}
              className="font-heading text-xs font-semibold uppercase tracking-wider text-neutral-600"
            >
              Custom amount (USD)
            </label>
            <div
              className={cn(
                "mt-1 flex items-center rounded-2xl border-2 bg-background",
                customAmountError
                  ? "border-red-500 focus-within:border-red-600"
                  : "border-primary-200 focus-within:border-primary-700",
              )}
            >
              <span className="pl-3 font-heading text-lg font-bold text-neutral-500">
                $
              </span>
              <input
                id={`${formId}-custom-amount`}
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                placeholder="0"
                value={customAmount}
                onChange={handleCustomChange}
                aria-invalid={!!customAmountError}
                aria-describedby={
                  customAmountError ? `${formId}-custom-amount-error` : undefined
                }
                className="w-full rounded-r-2xl bg-transparent py-2 pl-1 pr-3 font-heading text-lg font-bold text-primary-900 outline-none placeholder:text-neutral-400"
              />
            </div>
            {customAmountError && (
              <p
                id={`${formId}-custom-amount-error`}
                className="mt-1 text-sm text-red-700"
              >
                {customAmountError}
              </p>
            )}
          </div>
        )}
      </fieldset>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}

      {/*
        Visible fallback when a Stripe checkout URL has been issued but
        the automatic `window.location.assign()` redirect may have been
        dropped (iOS Safari edge case). The plain `<a>` tag with an
        explicit `href` is a normal navigation initiated by a user tap,
        which mobile browsers always honor. `noopener noreferrer` keeps
        Stripe in the same tab without leaking referrer.
      */}
      {checkoutUrl && status === "redirecting" && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-3 text-sm text-primary-900"
        >
          <p className="font-medium">Taking you to Stripe checkout&hellip;</p>
          <p className="mt-1 text-xs">
            If nothing happens after a moment,{" "}
            <a
              href={checkoutUrl}
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-primary-700"
            >
              tap here to continue to checkout
            </a>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isSubmitting || status === "redirecting"}
        className={buttonStyles({
          variant: "primary",
          size: "lg",
          className: "w-full",
        })}
      >
        {buttonLabel}
      </button>

      <p className="text-center text-xs text-neutral-500">
        Secure payments processed by Stripe. Prefer wire transfer or stock?{" "}
        <Link
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-600"
        >
          Email us
        </Link>
        .
      </p>
    </form>
  );
}
