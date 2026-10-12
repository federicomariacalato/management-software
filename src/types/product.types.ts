import type { Tables, TablesInsert } from "@/types/database.types";

export type NewProduct = Omit<TablesInsert<"products">, "image">;
export type Product = Tables<"products">;
