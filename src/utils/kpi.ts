import type { OrderData } from "@/types/order.types";
import type { KpiData, KpiResult } from "@/types/kpi.types";
import { formatCurrency } from "./currency";
import { percentChange } from "./percentChange";

function toUTCDays(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / (1000 * 60 * 60 * 24);
}

function daysAgo(dateStr: string, todayUTCDays: number): number {
  return todayUTCDays - toUTCDays(dateStr);
}

type PeriodStats = { revenue: number; count: number; avgOrderValue: number };

function periodStats(
  orders: OrderData[],
  todayUTCDays: number,
  minDaysAgo: number,
  maxDaysAgo: number,
): PeriodStats {
  const inPeriod = orders.filter((order) => {
    const age = daysAgo(order.date, todayUTCDays);
    return age >= minDaysAgo && age < maxDaysAgo;
  });
  const revenue = inPeriod.reduce((total, order) => total + order.totalAmount, 0);
  const count = inPeriod.length;
  return { revenue, count, avgOrderValue: count > 0 ? revenue / count : 0 };
}

export function buildKpiData(orders: OrderData[]): KpiData[] {
  const validOrders = orders.filter((order) => order.orderStatus !== "cancelled");
  const now = new Date();
  const todayUTCDays =
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) /
    (1000 * 60 * 60 * 24);

  const current = periodStats(validOrders, todayUTCDays, 0, 30);
  const previous = periodStats(validOrders, todayUTCDays, 30, 60);
  const weeklyTrend = (metric: keyof PeriodStats) => {
    const weeks: number[] = [];
    for (let week = 5; week >= 0; week--) {
      const stats = periodStats(validOrders, todayUTCDays, week * 7, (week + 1) * 7);
      weeks.push(Math.round(stats[metric]));
    }
    return weeks;
  };

  return [
    {
      label: "Revenue (30d)",
      value: formatCurrency(current.revenue),
      change: percentChange(current.revenue, previous.revenue),
      trend: weeklyTrend("revenue"),
    },
    {
      label: "Total Orders (30d)",
      value: String(current.count),
      change: percentChange(current.count, previous.count),
      trend: weeklyTrend("count"),
    },
    {
      label: "Average Order Value (30d)",
      value: formatCurrency(current.avgOrderValue),
      change: percentChange(current.avgOrderValue, previous.avgOrderValue),
      trend: weeklyTrend("avgOrderValue"),
    },
    {
      label: "Conversion Rate (30d)",
      value: "3,2%",
      change: percentChange(3.2, 3.2),
      trend: [3.0, 3.1, 2.9, 3.2, 3.1, 3.2],
    },
  ];
}

/**
 * Builds the KPI payload together with an explicit signal for the case where
 * the rolling 30-day window is completely empty. Without it the dashboard
 * renders four confident zeros (EUR 0, 0 orders, +0%) with no indication that
 * the data simply has nothing recent in it.
 */
export function buildKpiResult(orders: OrderData[]): KpiResult {
  const validOrders = orders.filter((order) => order.orderStatus !== "cancelled");
  const now = new Date();
  const todayUTCDays =
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) /
    (1000 * 60 * 60 * 24);

  const current = periodStats(validOrders, todayUTCDays, 0, 30);

  return {
    kpis: buildKpiData(orders),
    hasSalesInPeriod: current.count > 0,
  };
}

