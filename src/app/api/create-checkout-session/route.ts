import { NextResponse } from "next/server";
import Stripe from "stripe";
import { validateAmount, validateOneOf } from "@/lib/validation";

/**
 * Stripe Checkout session creator.
 *
 * Receives `{ amount, frequency, cancelUrl? }`, validates, and returns the
 * Checkout URL the client redirects to. Uses inline `price_data` so no fixed
 * Stripe Prices need to be pre-created, the donor picks the amount.
 *
 * One-time gifts use `mode: payment`; monthly gifts use `mode: subscription`
 * with a recurring `price_data`. If `STRIPE_SECRET_KEY` is unset we return
 * 503 with a friendly message so the UI can fall back to the email path.
 */

/**
 * Platform execution budget. Must exceed the Stripe client's own
 * worst case (15s + backoff + 15s retry ≈ 32s) or the host kills the
 * function first and the timeout settings below never take effect.
 */
export const maxDuration = 45;

/**
 * Pinned to the version the installed SDK's types are generated
 * against. Without an explicit `apiVersion` the SDK follows the
 * *account's* default, which Stripe can roll forward on their
 * schedule. That turns a dashboard-side change into a behavioural
 * change in production with no deploy and no warning on our side.
 */
const STRIPE_API_VERSION = "2026-04-22.dahlia";

/**
 * 15 seconds. The SDK default is 80s, which for a user-facing request
 * means a donor can sit watching "Starting checkout…" for well over a
 * minute before anything happens. Measured round trips to Stripe are
 * around 1s on a healthy network, so 15s is generous while still
 * failing in a timeframe a person will tolerate.
 *
 * One retry, not the default: retries apply to network-layer failures,
 * and a donor's connection dropping twice in a row is better handled
 * by letting them click the button again than by silently burning
 * another 15s of their patience.
 */
const STRIPE_TIMEOUT_MS = 15_000;
const STRIPE_MAX_RETRIES = 1;

let cachedStripe: Stripe | null = null;
function getStripe(): Stripe | null {
  if (cachedStripe) return cachedStripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  cachedStripe = new Stripe(key, {
    apiVersion: STRIPE_API_VERSION,
    timeout: STRIPE_TIMEOUT_MS,
    maxNetworkRetries: STRIPE_MAX_RETRIES,
  });
  return cachedStripe;
}

type Body = {
  amount?: number;
  frequency?: "once" | "monthly";
  cancelUrl?: string;
};

const FREQUENCIES = ["once", "monthly"] as const;

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Donations are temporarily unavailable. Please email us to give today.",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const amountResult = validateAmount(body.amount);
  if (!amountResult.ok) {
    return NextResponse.json(
      { ok: false, message: amountResult.message, errors: { amount: amountResult.message } },
      { status: 400 },
    );
  }
  const amount = amountResult.value;

  // Frequency defaults to "once" if missing or invalid; we don't 400 on it
  // because the form's UI never lets the user produce a bad value, so a
  // bad value here is most likely an outdated client cache.
  const freqResult = validateOneOf(body.frequency, FREQUENCIES, "Frequency");
  const frequency: "once" | "monthly" = freqResult.ok ? freqResult.value : "once";
  const isMonthly = frequency === "monthly";

  const origin =
    request.headers.get("origin") ?? new URL(request.url).origin;
  const cancelUrl =
    typeof body.cancelUrl === "string" && body.cancelUrl.startsWith(origin)
      ? body.cancelUrl
      : `${origin}/donate`;

  const productName = isMonthly
    ? "Monthly donation to Umoja"
    : "Donation to Umoja";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isMonthly ? "subscription" : "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: { name: productName },
            ...(isMonthly
              ? { recurring: { interval: "month" as const } }
              : {}),
          },
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      ...(isMonthly ? {} : { submit_type: "donate" as const }),
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, message: "Could not start checkout. Please try again." },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    console.error("[stripe checkout error]", error);
    return NextResponse.json(
      { ok: false, message: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
