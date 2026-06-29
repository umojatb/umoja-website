import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  CONTACT_EMAIL_DEFAULT,
  CONTACT_FROM_DEFAULT,
} from "@/lib/site-config";
import { clientIpFromRequest, rateLimit } from "@/lib/rate-limit";
import {
  validateEmail,
  validateMotivation,
  validateName,
  validateOneOf,
} from "@/lib/validation";

/**
 * Server-side contact form endpoint.
 *
 * Validates the payload, applies a tiny IP-keyed rate limit, and sends
 * a notification email via Resend to `CONTACT_EMAIL` with the
 * applicant's address as `replyTo`. The form posts to this route via
 * fetch; there's no `mailto:` redirect anywhere, so the user does not
 * need a configured mail client on their device.
 *
 * Honeypot: a hidden form field named `company` should always be
 * empty for real submissions. If it's non-empty, we silently 200
 * (returning a fake "thank you") to keep bots in the dark while
 * dropping the message.
 *
 * If `RESEND_API_KEY` is not configured we log the message in dev
 * (returns 200 so the form UI is testable) and return 503 in
 * production with a friendly message.
 */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

const REASON_VALUES = [
  "",
  "general",
  "partnership",
  "donation",
  "volunteering",
  "other",
] as const;

const REASON_LABELS: Record<(typeof REASON_VALUES)[number], string> = {
  "": "Message",
  general: "General question",
  partnership: "Partnership",
  donation: "Donation question",
  volunteering: "Volunteering",
  other: "Other",
};

type Body = {
  name?: unknown;
  email?: unknown;
  reason?: unknown;
  message?: unknown;
  // Honeypot field. Must be empty.
  company?: unknown;
};

type FieldErrors = Record<string, string>;

let cachedResend: Resend | null = null;
function getResend(): Resend | null {
  if (cachedResend) return cachedResend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cachedResend = new Resend(key);
  return cachedResend;
}

function recipient(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL || CONTACT_EMAIL_DEFAULT;
}

function sender(): string {
  // Resend requires a verified domain for production sends. In dev,
  // the default Resend onboarding sender works without verification.
  return process.env.CONTACT_FROM_EMAIL || CONTACT_FROM_DEFAULT;
}

function fieldErrorResponse(errors: FieldErrors) {
  const firstKey = Object.keys(errors)[0];
  const message = firstKey
    ? errors[firstKey]!
    : "Please fix the highlighted fields and try again.";
  return NextResponse.json(
    { ok: false, message, errors },
    { status: 400 },
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let raw: Body;
  try {
    raw = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot: a non-empty `company` field means a bot filled the form.
  // Return a fake-success 200 so the bot moves on without retrying.
  if (typeof raw.company === "string" && raw.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Rate limit by IP. Returns 429 on overflow.
  const ip = clientIpFromRequest(request);
  const limit = rateLimit(`contact:${ip}`, {
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
  });
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "You're sending messages too quickly. Please try again in a few minutes.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  // Validate.
  const errors: FieldErrors = {};
  const nameResult = validateName(raw.name, "Your name");
  const emailResult = validateEmail(raw.email);
  const messageResult = validateMotivation(raw.message, "Message");
  const reasonResult = validateOneOf(
    raw.reason ?? "",
    REASON_VALUES,
    "Reason",
  );
  if (!nameResult.ok) errors.name = nameResult.message;
  if (!emailResult.ok) errors.email = emailResult.message;
  if (!messageResult.ok) errors.message = messageResult.message;
  if (!reasonResult.ok) errors.reason = reasonResult.message;
  if (Object.keys(errors).length) return fieldErrorResponse(errors);

  const name = (nameResult as { value: string }).value;
  const email = (emailResult as { value: string }).value;
  const message = (messageResult as { value: string }).value;
  const reasonKey = (reasonResult as { value: (typeof REASON_VALUES)[number] })
    .value;
  const reasonLabel = REASON_LABELS[reasonKey];

  const subject = `Umoja contact form, ${reasonLabel}`;
  const submittedAt = new Date().toISOString();
  const text = [
    `New message from the Umoja contact form.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Reason: ${reasonLabel}`,
    `Submitted: ${submittedAt}`,
    ``,
    `Message:`,
    message,
  ].join("\n");
  const html = [
    `<p>New message from the Umoja contact form.</p>`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}<br>`,
    `<strong>Email:</strong> ${escapeHtml(email)}<br>`,
    `<strong>Reason:</strong> ${escapeHtml(reasonLabel)}<br>`,
    `<strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>`,
    `<p><strong>Message:</strong></p>`,
    `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>`,
  ].join("\n");

  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] RESEND_API_KEY not configured in production.");
      return NextResponse.json(
        {
          ok: false,
          message:
            "The contact form is temporarily unavailable. Please email us directly.",
        },
        { status: 503 },
      );
    }
    console.warn("[contact] RESEND_API_KEY missing, message logged only:", {
      from: sender(),
      to: recipient(),
      replyTo: email,
      subject,
      preview: message.slice(0, 200),
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const result = await resend.emails.send({
      from: sender(),
      to: recipient(),
      replyTo: email,
      subject,
      text,
      html,
    });
    if (result.error) {
      console.error("[contact] Resend send failed:", result.error);
      return NextResponse.json(
        {
          ok: false,
          message:
            "Couldn't send your message right now. Please try again, or email us directly.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Resend send threw:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Couldn't send your message right now. Please try again, or email us directly.",
      },
      { status: 502 },
    );
  }
}
