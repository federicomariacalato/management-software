import categorySalesData from "@/data/category-sales.json";
import type { CategorySalesData } from "@/types/category-sales.types";

export async function getCategorySalesData(): Promise<CategorySalesData[]> {
  return categorySalesData as CategorySalesData[];
}
