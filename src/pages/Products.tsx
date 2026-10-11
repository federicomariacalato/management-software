import { QueryErrorState } from "@/components/dashboard/QueryErrorState";
import { ProductsTable } from "@/components/products/ProductsTable";
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

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 min-w-0">
        <h1 className="text-2xl font-bold">Products</h1>
        <span className="text-sm text-muted-foreground">
          {data.length} products
        </span>
      </div>

      <ProductsTable products={data} />
    </>
  );
}
