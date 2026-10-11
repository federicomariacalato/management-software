import type { Product } from "@/types/product.types";
import { TableRow, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils/currency";
import { IdBadge } from "../shared/IdBadge";
import { RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductAvailability } from "@/services/productServices";
import { Switch } from "../ui/switch";

type ProductTableRowProps = {
  product: Product;
};

export function ProductTableRow({ product }: ProductTableRowProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (isAvailable: boolean) =>
      updateProductAvailability(product.id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <IdBadge>#{product.id}</IdBadge>
          <span className="font-medium">{product.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {product.category}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(product.price)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-3">
          {product.is_available ? (
            <Badge className="w-24 justify-center bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30">
              Available
            </Badge>
          ) : (
            <Badge className="w-24 justify-center bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
              Out of stock
            </Badge>
          )}
          <div className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2 py-1">
            <RefreshCw
              className={`h-3.5 w-3.5 ${product.is_available ? "text-primary" : "text-muted-foreground"}`}
              aria-hidden="true"
            />
            <Switch
              aria-label={`Toggle availability of ${product.name}`}
              checked={product.is_available}
              onCheckedChange={(isAvailable) => {
                mutation.mutate(isAvailable);
              }}
              disabled={mutation.isPending}
            />
          </div>
        </div>
        {mutation.error && (
          <p className="mt-1.5 text-xs text-destructive">
            {mutation.error.message}
          </p>
        )}
      </TableCell>
    </TableRow>
  );
}
