import { KpiCard } from "@/components/dashboard/KpiCard";
import { useQuery } from "@tanstack/react-query";
import { getKpiData } from "@/services/kpiServices";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SalesChart } from "@/components/dashboard/SalesChart";

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["kpi"],
    queryFn: async () => getKpiData(),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full text-center">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <Button
          onClick={() => refetch()}
          variant="secondary"
          size="sm"
          className="mt-3 mx-auto min-w-96"
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {data.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>
      <div className="mt-6">
        <SalesChart />
      </div>
    </>
  );
}
