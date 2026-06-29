import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/app/contact/contact-form";

/**
 * Tests for the refactored <ContactForm /> (server-side send via
 * /api/contact, no mailto: redirect). Covers happy path, error path,
 * field validation gating, and success state rendering.
 */

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), "Jane Doe");
  await user.type(screen.getByLabelText(/your email/i), "jane@example.com");
  await user.type(
    screen.getByLabelText(/^message$/i),
    "Hello, I'd love to learn more.",
  );
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ContactForm rendering", () => {
  it("renders all visible inputs", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument();
  });

  it("renders the send button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });
});

describe("ContactForm validation gating", () => {
  it("disables submit until name + email + message are valid", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeDisabled();
  });

  it("enables submit once required fields are filled", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).not.toBeDisabled();
  });
});

describe("ContactForm submit, happy path", () => {
  it("posts to /api/contact and shows success state", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.name).toBe("Jane Doe");
    expect(body.email).toBe("jane@example.com");
    expect(body.message).toBe("Hello, I'd love to learn more.");
    expect(body.company).toBe("");

    expect(
      await screen.findByRole("heading", { name: /message sent/i }),
    ).toBeInTheDocument();
  });

  it("doesn't redirect via mailto:", async () => {
    const original = window.location.href;
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await screen.findByRole("heading", { name: /message sent/i });
    expect(window.location.href).toBe(original);
  });
});

describe("ContactForm submit, error path", () => {
  it("shows the server error message in an alert pill", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ ok: false, message: "Email service is down." }),
          { status: 502 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/email service is down/i);
    // Form stays mounted (not in success state)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  });

  it("falls back to a generic error when fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network down")),
    );
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBeTruthy();
  });

  it("hydrates per-field errors from the server response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: false,
            message: "Validation failed, please check the form.",
            errors: { email: "Custom email rule failed on the server." },
          }),
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    // Inline error is the per-field message returned by the server.
    expect(
      await screen.findByText(/custom email rule failed/i),
    ).toBeInTheDocument();
    // Banner pill is the top-level message.
    expect(screen.getByRole("alert")).toHaveTextContent(/validation failed/i);
  });
});

describe("ContactForm honeypot", () => {
  it("includes the honeypot field in the payload (always empty for real users)", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.company).toBe("");
  });
});
