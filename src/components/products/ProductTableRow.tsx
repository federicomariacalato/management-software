import type { Product } from "@/types/product.types";
import { TableRow, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/utils/currency";
import { IdBadge } from "../shared/IdBadge";
import { RefreshCw, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  updateProductAvailability,
} from "@/services/productServices";
import { Switch } from "../ui/switch";
import { buttonVariants } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type ProductTableRowProps = {
  product: Product;
};

export function ProductTableRow({ product }: ProductTableRowProps) {
  const queryClient = useQueryClient();
  const availableMutation = useMutation({
    mutationFn: (isAvailable: boolean) =>
      updateProductAvailability(product.id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
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
                availableMutation.mutate(isAvailable);
              }}
              disabled={availableMutation.isPending}
            />
          </div>
        </div>
        {availableMutation.error && (
          <p className="mt-1.5 text-xs text-destructive">
            {availableMutation.error.message}
          </p>
        )}
      </TableCell>
      <TableCell className="text-right">
        <AlertDialog>
          <AlertDialogTrigger
            aria-label={`Delete ${product.name}`}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Trash2 className="text-destructive" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this product?</AlertDialogTitle>
              <AlertDialogDescription>
                "{product.name}" will be permanently removed from the catalog.
                This action can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {deleteMutation.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {deleteMutation.error.message}
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => deleteMutation.mutate(product.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
