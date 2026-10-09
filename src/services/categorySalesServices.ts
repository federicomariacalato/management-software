import type { CategorySalesData } from "@/types/category-sales.types";
import { buildCategorySalesData } from "@/utils/categorySales";
import { getOrderData } from "./orderServices";

export async function getCategorySalesData(): Promise<CategorySalesData[]> {
  const orders = await getOrderData();
  return buildCategorySalesData(orders);
}
