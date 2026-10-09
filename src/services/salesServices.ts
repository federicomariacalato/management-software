import { getOrderData } from "@/services/orderServices";
import { buildSalesData } from "@/utils/sales";
import type { SalesData } from "@/types/sales.types";

export async function getSalesData(): Promise<SalesData[]> {
  const orders = await getOrderData();
  return buildSalesData(orders);
}
