import type { KpiData } from "@/types/kpi.types";
import kpiData from "@/data/kpi.json";
import { KpiCard } from "@/components/dashboard/KpiCard";

export default function Dashboard() {
  const data = kpiData as KpiData[];

  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>
    </>
  );
}
