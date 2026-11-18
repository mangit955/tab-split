import { describe, expect, it } from "vitest";
import { computeTab, formatCents, parseBill } from "./tip";

describe("parseBill", () => {
  it("reads dollars and cents, with or without a dollar sign", () => {
    expect(parseBill("42")).toBe(4200);
    expect(parseBill("42.5")).toBe(4250);
    expect(parseBill(" $42.50 ")).toBe(4250);
  });

  it("refuses anything that is not an amount", () => {
    expect(parseBill("")).toBeNull();
    expect(parseBill("abc")).toBeNull();
    expect(parseBill("-5")).toBeNull();
    expect(parseBill("1.234")).toBeNull();
  });
});

describe("computeTab", () => {
  it("adds the tip to the bill", () => {
    expect(computeTab(12000, 20)).toEqual({ tipCents: 2400, totalCents: 14400 });
  });

  it("rounds the tip to the nearest cent", () => {
    expect(computeTab(1999, 15)).toEqual({ tipCents: 300, totalCents: 2299 });
  });
});

describe("formatCents", () => {
  it("prints two decimal places", () => {
    expect(formatCents(14400)).toBe("$144.00");
    expect(formatCents(5)).toBe("$0.05");
  });
});
