import type { OrderData } from "@/types/order.types";
import type { SalesData } from "@/types/sales.types";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function getYearMonth(dateStr: string): { year: number; month: number } {
  const [year, month] = dateStr.split("-").map(Number);
  return { year, month: month - 1 };
}

function yearMonthKey(year: number, month: number): number {
  return year * 12 + month;
}

export function buildSalesData(orders: OrderData[]): SalesData[] {
  const now = new Date();

  const totalsByMonth = new Map<number, number>();
  for (const order of orders) {
    if (order.orderStatus === "cancelled") continue;
    const { year, month } = getYearMonth(order.date);
    const key = yearMonthKey(year, month);
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + order.totalAmount);
  }

  const months: SalesData[] = [];
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    months.push({
      month: MONTH_LABELS[month],
      value: Math.round(totalsByMonth.get(yearMonthKey(year, month)) ?? 0),
    });
  }

  return months;
}
