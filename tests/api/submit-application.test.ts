import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests for POST /api/submit-application.
 *
 * The route forwards JSON to a Google Sheets webhook (URL in env). Tests
 * exercise validation paths (no Stripe-style env required), and stub
 * `fetch` globally to verify upstream forwarding behavior + error
 * mapping (5xx → 502, network throw → 502, 2xx → 200).
 */

/**
 * What the Apps Script actually returns on a successful append.
 *
 * Google's ContentService answers HTTP 200 on every code path, so the
 * status line carries no information about whether the row was
 * written. The `success` flag in the body is the only real signal, and
 * these mocks must mirror that or the tests assert a contract the
 * production webhook does not honour.
 */
const SUCCESS_RESPONSE = () =>
  new Response(JSON.stringify({ success: true }), { status: 200 });

/** An Apps Script failure: still HTTP 200, but success is false. */
const SCRIPT_ERROR_RESPONSE = (error = "Could not acquire lock.") =>
  new Response(JSON.stringify({ success: false, error }), { status: 200 });

const VALID_VOLUNTEER = {
  type: "volunteer" as const,
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 555 1234",
  location: "Boston, USA",
  motivation: "I want to mentor a scholar.",
  availability: "Weekday evenings, 2 hours / week",
  skills: "Math, software engineering",
  preferredRole: "Mentor",
};

const VALID_PARTNER = {
  type: "partner" as const,
  fullName: "Sam Director",
  email: "sam@partner.org",
  phone: "+1 555 9999",
  location: "London, UK",
  motivation: "We want to fund a cohort.",
  orgName: "Acme Foundation",
  partnershipType: "Corporate",
  contributionDetails: "Sponsor 5 scholars / year + internships.",
  website: "https://acme.example",
};

async function loadRoute() {
  return await import("@/app/api/submit-application/route");
}

function makeRequest(
  body: unknown,
  opts: { raw?: boolean } = {},
): Request {
  return new Request("http://localhost:3000/api/submit-application", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: opts.raw ? (body as string) : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetModules();
  // Route intentionally calls console.error/warn on the error paths we
  // exercise here; silence them so the test output stays readable.
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "log").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/submit-application, request body parsing", () => {
  it("returns 400 when the body is not valid JSON", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest("garbage", { raw: true }));
    expect(res.status).toBe(400);
    expect((await res.json()).ok).toBe(false);
  });
});

describe("POST /api/submit-application, type discrimination", () => {
  it("returns 400 when type is missing", async () => {
    const { POST } = await loadRoute();
    const { type: _t, ...rest } = VALID_VOLUNTEER;
    void _t;
    const res = await POST(makeRequest(rest));
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/application type/i);
  });

  it("returns 400 when type is not one of volunteer | partner", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID_VOLUNTEER, type: "donor" }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/submit-application, common-field validation", () => {
  for (const field of ["fullName", "email", "phone", "location", "motivation"] as const) {
    it(`returns 400 when ${field} is missing or blank`, async () => {
      const { POST } = await loadRoute();
      const payload = { ...VALID_VOLUNTEER, [field]: "" };
      const res = await POST(makeRequest(payload));
      expect(res.status).toBe(400);
    });
  }

  it("returns 400 when email is malformed", async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      makeRequest({ ...VALID_VOLUNTEER, email: "not-an-email" }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/email/i);
  });

  it("trims whitespace, treating whitespace-only fields as missing", async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      makeRequest({ ...VALID_VOLUNTEER, fullName: "   " }),
    );
    expect(res.status).toBe(400);
  });
});

describe("POST /api/submit-application, volunteer-specific validation", () => {
  for (const field of ["availability", "skills", "preferredRole"] as const) {
    it(`returns 400 when ${field} is missing`, async () => {
      const { POST } = await loadRoute();
      const res = await POST(
        makeRequest({ ...VALID_VOLUNTEER, [field]: "" }),
      );
      expect(res.status).toBe(400);
    });
  }
});

describe("POST /api/submit-application, partner-specific validation", () => {
  for (const field of [
    "orgName",
    "partnershipType",
    "contributionDetails",
  ] as const) {
    it(`returns 400 when ${field} is missing`, async () => {
      const { POST } = await loadRoute();
      const res = await POST(
        makeRequest({ ...VALID_PARTNER, [field]: "" }),
      );
      expect(res.status).toBe(400);
    });
  }

  it("accepts partner submissions WITHOUT a website (optional field)", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    const { POST } = await loadRoute();
    const { website: _w, ...rest } = VALID_PARTNER;
    void _w;
    const res = await POST(makeRequest(rest));
    expect(res.status).toBe(200);
  });
});

