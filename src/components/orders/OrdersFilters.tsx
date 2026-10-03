import type { OrderStatus } from "@/types/order.types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ORDER_STATUSES } from "@/utils/orderStatus";
import { Input } from "../ui/input";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { buttonVariants } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type OrdersFiltersProps = {
  status: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
  search: string;
  onSearchChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
};

export function OrdersFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 min-w-0">
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value ?? "all")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">all</SelectItem>
          {ORDER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label htmlFor="order-search" className="sr-only">
        Search orders by customer, email or order id
      </label>
      <Input
        id="order-search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search customer or email..."
        className="w-48"
      />
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "border-input",
          )}
          aria-label="Filter orders by date range"
        >
          <CalendarArrowDown aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
