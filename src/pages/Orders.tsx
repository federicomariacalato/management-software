import { QueryErrorState } from "@/components/dashboard/QueryErrorState";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { getOrderData } from "@/services/orderServices";
import { useQuery } from "@tanstack/react-query";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import type { OrderStatus } from "@/types/order.types";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { filterOrders } from "@/utils/orders";

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrderData(),
  });

  if (error) {
    return <QueryErrorState error={error} refetch={refetch} />;
  }

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  const filteredOrders = filterOrders(data, {
    status: statusFilter,
    search: searchTerm,
    dateRange,
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 min-w-0">
        <h1 className="text-2xl font-bold">Orders</h1>
        <OrdersFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          search={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <div>
        <OrdersTable orders={filteredOrders} />
      </div>
    </>
  );
}
