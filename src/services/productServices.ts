import { supabase } from "@/lib/supabaseClient";
import type { NewProduct, Product } from "@/types/product.types";

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

const PRODUCT_IMAGES_BUCKET_PATH = "/storage/v1/object/public/product-images/";

export async function deleteProduct(product: Product): Promise<void> {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id)
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

  // Remove the image from Storage, if it was uploaded there. The original
  // catalog images live in the storefront's public folder and are left alone.
  // The product is already deleted, so a failed cleanup is not reported.
  const imagePathIndex = product.image.indexOf(PRODUCT_IMAGES_BUCKET_PATH);
  if (imagePathIndex !== -1) {
    const imagePath = product.image.slice(
      imagePathIndex + PRODUCT_IMAGES_BUCKET_PATH.length,
    );
    await supabase.storage.from("product-images").remove([imagePath]);
  }
}

export async function createProduct(
  product: NewProduct,
  imageFile: File,
): Promise<void> {
  const extension = imageFile.name.split(".").at(-1)?.toLowerCase();
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, imageFile);

  if (uploadError) throw new Error("Unable to upload the product image");

  const { data: imageData } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  const { error } = await supabase
    .from("products")
    .insert({ ...product, image: imageData.publicUrl });

  if (error) {
    await supabase.storage.from("product-images").remove([path]);
    throw new Error("Unable to add product");
  }
}
