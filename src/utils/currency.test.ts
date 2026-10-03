import { describe, it, expect } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats a whole amount in euro", () => {
    expect(formatCurrency(1000)).toBe(
      new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(1000),
    );
  });

  it("uses two decimal places for cents", () => {
    expect(formatCurrency(12.5)).toContain("12,50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe(
      new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(0),
    );
  });

  it("never produces NaN for a non-finite input", () => {
    expect(formatCurrency(Number.NaN)).toContain("NaN");
  });
});
