/**
 * Shared validation primitives for forms (client) and API routes (server).
 *
 * Every validator returns a uniform `Result<T>` so callers can collect
 * per-field errors without rebuilding a regex three times. Length caps
 * are intentionally generous on the upper bound, the goal is to refuse
 * pathological payloads, not to enforce a marketing tone of voice.
 *
 * Validators always trim before testing so " jane@example.com " passes
 * and the trimmed value is what the caller stores. They never return
 * the original string — the caller takes `result.value` after success.
 */

export type Result<T = string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly message: string };

export const MAX_NAME_LEN = 200;
export const MIN_NAME_LEN = 2;
export const MAX_EMAIL_LEN = 254;
export const MAX_PHONE_LEN = 40;
export const MIN_PHONE_DIGITS = 7;
export const MAX_LOCATION_LEN = 200;
export const MIN_LOCATION_LEN = 2;
export const MAX_TEXT_LEN = 4000;
export const MIN_MOTIVATION_LEN = 10;
export const MAX_URL_LEN = 2048;
export const MAX_AMOUNT_USD = 100_000;
export const MIN_AMOUNT_USD = 1;

// Reasonable email shape, deliberately not RFC-5322. Requires a dot in
// the domain so "jane@example" fails but international and plus-tagged
// addresses still pass.
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Letters (Latin + extended), spaces, hyphens, apostrophes, periods.
// Refuses strings that are nothing but punctuation or digits.
const NAME_ALLOWED = /^[\p{L}][\p{L}\s'.\-]*$/u;

// Phone: tolerate +, digits, spaces, dashes, parens, dots. We do NOT
// pin a specific country format because the org receives international
// applications. We just require at least MIN_PHONE_DIGITS actual digits.
const PHONE_ALLOWED = /^[+\d\s\-().]+$/;

function trimAndCap(value: unknown, cap: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, cap);
}

// Narrow return types so `fail()` and `pass<T>()` are usable across every
// validator regardless of the success-arm value type. The failure shape
// has no type parameter, so it's structurally a subtype of every
// `Result<T>` (the failure arm is the same in all of them).
function fail(message: string): { readonly ok: false; readonly message: string } {
  return { ok: false, message };
}

function pass<T>(value: T): { readonly ok: true; readonly value: T } {
  return { ok: true, value };
}

export function validateName(raw: unknown, label = "Full name"): Result {
  const value = trimAndCap(raw, MAX_NAME_LEN);
  if (!value) return fail(`${label} is required.`);
  if (value.length < MIN_NAME_LEN)
    return fail(`${label} must be at least ${MIN_NAME_LEN} characters.`);
  if (!NAME_ALLOWED.test(value))
    return fail(`${label} contains characters that aren’t allowed.`);
  return pass(value);
}

export function validateEmail(raw: unknown): Result {
  const value = trimAndCap(raw, MAX_EMAIL_LEN);
  if (!value) return fail("Email is required.");
  if (value.length > MAX_EMAIL_LEN)
    return fail("Email is too long.");
  if (!EMAIL_REGEX.test(value))
    return fail("Enter a valid email address.");
  return pass(value);
}

export function validatePhone(raw: unknown): Result {
  const value = trimAndCap(raw, MAX_PHONE_LEN);
  if (!value) return fail("Phone number is required.");
  if (!PHONE_ALLOWED.test(value))
    return fail("Phone number can only contain digits, spaces, +, -, ( ), and .");
  const digitCount = value.replace(/\D/g, "").length;
  if (digitCount < MIN_PHONE_DIGITS)
    return fail(`Phone number needs at least ${MIN_PHONE_DIGITS} digits.`);
  return pass(value);
}

export function validateLocation(raw: unknown): Result {
  const value = trimAndCap(raw, MAX_LOCATION_LEN);
  if (!value) return fail("Location is required.");
  if (value.length < MIN_LOCATION_LEN)
    return fail(`Location must be at least ${MIN_LOCATION_LEN} characters.`);
  return pass(value);
}

export function validateMotivation(raw: unknown, label = "Motivation"): Result {
  const value = trimAndCap(raw, MAX_TEXT_LEN);
  if (!value) return fail(`${label} is required.`);
  if (value.length < MIN_MOTIVATION_LEN)
    return fail(`${label} should be at least ${MIN_MOTIVATION_LEN} characters so we can understand your interest.`);
  return pass(value);
}

export function validateRequiredText(
  raw: unknown,
  label: string,
  opts: { readonly min?: number; readonly max?: number } = {},
): Result {
  const max = opts.max ?? MAX_TEXT_LEN;
  const min = opts.min ?? 1;
  const value = trimAndCap(raw, max);
  if (!value) return fail(`${label} is required.`);
  if (value.length < min)
    return fail(`${label} must be at least ${min} characters.`);
  return pass(value);
}

export function validateOptionalUrl(raw: unknown): Result {
  const value = trimAndCap(raw, MAX_URL_LEN);
  if (!value) return pass("");
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:")
      return fail("Website must start with http:// or https://.");
    return pass(value);
  } catch {
    return fail("Enter a valid website URL (including https://).");
  }
}

export function validateOneOf<T extends string>(
  raw: unknown,
  allowed: readonly T[],
  label: string,
): Result<T> {
  if (typeof raw === "string" && (allowed as readonly string[]).includes(raw)) {
    return { ok: true, value: raw as T };
  }
  return fail(`${label} is required.`);
}

export function validateAmount(raw: unknown): Result<number> {
  const amount = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(amount))
    return fail("Please enter a numeric donation amount.");
  if (amount < MIN_AMOUNT_USD)
    return fail(`Minimum donation is $${MIN_AMOUNT_USD}.`);
  if (amount > MAX_AMOUNT_USD)
    return fail(`For donations above $${MAX_AMOUNT_USD.toLocaleString()}, please email us.`);
  // Round to whole cents to match Stripe's unit_amount.
  const rounded = Math.round(amount * 100) / 100;
  return { ok: true, value: rounded };
}
