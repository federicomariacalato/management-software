import { supabase } from "@/lib/supabaseClient";
import type { OrderData, OrderStatus } from "@/types/order.types";
import { format } from "date-fns";

export async function getOrderData(): Promise<OrderData[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(category))")
    .order("created_at", { ascending: false });

  if (error)
    throw new Error(
      "Si è verificato un problema nel recupero degli ordini, riprova",
    );

  const orderData = data.map((order) => ({
    id: order.id,
    customerName: order.full_name,
    email: order.email,
    date: format(new Date(order.created_at), "yyyy-MM-dd"),
    totalAmount: order.total_amount,
    orderStatus: order.status,
    itemsCount: order.order_items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    items: order.order_items.map((item) => ({
      productName: item.name,
      productId: item.product_id,
      quantity: item.quantity,
      unitPrice: item.price,
      category: item.products.category,
    })),
  }));

  return orderData;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<void> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select();

  if (error) {
    throw new Error("Si è verificato un errore nella modifica dello stato");
  }

  if (data.length === 0) {
    throw new Error("Ordine non trovato o permessi insufficienti");
  }
}
