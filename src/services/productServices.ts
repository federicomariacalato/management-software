import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product.types";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error)
    throw new Error(
      "Si è verificato un problema nel recupero del catalogo, riprova",
    );

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
    throw new Error(
      "Si è verificato un errore nella modifica della disponibilità",
    );
  }

  if (data.length === 0) {
    throw new Error("Prodotto non trovato o permessi insufficienti");
  }
}
