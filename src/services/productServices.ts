import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product.types";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error("Couldn't load products. Please try again.");

  return data;
}

export async function updateProductAvailability(
  productId: number,
  isAvailable: boolean,
): Promise<void> {
  const { data, error } = await supabase
    .from("products")
    .update({ is_available: isAvailable })
    .eq("id", productId)
    .select();

  if (error) {
    throw new Error("Couldn't update product availability. Please try again.");
  }

  if (data.length === 0) {
    throw new Error("Product not found or insufficient permissions.");
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .select();

  if (error?.code === "23503") {
    throw new Error(
      "This product appears in existing orders and can't be deleted. Mark it as out of stock instead.",
    );
  }

  if (error) {
    throw new Error("Couldn't delete the product. Please try again.");
  }

  if (data.length === 0) {
    throw new Error("Product not found or insufficient permissions.");
  }
}
