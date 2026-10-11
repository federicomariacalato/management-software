import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "../ui/table";
import type { Product } from "@/types/product.types";
import { ProductTableRow } from "./ProductTableRow";

type ProductsTableProps = {
  products: Product[];
};

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="rounded-md border">
      <Table className="[&_td]:py-4 [&_th]:py-4">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Availability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductTableRow product={product} key={product.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
