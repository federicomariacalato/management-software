import { getKpiData } from "@/services/kpiServices";
import { useQuery } from "@tanstack/react-query";
import { KpiCard } from "./KpiCard";
import { QueryErrorState } from "./QueryErrorState";
import { Link } from "react-router-dom";

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

  if (!data.hasSalesInPeriod) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="font-medium">No orders in the last 30 days</p>
        <p className="mt-1 text-sm text-muted-foreground">
          There is nothing to compare against for this period. Older orders are
          still available on the{" "}
          <Link className="underline" to="/orders">
            Orders
          </Link>{" "}
          page.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.kpis.map((kpi) => (
        <KpiCard key={kpi.label} data={kpi} />
      ))}
    </div>
  );
}
