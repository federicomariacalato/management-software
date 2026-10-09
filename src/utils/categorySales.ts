import type { CategorySalesData } from "@/types/category-sales.types";
import type { OrderData } from "@/types/order.types";

export function buildCategorySalesData(
  orders: OrderData[],
): CategorySalesData[] {
  const validOrders = orders.filter(
    (order) => order.orderStatus !== "cancelled",
  );
  const totals: Record<string, number> = {};

  for (const order of validOrders) {
    for (const item of order.items) {
      totals[item.category] = (totals[item.category] ?? 0) + item.quantity;
    }
  }

  return Object.entries(totals).map(([category, quantity]) => ({
    category,
    quantity,
  }));
}
