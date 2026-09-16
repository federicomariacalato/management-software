import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getOrderData } from "@/services/orderServices";
import { useQuery } from "@tanstack/react-query";
import { QueryErrorState } from "./QueryErrorState";
import { OrdersTable } from "../orders/OrdersTable";

export function OrdersSection() {
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
      <Card>
        <CardHeader>
          <span className="text-sm font-medium text-muted-foreground">
            Recent Orders
          </span>
        </CardHeader>
        <CardContent className="h-75">
          <OrdersTable orders={data} variant="compact" />
        </CardContent>
      </Card>
    </>
  );
}
