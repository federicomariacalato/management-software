import orderData from "@/data/order.json";
import type { OrderData } from "@/types/order.types";

export async function getOrderData(): Promise<OrderData[]> {
  return orderData as OrderData[];
}
