import { NextResponse } from "next/server";
import {
  validateEmail,
  validateLocation,
  validateMotivation,
  validateName,
  validateOneOf,
  validateOptionalUrl,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";

/**
 * Application submission endpoint for /apply/volunteer and /apply/partner.
 *
 * Validates the payload field-by-field (returning a per-field error map on
 * 400 so the client can hydrate inline errors), then forwards the cleaned
 * payload to a Google Apps Script webhook (URL in `GOOGLE_SHEETS_WEBHOOK_URL`)
 * which appends a row to the connected sheet.
 *
 * In dev with no webhook configured we acknowledge the submission and log
 * a redacted summary (never the full payload — that would put applicant
 * email, phone, and motivation into the dev console). In production a
 * missing webhook returns 503.
 */

const VOLUNTEER_ROLES = [
  "Mentor",
  "Tutor",
  "Workshop facilitator",
  "Other",
] as const;

const PARTNERSHIP_TYPES = [
  "School",
  "Community leader",
  "Corporate",
  "Small business",
  "Other",
] as const;

type ApplyType = "volunteer" | "partner";

type CleanCommon = {
  type: ApplyType;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  motivation: string;
};

type CleanVolunteer = CleanCommon & {
  type: "volunteer";
  availability: string;
  skills: string;
  preferredRole: (typeof VOLUNTEER_ROLES)[number];
};

type CleanPartner = CleanCommon & {
  type: "partner";
  orgName: string;
  partnershipType: (typeof PARTNERSHIP_TYPES)[number];
  contributionDetails: string;
  website: string;
};

type Clean = CleanVolunteer | CleanPartner;

type FieldErrors = Record<string, string>;

function fieldErrorResponse(errors: FieldErrors) {
  // Surface the first field error as the top-level message so callers
  // that only render a banner still see the actual problem (e.g. "Enter
  // a valid email address." instead of a generic "fix the form" line).
  const firstKey = Object.keys(errors)[0];
  const message = firstKey
    ? errors[firstKey]!
    : "Please fix the highlighted fields and try again.";
  return NextResponse.json(
    { ok: false, message, errors },
    { status: 400 },
  );
}

function validatePayload(
  body: Record<string, unknown>,
): { ok: true; payload: Clean } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const typeResult = validateOneOf<ApplyType>(
    body.type,
    ["volunteer", "partner"],
    "Application type",
  );
  if (!typeResult.ok) {
    errors.type = typeResult.message;
    return { ok: false, errors };
  }

  const checks: Array<[string, ReturnType<typeof validateEmail>]> = [
    ["fullName", validateName(body.fullName)],
    ["email", validateEmail(body.email)],
    ["phone", validatePhone(body.phone)],
    ["location", validateLocation(body.location)],
    ["motivation", validateMotivation(body.motivation)],
  ];

  for (const [key, result] of checks) {
    if (!result.ok) errors[key] = result.message;
  }

  if (typeResult.value === "volunteer") {
    const availability = validateRequiredText(body.availability, "Availability");
    const skills = validateRequiredText(body.skills, "Skills");
    const role = validateOneOf(body.preferredRole, VOLUNTEER_ROLES, "Preferred role");
    if (!availability.ok) errors.availability = availability.message;
    if (!skills.ok) errors.skills = skills.message;
    if (!role.ok) errors.preferredRole = role.message;

    if (Object.keys(errors).length) return { ok: false, errors };
    return {
      ok: true,
      payload: {
        type: "volunteer",
        fullName: (checks[0][1] as { value: string }).value,
        email: (checks[1][1] as { value: string }).value,
        phone: (checks[2][1] as { value: string }).value,
        location: (checks[3][1] as { value: string }).value,
        motivation: (checks[4][1] as { value: string }).value,
        availability: availability.ok ? availability.value : "",
        skills: skills.ok ? skills.value : "",
        preferredRole: role.ok ? role.value : "Other",
      },
    };
  }

  const orgName = validateRequiredText(body.orgName, "Organization name");
  const partnershipType = validateOneOf(
    body.partnershipType,
    PARTNERSHIP_TYPES,
    "Partnership type",
  );
  const contribution = validateRequiredText(
    body.contributionDetails,
    "Contribution details",
    { min: 10 },
  );
  const website = validateOptionalUrl(body.website);

  if (!orgName.ok) errors.orgName = orgName.message;
  if (!partnershipType.ok) errors.partnershipType = partnershipType.message;
  if (!contribution.ok) errors.contributionDetails = contribution.message;
  if (!website.ok) errors.website = website.message;

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    payload: {
      type: "partner",
      fullName: (checks[0][1] as { value: string }).value,
      email: (checks[1][1] as { value: string }).value,
      phone: (checks[2][1] as { value: string }).value,
      location: (checks[3][1] as { value: string }).value,
      motivation: (checks[4][1] as { value: string }).value,
      orgName: orgName.ok ? orgName.value : "",
      partnershipType: partnershipType.ok ? partnershipType.value : "Other",
      contributionDetails: contribution.ok ? contribution.value : "",
      website: website.ok ? website.value : "",
    },
  };
}

