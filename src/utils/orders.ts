import type { DateRange } from "react-day-picker";
import type { OrderData } from "@/types/order.types";

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function endOfLocalDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();
}

/**
 * Order dates are plain "YYYY-MM-DD" strings, so `new Date(order.date)` is parsed
 * as UTC midnight while `react-day-picker` hands back local midnight. Comparing the
 * two directly silently drops rows depending on the viewer's timezone.
 *
 * Both sides are therefore normalised to local day boundaries before comparing.
 */
export function isOrderInDateRange(
  order: OrderData,
  dateRange: DateRange | undefined,
): boolean {
  if (!dateRange?.from) return true;

  const orderTime = new Date(
    `${order.date}T00:00:00`,
  ).getTime();

  if (orderTime < startOfLocalDay(dateRange.from)) return false;
  if (dateRange.to && orderTime > endOfLocalDay(dateRange.to)) return false;

  return true;
}

export function isOrderMatchingSearch(
  order: OrderData,
  searchTerm: string,
): boolean {
  const term = searchTerm.trim().toLowerCase();
  if (term === "") return true;

  return (
    order.customerName.toLowerCase().includes(term) ||
    order.email.toLowerCase().includes(term) ||
    order.id.toLowerCase().includes(term)
  );
}

export function filterOrders(
  orders: OrderData[],
  filters: {
    status: OrderData["orderStatus"] | "all";
    search: string;
    dateRange: DateRange | undefined;
  },
): OrderData[] {
  return orders.filter(
    (order) =>
      (filters.status === "all" || order.orderStatus === filters.status) &&
      isOrderMatchingSearch(order, filters.search) &&
      isOrderInDateRange(order, filters.dateRange),
  );
}

/**
 * The N most recent orders for the dashboard widget.
 *
 * Sorted by date descending, so the widget does not depend on the order of the
 * source data, and returns at most `limit` rows.
 */
export function buildRecentOrders(
  orders: OrderData[],
  limit: number,
): OrderData[] {
  return [...orders]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}
