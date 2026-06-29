import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests for POST /api/create-checkout-session.
 *
 * The route caches its Stripe instance at module scope, so every test
 * resets modules and re-imports the route after stubbing env + mocking
 * the `stripe` package. The Stripe mock exposes the constructor so each
 * test can assert what arguments the route passed to
 * `checkout.sessions.create`.
 */

type StripeMock = {
  checkout: {
    sessions: {
      create: ReturnType<typeof vi.fn>;
    };
  };
};

let createMock: ReturnType<typeof vi.fn>;
let constructorMock: ReturnType<typeof vi.fn>;

vi.mock("stripe", () => {
  const ctor = vi.fn();
  return {
    default: ctor,
  };
});

async function loadRoute() {
  return await import("@/app/api/create-checkout-session/route");
}

function makeRequest(
  body: unknown,
  opts: { origin?: string; raw?: boolean } = {},
): Request {
  const origin = opts.origin ?? "http://localhost:3000";
  return new Request(`${origin}/api/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
    },
    body: opts.raw ? (body as string) : JSON.stringify(body),
  });
}

beforeEach(async () => {
  vi.resetModules();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  createMock = vi.fn();
  const mock: StripeMock = {
    checkout: { sessions: { create: createMock } },
  };
  const stripeModule = await import("stripe");
  constructorMock = stripeModule.default as unknown as ReturnType<
    typeof vi.fn
  >;
  constructorMock.mockReset();
  constructorMock.mockImplementation(() => mock);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/create-checkout-session, env / fail-fast", () => {
  it("returns 503 with a friendly message when STRIPE_SECRET_KEY is unset", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: 50, frequency: "once" }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.message).toMatch(/temporarily unavailable/i);
    expect(constructorMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/create-checkout-session, request body validation", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
  });

  it("returns 400 when the body is not valid JSON", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest("not-json", { raw: true }));
    expect(res.status).toBe(400);
    expect((await res.json()).ok).toBe(false);
  });

  it("returns 400 when amount is missing", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ frequency: "once" }));
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/amount/i);
  });

  it("returns 400 when amount is zero", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: 0, frequency: "once" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when amount is negative", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: -50, frequency: "once" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when amount exceeds the cap", async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      makeRequest({ amount: 100_001, frequency: "once" }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when amount is non-numeric", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: "not-a-number" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when amount is NaN", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: Number.NaN }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/create-checkout-session, valid one-time donation", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
  });

  it("returns 200 and the Stripe URL on success", async () => {
    createMock.mockResolvedValueOnce({ url: "https://checkout.stripe.com/x" });
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: 25, frequency: "once" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.url).toBe("https://checkout.stripe.com/x");
  });

  it("calls Stripe with mode=payment, USD, correct unit_amount, no recurring", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(makeRequest({ amount: 25, frequency: "once" }));
    expect(createMock).toHaveBeenCalledTimes(1);
    const arg = createMock.mock.calls[0][0];
    expect(arg.mode).toBe("payment");
    expect(arg.line_items[0].price_data.currency).toBe("usd");
    expect(arg.line_items[0].price_data.unit_amount).toBe(2500);
    expect(arg.line_items[0].price_data.recurring).toBeUndefined();
    expect(arg.submit_type).toBe("donate");
  });

  it("uses the request origin for success_url and the default cancel_url", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(
      makeRequest(
        { amount: 25, frequency: "once" },
        { origin: "https://example.org" },
      ),
    );
    const arg = createMock.mock.calls[0][0];
    expect(arg.success_url).toBe(
      "https://example.org/success?session_id={CHECKOUT_SESSION_ID}",
    );
    expect(arg.cancel_url).toBe("https://example.org/donate");
  });

  it("honours a same-origin cancelUrl", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(
      makeRequest({
        amount: 25,
        frequency: "once",
        cancelUrl: "http://localhost:3000/donate?from=hero",
      }),
    );
    expect(createMock.mock.calls[0][0].cancel_url).toBe(
      "http://localhost:3000/donate?from=hero",
    );
  });

  it("rejects a cross-origin cancelUrl, falling back to /donate", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(
      makeRequest({
        amount: 25,
        frequency: "once",
        cancelUrl: "https://malicious.example/steal",
      }),
    );
    expect(createMock.mock.calls[0][0].cancel_url).toBe(
      "http://localhost:3000/donate",
    );
  });

  it("converts whole-dollar amounts to integer cents (Math.round)", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(makeRequest({ amount: 73, frequency: "once" }));
    expect(
      createMock.mock.calls[0][0].line_items[0].price_data.unit_amount,
    ).toBe(7300);
  });

  it("converts cleanly-representable fractional amounts to integer cents", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    // 25.5 represents exactly in float; 25.5 * 100 = 2550 with no drift
    await POST(makeRequest({ amount: 25.5, frequency: "once" }));
    expect(
      createMock.mock.calls[0][0].line_items[0].price_data.unit_amount,
    ).toBe(2550);
  });
});

describe("POST /api/create-checkout-session, valid monthly donation", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
  });

  it("calls Stripe with mode=subscription + recurring monthly", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(makeRequest({ amount: 50, frequency: "monthly" }));
    const arg = createMock.mock.calls[0][0];
    expect(arg.mode).toBe("subscription");
    expect(arg.line_items[0].price_data.recurring).toEqual({
      interval: "month",
    });
    expect(arg.submit_type).toBeUndefined();
  });

  it("treats unknown frequency values as one-time payment", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(makeRequest({ amount: 50, frequency: "weird" }));
    expect(createMock.mock.calls[0][0].mode).toBe("payment");
  });

  it("treats missing frequency as one-time payment", async () => {
    createMock.mockResolvedValueOnce({ url: "https://x" });
    const { POST } = await loadRoute();
    await POST(makeRequest({ amount: 50 }));
    expect(createMock.mock.calls[0][0].mode).toBe("payment");
  });
});

describe("POST /api/create-checkout-session, error paths", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
  });

  it("returns 500 when stripe throws", async () => {
    createMock.mockRejectedValueOnce(new Error("Stripe down"));
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: 25, frequency: "once" }));
    expect(res.status).toBe(500);
    expect((await res.json()).ok).toBe(false);
  });

  it("returns 500 when stripe returns a session without a url", async () => {
    createMock.mockResolvedValueOnce({ url: null });
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ amount: 25, frequency: "once" }));
    expect(res.status).toBe(500);
  });
});
