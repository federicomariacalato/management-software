import { SalesChart } from "@/components/dashboard/SalesChart";
import { KpiSection } from "@/components/dashboard/KpiSection";
import { CategorySalesChart } from "@/components/dashboard/CategorySalesChart";
import { OrdersSection } from "@/components/dashboard/OrdersSection";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-6">
        <KpiSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="lg:col-span-1">
            <CategorySalesChart />
          </div>
          <div className="lg:col-span-3">
            <OrdersSection />
          </div>
        </div>
      </div>
    </>
  );
}
