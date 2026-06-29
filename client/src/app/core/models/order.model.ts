export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  priceInKobo: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'paid' | 'cancelled';
  totalInKobo: number;
  paystackRef: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
}

export interface CreateOrderResponse {
  orderId: string;
  authorizationUrl: string;
}
