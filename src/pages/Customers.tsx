import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCustomerData } from "@/services/customerServices";
import { QueryErrorState } from "@/components/dashboard/QueryErrorState";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currency";
import { getStatusClassName } from "@/utils/orderStatus";
import type { Customer } from "@/types/customer.types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatOrderId } from "@/utils/orderId";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "total spent" | "orders count" | "last order date"
  >("total spent");
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["orders", "customers"],
    queryFn: () => getCustomerData(),
  });
  const SORT_CUSTOMER_BY = ["total spent", "orders count", "last order date"];

  const SORT_FIELD: Record<typeof sortBy, keyof Customer> = {
    "total spent": "totalSpent",
    "orders count": "ordersCount",
    "last order date": "lastOrderDate",
  };

  const field = SORT_FIELD[sortBy];

  if (error) {
    return <QueryErrorState error={error} refetch={refetch} />;
  }

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const filteredCustomers = data.filter(
    (customer) =>
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  filteredCustomers.sort((a, b) => {
    if (a[field] > b[field]) return -1;
    if (a[field] < b[field]) return 1;
    return 0;
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 min-w-0">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer or email..."
            className="w-48"
          />
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value ?? "total spent")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort Filter" />
            </SelectTrigger>
            <SelectContent>
              {SORT_CUSTOMER_BY.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <span className="text-sm text-muted-foreground">
              Total Customers
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <span className="text-sm text-muted-foreground">Returning</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter((c) => c.ordersCount > 1).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <span className="text-sm text-muted-foreground">Avg. Spent</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                data.reduce((total, c) => total + c.totalSpent, 0) /
                  data.length,
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-md border mt-6">
        <Table className="[&_td]:py-4 [&_th]:py-4">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total spent</TableHead>
              <TableHead className="text-right">Last order</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.email}>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>
                  {customer.ordersCount > 1 ? (
                    <Badge variant="default">Returning</Badge>
                  ) : (
                    <Badge variant="secondary">New</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {customer.ordersCount}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(customer.totalSpent)}
                </TableCell>
                <TableCell className="text-right">
                  {customer.lastOrderDate}
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger
                      className={buttonVariants({
                        variant: "secondary",
                        size: "icon",
                      })}
                    >
                      <Eye />
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{customer.customerName}</SheetTitle>
                        <SheetDescription>{customer.email}</SheetDescription>
                      </SheetHeader>
                      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4">
                        {customer.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 px-3 py-3"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-mono text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                  {formatOrderId(order.id)}
                                </span>
                                <Badge
                                  className={getStatusClassName(
                                    order.orderStatus,
                                  )}
                                >
                                  {order.orderStatus}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {order.date}
                              </span>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                        ))}
                        <div className="mt-1 flex items-center justify-between rounded-xl bg-muted px-3 py-3 text-sm font-semibold">
                          <span>Total spent</span>
                          <span>{formatCurrency(customer.totalSpent)}</span>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
