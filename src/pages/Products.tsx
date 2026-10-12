import { QueryErrorState } from "@/components/dashboard/QueryErrorState";
import { ProductsTable } from "@/components/products/ProductsTable";
import { NewProductSheet } from "@/components/products/NewProductSheet";
import { getProducts } from "@/services/productServices";
import { useQuery } from "@tanstack/react-query";

export default function Products() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  if (error) {
    return <QueryErrorState error={error} refetch={refetch} />;
  }

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const categories = [
    ...new Set(data.map((product) => product.category)),
  ].sort();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 min-w-0">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {data.length} products
          </span>
          <NewProductSheet categories={categories} />
        </div>
      </div>

      <ProductsTable products={data} />
    </>
  );
}
