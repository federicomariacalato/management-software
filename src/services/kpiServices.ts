import kpiData from "@/data/kpi.json";
import type { KpiData } from "@/types/kpi.types";

export async function getKpiData(): Promise<KpiData[]> {
  return kpiData as KpiData[];
}

// export async function getKpiData(): Promise<KpiData[]> {
//   const response = await fetch("http://localhost:3000/api/kpi")
//   const data = await response.json()
//   return data as KpiData[]
// }
