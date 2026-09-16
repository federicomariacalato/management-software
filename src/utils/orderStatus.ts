import type { OrderStatus } from "@/types/order.types";

export function getStatusClassName(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30";
    case "shipped":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30";
    case "processing":
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
  }
}

export const ORDER_STATUSES: OrderStatus[] = ["processing", "shipped", "delivered", "cancelled"];