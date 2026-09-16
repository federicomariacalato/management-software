import type { OrderData } from "@/types/order.types";
import { TableRow, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils/currency";
import { getStatusClassName } from "@/utils/orderStatus";
import { Eye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { buttonVariants } from "../ui/button";

type OrderTableRowProps = {
  order: OrderData;
  variant?: "compact" | "full";
};

export function OrderTableRow({ order, variant }: OrderTableRowProps) {
  return (
    <TableRow>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{order.id}</TableCell>
      <TableCell>{order.email}</TableCell>
      <TableCell>{order.date}</TableCell>
      <TableCell className="text-right">{order.itemsCount}</TableCell>
      {variant === "full" && (
        <TableCell>
          <Sheet>
            <SheetTrigger
              className={buttonVariants({ variant: "secondary", size: "icon" })}
            >
              <Eye />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Order {order.id}</SheetTitle>
                <SheetDescription>
                  {order.customerName} · {order.date}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4">
                {order.items.map((o) => (
                  <div
                    key={o.productId}
                    className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 px-3 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-mono text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                          #{o.productId}
                        </span>
                        <span className="font-medium">{o.productName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Qty {o.quantity} × {formatCurrency(o.unitPrice)}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(o.unitPrice * o.quantity)}
                    </span>
                  </div>
                ))}
                <div className="mt-1 flex items-center justify-between rounded-xl bg-muted px-3 py-3 text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </TableCell>
      )}
      <TableCell className="text-right">
        {formatCurrency(order.totalAmount)}
      </TableCell>
      <TableCell className="text-right">
        <Badge className={getStatusClassName(order.orderStatus)}>
          {order.orderStatus}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
