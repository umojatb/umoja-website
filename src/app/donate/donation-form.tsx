"use client";

import Link from "next/link";
import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export function DonationForm() {
  const formId = useId();
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState<AmountChoice>("50");
  const [customAmount, setCustomAmount] = useState<string>("");

  const effectiveAmount =
    amount === "custom" ? Number(customAmount) || 0 : Number(amount);
  const isValid = effectiveAmount > 0;

  const buttonLabel = !isValid
    ? "Choose an amount"
    : `Donate $${effectiveAmount}${frequency === "monthly" ? " / month" : ""}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Payment integration is intentionally not wired up. The disclaimer
    // below the submit button names the workaround for users who want to
    // give today.
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
            <div className="mt-1 flex items-center rounded-2xl border-2 border-primary-200 bg-background focus-within:border-primary-700">
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
                className="w-full rounded-r-2xl bg-transparent py-2 pl-1 pr-3 font-heading text-lg font-bold text-primary-900 outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={!isValid}
        className={buttonStyles({
          variant: "primary",
          size: "lg",
          className: "w-full",
        })}
      >
        {buttonLabel}
      </button>

      <p className="text-center text-xs text-neutral-500">
        UI preview — secure payments launch soon. To give today,{" "}
        <Link
          href="/contact"
          className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-600"
        >
          email us
        </Link>
        .
      </p>
    </form>
  );
}