function redactedSummary(payload: Clean): Record<string, unknown> {
  const emailDomain = payload.email.split("@")[1] ?? "(unknown)";
  return {
    type: payload.type,
    emailDomain,
    location: payload.location,
    motivationLength: payload.motivation.length,
    ...(payload.type === "volunteer"
      ? { preferredRole: payload.preferredRole }
      : {
          partnershipType: payload.partnershipType,
          orgNameLength: payload.orgName.length,
        }),
  };
}

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const result = validatePayload(raw);
  if (!result.ok) {
    return fieldErrorResponse(result.errors);
  }

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const submittedAt = new Date().toISOString();
  const enriched = { ...result.payload, submittedAt };

  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[apply] GOOGLE_SHEETS_WEBHOOK_URL not configured in production.",
      );
      return NextResponse.json(
        {
          ok: false,
          message: "Submission service is not configured. Please email us instead.",
        },
        { status: 503 },
      );
    }
    console.warn(
      "[apply] GOOGLE_SHEETS_WEBHOOK_URL missing, accepted submission summary:",
      redactedSummary(result.payload),
    );
    return NextResponse.json({ ok: true });
  }

  warnIfUrlLooksWrong(webhook);
  const startedAt = Date.now();

  try {
    const upstream = await postWithRetry(webhook, JSON.stringify(enriched));
    if (!upstream.ok) {
      console.error(
        "[apply] webhook returned non-2xx after retries:",
        upstream.status,
        "host=",
        safeHost(webhook),
        "elapsed=",
        Date.now() - startedAt,
        "ms",
        await upstream.text().catch(() => ""),
      );
      return NextResponse.json(
        { ok: false, message: "Could not save your application. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const timedOut = isTimeoutError(error);
    const causeStr =
      error instanceof Error && "cause" in error
        ? String((error as { cause?: unknown }).cause)
        : "";
    const isConnectTimeout = causeStr.includes("ConnectTimeoutError");
    const isDnsFail = causeStr.includes("EAI_AGAIN") || causeStr.includes("ENOTFOUND");
    const phase = timedOut
      ? "response timeout"
      : isConnectTimeout
        ? "connect timeout (network can't reach host)"
        : isDnsFail
          ? "DNS lookup failed"
          : "fetch failed";
    console.error(
      "[apply] webhook fetch failed:",
      `phase=${phase}`,
      "host=",
      safeHost(webhook),
      "elapsed=",
      Date.now() - startedAt,
      "ms",
      error,
    );
    return NextResponse.json(
      {
        ok: false,
        message: timedOut
          ? "The submission service is slow to respond right now. Please try again in a minute, or email us."
          : "Could not save your application. Please try again.",
      },
      { status: 502 },
    );
  }
}

// 10 seconds. Apps Script Web Apps redirect through
// script.googleusercontent.com and on cold start the script container
// can take 5-10 seconds to spin up before our payload is even processed.
// 6s left no margin and timed out on every cold start. Apps Script's
// own response budget is 30s, so 10s is conservative.
const FETCH_TIMEOUT_MS = 10_000;
const RETRY_TIMEOUT_MS = 5_000;
const RETRY_BACKOFF_MS = 500;

/**
 * POST `body` to `url` with at most one retry, only on connection-layer
 * failure (DNS / refused / reset).
 *
 * We deliberately do NOT retry on response timeout: a timeout means the
 * script is still running on Google's side, and a second request just
 * hits a fresh cold-start container or the same slow script. Retrying
 * doubles the wait without improving the outcome. Connection errors
 * are different — those are transient infra hiccups (DNS resolver
 * blip, TLS reset) that often clear on a 500ms re-attempt.
 *
 * Worst-case wall time: 10.5s on a connection-error retry, 10s on a
 * clean timeout.
 */
async function postWithRetry(url: string, body: string): Promise<Response> {
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  };
  try {
    return await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (firstError) {
    if (!isConnectionError(firstError)) throw firstError;
    await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS));
    return await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(RETRY_TIMEOUT_MS),
    });
  }
}

function isConnectionError(error: unknown): boolean {
  // Node's undici wraps DNS / connect / reset failures as
  // `TypeError("fetch failed")` with the underlying cause attached.
  // Timeouts are DOMException, NOT TypeError, so this branch
  // intentionally excludes them.
  return error instanceof TypeError;
}

function isTimeoutError(error: unknown): boolean {
  // AbortSignal.timeout() rejects with DOMException name "TimeoutError"
  // per the WHATWG spec. Manual aborts produce "AbortError".
  if (
    error instanceof DOMException &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  ) {
    return true;
  }
  return false;
}

/**
 * Soft sanity check on the webhook URL shape. We don't fail the request
 * if it doesn't match — a custom webhook host is plausible — but a loud
 * dev-time warning catches the common copy-paste mistake (pasting the
 * spreadsheet share URL instead of the Apps Script /exec URL).
 */
const APPS_SCRIPT_URL_RE =
  /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(\?.*)?$/;

let urlPatternWarned = false;
function warnIfUrlLooksWrong(url: string): void {
  if (urlPatternWarned) return;
  if (APPS_SCRIPT_URL_RE.test(url)) return;
  urlPatternWarned = true;
  console.warn(
    "[apply] GOOGLE_SHEETS_WEBHOOK_URL doesn't match the expected Apps Script /exec pattern.",
    "Got host:",
    safeHost(url),
    "— if submissions fail, double-check Deploy -> Web app -> /exec URL.",
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "(unparseable URL)";
  }
}
