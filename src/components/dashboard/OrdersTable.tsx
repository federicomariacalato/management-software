import { useQuery } from "@tanstack/react-query";
import { getOrderData } from "@/services/orderServices";
import { QueryErrorState } from "./QueryErrorState";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { getStatusClassName } from "@/utils/orderStatus";
import { formatCurrency } from "@/utils/currency";

export function OrdersTable() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["order"],
    queryFn: async () => getOrderData(),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <QueryErrorState error={error} refetch={refetch} />;
  }
  return (
    <>
      <Card>
        <CardHeader>
          <span className="text-sm font-medium text-muted-foreground">
            Recent Orders
          </span>
        </CardHeader>
        <CardContent>
          <div className="max-h-75 overflow-y-auto rounded-md border">
            <Table noWrapper>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Id</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">
                      {order.itemsCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={getStatusClassName(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
