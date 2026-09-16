export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderData = {
  customerName: string;
  id: string;
  email: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  items: OrderItem[];
};
