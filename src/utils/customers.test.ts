import { describe, it, expect } from "vitest";
import type { OrderData } from "@/types/order.types";
import { buildCustomers } from "./customers";

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

describe("buildCustomers", () => {
  it("returns an empty list for no orders", () => {
    expect(buildCustomers([])).toEqual([]);
  });

  it("groups orders by email into a single customer", () => {
    const customers = buildCustomers([
      makeOrder({ id: "#1", email: "a@test.com", totalAmount: 10 }),
      makeOrder({ id: "#2", email: "a@test.com", totalAmount: 20 }),
      makeOrder({ id: "#3", email: "b@test.com", totalAmount: 5 }),
    ]);

    expect(customers).toHaveLength(2);
    expect(customers[0].ordersCount).toBe(2);
  });

  it("sums total spent across the customer's orders", () => {
    const [customer] = buildCustomers([
      makeOrder({ id: "#1", email: "a@test.com", totalAmount: 10 }),
      makeOrder({ id: "#2", email: "a@test.com", totalAmount: 20.5 }),
    ]);

    expect(customer.totalSpent).toBe(30.5);
  });

  it("reports the most recent order date", () => {
    const [customer] = buildCustomers([
      makeOrder({ id: "#1", email: "a@test.com", date: "2026-01-01" }),
      makeOrder({ id: "#2", email: "a@test.com", date: "2026-03-15" }),
      makeOrder({ id: "#3", email: "a@test.com", date: "2026-02-01" }),
    ]);

    expect(customer.lastOrderDate).toBe("2026-03-15");
  });

  it("excludes cancelled orders from counts and totals", () => {
    const [customer] = buildCustomers([
      makeOrder({ id: "#1", email: "a@test.com", totalAmount: 100 }),
      makeOrder({
        id: "#2",
        email: "a@test.com",
        totalAmount: 999,
        orderStatus: "cancelled",
      }),
    ]);

    expect(customer.ordersCount).toBe(1);
    expect(customer.totalSpent).toBe(100);
    expect(customer.orders).toHaveLength(1);
  });

  it("does not create a customer who only has cancelled orders", () => {
    expect(
      buildCustomers([
        makeOrder({ email: "a@test.com", orderStatus: "cancelled" }),
      ]),
    ).toEqual([]);
  });

  it("excludes a cancelled order from the last order date", () => {
    const [customer] = buildCustomers([
      makeOrder({ id: "#1", email: "a@test.com", date: "2026-01-01" }),
      makeOrder({
        id: "#2",
        email: "a@test.com",
        date: "2026-06-01",
        orderStatus: "cancelled",
      }),
    ]);

    expect(customer.lastOrderDate).toBe("2026-01-01");
  });

  it("handles a single order without dividing by zero", () => {
    const [customer] = buildCustomers([
      makeOrder({ id: "#1", email: "a@test.com", totalAmount: 42 }),
    ]);

    expect(customer.ordersCount).toBe(1);
    expect(customer.totalSpent).toBe(42);
  });
});
