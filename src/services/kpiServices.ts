import { getOrderData } from "@/services/orderServices";
import { buildKpiResult } from "@/utils/kpi";
import type { KpiResult } from "@/types/kpi.types";

export async function getKpiData(): Promise<KpiResult> {
  const orders = await getOrderData();
  return buildKpiResult(orders);
}
