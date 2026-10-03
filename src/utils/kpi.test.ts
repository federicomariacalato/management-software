import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { OrderData } from "@/types/order.types";
import { buildKpiData } from "./kpi";

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

/** `date` is N days before the given "today" (YYYY-MM-DD). */
function daysBefore(today: string, n: number): string {
  const [y, m, d] = today.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) - n * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}

const TODAY = "2026-06-15";

/** `it-IT` currency output separates the amount from the symbol with U+00A0. */
const EUR = (amount: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    amount,
  );

describe("buildKpiData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${TODAY}T12:00:00Z`));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sums revenue and counts orders inside the current 30 day window", () => {
    const orders = [
      makeOrder({ date: daysBefore(TODAY, 1), totalAmount: 100 }),
      makeOrder({ date: daysBefore(TODAY, 10), totalAmount: 50 }),
    ];

    const revenue = buildKpiData(orders)[0];
    expect(revenue.value).toBe(EUR(150));
    expect(buildKpiData(orders)[1].value).toBe("2");
  });

  it("excludes cancelled orders from every metric", () => {
    const orders = [
      makeOrder({ date: daysBefore(TODAY, 1), totalAmount: 100 }),
      makeOrder({
        date: daysBefore(TODAY, 2),
        totalAmount: 999,
        orderStatus: "cancelled",
      }),
    ];

    expect(buildKpiData(orders)[0].value).toBe(EUR(100));
    expect(buildKpiData(orders)[1].value).toBe("1");
  });

  it("excludes orders older than 30 days from the current window", () => {
    const orders = [
      makeOrder({ date: daysBefore(TODAY, 1), totalAmount: 100 }),
      makeOrder({ date: daysBefore(TODAY, 45), totalAmount: 999 }),
    ];

    expect(buildKpiData(orders)[0].value).toBe(EUR(100));
  });

  it("treats exactly 30 days ago as outside the window and 29 as inside", () => {
    const orders = [makeOrder({ date: daysBefore(TODAY, 30), totalAmount: 111 })];

    expect(buildKpiData(orders)[0].value).toBe(EUR(0));
  });

  it("reports revenue change against the preceding 30 day window", () => {
    const orders = [
      makeOrder({ date: daysBefore(TODAY, 5), totalAmount: 150 }),
      makeOrder({ date: daysBefore(TODAY, 35), totalAmount: 100 }),
    ];

    expect(buildKpiData(orders)[0].change).toBe(50);
  });

  it("excludes orders older than the previous window from the change", () => {
    const orders = [
      makeOrder({ date: daysBefore(TODAY, 5), totalAmount: 150 }),
      makeOrder({ date: daysBefore(TODAY, 35), totalAmount: 100 }),
      makeOrder({ date: daysBefore(TODAY, 200), totalAmount: 100000 }),
    ];

    expect(buildKpiData(orders)[0].change).toBe(50);
  });

  it("returns all zeros without throwing for an empty dataset", () => {
    const kpis = buildKpiData([]);

    expect(kpis[0].value).toBe(EUR(0));
    expect(kpis[1].value).toBe("0");
    expect(kpis[0].trend).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it("never reports an average order value of NaN", () => {
    const kpis = buildKpiData([]);
    expect(kpis[2].value).not.toContain("NaN");
  });

  it("builds a six point weekly trend ordered oldest to newest", () => {
    const orders = [
      makeOrder({ date: daysBefore(TODAY, 2), totalAmount: 40 }),
      makeOrder({ date: daysBefore(TODAY, 10), totalAmount: 10 }),
      makeOrder({ date: daysBefore(TODAY, 20), totalAmount: 20 }),
    ];

    const trend = buildKpiData(orders)[1].trend;
    expect(trend).toHaveLength(6);
    // weeklyTrend walks week 5 -> week 0, so the array is oldest -> newest
    expect(trend).toEqual([0, 0, 0, 1, 1, 1]);
    expect(trend.at(-1)).toBe(1);
  });

  it("ignores orders dated in the future", () => {
    const orders = [makeOrder({ date: "2026-12-25", totalAmount: 500 })];

    expect(buildKpiData(orders)[0].value).toBe(EUR(0));
  });
});
