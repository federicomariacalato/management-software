import type { OrderData, OrderItem } from "@/types/order.types";

export function makeItem(overrides: Partial<OrderItem> = {}): OrderItem {
  return {
    productId: 1,
    productName: "Extra Virgin Olive Oil",
    quantity: 1,
    unitPrice: 10,
    category: "Oil",
    ...overrides,
  };
}

export function makeOrder(overrides: Partial<OrderData> = {}): OrderData {
  return {
    customerName: "Mario Rossi",
    date: "2026-01-01",
    email: "mario@example.com",
    id: "a1b2c3",
    items: [makeItem()],
    itemsCount: 1,
    orderStatus: "processing",
    totalAmount: 10,
    ...overrides,
  };
}
