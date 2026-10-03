import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { OrderData } from "@/types/order.types";
import { buildSalesData } from "./sales";

function makeOrder(overrides: Partial<OrderData> = {}): OrderData {
  return {
    customerName: "Test Customer",
    id: "#1",
    email: "test@example.com",
    date: "2026-01-01",
    itemsCount: 1,
    totalAmount: 100,
    orderStatus: "delivered",
    items: [],
    ...overrides,
  };
}

describe("buildSalesData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("always returns exactly twelve months", () => {
    expect(buildSalesData([])).toHaveLength(12);
  });

  it("ends with the current month and starts eleven months earlier", () => {
    const months = buildSalesData([]).map((m) => m.month);
    expect(months[11]).toBe("Jun");
    expect(months[0]).toBe("Jul");
  });

  it("places revenue in the month the order belongs to", () => {
    const sales = buildSalesData([
      makeOrder({ date: "2026-06-02", totalAmount: 250 }),
      makeOrder({ date: "2026-05-20", totalAmount: 100 }),
    ]);

    expect(sales[11]).toEqual({ month: "Jun", value: 250 });
    expect(sales[10]).toEqual({ month: "May", value: 100 });
  });

  it("excludes cancelled orders", () => {
    const sales = buildSalesData([
      makeOrder({ date: "2026-06-02", totalAmount: 250 }),
      makeOrder({ date: "2026-06-03", totalAmount: 999, orderStatus: "cancelled" }),
    ]);

    expect(sales[11]).toEqual({ month: "Jun", value: 250 });
  });

  it("aggregates several orders in the same month", () => {
    const sales = buildSalesData([
      makeOrder({ date: "2026-06-01", totalAmount: 10 }),
      makeOrder({ date: "2026-06-11", totalAmount: 20 }),
      makeOrder({ date: "2026-06-20", totalAmount: 30 }),
    ]);

    expect(sales[11].value).toBe(60);
  });

  it("reports zero for a month with no orders", () => {
    const sales = buildSalesData([
      makeOrder({ date: "2026-06-02", totalAmount: 250 }),
    ]);

    expect(sales[0].value).toBe(0);
  });

  it("ignores orders outside the twelve month window", () => {
    const sales = buildSalesData([
      makeOrder({ date: "2020-01-01", totalAmount: 999 }),
      makeOrder({ date: "2030-01-01", totalAmount: 999 }),
    ]);

    expect(sales.every((m) => m.value === 0)).toBe(true);
  });

  it("rolls the window back across a year boundary", () => {
    vi.setSystemTime(new Date("2026-02-15T12:00:00Z"));
    const sales = buildSalesData([]);

    expect(sales[11].month).toBe("Feb");
    expect(sales[0].month).toBe("Mar");
  });
});
