import type { OrderData, OrderStatus } from "@/types/order.types";
import { TableRow, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils/currency";
import { getStatusClassName, ORDER_STATUSES } from "@/utils/orderStatus";
import { Eye, WifiOff } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { buttonVariants } from "../ui/button";
import { formatOrderId } from "@/utils/orderId";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/services/orderServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OrderTableRowProps = {
  order: OrderData;
  variant?: "compact" | "full";
};

export function OrderTableRow({ order, variant }: OrderTableRowProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newStatus: OrderStatus) =>
      updateOrderStatus(order.id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <TableRow>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{formatOrderId(order.id)}</TableCell>
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
                <SheetTitle>Order {formatOrderId(order.id)}</SheetTitle>
                <SheetDescription>
                  {order.customerName} · {order.date}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4">
                <Label htmlFor={`status-${order.id}`}>Status</Label>
                <Select
                  value={order.orderStatus}
                  onValueChange={(status) => {
                    if (status) mutation.mutate(status);
                  }}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger id={`status-${order.id}`} className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {mutation.isPending && !mutation.isPaused && (
                  <span className="text-xs text-muted-foreground">
                    Saving...
                  </span>
                )}
                {mutation.isPending && mutation.isPaused && (
                  <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <WifiOff className="h-3.5 w-3.5 shrink-0" />
                    You’re offline. The change will be saved when you’re back
                    online.
                  </span>
                )}
                {mutation.isError && (
                  <span className="text-xs text-destructive">
                    {mutation.error.message}
                  </span>
                )}
              </div>
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
