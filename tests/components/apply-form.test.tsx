import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApplyForm } from "@/components/forms/apply-form";

/**
 * Tests for the shared <ApplyForm /> component.
 *
 * Covers: title rendering by type prop, conditional field visibility,
 * validation gating of the submit button, the submit happy path
 * (POST /api/submit-application), the success state, the error state.
 */

async function fillCommonFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
  await user.type(screen.getByLabelText(/email/i), "jane@example.com");
  await user.type(screen.getByLabelText(/phone/i), "+1 555 1234");
  await user.type(screen.getByLabelText(/location/i), "Boston, USA");
  await user.type(
    screen.getByLabelText(/motivation/i),
    "I want to help.",
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

describe("ApplyForm rendering, type prop drives title + intro", () => {
  it("renders 'Apply as a Volunteer' for type=volunteer", () => {
    render(<ApplyForm type="volunteer" />);
    expect(
      screen.getByRole("heading", { name: /apply as a volunteer/i }),
    ).toBeInTheDocument();
  });

  it("renders 'Become a Partner' for type=partner", () => {
    render(<ApplyForm type="partner" />);
    expect(
      screen.getByRole("heading", { name: /become a partner/i }),
    ).toBeInTheDocument();
  });
});

describe("ApplyForm rendering, conditional fields by type", () => {
  it("volunteer: shows availability, skills, preferred role; hides partner-only fields", () => {
    render(<ApplyForm type="volunteer" />);
    expect(screen.getByLabelText(/availability/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^skills/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred role/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/organization name/i)).toBeNull();
    expect(screen.queryByLabelText(/partnership type/i)).toBeNull();
    expect(screen.queryByLabelText(/contribution details/i)).toBeNull();
    expect(screen.queryByLabelText(/^website/i)).toBeNull();
  });

  it("partner: shows organization name, partnership type, contribution details, website; hides volunteer-only fields", () => {
    render(<ApplyForm type="partner" />);
    expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/partnership type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contribution details/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^website/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/availability/i)).toBeNull();
    expect(screen.queryByLabelText(/^skills/i)).toBeNull();
    expect(screen.queryByLabelText(/preferred role/i)).toBeNull();
  });

  it("common fields exist for both types", () => {
    for (const type of ["volunteer", "partner"] as const) {
      const { unmount } = render(<ApplyForm type={type} />);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/motivation/i)).toBeInTheDocument();
      unmount();
    }
  });
});

describe("ApplyForm validation gating", () => {
  it("submit button is disabled before any input is provided", () => {
    render(<ApplyForm type="volunteer" />);
    expect(
      screen.getByRole("button", { name: /submit volunteer application/i }),
    ).toBeDisabled();
  });

  it("submit button stays disabled if only common fields are filled (volunteer)", async () => {
    const user = userEvent.setup();
    render(<ApplyForm type="volunteer" />);
    await fillCommonFields(user);
    expect(
      screen.getByRole("button", { name: /submit volunteer application/i }),
    ).toBeDisabled();
  });

  it("submit button stays disabled if only common fields are filled (partner)", async () => {
    const user = userEvent.setup();
    render(<ApplyForm type="partner" />);
    await fillCommonFields(user);
    expect(
      screen.getByRole("button", { name: /submit partnership inquiry/i }),
    ).toBeDisabled();
  });

  it("volunteer: submit enables once availability + skills + preferred role are filled", async () => {
    const user = userEvent.setup();
    render(<ApplyForm type="volunteer" />);
    await fillCommonFields(user);
    await user.type(screen.getByLabelText(/availability/i), "Evenings");
    await user.type(screen.getByLabelText(/^skills/i), "Math");
    await user.selectOptions(
      screen.getByLabelText(/preferred role/i),
      "Mentor",
    );
    expect(
      screen.getByRole("button", { name: /submit volunteer application/i }),
    ).not.toBeDisabled();
  });

  it("partner: submit enables once orgName + partnershipType + contributionDetails are filled (website optional)", async () => {
    const user = userEvent.setup();
    render(<ApplyForm type="partner" />);
    await fillCommonFields(user);
    await user.type(screen.getByLabelText(/organization name/i), "Acme");
    await user.selectOptions(
      screen.getByLabelText(/partnership type/i),
      "Corporate",
    );
    await user.type(
      screen.getByLabelText(/contribution details/i),
      "Sponsor 5 scholars.",
    );
    expect(
      screen.getByRole("button", { name: /submit partnership inquiry/i }),
    ).not.toBeDisabled();
  });
});

