import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DonationForm } from "@/app/donate/donation-form";

/**
 * Tests for the <DonationForm /> on /donate.
 *
 * Covers: defaults, frequency toggle, preset / custom amount selection,
 * dynamic submit-button label, submit POSTing to
 * /api/create-checkout-session, redirect on success, error display, and
 * the submit being disabled while the request is inflight.
 */

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ ok: true, url: "https://checkout.stripe.com/x" }),
        { status: 200 },
      ),
    ),
  );
  // jsdom has window.location but assigning .href triggers navigation;
  // stub it with a writable href so tests can observe the redirect.
  Object.defineProperty(window, "location", {
    value: {
      href: "http://localhost:3000/donate",
      assign: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DonationForm rendering, defaults", () => {
  it("renders frequency toggle with One-time + Monthly", () => {
    render(<DonationForm />);
    expect(screen.getByLabelText(/one-time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^monthly$/i)).toBeInTheDocument();
  });

  it("renders four amount choices: $25, $50, $100, Custom", () => {
    render(<DonationForm />);
    expect(screen.getByLabelText("$25")).toBeInTheDocument();
    expect(screen.getByLabelText("$50")).toBeInTheDocument();
    expect(screen.getByLabelText("$100")).toBeInTheDocument();
    expect(screen.getByLabelText(/custom/i)).toBeInTheDocument();
  });

  it("default selection is monthly + $50, button reflects this", () => {
    render(<DonationForm />);
    expect(
      screen.getByRole("button", { name: /donate \$50 \/ month/i }),
    ).toBeInTheDocument();
  });
});

describe("DonationForm interaction, button label updates", () => {
  it("switching to one-time drops the '/ month' suffix", async () => {
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByLabelText(/one-time/i));
    expect(
      screen.getByRole("button", { name: /^donate \$50$/i }),
    ).toBeInTheDocument();
  });

  it("switching to $100 monthly updates the label", async () => {
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByLabelText("$100"));
    expect(
      screen.getByRole("button", { name: /donate \$100 \/ month/i }),
    ).toBeInTheDocument();
  });

  it("custom amount input only appears when Custom is selected", async () => {
    const user = userEvent.setup();
    render(<DonationForm />);
    expect(screen.queryByLabelText(/custom amount/i)).toBeNull();
    await user.click(screen.getByLabelText(/^custom$/i));
    expect(screen.getByLabelText(/custom amount/i)).toBeInTheDocument();
  });

  it("typing into custom amount updates the label and enables submit", async () => {
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByLabelText(/^custom$/i));
    await user.type(screen.getByLabelText(/custom amount/i), "73");
    expect(
      screen.getByRole("button", { name: /donate \$73 \/ month/i }),
    ).toBeInTheDocument();
  });

  it("custom amount of 0 keeps the submit in 'Choose an amount' state", async () => {
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByLabelText(/^custom$/i));
    expect(
      screen.getByRole("button", { name: /choose an amount/i }),
    ).toBeDisabled();
  });
});

describe("DonationForm submit, happy path", () => {
  it("POSTs to /api/create-checkout-session with amount, frequency, and same-origin cancelUrl", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ ok: true, url: "https://checkout.stripe.com/x" }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByLabelText(/one-time/i));
    await user.click(screen.getByLabelText("$25"));
    await user.click(screen.getByRole("button", { name: /donate \$25/i }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/create-checkout-session");
    const body = JSON.parse(init.body);
    expect(body.amount).toBe(25);
    expect(body.frequency).toBe("once");
    expect(body.cancelUrl).toBe("http://localhost:3000/donate");
  });

  it("redirects to the Stripe URL on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: true,
            url: "https://checkout.stripe.com/c/pay/cs_test_123",
          }),
          { status: 200 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByRole("button", { name: /donate \$50/i }));
    // Microtask flush
    await Promise.resolve();
    await Promise.resolve();
    // Form now uses `window.location.assign(url)` for explicit semantics
    // (more reliable than `href = url` after async chains on iOS Safari).
    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith(
      "https://checkout.stripe.com/c/pay/cs_test_123",
    );
  });

  it("renders a visible fallback link if the auto-redirect drops", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: true,
            url: "https://checkout.stripe.com/c/pay/cs_test_999",
          }),
          { status: 200 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByRole("button", { name: /donate \$50/i }));
    // The fallback link must render even on the happy path so a dropped
    // navigation (iOS Safari edge case) leaves the user with a tappable
    // continuation, not a stuck form.
    const link = await screen.findByRole("link", {
      name: /tap here to continue to checkout/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://checkout.stripe.com/c/pay/cs_test_999",
    );
  });
});

describe("DonationForm submit, error path", () => {
  it("displays server error message on non-ok JSON response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: false,
            message: "Donations are temporarily unavailable.",
          }),
          { status: 503 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByRole("button", { name: /donate \$50/i }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/temporarily unavailable/i);
  });

  it("displays a generic error if fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network down")),
    );
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByRole("button", { name: /donate \$50/i }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBeTruthy();
  });

  it("errors do not redirect away from /donate", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, message: "x" }), {
          status: 400,
        }),
      ),
    );
    const user = userEvent.setup();
    render(<DonationForm />);
    await user.click(screen.getByRole("button", { name: /donate \$50/i }));
    await screen.findByRole("alert");
    expect(window.location.href).toBe("http://localhost:3000/donate");
  });
});
