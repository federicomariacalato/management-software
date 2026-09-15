export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type OrderData = {
  customerName: string;
  id: string;
  email: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
};