describe("ApplyForm submit, happy path", () => {
  it("posts to /api/submit-application with the volunteer payload", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const user = userEvent.setup();
    render(<ApplyForm type="volunteer" />);
    await fillCommonFields(user);
    await user.type(screen.getByLabelText(/availability/i), "Evenings");
    await user.type(screen.getByLabelText(/^skills/i), "Math");
    await user.selectOptions(
      screen.getByLabelText(/preferred role/i),
      "Mentor",
    );
    await user.click(
      screen.getByRole("button", { name: /submit volunteer application/i }),
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/submit-application");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.type).toBe("volunteer");
    expect(body.fullName).toBe("Jane Doe");
    expect(body.email).toBe("jane@example.com");
    expect(body.phone).toBe("+1 555 1234");
    expect(body.location).toBe("Boston, USA");
    expect(body.motivation).toBe("I want to help.");
    expect(body.availability).toBe("Evenings");
    expect(body.skills).toBe("Math");
    expect(body.preferredRole).toBe("Mentor");
    expect(body.orgName).toBeUndefined();
  });

  it("posts to /api/submit-application with the partner payload (website included)", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const user = userEvent.setup();
    render(<ApplyForm type="partner" />);
    await fillCommonFields(user);
    await user.type(screen.getByLabelText(/organization name/i), "Acme");
    await user.selectOptions(
      screen.getByLabelText(/partnership type/i),
      "Corporate",
    );
    await user.type(
      screen.getByLabelText(/contribution details/i),
      "Sponsor 5.",
    );
    await user.type(screen.getByLabelText(/^website/i), "https://acme.example");
    await user.click(
      screen.getByRole("button", { name: /submit partnership inquiry/i }),
    );

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body.type).toBe("partner");
    expect(body.orgName).toBe("Acme");
    expect(body.partnershipType).toBe("Corporate");
    expect(body.contributionDetails).toBe("Sponsor 5.");
    expect(body.website).toBe("https://acme.example");
    expect(body.preferredRole).toBeUndefined();
  });

  it("renders the success state after a 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      ),
    );
    const user = userEvent.setup();
    render(<ApplyForm type="volunteer" />);
    await fillCommonFields(user);
    await user.type(screen.getByLabelText(/availability/i), "x");
    await user.type(screen.getByLabelText(/^skills/i), "x");
    await user.selectOptions(
      screen.getByLabelText(/preferred role/i),
      "Mentor",
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByRole("heading", { name: /thank you/i }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name/i)).toBeNull();
  });
});

describe("ApplyForm submit, error path", () => {
  it("shows an error pill with the server message on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ ok: false, message: "A valid email is required." }),
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<ApplyForm type="volunteer" />);
    await fillCommonFields(user);
    await user.type(screen.getByLabelText(/availability/i), "x");
    await user.type(screen.getByLabelText(/^skills/i), "x");
    await user.selectOptions(
      screen.getByLabelText(/preferred role/i),
      "Mentor",
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/valid email is required/i);
    // Form remains visible (not in success state)
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("falls back to a generic error message when fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network down")),
    );
    const user = userEvent.setup();
    render(<ApplyForm type="volunteer" />);
    await fillCommonFields(user);
    await user.type(screen.getByLabelText(/availability/i), "x");
    await user.type(screen.getByLabelText(/^skills/i), "x");
    await user.selectOptions(
      screen.getByLabelText(/preferred role/i),
      "Mentor",
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBeTruthy();
  });
});
