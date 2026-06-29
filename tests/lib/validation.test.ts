import { describe, expect, it } from "vitest";
import {
  EMAIL_REGEX,
  MAX_AMOUNT_USD,
  MAX_EMAIL_LEN,
  MAX_NAME_LEN,
  MIN_PHONE_DIGITS,
  validateAmount,
  validateEmail,
  validateLocation,
  validateMotivation,
  validateName,
  validateOneOf,
  validateOptionalUrl,
  validatePhone,
  validateRequiredText,
} from "@/lib/validation";

describe("validateName", () => {
  it("accepts a normal name", () => {
    const r = validateName("Jane Doe");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("Jane Doe");
  });

  it("trims whitespace", () => {
    const r = validateName("  Jane Doe  ");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("Jane Doe");
  });

  it("accepts hyphens, apostrophes, and accented letters", () => {
    expect(validateName("Anne-Marie O'Reilly").ok).toBe(true);
    expect(validateName("Léon Müller").ok).toBe(true);
  });

  it("rejects empty input", () => {
    expect(validateName("").ok).toBe(false);
    expect(validateName("   ").ok).toBe(false);
  });

  it("rejects digits-only input", () => {
    expect(validateName("12345").ok).toBe(false);
  });

  it("rejects single-character input", () => {
    expect(validateName("J").ok).toBe(false);
  });

  it("caps overlong input by truncating before evaluation", () => {
    const r = validateName("J".repeat(MAX_NAME_LEN + 50) + " Doe");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBe(MAX_NAME_LEN);
  });
});

describe("validateEmail", () => {
  it("accepts standard addresses", () => {
    expect(validateEmail("jane@example.com").ok).toBe(true);
    expect(validateEmail("jane.doe+tag@example.co.uk").ok).toBe(true);
  });

  it("rejects empty input", () => {
    expect(validateEmail("").ok).toBe(false);
  });

  it("rejects missing @", () => {
    expect(validateEmail("jane.example.com").ok).toBe(false);
  });

  it("rejects missing TLD", () => {
    expect(validateEmail("jane@example").ok).toBe(false);
  });

  it("rejects whitespace inside the address", () => {
    expect(validateEmail("ja ne@example.com").ok).toBe(false);
  });

  it("rejects values longer than the cap", () => {
    const local = "x".repeat(MAX_EMAIL_LEN);
    expect(validateEmail(`${local}@example.com`).ok).toBe(false);
  });

  it("EMAIL_REGEX matches the expected shape", () => {
    expect(EMAIL_REGEX.test("a@b.c")).toBe(true);
    expect(EMAIL_REGEX.test("a@b")).toBe(false);
  });
});

describe("validatePhone", () => {
  it("accepts international numbers with +", () => {
    expect(validatePhone("+243 999 123 4567").ok).toBe(true);
    expect(validatePhone("+1-555-1234").ok).toBe(true);
  });

  it("accepts (parens) and dots", () => {
    expect(validatePhone("(555) 123.4567").ok).toBe(true);
  });

  it("rejects fewer than the minimum digits", () => {
    const tooShort = "+1 23"; // 3 digits
    const r = validatePhone(tooShort);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain(`${MIN_PHONE_DIGITS} digits`);
  });

  it("rejects letters", () => {
    expect(validatePhone("call-me-maybe").ok).toBe(false);
  });

  it("rejects empty input", () => {
    expect(validatePhone("").ok).toBe(false);
  });
});

describe("validateLocation", () => {
  it("accepts city + country", () => {
    expect(validateLocation("Bukavu, DRC").ok).toBe(true);
  });

  it("rejects empty", () => {
    expect(validateLocation("").ok).toBe(false);
  });

  it("rejects single character", () => {
    expect(validateLocation("X").ok).toBe(false);
  });
});

describe("validateMotivation", () => {
  it("requires the minimum length", () => {
    expect(validateMotivation("short").ok).toBe(false);
    expect(validateMotivation("I want to mentor a scholar.").ok).toBe(true);
  });

  it("uses the supplied label in the error message", () => {
    const r = validateMotivation("", "Tell us why");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain("Tell us why");
  });
});

describe("validateRequiredText", () => {
  it("rejects empty after trim", () => {
    expect(validateRequiredText("   ", "Field").ok).toBe(false);
  });

  it("respects the min option", () => {
    expect(validateRequiredText("ab", "Field", { min: 5 }).ok).toBe(false);
    expect(validateRequiredText("abcde", "Field", { min: 5 }).ok).toBe(true);
  });

  it("caps at max length", () => {
    const value = "a".repeat(10);
    const r = validateRequiredText(value, "Field", { max: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.length).toBe(5);
  });
});

describe("validateOptionalUrl", () => {
  it("accepts empty (optional field)", () => {
    const r = validateOptionalUrl("");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("");
  });

  it("accepts http and https URLs", () => {
    expect(validateOptionalUrl("https://example.com").ok).toBe(true);
    expect(validateOptionalUrl("http://example.com").ok).toBe(true);
  });

  it("rejects javascript: and other schemes", () => {
    expect(validateOptionalUrl("javascript:alert(1)").ok).toBe(false);
    expect(validateOptionalUrl("ftp://example.com").ok).toBe(false);
  });

  it("rejects malformed URLs", () => {
    expect(validateOptionalUrl("not a url").ok).toBe(false);
    expect(validateOptionalUrl("example.com").ok).toBe(false);
  });
});

describe("validateOneOf", () => {
  it("accepts allowed values", () => {
    const r = validateOneOf("Mentor", ["Mentor", "Tutor"] as const, "Role");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("Mentor");
  });

  it("rejects values not in the list", () => {
    expect(validateOneOf("Other", ["A", "B"] as const, "Field").ok).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateOneOf("", ["Mentor"] as const, "Role").ok).toBe(false);
  });

  it("rejects non-string types", () => {
    expect(validateOneOf(null, ["A"] as const, "Field").ok).toBe(false);
    expect(validateOneOf(123, ["A"] as const, "Field").ok).toBe(false);
  });
});

describe("validateAmount", () => {
  it("accepts numbers and numeric strings", () => {
    expect(validateAmount(50).ok).toBe(true);
    expect(validateAmount("50").ok).toBe(true);
  });

  it("rejects below minimum", () => {
    expect(validateAmount(0).ok).toBe(false);
    expect(validateAmount(-5).ok).toBe(false);
  });

  it("rejects above maximum", () => {
    expect(validateAmount(MAX_AMOUNT_USD + 1).ok).toBe(false);
  });

  it("rejects NaN, Infinity, and non-numeric strings", () => {
    expect(validateAmount(NaN).ok).toBe(false);
    expect(validateAmount(Infinity).ok).toBe(false);
    expect(validateAmount("abc").ok).toBe(false);
  });

  it("rounds to whole cents", () => {
    const r = validateAmount(25.5);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(25.5);
  });
});