describe("POST /api/submit-application, dev fallback (no webhook)", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "");
    vi.stubEnv("NODE_ENV", "development");
  });

  it("returns 200 with no webhook configured (volunteer)", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("returns 200 with no webhook configured (partner)", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_PARTNER));
    expect(res.status).toBe(200);
  });

  it("does not call fetch when no webhook is configured", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { POST } = await loadRoute();
    await POST(makeRequest(VALID_VOLUNTEER));
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("POST /api/submit-application, prod with no webhook", () => {
  it("returns 503 when GOOGLE_SHEETS_WEBHOOK_URL is unset in production", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.message).toMatch(/not configured/i);
  });
});

describe("POST /api/submit-application, webhook forwarding", () => {
  beforeEach(() => {
    vi.stubEnv(
      "GOOGLE_SHEETS_WEBHOOK_URL",
      "https://script.google.com/macros/s/abc/exec",
    );
  });

  it("forwards a valid volunteer payload via fetch and returns 200 on 2xx upstream", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("https://script.google.com/macros/s/abc/exec");
    expect(init.method).toBe("POST");
    const sent = JSON.parse(init.body);
    expect(sent.type).toBe("volunteer");
    expect(sent.fullName).toBe(VALID_VOLUNTEER.fullName);
    expect(sent.preferredRole).toBe(VALID_VOLUNTEER.preferredRole);
    expect(typeof sent.submittedAt).toBe("string");
    expect(Number.isNaN(Date.parse(sent.submittedAt))).toBe(false);
  });

  it("forwards a valid partner payload (with all partner fields)", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(SUCCESS_RESPONSE());
    vi.stubGlobal("fetch", fetchSpy);
    const { POST } = await loadRoute();
    await POST(makeRequest(VALID_PARTNER));
    const sent = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(sent.orgName).toBe(VALID_PARTNER.orgName);
    expect(sent.partnershipType).toBe(VALID_PARTNER.partnershipType);
    expect(sent.contributionDetails).toBe(VALID_PARTNER.contributionDetails);
    expect(sent.website).toBe(VALID_PARTNER.website);
  });

  it("returns 502 when the upstream webhook returns a non-2xx status", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response("", { status: 500 }));
    vi.stubGlobal("fetch", fetchSpy);
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(502);
    expect((await res.json()).ok).toBe(false);
  });

  /**
   * Regression guard for silent data loss.
   *
   * Apps Script returns HTTP 200 even when it refuses to write the row,
   * so a route that trusts `upstream.ok` tells the applicant
   * "Application received" while their submission is discarded, with
   * nothing logged. These cases pin the body-level check that prevents
   * that. They were absent from the original suite, which is exactly
   * why the bug shipped.
   */
  it("returns 502 when the script reports success:false despite HTTP 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(SCRIPT_ERROR_RESPONSE()));
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(502);
    expect((await res.json()).ok).toBe(false);
  });

  it("returns 502 when the script echoes an Invalid type error on HTTP 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(SCRIPT_ERROR_RESPONSE("Invalid type.")),
    );
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_PARTNER));
    expect(res.status).toBe(502);
  });

  it("returns 502 when the upstream body is HTML rather than JSON", async () => {
    // Happens when the Web App deployment is not public: Google serves
    // a login interstitial with a 200 instead of the script's JSON.
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response("<!DOCTYPE html><html>Sign in</html>", { status: 200 }),
        ),
    );
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(502);
  });

  it("returns 502 when the upstream body is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 200 })),
    );
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(502);
  });

  it("returns 200 only when the script confirms success:true", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(SUCCESS_RESPONSE()));
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("returns 502 when fetch throws (network error)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    );
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID_VOLUNTEER));
    expect(res.status).toBe(502);
  });

  it("truncates oversized fields to 4000 chars before forwarding", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(SUCCESS_RESPONSE());
    vi.stubGlobal("fetch", fetchSpy);
    const oversized = "x".repeat(10_000);
    const { POST } = await loadRoute();
    const res = await POST(
      makeRequest({ ...VALID_VOLUNTEER, motivation: oversized }),
    );
    expect(res.status).toBe(200);
    const sent = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(sent.motivation.length).toBe(4000);
  });
});
