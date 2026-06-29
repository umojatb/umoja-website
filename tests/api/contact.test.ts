import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests for POST /api/contact.
 *
 * Mocks the Resend SDK constructor so we never make a real network
 * call. Exercises validation, honeypot, rate limit, and the success/
 * failure paths of the email send.
 */

// Two reasons we hoist BOTH mocks:
// 1. `vi.mock` hoists above top-level `const` declarations, so any
//    closed-over variable (like sendMock) needs to live in vi.hoisted.
// 2. The setup-file's `vi.restoreAllMocks()` runs after every test and
//    clears the implementation on ALL `vi.fn()` mocks — including the
//    Resend constructor inside the factory. We re-install the
//    implementation in beforeEach below.
const { sendMock, ResendCtor } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  ResendCtor: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: ResendCtor,
}));

const VALID = {
  name: "Jane Doe",
  email: "jane@example.com",
  reason: "general",
  message: "Hello there, I have a question about Umoja's programs.",
  company: "",
};

async function loadRoute() {
  return await import("@/app/api/contact/route");
}

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(async () => {
  vi.resetModules();
  // After vi.resetModules(), every dynamic import gets a fresh module
  // instance. The route imports `@/lib/rate-limit` and gets *that*
  // fresh instance. We need to clear the same instance the route is
  // about to use, so import _resetRateLimitBuckets here, after
  // resetModules, to land on the same instance.
  const { _resetRateLimitBuckets } = await import("@/lib/rate-limit");
  _resetRateLimitBuckets();
  // Reinstall mock implementations. `vi.restoreAllMocks()` in the
  // setup file's afterEach clears these between tests.
  ResendCtor.mockReset();
  ResendCtor.mockImplementation(() => ({ emails: { send: sendMock } }));
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "abc" }, error: null });
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.stubEnv("RESEND_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/contact, validation", () => {
  it("returns 400 with errors map when name is missing", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID, name: "" }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { errors: Record<string, string> };
    expect(body.errors.name).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when email is malformed", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID, email: "not-an-email" }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { errors: Record<string, string> };
    expect(body.errors.email).toBeTruthy();
  });

  it("returns 400 when message is too short", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID, message: "hi" }));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { errors: Record<string, string> };
    expect(body.errors.message).toBeTruthy();
  });

  it("returns 400 when reason isn't one of the allowed values", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID, reason: "spam" }));
    expect(res.status).toBe(400);
  });

  it("accepts an empty reason as the optional default", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID, reason: "" }));
    expect(res.status).toBe(200);
  });

  it("returns 400 on malformed JSON body", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest("{notJson"));
    expect(res.status).toBe(400);
  });

  it("first error is surfaced as the top-level message", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID, name: "" }));
    const body = (await res.json()) as { message: string };
    expect(body.message.length).toBeGreaterThan(0);
  });
});

describe("POST /api/contact, honeypot", () => {
  it("silently 200 when the company field is non-empty (bot signal)", async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      makeRequest({ ...VALID, company: "Acme Corp" }),
    );
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("ignores whitespace-only honeypot value as still empty", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ ...VALID, company: "   " }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/contact, rate limit", () => {
  it("blocks the 6th request from the same IP within 10 minutes", async () => {
    const { POST } = await loadRoute();
    const headers = { "x-forwarded-for": "1.2.3.4" };
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(VALID, headers));
      expect(res.status).toBe(200);
    }
    const blocked = await POST(makeRequest(VALID, headers));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
  });

  it("doesn't block requests from a different IP", async () => {
    const { POST } = await loadRoute();
    for (let i = 0; i < 5; i++) {
      await POST(makeRequest(VALID, { "x-forwarded-for": "1.2.3.4" }));
    }
    const otherIp = await POST(
      makeRequest(VALID, { "x-forwarded-for": "5.6.7.8" }),
    );
    expect(otherIp.status).toBe(200);
  });
});

describe("POST /api/contact, send path", () => {
  it("calls Resend with from/to/replyTo/subject/text/html", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.to).toContain("tb@umoja.tbafrica.org");
    expect(args.replyTo).toBe(VALID.email);
    expect(args.subject).toMatch(/Umoja contact form/i);
    expect(args.text).toContain(VALID.message);
    // HTML body is HTML-escaped, so check for a substring that survives
    // entity-encoding (the apostrophe in "Umoja's" becomes `&#39;`).
    expect(args.html).toContain("Hello there");
    expect(args.html).toContain("a question about");
  });

  it("escapes HTML in the html body to prevent injection", async () => {
    const { POST } = await loadRoute();
    const payload = {
      ...VALID,
      message: '<script>alert("xss")</script> normal text',
    };
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(200);
    const args = sendMock.mock.calls[0][0];
    expect(args.html).not.toContain("<script>");
    expect(args.html).toContain("&lt;script&gt;");
    // Plain text body keeps the original (text email is safe).
    expect(args.text).toContain("<script>");
  });

  it("uses the selected reason in the subject line", async () => {
    const { POST } = await loadRoute();
    await POST(makeRequest({ ...VALID, reason: "partnership" }));
    const args = sendMock.mock.calls[0][0];
    expect(args.subject).toMatch(/Partnership/i);
  });

  it("returns 502 when Resend reports an error", async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { message: "API down", name: "ResendError" },
    });
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(502);
  });

  it("returns 502 when Resend throws", async () => {
    sendMock.mockRejectedValueOnce(new Error("network fail"));
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(502);
  });
});

describe("POST /api/contact, env fallback", () => {
  it("returns 200 in dev (NODE_ENV !== production) when RESEND_API_KEY missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "development");
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 503 in production when RESEND_API_KEY missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "production");
    const { POST } = await loadRoute();
    const res = await POST(makeRequest(VALID));
    expect(res.status).toBe(503);
  });
});

describe("POST /api/contact, sanitization", () => {
  it("trims and caps oversized message at 4000 chars before sending", async () => {
    const { POST } = await loadRoute();
    const oversized = "a".repeat(10_000);
    const res = await POST(makeRequest({ ...VALID, message: oversized }));
    expect(res.status).toBe(200);
    const args = sendMock.mock.calls[0][0];
    expect(args.text).toContain("a");
    // The body line "Message:\n<message>" is preceded by other lines
    // (~120 chars). Total text length > 4000 due to header but the
    // message slice itself caps at 4000.
    const messageBlock = args.text.split("Message:\n")[1];
    expect(messageBlock.length).toBe(4000);
  });
});
