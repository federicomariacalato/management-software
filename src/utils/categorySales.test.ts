import { describe, it, expect } from "vitest";
import { buildCategorySalesData } from "./categorySales";
import { makeOrder, makeItem } from "@/test/factories";

describe("buildCategorySalesData", () => {
  it("returns an empty array when there are no orders", () => {
    const result = buildCategorySalesData([]);
    expect(result).toEqual([]);
  });

  it("returns the category with its quantity when there is a single item", () => {
    const result = buildCategorySalesData([
      makeOrder({ items: [makeItem({ category: "Wine", quantity: 3 })] }),
    ]);
    expect(result).toEqual([{ category: "Wine", quantity: 3 }]);
  });

  it("excludes cancelled orders", () => {
    const result = buildCategorySalesData([
      makeOrder({
        orderStatus: "cancelled",
        items: [makeItem({ category: "Wine", quantity: 2 })],
      }),
      makeOrder({ items: [makeItem({ category: "Oil", quantity: 4 })] }),
    ]);
    expect(result).toEqual([{ category: "Oil", quantity: 4 }]);
  });

  it("sums quantities of the same category across different orders", () => {
    const result = buildCategorySalesData([
      makeOrder({ items: [makeItem({ category: "Wine", quantity: 2 })] }),
      makeOrder({ items: [makeItem({ category: "Wine", quantity: 3 })] }),
    ]);
    expect(result).toEqual([{ category: "Wine", quantity: 5 }]);
  });

  it("sums quantities of the same category within the same order", () => {
    const result = buildCategorySalesData([
      makeOrder({
        items: [
          makeItem({
            productName: "Vino rosso",
            category: "Wine",
            quantity: 2,
          }),
          makeItem({
            productName: "Vino bianco",
            category: "Wine",
            quantity: 3,
          }),
        ],
      }),
    ]);
    expect(result).toEqual([{ category: "Wine", quantity: 5 }]);
  });

  it("keeps different categories as separate entries", () => {
    const result = buildCategorySalesData([
      makeOrder({
        items: [
          makeItem({
            category: "Wine",
            quantity: 2,
          }),
          makeItem({
            category: "Oil",
            quantity: 4,
          }),
        ],
      }),
    ]);
    expect(result).toEqual([
      { category: "Wine", quantity: 2 },
      { category: "Oil", quantity: 4 },
    ]);
  });
});
