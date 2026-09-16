import { QueryErrorState } from "@/components/dashboard/QueryErrorState";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { getOrderData } from "@/services/orderServices";
import { useQuery } from "@tanstack/react-query";

export default function Orders() {
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

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div>
        <OrdersTable orders={data} />
      </div>
    </>
  );
}
