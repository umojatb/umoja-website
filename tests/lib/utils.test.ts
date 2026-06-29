import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (clsx + tailwind-merge wrapper)", () => {
  it("returns an empty string when given no input", () => {
    expect(cn()).toBe("");
  });

  it("joins multiple string arguments with single spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("flattens arrays of class values", () => {
    expect(cn(["a", "b"], ["c"])).toBe("a b c");
  });

  it("skips falsy values (false, null, undefined, '')", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("includes truthy keys from object syntax (clsx pass-through)", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("merges conflicting Tailwind utilities so the latest wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("preserves non-conflicting utilities together", () => {
    expect(cn("p-2", "m-2", "text-sm")).toBe("p-2 m-2 text-sm");
  });

  it("respects responsive prefixes when merging (only same breakpoint conflicts)", () => {
    // p-2 and md:p-4 do NOT conflict (different responsive context)
    expect(cn("p-2", "md:p-4")).toBe("p-2 md:p-4");
    // md:p-2 and md:p-4 DO conflict
    expect(cn("md:p-2", "md:p-4")).toBe("md:p-4");
  });

  it("does NOT dedupe non-conflicting identical strings (twMerge only resolves Tailwind conflicts)", () => {
    // This documents intentional behavior: cn is for Tailwind conflict
    // resolution, not generic string deduplication. Repeated identical
    // utilities like 'a a' pass through; only Tailwind family conflicts
    // (e.g. 'p-2' vs 'p-4') are merged.
    expect(cn("a", "a")).toBe("a a");
  });

  it("is stable when nested deeply", () => {
    expect(cn(["a", ["b", ["c"]]])).toBe("a b c");
  });
});
