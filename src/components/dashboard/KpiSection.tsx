import { getKpiData } from "@/services/kpiServices";
import { useQuery } from "@tanstack/react-query";
import { KpiCard } from "./KpiCard";
import { QueryErrorState } from "./QueryErrorState";

export function KpiSection() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["kpi"],
    queryFn: async () => getKpiData(),
  });

  if (error) {
    return <QueryErrorState error={error} refetch={refetch} />;
  }

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>
    </>
  );
}
