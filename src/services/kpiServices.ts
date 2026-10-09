import { getOrderData } from "@/services/orderServices";
import { buildKpiData } from "@/utils/kpi";
import type { KpiData } from "@/types/kpi.types";

export async function getKpiData(): Promise<KpiData[]> {
  const orders = await getOrderData();
  return buildKpiData(orders);
}
