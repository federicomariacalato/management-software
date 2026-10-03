import { describe, it, expect } from "vitest";
import type { OrderData } from "@/types/order.types";
import { buildRecentOrders } from "./orders";

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

describe("buildRecentOrders", () => {
  it("returns at most the requested number of orders", () => {
    const orders = Array.from({ length: 30 }, (_, i) =>
      makeOrder({ id: `#${i}`, date: `2026-01-${String(i + 1).padStart(2, "0")}` }),
    );

    expect(buildRecentOrders(orders, 8)).toHaveLength(8);
  });

  it("sorts by date descending", () => {
    const orders = [
      makeOrder({ id: "old", date: "2026-01-01" }),
      makeOrder({ id: "newest", date: "2026-03-01" }),
      makeOrder({ id: "middle", date: "2026-02-01" }),
    ];

    expect(buildRecentOrders(orders, 3).map((o) => o.id)).toEqual([
      "newest",
      "middle",
      "old",
    ]);
  });

  it("does not depend on the order of the source array", () => {
    const orders = [
      makeOrder({ id: "b", date: "2026-02-01" }),
      makeOrder({ id: "a", date: "2026-01-01" }),
      makeOrder({ id: "c", date: "2026-03-01" }),
    ];

    expect(buildRecentOrders(orders, 3).map((o) => o.id)).toEqual(["c", "b", "a"]);
  });

  it("does not mutate the source array", () => {
    const orders = [
      makeOrder({ id: "a", date: "2026-01-01" }),
      makeOrder({ id: "b", date: "2026-03-01" }),
    ];
    const before = orders.map((o) => o.id);

    buildRecentOrders(orders, 2);

    expect(orders.map((o) => o.id)).toEqual(before);
  });

  it("returns everything when fewer orders than the limit", () => {
    const orders = [makeOrder({ id: "a" }), makeOrder({ id: "b" })];

    expect(buildRecentOrders(orders, 8)).toHaveLength(2);
  });

  it("returns an empty array for no orders", () => {
    expect(buildRecentOrders([], 8)).toEqual([]);
  });

  it("keeps cancelled orders, since the widget reports order activity", () => {
    const orders = [
      makeOrder({ id: "old", date: "2026-01-01" }),
      makeOrder({ id: "cancelled", date: "2026-03-01", orderStatus: "cancelled" }),
    ];

    expect(buildRecentOrders(orders, 2).map((o) => o.id)).toEqual([
      "cancelled",
      "old",
    ]);
  });
});
