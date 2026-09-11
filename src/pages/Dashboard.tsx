import { SalesChart } from "@/components/dashboard/SalesChart";
import { KpiSection } from "@/components/dashboard/KpiSection";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="space-y-6">
        <KpiSection />
        <SalesChart />
      </div>
    </>
  );
}
