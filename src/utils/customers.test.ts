import { describe, it, expect } from "vitest";
import { buildCustomers } from "./customers";
import { makeOrder } from "@/test/factories";

describe("buildCustomers", () => {
  it("groups orders by email, not by customer name", () => {
    const result = buildCustomers([
      makeOrder({
        customerName: "Paolo Verdi",
        email: "paoloverdi@example.com",
      }),
      makeOrder({
        customerName: "Paolo Verdi",
        email: "giorgio@example.com",
      }),
    ]);
    expect(result).toMatchObject([
      { email: "paoloverdi@example.com" },
      { email: "giorgio@example.com" },
    ]);
  });

  it("merges orders with the same email into one customer", () => {
    const result = buildCustomers([
      makeOrder({
        customerName: "Mario Rossi",
        email: "mariorossi@example.com",
      }),
      makeOrder({
        customerName: "Paolo Verdi",
        email: "mariorossi@example.com",
      }),
    ]);
    expect(result).toMatchObject([
      { email: "mariorossi@example.com", ordersCount: 2 },
    ]);
  });

  it("sums totalAmount into totalSpent", () => {
    const result = buildCustomers([
      makeOrder({
        totalAmount: 20,
      }),
      makeOrder({
        totalAmount: 45,
      }),
    ]);
    expect(result).toMatchObject([{ totalSpent: 65 }]);
  });

  it("uses the most recent date as lastOrderDate", () => {
    const result = buildCustomers([
      makeOrder({
        date: "2026-06-27",
      }),
      makeOrder({ date: "2026-06-28" }),
      makeOrder({ date: "2026-06-26" }),
    ]);
    expect(result).toMatchObject([{ lastOrderDate: "2026-06-28" }]);
  });

  it("omits customers whose orders are all cancelled", () => {
    const result = buildCustomers([
      makeOrder({
        email: "paolo@example.com",
        orderStatus: "cancelled",
        totalAmount: 20,
      }),
      makeOrder({
        email: "giorgio@example.com",
        orderStatus: "delivered",
        totalAmount: 15,
      }),
    ]);
    expect(result).toMatchObject([
      {
        email: "giorgio@example.com",
        ordersCount: 1,
        totalSpent: 15,
      },
    ]);
  });

  it("excludes cancelled orders", () => {
    const result = buildCustomers([
      makeOrder({ orderStatus: "cancelled" }),
      makeOrder({ orderStatus: "delivered" }),
    ]);

    expect(result).toMatchObject([{ ordersCount: 1, totalSpent: 10 }]);
  });
});
