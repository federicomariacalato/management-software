import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getOrderData } from "@/services/orderServices";
import { useQuery } from "@tanstack/react-query";
import { QueryErrorState } from "./QueryErrorState";
import { OrdersTable } from "../orders/OrdersTable";
import { buildRecentOrders } from "@/utils/orders";
import { Link } from "react-router-dom";

const RECENT_ORDERS_LIMIT = 8;

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

  const recentOrders = buildRecentOrders(data, RECENT_ORDERS_LIMIT);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Recent Orders
        </span>
        <Link
          to="/orders"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          View all {data.length}
        </Link>
      </CardHeader>
      <CardContent className="h-75">
        <OrdersTable orders={recentOrders} variant="compact" />
      </CardContent>
    </Card>
  );
}
