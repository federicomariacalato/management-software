import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "../ui/table";
import type { OrderData } from "@/types/order.types";
import { OrderTableRow } from "./OrderTableRow";

type OrdersTableProps = {
  orders: OrderData[];
  variant?: "compact" | "full";
};

export function OrdersTable({ orders, variant = "full" }: OrdersTableProps) {
  const wrapperClassName =
    variant === "compact"
      ? "max-h-75 overflow-y-auto rounded-md border"
      : "rounded-md border";
  const noWrapper = variant === "compact";
  const stickyHeader =
    variant === "compact" ? "sticky top-0 z-10 bg-muted" : "bg-muted";
  const cellPadding = variant === "compact" ? "" : "[&_td]:py-4 [&_th]:py-4";

  return (
    <>
      <div className={wrapperClassName}>
        <Table noWrapper={noWrapper} className={cellPadding}>
          <TableHeader className={stickyHeader}>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Order Id</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Items</TableHead>
              {variant === "full" && <TableHead className="text-right"></TableHead>}
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <OrderTableRow order={order} key={order.id} variant={variant}/>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
